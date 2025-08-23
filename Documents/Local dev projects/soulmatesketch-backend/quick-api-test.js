#!/usr/bin/env node

import https from 'https';

const BASE_URL = 'https://soulsketchv2-clean.onrender.com';
const BACKUP_URL = 'https://soulsketch-final.onrender.com';

console.log('🧪 LIVE API TESTING');
console.log('===================');
console.log('');

// Function to make HTTP requests
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Tester/1.0'
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', (err) => reject(err));
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test functions
async function testHomePage() {
  console.log('📱 TEST 1: Home Page');
  try {
    const response = await makeRequest(`${BASE_URL}/`);
    if (response.status === 200) {
      console.log('✅ SUCCESS - Home page loads');
      console.log(`   Status: ${response.status}`);
      console.log(`   Content-Type: ${response.headers['content-type']}`);
      console.log(`   Content Length: ${response.body.length} characters`);
    } else {
      console.log(`❌ FAILED - Status: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
  console.log('');
}

async function testQuizPage() {
  console.log('📝 TEST 2: Quiz Page');
  try {
    const response = await makeRequest(`${BASE_URL}/order.html`);
    if (response.status === 200) {
      console.log('✅ SUCCESS - Quiz page loads');
      console.log(`   Status: ${response.status}`);
      console.log(`   Content-Type: ${response.headers['content-type']}`);
      console.log(`   Content Length: ${response.body.length} characters`);
    } else {
      console.log(`❌ FAILED - Status: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
  console.log('');
}

async function testOrderCreation() {
  console.log('📋 TEST 3: Create Order API');
  try {
    const response = await makeRequest(`${BASE_URL}/api/orders`, 'POST', {
      email: 'test@example.com',
      tier: 'premium',
      addons: []
    });
    
    if (response.status === 200 || response.status === 201) {
      console.log('✅ SUCCESS - Order creation works');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${response.body.substring(0, 200)}...`);
    } else {
      console.log(`❌ FAILED - Status: ${response.status}`);
      console.log(`   Response: ${response.body}`);
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
  console.log('');
}

async function testPaymentIntent() {
  console.log('💳 TEST 4: Payment Intent API');
  try {
    const response = await makeRequest(`${BASE_URL}/api/create-payment-intent`, 'POST', {
      amount: 1799,
      currency: 'usd',
      email: 'test@example.com'
    });
    
    if (response.status === 200 || response.status === 201) {
      console.log('✅ SUCCESS - Payment intent creation works');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${response.body.substring(0, 200)}...`);
    } else if (response.status === 503) {
      console.log('⚠️  WARNING - Payment system not available (Stripe not configured)');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${response.body}`);
    } else {
      console.log(`❌ FAILED - Status: ${response.status}`);
      console.log(`   Response: ${response.body}`);
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
  console.log('');
}

async function testStaticAssets() {
  console.log('🖼️  TEST 5: Static Assets');
  
  const assets = [
    '/images/home/blonde.png',
    '/images/home/asianwoman.png', 
    '/images/home/bannerimage.png',
    '/css/custom.css'
  ];
  
  for (const asset of assets) {
    try {
      const response = await makeRequest(`${BASE_URL}${asset}`);
      if (response.status === 200) {
        console.log(`✅ ${asset} - Loads successfully`);
      } else {
        console.log(`❌ ${asset} - Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${asset} - Error: ${error.message}`);
    }
  }
  console.log('');
}

async function testErrorHandling() {
  console.log('⚠️  TEST 6: Error Handling');
  try {
    const response = await makeRequest(`${BASE_URL}/api/nonexistent`);
    if (response.status === 404) {
      console.log('✅ SUCCESS - 404 handling works correctly');
    } else {
      console.log(`⚠️  UNEXPECTED - Status: ${response.status} (expected 404)`);
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log(`🌐 Testing: ${BASE_URL}`);
  console.log(`🌐 Backup: ${BACKUP_URL}`);
  console.log('');
  
  await testHomePage();
  await testQuizPage();
  await testOrderCreation();
  await testPaymentIntent();
  await testStaticAssets();
  await testErrorHandling();
  
  console.log('🎉 API Testing Complete! 🎉');
  console.log('');
  console.log('📊 Summary:');
  console.log('   • Check results above for any failed tests');
  console.log('   • All ✅ tests should pass for production readiness');
  console.log('   • Any ❌ tests need investigation');
  console.log('');
  console.log('🚀 If all tests pass, your system is ready for production! 🚀');
}

// Run the tests
runAllTests().catch(console.error);
