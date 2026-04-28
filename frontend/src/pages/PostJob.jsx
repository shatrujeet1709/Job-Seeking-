import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Plus, X, Users, Calendar, Clock } from 'lucide-react';

export default function PostJob() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => { const s = skillInput.trim(); if (s && !skills.includes(s) && skills.length < 30) { setSkills([...skills, s]); setSkillInput(''); } };
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/jobs', {
        ...data, skills,
        salary: { min: data.salaryMin ? +data.salaryMin : undefined, max: data.salaryMax ? +data.salaryMax : undefined, currency: 'INR' },
        openings: data.openings ? +data.openings : 1,
        applicationDeadline: data.applicationDeadline || undefined,
      });
      toast.success('Job posted!'); navigate('/recruiter');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Post a New Job</h1>
        <p className="text-slate-500 mb-8">Fill in the details to attract the best candidates.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 card-elevated p-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title *</label>
            <div className="relative">
              <Briefcase size={16} className="absolute left-3 top-3.5 text-slate-400" />
              <input {...register('title', { required: 'Required', minLength: { value: 3, message: 'Min 3 chars' } })}
                placeholder="e.g. Senior React Developer" className="input-field pl-10" />
            </div>
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-2">Company</label><input {...register('company')} placeholder="Company name" className="input-field" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
              <div className="relative"><MapPin size={16} className="absolute left-3 top-3.5 text-slate-400" /><input {...register('location')} placeholder="e.g. Mumbai" className="input-field pl-10" /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-2">Job Type</label>
              <select {...register('jobType')} className="input-field">
                <option value="">Select</option><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="remote">Remote</option><option value="contract">Contract</option>
              </select>
            </div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-2"><Clock size={14} className="inline mr-1" />Experience Required</label>
              <select {...register('experienceRequired')} className="input-field">
                <option value="">Select</option><option value="0-1">0-1 years (Fresher)</option><option value="2-4">2-4 years</option><option value="5-7">5-7 years</option><option value="8+">8+ years (Senior)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-2"><Users size={14} className="inline mr-1" />Number of Openings</label>
              <input type="number" {...register('openings')} min="1" placeholder="1" className="input-field" />
            </div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-2"><Calendar size={14} className="inline mr-1" />Application Deadline</label>
              <input type="date" {...register('applicationDeadline')} className="input-field" />
            </div>
          </div>

          <div><label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea {...register('description')} rows={5} placeholder="Describe the role, responsibilities, and requirements..." className="input-field resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Required Skills</label>
            <div className="flex gap-2 mb-2">
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder="Type and press Enter" className="input-field flex-1" />
              <button type="button" onClick={addSkill} className="px-3 py-2 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-100 border border-sky-200"><Plus size={18} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => <span key={s} className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-medium flex items-center gap-1 border border-sky-200">{s} <button type="button" onClick={() => setSkills(skills.filter(x => x !== s))}><X size={12} /></button></span>)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-2">Min Salary (₹)</label>
              <div className="relative"><DollarSign size={16} className="absolute left-3 top-3.5 text-slate-400" /><input {...register('salaryMin')} type="number" placeholder="50000" className="input-field pl-10" /></div>
            </div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-2">Max Salary (₹)</label>
              <div className="relative"><DollarSign size={16} className="absolute left-3 top-3.5 text-slate-400" /><input {...register('salaryMax')} type="number" placeholder="100000" className="input-field pl-10" /></div>
            </div>
          </div>

          <div><label className="block text-sm font-semibold text-slate-700 mb-2">External Apply URL (optional)</label>
            <input {...register('applyUrl')} type="url" placeholder="https://..." className="input-field" />
          </div>

          <button type="submit" disabled={loading} className="btn-secondary w-full py-3 disabled:opacity-70">
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
