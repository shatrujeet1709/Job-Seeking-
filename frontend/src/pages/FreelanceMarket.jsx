import { useState, useEffect } from 'react';
import { getGigs } from '../api/freelanceApi';
import GigCard from '../components/GigCard';
import { Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CATEGORIES = [
  'All', 'Web Development', 'Mobile Apps', 'UX/UI Design', 
  'Digital Marketing', 'Video Editing', 'Writing & Translation'
];

export default function FreelanceMarket() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { user } = useSelector(state => state.auth);

  const fetchGigs = async (cat = category, q = search) => {
    setLoading(true);
    try {
      const dbCat = cat === 'All' ? '' : cat;
      const data = await getGigs(dbCat, q);
      setGigs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs(category, search);
  }, [category]); // We trigger explicitly on search submit

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGigs(category, search);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900 rounded-3xl p-8 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -m-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -m-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl mb-2">Freelance Marketplace</h1>
          <p className="text-gray-300 max-w-xl">Hire top freelancers for your next project or offer your services to clients worldwide.</p>
        </div>
        
        {user?.role === 'freelancer' && (
          <div className="relative z-10">
             <Link to="/post-gig" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-gray-900 bg-accent hover:bg-yellow-400 transition-colors shadow-lg shadow-accent/30 font-bold tracking-wide uppercase">
                Post a Gig
             </Link>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex-1 w-full overflow-x-auto pb-2 -mb-2 hide-scrollbar">
           <div className="flex gap-2 min-w-max">
             {CATEGORIES.map(cat => (
               <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                     category === cat 
                     ? 'bg-gray-900 text-white' 
                     : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
               >
                  {cat}
               </button>
             ))}
           </div>
        </div>
        
        <form onSubmit={handleSearch} className="w-full md:w-auto min-w-[300px]">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder="Search services..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-primary focus:border-primary text-sm"
             />
           </div>
        </form>
      </div>

      {/* Gig Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
           <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : gigs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gigs.map(gig => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
           <h3 className="text-lg font-medium text-gray-900">No gigs found</h3>
           <p className="text-gray-500 mt-1">Try selecting a different category or search term.</p>
        </div>
      )}
    </div>
  );
}
