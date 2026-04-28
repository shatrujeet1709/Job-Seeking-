import { MapPin, Briefcase, Clock, Building, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function JobCard({ job }) {
  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Salary undisclosed';
    const sym = { INR: '₹', USD: '$', GBP: '£', EUR: '€' }[salary.currency] || salary.currency || '';
    if (salary.min && salary.max) return `${sym}${salary.min.toLocaleString()} - ${sym}${salary.max.toLocaleString()}`;
    if (salary.min) return `From ${sym}${salary.min.toLocaleString()}`;
    if (salary.max) return `Up to ${sym}${salary.max.toLocaleString()}`;
    return 'Salary undisclosed';
  };

  const timeAgo = job.postedAt ? formatDistanceToNow(new Date(job.postedAt), { addSuffix: true }) : 'Recently';

  return (
    <div className="card p-6 group h-full flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div className="min-w-0 pr-3">
          <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-primary transition-colors truncate">{job.title}</h3>
          <div className="flex items-center text-primary text-sm font-medium gap-1.5">
            <Building size={14} />
            <span className="truncate">{job.company || 'Confidential'}</span>
          </div>
        </div>
        {job.source && (
          <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-widest font-bold shrink-0">{job.source}</span>
        )}
      </div>

      <div className="flex flex-wrap gap-y-1.5 gap-x-4 mb-3 text-sm text-slate-500">
        <div className="flex items-center gap-1"><MapPin size={14} className="text-slate-400" />{job.location || 'Remote'}</div>
        <div className="flex items-center gap-1"><Briefcase size={14} className="text-slate-400" /><span className="capitalize">{job.jobType?.replace('-',' ') || 'Full time'}</span></div>
        <div className="flex items-center gap-1"><DollarSign size={14} className="text-slate-400" />{formatSalary(job.salary)}</div>
        <div className="flex items-center gap-1"><Clock size={14} className="text-slate-400" />{timeAgo}</div>
      </div>

      <div className="mb-4 h-10 overflow-hidden text-sm text-slate-400 leading-relaxed">{job.description?.substring(0, 130)}...</div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-auto">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto overflow-hidden h-7">
          {job.skills?.slice(0, 3).map((s, i) => (
            <span key={i} className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-medium rounded-md">{s}</span>
          ))}
          {job.skills?.length > 3 && <span className="px-2 py-0.5 bg-slate-50 text-slate-400 border border-slate-100 text-xs font-medium rounded-md">+{job.skills.length - 3}</span>}
        </div>
        <Link to={`/jobs/${job._id}`} className="btn-primary w-full sm:w-auto text-center px-5 py-2 text-sm">View Details</Link>
      </div>
    </div>
  );
}
