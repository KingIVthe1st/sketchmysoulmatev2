const { v4: uuidv4 } = require('uuid');

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
    
    // Validate required fields
    const requiredFields = ['name', 'niche', 'target_audience', 'tone_of_voice'];
    for (const field of requiredFields) {
      if (!requestData[field]) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Missing required field: ${field}` })
        };
      }
    }

    // Create client data
    const clientData = {
      id: uuidv4(),
      name: requestData.name,
      niche: requestData.niche,
      target_audience: requestData.target_audience,
      tone_of_voice: requestData.tone_of_voice,
      goals: requestData.goals || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: 'Client setup successful',
        client: clientData,
        status: 'created'
      })
    };

  } catch (error) {
    console.error('Error in client setup:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
