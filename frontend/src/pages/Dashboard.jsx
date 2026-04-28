import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, User, Sparkles, MessageSquare, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay }
});

export default function Dashboard() {
  const { user } = useSelector(state => state.auth);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Welcome Banner */}
      <motion.div {...fadeIn(0)} className="card-colored p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-2xl shadow-md shadow-primary/20">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black text-slate-900">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-slate-500 capitalize font-medium flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> {user?.role} Dashboard
            </p>
          </div>
        </div>

        <div>
          {user?.role === 'seeker' && (
            <Link to="/ai-matches" className="card p-5 flex flex-col items-center group cursor-pointer hover:border-primary/30">
              <Sparkles size={18} className="text-primary mb-1" />
              <span className="text-xs text-slate-500 mb-0.5">AI Match Score</span>
              <span className="text-3xl font-black gradient-text group-hover:scale-110 transition-transform">92%</span>
            </Link>
          )}
          {user?.role === 'recruiter' && (
            <Link to="/recruiter" className="btn-primary inline-flex items-center gap-2 text-base px-6 py-3">
              Recruiter Console <ArrowRight size={18} />
            </Link>
          )}
          {user?.role === 'freelancer' && (
            <Link to="/freelance" className="btn-outline inline-flex items-center gap-2 text-base px-6 py-3">
              <Zap size={18} className="text-amber-500" /> Manage Gigs <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </motion.div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div {...fadeIn(0.1)} className="card p-6 flex flex-col">
          <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 border border-indigo-100">
            <User size={22} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Profile & Resume</h3>
          <p className="text-sm text-slate-500 mb-5 flex-1">Keep your profile updated for better AI recommendations.</p>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }} />
          </div>
          <p className="text-xs text-slate-400 mb-4 font-medium">75% Complete</p>
          <Link to="/profile" className="btn-outline w-full text-center py-2 text-sm">Edit Profile</Link>
        </motion.div>

        {user?.role === 'seeker' && (
          <motion.div {...fadeIn(0.2)} className="card p-6 flex flex-col">
            <div className="w-11 h-11 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-4 border border-sky-100">
              <Briefcase size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Job Applications</h3>
            <p className="text-sm text-slate-500 mb-5 flex-1">Track your recent applications.</p>
            <div className="space-y-2 mb-5">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-sm font-medium text-slate-700">Frontend Developer</span>
                <span className="badge-mid text-xs px-2 py-0.5">Viewed</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-sm font-medium text-slate-700">React Engineer</span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">Applied</span>
              </div>
            </div>
            <Link to="/jobs" className="btn-outline w-full text-center py-2 text-sm mt-auto">Browse Jobs</Link>
          </motion.div>
        )}

        {user?.role === 'recruiter' && (
          <motion.div {...fadeIn(0.2)} className="card p-6 flex flex-col">
            <div className="w-11 h-11 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-4 border border-sky-100">
              <TrendingUp size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Analytics</h3>
            <p className="text-sm text-slate-500 mb-5 flex-1">Track your job postings and metrics.</p>
            <Link to="/recruiter" className="btn-outline w-full text-center py-2 text-sm mt-auto">View Dashboard</Link>
          </motion.div>
        )}

        {user?.role === 'freelancer' && (
          <motion.div {...fadeIn(0.2)} className="card p-6 flex flex-col">
            <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 border border-amber-100">
              <Zap size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Your Gigs</h3>
            <p className="text-sm text-slate-500 mb-5 flex-1">Manage your gig listings and orders.</p>
            <Link to="/freelance/post" className="btn-outline w-full text-center py-2 text-sm mt-auto">Post New Gig</Link>
          </motion.div>
        )}

        <motion.div {...fadeIn(0.3)} className="card p-6 flex flex-col">
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 border border-emerald-100">
            <MessageSquare size={22} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Messages</h3>
          <p className="text-sm text-slate-500 mb-5 flex-1">Communicate with recruiters and clients.</p>
          <div className="flex flex-col items-center py-5 text-slate-300">
            <MessageSquare size={28} className="mb-1" />
            <p className="text-sm text-slate-400">No new messages</p>
          </div>
          <Link to="/messages" className="btn-outline w-full text-center py-2 text-sm mt-auto">Go to Inbox</Link>
        </motion.div>
      </div>
    </div>
  );
}
