from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class GeneratedContent(db.Model):
    """Generated content model for storing AI-generated content"""
    __tablename__ = 'generated_content'
    
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('trending_topics.id'), nullable=True)
    content_type = db.Column(db.String(100), nullable=False)  # instagram_carousel, etc.
    content = db.Column(db.Text, nullable=False)  # JSON string of generated content
    status = db.Column(db.String(50), default='draft')  # draft, approved, published
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert generated content object to dictionary"""
        return {
            'id': self.id,
            'client_id': self.client_id,
            'topic_id': self.topic_id,
            'content_type': self.content_type,
            'content': self.content,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<GeneratedContent {self.content_type} for client {self.client_id}>'
