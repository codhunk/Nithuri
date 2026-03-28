"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { propertiesApi } from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [listingCount, setListingCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
       try {
          const res = await propertiesApi.myListings();
          setListingCount(res.data.length);
       } catch (err) {
          setListingCount(0);
       }
    };
    fetchStats();
  }, []);

  if (!user) return null;

  const stats = [
    { icon: "home_work", label: "Total Listings", value: listingCount === null ? "..." : String(listingCount), change: "+0%", positive: true },
    { icon: "check_circle", label: "Active Listings", value: listingCount === null ? "..." : String(listingCount), change: "+0%", positive: true },
    { icon: "person_search", label: "Buyer Inquiries", value: "0", change: "+0%", positive: true },
    { icon: "chat_bubble", label: "Recent Messages", value: "0", change: "0 unread", positive: false },
  ];

  return (
    <div className="p-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((card) => (
          <div key={card.label} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-primary/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">{card.icon}</span>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${card.positive ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold mb-1 dark:text-white uppercase tracking-tight">{card.value}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Listings */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-primary/10 p-6 transition-colors">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-black text-lg dark:text-white">Recent Listings Activity</h2>
            <Link href="/dashboard/my-listings" className="text-primary text-sm font-bold hover:underline">View All</Link>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-primary/5 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-slate-300 dark:text-primary/20 text-4xl">inventory_2</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">No Listings Found</h3>
            <p className="text-slate-500 text-sm max-w-xs mb-6">You haven't added any properties to your account yet.</p>
            <Link href="/dashboard/add-property" className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              Add Your First Property
            </Link>
          </div>
        </div>

        {/* System Health / Guide */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-primary/10 p-6 transition-colors">
          <h2 className="font-black text-lg mb-4 dark:text-white">Quick Guide</h2>
          <div className="space-y-4">
            {[
              { title: "Complete your profile", desc: "Upload an avatar and add your phone number.", icon: "account_circle" },
              { title: "Add Listings", desc: "Start listing your properties to get buyer inquiries.", icon: "add_home" },
              { title: "Check Messages", desc: "Respond to leads in real-time.", icon: "chat" }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-primary/5 border border-transparent hover:border-primary/10 transition-all">
                <span className="material-symbols-outlined text-primary">{item.icon}</span>
                <div>
                  <p className="font-bold text-sm dark:text-gray-100 leading-none mb-1">{item.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
