const express = require('express');
const router = express.Router();

// In-memory payment and subscription data
const recruiterSubscriptions = {};
const paymentHistory = {};

/**
 * GET /api/payment/paystack-key - Get Paystack public key
 */
router.get('/paystack-key', (req, res) => {
  try {
    const paystackKey = process.env.PAYSTACK_PUBLIC_KEY || 'pk_live_your_paystack_public_key';
    res.json({
      success: true,
      key: paystackKey,
    });
  } catch (error) {
    console.error('Error getting Paystack key:', error);
    res.status(500).json({ success: false, message: 'Error getting Paystack key' });
  }
});

/**
 * POST /api/payment/verify-paystack - Verify Paystack payment
 */
router.post('/verify-paystack', async (req, res) => {
  try {
    const { reference, recruiter_id, candidate_id } = req.body;

    if (!reference || !recruiter_id) {
      return res.status(400).json({ success: false, message: 'Reference and recruiter_id required' });
    }

    // Verify payment with Paystack
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;

    const response = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    const data = await response.json();

    if (!data.status || data.data.status !== 'success') {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Payment successful - activate subscription
    if (!recruiterSubscriptions[recruiter_id]) {
      recruiterSubscriptions[recruiter_id] = {
        recruiter_id,
        status: 'trial',
        hires_used: 0,
        hires_free_used: 0,
        subscription_type: 'trial',
        subscription_expiry: null,
        amount_paid: 0,
      };
    }

    const subscription = recruiterSubscriptions[recruiter_id];
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    subscription.status = 'active';
    subscription.subscription_type = 'paid';
    subscription.subscription_expiry = expiryDate.toISOString();
    subscription.amount_paid = (subscription.amount_paid || 0) + data.data.amount / 100;

    // Record payment
    if (!paymentHistory[recruiter_id]) {
      paymentHistory[recruiter_id] = [];
    }

    paymentHistory[recruiter_id].push({
      id: reference,
      candidate_id,
      amount: data.data.amount / 100,
      type: 'subscription',
      timestamp: new Date().toISOString(),
      status: 'completed',
      description: 'Monthly subscription - Unlimited hires for 1 month',
      paystackRef: reference,
    });

    res.json({
      success: true,
      message: '✅ Payment verified! Subscription activated.',
      subscription,
      paymentDetails: {
        amount: data.data.amount / 100,
        currency: data.data.currency,
        reference: reference,
      },
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Error verifying payment' });
  }
});
router.get('/recruiter/:recruiter_id', (req, res) => {
  try {
    const subscription = recruiterSubscriptions[req.params.recruiter_id] || null;

    res.json({
      success: true,
      subscription: subscription || {
        recruiter_id: req.params.recruiter_id,
        status: 'trial',
        hires_used: 0,
        hires_free_used: 0,
        hires_remaining: 1, // 1 free hire
        subscription_type: 'trial',
        subscription_expiry: null,
        amount_paid: 0,
        message: 'Free trial - 1 free hire available',
      },
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ success: false, message: 'Error fetching subscription' });
  }
});

/**
 * POST /api/payment/hire - Record a hire (use free or paid)
 * Body: { recruiter_id, candidate_id, is_free_hire }
 */
router.post('/hire', (req, res) => {
  try {
    const { recruiter_id, candidate_id, is_free_hire = false } = req.body;

    if (!recruiter_id || !candidate_id) {
      return res.status(400).json({ success: false, message: 'Recruiter ID and Candidate ID required' });
    }

    // Get or create subscription
    if (!recruiterSubscriptions[recruiter_id]) {
      recruiterSubscriptions[recruiter_id] = {
        recruiter_id,
        status: 'trial',
        hires_used: 0,
        hires_free_used: 0,
        subscription_type: 'trial',
        subscription_expiry: null,
        amount_paid: 0,
      };
    }

    const subscription = recruiterSubscriptions[recruiter_id];

    // Check if can hire
    if (is_free_hire) {
      if (subscription.hires_free_used >= 1) {
        return res.status(400).json({
          success: false,
          message: 'Free hire already used. Subscribe for ₦5,000/month for unlimited hires',
          needsPayment: true,
          amount: 5000,
          currency: 'NGN',
        });
      }
      subscription.hires_free_used++;
    } else {
      // Check if has active subscription
      if (subscription.subscription_type === 'trial' && subscription.hires_free_used >= 1) {
        return res.status(400).json({
          success: false,
          message: 'Free hire used. Please subscribe to continue hiring',
          needsPayment: true,
          amount: 5000,
          currency: 'NGN',
        });
      }

      if (subscription.subscription_type !== 'active' || !subscription.subscription_expiry || new Date(subscription.subscription_expiry) < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Subscription inactive or expired',
          needsPayment: true,
          amount: 5000,
          currency: 'NGN',
        });
      }
    }

    subscription.hires_used++;

    // Record payment
    if (!paymentHistory[recruiter_id]) {
      paymentHistory[recruiter_id] = [];
    }

    paymentHistory[recruiter_id].push({
      id: `payment_${Date.now()}`,
      candidate_id,
      amount: is_free_hire ? 0 : 5000,
      type: is_free_hire ? 'free_hire' : 'subscription',
      timestamp: new Date().toISOString(),
      status: 'completed',
    });

    res.json({
      success: true,
      message: `${is_free_hire ? 'Free hire' : 'Hire'} recorded successfully`,
      subscription,
    });
  } catch (error) {
    console.error('Error recording hire:', error);
    res.status(500).json({ success: false, message: 'Error recording hire' });
  }
});

/**
 * POST /api/payment/subscribe - Subscribe to monthly plan
 * Body: { recruiter_id }
 */
router.post('/subscribe', (req, res) => {
  try {
    const { recruiter_id } = req.body;

    if (!recruiter_id) {
      return res.status(400).json({ success: false, message: 'Recruiter ID required' });
    }

    // Get or create subscription
    if (!recruiterSubscriptions[recruiter_id]) {
      recruiterSubscriptions[recruiter_id] = {
        recruiter_id,
        status: 'trial',
        hires_used: 0,
        hires_free_used: 0,
        subscription_type: 'trial',
        subscription_expiry: null,
        amount_paid: 0,
      };
    }

    const subscription = recruiterSubscriptions[recruiter_id];
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    subscription.status = 'active';
    subscription.subscription_type = 'paid';
    subscription.subscription_expiry = expiryDate.toISOString();
    subscription.amount_paid = 5000;

    // Record payment
    if (!paymentHistory[recruiter_id]) {
      paymentHistory[recruiter_id] = [];
    }

    paymentHistory[recruiter_id].push({
      id: `payment_${Date.now()}`,
      amount: 5000,
      type: 'subscription',
      timestamp: new Date().toISOString(),
      status: 'completed',
      description: 'Monthly subscription - Unlimited hires for 1 month',
    });

    res.json({
      success: true,
      message: 'Subscription activated! ₦5,000 charged for 1 month of unlimited hires',
      subscription,
      paymentDetails: {
        amount: 5000,
        currency: 'NGN',
        period: '1 month',
        features: ['Unlimited hires', 'Priority support', 'Job posting'],
      },
    });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ success: false, message: 'Error subscribing' });
  }
});

/**
 * GET /api/payment/history/:recruiter_id - Get payment history
 */
router.get('/history/:recruiter_id', (req, res) => {
  try {
    const history = paymentHistory[req.params.recruiter_id] || [];

    res.json({
      success: true,
      payments: history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
      total: history.length,
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ success: false, message: 'Error fetching payment history' });
  }
});

module.exports = router;
