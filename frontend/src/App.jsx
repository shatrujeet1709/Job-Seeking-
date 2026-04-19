import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import AIRecommend from './pages/AIRecommend';
import FreelanceMarket from './pages/FreelanceMarket';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import { getMe } from './store/authSlice';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated && localStorage.getItem('token') === null) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      dispatch(getMe());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/ai-matches" element={
              <ProtectedRoute>
                <AIRecommend />
              </ProtectedRoute>
            } />
            <Route path="/freelance" element={
              <ProtectedRoute>
                <FreelanceMarket />
              </ProtectedRoute>
            } />
            <Route path="/recruiter" element={
              <ProtectedRoute>
                <RecruiterDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Toaster position="top-right" toastOptions={{ duration: 4000, 
            style: { borderRadius: '12px', background: '#333', color: '#fff' }
        }} />
      </div>
    </Router>
  );
}

export default App;
