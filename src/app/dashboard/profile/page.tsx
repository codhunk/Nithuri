"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userApi, ApiError } from "@/lib/api";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    setStatus(null);
    try {
      // Use FormData if I was uploading an avatar, but for now JSON is fine
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("bio", bio);
      
      const res = await userApi.updateMe(formData);
      setUser(res.data);
      setStatus({ type: "success", msg: "Profile updated successfully!" });
    } catch (err) {
      setStatus({ 
        type: "error", 
        msg: err instanceof ApiError ? err.message : "Failed to update profile." 
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-12">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-primary text-white flex items-center justify-center font-black text-4xl shadow-xl shadow-primary/20 overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="material-symbols-outlined text-3xl text-white">photo_camera</span>
              </div>
            </div>
            {/* Future: Add input[type=file] here for avatar upload */}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black mb-2">{user.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
              <span className="text-xs font-bold px-3 py-1.5 bg-green-50 text-green-600 rounded-lg flex items-center gap-1">
                <span className="material-symbols-outlined text-base">verified</span> Verified {user.role}
              </span>
              <span className="text-xs font-bold px-3 py-1.5 bg-primary/5 text-primary rounded-lg flex items-center gap-1">
                <span className="material-symbols-outlined text-base">person</span> Member since {new Date().getFullYear()}
              </span>
            </div>
          </div>
          <button 
            onClick={handleUpdate}
            disabled={isUpdating}
            className="bg-primary text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {status && (
        <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 ${
          status.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
        }`}>
          <span className="material-symbols-outlined">{status.type === "success" ? "check_circle" : "error"}</span>
          {status.msg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 transition-colors">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl">person</span>
            </div>
            <h2 className="text-lg font-black">Basic Information</h2>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm outline-none transition-all opacity-50 cursor-not-allowed"
                value={user.email}
                disabled
              />
              <p className="text-[10px] text-slate-400 italic">Email is for security and cannot be changed.</p>
            </div>
          </div>
        </div>

        {/* Extended Settings */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 transition-colors">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl">contact_phone</span>
            </div>
            <h2 className="text-lg font-black">Contact & Bio</h2>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 00000 00000"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Bio / Slogan</label>
              <textarea 
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell users more about your business..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
