import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Target, MessageSquare, Goal, Save, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../services/api';

const ClientSetup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    target_audience: '',
    tone_of_voice: '',
    goals: ''
  });

  const toneOptions = [
    'Professional & Corporate',
    'Friendly & Approachable',
    'Casual & Conversational',
    'Authoritative & Expert',
    'Humorous & Playful',
    'Inspirational & Motivational',
    'Educational & Informative',
    'Luxury & Premium'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.niche || !formData.target_audience || !formData.tone_of_voice || !formData.goals) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiService.setupClient(formData);
      
      if (response.status === 201) {
        toast.success('Client setup successful!');
        // Store client ID in localStorage for future use
        localStorage.setItem('currentClientId', response.data.client_id);
        localStorage.setItem('currentClient', JSON.stringify(formData));
        
        // Navigate to trend analysis
        navigate('/trend-analysis', { 
          state: { 
            clientId: response.data.client_id,
            clientData: formData 
          } 
        });
      }
    } catch (error) {
      console.error('Error setting up client:', error);
      toast.error(error.response?.data?.error || 'Failed to setup client');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Setup Your Client Profile
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Tell us about your client so we can analyze trending topics and generate content that perfectly matches their brand and audience.
        </p>
      </div>

      <div className="card max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-primary-600" />
                <span>Client Name</span>
              </div>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter client or brand name"
              className="input-field"
              required
            />
          </div>

          {/* Niche */}
          <div>
            <label htmlFor="niche" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-primary-600" />
                <span>Industry/Niche</span>
              </div>
            </label>
            <input
              type="text"
              id="niche"
              name="niche"
              value={formData.niche}
              onChange={handleInputChange}
              placeholder="e.g., Digital Marketing, Health & Wellness, Technology"
              className="input-field"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Be specific about the industry or niche to get more relevant trending topics.
            </p>
          </div>

          {/* Target Audience */}
          <div>
            <label htmlFor="target_audience" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-primary-600" />
                <span>Target Audience</span>
              </div>
            </label>
            <textarea
              id="target_audience"
              name="target_audience"
              value={formData.target_audience}
              onChange={handleInputChange}
              placeholder="Describe your target audience (age, interests, profession, etc.)"
              rows="3"
              className="input-field"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Example: "Small business owners aged 25-45 interested in digital marketing and growth strategies"
            </p>
          </div>

          {/* Tone of Voice */}
          <div>
            <label htmlFor="tone_of_voice" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-primary-600" />
                <span>Brand Tone of Voice</span>
              </div>
            </label>
            <select
              id="tone_of_voice"
              name="tone_of_voice"
              value={formData.tone_of_voice}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select a tone of voice</option>
              {toneOptions.map((tone, index) => (
                <option key={index} value={tone}>{tone}</option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Choose the tone that best represents your client's brand personality.
            </p>
          </div>

          {/* Goals */}
          <div>
            <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Goal className="w-4 h-4 text-primary-600" />
                <span>Content Goals</span>
              </div>
            </label>
            <textarea
              id="goals"
              name="goals"
              value={formData.goals}
              onChange={handleInputChange}
              placeholder="What are your content goals? (brand awareness, lead generation, engagement, etc.)"
              rows="3"
              className="input-field"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Example: "Increase brand awareness, drive website traffic, and generate leads through educational content"
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Setting up client...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Setup Client & Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="mt-12 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Pro Tips for Better Results
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 text-left max-w-md mx-auto">
            <li>• Be specific about your niche to get more relevant trends</li>
            <li>• Describe your audience in detail for better content targeting</li>
            <li>• Choose a tone that matches your brand personality</li>
            <li>• Set clear content goals to guide the AI generation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClientSetup;
