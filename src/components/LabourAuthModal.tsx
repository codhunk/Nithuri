"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { labourApi } from "@/lib/api";

interface LabourAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function LabourAuthModal({ isOpen, onClose, initialMode = "login" }: LabourAuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Registration form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [skillType, setSkillType] = useState("General Labour");
  const [experience, setExperience] = useState("");
  const [wage, setWage] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [documents, setDocuments] = useState<File | null>(null);

  const [showPass, setShowPass] = useState(false);

  const skills = ["POP Worker", "Painter", "Electrician", "Plumber", "Carpenter", "General Labour"];

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setMode(initialMode);
      setError("");
      setSuccessMsg("");
    } else {
      const t = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, initialMode]);

  if (!isOpen && !isVisible) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "profile_image" | "documents") => {
    if (e.target.files && e.target.files[0]) {
      if (type === "profile_image") setProfileImage(e.target.files[0]);
      else setDocuments(e.target.files[0]);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setIsLoading(true);
    try {
      const res = await labourApi.login({ phone, password });
      localStorage.setItem("labourToken", res.accessToken || "");
      localStorage.setItem("labourData", JSON.stringify(res.data));
      onClose();
      router.push("/labour-dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setIsLoading(true);
    try {
      const data = new FormData();
      data.append("name", name);
      data.append("phone", phone);
      data.append("password", password);
      data.append("skill_type", skillType);
      data.append("experience", experience);
      data.append("wage", wage);
      data.append("location", location);

      if (profileImage) data.append("profile_image", profileImage);
      if (documents) data.append("documents", documents);

      await labourApi.register(data);
      setSuccessMsg("Registration successful! You can now log in.");
      switchMode("login");
    } catch (err: any) {
      setError(err.message || "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (m: "login" | "signup") => {
    setMode(m); setError(""); setSuccessMsg("");
    // Clear passwords
    setPassword("");
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 overflow-y-auto ${isOpen ? "opacity-100" : "opacity-0"}`}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm fixed" onClick={onClose} />

      <div className={`bg-white w-full max-w-lg my-8 rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-white/20 transition-all duration-300 transform ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-primary transition-all z-10">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="bg-primary p-8 pt-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <span className="material-symbols-outlined text-3xl">engineering</span>
            <span className="font-bold text-lg">Worker Portal</span>
          </div>
          <h2 className="text-3xl font-bold mb-1 relative z-10">
            {mode === "login" ? "Welcome Back" : "Join Nithuri"}
          </h2>
          <p className="text-white/70 text-sm relative z-10 font-medium">
            {mode === "login" ? "Access your assignments and schedule" : "Register to get construction assignments"}
          </p>
        </div>

        <div className="flex border-b border-slate-100 bg-slate-50">
          <button onClick={() => switchMode("login")} className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${mode === "login" ? "border-primary text-primary" : "border-transparent text-slate-400"}`}>
            Log In
          </button>
          <button onClick={() => switchMode("signup")} className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${mode === "signup" ? "border-primary text-primary" : "border-transparent text-slate-400"}`}>
            Register
          </button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
              <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">error</span>
              <p className="text-red-600 text-xs font-medium">{error}</p>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-xl flex items-start gap-2">
              <span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check_circle</span>
              <p className="text-green-700 text-xs font-medium">{successMsg}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={mode === "login" ? handleLogin : handleRegister}>
            {mode === "signup" && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-sm">person</span>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Skill</label>
                    <select required value={skillType} onChange={(e) => setSkillType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all">
                      {skills.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Exp (Years)</label>
                    <input type="number" required value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 5"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Wage (₹)</label>
                    <input type="number" required value={wage} onChange={(e) => setWage(e.target.value)} placeholder="e.g. 800"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Location</label>
                    <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Nithuri"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Profile Photo</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "profile_image")}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-primary/10 file:text-primary" />
                </div>
              </>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-sm">call</span>
                <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-sm">lock</span>
                <input type={showPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-12 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
                  <span className="material-symbols-outlined text-sm">{showPass ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {isLoading ? "Please wait..." : mode === "login" ? "Login to Dashboard" : "Register Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
