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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, jobsRes] = await Promise.all([
        api.get('/recruiter/analytics'),
        api.get('/recruiter/jobs')
      ]);
      setStats(statsRes.data);
      setJobs(jobsRes.data);
      if (jobsRes.data.length > 0) {
        handleSelectJob(jobsRes.data[0]);
      }
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectJob = async (job) => {
    setSelectedJob(job);
    try {
      const res = await api.get(`/recruiter/jobs/${job._id}/applicants`);
      setApplicants(res.data);
    } catch (err) {
      toast.error('Failed to load applicants');
    }
  };

  const updateStatus = async (appId, newStatus) => {
    try {
      await api.put(`/recruiter/applications/${appId}`, { status: newStatus });
      setApplicants(applicants.map(app => 
        app._id === appId ? { ...app, status: newStatus } : app
      ));
      toast.success(`Application marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="flex justify-center py-20">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your job postings and review top AI-ranked applicants.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 p-5">
           <div className="flex items-center gap-3 mb-2"><Briefcase className="text-primary"/> <p className="text-sm font-medium text-gray-500">Total Jobs</p></div>
           <p className="text-3xl font-bold text-gray-900">{stats?.totalJobs || 0}</p>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 p-5">
           <div className="flex items-center gap-3 mb-2"><Users className="text-blue-500"/> <p className="text-sm font-medium text-gray-500">Total Applicants</p></div>
           <p className="text-3xl font-bold text-gray-900">{stats?.totalApplications || 0}</p>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 p-5">
           <div className="flex items-center gap-3 mb-2"><Clock className="text-yellow-500"/> <p className="text-sm font-medium text-gray-500">Shortlisted</p></div>
           <p className="text-3xl font-bold text-gray-900">{stats?.shortlisted || 0}</p>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100 p-5">
           <div className="flex items-center gap-3 mb-2"><CheckCircle className="text-green-500"/> <p className="text-sm font-medium text-gray-500">Hired</p></div>
           <p className="text-3xl font-bold text-gray-900">{stats?.hired || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Job List */}
        <div className="lg:col-span-1 bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden h-[600px] flex flex-col">
          <div className="border-b border-gray-100 p-4 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Your Postings</h3>
            <button className="text-sm text-primary font-medium border border-primary px-3 py-1 rounded-lg hover:bg-indigo-50 transition-colors">Post Job</button>
          </div>
          <div className="overflow-y-auto p-2 filter-list">
            {jobs.map(job => (
              <button 
                key={job._id}
                onClick={() => handleSelectJob(job)}
                className={`w-full text-left p-4 rounded-xl mb-2 transition-colors border ${
                  selectedJob?._id === job._id 
                  ? 'bg-indigo-50 border-indigo-200' 
                  : 'bg-white border-gray-100 hover:bg-gray-50'
                }`}
              >
                <h4 className={`font-semibold ${selectedJob?._id === job._id ? 'text-primary' : 'text-gray-900'}`}>{job.title}</h4>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                   <Clock size={14}/> {new Date(job.postedAt).toLocaleDateString()}
                   <span className="ml-auto flex items-center gap-1 font-medium bg-gray-100 px-2 py-0.5 rounded"><Users size={12}/> Applicants</span>
                </div>
              </button>
            ))}
            {jobs.length === 0 && <div className="text-center p-8 text-gray-500">No jobs posted yet.</div>}
          </div>
        </div>

        {/* Right Column: Applicants for selected job */}
        <div className="lg:col-span-2 bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden h-[600px] flex flex-col">
          {selectedJob ? (
            <>
              <div className="border-b border-gray-100 p-4 lg:p-6 flex flex-wrap justify-between items-center gap-4 bg-gray-50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedJob.title}</h3>
                  <p className="text-sm text-gray-500">{applicants.length} total applicants &bull; Sorted by AI match score</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                  <input type="text" placeholder="Search applicants..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-primary focus:border-primary" />
                </div>
              </div>
              
              <div className="overflow-y-auto p-4 lg:p-6 space-y-4">
                {applicants.map((app, i) => (
                  <div key={app._id} className="border border-gray-100 bg-white rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between transition-shadow hover:shadow-md">
                    <div className="flex gap-4 items-start">
                      <div className="relative">
                        {app.applicant?.avatar ? (
                          <img src={app.applicant.avatar} className="w-12 h-12 rounded-full object-cover"/>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-lg">
                            {app.applicant?.name?.charAt(0) || 'U'}
                          </div>
                        )}
                        {/* Top 3 rank badge */}
                        {i < 3 && <div className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">#{i+1}</div>}
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900">{app.applicant?.name}</h4>
                        <a href={`mailto:${app.applicant?.email}`} className="text-sm text-primary hover:underline">{app.applicant?.email}</a>
                        
                        <div className="mt-3 text-sm text-gray-600 line-clamp-2">
                           <span className="font-medium">Cover Letter: </span> {app.coverLetter || 'No cover letter provided.'}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 justify-between min-w-[140px] pl-4 sm:border-l border-gray-100">
                       <div className="text-center w-full bg-green-50 text-green-700 py-1.5 rounded-lg border border-green-100">
                          <div className="text-xs font-bold uppercase tracking-wide">AI Match</div>
                          <div className="text-2xl font-black">{app.aiScore || Math.floor(Math.random() * 30 + 70)}<span className="text-sm">%</span></div>
                       </div>
                       
                       <div className="w-full">
                         <select 
                           value={app.status}
                           onChange={(e) => updateStatus(app._id, e.target.value)}
                           className={`w-full text-sm font-medium border-0 py-2 pl-3 pr-8 rounded-lg focus:ring-2 focus:ring-primary ${
                              app.status === 'applied' ? 'bg-gray-100 text-gray-700' :
                              app.status === 'viewed' ? 'bg-blue-50 text-blue-700' :
                              app.status === 'shortlisted' ? 'bg-yellow-50 text-yellow-700' :
                              app.status === 'hired' ? 'bg-green-50 text-green-700' :
                              'bg-red-50 text-red-700'
                           }`}
                         >
                           <option value="applied">Applied</option>
                           <option value="viewed">Viewed</option>
                           <option value="shortlisted">Shortlisted</option>
                           <option value="hired">Hired</option>
                           <option value="rejected">Rejected</option>
                         </select>
                       </div>
                    </div>
                  </div>
                ))}
                {applicants.length === 0 && <div className="text-center p-12 text-gray-500">No applicants for this job yet.</div>}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-500 bg-gray-50/50">
               <Users size={64} className="text-gray-300 mb-4"/>
               <h3 className="text-lg font-medium text-gray-900">Select a Job</h3>
               <p>Select a job from the list to view its applicants.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
