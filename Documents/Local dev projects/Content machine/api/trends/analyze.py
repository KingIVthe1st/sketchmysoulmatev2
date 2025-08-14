from http.server import BaseHTTPRequestHandler
import json
import os
import sys
from pathlib import Path

# Add the parent directory to Python path to import our modules
sys.path.append(str(Path(__file__).parent.parent.parent))

from services.trend_analyzer import TrendAnalyzer
from services.news_collector import NewsCollector
from services.social_collector import SocialCollector

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Get request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            client_id = request_data.get('client_id')
            niche = request_data.get('niche')
            
            if not client_id or not niche:
                self.send_error_response(400, "Missing client_id or niche")
                return
            
            # Initialize services
            news_collector = NewsCollector()
            social_collector = SocialCollector()
            trend_analyzer = TrendAnalyzer()
            
            # Collect trending topics
            news_topics = news_collector.get_trending_topics(niche)
            social_topics = social_collector.get_trending_topics(niche)
            
            # Combine and deduplicate topics
            all_topics = news_topics + social_topics
            unique_topics = self.deduplicate_topics(all_topics)
            
            # Analyze topics with AI
            analyzed_topics = trend_analyzer.analyze_topics(unique_topics, niche)
            
            # Sort by overall score
            analyzed_topics.sort(key=lambda x: x.get('overall_score', 0), reverse=True)
            
            # Return top 10 topics
            top_topics = analyzed_topics[:10]
            
            self.send_success_response({
                'topics': top_topics,
                'total_found': len(analyzed_topics),
                'client_id': client_id,
                'niche': niche
            })
            
        except Exception as e:
            print(f"Error in trend analysis: {str(e)}")
            self.send_error_response(500, f"Internal server error: {str(e)}")
    
    def deduplicate_topics(self, topics):
        """Remove duplicate topics based on title similarity"""
        seen_titles = set()
        unique_topics = []
        
        for topic in topics:
            title = topic.get('title', '').lower().strip()
            if title and title not in seen_titles:
                seen_titles.add(title)
                unique_topics.append(topic)
        
        return unique_topics
    
    def send_success_response(self, data):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({'error': message}).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
