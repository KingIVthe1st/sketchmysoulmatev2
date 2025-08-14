from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
import json
from datetime import datetime, timedelta
import openai
from services.trend_analyzer import TrendAnalyzer
from services.content_generator import ContentGenerator
from services.news_collector import NewsCollector
from services.social_collector import SocialCollector
from models.client import Client
from models.trending_topic import TrendingTopic
from models.generated_content import GeneratedContent

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///trending_app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
CORS(app)

# Initialize OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

# Initialize services
trend_analyzer = TrendAnalyzer()
content_generator = ContentGenerator()
news_collector = NewsCollector()
social_collector = SocialCollector()

@app.route('/')
def index():
    """Main application page"""
    return render_template('index.html')

@app.route('/api/client/setup', methods=['POST'])
def setup_client():
    """Setup new client with niche and preferences"""
    try:
        data = request.json
        required_fields = ['name', 'niche', 'target_audience', 'tone_of_voice', 'goals']
        
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Create new client
        client = Client(
            name=data['name'],
            niche=data['niche'],
            target_audience=data['target_audience'],
            tone_of_voice=data['tone_of_voice'],
            goals=data['goals'],
            created_at=datetime.utcnow()
        )
        
        db.session.add(client)
        db.session.commit()
        
        return jsonify({
            'message': 'Client setup successful',
            'client_id': client.id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trends/analyze', methods=['POST'])
def analyze_trends():
    """Analyze trending topics for a specific client"""
    try:
        data = request.json
        client_id = data.get('client_id')
        niche = data.get('niche')
        
        if not client_id or not niche:
            return jsonify({'error': 'Client ID and niche are required'}), 400
        
        # Collect trending topics from multiple sources
        news_topics = news_collector.get_trending_topics(niche)
        social_topics = social_collector.get_trending_topics(niche)
        
        # Combine and analyze topics
        all_topics = news_topics + social_topics
        analyzed_topics = trend_analyzer.analyze_topics(all_topics, niche)
        
        # Store trending topics
        for topic in analyzed_topics[:10]:  # Top 10 topics
            trending_topic = TrendingTopic(
                client_id=client_id,
                title=topic['title'],
                description=topic['description'],
                source=topic['source'],
                virality_score=topic['virality_score'],
                relevance_score=topic['relevance_score'],
                overall_score=topic['overall_score'],
                created_at=datetime.utcnow()
            )
            db.session.add(trending_topic)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Trend analysis completed',
            'topics': analyzed_topics[:5]  # Return top 5 for content generation
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/content/generate', methods=['POST'])
def generate_content():
    """Generate Instagram carousel posts for trending topics"""
    try:
        data = request.json
        client_id = data.get('client_id')
        topics = data.get('topics', [])
        
        if not client_id or not topics:
            return jsonify({'error': 'Client ID and topics are required'}), 400
        
        # Get client details
        client = Client.query.get(client_id)
        if not client:
            return jsonify({'error': 'Client not found'}), 404
        
        # Generate content for each topic
        generated_posts = []
        for topic in topics[:5]:  # Generate for top 5 topics
            post_content = content_generator.generate_carousel_post(
                topic=topic,
                client=client
            )
            
            # Store generated content
            generated_content = GeneratedContent(
                client_id=client_id,
                topic_id=topic.get('id'),
                content_type='instagram_carousel',
                content=json.dumps(post_content),
                created_at=datetime.utcnow()
            )
            db.session.add(generated_content)
            
            generated_posts.append(post_content)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Content generation completed',
            'posts': generated_posts
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/client/<int:client_id>', methods=['GET'])
def get_client(client_id):
    """Get client details"""
    try:
        client = Client.query.get(client_id)
        if not client:
            return jsonify({'error': 'Client not found'}), 404
        
        return jsonify(client.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trends/<int:client_id>', methods=['GET'])
def get_client_trends(client_id):
    """Get trending topics for a specific client"""
    try:
        trends = TrendingTopic.query.filter_by(client_id=client_id).order_by(
            TrendingTopic.overall_score.desc()
        ).limit(10).all()
        
        return jsonify([trend.to_dict() for trend in trends]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/content/<int:client_id>', methods=['GET'])
def get_client_content(client_id):
    """Get generated content for a specific client"""
    try:
        content = GeneratedContent.query.filter_by(client_id=client_id).order_by(
            GeneratedContent.created_at.desc()
        ).limit(20).all()
        
        return jsonify([item.to_dict() for item in content]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
