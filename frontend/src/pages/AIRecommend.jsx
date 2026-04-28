import { useEffect } from 'react';
import useAIMatch from '../hooks/useAIMatch';
import AIMatchCard from '../components/AIMatchCard';
import { Sparkles, Brain, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AIRecommend() {
  const { matches, loading, error, fetchRecommendations } = useAIMatch();
  useEffect(() => { fetchRecommendations(); }, [fetchRecommendations]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 shadow-md shadow-primary/20">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Personalized <span className="gradient-text">AI Matches</span>
        </h1>
        <p className="text-lg text-slate-500">Our AI analyzes your profile to find jobs where you have the highest chance of success.</p>
      </motion.div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-5">
            <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Brain size={28} className="absolute inset-0 m-auto text-primary animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 animate-pulse">AI is analyzing your profile...</h3>
          <p className="text-slate-500 mt-2">Comparing your background against thousands of active jobs.</p>
        </div>
      )}

      {!loading && error && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-10 text-center max-w-2xl mx-auto border-red-200">
          <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">{error}</h3>
          <p className="text-slate-500 mb-6">Complete your profile with skills and experience to get recommendations.</p>
          <Link to="/profile" className="btn-primary inline-flex items-center gap-2">Complete Profile</Link>
        </motion.div>
      )}

      {!loading && !error && matches.length === 0 && (
        <div className="text-center py-20">
          <Sparkles size={48} className="mx-auto mb-4 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-900">No matches found right now.</h3>
          <p className="text-slate-500 mt-2">Try updating your profile or check back later.</p>
        </div>
      )}

      {!loading && !error && matches.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((match, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <AIMatchCard match={match} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
