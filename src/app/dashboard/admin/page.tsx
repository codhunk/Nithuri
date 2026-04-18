"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { adminApi, ApiError } from "@/lib/api";
import { formatAddress } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, propsRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getProperties()
      ]);
      setStats(statsRes.data);
      setProperties(propsRes.data);
    } catch (err) {
      console.error("Admin fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    setActionLoading(id);
    try {
      await adminApi.approveProperty(id, { status });
      // Update local state without full refetch
      setProperties(prev => prev.map(p => p._id === id ? { ...p, status } : p));
      const statsRes = await adminApi.getStats();
      setStats(statsRes.data);
    } catch (err) {
      alert("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = properties.filter(p => 
    filter === "All" || p.status.toLowerCase() === filter.toLowerCase()
  );

  if (loading) return <div className="p-8 animate-pulse space-y-8">
     <div className="h-32 bg-white rounded-3xl border border-slate-100" />
     <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100" />)}
     </div>
  </div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10 pb-20">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Users", val: stats?.totalUsers + stats?.totalOwners, icon: "group", color: "blue" },
          { label: "Active Listings", val: stats?.totalProperties, icon: "list_alt", color: "green" },
          { label: "Pending Review", val: properties.filter(p => p.status === "pending").length, icon: "pending_actions", color: "amber" },
          { label: "Total Inquiries", val: stats?.totalInquiries, icon: "inbox", color: "purple" },
        ].map((s) => (
          <div key={s.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 transition-transform hover:scale-105">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-${s.color}-500 bg-${s.color}-50}-500/10`}>
               <span className="material-symbols-outlined text-3xl">{s.icon}</span>
            </div>
            <div>
               <p className="text-2xl font-black uppercase tracking-tighter">{s.val || 0}</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Property Management */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-4 border-b border-slate-100">
           <div>
              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                 <span className="w-2 h-8 bg-primary rounded-full" />
                 Platform Listings
              </h2>
           </div>
           <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {["All", "Pending", "Approved", "Rejected"].map(t => (
                 <button 
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === t 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-white text-slate-500 border border-slate-100"
                  }`}
                 >
                    {t}
                 </button>
              ))}
              <button onClick={fetchAdminData} className="ml-2 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">refresh</span>
              </button>
           </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
             <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 font-thin">inventory_2</span>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No properties found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((p) => (
              <div key={p._id} className="bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col lg:flex-row gap-8 hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden">
                <div className="w-full lg:w-56 h-40 rounded-3xl overflow-hidden shadow-lg flex-shrink-0 relative">
                   <img src={p.images?.[0]?.url || "/placeholder.jpg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.title} />
                   <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white shadow-lg ${
                      p.status === "approved" ? "bg-green-500" :
                      p.status === "pending" ? "bg-amber-500" : "bg-red-500"
                   }`}>
                      {p.status}
                   </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                       <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{p.propertyType}</span>
                       <span className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{p.listingType}</span>
                    </div>
                    <h3 className="text-2xl font-black group-hover:text-primary transition-colors">{p.title}</h3>
                    <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5 mt-1">
                       <span className="material-symbols-outlined text-primary text-base">location_on</span> {formatAddress(p.address)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-4">
                     <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg opacity-40">person</span> {p.owner?.name}</span>
                     <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg opacity-40">payments</span> ₹{(p.price / 10000000).toFixed(2)} Cr</span>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-3 justify-center lg:border-l lg:border-slate-50 lg:pl-10">
                   {p.status !== "approved" && (
                     <button 
                      disabled={!!actionLoading}
                      onClick={() => handleAction(p._id, "approved")}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-green-500 text-white rounded-xl font-black shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 text-xs uppercase"
                     >
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        Approve
                     </button>
                   )}
                   {p.status !== "rejected" && (
                     <button 
                      disabled={!!actionLoading}
                      onClick={() => handleAction(p._id, "rejected")}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-red-50 text-red-500 border border-red-100 rounded-xl font-black hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 text-xs uppercase"
                     >
                        <span className="material-symbols-outlined text-lg">cancel</span>
                        Reject
                     </button>
                   )}
                   <Link 
                    href={`/properties/${p._id}`}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-slate-50 text-slate-500 rounded-xl font-black hover:bg-slate-100 transition-all text-xs uppercase"
                   >
                     <span className="material-symbols-outlined text-lg">visibility</span>
                     View
                   </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
