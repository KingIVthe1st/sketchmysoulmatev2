#!/usr/bin/env node

/**
 * Security-focused test suite for Music Moments API
 * Tests for XSS, injection attacks, rate limiting, and input validation
 */

const fetch = require('node-fetch').default || require('node-fetch');

class SecurityTester {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
  }

  log(level, message, details = {}) {
    const icons = {
      info: '🔍',
      pass: '✅',
      fail: '❌',
      warn: '⚠️'
    };
    
    console.log(`${icons[level]} [SECURITY] ${message}`, 
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

  async warn(name, message) {
    this.results.warnings++;
    this.results.tests.push({ name, status: 'WARN', message });
    this.log('warn', `WARNING: ${name}`, { message });
  }

  // XSS injection tests
  async testXSSInjection() {
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '"><script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      'javascript:alert("XSS")',
      '<svg onload=alert("XSS")>',
      '${alert("XSS")}',
      '<iframe src="javascript:alert(\'XSS\')"></iframe>'
    ];

    for (const payload of xssPayloads) {
      const testData = {
        occasion: 'birthday',
        recipient: 'Test User',
        relationship: 'friend',
        vibe: 'uplifting',
        genre: 'pop',
        story: 'A'.repeat(200) + payload,
        lyrics: payload,
        title: payload,
        useAutoLyrics: false,
        selectedVoiceId: '21m00Tcm4TlvDq8ikWAM',
        selectedVoiceCategory: 'warm'
      };

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      const data = await response.json();

      // Check if XSS payload is properly escaped in responses
      const responseText = JSON.stringify(data);
      if (responseText.includes('<script>') || responseText.includes('javascript:')) {
        throw new Error(`XSS payload not properly escaped: ${payload}`);
      }
    }
  }

  // SQL injection tests (for future database implementation)
  async testSQLInjection() {
    const sqlPayloads = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "' UNION SELECT * FROM admin_users --",
      "'; DELETE FROM songs; --",
      "' OR 1=1 --"
    ];

    for (const payload of sqlPayloads) {
      const testData = {
        occasion: 'birthday',
        recipient: payload,
        relationship: 'friend',
        vibe: 'uplifting',
        genre: 'pop',
        story: 'A'.repeat(200),
        selectedVoiceId: '21m00Tcm4TlvDq8ikWAM',
        selectedVoiceCategory: 'warm'
      };

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      // Should not return database errors or execute SQL
      if (response.status === 500) {
        const errorData = await response.json();
        if (errorData.details && errorData.details.includes('SQL')) {
          throw new Error(`Potential SQL injection vulnerability with: ${payload}`);
        }
      }
    }
  }

  // Test profanity filter bypasses
  async testProfanityFilterBypass() {
    const bypassAttempts = [
      'f*uck this',
      'sh!t happens',
      'damn3d soul',
      'b1tch please',
      'a$$hole behavior',
      'fück', // Unicode variation
      'sh‌it', // Zero-width space
      'fcuk', // Character transposition
      'shiat' // Character substitution
    ];

    for (const attempt of bypassAttempts) {
      const testData = {
        occasion: 'birthday',
        recipient: 'Test User',
        relationship: 'friend',
        vibe: 'uplifting',
        genre: 'pop',
        story: 'A'.repeat(180) + attempt,
        selectedVoiceId: '21m00Tcm4TlvDq8ikWAM',
        selectedVoiceCategory: 'warm'
      };

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      // Advanced profanity should be caught
      if (response.ok && ['f*uck', 'sh!t', 'fück', 'fcuk'].some(word => attempt.includes(word))) {
        this.warn('ProfanityBypass', `Profanity filter bypassed with: ${attempt}`);
      }
    }
  }

  // Test input validation edge cases
  async testInputValidation() {
    const invalidInputs = [
      { field: 'story', value: 'X', error: 'Story too short' },
      { field: 'story', value: 'X'.repeat(1000), error: 'Story too long' },
      { field: 'lyrics', value: 'X'.repeat(1000), error: 'Lyrics too long' },
      { field: 'selectedVoiceId', value: '', error: 'Voice ID required' },
      { field: 'recipient', value: '', error: 'Recipient required' },
      { field: 'occasion', value: 'invalid_occasion', error: 'Invalid occasion' },
      { field: 'vibe', value: 'invalid_vibe', error: 'Invalid vibe' },
      { field: 'genre', value: 'invalid_genre', error: 'Invalid genre' }
    ];

    for (const { field, value, error } of invalidInputs) {
      const testData = {
        occasion: 'birthday',
        recipient: 'Test User',
        relationship: 'friend',
        vibe: 'uplifting',
        genre: 'pop',
        story: 'A'.repeat(200),
        lyrics: '',
        title: '',
        useAutoLyrics: false,
        selectedVoiceId: '21m00Tcm4TlvDq8ikWAM',
        selectedVoiceCategory: 'warm',
        [field]: value
      };

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      if (response.ok) {
        throw new Error(`${error} - validation should have failed for ${field}=${value}`);
      }

      const errorData = await response.json();
      if (!errorData.error && !errorData.details) {
        throw new Error(`No proper error message returned for ${field} validation`);
      }
    }
  }

  // Test rate limiting (if implemented)
  async testRateLimiting() {
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

    const requests = [];
    for (let i = 0; i < 10; i++) {
      requests.push(
        fetch(`${this.baseUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validData)
        })
      );
    }

    const responses = await Promise.all(requests);
    const rateLimited = responses.some(r => r.status === 429);

    if (!rateLimited) {
      this.warn('RateLimit', 'No rate limiting detected - consider implementing for production');
    }
  }

  // Test error information leakage
  async testErrorLeakage() {
    // Test with completely invalid JSON
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"invalid": json}'
    });

    const errorData = await response.json();

    // Check for internal information in error responses
    const sensitivePatterns = [
      /\/Users\/.*\/Desktop/, // File paths
      /node_modules/, // Internal structure
      /\.ts:\d+:\d+/, // TypeScript file references
      /at .*\(.*\.js:\d+:\d+\)/, // Stack trace patterns
      /Error: .*at.*line \d+/ // Detailed error locations
    ];

    const responseText = JSON.stringify(errorData);
    for (const pattern of sensitivePatterns) {
      if (pattern.test(responseText)) {
        throw new Error(`Sensitive information leaked in error: ${responseText.substring(0, 200)}...`);
      }
    }
  }

  // Test request header manipulation
  async testHeaderInjection() {
    const maliciousHeaders = {
      'X-Forwarded-For': '"><script>alert("XSS")</script>',
      'User-Agent': '<script>alert("XSS")</script>',
      'Referer': 'javascript:alert("XSS")',
      'X-Request-ID': '"><script>alert("XSS")</script>'
    };

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

    for (const [header, value] of Object.entries(maliciousHeaders)) {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          [header]: value
        },
        body: JSON.stringify(validData)
      });

      // Check if malicious headers are reflected in response
      const responseText = await response.text();
      if (responseText.includes('<script>') || responseText.includes('javascript:')) {
        throw new Error(`Header injection vulnerability with ${header}`);
      }
    }
  }

  async runAllTests() {
    console.log('🔒 Starting Security Test Suite for Music Moments API\n');

    // Test if server is running
    try {
      await fetch(this.baseUrl);
    } catch (error) {
      console.log('❌ Server not running on', this.baseUrl);
      console.log('💡 Start server with: npm run dev\n');
      return;
    }

    await this.test('XSS Injection Prevention', () => this.testXSSInjection());
    await this.test('SQL Injection Prevention', () => this.testSQLInjection());
    await this.test('Profanity Filter Bypass', () => this.testProfanityFilterBypass());
    await this.test('Input Validation', () => this.testInputValidation());
    await this.test('Rate Limiting', () => this.testRateLimiting());
    await this.test('Error Information Leakage', () => this.testErrorLeakage());
    await this.test('Header Injection', () => this.testHeaderInjection());

    // Print summary
    console.log('\n📊 Security Test Results:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️  Warnings: ${this.results.warnings}`);
    
    if (this.results.failed > 0) {
      console.log('\n🚨 CRITICAL SECURITY ISSUES FOUND:');
      this.results.tests
        .filter(test => test.status === 'FAIL')
        .forEach(test => console.log(`   • ${test.name}: ${test.error}`));
    }

    if (this.results.warnings > 0) {
      console.log('\n⚠️  Security Recommendations:');
      this.results.tests
        .filter(test => test.status === 'WARN')
        .forEach(test => console.log(`   • ${test.name}: ${test.message}`));
    }

    const score = (this.results.passed / (this.results.passed + this.results.failed)) * 100;
    console.log(`\n🛡️  Security Score: ${score.toFixed(1)}%`);
    
    if (score < 70) {
      console.log('🚨 SECURITY SCORE TOO LOW - DO NOT DEPLOY TO PRODUCTION');
    } else if (score < 90) {
      console.log('⚠️  Security improvements needed before production deployment');
    } else {
      console.log('✅ Good security posture - ready for further testing');
    }
  }
}

// Run tests
const tester = new SecurityTester();
tester.runAllTests().catch(console.error);