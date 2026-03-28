"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { propertiesApi, chatApi, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [msgLoading, setMsgLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await propertiesApi.getById(id as string);
        setProperty(res.data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load property.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleStartChat = async () => {
    if (!isAuthenticated) {
       // Open login modal (handled by layout/navbar if we emit or use state)
       // For now, let's just alert
       alert("Please login to contact the owner.");
       return;
    }
    
    setMsgLoading(true);
    try {
      // Create conversation with property owner
      const res = await chatApi.getOrCreate(property.owner._id, property._id);
      router.push("/dashboard/messages");
    } catch (err) {
      alert("Failed to start conversation.");
    } finally {
      setMsgLoading(false);
    }
  };

  if (isLoading) return (
     <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
     </div>
  );

  if (error || !property) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
         <h1 className="text-2xl font-black mb-4">{error || "Property not found."}</h1>
         <button onClick={() => router.back()} className="bg-primary text-white px-8 py-3 rounded-xl font-bold">Go Back</button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="flex h-full grow flex-col min-h-screen bg-white dark:bg-background-dark transition-colors duration-300">
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-6 md:px-10 py-12 w-full">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 mb-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span className="material-symbols-outlined text-sm opacity-30">chevron_right</span>
          <a href="/properties" className="hover:text-primary transition-colors">Properties</a>
          <span className="material-symbols-outlined text-sm opacity-30">chevron_right</span>
          <span className="text-slate-800 dark:text-gray-100 font-bold">{property.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column */}
          <div className="lg:w-2/3 space-y-10">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-[16/10] shadow-2xl shadow-primary/5 transition-transform">
                <img
                  className="w-full h-full object-cover"
                  src={property.images[0] || "/placeholder.jpg"}
                  alt={property.title}
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {property.images.slice(1, 5).map((src: string, i: number) => (
                  <div key={i} className="rounded-2xl overflow-hidden aspect-square cursor-pointer border-2 border-transparent hover:border-primary transition-all shadow-lg shadow-black/5">
                    <img className="w-full h-full object-cover" src={src} alt={`View ${i + 2}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Title & Price Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-primary/10">
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight dark:text-white leading-tight mb-3">{property.title}</h1>
                <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  {property.address}
                </p>
              </div>
              <div className="md:text-right bg-primary/5 dark:bg-primary/20 p-6 rounded-3xl border border-primary/10">
                <p className="text-primary text-4xl font-black">₹{(property.price / 10000000).toFixed(2)} Cr</p>
                <div className="flex items-center gap-2 md:justify-end mt-1">
                   <span className="w-2 h-2 rounded-full bg-green-500" />
                   <span className="text-xs text-primary font-bold uppercase tracking-widest">{property.listingType}</span>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "square_foot", label: "Area", value: `${property.area?.value} ${property.area?.unit}` },
                { icon: "bed", label: "Bedrooms", value: `${property.details?.bedrooms || 0} BHK` },
                { icon: "bathtub", label: "Bathrooms", value: property.details?.bathrooms || 0 },
                { icon: "home_work", label: "Type", value: property.propertyType },
              ].map((s) => (
                <div key={s.label} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-primary/10 shadow-sm flex flex-col items-center text-center transition-all hover:scale-105 hover:shadow-primary/5">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-3">
                     <span className="material-symbols-outlined">{s.icon}</span>
                  </div>
                  <p className="font-black text-lg dark:text-white leading-tight">{s.value}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-primary/10 transition-colors">
              <h2 className="text-2xl font-black mb-6 dark:text-white uppercase tracking-tight flex items-center gap-2">
                 <span className="w-2 h-8 bg-primary rounded-full" />
                 Property Description
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg whitespace-pre-wrap">
                {property.description}
              </p>
            </div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-primary/10 border border-slate-100 dark:border-primary/20 p-8 transition-colors">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-50 dark:border-primary/5">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    {property.owner?.avatar ? (
                      <img src={property.owner.avatar} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-2xl">person</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-xl dark:text-white leading-tight">{property.owner?.name}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Verified Property Owner</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleStartChat}
                    disabled={msgLoading}
                    className="w-full bg-primary text-white rounded-[1.25rem] py-4 font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95 text-lg disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined">chat_bubble</span>
                    {msgLoading ? "Starting chat..." : "Contact Owner"}
                  </button>
                  <button className="w-full border-2 border-primary text-primary rounded-[1.25rem] py-4 font-black flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all active:scale-95">
                    <span className="material-symbols-outlined">call</span> 
                    Schedule Visit
                  </button>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                   <div className="flex items-center gap-3 text-xs text-green-600 font-bold uppercase tracking-tighter bg-green-50 dark:bg-green-900/10 p-3 rounded-xl">
                      <span className="material-symbols-outlined text-base">verified_user</span>
                      Authenticity Verified by Nithuri
                   </div>
                   <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-tighter p-3">
                      <span className="material-symbols-outlined text-base">schedule</span>
                      Responds within 2 hours
                   </div>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-[2rem] p-6 border border-amber-100 dark:border-amber-900/20">
                 <h4 className="font-black text-amber-800 dark:text-amber-400 text-sm mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">gpp_maybe</span>
                    Safety Reminder
                 </h4>
                 <p className="text-amber-700/70 dark:text-amber-400/60 text-xs leading-relaxed">
                   Never share sensitive bank details or OTPs with sellers. Always visit the site before making any payments.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
