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
    const { client_id, topics } = requestData;

    if (!client_id || !topics) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing client_id or topics' })
      };
    }

    // Generate Instagram carousel posts for each topic
    const generatedContent = topics.slice(0, 5).map((topic, index) => {
      const carouselPost = {
        slides: [
          {
            title: `Slide ${index + 1}: ${topic.title}`,
            content: `Key insights about ${topic.title.toLowerCase()}`,
            cta: 'Learn More',
            image_suggestion: 'Professional infographic style'
          },
          {
            title: 'Why This Matters',
            content: `Understanding ${topic.title.toLowerCase()} can help you stay ahead in your industry.`,
            cta: 'Get Started',
            image_suggestion: 'Data visualization chart'
          },
          {
            title: 'Take Action',
            content: `Ready to leverage these ${topic.title.toLowerCase()} insights?`,
            cta: 'Contact Us',
            image_suggestion: 'Call-to-action button style'
          }
        ],
        caption: `🚀 Exciting developments in ${topic.title.toLowerCase()}! Stay ahead of the curve with these insights. #${topic.keywords?.join(' #') || 'trending'} #innovation #growth`,
        hashtags: topic.keywords?.slice(0, 5) || ['trending', 'innovation', 'growth'],
        posting_schedule: `Day ${index + 1} of the week`
      };

      return {
        topic,
        carousel_post: carouselPost
      };
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        generated_content: generatedContent,
        total_generated: generatedContent.length,
        client_id
      })
    };

  } catch (error) {
    console.error('Error in content generation:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
