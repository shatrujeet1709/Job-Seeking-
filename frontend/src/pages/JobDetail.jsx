import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, applyToJob } from '../api/jobsApi';
import { MapPin, Briefcase, Clock, Building, DollarSign, ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const { isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id);
        setJob(data);
        // We'd ideally check if applied here, or pass it down. Assuming not applied for now.
      } catch (err) {
        toast.error('Failed to load job details');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }
    if (user?.role !== 'seeker') {
      toast.error('Only job seekers can apply');
      return;
    }
    
    // External job applied
    if (job.applyUrl) {
      window.open(job.applyUrl, '_blank');
      return;
    }

    try {
      setApplying(true);
      await applyToJob(id, coverLetter);
      toast.success('Successfully applied!');
      setHasApplied(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary mb-6 transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Back to jobs
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex justify-between items-start">
             <div>
               <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
               <div className="flex items-center text-primary text-lg font-medium gap-2">
                 <Building size={20} />
                 {job.company || 'Confidential Company'}
               </div>
             </div>
          </div>
          
          <div className="flex flex-wrap gap-y-4 gap-x-6 mt-6 text-sm text-gray-600">
            <div className="flex items-center gap-1.5"><MapPin size={18} className="text-gray-400" /> {job.location || 'Remote'}</div>
            <div className="flex items-center gap-1.5"><Briefcase size={18} className="text-gray-400" /> <span className="capitalize">{job.jobType?.replace('-', ' ') || 'Full time'}</span></div>
             {job.salary?.min && (
               <div className="flex items-center gap-1.5"><DollarSign size={18} className="text-gray-400" /> {job.salary.min} {job.salary.max ? `- ${job.salary.max}` : '+'} {job.salary.currency}</div>
             )}
            <div className="flex items-center gap-1.5"><Clock size={18} className="text-gray-400" /> {job.postedAt ? formatDistanceToNow(new Date(job.postedAt), { addSuffix: true }) : 'Recently'}</div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b border-gray-100">
           <div className="p-8 md:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
              {/* Note: ideally we render HTML safely if it's rich text. Using text for now. */}
              <div className="prose prose-sm max-w-none text-gray-600 space-y-4 whitespace-pre-wrap">
                 {job.description}
              </div>
           </div>
           
           <div className="p-8 bg-gray-50 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills?.length > 0 ? job.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg shadow-sm">
                      {skill}
                    </span>
                  )) : <span className="text-gray-500 text-sm">Not specified</span>}
                </div>
              </div>
              
              <div className="mt-8">
                 {!job.applyUrl && (
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (Optional)</label>
                        <textarea 
                           rows={4} 
                           disabled={hasApplied}
                           className="w-full border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm text-gray-900 border px-3 py-2 disabled:bg-gray-100" 
                           placeholder="Why are you a good fit?"
                           value={coverLetter}
                           onChange={(e) => setCoverLetter(e.target.value)}
                        />
                     </div>
                 )}
                 {hasApplied ? (
                    <button disabled className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 font-bold py-3 px-4 rounded-xl border border-green-200">
                       <CheckCircle size={18} /> Applied
                    </button>
                 ) : (
                    <button 
                       onClick={handleApply}
                       disabled={applying}
                       className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md shadow-indigo-200 disabled:opacity-70"
                    >
                       {applying ? 'Applying...' : job.applyUrl ? <>Apply Externally <ExternalLink size={18} /></> : 'Apply Now'}
                    </button>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
