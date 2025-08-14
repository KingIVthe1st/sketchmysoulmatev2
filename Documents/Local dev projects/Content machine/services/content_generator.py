import openai
import os
import json
from typing import Dict, Any, List
import re

class ContentGenerator:
    """Service for generating Instagram carousel posts using AI"""
    
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    def generate_carousel_post(self, topic: Dict[str, Any], client: Any) -> Dict[str, Any]:
        """
        Generate Instagram carousel post content for a trending topic
        
        Args:
            topic: The trending topic to create content for
            client: Client object with preferences and goals
            
        Returns:
            Dictionary containing carousel post content
        """
        try:
            # Prepare prompt for content generation
            prompt = self._create_content_prompt(topic, client)
            
            # Generate content using OpenAI
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": """You are an expert social media content creator specializing in Instagram carousel posts. 
                        Create engaging, informative carousel content that follows Instagram best practices.
                        
                        Return your response as a JSON object with:
                        - main_title: Catchy title for the carousel
                        - slides: Array of 5-7 slides, each containing:
                          - slide_number: Slide number (1, 2, 3, etc.)
                          - title: Slide title (max 60 characters)
                          - content: Main content text (max 150 characters)
                          - call_to_action: Action item or tip
                          - hashtags: Array of 3-5 relevant hashtags
                        - caption: Engaging caption for the post
                        - overall_theme: Brief description of the carousel theme
                        
                        Make content engaging, educational, and aligned with the client's tone of voice."""
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=2500
            )
            
            content = response.choices[0].message.content
            generated_content = self._parse_content_response(content)
            
            # Add metadata
            generated_content['topic_title'] = topic.get('title', '')
            generated_content['client_name'] = client.name
            generated_content['generated_at'] = self._get_current_timestamp()
            
            return generated_content
            
        except Exception as e:
            print(f"Error generating content with AI: {e}")
            # Fallback to template-based generation
            return self._generate_fallback_content(topic, client)
    
    def _create_content_prompt(self, topic: Dict[str, Any], client: Any) -> str:
        """Create detailed prompt for content generation"""
        prompt = f"""
        Create an Instagram carousel post for the following trending topic:
        
        TOPIC: {topic.get('title', '')}
        DESCRIPTION: {topic.get('description', '')}
        VIRALITY SCORE: {topic.get('virality_score', 0)}/10
        RELEVANCE SCORE: {topic.get('relevance_score', 0)}/10
        
        CLIENT DETAILS:
        - Name: {client.name}
        - Niche: {client.niche}
        - Target Audience: {client.target_audience}
        - Tone of Voice: {client.tone_of_voice}
        - Goals: {client.goals}
        
        REQUIREMENTS:
        1. Create 5-7 engaging slides that educate and inform
        2. Use the client's tone of voice consistently
        3. Include actionable tips and insights
        4. Make it shareable and engaging
        5. Use relevant hashtags for discoverability
        6. Include a compelling caption that encourages engagement
        
        The carousel should provide value to the target audience while leveraging the trending topic's momentum.
        """
        return prompt
    
    def _parse_content_response(self, content: str) -> Dict[str, Any]:
        """Parse AI response to extract generated content"""
        try:
            # Try to extract JSON from the response
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                return json.loads(json_str)
            else:
                # Fallback parsing
                return self._fallback_content_parsing(content)
        except json.JSONDecodeError:
            print("Failed to parse AI response as JSON, using fallback parsing")
            return self._fallback_content_parsing(content)
    
    def _fallback_content_parsing(self, content: str) -> Dict[str, Any]:
        """Fallback parsing when JSON parsing fails"""
        # Extract main title
        title_match = re.search(r'Title[:\s]+(.+)', content, re.IGNORECASE)
        main_title = title_match.group(1).strip() if title_match else "Trending Topic Insights"
        
        # Extract slides
        slides = []
        slide_pattern = r'Slide\s*(\d+)[:\s]+(.+?)(?=Slide\s*\d+|Caption|$)' 
        slide_matches = re.findall(slide_pattern, content, re.DOTALL | re.IGNORECASE)
        
        for slide_num, slide_content in slide_matches:
            slide_lines = slide_content.strip().split('\n')
            slide_title = slide_lines[0][:60] if slide_lines else f"Slide {slide_num}"
            slide_content_text = ' '.join(slide_lines[1:])[:150] if len(slide_lines) > 1 else "Content for this slide"
            
            slides.append({
                'slide_number': int(slide_num),
                'title': slide_title,
                'content': slide_content_text,
                'call_to_action': "Learn more about this trend",
                'hashtags': ["trending", "insights", "tips"]
            })
        
        # Extract caption
        caption_match = re.search(r'Caption[:\s]+(.+)', content, re.IGNORECASE)
        caption = caption_match.group(1).strip() if caption_match else "Discover the latest trends and insights! 🔥"
        
        return {
            'main_title': main_title,
            'slides': slides,
            'caption': caption,
            'overall_theme': 'Trending topic insights and tips'
        }
    
    def _generate_fallback_content(self, topic: Dict[str, Any], client: Any) -> Dict[str, Any]:
        """Generate fallback content when AI generation fails"""
        title = topic.get('title', 'Trending Topic')
        
        # Create template-based slides
        slides = [
            {
                'slide_number': 1,
                'title': 'Trend Alert! 🚨',
                'content': f'Stay ahead of the curve with this trending topic in {client.niche}',
                'call_to_action': 'Keep reading to learn more',
                'hashtags': ['trending', client.niche.lower().replace(' ', ''), 'insights']
            },
            {
                'slide_number': 2,
                'title': 'Why This Matters',
                'content': 'Understanding trends helps you create relevant content that resonates with your audience',
                'call_to_action': 'Apply this to your strategy',
                'hashtags': ['strategy', 'content', 'audience']
            },
            {
                'slide_number': 3,
                'title': 'Key Insights',
                'content': 'Trends show what your audience is currently interested in and talking about',
                'call_to_action': 'Use these insights',
                'hashtags': ['insights', 'audience', 'engagement']
            },
            {
                'slide_number': 4,
                'title': 'Action Steps',
                'content': 'Create content around this trend to boost your engagement and reach',
                'call_to_action': 'Start creating now',
                'hashtags': ['action', 'create', 'engage']
            },
            {
                'slide_number': 5,
                'title': 'Stay Updated',
                'content': 'Follow industry leaders and set up alerts to never miss a trend again',
                'call_to_action': 'Set up your alerts',
                'hashtags': ['stayupdated', 'industry', 'leaders']
            }
        ]
        
        return {
            'main_title': f'🔥 {title[:40]}...',
            'slides': slides,
            'caption': f'🚨 Trending alert! Stay ahead in {client.niche} with these insights. What trends are you following? Share below! 👇',
            'overall_theme': 'Trending topic insights and actionable tips',
            'topic_title': title,
            'client_name': client.name,
            'generated_at': self._get_current_timestamp()
        }
    
    def _get_current_timestamp(self) -> str:
        """Get current timestamp as string"""
        from datetime import datetime
        return datetime.now().isoformat()
    
    def generate_weekly_content_plan(self, topics: List[Dict[str, Any]], client: Any) -> Dict[str, Any]:
        """
        Generate a weekly content plan with multiple carousel posts
        
        Args:
            topics: List of top trending topics
            client: Client object with preferences
            
        Returns:
            Weekly content plan with multiple posts
        """
        weekly_plan = {
            'client_name': client.name,
            'week_start': self._get_week_start(),
            'posts': []
        }
        
        # Generate content for top 5 topics
        for i, topic in enumerate(topics[:5]):
            post = self.generate_carousel_post(topic, client)
            post['scheduled_day'] = f"Day {i+1}"
            weekly_plan['posts'].append(post)
        
        return weekly_plan
    
    def _get_week_start(self) -> str:
        """Get the start of the current week"""
        from datetime import datetime, timedelta
        today = datetime.now()
        days_since_monday = today.weekday()
        monday = today - timedelta(days=days_since_monday)
        return monday.strftime('%Y-%m-%d')
