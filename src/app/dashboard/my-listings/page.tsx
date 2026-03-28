"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { propertiesApi, ApiError } from "@/lib/api";

interface Property {
  _id: string;
  title: string;
  price: number;
  address: string;
  images: string[];
  status: string;
  views: number;
  createdAt: string;
}

export default function MyListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchListings = async () => {
    setIsLoading(true);
    try {
      const res = await propertiesApi.myListings();
      setListings(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to fetch listings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this listing?")) return;
    try {
      await propertiesApi.delete(id);
      setListings(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      alert("Delete failed: " + (err instanceof ApiError ? err.message : "Error"));
    }
  };

  const filtered = listings.filter(l => 
    filter === "All" || l.status.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-12">
      {/* Filters & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-2">
          {["All", "Pending", "Approved", "Sold"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight transition-all ${
                filter === f
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-primary/10 hover:border-primary hover:text-primary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <Link href="/dashboard/add-property" className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-lg">add</span>
          Add New Property
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-100 dark:border-primary/10" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 p-8 rounded-2xl text-center border border-red-100">
           <span className="material-symbols-outlined text-red-500 text-4xl mb-2">cloud_off</span>
           <p className="text-red-700 font-bold">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-slate-100 dark:border-primary/10 shadow-sm transition-colors">
           <div className="w-20 h-20 bg-slate-50 dark:bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-slate-300 dark:text-primary/20 text-4xl">inventory_2</span>
           </div>
           <h3 className="text-xl font-black dark:text-white mb-2 uppercase tracking-tight">No Listings Here</h3>
           <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-8">
             {filter === "All" ? "You haven't listed any properties yet." : `No listings currently match the "${filter}" status.`}
           </p>
           {filter === "All" && (
             <Link href="/dashboard/add-property" className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/10 hover:shadow-primary/30 transition-all">
               Start Listing Now
             </Link>
           )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((listing) => (
            <div 
              key={listing._id} 
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-primary/10 rounded-2xl p-4 md:p-6 flex flex-col lg:flex-row gap-6 hover:shadow-xl hover:shadow-primary/5 transition-all group overflow-hidden"
            >
              <div className="w-full lg:w-48 h-32 rounded-xl overflow-hidden relative flex-shrink-0">
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  src={listing.images[0] || "/placeholder.jpg"} 
                  alt={listing.title} 
                />
                <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${
                  listing.status === "approved" ? "bg-green-500" :
                  listing.status === "pending" ? "bg-amber-500" : "bg-slate-500"
                }`}>
                  {listing.status}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="font-black text-lg dark:text-white group-hover:text-primary transition-colors line-clamp-1">{listing.title}</h3>
                    <p className="font-black text-primary text-lg whitespace-nowrap">₹{(listing.price / 100000).toFixed(2)} Lac</p>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1 mb-4">
                    <span className="material-symbols-outlined text-sm">location_on</span> {listing.address}
                  </p>
                </div>

                <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-50 dark:border-primary/5">
                  <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined text-slate-400 text-lg">visibility</span>
                     <div>
                       <p className="text-sm font-black dark:text-white">{listing.views || 0}</p>
                       <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Views</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined text-slate-400 text-lg">event</span>
                     <div>
                       <p className="text-sm font-black dark:text-white">{new Date(listing.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                       <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Listed On</p>
                     </div>
                  </div>
                </div>
              </div>

              <div className="flex lg:flex-col gap-2 justify-center lg:border-l lg:border-slate-50 lg:dark:border-primary/5 lg:pl-6">
                <button 
                  onClick={() => router.push(`/dashboard/edit-property/${listing._id}`)}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary/5 dark:bg-primary/20 text-primary rounded-xl font-black text-xs uppercase hover:bg-primary hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(listing._id)}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl font-black text-xs uppercase hover:bg-red-500 hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
