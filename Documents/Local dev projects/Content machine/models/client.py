from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Client(db.Model):
    """Client model for storing client information and preferences"""
    __tablename__ = 'clients'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    niche = db.Column(db.String(200), nullable=False)
    target_audience = db.Column(db.Text, nullable=False)
    tone_of_voice = db.Column(db.String(100), nullable=False)
    goals = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    trending_topics = db.relationship('TrendingTopic', backref='client', lazy=True)
    generated_content = db.relationship('GeneratedContent', backref='client', lazy=True)
    
    def to_dict(self):
        """Convert client object to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'niche': self.niche,
            'target_audience': self.target_audience,
            'tone_of_voice': self.tone_of_voice,
            'goals': self.goals,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Client {self.name}>'
