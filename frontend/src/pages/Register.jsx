import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../store/authSlice';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { role: 'seeker' }
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark transition-colors">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">I want to:</label>
              <div className="grid grid-cols-3 gap-2">
                <label className="cursor-pointer">
                  <input type="radio" value="seeker" {...register('role')} className="peer sr-only" />
                  <div className="text-center px-3 py-2 border rounded-lg peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-colors text-sm hover:bg-gray-50">
                    Find a Job
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" value="freelancer" {...register('role')} className="peer sr-only" />
                  <div className="text-center px-3 py-2 border rounded-lg peer-checked:bg-accent peer-checked:text-white peer-checked:border-accent transition-colors text-sm hover:bg-gray-50">
                    Freelance
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" value="recruiter" {...register('role')} className="peer sr-only" />
                  <div className="text-center px-3 py-2 border rounded-lg peer-checked:bg-secondary peer-checked:text-white peer-checked:border-secondary transition-colors text-sm hover:bg-gray-50">
                    Hire Talent
                  </div>
                </label>
              </div>
            </div>

            <div>
              <input
                type="text"
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Full Name"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <input
                type="email"
                autoComplete="email"
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Email address"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <input
                type="password"
                autoComplete="new-password"
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Password (min 6 characters)"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
