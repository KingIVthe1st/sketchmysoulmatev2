const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());
app.use(express.static('.next/static'));
app.use(express.static('public'));

// Store songs in memory (in production this would be a database)
global.songRequests = global.songRequests || new Map();

// API route handlers
app.get('/api/elevenlabs-voices', async (req, res) => {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'ElevenLabs API key not configured' });
    }

    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'xi-api-key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching ElevenLabs voices:', error);
    res.status(500).json({ error: 'Failed to fetch voices' });
  }
});

app.post('/api/generate', async (req, res) => {
  try {
    const formData = req.body;
    
    console.log('🎵 Received song generation request for:', formData.recipient);
    
    // Validate required fields
    if (!formData.occasion || !formData.recipient || !formData.relationship || !formData.story || !formData.selectedVoiceId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate unique song ID for tracking
    const songId = `song_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Mock response
    const mockResponse = {
      songId: songId,
      eta: 5,
      provider: 'ElevenLabs',
      processingTimeMs: Date.now()
    };
    
    // Store the request for status checking
    global.songRequests.set(songId, {
      ...formData,
      status: 'processing',
      submittedAt: Date.now()
    });
    
    // Simulate processing completion after 3 seconds
    setTimeout(() => {
      const request = global.songRequests.get(songId);
      if (request) {
        global.songRequests.set(songId, {
          ...request,
          status: 'completed',
          audioUrl: '/demo-song.mp3',
          completedAt: Date.now()
        });
      }
    }, 3000);
    
    console.log('✅ Song generation request submitted:', songId);
    res.json(mockResponse);
  } catch (error) {
    console.error('❌ Error in song generation:', error);
    res.status(500).json({ error: 'Failed to process song generation request' });
  }
});

app.get('/api/status', (req, res) => {
  try {
    const songId = req.query.songId;
    
    if (!songId) {
      return res.status(400).json({ error: 'Song ID is required' });
    }
    
    console.log(`🔍 Checking status for song: ${songId}`);
    
    const songData = global.songRequests.get(songId);
    
    if (!songData) {
      console.log(`❌ Song not found: ${songId}`);
      return res.status(404).json({ error: 'Song not found - it may have expired' });
    }
    
    if (songData.status === 'completed') {
      console.log(`✅ Song completed: ${songId}`);
      return res.json({
        status: 'completed',
        audioUrl: songData.audioUrl || null,
        audioData: songData.audioData || null,
        lyrics: songData.lyrics || null,
        voiceId: songData.selectedVoiceId,
        voiceCategory: songData.selectedVoiceCategory,
        voiceName: songData.voiceName || null
      });
    }
    
    // Check if processing has timed out
    const processingTime = Date.now() - songData.submittedAt;
    if (processingTime > 30000) {
      console.log(`⏰ Song timed out: ${songId}`);
      return res.json({
        status: 'error',
        error: 'Song generation timed out. Please try again.'
      });
    }
    
    // Still processing
    console.log(`⏳ Song still processing: ${songId} (${Math.round(processingTime / 1000)}s)`);
    res.json({
      status: 'processing',
      processingTime: processingTime
    });
  } catch (error) {
    console.error('❌ Error checking song status:', error);
    res.status(500).json({ error: 'Failed to check song status' });
  }
});

// Serve Next.js static files
app.get('*', (req, res) => {
  // Try to serve from .next/server/app if it exists (Next.js 13+ App Router)
  const nextPath = path.join(__dirname, '.next/server/app', req.path, 'index.html');
  const nextIndexPath = path.join(__dirname, '.next/server/app/index.html');
  const outPath = path.join(__dirname, 'out', req.path === '/' ? 'index.html' : req.path + '.html');
  const outIndexPath = path.join(__dirname, 'out/index.html');

  // Try different paths for serving the static files
  if (fs.existsSync(nextPath)) {
    res.sendFile(nextPath);
  } else if (fs.existsSync(nextIndexPath)) {
    res.sendFile(nextIndexPath);
  } else if (fs.existsSync(outPath)) {
    res.sendFile(outPath);
  } else if (fs.existsSync(outIndexPath)) {
    res.sendFile(outIndexPath);
  } else {
    res.status(404).send('Page not found');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SongGram Enhanced server running on port ${PORT}`);
  console.log('✨ Features: 11 musical genres, intelligent prompts, 1-minute songs');
});