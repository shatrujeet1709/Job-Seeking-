import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="text-[120px] font-black leading-none gradient-text mb-4">404</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Page Not Found</h2>
        <p className="text-slate-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary flex items-center gap-2 px-6 py-3"><Home size={18} /> Home</Link>
          <button onClick={() => window.history.back()} className="btn-outline flex items-center gap-2 px-6 py-3"><ArrowLeft size={18} /> Go Back</button>
        </div>
      </motion.div>
    </div>
  );
}
