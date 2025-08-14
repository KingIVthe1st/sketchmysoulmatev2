# TrendMaster - AI-Powered Trending Topics & Content Generator

A comprehensive web application that analyzes trending topics in your client's niche and generates engaging Instagram carousel posts using AI. Built with Python Flask backend and React frontend.

## 🚀 Features

### Core Functionality
- **Client Management**: Setup and manage multiple clients with specific niches and preferences
- **Trend Analysis**: AI-powered analysis of trending topics from news and social media
- **Content Generation**: Automatic creation of Instagram carousel posts
- **Virality Scoring**: Rank topics by potential virality and relevance
- **Multi-Source Data**: Collect trends from news APIs, Twitter, Reddit, and more

### Technical Features
- **Modern UI/UX**: Beautiful, responsive interface built with React and Tailwind CSS
- **AI Integration**: OpenAI GPT-4 for trend analysis and content generation
- **Free API Integration**: Uses free tiers of popular APIs where possible
- **Database Storage**: SQLite for development, PostgreSQL ready for production
- **RESTful API**: Clean backend architecture with comprehensive endpoints

## 🛠️ Technology Stack

### Backend
- **Python 3.8+** with Flask framework
- **SQLAlchemy** for database management
- **OpenAI API** for AI-powered analysis
- **Free News APIs**: NewsAPI.org, GNews
- **Social Media APIs**: Twitter, Reddit (free tiers)

### Frontend
- **React 18** with modern hooks
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for icons
- **Framer Motion** for animations

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- OpenAI API key
- (Optional) News API keys for enhanced functionality

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd trending-topics-app
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp env.example .env

# Edit .env with your API keys
# At minimum, you need OPENAI_API_KEY
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 4. Start Backend
```bash
# In another terminal, from project root
python app.py
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔑 API Keys Setup

### Required
- **OpenAI API Key**: Get from [OpenAI Platform](https://platform.openai.com/)
  - Required for trend analysis and content generation
  - Costs apply based on usage

### Optional (Free Tiers Available)
- **NewsAPI**: [newsapi.org](https://newsapi.org/) - Free tier: 100 requests/day
- **GNews**: [gnews.io](https://gnews.io/) - Free tier: 100 requests/day
- **Twitter API**: [developer.twitter.com](https://developer.twitter.com/) - Free tier available
- **Reddit API**: [reddit.com/dev/api](https://www.reddit.com/dev/api/) - Free tier available

## 📱 Usage Guide

### 1. Setup Client Profile
- Navigate to "Client Setup"
- Enter client name, niche, target audience, tone of voice, and goals
- Save client information

### 2. Analyze Trending Topics
- Go to "Trend Analysis"
- Select your client
- Click "Start Trend Analysis"
- AI will analyze news and social media for trending topics
- Review ranked topics by virality and relevance scores

### 3. Generate Instagram Content
- Proceed to "Content Generation"
- Click "Generate Instagram Posts"
- AI creates carousel posts for top 5 trending topics
- Each post includes 5-7 slides with titles, content, and captions
- Download individual posts or entire content plan

### 4. Dashboard Overview
- View statistics and recent activity
- Quick access to all features
- Monitor client performance

## 🏗️ Architecture

```
trending-topics-app/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── env.example           # Environment variables template
├── models/               # Database models
│   ├── client.py        # Client information
│   ├── trending_topic.py # Trending topics
│   └── generated_content.py # Generated content
├── services/             # Business logic services
│   ├── trend_analyzer.py # AI-powered trend analysis
│   ├── content_generator.py # Content generation
│   ├── news_collector.py # News API integration
│   └── social_collector.py # Social media integration
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   └── App.js        # Main app component
│   ├── package.json      # Node dependencies
│   └── tailwind.config.js # Tailwind configuration
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `NEWSAPI_KEY`: NewsAPI key for enhanced news collection
- `TWITTER_BEARER_TOKEN`: Twitter API v2 bearer token
- `REDDIT_CLIENT_ID`: Reddit API client ID
- `SECRET_KEY`: Flask secret key for security

### Database
- Default: SQLite (development)
- Production: PostgreSQL (update DATABASE_URL in .env)

## 🚀 Deployment Options

### Free Hosting Options
1. **Render**: Free tier for web services
2. **Railway**: Free tier for full-stack apps
3. **Vercel**: Free hosting for React frontend
4. **Netlify**: Free hosting for React frontend

### Production Considerations
- Use PostgreSQL instead of SQLite
- Set up proper environment variables
- Configure CORS for production domains
- Add rate limiting and security headers
- Set up monitoring and logging

## 📊 API Endpoints

### Client Management
- `POST /api/client/setup` - Create new client
- `GET /api/client/<id>` - Get client details

### Trend Analysis
- `POST /api/trends/analyze` - Analyze trending topics
- `GET /api/trends/<client_id>` - Get client trends

### Content Generation
- `POST /api/content/generate` - Generate Instagram posts
- `GET /api/content/<client_id>` - Get generated content

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔮 Future Enhancements

- **Scheduling**: Schedule posts for specific dates
- **Analytics**: Track post performance and engagement
- **Multi-Platform**: Support for TikTok, LinkedIn, etc.
- **Team Collaboration**: Multi-user access and permissions
- **Content Templates**: Pre-built templates for different industries
- **API Rate Limiting**: Better handling of API limits
- **Caching**: Implement Redis for better performance

## 🎯 Use Cases

- **Digital Marketing Agencies**: Create trending content for multiple clients
- **Social Media Managers**: Stay ahead of trends and generate engaging posts
- **Content Creators**: Leverage trending topics for viral content
- **Business Owners**: Understand industry trends and create relevant content
- **Influencers**: Capitalize on trending topics for engagement

---

**Built with ❤️ using modern web technologies and AI**
