import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GigCard({ gig }) {
  const minPrice = gig.packages?.length > 0 
    ? Math.min(...gig.packages.map(p => p.price)) 
    : 0;

  return (
    <Link to={`/gigs/${gig._id}`} className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col h-full cursor-not-allowed">
      {/* We're disabling click for now since gig detail isn't fully built in this phase */}
      <div className="aspect-[4/3] w-full bg-gray-100 relative overflow-hidden">
        {gig.images && gig.images.length > 0 ? (
           <img src={gig.images[0]} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
           <div className="w-full h-full flex justify-center items-center bg-indigo-50 text-indigo-400 font-bold tracking-widest uppercase">
              No Image
           </div>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          {gig.freelancer?.avatar ? (
             <img src={gig.freelancer.avatar} alt={gig.freelancer.name} className="w-6 h-6 rounded-full object-cover" />
          ) : (
             <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
               {gig.freelancer?.name?.charAt(0) || 'F'}
             </div>
          )}
          <span className="text-sm font-medium text-gray-700">{gig.freelancer?.name || 'Freelancer'}</span>
          
          <div className="ml-auto flex items-center gap-1 text-sm font-bold text-gray-900">
             <Star className="w-4 h-4 text-accent fill-accent" />
             {gig.rating || 'New'}
             {gig.reviewCount > 0 && <span className="text-gray-400 font-normal">({gig.reviewCount})</span>}
          </div>
        </div>

        <h3 className="font-medium text-gray-900 leading-snug line-clamp-2 hover:text-primary transition-colors mb-4">
          {gig.title}
        </h3>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
           <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{gig.category || 'Service'}</span>
           <div className="text-right">
              <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider mb-0.5">Starting at</span>
              <span className="text-lg font-black text-gray-900">₹{minPrice.toLocaleString()}</span>
           </div>
        </div>
      </div>
    </Link>
  );
}
