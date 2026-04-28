import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Package, Plus, X, Upload, Sparkles } from 'lucide-react';

const CATS = ['Web Development','Mobile Development','Design','Writing','Video & Animation','Marketing','Data Science','AI & ML','Other'];

export default function PostGig() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [packages, setPackages] = useState([{ name: 'basic', description: '', price: '', deliveryDays: '', revisions: 1 }]);

  const addSkill = () => { const s = skillInput.trim(); if (s && !skills.includes(s) && skills.length < 20) { setSkills([...skills, s]); setSkillInput(''); } };
  const addPkg = () => { if (packages.length >= 3) return; const n = ['basic','standard','premium'].find(x => !packages.some(p => p.name === x)); if (n) setPackages([...packages, { name: n, description: '', price: '', deliveryDays: '', revisions: 1 }]); };
  const updatePkg = (i, f, v) => { const u = [...packages]; u[i][f] = v; setPackages(u); };

  const onSubmit = async (data) => {
    if (packages.some(p => !p.price || !p.deliveryDays)) return toast.error('Fill all package details');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', data.title); fd.append('description', data.description); fd.append('category', data.category);
      fd.append('packages', JSON.stringify(packages.map(p => ({ ...p, price: +p.price, deliveryDays: +p.deliveryDays, revisions: +p.revisions }))));
      skills.forEach(s => fd.append('skills[]', s));
      if (data.images?.[0]) for (let i = 0; i < Math.min(data.images.length, 5); i++) fd.append('images', data.images[i]);
      await api.post('/freelance', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Gig posted!'); navigate('/freelance');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-2"><Sparkles className="text-amber-500" /> Post a Gig</h1>
        <p className="text-slate-500 mb-8">Create your service offering and start earning.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 card-elevated p-8">
          <div><label className="block text-sm font-semibold text-slate-700 mb-2">Gig Title *</label>
            <input {...register('title', { required: 'Required', minLength: { value: 5, message: 'Min 5 chars' } })} placeholder="I will build your React website..." className="input-field" />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div><label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
            <select {...register('category')} className="input-field"><option value="">Select</option>{CATS.map(c => <option key={c} value={c}>{c}</option>)}</select>
          </div>

          <div><label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
            <textarea {...register('description', { required: 'Required', minLength: { value: 20, message: 'Min 20 chars' } })} rows={5} placeholder="Describe your service..." className="input-field resize-none" />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div><label className="block text-sm font-semibold text-slate-700 mb-2">Skills</label>
            <div className="flex gap-2 mb-2">
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} placeholder="Add a skill..." className="input-field flex-1" />
              <button type="button" onClick={addSkill} className="px-3 py-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 border border-amber-200"><Plus size={18} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => <span key={s} className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium flex items-center gap-1 border border-amber-200">{s} <button type="button" onClick={() => setSkills(skills.filter(x => x !== s))}><X size={12} /></button></span>)}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Package size={16} /> Pricing Packages</label>
              {packages.length < 3 && <button type="button" onClick={addPkg} className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1"><Plus size={14} /> Add</button>}
            </div>
            <div className="space-y-4">
              {packages.map((pkg, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900 capitalize">{pkg.name}</span>
                    {packages.length > 1 && <button type="button" onClick={() => setPackages(packages.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-500"><X size={16} /></button>}
                  </div>
                  <input value={pkg.description} onChange={e => updatePkg(i, 'description', e.target.value)} placeholder="What's included..." className="input-field" />
                  <div className="grid grid-cols-3 gap-3">
                    <input type="number" value={pkg.price} onChange={e => updatePkg(i, 'price', e.target.value)} placeholder="Price (₹)" className="input-field" min="1" />
                    <input type="number" value={pkg.deliveryDays} onChange={e => updatePkg(i, 'deliveryDays', e.target.value)} placeholder="Days" className="input-field" min="1" />
                    <input type="number" value={pkg.revisions} onChange={e => updatePkg(i, 'revisions', e.target.value)} placeholder="Revisions" className="input-field" min="0" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div><label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"><Upload size={16} /> Images (max 5)</label>
            <input type="file" accept="image/*" multiple {...register('images')} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:bg-amber-50 file:text-amber-600 hover:file:bg-amber-100 cursor-pointer" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-70 bg-gradient-to-r from-amber-500 to-orange-500 shadow-md shadow-amber-200">
            {loading ? 'Posting...' : 'Publish Gig'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
