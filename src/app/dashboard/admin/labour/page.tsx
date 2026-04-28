"use client";
import { useState, useEffect } from "react";
import { labourApi, ApiError } from "@/lib/api";

export default function LabourDashboard() {
  const [labours, setLabours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSkill, setFilterSkill] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);

  const fetchLabours = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filterSkill) params.skill_type = filterSkill;
      if (filterAvailability) params.availability = filterAvailability;
      
      const res = await labourApi.getList(params);
      setLabours(res.data || []);
    } catch (err) {
      console.error("Failed to fetch labour list", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await labourApi.getApplications();
      setApplications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setAppsLoading(false);
    }
  };

  useEffect(() => {
    fetchLabours();
    fetchApplications();
  }, [filterSkill, filterAvailability]);

  const handleAutoAssign = async () => {
    setActionLoading(true);
    try {
      const res = await labourApi.assignLabour({});
      alert(res.message || "Auto-assignment completed successfully");
      fetchLabours();
    } catch (err: any) {
      alert(err.message || "Failed to assign labour");
    } finally {
      setActionLoading(false);
    }
  };

  const handleManualAssign = async (labourId: string) => {
    setActionLoading(true);
    try {
      const res = await labourApi.assignLabour({ manual_labour_id: labourId });
      alert(res.message || "Manual assignment successful");
      fetchLabours();
    } catch (err: any) {
      alert(err.message || "Failed to assign labour");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async (assignmentId: string) => {
    try {
      await labourApi.updateAssignmentStatus(assignmentId, "in-progress");
      alert("Application approved! Labour has been assigned.");
      fetchApplications();
    } catch (err: any) {
      alert(err.message || "Failed to approve application");
    }
  };

  const handleReject = async (assignmentId: string) => {
    if (!window.confirm("Are you sure you want to reject this application?")) return;
    try {
      await labourApi.updateAssignmentStatus(assignmentId, "rejected");
      alert("Application rejected.");
      fetchApplications();
    } catch (err: any) {
      alert(err.message || "Failed to reject application");
    }
  };

  const skills = ["POP Worker", "Painter", "Electrician", "Plumber", "Carpenter", "General Labour"];

  if (loading && labours.length === 0) {
    return (
      <div className="p-8 animate-pulse space-y-8 max-w-7xl mx-auto">
        <div className="h-20 bg-white rounded-3xl border border-slate-100" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-2xl border border-slate-100" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            <span className="w-2 h-8 bg-primary rounded-full" />
            Labour Management (Nithuri Project)
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-2">Manage registered workers and assign them to the project.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => window.location.href = '/dashboard/labour-request'}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 transition-all hover:-translate-y-1 active:scale-95 text-xs uppercase"
          >
            <span className="material-symbols-outlined">post_add</span>
            Post Work
          </button>
          
          <button 
            onClick={handleAutoAssign}
            disabled={actionLoading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 text-xs uppercase"
          >
            <span className="material-symbols-outlined">smart_toy</span>
            Auto-Assign
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <select 
          value={filterSkill} 
          onChange={(e) => setFilterSkill(e.target.value)}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All Skills</option>
          {skills.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select 
          value={filterAvailability} 
          onChange={(e) => setFilterAvailability(e.target.value)}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Not Available">Not Available</option>
        </select>

        <button 
          onClick={() => { setFilterSkill(""); setFilterAvailability(""); }}
          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      {/* Pending Applications Section */}
      <div className="mt-12 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-6">
          <span className="w-2 h-8 bg-amber-500 rounded-full" />
          Pending Applications
        </h3>

        {appsLoading ? (
          <div className="flex justify-center py-10">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary">refresh</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-10">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">inbox</span>
            <p className="text-slate-500 font-medium text-sm">No pending applications.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div key={app._id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-black text-slate-800">{app.labour_id?.name || "Unknown"}</h4>
                      <p className="text-primary text-xs font-bold uppercase tracking-widest mt-1">
                        {app.labour_id?.skill_type || "General"}
                      </p>
                    </div>
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      Pending
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Project: <strong>{app.project_id?.project_name || "N/A"}</strong>
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleReject(app._id)}
                    className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(app._id)}
                    className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">how_to_reg</span>
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3 mt-12 mb-6">
        <span className="w-2 h-8 bg-primary rounded-full" />
        All Registered Labourers
      </h2>

      {/* Labour Grid */}
      {labours.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
           <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 font-thin">engineering</span>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No labour profiles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labours.map(labour => (
            <div key={labour._id} className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all group">
              <div className="h-32 bg-slate-100 relative">
                {labour.profile_image ? (
                  <img src={process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') + labour.profile_image} className="w-full h-full object-cover" alt={labour.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <span className="material-symbols-outlined text-4xl text-primary">person</span>
                  </div>
                )}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${
                  labour.availability === "Available" ? "bg-green-500" : "bg-slate-500"
                }`}>
                  {labour.availability}
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2 inline-block">
                    {labour.skill_type}
                  </span>
                  <h3 className="text-xl font-black text-slate-800">{labour.name}</h3>
                  <p className="text-sm text-slate-500 font-medium flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-sm">call</span> {labour.phone}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm font-bold text-slate-600 border-t border-b border-slate-100 py-4 mb-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Experience</p>
                    <p>{labour.experience} Years</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Daily Wage</p>
                    <p>₹{labour.wage}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    disabled={labour.availability !== "Available" || actionLoading}
                    onClick={() => handleManualAssign(labour._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-wider"
                  >
                    <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
                    {labour.availability === "Available" ? "Assign" : "Assigned"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
