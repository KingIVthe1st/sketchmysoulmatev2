import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, FileText, BarChart3, Plus, Eye, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalTopics: 0,
    totalPosts: 0,
    recentActivity: []
  });
  const [recentClients, setRecentClients] = useState([]);
  const [recentTrends, setRecentTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd have an endpoint to get dashboard stats
      // For now, we'll simulate the data
      const mockStats = {
        totalClients: 3,
        totalTopics: 15,
        totalPosts: 8,
        recentActivity: [
          { type: 'client_added', message: 'New client "TechStart Inc" added', time: '2 hours ago' },
          { type: 'trends_analyzed', message: 'Trend analysis completed for "Digital Marketing"', time: '4 hours ago' },
          { type: 'content_generated', message: 'Instagram posts generated for "Health & Wellness"', time: '1 day ago' }
        ]
      };
      
      setStats(mockStats);
      
      // Mock recent clients
      const mockClients = [
        { id: 1, name: 'TechStart Inc', niche: 'Technology', created: '2024-01-15' },
        { id: 2, name: 'Wellness Co', niche: 'Health & Wellness', created: '2024-01-14' },
        { id: 3, name: 'Marketing Pro', niche: 'Digital Marketing', created: '2024-01-13' }
      ];
      setRecentClients(mockClients);
      
      // Mock recent trends
      const mockTrends = [
        { title: 'AI in Marketing', virality: 8.5, relevance: 9.0, source: 'news' },
        { title: 'Sustainable Business', virality: 7.8, relevance: 8.2, source: 'social' },
        { title: 'Remote Work Trends', virality: 8.2, relevance: 7.5, source: 'news' }
      ];
      setRecentTrends(mockTrends);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'client_added':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'trends_analyzed':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'content_generated':
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'client_added':
        return 'bg-blue-50 border-blue-200';
      case 'trends_analyzed':
        return 'bg-green-50 border-green-200';
      case 'content_generated':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Overview of your trending topics and content generation</p>
        </div>
        
        <button
          onClick={() => navigate('/client-setup')}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalClients}</h3>
          <p className="text-gray-600">Total Clients</p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalTopics}</h3>
          <p className="text-gray-600">Trending Topics</p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalPosts}</h3>
          <p className="text-gray-600">Generated Posts</p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">85%</h3>
          <p className="text-gray-600">Success Rate</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Clients */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Recent Clients</h3>
              <button
                onClick={() => navigate('/client-setup')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{client.name}</h4>
                    <p className="text-sm text-gray-600">{client.niche}</p>
                  </div>
                  <button
                    onClick={() => navigate('/trend-analysis', { state: { clientId: client.id } })}
                    className="btn-secondary text-sm px-3 py-1"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Trends */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Recent Trends</h3>
              <button
                onClick={() => navigate('/trend-analysis')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentTrends.map((trend, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{trend.title}</h4>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-600 font-medium">V: {trend.virality}</span>
                      <span className="text-blue-600 font-medium">R: {trend.relevance}</span>
                    </div>
                    <span className="text-gray-500 text-xs capitalize">{trend.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}>
                  <div className="flex items-start space-x-3">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-12">
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/client-setup')}
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors duration-200 text-center group"
            >
              <Users className="w-12 h-12 text-gray-400 group-hover:text-primary-600 mx-auto mb-4 transition-colors duration-200" />
              <h4 className="font-semibold text-gray-900 mb-2">Add New Client</h4>
              <p className="text-sm text-gray-600">Setup a new client profile and start analyzing trends</p>
            </button>
            
            <button
              onClick={() => navigate('/trend-analysis')}
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors duration-200 text-center group"
            >
              <TrendingUp className="w-12 h-12 text-gray-400 group-hover:text-primary-600 mx-auto mb-4 transition-colors duration-200" />
              <h4 className="font-semibold text-gray-900 mb-2">Analyze Trends</h4>
              <p className="text-sm text-gray-600">Discover trending topics for your existing clients</p>
            </button>
            
            <button
              onClick={() => navigate('/content-generation')}
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors duration-200 text-center group"
            >
              <FileText className="w-12 h-12 text-gray-400 group-hover:text-primary-600 mx-auto mb-4 transition-colors duration-200" />
              <h4 className="font-semibold text-gray-900 mb-2">Generate Content</h4>
              <p className="text-sm text-gray-600">Create Instagram carousel posts from trending topics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
