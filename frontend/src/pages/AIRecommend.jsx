import { useEffect } from 'react';
import useAIMatch from '../hooks/useAIMatch';
import AIMatchCard from '../components/AIMatchCard';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AIRecommend() {
  const { matches, loading, error, fetchRecommendations } = useAIMatch();

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10 lg:mb-16 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
           <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
          Personalized AI Job Matches
        </h1>
        <p className="text-xl text-gray-500">
          Our AI analyzes your skills, experience, and preferences to find jobs where you have the highest chance of success.
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <h3 className="text-xl font-medium text-gray-900 animate-pulse">Claude AI is analyzing your profile...</h3>
          <p className="text-gray-500 mt-2">Comparing your background against thousands of active jobs.</p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-800 mb-2">{error}</h3>
          <p className="text-red-600 mb-6">You need to complete your profile with skills and experience before AI can match you.</p>
          <Link to="/profile" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-red-600 hover:bg-red-700">
            Complete Profile
          </Link>
        </div>
      )}

      {!loading && !error && matches.length === 0 && (
         <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-900">No matches found right now.</h3>
            <p className="text-gray-500 mt-2">Try updating your profile or check back later as new jobs are added.</p>
         </div>
      )}

      {!loading && !error && matches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {matches.map((match, index) => (
            <AIMatchCard key={index} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
