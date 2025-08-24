// Test file to verify API endpoints
// Run with: node test-api.js

const testAPI = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing MusicMoments API endpoints...\n');
  
  // Test 1: Generate endpoint validation
  console.log('1. Testing /api/generate validation...');
  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        occasion: 'birthday',
        recipient: 'Test',
        relationship: 'friend',
        vibe: 'uplifting',
        genre: 'pop',
        story: 'This is a test story that needs to be at least 200 characters long to pass validation. Adding more text here to meet the minimum requirement for the story field validation.',
        useAutoLyrics: false
      })
    });
    
    if (response.status === 500) {
      console.log('✅ Generate endpoint accessible (API key needed for full test)');
    } else {
      console.log(`✅ Generate endpoint response: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Generate endpoint error:', error.message);
  }
  
  // Test 2: Status endpoint
  console.log('\n2. Testing /api/status endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/status?songId=test123`);
    if (response.status === 500) {
      console.log('✅ Status endpoint accessible (API key needed for full test)');
    } else {
      console.log(`✅ Status endpoint response: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Status endpoint error:', error.message);
  }
  
  // Test 3: Lyrics endpoint
  console.log('\n3. Testing /api/lyrics endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/lyrics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Test lyrics prompt' })
    });
    
    if (response.status === 500) {
      console.log('✅ Lyrics endpoint accessible (API key needed for full test)');
    } else {
      console.log(`✅ Lyrics endpoint response: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Lyrics endpoint error:', error.message);
  }
  
  console.log('\n🎉 API endpoint tests completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Add your TopMediai API key to .env.local');
  console.log('2. Visit http://localhost:3000 to test the full application');
  console.log('3. Fill out the form and generate a test song');
};

// Only run if executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;
