from http.server import BaseHTTPRequestHandler
import json
import os
import sys
from pathlib import Path
import uuid
from datetime import datetime

# Add the parent directory to Python path to import our modules
sys.path.append(str(Path(__file__).parent.parent.parent))

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Get request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            # Validate required fields
            required_fields = ['name', 'niche', 'target_audience', 'tone_of_voice']
            for field in required_fields:
                if not request_data.get(field):
                    self.send_error_response(400, f"Missing required field: {field}")
                    return
            
            # Create client data
            client_data = {
                'id': str(uuid.uuid4()),
                'name': request_data['name'],
                'niche': request_data['niche'],
                'target_audience': request_data['target_audience'],
                'tone_of_voice': request_data['tone_of_voice'],
                'goals': request_data.get('goals', ''),
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            # In a serverless environment, we'll store this in memory for now
            # In production, you'd want to use a database or external storage
            self.send_success_response({
                'message': 'Client setup successful',
                'client': client_data,
                'status': 'created'
            }, 201)
            
        except Exception as e:
            print(f"Error in client setup: {str(e)}")
            self.send_error_response(500, f"Internal server error: {str(e)}")
    
    def send_success_response(self, data, status_code=200):
        self.send_response(status_code)
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
