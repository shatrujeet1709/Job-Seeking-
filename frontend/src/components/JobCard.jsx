import { MapPin, Briefcase, Clock, Building, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function JobCard({ job }) {
  // Try to determine format for salary
  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Salary undisclosed';
    const currencyMap = {
      'INR': '₹',
      'USD': '$',
      'GBP': '£',
      'EUR': '€'
    };
    const sym = currencyMap[salary.currency] || salary.currency;
    if (salary.min && salary.max) return `${sym}${salary.min.toLocaleString()} - ${sym}${salary.max.toLocaleString()}`;
    if (salary.min) return `From ${sym}${salary.min.toLocaleString()}`;
    if (salary.max) return `Up to ${sym}${salary.max.toLocaleString()}`;
    return 'Salary undisclosed';
  };

  const timeAgo = job.postedAt ? formatDistanceToNow(new Date(job.postedAt), { addSuffix: true }) : 'Recently';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-xl font-sans mb-1">{job.title}</h3>
          <div className="flex items-center text-primary text-sm font-medium gap-1 mb-2">
            <Building size={16} />
            {job.company || 'Confidential Company'}
          </div>
        </div>
        
        {job.source && (
          <span className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-2 py-1 rounded-md uppercase tracking-wider font-semibold">
            {job.source}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <MapPin size={16} className="text-gray-400" />
          {job.location || 'Remote'}
        </div>
        <div className="flex items-center gap-1">
          <Briefcase size={16} className="text-gray-400" />
          <span className="capitalize">{job.jobType?.replace('-', ' ') || 'Full time'}</span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign size={16} className="text-gray-400" />
          {formatSalary(job.salary)}
        </div>
        <div className="flex items-center gap-1">
          <Clock size={16} className="text-gray-400" />
          {timeAgo}
        </div>
      </div>

      <div className="mb-6 h-12 overflow-hidden text-sm text-gray-500 leading-relaxed text-ellipsis">
         {job.description?.substring(0, 150)}...
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto overflow-hidden h-8">
          {job.skills?.slice(0, 3).map((skill, i) => (
            <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg">
              {skill}
            </span>
          ))}
          {job.skills?.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
        
        <Link 
          to={`/jobs/${job._id}`}
          className="w-full sm:w-auto bg-primary text-white text-center px-6 py-2 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
