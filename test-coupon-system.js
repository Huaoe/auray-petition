// Test script for coupon system
// Run this in the browser console after loading the application

// Import functions from coupon-system.ts
// Note: These functions should be available in the global scope if you run this in the browser console
// after the application has loaded

// Clear existing data
function clearTestData() {
  localStorage.removeItem('petition_coupons');
  localStorage.removeItem('petition_referrals');
  console.log('🧹 Test data cleared');
}

// Create a mock user with a coupon
function createTestUser(email = 'test@example.com') {
  // Create a basic engagement
  const engagement = {
    details: {
      name: 'Test User',
      email: email,
      city: 'Test City',
      postalCode: '12345',
      comment: 'This is a test comment',
      newsletter: true,
      socialShares: ['test'],
      referralCode: null
    },
    score: 5,
    level: 'BASIC'
  };
  
  // Create a coupon for this user
  const coupon = createCoupon(engagement);
  console.log('👤 Test user created with coupon:', coupon);
  
  return coupon;
}

// Create a mock referral code for a user
function createTestReferralCode(email) {
  const code = generateReferralCode(email);
  console.log(`🔑 Referral code created for ${email}: ${code}`);
  return code;
}

// Simulate a successful referral
function simulateReferral(referrerEmail, refereeEmail) {
  // Get the referrer's code
  const referrals = loadReferrals();
  const referrerCode = referrals.find(r => 
    r.email === referrerEmail && 
    r.referrerEmail === referrerEmail
  )?.code;
  
  if (!referrerCode) {
    console.error('❌ No referral code found for referrer');
    return false;
  }
  
  // Record the referral
  const recorded = recordReferral(referrerCode, refereeEmail);
  if (!recorded) {
    console.error('❌ Failed to record referral');
    return false;
  }
  
  // Create a basic engagement for the referee
  const engagement = {
    details: {
      name: 'Referee User',
      email: refereeEmail,
      city: 'Referee City',
      postalCode: '54321',
      comment: 'This is a referee comment',
      newsletter: true,
      socialShares: [],
      referralCode: referrerCode
    },
    score: 5,
    level: 'BASIC'
  };
  
  // Create a coupon for the referee
  const coupon = createCoupon(engagement);
  console.log(`👥 Referee ${refereeEmail} created with coupon:`, coupon);
  
  // Mark the referral as used
  const marked = markReferralAsUsed(referrerCode, refereeEmail);
  if (!marked) {
    console.error('❌ Failed to mark referral as used');
    return false;
  }
  
  console.log(`✅ Referral from ${referrerEmail} to ${refereeEmail} completed`);
  return true;
}

// Test that the maximum bonus generations limit is enforced
function testMaxBonusGenerations() {
  clearTestData();
  
  // Create a test user
  const referrerEmail = 'referrer@example.com';
  const referrerCoupon = createTestUser(referrerEmail);
  
  // Create a referral code for the test user
  const referralCode = createTestReferralCode(referrerEmail);
  
  // Simulate 25 successful referrals (more than the max of 20)
  console.log('🧪 Simulating 25 referrals (should cap at 20 bonus generations)...');
  
  for (let i = 1; i <= 25; i++) {
    const refereeEmail = `referee${i}@example.com`;
    simulateReferral(referrerEmail, refereeEmail);
    
    // Check the current state after each referral
    const coupons = loadCoupons();
    const updatedReferrerCoupon = coupons.find(c => c.email === referrerEmail);
    
    if (updatedReferrerCoupon) {
      const referralBonuses = 'referralBonuses' in updatedReferrerCoupon 
        ? updatedReferrerCoupon.referralBonuses 
        : countReferralBonuses(referrerEmail);
      
      console.log(`📊 After referral #${i}: Referral bonuses = ${referralBonuses}`);
      
      // Verify that the bonus doesn't exceed the maximum
      if (referralBonuses > 20) {
        console.error(`❌ TEST FAILED: Referral bonuses (${referralBonuses}) exceeded maximum (20)`);
        return false;
      }
    }
  }
  
  // Final verification
  const coupons = loadCoupons();
  const finalReferrerCoupon = coupons.find(c => c.email === referrerEmail);
  
  if (finalReferrerCoupon) {
    const finalReferralBonuses = 'referralBonuses' in finalReferrerCoupon 
      ? finalReferrerCoupon.referralBonuses 
      : countReferralBonuses(referrerEmail);
    
    console.log(`🏁 Final state: Referral bonuses = ${finalReferralBonuses}`);
    
    if (finalReferralBonuses === 20) {
      console.log('✅ TEST PASSED: Maximum bonus generations limit is correctly enforced');
      return true;
    } else {
      console.error(`❌ TEST FAILED: Expected 20 referral bonuses, got ${finalReferralBonuses}`);
      return false;
    }
  } else {
    console.error('❌ TEST FAILED: Could not find referrer coupon in final state');
    return false;
  }
}

// Run the test
console.log('🧪 Starting coupon system test...');
testMaxBonusGenerations();
