import requests
import os
from typing import List, Dict, Any
from datetime import datetime, timedelta
import json
import time
from bs4 import BeautifulSoup
import praw
import tweepy

class SocialCollector:
    """Service for collecting trending topics from social media platforms"""
    
    def __init__(self):
        # Initialize social media APIs with free tier keys
        self.reddit_client = self._init_reddit()
        self.twitter_client = self._init_twitter()
        
        # Headers for web scraping
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    
    def _init_reddit(self):
        """Initialize Reddit API client"""
        try:
            client_id = os.getenv('REDDIT_CLIENT_ID')
            client_secret = os.getenv('REDDIT_CLIENT_SECRET')
            user_agent = os.getenv('REDDIT_USER_AGENT', 'TrendingTopicsBot/1.0')
            
            if client_id and client_secret:
                return praw.Reddit(
                    client_id=client_id,
                    client_secret=client_secret,
                    user_agent=user_agent
                )
            return None
        except Exception as e:
            print(f"Error initializing Reddit client: {e}")
            return None
    
    def _init_twitter(self):
        """Initialize Twitter API client"""
        try:
            bearer_token = os.getenv('TWITTER_BEARER_TOKEN')
            api_key = os.getenv('TWITTER_API_KEY')
            api_secret = os.getenv('TWITTER_API_SECRET')
            
            if bearer_token:
                return tweepy.Client(bearer_token=bearer_token)
            elif api_key and api_secret:
                auth = tweepy.OAuthHandler(api_key, api_secret)
                return tweepy.API(auth)
            return None
        except Exception as e:
            print(f"Error initializing Twitter client: {e}")
            return None
    
    def get_trending_topics(self, niche: str) -> List[Dict[str, Any]]:
        """
        Get trending topics from social media platforms for a specific niche
        
        Args:
            niche: The niche to search for trending topics
            
        Returns:
            List of trending topics with metadata
        """
        topics = []
        
        try:
            # Collect from Reddit
            reddit_topics = self._get_reddit_topics(niche)
            topics.extend(reddit_topics)
            
            # Collect from Twitter
            twitter_topics = self._get_twitter_topics(niche)
            topics.extend(twitter_topics)
            
            # Collect from trending hashtags
            hashtag_topics = self._get_trending_hashtags(niche)
            topics.extend(hashtag_topics)
            
            # Add fallback topics if no results
            if not topics:
                topics = self._get_fallback_social_topics(niche)
            
            # Remove duplicates and limit results
            unique_topics = self._deduplicate_topics(topics)
            return unique_topics[:10]  # Return top 10 social topics
            
        except Exception as e:
            print(f"Error collecting social media topics: {e}")
            return self._get_fallback_social_topics(niche)
    
    def _get_reddit_topics(self, niche: str) -> List[Dict[str, Any]]:
        """Get trending topics from Reddit"""
        topics = []
        
        if not self.reddit_client:
            return topics
        
        try:
            # Search for niche-related subreddits and posts
            search_query = niche.replace(' ', '+')
            
            # Search in relevant subreddits
            relevant_subreddits = self._get_relevant_subreddits(niche)
            
            for subreddit_name in relevant_subreddits[:3]:  # Limit to top 3 subreddits
                try:
                    subreddit = self.reddit_client.subreddit(subreddit_name)
                    
                    # Get hot posts
                    for post in subreddit.hot(limit=5):
                        if post.score > 10:  # Only posts with decent engagement
                            topic = {
                                'title': post.title,
                                'description': post.selftext[:200] if post.selftext else f"Reddit post about {niche}",
                                'source': 'reddit',
                                'url': f"https://reddit.com{post.permalink}",
                                'engagement_score': post.score + post.num_comments,
                                'published_at': datetime.fromtimestamp(post.created_utc).isoformat(),
                                'relevance_score': self._calculate_social_relevance(post.title, niche)
                            }
                            topics.append(topic)
                    
                    time.sleep(1)  # Rate limiting
                    
                except Exception as e:
                    print(f"Error accessing subreddit {subreddit_name}: {e}")
                    continue
            
            # Also search across all subreddits
            search_results = self.reddit_client.subreddit('all').search(search_query, sort='hot', limit=5)
            for post in search_results:
                if post.score > 20:  # Higher threshold for general search
                    topic = {
                        'title': post.title,
                        'description': post.selftext[:200] if post.selftext else f"Reddit discussion about {niche}",
                        'source': 'reddit_search',
                        'url': f"https://reddit.com{post.permalink}",
                        'engagement_score': post.score + post.num_comments,
                        'published_at': datetime.fromtimestamp(post.created_utc).isoformat(),
                        'relevance_score': self._calculate_social_relevance(post.title, niche)
                    }
                    topics.append(topic)
            
        except Exception as e:
            print(f"Error collecting Reddit topics: {e}")
        
        return topics
    
    def _get_twitter_topics(self, niche: str) -> List[Dict[str, Any]]:
        """Get trending topics from Twitter"""
        topics = []
        
        if not self.twitter_client:
            return topics
        
        try:
            # Search for niche-related tweets
            search_query = niche
            
            if hasattr(self.twitter_client, 'search_recent_tweets'):
                # Twitter API v2
                tweets = self.twitter_client.search_recent_tweets(
                    query=search_query,
                    max_results=20,
                    tweet_fields=['created_at', 'public_metrics']
                )
                
                for tweet in tweets.data or []:
                    topic = {
                        'title': f"Twitter trend: {niche}",
                        'description': tweet.text[:200],
                        'source': 'twitter',
                        'url': f"https://twitter.com/user/status/{tweet.id}",
                        'engagement_score': self._calculate_twitter_engagement(tweet),
                        'published_at': tweet.created_at.isoformat(),
                        'relevance_score': self._calculate_social_relevance(tweet.text, niche)
                    }
                    topics.append(topic)
            
            elif hasattr(self.twitter_client, 'search_tweets'):
                # Twitter API v1.1
                tweets = self.twitter_client.search_tweets(
                    q=search_query,
                    count=20,
                    result_type='popular'
                )
                
                for tweet in tweets:
                    topic = {
                        'title': f"Twitter trend: {niche}",
                        'description': tweet.text[:200],
                        'source': 'twitter',
                        'url': f"https://twitter.com/user/status/{tweet.id}",
                        'engagement_score': tweet.favorite_count + tweet.retweet_count,
                        'published_at': tweet.created_at.isoformat(),
                        'relevance_score': self._calculate_social_relevance(tweet.text, niche)
                    }
                    topics.append(topic)
            
        except Exception as e:
            print(f"Error collecting Twitter topics: {e}")
        
        return topics
    
    def _get_trending_hashtags(self, niche: str) -> List[Dict[str, Any]]:
        """Get trending hashtags related to the niche"""
        topics = []
        
        try:
            # Use Twitter trending hashtags if available
            if self.twitter_client and hasattr(self.twitter_client, 'get_place_trends'):
                try:
                    # Get worldwide trends
                    trends = self.twitter_client.get_place_trends(1)  # 1 = worldwide
                    
                    for trend in trends[0]['trends'][:10]:
                        if self._is_relevant_hashtag(trend['name'], niche):
                            topic = {
                                'title': f"Trending hashtag: {trend['name']}",
                                'description': f"Trending hashtag related to {niche} with {trend['tweet_volume']} tweets",
                                'source': 'twitter_trends',
                                'url': trend['url'],
                                'engagement_score': trend['tweet_volume'] or 1000,
                                'published_at': datetime.now().isoformat(),
                                'relevance_score': self._calculate_social_relevance(trend['name'], niche)
                            }
                            topics.append(topic)
                except Exception as e:
                    print(f"Error getting Twitter trends: {e}")
            
            # Fallback: generate relevant hashtags
            if not topics:
                relevant_hashtags = self._generate_relevant_hashtags(niche)
                for hashtag in relevant_hashtags:
                    topic = {
                        'title': f"Relevant hashtag: {hashtag}",
                        'description': f"Popular hashtag in the {niche} space",
                        'source': 'generated',
                        'url': '',
                        'engagement_score': 500,
                        'published_at': datetime.now().isoformat(),
                        'relevance_score': 8.0
                    }
                    topics.append(topic)
            
        except Exception as e:
            print(f"Error collecting trending hashtags: {e}")
        
        return topics
    
    def _get_relevant_subreddits(self, niche: str) -> List[str]:
        """Get relevant subreddits for a niche"""
        # Common subreddit patterns for different niches
        niche_subreddits = {
            'technology': ['technology', 'programming', 'webdev', 'startups'],
            'marketing': ['marketing', 'socialmedia', 'entrepreneur', 'smallbusiness'],
            'health': ['health', 'fitness', 'nutrition', 'wellness'],
            'finance': ['personalfinance', 'investing', 'stocks', 'entrepreneur'],
            'education': ['education', 'learnprogramming', 'science', 'math'],
            'business': ['business', 'entrepreneur', 'smallbusiness', 'startups'],
            'lifestyle': ['lifestyle', 'selfimprovement', 'productivity', 'motivation']
        }
        
        # Find best matches
        for key, subreddits in niche_subreddits.items():
            if key in niche.lower():
                return subreddits
        
        # Default subreddits
        return ['all', 'trending', 'popular']
    
    def _calculate_social_relevance(self, text: str, niche: str) -> float:
        """Calculate relevance score for social media content"""
        text_lower = text.lower()
        niche_keywords = niche.lower().split()
        
        relevance_score = 0
        for keyword in niche_keywords:
            if keyword in text_lower:
                relevance_score += 2
        
        return min(relevance_score, 10.0)
    
    def _calculate_twitter_engagement(self, tweet) -> int:
        """Calculate engagement score for a tweet"""
        try:
            if hasattr(tweet, 'public_metrics'):
                metrics = tweet.public_metrics
                return metrics.get('retweet_count', 0) + metrics.get('like_count', 0) + metrics.get('reply_count', 0)
            elif hasattr(tweet, 'favorite_count'):
                return tweet.favorite_count + tweet.retweet_count
            else:
                return 100  # Default score
        except:
            return 100
    
    def _is_relevant_hashtag(self, hashtag: str, niche: str) -> bool:
        """Check if a hashtag is relevant to the niche"""
        hashtag_lower = hashtag.lower().replace('#', '')
        niche_keywords = niche.lower().split()
        
        for keyword in niche_keywords:
            if keyword in hashtag_lower:
                return True
        
        return False
    
    def _generate_relevant_hashtags(self, niche: str) -> List[str]:
        """Generate relevant hashtags for a niche"""
        base_hashtags = [
            f"#{niche.replace(' ', '')}",
            f"#{niche.replace(' ', '')}trends",
            f"#{niche.replace(' ', '')}tips",
            f"#{niche.replace(' ', '')}insights",
            f"#{niche.replace(' ', '')}news"
        ]
        
        return base_hashtags
    
    def _deduplicate_topics(self, topics: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate topics based on title similarity"""
        unique_topics = []
        seen_titles = set()
        
        for topic in topics:
            title = topic.get('title', '').lower()
            
            # Check if similar title already exists
            is_duplicate = False
            for seen_title in seen_titles:
                if self._similarity_score(title, seen_title) > 0.7:
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                unique_topics.append(topic)
                seen_titles.add(title)
        
        return unique_topics
    
    def _similarity_score(self, title1: str, title2: str) -> float:
        """Calculate similarity between two titles"""
        words1 = set(title1.split())
        words2 = set(title2.split())
        
        if not words1 or not words2:
            return 0.0
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union)
    
    def _get_fallback_social_topics(self, niche: str) -> List[Dict[str, Any]]:
        """Get fallback social media topics when APIs fail"""
        fallback_topics = [
            {
                'title': f'Social Media Trends in {niche}',
                'description': f'Discover what\'s trending on social media platforms in the {niche} space.',
                'source': 'fallback_social',
                'url': '',
                'engagement_score': 1000,
                'published_at': datetime.now().isoformat(),
                'relevance_score': 8.0
            },
            {
                'title': f'{niche} Viral Content Ideas',
                'description': f'Learn what type of content goes viral in the {niche} industry.',
                'source': 'fallback_social',
                'url': '',
                'engagement_score': 800,
                'published_at': datetime.now().isoformat(),
                'relevance_score': 7.5
            },
            {
                'title': f'Social Media Strategy for {niche}',
                'description': f'Effective social media strategies that work in the {niche} market.',
                'source': 'fallback_social',
                'url': '',
                'engagement_score': 600,
                'published_at': datetime.now().isoformat(),
                'relevance_score': 7.0
            }
        ]
        
        return fallback_topics
