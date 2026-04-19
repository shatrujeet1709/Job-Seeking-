import { Link } from 'react-router-dom';
import { ArrowRight, Search, Briefcase, Zap, Globe, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 to-white pt-24 pb-32">
        <div className="absolute top-0 right-0 -m-32 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -m-32 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-primary font-medium text-sm mb-8">
            <Sparkles size={16} /> AI-Powered Career Ecosystem
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
            Find the work you love.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Let AI do the matching.
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Whether you're looking for a full-time role, freelance gigs, or top talent, our platform connects you instantly using advanced AI models.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold text-lg rounded-2xl hover:bg-primary-dark transition-all hover:scale-105 shadow-xl shadow-indigo-200">
               Get Started Free
            </Link>
            <Link to="/jobs" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 hover:text-primary border border-gray-200 font-bold text-lg rounded-2xl transition-all hover:border-primary">
               Browse Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Role Cards */}
      <div className="py-24 bg-white relative z-10 -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Seeker */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                 <Search size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Job Seekers</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">Build your profile once and let Claude AI analyze thousands of jobs to find your perfect match with detailed explanations.</p>
              <Link to="/register" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-700">Join as Seeker <ArrowRight size={18} className="ml-1" /></Link>
            </div>
            
            {/* Recruiter */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                 <Briefcase size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Recruiters</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">Post jobs and get an instantly ranked list of candidates. Our AI highlights the best fits so you don't have to sift through resumes.</p>
              <Link to="/register" className="inline-flex items-center text-indigo-600 font-bold hover:text-indigo-700">Join as Recruiter <ArrowRight size={18} className="ml-1" /></Link>
            </div>

            {/* Freelancer */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                 <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Freelancers</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">Create gigs, showcase your portfolio, and get paid securely. Our escrow system guarantees payment for completed work.</p>
              <Link to="/register" className="inline-flex items-center text-orange-600 font-bold hover:text-orange-700">Join as Freelancer <ArrowRight size={18} className="ml-1" /></Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Board */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10 text-center">
            <div>
              <p className="text-5xl font-black text-white mb-2">10k+</p>
              <p className="text-gray-400 font-medium">Active Jobs</p>
            </div>
            <div>
              <p className="text-5xl font-black text-white mb-2">50k+</p>
              <p className="text-gray-400 font-medium">Job Seekers</p>
            </div>
            <div>
              <p className="text-5xl font-black text-white mb-2">2k+</p>
              <p className="text-gray-400 font-medium">Companies</p>
            </div>
            <div>
              <p className="text-5xl font-black text-white mb-2">1M+</p>
              <p className="text-gray-400 font-medium">AI Matches Made</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white py-12 border-t border-gray-100 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
           <div className="bg-primary p-1.5 rounded-lg"><Briefcase className="h-5 w-5 text-white" /></div>
           <span className="font-bold text-xl text-gray-900 tracking-tight">JobAI</span>
        </div>
        <p className="text-gray-500 text-sm">© 2026 JobAI Platform. Agentic build demo.</p>
      </footer>
    </div>
  );
}
