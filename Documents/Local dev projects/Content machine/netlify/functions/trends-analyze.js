const axios = require('axios');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    const requestData = JSON.parse(event.body);
    const { client_id, niche } = requestData;

    if (!client_id || !niche) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing client_id or niche' })
      };
    }

    // Mock trending topics for now - in production you'd integrate with real APIs
    const mockTopics = [
      {
        title: `${niche} Industry Breakthrough: New Technology Emerges`,
        description: `Revolutionary developments in the ${niche} sector are creating new opportunities for businesses and consumers alike.`,
        source: 'Industry News',
        url: '#',
        virality_score: 85,
        relevance_score: 92,
        overall_score: 88.5,
        keywords: [niche, 'innovation', 'technology', 'breakthrough'],
        sentiment: 'positive'
      },
      {
        title: `${niche} Market Trends: What's Hot in 2024`,
        description: `The ${niche} market is experiencing significant growth with emerging trends that savvy entrepreneurs should watch.`,
        source: 'Market Analysis',
        url: '#',
        virality_score: 78,
        relevance_score: 95,
        overall_score: 86.5,
        keywords: [niche, 'market', 'trends', '2024', 'growth'],
        sentiment: 'positive'
      },
      {
        title: `${niche} Consumer Behavior: Changing Preferences`,
        description: `Recent studies show that ${niche} consumers are adapting to new digital solutions and sustainable practices.`,
        source: 'Consumer Research',
        url: '#',
        virality_score: 72,
        relevance_score: 88,
        overall_score: 80.0,
        keywords: [niche, 'consumer', 'behavior', 'digital', 'sustainable'],
        sentiment: 'neutral'
      }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        topics: mockTopics,
        total_found: mockTopics.length,
        client_id,
        niche
      })
    };

  } catch (error) {
    console.error('Error in trend analysis:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
