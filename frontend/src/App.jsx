import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { getMe } from './store/authSlice';
import useSocket from './hooks/useSocket';

// ─── Code Splitting: Lazy load all pages ───
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Jobs = lazy(() => import('./pages/Jobs'));
const JobDetail = lazy(() => import('./pages/JobDetail'));
const AIRecommend = lazy(() => import('./pages/AIRecommend'));
const FreelanceMarket = lazy(() => import('./pages/FreelanceMarket'));
const FreelancerDashboard = lazy(() => import('./pages/FreelancerDashboard'));
const RecruiterDashboard = lazy(() => import('./pages/RecruiterDashboard'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Home = lazy(() => import('./pages/Home'));
const Messages = lazy(() => import('./pages/Messages'));
const PostJob = lazy(() => import('./pages/PostJob'));
const PostGig = lazy(() => import('./pages/PostGig'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Loading spinner for lazy-loaded routes
const PageLoader = () => (
  <div className="h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-slate-400 font-medium">Loading...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  if (loading) return <PageLoader />;
  if (!isAuthenticated && localStorage.getItem('token') === null) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  useSocket();

  useEffect(() => { if (token) dispatch(getMe()); }, [dispatch, token]);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-[#F8FAFF] font-sans text-slate-800">
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-20">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/jobs/:id" element={<JobDetail />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                  <Route path="/messages/:userId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                  <Route path="/ai-matches" element={<ProtectedRoute roles={['seeker']}><AIRecommend /></ProtectedRoute>} />
                  <Route path="/freelance" element={<ProtectedRoute><FreelanceMarket /></ProtectedRoute>} />
                  <Route path="/freelance/post" element={<ProtectedRoute roles={['freelancer']}><PostGig /></ProtectedRoute>} />
                  <Route path="/freelance/dashboard" element={<ProtectedRoute roles={['freelancer']}><FreelancerDashboard /></ProtectedRoute>} />
                  <Route path="/recruiter" element={<ProtectedRoute roles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>} />
                  <Route path="/recruiter/post-job" element={<ProtectedRoute roles={['recruiter']}><PostJob /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />

            <Toaster position="top-right" toastOptions={{
              duration: 4000,
              style: { borderRadius: '12px', background: '#fff', color: '#1E293B', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }
            }} />
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
