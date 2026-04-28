"use client";
import { useState, useEffect } from "react";
import { labourApi } from "@/lib/api";
import LabourAuthModal from "@/components/LabourAuthModal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WorkPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState({ isOpen: false });
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await labourApi.getAllProjects();
      setProjects(res.data || []);
    } catch (err) {
      console.error("Failed to load work", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (projectId: string) => {
    const token = localStorage.getItem("labourToken");
    if (!token) {
      setSelectedProjectId(projectId);
      setAuthModal({ isOpen: true });
      return;
    }

    try {
      await labourApi.applyForProject(projectId, token);
      alert("Successfully applied for this work! Our admin will coordinate with you.");
      // Optionally refresh list or redirect to dashboard
      window.location.href = "/labour-dashboard";
    } catch (err: any) {
      alert(err.message || "Failed to apply for the work.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
      </div>
    );
  }

  return (
    <div className="layout-container flex h-full grow flex-col min-h-screen transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 bg-slate-50 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="bg-primary rounded-[3rem] p-8 md:p-16 mb-12 text-center text-white relative overflow-hidden shadow-xl shadow-primary/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
            
            <span className="material-symbols-outlined text-6xl mb-4 relative z-10">handyman</span>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight relative z-10">Available Work</h1>
            <p className="text-primary-100 font-medium mt-4 max-w-2xl mx-auto relative z-10">
              Find construction, plumbing, electrical, and other labour opportunities posted by our verified users and Nithuri project managers.
            </p>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center">
              <span className="material-symbols-outlined text-7xl text-slate-200 mb-6 font-thin">assignment_late</span>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">No Work Posted Yet</h2>
              <p className="text-slate-500 font-medium mt-2 max-w-md mx-auto">
                We currently don't have any open work assignments. Check back soon for new opportunities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all flex flex-col group">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-slate-800">{project.project_name}</h3>
                    {project.budget && (
                      <span className="bg-green-50 text-green-700 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                        ₹{project.budget}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-4">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {project.location}
                  </div>

                  <div className="mb-6 flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {project.required_skills?.map((skill: string) => (
                        <span key={skill} className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold px-3 py-1 rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mb-6">
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Workers Needed</p>
                      <p className="font-bold text-slate-700 text-sm">{project.number_of_labours_needed}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Start Date</p>
                      <p className="font-bold text-slate-700 text-sm">
                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : "Immediate"}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleApply(project._id)}
                    className="w-full py-4 bg-primary/10 text-primary rounded-xl font-black uppercase tracking-widest text-sm group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">how_to_reg</span>
                    Apply for Work
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <LabourAuthModal
          isOpen={authModal.isOpen}
          onClose={() => setAuthModal({ isOpen: false })}
          initialMode="login"
        />
      </main>

      <Footer />
    </div>
  );
}
