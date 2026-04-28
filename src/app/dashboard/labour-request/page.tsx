"use client";
import { useState, useEffect } from "react";
import { labourApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function LabourRequestPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    project_name: "",
    location: "",
    number_of_labours_needed: "1",
    budget: "",
    required_skills: [] as string[],
    start_date: "",
    end_date: "",
  });

  const skills = ["POP Worker", "Painter", "Electrician", "Plumber", "Carpenter", "General Labour"];

  const fetchApplications = async () => {
    try {
      const res = await labourApi.getApplications();
      setApplications(res.data || []);
    } catch (err) {
      console.error("Failed to load applications", err);
    } finally {
      setAppsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchApplications();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills.includes(skill)
        ? prev.required_skills.filter(s => s !== skill)
        : [...prev.required_skills, skill]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.required_skills.length === 0) {
      alert("Please select at least one required skill.");
      return;
    }
    
    setLoading(true);
    setSuccess(false);
    try {
      await labourApi.createProject({
        ...formData,
        number_of_labours_needed: parseInt(formData.number_of_labours_needed),
        budget: formData.budget ? parseInt(formData.budget) : undefined,
      });
      setSuccess(true);
      fetchApplications();
      setFormData({
        project_name: "",
        location: "",
        number_of_labours_needed: "1",
        budget: "",
        required_skills: [],
        start_date: "",
        end_date: "",
      });
    } catch (err: any) {
      alert(err.message || "Failed to post work request");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (assignmentId: string) => {
    try {
      await labourApi.updateAssignmentStatus(assignmentId, "in-progress");
      alert("Application approved! Labour has been assigned to your project.");
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

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-20">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined text-4xl text-primary">engineering</span>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-800">Post a Work Request</h1>
            <p className="text-sm font-medium text-slate-500">Hire certified and verified labourers for your property or project.</p>
          </div>
        </div>

        {success && (
          <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2 border border-green-100">
            <span className="material-symbols-outlined">check_circle</span>
            <span className="font-bold text-sm">Your work request has been posted! The admin will assign workers shortly.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Project/Work Name</label>
              <input 
                required 
                type="text"
                name="project_name" 
                value={formData.project_name} 
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all font-medium text-slate-800" 
                placeholder="e.g. Home Painting, Plumbing Fix"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Location</label>
              <input 
                required 
                type="text"
                name="location" 
                value={formData.location} 
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all font-medium text-slate-800" 
                placeholder="Complete site address"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Required Skills</label>
            <div className="flex flex-wrap gap-3">
              {skills.map(skill => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                    formData.required_skills.includes(skill)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate-100 bg-white text-slate-500 hover:border-primary/30"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Number of Workers</label>
              <input 
                required 
                type="number"
                min="1"
                name="number_of_labours_needed" 
                value={formData.number_of_labours_needed} 
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all font-medium text-slate-800" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Budget (Optional, ₹)</label>
              <input 
                type="number"
                min="0"
                name="budget" 
                value={formData.budget} 
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all font-medium text-slate-800" 
                placeholder="Total or Daily Budget"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Start Date</label>
              <input 
                required 
                type="date"
                name="start_date" 
                value={formData.start_date} 
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all font-medium text-slate-800" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">End Date (Optional)</label>
              <input 
                type="date"
                name="end_date" 
                value={formData.end_date} 
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all font-medium text-slate-800" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all hover:shadow-lg hover:shadow-slate-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              <>
                <span className="material-symbols-outlined">post_add</span>
                Post Work Request
              </>
            )}
          </button>
        </form>
      </div>

      {/* Pending Applications Section */}
      <div className="mt-12">
        <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-6">
          <span className="w-2 h-8 bg-primary rounded-full" />
          Pending Applications
        </h2>

        {appsLoading ? (
          <div className="flex justify-center py-10">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary">refresh</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">inbox</span>
            <p className="text-slate-500 font-medium text-sm">No pending applications for your posted work.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map((app) => (
              <div key={app._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-800">{app.labour_id?.name || "Unknown Worker"}</h3>
                      <p className="text-primary text-xs font-bold uppercase tracking-widest mt-1">
                        {app.labour_id?.skill_type || "General"}
                      </p>
                    </div>
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      Pending
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    Applied for: <strong>{app.project_id?.project_name || "N/A"}</strong>
                  </p>
                  <div className="text-xs text-slate-500 flex items-center gap-4 mb-4">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">call</span> {app.labour_id?.phone}</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">work_history</span> {app.labour_id?.experience} Yrs</span>
                  </div>
                </div>
                <div className="flex gap-2">
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
    </div>
  );
}
