import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { LogOut, Menu, X, Briefcase, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-primary p-2 rounded-xl">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">JobAI</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Profile
                </Link>
                <Link to="/jobs" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Jobs Feed
                </Link>
                <Link to="/ai-matches" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1">
                  <Sparkles size={14} /> AI Matches
                </Link>
                <Link to="/freelance" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Freelancers
                </Link>
                <div className="relative ml-3 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {user?.avatar ? (
                       <img className="h-8 w-8 rounded-full object-cover" src={user.avatar} alt="Avatar" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-500 capitalize">{user?.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full text-gray-400 hover:text-danger hover:bg-red-50 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors">Log in</Link>
                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-dark font-medium transition-colors">Sign up</Link>
              </div>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-100 text-center py-4 bg-gray-50">
           {isAuthenticated ? (
             <div className="space-y-4 px-4">
               <div className="flex items-center justify-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold text-lg">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
               </div>
               <Link to="/dashboard" className="block text-gray-700 hover:text-primary">Dashboard</Link>
               <Link to="/profile" className="block text-gray-700 hover:text-primary">Profile</Link>
               <Link to="/ai-matches" className="block text-gray-700 hover:text-primary">AI Matches</Link>
               <Link to="/freelance" className="block text-gray-700 hover:text-primary">Freelancers</Link>
               <button onClick={handleLogout} className="w-full text-center text-danger py-2">Logout</button>
             </div>
           ) : (
             <div className="space-y-4">
               <Link to="/login" className="block text-gray-600">Login</Link>
               <Link to="/register" className="block text-primary font-medium">Sign up</Link>
             </div>
           )}
        </div>
      )}
    </nav>
  );
}
