import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, User, Star, Plus, MessageSquare } from 'lucide-react';
import useSocket from '../hooks/useSocket'; // Initialize socket connection

export default function Dashboard() {
  const { user } = useSelector(state => state.auth);
  useSocket(); // Kick off real-time connection when on dashboard

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex items-center gap-6">
           {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md" />
           ) : (
              <div className="w-24 h-24 rounded-2xl bg-indigo-100 flex items-center justify-center text-primary font-bold text-4xl border-4 border-white shadow-md">
                 {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
           )}
           <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {user?.name?.split(' ')[0]}!</h1>
              <p className="text-gray-500 capitalize font-medium flex items-center gap-2">
                 <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                 {user?.role} Dashboard
              </p>
           </div>
        </div>
        
        <div className="w-full md:w-auto">
          {user?.role === 'seeker' && (
             <Link to="/ai-matches" className="w-full md:w-auto flex flex-col items-center justify-center px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-indigo-50 hover:border-indigo-100 transition-colors group cursor-pointer text-center">
                 <span className="text-sm font-medium text-gray-500 mb-1">Your AI Match Score</span>
                 <span className="text-3xl font-black text-primary group-hover:scale-110 transition-transform">92%</span>
             </Link>
          )}
          {user?.role === 'recruiter' && (
             <Link to="/recruiter" className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-indigo-200">
                Go to Recruiter Console <ArrowRight size={20}/>
             </Link>
          )}
          {user?.role === 'freelancer' && (
             <Link to="/freelance" className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-yellow-600 transition-colors shadow-lg shadow-accent/30">
                Manage Gigs <ArrowRight size={20}/>
             </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Actions Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
             <User size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Profile & Resume</h3>
          <p className="text-sm text-gray-500 mb-6 flex-1">Keep your profile updated to get the best AI recommendations and stand out.</p>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-3 mt-auto">
             <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
          </div>
          <p className="text-xs text-gray-500 mb-4 font-medium">75% Complete</p>
          <Link to="/profile" className="w-full text-center py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Edit Profile
          </Link>
        </div>

        {/* Dynamic Card based on role */}
        {user?.role === 'seeker' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
               <Briefcase size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Job Applications</h3>
            <p className="text-sm text-gray-500 mb-6 flex-1">Track the status of your recent applications.</p>
            <div className="space-y-3 mb-6">
               <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="text-sm font-medium text-gray-900">Frontend Developer</span>
                  <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Viewed</span>
               </div>
               <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="text-sm font-medium text-gray-900">React Engineer</span>
                  <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">Applied</span>
               </div>
            </div>
            <Link to="/jobs" className="w-full text-center py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mt-auto">
              Browse Jobs
            </Link>
          </div>
        )}

        {/* Messages Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
             <MessageSquare size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Messages</h3>
          <p className="text-sm text-gray-500 mb-6 flex-1">Communicate with recruiters and freelancers.</p>
          <div className="flex flex-col items-center justify-center py-6 text-gray-400">
             <MessageSquare size={32} className="mb-2 opacity-50" />
             <p className="text-sm">No new messages</p>
          </div>
          <button className="w-full text-center py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mt-auto disabled:opacity-50" disabled>
            Go to Inbox
          </button>
        </div>
      </div>
    </div>
  );
}
