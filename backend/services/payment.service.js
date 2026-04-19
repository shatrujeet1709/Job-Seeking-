const Razorpay = require('razorpay');

let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id') {
  razorpay = new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Create Razorpay order (holds payment in escrow)
exports.createOrder = async (amount, currency = 'INR') => {
  if (!razorpay) throw new Error('Razorpay is not configured');
  
  const options = {
    amount:   amount * 100,  // Razorpay expects paise
    currency,
    receipt:  `order_${Date.now()}`,
    payment_capture: 1
  };
  return await razorpay.orders.create(options);
};

// Verify payment signature after frontend payment
exports.verifyPayment = (orderId, paymentId, signature) => {
  if (!process.env.RAZORPAY_KEY_SECRET) return false;
  
  const crypto   = require('crypto');
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
};
