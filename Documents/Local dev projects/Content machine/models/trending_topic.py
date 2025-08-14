from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class TrendingTopic(db.Model):
    """Trending topic model for storing analyzed trending topics"""
    __tablename__ = 'trending_topics'
    
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    title = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text, nullable=False)
    source = db.Column(db.String(100), nullable=False)  # news, twitter, reddit, etc.
    url = db.Column(db.String(500), nullable=True)
    virality_score = db.Column(db.Float, nullable=False)
    relevance_score = db.Column(db.Float, nullable=False)
    overall_score = db.Column(db.Float, nullable=False)
    keywords = db.Column(db.Text, nullable=True)  # JSON string of keywords
    sentiment = db.Column(db.String(50), nullable=True)  # positive, negative, neutral
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert trending topic object to dictionary"""
        return {
            'id': self.id,
            'client_id': self.client_id,
            'title': self.title,
            'description': self.description,
            'source': self.source,
            'url': self.url,
            'virality_score': self.virality_score,
            'relevance_score': self.relevance_score,
            'overall_score': self.overall_score,
            'keywords': self.keywords,
            'sentiment': self.sentiment,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<TrendingTopic {self.title[:50]}...>'
