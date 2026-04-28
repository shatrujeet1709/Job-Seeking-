import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProfile, saveProfile, clearProfileError } from '../store/profileSlice';
import toast from 'react-hot-toast';
import { User, Briefcase, GraduationCap, Link as LinkIcon, Plus, Trash2, Building2, Phone, MapPin, Clock, Globe, Zap, Languages, DollarSign } from 'lucide-react';
import UploadResume from '../components/UploadResume';
import SkillBadge from '../components/SkillBadge';

export default function Profile() {
  const dispatch = useDispatch();
  const { data: profile, loading, saving, error } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || 'seeker';
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [langInput, setLangInput] = useState('');
  const [languages, setLanguages] = useState([]);
  const [locInput, setLocInput] = useState('');
  const [preferredLocations, setPreferredLocations] = useState([]);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      headline: '', summary: '', location: '', phone: '', linkedin: '', github: '', portfolio: '',
      expectedSalary: '', jobType: '', availability: '',
      education: [], experience: [],
      companyName: '', companyWebsite: '', companyDescription: '', companySize: '', industry: '',
      professionalTitle: '', hourlyRate: '', availabilityStatus: '', responseTime: '',
    }
  });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: 'education' });
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: 'experience' });

  useEffect(() => { dispatch(fetchMyProfile()); }, [dispatch]);
  useEffect(() => {
    if (profile) {
      reset({
        headline: profile.headline || '', summary: profile.summary || '', location: profile.location || '',
        phone: profile.phone || '', linkedin: profile.linkedin || '', github: profile.github || '', portfolio: profile.portfolio || '',
        expectedSalary: profile.expectedSalary || '', jobType: profile.jobType || '', availability: profile.availability || '',
        education: profile.education || [],
        experience: profile.experience ? profile.experience.map(e => ({ ...e, from: e.from ? e.from.substring(0, 10) : '', to: e.to ? e.to.substring(0, 10) : '' })) : [],
        companyName: profile.companyName || '', companyWebsite: profile.companyWebsite || '',
        companyDescription: profile.companyDescription || '', companySize: profile.companySize || '', industry: profile.industry || '',
        professionalTitle: profile.professionalTitle || '', hourlyRate: profile.hourlyRate || '',
        availabilityStatus: profile.availabilityStatus || '', responseTime: profile.responseTime || '',
      });
      setSkills(profile.skills || []);
      setLanguages(profile.languages || []);
      setPreferredLocations(profile.preferredLocations || []);
    }
  }, [profile, reset]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearProfileError()); } }, [error, dispatch]);

  const addTag = (input, setInput, list, setList) => (e) => {
    if (e.key === 'Enter' || e.type === 'click') { e.preventDefault(); const v = input.trim(); if (v && !list.includes(v)) { setList([...list, v]); setInput(''); } }
  };

  const onSubmit = (data) => {
    dispatch(saveProfile({ ...data, skills, languages, preferredLocations })).then(r => { if (!r.error) toast.success('Profile saved!'); });
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-slate-400">Loading profile...</div>;

  const sectionClass = "card-elevated p-6 sm:p-8";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const inputClass = "input-field";
  const sectionHeader = (icon, title, color = 'indigo') => (
    <div className="flex items-center gap-2 mb-6 border-b pb-4 border-slate-100">
      <div className={`w-8 h-8 rounded-lg bg-${color}-50 text-${color}-600 flex items-center justify-center border border-${color}-100`}>{icon}</div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
    </div>
  );

  const roleLabel = { seeker: 'Job Seeker', recruiter: 'Recruiter', freelancer: 'Freelancer' }[role];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Your Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Build your profile to get better AI recommendations.</p>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
          role === 'seeker' ? 'bg-sky-50 text-sky-700 border border-sky-200'
          : role === 'recruiter' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
          : 'bg-amber-50 text-amber-700 border border-amber-200'
        }`}>{roleLabel}</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* === BASIC INFO (ALL ROLES) === */}
        <div className={sectionClass}>
          {sectionHeader(<User size={16} />, 'Basic Information')}
          <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4"><label className={labelClass}>Headline</label><input type="text" {...register('headline')} placeholder="e.g. Full Stack Developer | 3 YOE" className={inputClass} /></div>
            <div className="sm:col-span-2"><label className={labelClass}>Location</label><input type="text" {...register('location')} placeholder="e.g. Bangalore" className={inputClass} /></div>
            <div className="sm:col-span-3"><label className={labelClass}><Phone size={14} className="inline mr-1" />Phone</label><input type="tel" {...register('phone')} placeholder="+91 9876543210" className={inputClass} /></div>
            <div className="sm:col-span-3"><label className={labelClass}>LinkedIn</label><input type="url" {...register('linkedin')} placeholder="https://linkedin.com/in/..." className={inputClass} /></div>
            <div className="sm:col-span-6"><label className={labelClass}>Professional Summary</label><textarea {...register('summary')} rows={3} className={inputClass} /></div>
          </div>
        </div>

        {/* === RECRUITER: Company Info === */}
        {role === 'recruiter' && (
          <div className={sectionClass}>
            {sectionHeader(<Building2 size={16} />, 'Company Information', 'indigo')}
            <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3"><label className={labelClass}>Company Name *</label><input type="text" {...register('companyName')} placeholder="Acme Corp" className={inputClass} /></div>
              <div className="sm:col-span-3"><label className={labelClass}>Company Website</label><input type="url" {...register('companyWebsite')} placeholder="https://acme.com" className={inputClass} /></div>
              <div className="sm:col-span-3"><label className={labelClass}>Company Size</label>
                <select {...register('companySize')} className={inputClass}>
                  <option value="">Select</option><option value="1-10">1-10 employees</option><option value="11-50">11-50</option><option value="51-200">51-200</option><option value="201-500">201-500</option><option value="500+">500+</option>
                </select>
              </div>
              <div className="sm:col-span-3"><label className={labelClass}>Industry</label>
                <select {...register('industry')} className={inputClass}>
                  <option value="">Select</option>
                  {['IT & Software', 'Finance & Banking', 'Healthcare', 'Education', 'E-Commerce', 'Manufacturing', 'Consulting', 'Media & Entertainment', 'Real Estate', 'Other'].map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="sm:col-span-6"><label className={labelClass}>About the Company</label><textarea {...register('companyDescription')} rows={3} placeholder="Tell candidates about your company..." className={inputClass} /></div>
            </div>
          </div>
        )}

        {/* === FREELANCER: Professional Details === */}
        {role === 'freelancer' && (
          <div className={sectionClass}>
            {sectionHeader(<Zap size={16} />, 'Freelancer Details', 'amber')}
            <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3"><label className={labelClass}>Professional Title</label><input type="text" {...register('professionalTitle')} placeholder="Full Stack Developer" className={inputClass} /></div>
              <div className="sm:col-span-3"><label className={labelClass}><DollarSign size={14} className="inline mr-1" />Hourly Rate (₹)</label><input type="number" {...register('hourlyRate')} placeholder="1500" className={inputClass} /></div>
              <div className="sm:col-span-3"><label className={labelClass}>Availability</label>
                <select {...register('availabilityStatus')} className={inputClass}>
                  <option value="">Select</option><option value="available">✅ Available</option><option value="busy">🔴 Busy</option><option value="away">🟡 Away</option>
                </select>
              </div>
              <div className="sm:col-span-3"><label className={labelClass}>Response Time</label>
                <select {...register('responseTime')} className={inputClass}>
                  <option value="">Select</option><option value="1-hour">Within 1 hour</option><option value="24-hours">Within 24 hours</option><option value="2-3-days">2-3 days</option>
                </select>
              </div>
              <div className="sm:col-span-6">
                <label className={labelClass}><Languages size={14} className="inline mr-1" />Languages</label>
                <div className="flex mt-1">
                  <input type="text" value={langInput} onChange={e => setLangInput(e.target.value)} onKeyDown={addTag(langInput, setLangInput, languages, setLanguages)}
                    className="input-field rounded-r-none" placeholder="e.g. English, Hindi" />
                  <button type="button" onClick={addTag(langInput, setLangInput, languages, setLanguages)} className="px-4 py-2 border border-l-0 border-slate-200 rounded-r-xl bg-slate-50 text-sm font-medium text-slate-600 hover:bg-slate-100">Add</button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {languages.map((l, i) => <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-200 flex items-center gap-1">{l} <button type="button" onClick={() => setLanguages(languages.filter(x => x !== l))} className="hover:text-red-500">×</button></span>)}
                  {languages.length === 0 && <span className="text-sm text-slate-400">No languages added</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === Skills & Resume (ALL ROLES) === */}
        <div className={sectionClass}>
          <h3 className="text-lg font-bold text-slate-900 border-b pb-4 border-slate-100 mb-6">Skills {role !== 'recruiter' && '& Resume'}</h3>
          <div className={`grid grid-cols-1 gap-8 ${role !== 'recruiter' ? 'md:grid-cols-2' : ''}`}>
            <div>
              <label className={labelClass}>Technical Skills</label>
              <div className="flex mt-1">
                <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={addTag(skillInput, setSkillInput, skills, setSkills)}
                  className="input-field rounded-r-none" placeholder="Add a skill, press Enter" />
                <button type="button" onClick={addTag(skillInput, setSkillInput, skills, setSkills)} className="px-4 py-2 border border-l-0 border-slate-200 rounded-r-xl bg-slate-50 text-sm font-medium text-slate-600 hover:bg-slate-100">Add</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((s, i) => <SkillBadge key={i} skill={s} onRemove={(v) => setSkills(skills.filter(x => x !== v))} />)}
                {skills.length === 0 && <span className="text-sm text-slate-400">No skills added</span>}
              </div>
            </div>
            {role !== 'recruiter' && <div><UploadResume currentUrl={profile?.resumeUrl} /></div>}
          </div>
        </div>

        {/* === SEEKER: Job Preferences === */}
        {role === 'seeker' && (
          <div className={sectionClass}>
            {sectionHeader(<MapPin size={16} />, 'Job Preferences', 'sky')}
            <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2"><label className={labelClass}>Expected Salary (₹/month)</label><input type="number" {...register('expectedSalary')} className={inputClass} /></div>
              <div className="sm:col-span-2"><label className={labelClass}>Job Type</label>
                <select {...register('jobType')} className={inputClass}>
                  <option value="">Select</option><option value="full-time">Full Time</option><option value="part-time">Part Time</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div className="sm:col-span-2"><label className={labelClass}><Clock size={14} className="inline mr-1" />Availability</label>
                <select {...register('availability')} className={inputClass}>
                  <option value="">Select</option><option value="immediately">Immediately</option><option value="2-weeks">In 2 weeks</option><option value="1-month">In 1 month</option><option value="3-months">In 3 months</option>
                </select>
              </div>
              <div className="sm:col-span-6">
                <label className={labelClass}><Globe size={14} className="inline mr-1" />Preferred Locations</label>
                <div className="flex mt-1">
                  <input type="text" value={locInput} onChange={e => setLocInput(e.target.value)} onKeyDown={addTag(locInput, setLocInput, preferredLocations, setPreferredLocations)}
                    className="input-field rounded-r-none" placeholder="e.g. Mumbai, Remote, Bangalore" />
                  <button type="button" onClick={addTag(locInput, setLocInput, preferredLocations, setPreferredLocations)} className="px-4 py-2 border border-l-0 border-slate-200 rounded-r-xl bg-slate-50 text-sm font-medium text-slate-600 hover:bg-slate-100">Add</button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {preferredLocations.map((l, i) => <span key={i} className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-xs font-medium border border-sky-200 flex items-center gap-1">{l} <button type="button" onClick={() => setPreferredLocations(preferredLocations.filter(x => x !== l))} className="hover:text-red-500">×</button></span>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === Experience (Seeker + Freelancer) === */}
        {(role === 'seeker' || role === 'freelancer') && (
          <div className={sectionClass}>
            <div className="flex items-center justify-between mb-6 border-b pb-4 border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100"><Briefcase size={16} /></div>
                <h3 className="text-lg font-bold text-slate-900">Experience</h3>
              </div>
              <button type="button" onClick={() => appendExp({ title: '', company: '', from: '', to: '', current: false })}
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium"><Plus size={16} /> Add</button>
            </div>
            <div className="space-y-5">
              {expFields.map((field, i) => (
                <div key={field.id} className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-12 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="sm:col-span-5"><label className="text-xs font-medium text-slate-500">Title</label><input type="text" {...register(`experience.${i}.title`)} required className={inputClass} /></div>
                  <div className="sm:col-span-5"><label className="text-xs font-medium text-slate-500">Company</label><input type="text" {...register(`experience.${i}.company`)} required className={inputClass} /></div>
                  <div className="sm:col-span-2 flex items-end justify-end"><button type="button" onClick={() => removeExp(i)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button></div>
                  <div className="sm:col-span-3"><label className="text-xs font-medium text-slate-500">Start</label><input type="date" {...register(`experience.${i}.from`)} required className={inputClass} /></div>
                  <div className="sm:col-span-3"><label className="text-xs font-medium text-slate-500">End</label><input type="date" {...register(`experience.${i}.to`)} className={inputClass} /></div>
                  <div className="sm:col-span-6"><label className="text-xs font-medium text-slate-500">Description</label><input type="text" {...register(`experience.${i}.description`)} className={inputClass} /></div>
                </div>
              ))}
              {expFields.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">No experience added.</p>}
            </div>
          </div>
        )}

        {/* === Education (Seeker + Freelancer) === */}
        {(role === 'seeker' || role === 'freelancer') && (
          <div className={sectionClass}>
            <div className="flex items-center justify-between mb-6 border-b pb-4 border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100"><GraduationCap size={16} /></div>
                <h3 className="text-lg font-bold text-slate-900">Education</h3>
              </div>
              <button type="button" onClick={() => appendEdu({ degree: '', institute: '', year: '', grade: '' })}
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium"><Plus size={16} /> Add</button>
            </div>
            <div className="space-y-5">
              {eduFields.map((field, i) => (
                <div key={field.id} className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-12 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="sm:col-span-4"><label className="text-xs font-medium text-slate-500">Degree</label><input type="text" {...register(`education.${i}.degree`)} required placeholder="e.g. B.Tech CS" className={inputClass} /></div>
                  <div className="sm:col-span-4"><label className="text-xs font-medium text-slate-500">Institute</label><input type="text" {...register(`education.${i}.institute`)} required className={inputClass} /></div>
                  <div className="sm:col-span-2"><label className="text-xs font-medium text-slate-500">Year</label><input type="number" {...register(`education.${i}.year`)} required className={inputClass} /></div>
                  <div className="sm:col-span-1"><label className="text-xs font-medium text-slate-500">Grade</label><input type="text" {...register(`education.${i}.grade`)} className={inputClass} /></div>
                  <div className="sm:col-span-1 flex items-end justify-end"><button type="button" onClick={() => removeEdu(i)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button></div>
                </div>
              ))}
              {eduFields.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">No education added.</p>}
            </div>
          </div>
        )}

        {/* === Links (ALL ROLES except recruiter already has website) === */}
        <div className={sectionClass}>
          {sectionHeader(<LinkIcon size={16} />, 'Links')}
          <div className="grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-3">
            {role !== 'recruiter' && <div><label className={labelClass}>GitHub</label><input type="url" {...register('github')} className={inputClass} /></div>}
            <div><label className={labelClass}>Portfolio</label><input type="url" {...register('portfolio')} className={inputClass} /></div>
            {role === 'recruiter' && <div><label className={labelClass}>GitHub</label><input type="url" {...register('github')} className={inputClass} /></div>}
          </div>
        </div>

        <div className="flex justify-end gap-4 pb-12">
          <button type="submit" disabled={saving} className="btn-primary px-8 py-3 disabled:opacity-70">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
