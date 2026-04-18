"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { propertiesApi, ApiError } from "@/lib/api";
import { formatAddress } from "@/lib/utils";

interface Property {
  _id: string;
  title: string;
  price: number;
  address: any; // Could be string (mock) or object (real)
  images: { url: string; public_id?: string }[];
  status: string;
  views: number;
  createdAt: string;
}

export default function MyListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Property[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-center gap-4">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            {["All", "Pending", "Approved", "Sold"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${
                  filter === f
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-primary transition-colors"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-slate-400"}`}
            >
              <span className="material-symbols-outlined text-xl">grid_view</span>
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-slate-400"}`}
            >
              <span className="material-symbols-outlined text-xl">view_list</span>
            </button>
          </div>
        </div>

        <Link href="/dashboard/add-property" className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 active:scale-95">
          <span className="material-symbols-outlined text-lg">add</span>
          Add New Property
        </Link>
      </div>

      {isLoading ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "grid grid-cols-1 gap-4"}>
          {[1, 2, 3].map(i => (
            <div key={i} className={`bg-white rounded-2xl animate-pulse border border-slate-100 ${viewMode === "grid" ? "aspect-[4/5]" : "h-40"}`} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 p-8 rounded-2xl text-center border border-red-100">
           <span className="material-symbols-outlined text-red-500 text-4xl mb-2">cloud_off</span>
           <p className="text-red-700 font-bold">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm transition-colors">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-slate-300 text-4xl">inventory_2</span>
           </div>
           <h3 className="text-xl font-black mb-2 uppercase tracking-tight">No Listings Here</h3>
           <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">
             {filter === "All" ? "You haven't listed any properties yet." : `No listings currently match the "${filter}" status.`}
           </p>
           {filter === "All" && (
             <Link href="/dashboard/add-property" className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/10 hover:shadow-primary/30 transition-all">
               Start Listing Now
             </Link>
           )}
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "grid grid-cols-1 gap-6"}>
          {filtered.map((listing) => (
            <div 
              key={listing._id} 
              className={`bg-white border border-slate-100 rounded-2xl p-4 md:p-5 flex transition-all group overflow-hidden ${
                viewMode === "list" ? "flex-col lg:flex-row gap-6 hover:shadow-xl hover:shadow-primary/5" : "flex-col gap-4 hover:shadow-2xl hover:-translate-y-1"
              }`}
            >
              {/* Image Section */}
              <div className={`rounded-xl overflow-hidden relative flex-shrink-0 ${
                viewMode === "list" ? "w-full lg:w-52 h-36" : "w-full aspect-[4/3]"
              }`}>
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  src={listing.images[0]?.url || "/placeholder.jpg"} 
                  alt={listing.title} 
                />
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-white shadow-lg backdrop-blur-md ${
                  listing.status === "approved" ? "bg-green-500/90" :
                  listing.status === "pending" ? "bg-amber-500/90" : "bg-slate-500/90"
                }`}>
                  {listing.status}
                </div>
              </div>
              
              {/* Content Section */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className={`flex justify-between items-start gap-4 ${viewMode === "list" ? "mb-2" : "mb-3"}`}>
                    <h3 className="font-black text-base group-hover:text-primary transition-colors line-clamp-1">{listing.title}</h3>
                    <p className="font-black text-primary text-base whitespace-nowrap">₹{(listing.price / 100000).toFixed(2)} Lac</p>
                  </div>
                  <p className="text-slate-500 text-xs flex items-center gap-1 mb-4">
                    <span className="material-symbols-outlined text-sm">location_on</span> {formatAddress(listing.address)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined text-slate-400 text-lg">visibility</span>
                     <div className="leading-none">
                       <p className="text-xs font-black">{listing.views || 0}</p>
                       <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">Views</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined text-slate-400 text-lg">event</span>
                     <div className="leading-none">
                       <p className="text-xs font-black">{new Date(listing.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                       <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">Listed On</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className={`flex lg:flex-col gap-2 justify-center ${
                viewMode === "list" 
                  ? "lg:border-l lg:border-slate-50 lg: lg:pl-6" 
                  : "pt-4 border-t border-slate-50"
              }`}>
                <button 
                  onClick={() => router.push(`/dashboard/edit-property/${listing._id}`)}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary/5 text-primary rounded-xl font-black text-[10px] uppercase hover:bg-primary hover:text-white transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(listing._id)}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-red-50 text-red-500 rounded-xl font-black text-[10px] uppercase hover:bg-red-500 hover:text-white transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
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
