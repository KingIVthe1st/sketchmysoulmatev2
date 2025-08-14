import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TrendingUp, Search, BarChart3, ArrowRight, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const TrendAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [topics, setTopics] = useState([]);
  const [clientData, setClientData] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    // Get client data from location state or localStorage
    if (location.state?.clientId && location.state?.clientData) {
      setClientId(location.state.clientId);
      setClientData(location.state.clientData);
    } else {
      const storedClientId = localStorage.getItem('currentClientId');
      const storedClient = localStorage.getItem('currentClient');
      if (storedClientId && storedClient) {
        setClientId(storedClientId);
        setClientData(JSON.parse(storedClient));
      } else {
        // Redirect to client setup if no client data
        navigate('/client-setup');
        return;
      }
    }
  }, [location.state, navigate]);

  const analyzeTrends = async () => {
    if (!clientId || !clientData) {
      toast.error('Client data not found. Please setup a client first.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/trends/analyze', {
        client_id: clientId,
        niche: clientData.niche
      });
      
      if (response.status === 200) {
        setTopics(response.data.topics);
        setAnalysisComplete(true);
        toast.success('Trend analysis completed successfully!');
      }
    } catch (error) {
      console.error('Error analyzing trends:', error);
      toast.error(error.response?.data?.error || 'Failed to analyze trends');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToContent = () => {
    if (topics.length > 0) {
      navigate('/content-generation', {
        state: {
          clientId,
          clientData,
          topics
        }
      });
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    return 'Fair';
  };

  if (!clientData) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading client data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Trend Analysis for {clientData.name}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Analyzing trending topics in <span className="font-semibold text-primary-600">{clientData.niche}</span> 
          to identify the most viral and relevant content opportunities.
        </p>
      </div>

      {/* Client Info Card */}
      <div className="card max-w-4xl mx-auto mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Client Details</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Niche:</span> {clientData.niche}</p>
              <p><span className="font-medium">Target Audience:</span> {clientData.target_audience}</p>
              <p><span className="font-medium">Tone of Voice:</span> {clientData.tone_of_voice}</p>
              <p><span className="font-medium">Goals:</span> {clientData.goals}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Analysis Status</h3>
            <div className="space-y-2">
              {analysisComplete ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span>Analysis Complete</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-gray-500">
                  <AlertCircle className="w-5 h-5" />
                  <span>Ready to Analyze</span>
                </div>
              )}
              <p className="text-sm text-gray-600">
                {topics.length > 0 ? `${topics.length} trending topics found` : 'No topics analyzed yet'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Button */}
      {!analysisComplete && (
        <div className="text-center mb-12">
          <button
            onClick={analyzeTrends}
            disabled={isLoading}
            className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>Analyzing Trends...</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-6 h-6" />
                <span>Start Trend Analysis</span>
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-3">
            This will analyze trending topics from news and social media sources
          </p>
        </div>
      )}

      {/* Results */}
      {topics.length > 0 && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Top Trending Topics
            </h2>
            <p className="text-lg text-gray-600">
              Ranked by virality and relevance to your client's niche
            </p>
          </div>

          <div className="grid gap-6">
            {topics.map((topic, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{topic.title}</h3>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">{topic.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {topic.keywords && topic.keywords.map((keyword, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          #{keyword}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Source: {topic.source}</span>
                      {topic.sentiment && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          topic.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                          topic.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {topic.sentiment}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="ml-6 text-right">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Virality Score</div>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(topic.virality_score)}`}>
                          {topic.virality_score}/10
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{getScoreLabel(topic.virality_score)}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Relevance Score</div>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(topic.relevance_score)}`}>
                          {topic.relevance_score}/10
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{getScoreLabel(topic.relevance_score)}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Overall Score</div>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(topic.overall_score)}`}>
                          {topic.overall_score}/10
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{getScoreLabel(topic.overall_score)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <div className="text-center pt-8">
            <button
              onClick={handleContinueToContent}
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 mx-auto"
            >
              <span>Generate Instagram Content</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Create engaging carousel posts for the top 5 trending topics
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-20">
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Trends</h3>
          <p className="text-gray-600">Searching news and social media for trending topics...</p>
        </div>
      )}
    </div>
  );
};

export default TrendAnalysis;
