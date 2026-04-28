import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, applyToJob } from '../api/jobsApi';
import { MapPin, Briefcase, Clock, Building, DollarSign, ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

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
    (async () => {
      try { setJob(await getJobById(id)); }
      catch { toast.error('Failed to load job'); navigate('/jobs'); }
      finally { setLoading(false); }
    })();
  }, [id, navigate]);

  const handleApply = async () => {
    if (!isAuthenticated) { toast.error('Please login'); return navigate('/login'); }
    if (user?.role !== 'seeker') return toast.error('Only seekers can apply');
    if (job.applyUrl) return window.open(job.applyUrl, '_blank');
    try {
      setApplying(true); await applyToJob(id, coverLetter);
      toast.success('Applied successfully!'); setHasApplied(true);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setApplying(false); }
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-slate-400">Loading...</div>;
  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 hover:text-primary mb-6 transition-colors text-sm font-medium">
        <ArrowLeft size={16} className="mr-1" /> Back to jobs
      </button>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card-elevated overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h1 className="text-3xl font-black text-slate-900 mb-2">{job.title}</h1>
          <div className="flex items-center text-primary text-lg font-semibold gap-2">
            <Building size={20} /> {job.company || 'Confidential Company'}
          </div>
          <div className="flex flex-wrap gap-y-3 gap-x-6 mt-5 text-sm text-slate-500">
            <div className="flex items-center gap-1.5"><MapPin size={16} /> {job.location || 'Remote'}</div>
            <div className="flex items-center gap-1.5"><Briefcase size={16} /> <span className="capitalize">{job.jobType?.replace('-',' ') || 'Full time'}</span></div>
            {job.salary?.min && <div className="flex items-center gap-1.5"><DollarSign size={16} /> {job.salary.min} {job.salary.max ? `- ${job.salary.max}` : '+'} {job.salary.currency}</div>}
            <div className="flex items-center gap-1.5"><Clock size={16} /> {job.postedAt ? formatDistanceToNow(new Date(job.postedAt), { addSuffix: true }) : 'Recently'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="p-8 md:col-span-2">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Job Description</h3>
            <div className="text-slate-600 space-y-4 whitespace-pre-wrap leading-relaxed text-sm">{job.description}</div>
          </div>

          <div className="p-8 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-900 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills?.length > 0 ? job.skills.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg">{s}</span>
                )) : <span className="text-slate-400 text-sm">Not specified</span>}
              </div>
            </div>

            <div className="mt-8">
              {!job.applyUrl && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cover Letter (Optional)</label>
                  <textarea rows={4} disabled={hasApplied} className="input-field resize-none" placeholder="Why are you a good fit?"
                    value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
                </div>
              )}
              {hasApplied ? (
                <button disabled className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 font-bold py-3 px-4 rounded-xl border border-emerald-200">
                  <CheckCircle size={18} /> Applied
                </button>
              ) : (
                <button onClick={handleApply} disabled={applying}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                  {applying ? 'Applying...' : job.applyUrl ? <>Apply Externally <ExternalLink size={18} /></> : 'Apply Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
