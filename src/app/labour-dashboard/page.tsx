"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { labourApi } from "@/lib/api";

export default function LabourDashboard() {
  const router = useRouter();
  const [labour, setLabour] = useState<any>(null);
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem("labourToken");
    const dataString = localStorage.getItem("labourData");

    if (!token || !dataString) {
      router.replace("/");
      return;
    }

    try {
      const data = JSON.parse(dataString);
      setLabour(data);
      fetchAssignments(token);
    } catch (e) {
      router.replace("/");
    }
  }, [router]);

  const fetchAssignments = async (token: string) => {
    try {
      const res = await labourApi.getMyAssignments(token);
      setLabour((prev: any) => ({ ...prev, assignments: res.data || [] }));
      
      const allProjectsRes = await labourApi.getAllProjects();
      const allProjects = allProjectsRes.data || [];
      
      // Filter out projects the worker has already applied for
      const myProjectIds = new Set((res.data || []).map((a: any) => a.project_id?._id));
      const filteredProjects = allProjects.filter(p => !myProjectIds.has(p._id));
      setAvailableProjects(filteredProjects);
    } catch (err) {
      console.error("Failed to load assignments", err);
    }
  };

  const handleApply = async (projectId: string) => {
    const token = localStorage.getItem("labourToken");
    if (!token) return;
    
    setApplyingId(projectId);
    try {
      await labourApi.applyForProject(projectId, token);
      alert("Successfully applied! The admin will notify you upon approval.");
      fetchAssignments(token); // Refresh assignments and available projects
    } catch (err: any) {
      alert(err.message || "Failed to apply for the work.");
    } finally {
      setApplyingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("labourToken");
    localStorage.removeItem("labourData");
    router.replace("/");
  };

  if (!labour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
      </div>
    );
  }

  const { assignments = [] } = labour;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl text-primary">engineering</span>
            <div>
              <h1 className="text-xl font-bold uppercase tracking-tight text-slate-800">Worker Dashboard</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{labour.skill_type}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all text-xs uppercase"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Profile Card */}
        <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 bg-slate-100 flex-shrink-0">
            {labour.profile_image ? (
              <img src={process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') + labour.profile_image} className="w-full h-full object-cover" alt={labour.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <span className="material-symbols-outlined text-5xl text-primary">person</span>
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-800">{labour.name}</h2>
            <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-2">
              <span className="material-symbols-outlined text-sm">call</span> {labour.phone}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                {labour.skill_type}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white ${labour.availability === "Available" ? "bg-green-500" : "bg-slate-500"
                }`}>
                {labour.availability}
              </span>
            </div>
          </div>
        </section>

        {/* Assignments Section */}
        <section>
          <h3 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3 mb-6">
            <span className="w-2 h-8 bg-primary rounded-full" />
            My Assignments
          </h3>

          {assignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
              <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 font-thin">assignment</span>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No assignments yet.</p>
              <p className="text-xs font-medium text-slate-400 mt-2">We will notify you when a project needs your skills.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments.map((assignment: any) => {
                const project = assignment.project_id || {};
                return (
                  <div key={assignment._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-slate-800">{project.project_name || "Nithuri Project"}</h4>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-sm">location_on</span> {project.location || "Nithuri Site"}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white ${
                          assignment.status === "completed" ? "bg-green-500" :
                          assignment.status === "in-progress" ? "bg-amber-500" :
                          assignment.status === "rejected" ? "bg-red-500" : "bg-blue-500"
                        }`}>
                        {assignment.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-4">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Assigned Date</p>
                        <p className="font-bold text-slate-700 text-sm">
                          {new Date(assignment.assigned_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Expected End Date</p>
                        <p className="font-bold text-slate-700 text-sm">
                          {project.end_date ? new Date(project.end_date).toLocaleDateString() : "Ongoing"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Available Work Section */}
        <section className="pt-8 border-t border-slate-200">
          <h3 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3 mb-6">
            <span className="w-2 h-8 bg-green-500 rounded-full" />
            Available Work Opportunities
          </h3>

          {availableProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
              <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 font-thin">assignment_late</span>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No new work available</p>
              <p className="text-xs font-medium text-slate-400 mt-2">You have applied to all current opportunities or none are posted.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableProjects.map((project) => (
                <div key={project._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold text-slate-800">{project.project_name}</h4>
                    {project.budget && (
                      <span className="bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                        ₹{project.budget}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-4">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {project.location}
                  </div>

                  <div className="mb-6 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {project.required_skills?.map((skill: string) => (
                        <span key={skill} className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mb-6">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Workers Needed</p>
                      <p className="font-bold text-slate-700 text-sm">{project.number_of_labours_needed}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Start Date</p>
                      <p className="font-bold text-slate-700 text-sm">
                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : "Immediate"}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleApply(project._id)}
                    disabled={applyingId === project._id}
                    className="w-full py-4 bg-primary/10 text-primary rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {applyingId === project._id ? (
                      <span className="material-symbols-outlined animate-spin">refresh</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">how_to_reg</span>
                        Apply Now
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
