#!/usr/bin/env node

/**
 * Comprehensive API testing suite for Music Moments
 * Tests functionality, error handling, edge cases, and performance
 */

class APITester {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  log(level, message, details = {}) {
    const icons = { info: '🔍', pass: '✅', fail: '❌' };
    console.log(`${icons[level]} [API-TEST] ${message}`, 
      Object.keys(details).length > 0 ? JSON.stringify(details, null, 2) : '');
  }

  async test(name, testFn) {
    try {
      this.log('info', `Running: ${name}`);
      await testFn();
      this.results.passed++;
      this.results.tests.push({ name, status: 'PASS' });
      this.log('pass', `PASSED: ${name}`);
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name, status: 'FAIL', error: error.message });
      this.log('fail', `FAILED: ${name}`, { error: error.message });
    }
  }

  async testServerHealth() {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error(`Server not responding: ${response.status}`);
    }
  }

  async testValidSongGeneration() {
    const validData = {
      occasion: 'birthday',
      recipient: 'Sarah',
      relationship: 'wife',
      vibe: 'romantic',
      genre: 'acoustic',
      story: 'This is a test story for our API testing suite. It contains exactly the minimum required characters to pass validation. Sarah is an amazing person who deserves the best birthday song ever created, filled with love and beautiful memories we share together.',
      lyrics: 'Happy birthday to you, my dear',
      title: 'Test Birthday Song',
      useAutoLyrics: false,
      selectedVoiceId: '21m00Tcm4TlvDq8ikWAM',
      selectedVoiceCategory: 'warm',
      emotion: 'happy',
      style: 'pop'
    };

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Valid request failed: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // Verify required response fields
    const requiredFields = ['songId', 'provider'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field in response: ${field}`);
      }
    }

    return data.songId;
  }

  async testStatusEndpoint(songId) {
    const response = await fetch(`${this.baseUrl}/api/status?songId=${songId}`);
    
    if (!response.ok) {
      throw new Error(`Status endpoint failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Should have status field
    if (!data.status) {
      throw new Error('Status response missing status field');
    }

    return data;
  }

  async testInvalidInputHandling() {
    const invalidInputs = [
      {
        name: 'Empty story',
        data: { story: '' },
        expectedStatus: 400
      },
      {
        name: 'Story too short',
        data: { story: 'Too short' },
        expectedStatus: 400
      },
      {
        name: 'Story too long',
        data: { story: 'X'.repeat(1000) },
        expectedStatus: 400
      },
      {
        name: 'Missing recipient',
        data: { recipient: '' },
        expectedStatus: 400
      },
      {
        name: 'Invalid vibe',
        data: { vibe: 'invalid_vibe' },
        expectedStatus: 400
      },
      {
        name: 'Invalid genre',
        data: { genre: 'invalid_genre' },
        expectedStatus: 400
      },
      {
        name: 'Missing voice ID',
        data: { selectedVoiceId: '' },
        expectedStatus: 400
      }
    ];

    const baseData = {
      occasion: 'birthday',
      recipient: 'Test User',
      relationship: 'friend',
      vibe: 'uplifting',
      genre: 'pop',
      story: 'A'.repeat(200),
      selectedVoiceId: '21m00Tcm4TlvDq8ikWAM',
      selectedVoiceCategory: 'warm'
    };

    for (const { name, data, expectedStatus } of invalidInputs) {
      const testData = { ...baseData, ...data };
      
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      if (response.status !== expectedStatus) {
        throw new Error(`${name}: Expected ${expectedStatus}, got ${response.status}`);
      }

      // Verify error response has proper structure
      const errorData = await response.json();
      if (!errorData.error) {
        throw new Error(`${name}: Missing error field in response`);
      }
    }
  }

  async testMalformedJSON() {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"invalid": json}'
    });

    if (response.ok) {
      throw new Error('Malformed JSON should return error');
    }
  }

  async testMissingContentType() {
    const validData = {
      occasion: 'birthday',
      recipient: 'Test',
      relationship: 'friend',
      vibe: 'uplifting',
      genre: 'pop',
      story: 'A'.repeat(200),
      selectedVoiceId: '21m00Tcm4TlvDq8ikWAM',
      selectedVoiceCategory: 'warm'
    };

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      // Omit Content-Type header
      body: JSON.stringify(validData)
    });

    // Should handle missing content type gracefully
    if (response.status >= 500) {
      throw new Error('Server error on missing content type');
    }
  }

  async testRequestTimeout() {
    // This test checks if the server can handle requests that might timeout
    const validData = {
      occasion: 'birthday',
      recipient: 'Test User',
      relationship: 'friend',
      vibe: 'uplifting',
      genre: 'pop',
      story: 'A'.repeat(200),
      selectedVoiceId: '21m00Tcm4TlvDq8ikWAM',
      selectedVoiceCategory: 'warm'
    };

    // Set a very short timeout to test timeout handling
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 100); // 100ms timeout

    try {
      await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validData),
        signal: controller.signal
      });
    } catch (error) {
      // AbortError is expected, any other error suggests improper handling
      if (error.name !== 'AbortError') {
        throw new Error(`Unexpected error on timeout: ${error.message}`);
      }
    }
  }

  async testConcurrentRequests() {
    const validData = {
      occasion: 'birthday',
      recipient: 'Test User',
      relationship: 'friend',
      vibe: 'uplifting',
      genre: 'pop',
      story: 'A'.repeat(200),
      selectedVoiceId: '21m00Tcm4TlvDq8ikWAM',
      selectedVoiceCategory: 'warm'
    };

    // Send 3 concurrent requests
    const requests = Array(3).fill().map((_, i) => 
      fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Request-ID': `concurrent-test-${i}`
        },
        body: JSON.stringify({ ...validData, recipient: `User${i}` })
      })
    );

    const responses = await Promise.all(requests);
    
    // Check that all requests were handled (even if some fail due to rate limiting)
    for (let i = 0; i < responses.length; i++) {
      if (responses[i].status >= 500) {
        throw new Error(`Concurrent request ${i} caused server error: ${responses[i].status}`);
      }
    }
  }

  async testLargePayload() {
    const largeStory = 'A'.repeat(500); // Maximum allowed story length
    const largeLyrics = 'B'.repeat(500); // Maximum allowed lyrics length
    
    const data = {
      occasion: 'birthday',
      recipient: 'Test User',
      relationship: 'friend',
      vibe: 'uplifting',
      genre: 'pop',
      story: largeStory,
      lyrics: largeLyrics,
      selectedVoiceId: '21m00Tcm4TlvDq8ikWAM',
      selectedVoiceCategory: 'warm'
    };

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok && response.status >= 500) {
      throw new Error(`Large payload caused server error: ${response.status}`);
    }
  }

  async testResponseTime() {
    const validData = {
      occasion: 'birthday',
      recipient: 'Test User',
      relationship: 'friend',
      vibe: 'uplifting',
      genre: 'pop',
      story: 'A'.repeat(200),
      selectedVoiceId: '21m00Tcm4TlvDq8ikWAM',
      selectedVoiceCategory: 'warm'
    };

    const startTime = Date.now();
    
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validData)
    });

    const responseTime = Date.now() - startTime;

    // API should respond within reasonable time (10 seconds)
    if (responseTime > 10000) {
      throw new Error(`Response time too slow: ${responseTime}ms`);
    }

    this.log('info', `Response time: ${responseTime}ms`);
  }

  async testProfanityFilter() {
    const profaneData = {
      occasion: 'birthday',
      recipient: 'Test User',
      relationship: 'friend',
      vibe: 'uplifting',
      genre: 'pop',
      story: 'This is a test with profanity shit and fuck that should be blocked.' + 'A'.repeat(140),
      selectedVoiceId: '21m00Tcm4TlvDq8ikWAM',
      selectedVoiceCategory: 'warm'
    };

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profaneData)
    });

    if (response.ok) {
      throw new Error('Profanity filter should have blocked the request');
    }

    const errorData = await response.json();
    if (!errorData.error.toLowerCase().includes('inappropriate')) {
      throw new Error('Profanity error message should mention inappropriate language');
    }
  }

  async runAllTests() {
    console.log('🧪 Starting API Test Suite for Music Moments\n');

    // Check if server is running
    try {
      await fetch(this.baseUrl);
    } catch (error) {
      console.log('❌ Server not running on', this.baseUrl);
      console.log('💡 Start server with: npm run dev\n');
      return;
    }

    let songId;

    await this.test('Server Health Check', () => this.testServerHealth());
    await this.test('Valid Song Generation', async () => {
      songId = await this.testValidSongGeneration();
    });
    await this.test('Status Endpoint', () => this.testStatusEndpoint(songId || 'test-id'));
    await this.test('Invalid Input Handling', () => this.testInvalidInputHandling());
    await this.test('Malformed JSON', () => this.testMalformedJSON());
    await this.test('Missing Content Type', () => this.testMissingContentType());
    await this.test('Request Timeout Handling', () => this.testRequestTimeout());
    await this.test('Concurrent Requests', () => this.testConcurrentRequests());
    await this.test('Large Payload Handling', () => this.testLargePayload());
    await this.test('Response Time', () => this.testResponseTime());
    await this.test('Profanity Filter', () => this.testProfanityFilter());

    // Print summary
    console.log('\n📊 API Test Results:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);
    
    if (this.results.failed > 0) {
      console.log('\n💥 Failed Tests:');
      this.results.tests
        .filter(test => test.status === 'FAIL')
        .forEach(test => console.log(`   • ${test.name}: ${test.error}`));
      
      console.log('\n🚨 API has functional issues - fix before deployment');
    } else {
      console.log('\n✅ All API tests passed - functionality is working correctly');
    }
  }
}

// Run tests
const tester = new APITester();
tester.runAllTests().catch(console.error);