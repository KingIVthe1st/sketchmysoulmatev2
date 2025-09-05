const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Eleven Labs API configuration
const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const ELEVEN_LABS_BASE_URL = 'https://api.elevenlabs.io/v1';

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Songgram Backend is running' });
});

// Generate music with Eleven Labs API
app.post('/api/generate-music', async (req, res) => {
  try {
    const { prompt, duration = 60, voiceId = 'pNInz6obpgDQGcFmaJgB' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!ELEVEN_LABS_API_KEY) {
      return res.status(500).json({ error: 'Eleven Labs API key not configured' });
    }

    // Create a musical prompt for the text-to-speech
    const musicPrompt = `[Music: ${prompt}] Create a ${duration}-second musical composition with vocals, instruments, and rhythm that captures the essence of: ${prompt}`;

    console.log('Generating music for prompt:', prompt);

    // Call Eleven Labs Text-to-Speech API
    const response = await axios.post(
      `${ELEVEN_LABS_BASE_URL}/text-to-speech/${voiceId}`,
      {
        text: musicPrompt,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.5,
          use_speaker_boost: true
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY
        },
        responseType: 'arraybuffer'
      }
    );

    // Convert response to base64 for frontend consumption
    const audioBuffer = Buffer.from(response.data);
    const audioBase64 = audioBuffer.toString('base64');

    res.json({
      success: true,
      audio: `data:audio/mpeg;base64,${audioBase64}`,
      prompt: prompt,
      duration: duration,
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating music:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to generate music',
      details: error.response?.data || error.message
    });
  }
});

// Get available voices
app.get('/api/voices', async (req, res) => {
  try {
    if (!ELEVEN_LABS_API_KEY) {
      return res.status(500).json({ error: 'Eleven Labs API key not configured' });
    }

    const response = await axios.get(`${ELEVEN_LABS_BASE_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVEN_LABS_API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching voices:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch voices',
      details: error.response?.data || error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Songgram Backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});