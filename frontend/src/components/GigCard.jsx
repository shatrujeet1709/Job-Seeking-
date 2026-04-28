import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GigCard({ gig }) {
  const minPrice = gig.packages?.length > 0 ? Math.min(...gig.packages.map(p => p.price)) : 0;

  return (
    <Link to={`/gigs/${gig._id}`} className="card overflow-hidden flex flex-col h-full group">
      <div className="aspect-[4/3] w-full bg-slate-100 relative overflow-hidden">
        {gig.images?.[0] ? (
          <img src={gig.images[0]} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-slate-50 text-slate-400 font-medium text-sm">No Image</div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          {gig.freelancer?.avatar ? (
            <img src={gig.freelancer.avatar} alt="" className="w-6 h-6 rounded-full object-cover border border-slate-200" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {gig.freelancer?.name?.charAt(0) || 'F'}
            </div>
          )}
          <span className="text-sm font-medium text-slate-600">{gig.freelancer?.name || 'Freelancer'}</span>
          <div className="ml-auto flex items-center gap-1 text-sm font-bold text-amber-600">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            {gig.rating || 'New'}
            {gig.reviewCount > 0 && <span className="text-slate-400 font-normal">({gig.reviewCount})</span>}
          </div>
        </div>

        <h3 className="font-medium text-slate-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-4">{gig.title}</h3>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{gig.category || 'Service'}</span>
          <div className="text-right">
            <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider mb-0.5">Starting at</span>
            <span className="text-lg font-black text-slate-900">₹{minPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
