#!/usr/bin/env node

/**
 * Test script for the fixed Music Moments API
 * Tests the complete song generation flow with enhanced error handling
 */

const http = require('http');

// Detect which port the server is running on
const testPorts = [3000, 3001, 3002];

const findRunningServer = async () => {
  for (const port of testPorts) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${port}/`, { timeout: 2000 }, (res) => {
          resolve(port);
        });
        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('timeout'));
        });
      });
      return port;
    } catch (e) {
      // Try next port
    }
  }
  throw new Error('No running server found on ports: ' + testPorts.join(', '));
};

const testAPI = async () => {
  console.log('🎵 Testing Music Moments API with Enhanced Debugging\n');
  
  try {
    console.log('🔍 Detecting running server...');
    const port = await findRunningServer();
    console.log(`✅ Found server running on port ${port}\n`);
    
    const baseUrl = `http://localhost:${port}`;
    
    // Test data
    const testData = {
      occasion: 'birthday',
      recipient: 'Sarah',
      relationship: 'wife',
      vibe: 'romantic',
      genre: 'acoustic',
      story: 'This is a test story for debugging the API. It needs to be at least 200 characters long to pass validation. Sarah is an amazing person who deserves the best birthday song ever created. This story should trigger all the logging we added.',
      lyrics: 'Happy birthday to you, my love',
      title: 'Debug Test Song',
      useAutoLyrics: false,
      selectedVoiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel (from the logs)
      selectedVoiceCategory: 'warm',
      emotion: 'happy',
      style: 'pop'
    };
    
    console.log('📤 Sending test request...');
    console.log('Request data:', {
      ...testData,
      story: testData.story.substring(0, 50) + '...',
      storyLength: testData.story.length
    });
    
    const startTime = Date.now();
    
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MusicMoments-Test/1.0'
      },
      body: JSON.stringify(testData)
    });
    
    const responseTime = Date.now() - startTime;
    
    console.log(`\n📥 Response received (${responseTime}ms):`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseData = await response.json();
    
    if (response.ok) {
      console.log('\n✅ SUCCESS! API Test Passed');
      console.log('Response data:', responseData);
      
      if (responseData.songId) {
        console.log('\n🔄 Testing status endpoint...');
        const statusResponse = await fetch(`${baseUrl}/api/status?songId=${responseData.songId}`);
        const statusData = await statusResponse.json();
        console.log('Status response:', statusData);
      }
    } else {
      console.log('\n❌ API Error Response:');
      console.log(JSON.stringify(responseData, null, 2));
      
      if (responseData.details && Array.isArray(responseData.details)) {
        console.log('\n🔍 Validation Errors:');
        responseData.details.forEach((detail, index) => {
          console.log(`  ${index + 1}. ${detail.field || 'unknown'}: ${detail.message || detail}`);
        });
      }
    }
    
  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Server not running. Start it with:');
      console.log('   npm run dev');
      console.log('   or');
      console.log('   npm run dev -- --port 3001');
    }
  }
};

// Run the test
testAPI();