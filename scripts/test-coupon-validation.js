/**
 * Test script for coupon validation
 * Run with: node scripts/test-coupon-validation.js
 */

// Mock localStorage for Node.js environment
global.localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  }
};

// Mock window object
global.window = {};

// Import the coupon system
const { 
  createCoupon, 
  validateCoupon, 
  formatCouponCode,
  calculateEngagement 
} = require('../src/lib/coupon-system.ts');

async function testCouponSystem() {
  console.log('🧪 Testing Coupon System...\n');

  try {
    // Test 1: Create a test coupon
    console.log('1️⃣ Testing coupon creation...');
    const testSignatureData = {
      name: 'Test User',
      email: 'test@example.com',
      city: 'Auray',
      postalCode: '56400',
      comment: 'Je soutiens cette excellente initiative pour notre patrimoine!',
      newsletter: true,
      socialShares: ['facebook'],
      referralCode: null
    };

    const engagement = await calculateEngagement(testSignatureData);
    console.log('📊 Engagement calculated:', {
      score: engagement.score,
      level: engagement.level,
      sentiment: engagement.sentimentAnalysis?.sentiment
    });

    const coupon = createCoupon(engagement);
    console.log('🎫 Coupon created:', {
      code: coupon.code,
      level: coupon.level,
      generations: coupon.generationsLeft,
      format: /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(coupon.code) ? '✅ Correct format' : '❌ Wrong format'
    });

    // Test 2: Validate the coupon
    console.log('\n2️⃣ Testing coupon validation...');
    const validation = validateCoupon(coupon.code);
    console.log('✅ Validation result:', {
      valid: validation.valid,
      message: validation.message,
      generationsLeft: validation.coupon?.generationsLeft
    });

    // Test 3: Test backward compatibility (without dashes)
    console.log('\n3️⃣ Testing backward compatibility...');
    const codeWithoutDashes = coupon.code.replace(/-/g, '');
    const backwardValidation = validateCoupon(codeWithoutDashes);
    console.log('🔄 Backward compatibility:', {
      originalCode: coupon.code,
      codeWithoutDashes: codeWithoutDashes,
      valid: backwardValidation.valid,
      message: backwardValidation.message
    });

    // Test 4: Test format function
    console.log('\n4️⃣ Testing format function...');
    const rawCode = 'ABCD1234EFGH';
    const formattedCode = formatCouponCode(rawCode);
    console.log('🎨 Format test:', {
      input: rawCode,
      output: formattedCode,
      correctFormat: /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(formattedCode) ? '✅' : '❌'
    });

    console.log('\n✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests
testCouponSystem();