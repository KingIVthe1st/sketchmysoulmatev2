import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Download, Copy, Instagram, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ContentGeneration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [clientData, setClientData] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [topics, setTopics] = useState([]);
  const [generationComplete, setGenerationComplete] = useState(false);

  useEffect(() => {
    // Get data from location state or localStorage
    if (location.state?.clientId && location.state?.clientData && location.state?.topics) {
      setClientId(location.state.clientId);
      setClientData(location.state.clientData);
      setTopics(location.state.topics);
    } else {
      // Try to get from localStorage
      const storedClientId = localStorage.getItem('currentClientId');
      const storedClient = localStorage.getItem('currentClient');
      if (storedClientId && storedClient) {
        setClientId(storedClientId);
        setClientData(JSON.parse(storedClient));
        // Redirect to trend analysis if no topics
        navigate('/trend-analysis');
        return;
      } else {
        navigate('/client-setup');
        return;
      }
    }
  }, [location.state, navigate]);

  const generateContent = async () => {
    if (!clientId || !topics.length) {
      toast.error('Client data or topics not found. Please analyze trends first.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/content/generate', {
        client_id: clientId,
        topics: topics.slice(0, 5) // Use top 5 topics
      });
      
      if (response.status === 200) {
        setGeneratedPosts(response.data.posts);
        setGenerationComplete(true);
        toast.success('Content generation completed successfully!');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error(error.response?.data?.error || 'Failed to generate content');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadPost = (post, index) => {
    const postData = {
      title: post.main_title,
      slides: post.slides,
      caption: post.caption,
      hashtags: post.slides.flatMap(slide => slide.hashtags || []),
      topic: post.topic_title,
      client: post.client_name,
      generated_at: post.generated_at
    };

    const blob = new Blob([JSON.stringify(postData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instagram-post-${index + 1}-${post.topic_title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Post downloaded successfully!');
  };

  const downloadAllPosts = () => {
    const allPostsData = {
      client: clientData,
      posts: generatedPosts,
      generated_at: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(allPostsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instagram-content-plan-${clientData.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('All posts downloaded successfully!');
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
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/trend-analysis')}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Trends</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Content Generation
          </h1>
          <p className="text-lg text-gray-600">
            AI-generated Instagram carousel posts for {clientData.name}
          </p>
        </div>
        
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {/* Client Info */}
      <div className="card max-w-4xl mx-auto mb-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Client</h3>
            <p className="text-gray-600">{clientData.name}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Niche</h3>
            <p className="text-gray-600">{clientData.niche}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Topics Analyzed</h3>
            <p className="text-gray-600">{topics.length} trending topics</p>
          </div>
        </div>
      </div>

      {/* Generation Button */}
      {!generationComplete && (
        <div className="text-center mb-12">
          <button
            onClick={generateContent}
            disabled={isLoading}
            className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>Generating Content...</span>
              </>
            ) : (
              <>
                <FileText className="w-6 h-6" />
                <span>Generate Instagram Posts</span>
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-3">
            AI will create engaging carousel posts for the top 5 trending topics
          </p>
        </div>
      )}

      {/* Generated Posts */}
      {generatedPosts.length > 0 && (
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Generated Instagram Posts
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {generatedPosts.length} carousel posts ready for your Instagram
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={downloadAllPosts}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download All Posts</span>
              </button>
            </div>
          </div>

          {generatedPosts.map((post, postIndex) => (
            <div key={postIndex} className="card">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{post.main_title}</h3>
                  <p className="text-gray-600">Based on: {post.topic_title}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadPost(post, postIndex)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Carousel Slides */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {post.slides && post.slides.map((slide, slideIndex) => (
                  <div key={slideIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="text-center mb-3">
                      <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold mx-auto">
                        {slide.slide_number}
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2 text-center">{slide.title}</h4>
                    <p className="text-gray-600 text-sm mb-3 text-center">{slide.content}</p>
                    
                    <div className="text-center mb-3">
                      <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        {slide.call_to_action}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 justify-center">
                      {slide.hashtags && slide.hashtags.map((hashtag, hashtagIndex) => (
                        <span key={hashtagIndex} className="text-xs text-gray-500">
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Caption */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Instagram Caption</h4>
                <div className="flex items-start justify-between">
                  <p className="text-gray-700 flex-1 mr-4">{post.caption}</p>
                  <button
                    onClick={() => copyToClipboard(post.caption)}
                    className="btn-secondary flex items-center space-x-2 flex-shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* Post Metadata */}
              <div className="text-sm text-gray-500 border-t pt-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium">Theme:</span> {post.overall_theme}
                  </div>
                  <div>
                    <span className="font-medium">Generated:</span> {new Date(post.generated_at).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Slides:</span> {post.slides ? post.slides.length : 0}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-20">
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Content</h3>
          <p className="text-gray-600">AI is creating engaging Instagram carousel posts...</p>
        </div>
      )}

      {/* Help Section */}
      {generationComplete && (
        <div className="mt-16 text-center">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              🎉 Content Generation Complete!
            </h3>
            <p className="text-green-800 mb-4">
              Your Instagram carousel posts are ready! Each post includes:
            </p>
            <ul className="text-sm text-green-800 space-y-1 text-left max-w-md mx-auto">
              <li>• 5-7 engaging slides with titles and content</li>
              <li>• Optimized captions for maximum engagement</li>
              <li>• Relevant hashtags for discoverability</li>
              <li>• Call-to-action elements for each slide</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGeneration;
