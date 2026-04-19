import { Sparkles, MapPin, Briefcase, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AIMatchCard({ match }) {
  const { job, score, reason, missingSkills } = match;

  if (!job) return null; // Safety check

  const scoreColor =
    score >= 80 ? 'bg-green-100 text-green-700 border-green-200' :
    score >= 60 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                  'bg-red-100 text-red-700 border-red-200';

  return (
    <div className={`bg-white rounded-2xl border-2 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden ${
      score >= 80 ? 'border-green-100 uppercase' : 'border-gray-100'
    }`}>
      {/* Decorative gradient for top matches */}
      {score >= 80 && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-50 to-transparent rounded-bl-[100px] -z-10 opacity-50"></div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="pr-4">
          <h3 className="font-bold text-gray-900 text-xl mb-1">{job.title}</h3>
          <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
            <span className="text-primary">{job.company}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> {job.location || 'Remote'}</span>
          </p>
        </div>
        <div className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl border ${scoreColor}`}>
          <span className="text-xs font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
             <Sparkles size={12} /> Match
          </span>
          <span className="text-xl font-black">{score}%</span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-5 relative">
        <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-indigo-400 tracking-wider uppercase">AI Reasoning</div>
        <p className="text-gray-700 text-sm leading-relaxed mt-1">
           <span className="mr-1">🤖</span> {reason}
        </p>
      </div>

      {missingSkills?.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-bold text-orange-600 flex items-center gap-1.5 mb-2 uppercase tracking-wide">
            <AlertCircle size={14} /> Recommended to Learn
          </p>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map(s => (
              <span key={s} className="px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-100 rounded-lg text-xs font-medium">{s}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-auto">
        <Link to={`/jobs/${job._id}`}
           className="flex-1 bg-primary text-white text-center py-2.5 rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm shadow-indigo-200">
           View Job & Apply
        </Link>
      </div>
    </div>
  );
}
