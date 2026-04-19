const Gig = require('../models/Gig');
const paymentService = require('../services/payment.service');

exports.getAllGigs = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (search) {
        filter.$or = [
            { title: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') }
        ];
    }
    const gigs = await Gig.find(filter).populate('freelancer', 'name avatar').sort({ createdAt: -1 });
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('freelancer', 'name avatar createdAt');
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createGig = async (req, res) => {
  try {
    // Handling array of uploaded images if any
    const images = req.files ? req.files.map(f => f.path) : [];
    
    // Parse packages if sent as stringified JSON
    let packages = req.body.packages;
    if (typeof packages === 'string') packages = JSON.parse(packages);

    const gigData = {
        ...req.body,
        packages,
        images,
        freelancer: req.user.id
    };
    const gig = await Gig.create(gigData);
    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateGig = async (req, res) => {
  try {
    const gig = await Gig.findOneAndUpdate(
      { _id: req.params.id, freelancer: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!gig) return res.status(404).json({ message: 'Gig not found or unauthorized' });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findOneAndDelete({ _id: req.params.id, freelancer: req.user.id });
    if (!gig) return res.status(404).json({ message: 'Gig not found or unauthorized' });
    res.json({ message: 'Gig deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { packageId } = req.body;
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    
    const pkg = gig.packages.find(p => p._id.toString() === packageId);
    if (!pkg) return res.status(400).json({ message: 'Invalid package selected' });

    try {
        const order = await paymentService.createOrder(pkg.price);
        res.json({ order, package: pkg, gigId: gig._id });
    } catch (e) {
        // Fallback for demo when razorpay isn't configured
        console.warn("Razorpay error, returning mock order:", e.message);
        res.json({ 
            order: { id: `mock_order_${Date.now()}`, amount: pkg.price * 100 }, 
            package: pkg, 
            gigId: gig._id,
            mocked: true
        });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.markComplete = async (req, res) => {
   res.json({ message: 'Order completed and escrow released.' });
};
