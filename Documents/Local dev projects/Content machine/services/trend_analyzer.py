import openai
import os
import json
from typing import List, Dict, Any
import re

class TrendAnalyzer:
    """Service for analyzing and ranking trending topics using AI"""
    
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    def analyze_topics(self, topics: List[Dict[str, Any]], niche: str) -> List[Dict[str, Any]]:
        """
        Analyze trending topics and rank them by virality and relevance
        
        Args:
            topics: List of trending topics from various sources
            niche: The client's niche for relevance scoring
            
        Returns:
            List of analyzed and ranked topics
        """
        if not topics:
            return []
        
        # Prepare topics for AI analysis
        topics_text = self._prepare_topics_for_analysis(topics, niche)
        
        try:
            # Use OpenAI to analyze topics
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": """You are an expert trend analyst specializing in social media and content marketing. 
                        Your task is to analyze trending topics and score them based on:
                        1. Virality Score (0-10): How likely is this topic to go viral? Consider engagement potential, shareability, and current momentum.
                        2. Relevance Score (0-10): How relevant is this topic to the specified niche and target audience?
                        3. Overall Score: Average of virality and relevance scores.
                        
                        Return your analysis as a JSON array with each topic having:
                        - title: The topic title
                        - description: Brief description
                        - source: Where the topic was found
                        - virality_score: 0-10 score
                        - relevance_score: 0-10 score
                        - overall_score: Average of the two scores
                        - reasoning: Brief explanation of your scoring
                        - keywords: Array of relevant keywords
                        - sentiment: positive, negative, or neutral"""
                    },
                    {
                        "role": "user",
                        "content": f"Analyze these trending topics for the niche: {niche}\n\n{topics_text}"
                    }
                ],
                temperature=0.3,
                max_tokens=2000
            )
            
            # Parse AI response
            content = response.choices[0].message.content
            analyzed_topics = self._parse_ai_response(content)
            
            # Sort by overall score (highest first)
            analyzed_topics.sort(key=lambda x: x.get('overall_score', 0), reverse=True)
            
            return analyzed_topics
            
        except Exception as e:
            print(f"Error analyzing topics with AI: {e}")
            # Fallback to basic scoring
            return self._fallback_analysis(topics, niche)
    
    def _prepare_topics_for_analysis(self, topics: List[Dict[str, Any]], niche: str) -> str:
        """Prepare topics text for AI analysis"""
        topics_text = f"Analyze these trending topics for the niche: {niche}\n\n"
        
        for i, topic in enumerate(topics, 1):
            title = topic.get('title', 'No title')
            description = topic.get('description', 'No description')
            source = topic.get('source', 'Unknown source')
            
            topics_text += f"{i}. Title: {title}\n"
            topics_text += f"   Description: {description}\n"
            topics_text += f"   Source: {source}\n\n"
        
        return topics_text
    
    def _parse_ai_response(self, content: str) -> List[Dict[str, Any]]:
        """Parse AI response to extract analyzed topics"""
        try:
            # Try to extract JSON from the response
            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                return json.loads(json_str)
            else:
                # Fallback parsing
                return self._fallback_parsing(content)
        except json.JSONDecodeError:
            print("Failed to parse AI response as JSON, using fallback parsing")
            return self._fallback_parsing(content)
    
    def _fallback_parsing(self, content: str) -> List[Dict[str, Any]]:
        """Fallback parsing when JSON parsing fails"""
        topics = []
        lines = content.split('\n')
        current_topic = {}
        
        for line in lines:
            line = line.strip()
            if line.startswith('Title:'):
                if current_topic:
                    topics.append(current_topic)
                current_topic = {'title': line.replace('Title:', '').strip()}
            elif line.startswith('Description:'):
                current_topic['description'] = line.replace('Description:', '').strip()
            elif line.startswith('Source:'):
                current_topic['source'] = line.replace('Source:', '').strip()
            elif line.startswith('Virality Score:'):
                score = line.replace('Virality Score:', '').strip()
                current_topic['virality_score'] = float(score) if score.replace('.', '').isdigit() else 5.0
            elif line.startswith('Relevance Score:'):
                score = line.replace('Relevance Score:', '').strip()
                current_topic['relevance_score'] = float(score) if score.replace('.', '').isdigit() else 5.0
        
        if current_topic:
            topics.append(current_topic)
        
        # Add default scores if missing
        for topic in topics:
            if 'virality_score' not in topic:
                topic['virality_score'] = 5.0
            if 'relevance_score' not in topic:
                topic['relevance_score'] = 5.0
            if 'overall_score' not in topic:
                topic['overall_score'] = (topic['virality_score'] + topic['relevance_score']) / 2
        
        return topics
    
    def _fallback_analysis(self, topics: List[Dict[str, Any]], niche: str) -> List[Dict[str, Any]]:
        """Fallback analysis when AI analysis fails"""
        analyzed_topics = []
        
        for topic in topics:
            # Basic scoring based on title length and keywords
            title = topic.get('title', '').lower()
            description = topic.get('description', '').lower()
            niche_keywords = niche.lower().split()
            
            # Simple relevance scoring
            relevance_score = 0
            for keyword in niche_keywords:
                if keyword in title or keyword in description:
                    relevance_score += 2
            
            relevance_score = min(relevance_score, 10)
            
            # Simple virality scoring (based on title length and source)
            virality_score = 5.0  # Default score
            if len(title) > 50:  # Longer titles might be more engaging
                virality_score += 1
            if topic.get('source') in ['twitter', 'reddit']:  # Social sources
                virality_score += 2
            
            virality_score = min(virality_score, 10)
            
            analyzed_topic = {
                'title': topic.get('title', ''),
                'description': topic.get('description', ''),
                'source': topic.get('source', ''),
                'virality_score': virality_score,
                'relevance_score': relevance_score,
                'overall_score': (virality_score + relevance_score) / 2,
                'reasoning': 'Fallback analysis used',
                'keywords': niche_keywords,
                'sentiment': 'neutral'
            }
            
            analyzed_topics.append(analyzed_topic)
        
        # Sort by overall score
        analyzed_topics.sort(key=lambda x: x['overall_score'], reverse=True)
        return analyzed_topics
