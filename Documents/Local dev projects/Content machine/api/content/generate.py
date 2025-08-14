from http.server import BaseHTTPRequestHandler
import json
import os
import sys
from pathlib import Path

# Add the parent directory to Python path to import our modules
sys.path.append(str(Path(__file__).parent.parent.parent))

from services.content_generator import ContentGenerator

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Get request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            client_id = request_data.get('client_id')
            topics = request_data.get('topics', [])
            
            if not client_id or not topics:
                self.send_error_response(400, "Missing client_id or topics")
                return
            
            # Initialize content generator
            content_generator = ContentGenerator()
            
            # Generate content for each topic
            generated_content = []
            for topic in topics[:5]:  # Limit to top 5 topics
                try:
                    carousel_post = content_generator.generate_carousel_post(topic, client_id)
                    generated_content.append({
                        'topic': topic,
                        'carousel_post': carousel_post
                    })
                except Exception as e:
                    print(f"Error generating content for topic {topic.get('title', 'Unknown')}: {str(e)}")
                    # Continue with other topics
                    continue
            
            self.send_success_response({
                'generated_content': generated_content,
                'total_generated': len(generated_content),
                'client_id': client_id
            })
            
        except Exception as e:
            print(f"Error in content generation: {str(e)}")
            self.send_error_response(500, f"Internal server error: {str(e)}")
    
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
