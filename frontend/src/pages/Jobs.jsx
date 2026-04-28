import { useState, useEffect } from 'react';
import { getJobs } from '../api/jobsApi';
import JobCard from '../components/JobCard';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Briefcase, Clock, Wifi } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const SEGMENTS = [
  { key: '', label: 'All Jobs', icon: Briefcase, color: 'indigo' },
  { key: 'full-time', label: 'Full-Time', icon: Briefcase, color: 'emerald' },
  { key: 'part-time', label: 'Part-Time', icon: Clock, color: 'amber' },
];

const EXTRA_FILTERS = [
  { key: 'remote', label: 'Remote', icon: Wifi },
  { key: 'contract', label: 'Contract', icon: SlidersHorizontal },
];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const location = useLocation();
  const [filter, setFilter] = useState({ search: '', location: '', jobType: '', page: 1 });

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (p.get('skill')) setFilter(prev => ({ ...prev, search: p.get('skill') }));
  }, [location.search]);

  useEffect(() => { fetchJobs(); }, [filter.page, filter.jobType]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs({ page: filter.page, limit: 12, search: filter.search, location: filter.location, type: filter.jobType });
      setJobs(data.jobs); setTotal(data.totalJobs);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); setFilter(p => ({ ...p, page: 1 })); fetchJobs(); };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3">
          Explore <span className="gradient-text">Opportunities</span>
        </h1>
        <p className="text-lg text-slate-500">Discover top jobs from around the web</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="max-w-4xl mx-auto card-elevated p-2.5 mb-10">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-4 text-slate-400" size={18} />
            <input type="text" placeholder="Job title, keywords, or company"
              value={filter.search} onChange={e => setFilter({ ...filter, search: e.target.value })}
              className="input-field pl-11 border-transparent bg-slate-50/80 focus:bg-white" />
          </div>
          <div className="w-px bg-slate-200 hidden md:block my-1.5" />
          <div className="flex-1 relative flex items-center">
            <SlidersHorizontal className="absolute left-4 text-slate-400" size={18} />
            <input type="text" placeholder="City, state, or 'Remote'"
              value={filter.location} onChange={e => setFilter({ ...filter, location: e.target.value })}
              className="input-field pl-11 border-transparent bg-slate-50/80 focus:bg-white" />
          </div>
          <button type="submit" className="btn-primary px-8 py-3">Search</button>
        </form>
      </motion.div>

      {/* Primary Segment Tabs: All / Full-Time / Part-Time */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex gap-3 justify-center">
          {SEGMENTS.map(seg => (
            <button key={seg.key} onClick={() => setFilter({ ...filter, jobType: seg.key, page: 1 })}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all border ${
                filter.jobType === seg.key
                  ? `bg-${seg.color}-50 border-${seg.color}-200 text-${seg.color}-700 shadow-sm`
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
              }`}>
              <seg.icon size={16} />
              {seg.label}
            </button>
          ))}
        </div>
        {/* Secondary filter chips */}
        <div className="flex gap-2 justify-center">
          {EXTRA_FILTERS.map(ef => (
            <button key={ef.key} onClick={() => setFilter({ ...filter, jobType: filter.jobType === ef.key ? '' : ef.key, page: 1 })}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all border ${
                filter.jobType === ef.key
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}>
              <ef.icon size={12} />
              {ef.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : jobs.length > 0 ? (
        <>
          <p className="text-sm text-slate-500 mb-4">{total} jobs found</p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, i) => (
              <motion.div key={job._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <JobCard job={job} />
              </motion.div>
            ))}
          </motion.div>

          <div className="flex justify-center mt-12 gap-3">
            <button disabled={filter.page === 1} onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
              className="btn-outline px-4 py-2 text-sm flex items-center gap-1 disabled:opacity-30">
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="px-5 py-2 text-sm text-slate-500 font-medium bg-white border border-slate-200 rounded-lg">Page {filter.page}</span>
            <button disabled={jobs.length < 12} onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
              className="btn-outline px-4 py-2 text-sm flex items-center gap-1 disabled:opacity-30">
              Next <ChevronRight size={16} />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-20 card-elevated">
          <SlidersHorizontal size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No jobs found</h3>
          <p className="text-slate-500 mt-1">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}
