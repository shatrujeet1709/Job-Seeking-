import { useState, useEffect } from 'react';
import { getJobs } from '../api/jobsApi';
import JobCard from '../components/JobCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const location = useLocation();
  
  // Basic filters state
  const [filter, setFilter] = useState({
    search: '',
    location: '',
    jobType: '',
    page: 1
  });

  useEffect(() => {
    // If we have search params mapping to component
    const searchParams = new URLSearchParams(location.search);
    if(searchParams.get('skill')) setFilter(prev => ({...prev, search: searchParams.get('skill')}));
  }, [location.search]);

  useEffect(() => {
    fetchJobs();
  }, [filter.page, filter.jobType]); // Re-fetch on pagination or type change

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs({
        page: filter.page,
        limit: 12,
        search: filter.search,
        location: filter.location,
        type: filter.jobType
      });
      setJobs(data.jobs);
      setTotal(data.totalJobs);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilter(prev => ({ ...prev, page: 1 }));
    fetchJobs();
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Header & Search */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Explore Open Opportunities</h1>
        <p className="mt-4 text-xl text-gray-500">Discover top jobs from around the web</p>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-2 rounded-2xl shadow-md border border-gray-100 mb-10">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-4 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Job title, keywords, or company" 
              value={filter.search}
              onChange={(e) => setFilter({...filter, search: e.target.value})}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-none focus:ring-0 text-gray-900 bg-gray-50/50"
            />
          </div>
          <div className="w-px bg-gray-200 hidden md:block my-2"></div>
          <div className="flex-1 relative flex items-center border-t md:border-t-0 border-gray-100 pt-2 md:pt-0">
            <SlidersHorizontal className="absolute left-4 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="City, state, or 'Remote'" 
              value={filter.location}
              onChange={(e) => setFilter({...filter, location: e.target.value})}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-none focus:ring-0 text-gray-900 bg-gray-50/50"
            />
          </div>
          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors">
            Search
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-px">
         {['', 'full-time', 'remote', 'contract'].map(type => (
            <button key={type} onClick={() => setFilter({...filter, jobType: type, page: 1})}
               className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${filter.jobType === type ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
               {type === '' ? 'All Jobs' : type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
         ))}
      </div>

      {loading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
               <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
            ))}
         </div>
      ) : jobs.length > 0 ? (
         <>
            <div className="text-sm text-gray-500 mb-4">{total} jobs found</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map(job => (
                 <JobCard key={job._id} job={job} />
              ))}
            </div>
            
            {/* Pagination Proto */}
            <div className="flex justify-center mt-12 gap-2">
               <button 
                  disabled={filter.page === 1}
                  onClick={() => setFilter({...filter, page: filter.page - 1})}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
               >
                  Previous
               </button>
               <span className="px-4 py-2 text-sm text-gray-600 font-medium">Page {filter.page}</span>
               <button 
                  disabled={jobs.length < 12}
                  onClick={() => setFilter({...filter, page: filter.page + 1})}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
               >
                  Next
               </button>
            </div>
         </>
      ) : (
         <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100/50">
            <SlidersHorizontal size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
         </div>
      )}
    </div>
  );
}
