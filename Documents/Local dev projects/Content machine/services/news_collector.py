import requests
import os
from typing import List, Dict, Any
from datetime import datetime, timedelta
import json
from newsapi import NewsApiClient
from gnews import GNews

class NewsCollector:
    """Service for collecting trending topics from news sources"""
    
    def __init__(self):
        # Initialize news APIs with free tier keys
        self.newsapi_key = os.getenv('NEWSAPI_KEY')
        self.gnews = GNews(language='en', country='US', max_results=20)
        
        # Fallback to NewsAPI if GNews fails
        if self.newsapi_key:
            self.newsapi = NewsApiClient(api_key=self.newsapi_key)
        else:
            self.newsapi = None
    
    def get_trending_topics(self, niche: str) -> List[Dict[str, Any]]:
        """
        Get trending topics from news sources for a specific niche
        
        Args:
            niche: The niche to search for trending topics
            
        Returns:
            List of trending topics with metadata
        """
        topics = []
        
        try:
            # Try GNews first (free tier)
            gnews_topics = self._get_gnews_topics(niche)
            topics.extend(gnews_topics)
            
            # Try NewsAPI if available
            if self.newsapi:
                newsapi_topics = self._get_newsapi_topics(niche)
                topics.extend(newsapi_topics)
            
            # Add fallback topics if no results
            if not topics:
                topics = self._get_fallback_topics(niche)
            
            # Remove duplicates and limit results
            unique_topics = self._deduplicate_topics(topics)
            return unique_topics[:15]  # Return top 15 topics
            
        except Exception as e:
            print(f"Error collecting news topics: {e}")
            return self._get_fallback_topics(niche)
    
    def _get_gnews_topics(self, niche: str) -> List[Dict[str, Any]]:
        """Get topics from GNews API"""
        try:
            # Search for niche-related news
            articles = self.gnews.get_news(niche)
            
            topics = []
            for article in articles:
                if article.get('title') and article.get('description'):
                    topic = {
                        'title': article['title'],
                        'description': article['description'],
                        'source': 'gnews',
                        'url': article.get('link', ''),
                        'published_at': article.get('published date', ''),
                        'relevance_score': self._calculate_relevance(article, niche)
                    }
                    topics.append(topic)
            
            return topics
            
        except Exception as e:
            print(f"Error with GNews API: {e}")
            return []
    
    def _get_newsapi_topics(self, niche: str) -> List[Dict[str, Any]]:
        """Get topics from NewsAPI"""
        try:
            if not self.newsapi:
                return []
            
            # Search for niche-related news from the last 7 days
            end_date = datetime.now()
            start_date = end_date - timedelta(days=7)
            
            response = self.newsapi.get_everything(
                q=niche,
                from_param=start_date.strftime('%Y-%m-%d'),
                to=end_date.strftime('%Y-%m-%d'),
                language='en',
                sort_by='popularity',
                page_size=20
            )
            
            topics = []
            for article in response.get('articles', []):
                if article.get('title') and article.get('description'):
                    topic = {
                        'title': article['title'],
                        'description': article['description'],
                        'source': 'newsapi',
                        'url': article.get('url', ''),
                        'published_at': article.get('publishedAt', ''),
                        'relevance_score': self._calculate_relevance(article, niche)
                    }
                    topics.append(topic)
            
            return topics
            
        except Exception as e:
            print(f"Error with NewsAPI: {e}")
            return []
    
    def _get_fallback_topics(self, niche: str) -> List[Dict[str, Any]]:
        """Get fallback topics when APIs fail"""
        # Generic trending topics that might be relevant
        fallback_topics = [
            {
                'title': f'Latest Trends in {niche} Industry',
                'description': f'Discover what\'s happening in the {niche} space and how it affects your business.',
                'source': 'fallback',
                'url': '',
                'published_at': datetime.now().isoformat(),
                'relevance_score': 8.0
            },
            {
                'title': f'{niche} Market Analysis and Insights',
                'description': f'Stay ahead of the curve with comprehensive analysis of {niche} market trends.',
                'source': 'fallback',
                'url': '',
                'published_at': datetime.now().isoformat(),
                'relevance_score': 7.5
            },
            {
                'title': f'Innovation in {niche}: What\'s Next?',
                'description': f'Explore the latest innovations and future predictions for the {niche} industry.',
                'source': 'fallback',
                'url': '',
                'published_at': datetime.now().isoformat(),
                'relevance_score': 7.0
            },
            {
                'title': f'{niche} Consumer Behavior Trends',
                'description': f'Understanding how consumer behavior is changing in the {niche} market.',
                'source': 'fallback',
                'url': '',
                'published_at': datetime.now().isoformat(),
                'relevance_score': 6.5
            },
            {
                'title': f'Digital Transformation in {niche}',
                'description': f'How technology is reshaping the {niche} landscape and what it means for businesses.',
                'source': 'fallback',
                'url': '',
                'published_at': datetime.now().isoformat(),
                'relevance_score': 6.0
            }
        ]
        
        return fallback_topics
    
    def _calculate_relevance(self, article: Dict[str, Any], niche: str) -> float:
        """Calculate relevance score for an article based on niche keywords"""
        title = article.get('title', '').lower()
        description = article.get('description', '').lower()
        niche_keywords = niche.lower().split()
        
        relevance_score = 0
        for keyword in niche_keywords:
            if keyword in title:
                relevance_score += 3
            if keyword in description:
                relevance_score += 2
        
        # Normalize score to 0-10 range
        return min(relevance_score, 10.0)
    
    def _deduplicate_topics(self, topics: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate topics based on title similarity"""
        unique_topics = []
        seen_titles = set()
        
        for topic in topics:
            title = topic.get('title', '').lower()
            
            # Check if similar title already exists
            is_duplicate = False
            for seen_title in seen_titles:
                if self._similarity_score(title, seen_title) > 0.8:
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                unique_topics.append(topic)
                seen_titles.add(title)
        
        return unique_topics
    
    def _similarity_score(self, title1: str, title2: str) -> float:
        """Calculate similarity between two titles using simple word overlap"""
        words1 = set(title1.split())
        words2 = set(title2.split())
        
        if not words1 or not words2:
            return 0.0
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union)
    
    def get_trending_keywords(self, niche: str) -> List[str]:
        """Get trending keywords related to the niche"""
        try:
            # Use GNews to get trending keywords
            articles = self.gnews.get_news(niche)
            
            keywords = []
            for article in articles[:10]:  # Analyze top 10 articles
                title_words = article.get('title', '').split()
                description_words = article.get('description', '').split()
                
                # Extract potential keywords (words with 4+ characters)
                potential_keywords = [word.lower() for word in title_words + description_words 
                                   if len(word) >= 4 and word.isalpha()]
                
                keywords.extend(potential_keywords)
            
            # Count frequency and return top keywords
            from collections import Counter
            keyword_counts = Counter(keywords)
            return [keyword for keyword, count in keyword_counts.most_common(10)]
            
        except Exception as e:
            print(f"Error getting trending keywords: {e}")
            return niche.split()  # Return niche words as fallback
