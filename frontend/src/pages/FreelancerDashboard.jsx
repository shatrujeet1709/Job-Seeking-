import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Zap, Package, DollarSign, Star, Clock, Plus, Eye, MessageSquare, TrendingUp, CheckCircle, Loader2 } from 'lucide-react';

const fadeIn = (delay = 0) => ({ initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay } });

export default function FreelancerDashboard() {
  const [gigs, setGigs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [g, o] = await Promise.all([
        api.get('/freelance/my-gigs').catch(() => ({ data: [] })),
        api.get('/freelance/my-orders').catch(() => ({ data: [] })),
      ]);
      setGigs(Array.isArray(g.data) ? g.data : []);
      setOrders(Array.isArray(o.data) ? o.data : []);
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
    </div>
  );

  const activeGigs = gigs.filter(g => g.isActive);
  const totalEarnings = orders.filter(o => o.status === 'completed').reduce((s, o) => s + (o.amount || 0), 0);
  const pendingOrders = orders.filter(o => ['pending', 'paid', 'in_progress'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'completed');
  const avgRating = gigs.length > 0 ? (gigs.reduce((s, g) => s + (g.rating || 0), 0) / gigs.length).toFixed(1) : '0.0';

  const statCards = [
    { icon: Package, label: 'Active Gigs', value: activeGigs.length, color: 'amber', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600' },
    { icon: Clock, label: 'Pending Orders', value: pendingOrders.length, color: 'sky', bg: 'bg-sky-50', border: 'border-sky-100', text: 'text-sky-600' },
    { icon: DollarSign, label: 'Total Earnings', value: `₹${totalEarnings.toLocaleString()}`, color: 'emerald', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600' },
    { icon: Star, label: 'Avg Rating', value: avgRating, color: 'indigo', bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-600' },
  ];

  const statusStyle = {
    pending: 'bg-slate-100 text-slate-600',
    paid: 'bg-sky-50 text-sky-700',
    in_progress: 'bg-amber-50 text-amber-700',
    delivered: 'bg-indigo-50 text-indigo-700',
    completed: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-600',
    disputed: 'bg-red-50 text-red-600',
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div {...fadeIn(0)} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2"><Zap className="text-amber-500" /> Freelancer Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your gigs, orders, and earnings.</p>
        </div>
        <Link to="/freelance/post" className="btn-primary px-6 py-3 flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 shadow-md shadow-amber-200">
          <Plus size={18} /> Post New Gig
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <motion.div key={i} {...fadeIn(i * 0.05)} className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${s.bg} ${s.text} flex items-center justify-center border ${s.border}`}><s.icon size={16} /></div>
              <span className="text-sm font-medium text-slate-500">{s.label}</span>
            </div>
            <p className="text-3xl font-black text-slate-900">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Your Gigs */}
        <motion.div {...fadeIn(0.2)} className="lg:col-span-1 card-elevated overflow-hidden flex flex-col" style={{ maxHeight: '580px' }}>
          <div className="border-b border-slate-100 p-4 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Package size={16} className="text-amber-500" /> Your Gigs</h3>
            <Link to="/freelance/post" className="text-sm text-amber-600 font-medium hover:text-amber-700">+ New</Link>
          </div>
          <div className="overflow-y-auto p-3 space-y-3 flex-1">
            {activeGigs.length > 0 ? activeGigs.map(gig => (
              <div key={gig._id} className="card p-4 hover:border-amber-200 transition-colors">
                <h4 className="font-semibold text-slate-900 text-sm line-clamp-2">{gig.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{gig.category || 'No category'}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-amber-600">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-bold">{gig.rating || '0.0'}</span>
                    <span className="text-xs text-slate-400">({gig.reviewCount || 0})</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">
                    From ₹{gig.packages?.[0]?.price?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-slate-400">
                <Package size={40} className="mx-auto mb-3 text-slate-200" />
                <p className="text-sm font-medium">No gigs yet</p>
                <Link to="/freelance/post" className="text-sm text-amber-600 font-medium hover:underline mt-1 inline-block">Create your first gig →</Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Orders */}
        <motion.div {...fadeIn(0.3)} className="lg:col-span-2 card-elevated overflow-hidden flex flex-col" style={{ maxHeight: '580px' }}>
          <div className="border-b border-slate-100 p-4 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><TrendingUp size={16} className="text-emerald-500" /> Recent Orders</h3>
            <span className="text-xs text-slate-500 font-medium">{orders.length} total</span>
          </div>
          <div className="overflow-y-auto p-4 space-y-4 flex-1">
            {orders.length > 0 ? orders.map(order => (
              <div key={order._id} className="card p-4 flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">{order.gig?.title || 'Gig Order'}</h4>
                  <p className="text-sm text-slate-500 mt-1">Buyer: {order.buyer?.name || 'Unknown'}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2 min-w-[120px]">
                  <span className="text-lg font-black text-emerald-600">₹{order.amount?.toLocaleString()}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle[order.status] || ''}`}>
                    {order.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-16 text-slate-400">
                <CheckCircle size={48} className="mx-auto mb-3 text-slate-200" />
                <h4 className="font-bold text-slate-900">No orders yet</h4>
                <p className="text-sm mt-1">Orders will appear here once clients start buying your gigs.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div {...fadeIn(0.4)} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Link to="/freelance" className="card p-5 flex items-center gap-4 hover:border-amber-200 transition-colors group">
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100"><Eye size={20} /></div>
          <div>
            <h4 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Browse Marketplace</h4>
            <p className="text-xs text-slate-500">See what others are offering</p>
          </div>
        </Link>
        <Link to="/profile" className="card p-5 flex items-center gap-4 hover:border-indigo-200 transition-colors group">
          <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100"><Zap size={20} /></div>
          <div>
            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Edit Profile</h4>
            <p className="text-xs text-slate-500">Update your freelancer details</p>
          </div>
        </Link>
        <Link to="/messages" className="card p-5 flex items-center gap-4 hover:border-emerald-200 transition-colors group">
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100"><MessageSquare size={20} /></div>
          <div>
            <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Messages</h4>
            <p className="text-xs text-slate-500">Chat with your clients</p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
