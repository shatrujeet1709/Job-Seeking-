import { useState, useEffect } from 'react';
import { getGigs } from '../api/freelanceApi';
import GigCard from '../components/GigCard';
import { Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const CATS = ['All','Web Development','Mobile Apps','UX/UI Design','Digital Marketing','Video Editing','Writing & Translation'];

export default function FreelanceMarket() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { user } = useSelector(s => s.auth);

  const fetch_ = async (c=category,q=search) => {
    setLoading(true);
    try { setGigs(await getGigs(c==='All'?'':c,q)); } catch(e){console.error(e);} finally{setLoading(false);}
  };
  useEffect(()=>{fetch_(category,search);},[category]);
  const onSearch = e => { e.preventDefault(); fetch_(); };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
        className="flex flex-col md:flex-row justify-between items-center card-colored p-8 mb-12">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Freelance Marketplace</h1>
          <p className="text-slate-500">Hire top freelancers or offer your services worldwide.</p>
        </div>
        {user?.role==='freelancer' && <Link to="/post-gig" className="btn-primary px-6 py-3">Post a Gig</Link>}
      </motion.div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex-1 w-full overflow-x-auto pb-2 -mb-2">
          <div className="flex gap-2 min-w-max">
            {CATS.map(c=>(
              <button key={c} onClick={()=>setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category===c?'bg-primary text-white shadow-sm':'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{c}</button>
            ))}
          </div>
        </div>
        <form onSubmit={onSearch} className="w-full md:w-auto min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
            <input type="text" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} className="input-field pl-10"/>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary"/></div>
      ) : gigs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gigs.map(g=><GigCard key={g._id} gig={g}/>)}
        </div>
      ) : (
        <div className="text-center py-20 card-elevated">
          <h3 className="text-lg font-bold text-slate-900">No gigs found</h3>
          <p className="text-slate-500 mt-1">Try a different category or search.</p>
        </div>
      )}
    </div>
  );
}
