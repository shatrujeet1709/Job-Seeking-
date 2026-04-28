const Gig = require('../models/Gig');
const Order = require('../models/Order');
const paymentService = require('../services/payment.service');
const { escapeRegex } = require('../utils/helpers');
const logger = require('../utils/logger');
const { createNotification } = require('../services/notification.service');

exports.getAllGigs = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 20));
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (search) {
      const escaped = escapeRegex(search);
      filter.$or = [
        { title: new RegExp(escaped, 'i') },
        { description: new RegExp(escaped, 'i') }
      ];
    }
    const [gigs, total] = await Promise.all([
      Gig.find(filter).populate('freelancer', 'name avatar').sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      Gig.countDocuments(filter)
    ]);
    res.json({ gigs, totalPages: Math.ceil(total / limitNum), currentPage: pageNum, totalGigs: total });
  } catch (err) { next(err); }
};

exports.getGigById = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('freelancer', 'name avatar createdAt');
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    res.json(gig);
  } catch (err) { next(err); }
};

exports.createGig = async (req, res, next) => {
  try {
    const images = req.files ? req.files.map(f => f.path) : [];
    let packages = req.body.packages;
    if (typeof packages === 'string') packages = JSON.parse(packages);
    const gig = await Gig.create({ ...req.body, packages, images, freelancer: req.user.id });
    res.status(201).json(gig);
  } catch (err) { next(err); }
};

exports.updateGig = async (req, res, next) => {
  try {
    const gig = await Gig.findOneAndUpdate(
      { _id: req.params.id, freelancer: req.user.id }, req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!gig) return res.status(404).json({ message: 'Gig not found or unauthorized' });
    res.json(gig);
  } catch (err) { next(err); }
};

exports.deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findOneAndDelete({ _id: req.params.id, freelancer: req.user.id });
    if (!gig) return res.status(404).json({ message: 'Gig not found or unauthorized' });
    res.json({ message: 'Gig deleted successfully' });
  } catch (err) { next(err); }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { packageId } = req.body;
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    if (gig.freelancer.toString() === req.user.id)
      return res.status(400).json({ message: 'Cannot order your own gig' });
    const pkg = gig.packages.find(p => p._id.toString() === packageId);
    if (!pkg) return res.status(400).json({ message: 'Invalid package selected' });

    const order = await Order.create({
      gig: gig._id, buyer: req.user.id, seller: gig.freelancer,
      package: { name: pkg.name, description: pkg.description, price: pkg.price, deliveryDays: pkg.deliveryDays, revisions: pkg.revisions },
      amount: pkg.price,
      deliveryDate: new Date(Date.now() + pkg.deliveryDays * 24 * 60 * 60 * 1000),
    });

    try {
      const razorpayOrder = await paymentService.createOrder(pkg.price);
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();
      res.json({ order, razorpayOrder, package: pkg, gigId: gig._id });
    } catch (e) {
      logger.warn(`Razorpay error, returning mock order: ${e.message}`);
      res.json({ order, razorpayOrder: { id: `mock_${Date.now()}`, amount: pkg.price * 100 }, package: pkg, gigId: gig._id, mocked: true });
    }
  } catch (err) { next(err); }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.buyer.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    const isValid = paymentService.verifyPayment(order.razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) return res.status(400).json({ message: 'Invalid payment signature' });
    order.status = 'paid';
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();
    res.json({ message: 'Payment verified', order });
  } catch (err) { next(err); }
};

exports.markComplete = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.buyer.toString() !== req.user.id) return res.status(403).json({ message: 'Only the buyer can mark complete' });
    if (!['paid', 'delivered', 'in_progress'].includes(order.status))
      return res.status(400).json({ message: `Cannot complete order in "${order.status}" status` });
    order.status = 'completed';
    order.completedAt = new Date();
    await order.save();
    // Persistent notification for seller
    await createNotification({
      userId: order.seller.toString(),
      type: 'order_update',
      title: 'Order Completed!',
      message: 'Your order has been completed and payment released.',
      link: '/freelance/dashboard',
      metadata: { orderId: order._id },
    });
    res.json({ message: 'Order completed and payment released.', order });
  } catch (err) { next(err); }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ $or: [{ buyer: req.user.id }, { seller: req.user.id }] })
      .populate('gig', 'title images').populate('buyer', 'name avatar').populate('seller', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { next(err); }
};

exports.getMyGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find({ freelancer: req.user.id }).sort({ createdAt: -1 });
    res.json(gigs);
  } catch (err) { next(err); }
};
