// Debug script to test frontend fetch logic
async function testVoicesFetch() {
  const baseUrl = 'http://162.243.172.151';
  const endpoint = '/api/elevenlabs-voices';
  const fullUrl = baseUrl + endpoint;
  
  console.log('Testing voice fetch...');
  console.log('URL:', fullUrl);
  
  try {
    // Test different fetch configurations
    const tests = [
      { name: 'Basic fetch', options: {} },
      { name: 'With explicit headers', options: { 
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }},
      { name: 'With cache control', options: { 
        cache: 'no-cache',
        headers: { 'Cache-Control': 'no-cache' }
      }},
      { name: 'Relative path (as frontend does)', url: endpoint, options: {} }
    ];
    
    for (const test of tests) {
      console.log(`\n=== ${test.name} ===`);
      const url = test.url || fullUrl;
      console.log('Fetching:', url);
      
      try {
        const response = await fetch(url, test.options);
        console.log('Status:', response.status);
        console.log('OK:', response.ok);
        console.log('Headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
          const data = await response.json();
          console.log('Data structure:', {
            hasVoices: !!data.voices,
            voiceCount: data.voices?.length || 0,
            firstVoice: data.voices?.[0] ? {
              id: data.voices[0].voice_id,
              name: data.voices[0].name
            } : null
          });
        } else {
          const text = await response.text();
          console.log('Error response:', text);
        }
      } catch (error) {
        console.log('Fetch error:', error.message);
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
if (typeof window === 'undefined') {
  // Node.js environment
  const { fetch } = require('node-fetch');
  testVoicesFetch();
} else {
  // Browser environment
  testVoicesFetch();
}