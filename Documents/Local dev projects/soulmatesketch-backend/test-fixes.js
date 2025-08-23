// Test script to verify fixes
const API_BASE = 'http://localhost:8080';

async function testFixes() {
  console.log('Testing SoulSketch Backend Fixes...\n');
  
  try {
    // 1. Create an order
    console.log('1. Creating test order...');
    const orderRes = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'John Smith',
        birth_date: '1990-03-15',
        package: 'premium'
      })
    });
    
    if (!orderRes.ok) throw new Error('Failed to create order');
    const order = await orderRes.json();
    console.log('✅ Order created:', order.id);
    
    // 2. Submit quiz data
    console.log('\n2. Submitting quiz data...');
    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    formData.append('quiz', JSON.stringify({
      user: { firstName: 'John', email: 'test@example.com' },
      birth: { date: '1990-03-15' },
      preferences: { artStyle: 'pencil-realistic' }
    }));
    
    const intakeRes = await fetch(`${API_BASE}/api/orders/${order.id}/intake`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    
    if (!intakeRes.ok) throw new Error('Failed to submit intake');
    console.log('✅ Quiz data submitted');
    
    // 3. Generate deliverables
    console.log('\n3. Generating deliverables (this may take 30-60 seconds)...');
    const genRes = await fetch(`${API_BASE}/api/orders/${order.id}/generate`, {
      method: 'POST'
    });
    
    if (!genRes.ok) {
      const error = await genRes.text();
      throw new Error(`Generation failed: ${error}`);
    }
    
    const result = await genRes.json();
    console.log('✅ Generation complete!');
    console.log('   - Image URL:', result.sketch_url || result.imagePath);
    console.log('   - Report URL:', `/api/orders/${order.id}/report`);
    
    // 4. Verify numerology calculations
    if (result.numerologyInsights) {
      console.log('\n4. Numerology Data:');
      console.log('   - Life Path:', result.numerologyInsights.lifePath?.number);
      console.log('   - Destiny:', result.numerologyInsights.destiny?.number);
      
      if (result.numerologyInsights.lifePath?.number !== undefined) {
        console.log('✅ Numerology calculations working!');
      } else {
        console.log('❌ Numerology still showing undefined');
      }
    }
    
    // 5. Test image accessibility
    console.log('\n5. Testing image accessibility...');
    const imageUrl = result.sketch_url || result.imagePath;
    if (imageUrl) {
      const imageRes = await fetch(`${API_BASE}${imageUrl}`);
      if (imageRes.ok) {
        console.log('✅ Image is accessible at:', `${API_BASE}${imageUrl}`);
      } else {
        console.log('❌ Image not accessible:', imageRes.status);
      }
    }
    
    // 6. Test report accessibility
    console.log('\n6. Testing report accessibility...');
    const reportRes = await fetch(`${API_BASE}/api/orders/${order.id}/report`);
    if (reportRes.ok) {
      const reportText = await reportRes.text();
      const hasLifePath = !reportText.includes('Life Path undefined');
      const hasDestiny = !reportText.includes('Destiny undefined');
      
      if (hasLifePath && hasDestiny) {
        console.log('✅ Report has proper numerology data!');
      } else {
        console.log('❌ Report still has undefined values');
      }
    }
    
    console.log('\n✅ All tests complete!');
    console.log('\nYou can now view the deliverables at:');
    console.log(`- Open browser to: ${API_BASE}/order.html`);
    console.log(`- Click "View SoulSketch Image" or "View SoulSketch PDF Report"`);
    console.log(`- Or manually set in console: window.currentSketchImage = '${imageUrl}'`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests
testFixes();