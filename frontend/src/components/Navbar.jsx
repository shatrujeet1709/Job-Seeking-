import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { LogOut, Menu, X, Briefcase, Sparkles, MessageSquare, Zap, Building2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCenter from './NotificationCenter';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const role = user?.role;

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  const navLink = "text-slate-600 hover:text-primary px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-primary/5";

  // Role-specific nav links
  const roleLinks = () => {
    const links = [
      { to: '/dashboard', label: 'Dashboard', show: true },
      { to: '/profile', label: 'Profile', show: true },
      { to: '/jobs', label: 'Jobs', show: true },
      { to: '/ai-matches', label: 'AI Matches', show: role === 'seeker', icon: <Sparkles size={14} />, highlight: true },
      { to: '/freelance/dashboard', label: 'My Gigs', show: role === 'freelancer', icon: <Zap size={14} className="text-amber-500" /> },
      { to: '/freelance', label: 'Freelance', show: role !== 'freelancer' },
      { to: '/recruiter', label: 'Hire', show: role === 'recruiter', icon: <Building2 size={14} /> },
      { to: '/messages', label: 'Messages', show: true, icon: <MessageSquare size={14} className="inline" /> },
    ];
    return links.filter(l => l.show);
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto pointer-events-none"
    >
      <nav className="bg-white/80 backdrop-blur-xl rounded-2xl pointer-events-auto border border-slate-200/60 shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
        <div className="px-5">
          <div className="flex justify-between h-14 items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="bg-primary p-1.5 rounded-xl group-hover:shadow-md group-hover:shadow-primary/20 transition-all">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">JobAI</span>
            </Link>

            <div className="hidden sm:flex sm:items-center gap-1">
              {isAuthenticated ? (
                <>
                  {roleLinks().map(link => (
                    <Link key={link.to} to={link.to}
                      className={link.highlight
                        ? "text-primary hover:text-primary-dark px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-primary/5 flex items-center gap-1"
                        : navLink + " flex items-center gap-1"
                      }>
                      {link.icon}{link.label}
                    </Link>
                  ))}

                  <div className="h-6 w-px bg-slate-200 mx-1" />
                  <NotificationCenter />
                  <div className="h-6 w-px bg-slate-200 mx-1" />

                  <div className="flex items-center gap-3 bg-slate-50 rounded-xl pl-1 pr-3 py-1 border border-slate-100">
                    {user?.avatar ? (
                      <img className="h-7 w-7 rounded-lg object-cover" src={user.avatar} alt="" />
                    ) : (
                      <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-700">{user?.name}</span>
                    <button onClick={handleLogout} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Logout">
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors px-3 text-sm">Log in</Link>
                  <Link to="/register" className="btn-primary text-sm px-5 py-2">Sign up</Link>
                </div>
              )}
            </div>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100">
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="sm:hidden border-t border-slate-100 text-center py-4 bg-white rounded-b-2xl overflow-hidden"
            >
              {isAuthenticated ? (
                <div className="space-y-3 px-4">
                  <div className="flex items-center justify-center gap-3 pb-3 border-b border-slate-100">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-800">{user?.name}</p>
                      <p className="text-xs text-primary capitalize">{user?.role}</p>
                    </div>
                  </div>
                  {roleLinks().map(link => (
                    <Link key={link.to} to={link.to} onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-slate-600 hover:text-primary py-1 flex items-center justify-center gap-1">
                      {link.icon}{link.label}
                    </Link>
                  ))}
                  <button onClick={handleLogout} className="w-full text-center text-red-500 py-2 border-t border-slate-100 mt-2">Logout</button>
                </div>
              ) : (
                <div className="space-y-3 py-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-600">Login</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block text-primary font-bold">Sign up</Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.div>
  );
}
