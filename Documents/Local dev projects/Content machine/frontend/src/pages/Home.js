import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, FileText, BarChart3, Zap, Target, Sparkles } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'AI-Powered Trend Analysis',
      description: 'Discover trending topics in your niche using advanced AI algorithms that analyze news, social media, and industry data.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Target,
      title: 'Client-Centric Approach',
      description: 'Customize analysis for each client with specific niche, audience, and tone of voice requirements.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: FileText,
      title: 'Instagram Carousel Generation',
      description: 'Automatically create engaging Instagram carousel posts based on trending topics and client preferences.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: BarChart3,
      title: 'Performance Insights',
      description: 'Track virality scores, relevance metrics, and content performance to optimize your strategy.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Stay ahead of the curve with real-time trend monitoring and instant content generation.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Sparkles,
      title: 'Professional Quality',
      description: 'Generate high-quality, engaging content that matches your brand voice and resonates with your audience.',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Setup Client Profile',
      description: 'Input client details including niche, target audience, tone of voice, and goals.',
      icon: Users
    },
    {
      number: '02',
      title: 'Analyze Trends',
      description: 'AI analyzes trending topics from news and social media sources in your client\'s niche.',
      icon: TrendingUp
    },
    {
      number: '03',
      title: 'Generate Content',
      description: 'Create Instagram carousel posts for the top 5 trending topics with AI-powered content.',
      icon: FileText
    },
    {
      number: '04',
      title: 'Review & Deploy',
      description: 'Review generated content and deploy to Instagram with optimized captions and hashtags.',
      icon: BarChart3
    }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Master Trending Topics</span>
            <br />
            <span className="text-gray-800">with AI-Powered Insights</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover viral trends in your client's niche, analyze their potential, and generate engaging Instagram carousel posts automatically. 
            Stay ahead of the competition with real-time trend monitoring and AI-generated content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/client-setup" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/trend-analysis" className="btn-secondary text-lg px-8 py-3">
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 rounded-3xl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Content Creators
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to identify trending topics, analyze their potential, and create viral content for your clients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card group hover:shadow-xl transition-all duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four simple steps to transform trending topics into engaging Instagram content for your clients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-700">{step.number}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-purple-700 rounded-3xl text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Content Strategy?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join content creators who are already using AI to stay ahead of trends and create viral content for their clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/client-setup" className="bg-white text-primary-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Start Free Trial
            </Link>
            <Link to="/dashboard" className="border-2 border-white text-white hover:bg-white hover:text-primary-700 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
