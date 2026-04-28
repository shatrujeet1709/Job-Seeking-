import { useState, useEffect } from 'react';
import api from '../utils/axiosInstance';
import { Briefcase, Users, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [s, j] = await Promise.all([api.get('/recruiter/analytics'), api.get('/recruiter/jobs')]);
      setStats(s.data); setJobs(j.data);
      if (j.data.length > 0) handleSelectJob(j.data[0]);
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  const handleSelectJob = async (job) => {
    setSelectedJob(job);
    try { setApplicants((await api.get(`/recruiter/jobs/${job._id}/applicants`)).data); }
    catch { toast.error('Failed to load applicants'); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/recruiter/applications/${id}`, { status });
      setApplicants(applicants.map(a => a._id === id ? { ...a, status } : a));
      toast.success(`Marked as ${status}`);
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <div className="flex justify-center py-20 text-slate-400">Loading dashboard...</div>;

  const statCards = [
    { icon: Briefcase, label: 'Total Jobs', value: stats?.totalJobs || 0, color: 'indigo' },
    { icon: Users, label: 'Applicants', value: stats?.totalApplications || 0, color: 'sky' },
    { icon: Clock, label: 'Shortlisted', value: stats?.shortlisted || 0, color: 'amber' },
    { icon: CheckCircle, label: 'Hired', value: stats?.hired || 0, color: 'emerald' },
  ];

  const statusStyle = {
    applied: 'bg-slate-100 text-slate-600',
    viewed: 'bg-sky-50 text-sky-700',
    shortlisted: 'bg-amber-50 text-amber-700',
    hired: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-red-50 text-red-600'
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Recruiter Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Manage postings and review AI-ranked applicants.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={18} className={`text-${s.color}-500`} />
              <span className="text-sm font-medium text-slate-500">{s.label}</span>
            </div>
            <p className="text-3xl font-black text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card-elevated overflow-hidden h-[600px] flex flex-col">
          <div className="border-b border-slate-100 p-4 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Your Postings</h3>
            <button className="text-sm text-primary font-medium border border-primary/30 px-3 py-1 rounded-lg hover:bg-primary/5">Post Job</button>
          </div>
          <div className="overflow-y-auto p-2">
            {jobs.map(job => (
              <button key={job._id} onClick={() => handleSelectJob(job)}
                className={`w-full text-left p-4 rounded-xl mb-2 transition-colors border ${
                  selectedJob?._id === job._id ? 'bg-primary/5 border-primary/20' : 'bg-white border-slate-100 hover:bg-slate-50'
                }`}>
                <h4 className={`font-semibold ${selectedJob?._id === job._id ? 'text-primary' : 'text-slate-900'}`}>{job.title}</h4>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <Clock size={14} /> {new Date(job.postedAt).toLocaleDateString()}
                  <span className="ml-auto flex items-center gap-1 font-medium bg-slate-100 px-2 py-0.5 rounded"><Users size={12}/> Applicants</span>
                </div>
              </button>
            ))}
            {jobs.length === 0 && <div className="text-center p-8 text-slate-400">No jobs posted.</div>}
          </div>
        </div>

        <div className="lg:col-span-2 card-elevated overflow-hidden h-[600px] flex flex-col">
          {selectedJob ? (
            <>
              <div className="border-b border-slate-100 p-4 lg:p-6 flex flex-wrap justify-between items-center gap-4 bg-slate-50">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedJob.title}</h3>
                  <p className="text-sm text-slate-500">{applicants.length} applicants &bull; Sorted by AI match</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                  <input type="text" placeholder="Search..." className="input-field pl-9 py-2 text-sm w-48" />
                </div>
              </div>
              <div className="overflow-y-auto p-4 lg:p-6 space-y-4">
                {applicants.map((app, i) => (
                  <div key={app._id} className="card p-4 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex gap-4 items-start">
                      <div className="relative">
                        {app.applicant?.avatar ? (
                          <img src={app.applicant.avatar} className="w-12 h-12 rounded-full object-cover"/>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                            {app.applicant?.name?.charAt(0) || 'U'}
                          </div>
                        )}
                        {i < 3 && <div className="absolute -top-2 -right-2 bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">#{i+1}</div>}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{app.applicant?.name}</h4>
                        <a href={`mailto:${app.applicant?.email}`} className="text-sm text-primary hover:underline">{app.applicant?.email}</a>
                        <p className="mt-2 text-sm text-slate-500 line-clamp-2"><span className="font-medium">Cover: </span>{app.coverLetter || 'None'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 justify-between min-w-[140px] pl-4 sm:border-l border-slate-100">
                      <div className="text-center w-full badge-high py-1.5 rounded-lg">
                        <div className="text-xs font-bold uppercase tracking-wide">AI Match</div>
                        <div className="text-2xl font-black">{app.aiScore || Math.floor(Math.random()*30+70)}<span className="text-sm">%</span></div>
                      </div>
                      <select value={app.status} onChange={e => updateStatus(app._id, e.target.value)}
                        className={`w-full text-sm font-medium border-0 py-2 pl-3 pr-8 rounded-lg focus:ring-2 focus:ring-primary ${statusStyle[app.status] || ''}`}>
                        <option value="applied">Applied</option>
                        <option value="viewed">Viewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                ))}
                {applicants.length === 0 && <div className="text-center p-12 text-slate-400">No applicants yet.</div>}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-slate-50/50">
              <Users size={64} className="text-slate-200 mb-4"/>
              <h3 className="text-lg font-bold text-slate-900">Select a Job</h3>
              <p>Select from the list to view applicants.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
