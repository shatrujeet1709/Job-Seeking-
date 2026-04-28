import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../store/authSlice';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, Shield, Briefcase, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => { if (isAuthenticated) navigate('/dashboard'); }, [isAuthenticated, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const onSubmit = (data) => dispatch(loginUser(data));

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl w-full items-center">
        {/* Left branded panel — replaces image */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
          className="hidden lg:flex flex-col items-center justify-center">
          <div className="text-center">
            {/* Icon composition */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative mx-auto mb-8"
            >
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary to-indigo-700 flex items-center justify-center shadow-xl shadow-primary/25 mx-auto">
                <Briefcase className="h-14 w-14 text-white" />
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-3 w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </motion.div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">AI-Powered Career Platform</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed mb-6">
              Smart matching. Real opportunities. Your data is always secure.
            </p>

            <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><Shield size={14} className="text-emerald-500" /> Secure Login</span>
              <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-amber-500" /> AI Matching</span>
            </div>
          </div>
        </motion.div>

        {/* Login form */}
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md mx-auto">
          <div className="card-elevated p-10">
            <div className="text-center mb-8">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-md shadow-primary/20">
                <LogIn className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Welcome back</h2>
              <p className="mt-1.5 text-slate-500 text-sm">
                New here? <Link to="/register" className="font-semibold text-primary hover:text-primary-dark">Create account</Link>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input id="login-email" type="email" autoComplete="email" className="input-field pl-10"
                    placeholder="Email address" {...register('email', { required: 'Email is required' })} />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500 pl-1">{errors.email.message}</p>}
              </div>

              <div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input id="login-password" type="password" autoComplete="current-password" className="input-field pl-10"
                    placeholder="Password" {...register('password', { required: 'Password is required' })} />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500 pl-1">{errors.password.message}</p>}
                <div className="text-right mt-1">
                  <Link to="/forgot-password" className="text-xs text-primary hover:text-primary-dark font-medium">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Shield size={12} className="text-emerald-500" />
              Secured with enterprise-grade encryption
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
