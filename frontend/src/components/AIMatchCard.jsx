import { Sparkles, MapPin, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AIMatchCard({ match }) {
  const { job, score, reason, missingSkills } = match;
  if (!job) return null;

  const scoreBadge = score >= 80 ? 'badge-high' : score >= 60 ? 'badge-mid' : 'badge-low';
  const borderAccent = score >= 80 ? 'border-emerald-200 hover:border-emerald-300' :
                       score >= 60 ? 'border-amber-200 hover:border-amber-300' :
                                     'border-red-200 hover:border-red-300';

  return (
    <div className={`card p-6 group ${borderAccent}`}>
      {score >= 80 && <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-50/80 to-transparent rounded-bl-[100px] pointer-events-none" />}

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="pr-4 min-w-0">
          <h3 className="font-bold text-slate-900 text-xl mb-1 group-hover:text-primary transition-colors truncate">{job.title}</h3>
          <p className="text-slate-500 text-sm flex items-center gap-2 flex-wrap">
            <span className="text-primary font-medium">{job.company}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1"><MapPin size={13} /> {job.location || 'Remote'}</span>
          </p>
        </div>
        <div className={`flex flex-col items-center px-4 py-2.5 rounded-xl shrink-0 ${scoreBadge}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
            <Sparkles size={10} /> Match
          </span>
          <span className="text-2xl font-black">{score}%</span>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-5 relative z-10">
        <div className="absolute -top-3 left-4 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md text-[10px] font-bold text-primary tracking-widest uppercase">AI Reasoning</div>
        <p className="text-slate-600 text-sm leading-relaxed mt-1.5"><span className="mr-1">🤖</span> {reason}</p>
      </div>

      {missingSkills?.length > 0 && (
        <div className="mb-5 relative z-10">
          <p className="text-xs font-bold text-amber-600 flex items-center gap-1.5 mb-2 uppercase tracking-wide">
            <AlertCircle size={13} /> Skills to Learn
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.map(s => (
              <span key={s} className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-medium">{s}</span>
            ))}
          </div>
        </div>
      )}

      <Link to={`/jobs/${job._id}`} className="btn-primary w-full text-center py-2.5 text-sm relative z-10">
        View Job & Apply
      </Link>
    </div>
  );
}
