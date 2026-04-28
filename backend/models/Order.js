const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  gig:        { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  buyer:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package: {
    name:          String,
    description:   String,
    price:         Number,
    deliveryDays:  Number,
    revisions:     Number,
  },
  amount:         { type: Number, required: true },           // In INR
  razorpayOrderId:  { type: String },
  razorpayPaymentId:{ type: String },
  status:       { type: String, enum: ['pending', 'paid', 'in_progress', 'delivered', 'completed', 'cancelled', 'disputed'], default: 'pending' },
  deliveryDate: { type: Date },
  completedAt:  { type: Date },
  createdAt:    { type: Date, default: Date.now },
});

OrderSchema.index({ buyer: 1, createdAt: -1 });
OrderSchema.index({ seller: 1, createdAt: -1 });
OrderSchema.index({ gig: 1 });

module.exports = mongoose.model('Order', OrderSchema);
