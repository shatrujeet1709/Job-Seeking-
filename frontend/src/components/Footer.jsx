import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 mt-auto bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-3"><span className="gradient-text">JobPlatform</span></h3>
            <p className="text-slate-500 text-sm leading-relaxed">AI-powered career platform connecting job seekers, recruiters, and freelancers.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">For Seekers</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="/jobs" className="hover:text-primary transition-colors">Browse Jobs</a></li>
              <li><a href="/ai-matches" className="hover:text-primary transition-colors">AI Recommendations</a></li>
              <li><a href="/profile" className="hover:text-primary transition-colors">Build Profile</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">For Recruiters</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="/recruiter" className="hover:text-secondary transition-colors">Post a Job</a></li>
              <li><a href="/recruiter" className="hover:text-secondary transition-colors">Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Freelance</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="/freelance" className="hover:text-amber-600 transition-colors">Browse Gigs</a></li>
              <li><a href="/freelance" className="hover:text-amber-600 transition-colors">Post a Gig</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} JobPlatform. All rights reserved.</p>
          <p className="text-slate-400 text-sm flex items-center gap-1">Made with <Heart size={14} className="text-rose-500 fill-rose-500" /> using AI</p>
        </div>
      </div>
    </footer>
  );
}
