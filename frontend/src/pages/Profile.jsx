import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyProfile, saveProfile, clearProfileError } from '../store/profileSlice';
import toast from 'react-hot-toast';
import { User, Briefcase, GraduationCap, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';
import UploadResume from '../components/UploadResume';
import SkillBadge from '../components/SkillBadge';

export default function Profile() {
  const dispatch = useDispatch();
  const { data: profile, loading, saving, error } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);
  
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      headline: '', summary: '', location: '',
      linkedin: '', github: '', portfolio: '', expectedSalary: '', jobType: 'full-time',
      education: [], experience: [], preferredRoles: []
    }
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: 'education' });
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: 'experience' });

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      reset({
        headline: profile.headline || '',
        summary: profile.summary || '',
        location: profile.location || '',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        portfolio: profile.portfolio || '',
        expectedSalary: profile.expectedSalary || '',
        jobType: profile.jobType || 'full-time',
        education: profile.education || [],
        experience: profile.experience ? profile.experience.map(e => ({
            ...e, 
            from: e.from ? e.from.substring(0, 10) : '',
            to: e.to ? e.to.substring(0, 10) : ''
        })) : [],
      });
      setSkills(profile.skills || []);
    }
  }, [profile, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearProfileError());
    }
  }, [error, dispatch]);

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const val = skillInput.trim();
      if (val && !skills.includes(val)) {
        setSkills([...skills, val]);
        setSkillInput('');
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      skills,
    };
    dispatch(saveProfile(payload)).then((res) => {
        if(!res.error) toast.success('Profile saved successfully');
    });
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading profile...</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Build your profile to get better AI recommendations and attract recruiters.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Info Section */}
        <div className="bg-white shadow sm:rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center gap-2 mb-6 border-b pb-4 border-gray-100">
              <User className="text-primary" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label className="block text-sm font-medium text-gray-700">Headline</label>
                <input type="text" {...register('headline')} placeholder="e.g. Full Stack Developer | 3 YOE" 
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-primary focus:border-primary" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" {...register('location')} placeholder="e.g. Bangalore, India" 
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-primary focus:border-primary" />
              </div>
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
                <textarea {...register('summary')} rows={3} 
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-primary focus:border-primary" />
              </div>
              
              <div className="sm:col-span-3">
                 <label className="block text-sm font-medium text-gray-700">Expected Salary (₹/month)</label>
                 <input type="number" {...register('expectedSalary')} className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-primary focus:border-primary" />
              </div>
              <div className="sm:col-span-3">
                 <label className="block text-sm font-medium text-gray-700">Job Type</label>
                 <select {...register('jobType')} className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-primary focus:border-primary">
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                 </select>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Resume Section */}
        <div className="bg-white shadow sm:rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 border-b pb-4 border-gray-100 mb-6">Skills & Resume</h3>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                <div className="flex mt-1 relative rounded-md shadow-sm">
                  <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleAddSkill}
                    className="block w-full border border-gray-300 rounded-l-xl px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                    placeholder="Add a skill and press Enter" />
                  <button type="button" onClick={handleAddSkill} className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-xl bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Add
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((s, i) => <SkillBadge key={i} skill={s} onRemove={removeSkill} />)}
                  {skills.length === 0 && <span className="text-sm text-gray-400 font-medium">No skills added yet</span>}
                </div>
              </div>
              
              <div>
                 <UploadResume currentUrl={profile?.resumeUrl} />
              </div>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="bg-white shadow sm:rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6 border-b pb-4 border-gray-100">
              <div className="flex items-center gap-2">
                 <Briefcase className="text-primary" />
                 <h3 className="text-lg leading-6 font-medium text-gray-900">Experience</h3>
              </div>
              <button type="button" onClick={() => appendExp({ title: '', company: '', from: '', to: '', current: false })} className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium">
                <Plus size={16} /> Add Experience
              </button>
            </div>

            <div className="space-y-6">
              {expFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-12 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="sm:col-span-5">
                     <label className="block text-xs font-medium text-gray-700">Title</label>
                     <input type="text" {...register(`experience.${index}.title`)} required className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary" />
                  </div>
                  <div className="sm:col-span-5">
                     <label className="block text-xs font-medium text-gray-700">Company</label>
                     <input type="text" {...register(`experience.${index}.company`)} required className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary" />
                  </div>
                  <div className="sm:col-span-2 flex items-end justify-end">
                     <button type="button" onClick={() => removeExp(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                     </button>
                  </div>
                  
                  <div className="sm:col-span-3">
                     <label className="block text-xs font-medium text-gray-700">Start Date</label>
                     <input type="date" {...register(`experience.${index}.from`)} required className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary" />
                  </div>
                  <div className="sm:col-span-3">
                     <label className="block text-xs font-medium text-gray-700">End Date</label>
                     <input type="date" {...register(`experience.${index}.to`)} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary" />
                  </div>
                  <div className="sm:col-span-6">
                     <label className="block text-xs font-medium text-gray-700">Description</label>
                     <input type="text" {...register(`experience.${index}.description`)} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary" />
                  </div>
                </div>
              ))}
              {expFields.length === 0 && <p className="text-sm text-gray-500 italic text-center py-4">No experience added.</p>}
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-white shadow sm:rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6 border-b pb-4 border-gray-100">
              <div className="flex items-center gap-2">
                 <GraduationCap className="text-primary" />
                 <h3 className="text-lg leading-6 font-medium text-gray-900">Education</h3>
              </div>
              <button type="button" onClick={() => appendEdu({ degree: '', institute: '', year: '', grade: '' })} className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium">
                <Plus size={16} /> Add Education
              </button>
            </div>

            <div className="space-y-6">
              {eduFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-12 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="sm:col-span-4">
                     <label className="block text-xs font-medium text-gray-700">Degree</label>
                     <input type="text" {...register(`education.${index}.degree`)} required placeholder="e.g. B.Tech Computer Science" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary" />
                  </div>
                  <div className="sm:col-span-4">
                     <label className="block text-xs font-medium text-gray-700">Institute</label>
                     <input type="text" {...register(`education.${index}.institute`)} required className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary" />
                  </div>
                  <div className="sm:col-span-2">
                     <label className="block text-xs font-medium text-gray-700">Year</label>
                     <input type="number" {...register(`education.${index}.year`)} required className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary" />
                  </div>
                   <div className="sm:col-span-1">
                     <label className="block text-xs font-medium text-gray-700">Grade</label>
                     <input type="text" {...register(`education.${index}.grade`)} className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary" />
                  </div>
                  <div className="sm:col-span-1 flex items-end justify-end">
                     <button type="button" onClick={() => removeEdu(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                     </button>
                  </div>
                </div>
              ))}
               {eduFields.length === 0 && <p className="text-sm text-gray-500 italic text-center py-4">No education added.</p>}
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white shadow sm:rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center gap-2 mb-6 border-b pb-4 border-gray-100">
              <LinkIcon className="text-primary" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">Links</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                <input type="url" {...register('linkedin')} className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                <input type="url" {...register('github')} className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-primary focus:border-primary" />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700">Portfolio URL</label>
                <input type="url" {...register('portfolio')} className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-primary focus:border-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pb-12">
            <button type="submit" disabled={saving} className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-70 shadow-sm shadow-indigo-200">
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
        </div>

      </form>
    </div>
  );
}
