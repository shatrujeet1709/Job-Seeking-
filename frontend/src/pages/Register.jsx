import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../store/authSlice';
import toast from 'react-hot-toast';
import { UserPlus, User, Mail, Lock, Search, Zap, Briefcase, Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ROLES = [
  { value: 'seeker', label: 'Find a Job', icon: Search, bg: 'bg-sky-50 border-sky-200 text-sky-700', active: 'bg-sky-100 border-sky-400 text-sky-800 shadow-sm' },
  { value: 'freelancer', label: 'Freelance', icon: Zap, bg: 'bg-amber-50 border-amber-200 text-amber-700', active: 'bg-amber-100 border-amber-400 text-amber-800 shadow-sm' },
  { value: 'recruiter', label: 'Hire Talent', icon: Briefcase, bg: 'bg-indigo-50 border-indigo-200 text-indigo-700', active: 'bg-indigo-100 border-indigo-400 text-indigo-800 shadow-sm' },
];

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: 'seeker' } });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const selectedRole = watch('role');

  useEffect(() => { if (isAuthenticated) navigate('/dashboard'); }, [isAuthenticated, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const onSubmit = (data) => dispatch(registerUser(data));

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl w-full items-center">
        {/* Left branded panel — replaces image */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:flex flex-col items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative mx-auto mb-8"
            >
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-secondary to-sky-700 flex items-center justify-center shadow-xl shadow-secondary/25 mx-auto">
                <UserPlus className="h-14 w-14 text-white" />
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-3 w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </motion.div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">Join 50,000+ Professionals</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed mb-6">
              AI matching • Secure payments • Two-step verification • Real-time chat
            </p>

            <div className="space-y-2.5 text-left max-w-xs mx-auto">
              {['AI-powered job matching', 'Email-verified profiles', 'Enterprise-grade security'].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Register form */}
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="w-full max-w-md mx-auto">
          <div className="card-elevated p-10">
            <div className="text-center mb-7">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4 shadow-md shadow-secondary/20">
                <UserPlus className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Create account</h2>
              <p className="mt-1.5 text-slate-500 text-sm">
                Already registered? <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">Sign in</Link>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">I want to:</label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map(r => (
                    <label key={r.value} className="cursor-pointer">
                      <input type="radio" value={r.value} {...register('role')} className="peer sr-only" />
                      <div className={`text-center px-2 py-2.5 rounded-xl border text-sm font-medium transition-all
                        ${selectedRole === r.value ? r.active : r.bg}`}>
                        <r.icon size={18} className="mx-auto mb-1" />
                        {r.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" className="input-field pl-10" placeholder="Full Name"
                  {...register('name', { required: 'Name is required' })} />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" className="input-field pl-10" placeholder="Email address"
                  {...register('email', { required: 'Email is required' })} />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" className="input-field pl-10" placeholder="Password (min 8 chars)"
                  {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })} />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-secondary w-full py-3 text-sm flex items-center justify-center gap-2">
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</> : 'Create Account'}
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Shield size={12} className="text-emerald-500" />
              Your account is secured with enterprise-grade encryption
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
