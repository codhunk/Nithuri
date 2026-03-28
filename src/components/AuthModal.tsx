"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

type Step = "form" | "otp";

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const router = useRouter();
  const { login, setUser } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [step, setStep] = useState<Step>("form");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPass, setShowPass] = useState(false);

  // OTP
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpResendTimer, setOtpResendTimer] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setMode(initialMode);
      setStep("form");
      setError("");
      setSuccessMsg("");
    } else {
      const t = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, initialMode]);

  // OTP resend countdown
  useEffect(() => {
    if (otpResendTimer <= 0) return;
    const t = setInterval(() => setOtpResendTimer((n) => n - 1), 1000);
    return () => clearInterval(t);
  }, [otpResendTimer]);

  if (!isOpen && !isVisible) return null;

  // ─── OTP Input Handling ──────────────────────────────────────────────────
  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").trim().replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  // ─── Submit: Register ────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setIsLoading(true);
    try {
      await authApi.register({ name, email, password, role });
      setOtpEmail(email);
      setOtpResendTimer(60);
      setStep("otp");
      setSuccessMsg(`We've sent a 6-digit code to ${email}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed. Try again.");
    } finally { setIsLoading(false); }
  };

  // ─── Submit: Login ───────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setIsLoading(true);
    try {
      const res = await login(email, password);
      if (res.requiresVerification) {
        setOtpEmail(res.email || email);
        setOtpResendTimer(60);
        setStep("otp");
        setSuccessMsg(`Your account needs verification. We've sent a code to ${res.email || email}`);
      } else {
        onClose();
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed. Check your credentials.");
    } finally { setIsLoading(false); }
  };

  // ─── Submit: Verify OTP ──────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter all 6 digits"); return; }
    setError(""); setIsLoading(true);
    try {
      const res = await authApi.verifyOtp({ email: otpEmail, otp: code });
      // Backend already set the httpOnly cookie — just update React state
      setUser(res.data);
      onClose();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid OTP. Try again.");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally { setIsLoading(false); }
  };

  // ─── Resend OTP ──────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (otpResendTimer > 0) return;
    setError(""); setIsLoading(true);
    try {
      await authApi.resendOtp(otpEmail);
      setOtpResendTimer(60);
      setSuccessMsg("New code sent! Check your email.");
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to resend. Try again.");
    } finally { setIsLoading(false); }
  };

  const switchMode = (m: "login" | "signup") => {
    setMode(m); setStep("form"); setError(""); setSuccessMsg("");
    setName(""); setEmail(""); setPassword(""); setOtp(["", "", "", "", "", ""]);
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className={`bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-white/20 transition-all duration-300 transform ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-primary/10 hover:text-primary transition-all z-10">
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Header */}
        <div className="bg-primary p-8 pt-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <span className="material-symbols-outlined text-3xl">landscape</span>
            <span className="font-black text-lg">Nithuri Singh &amp; Sons</span>
          </div>
          <h2 className="text-3xl font-black mb-1 relative z-10">
            {step === "otp" ? "Verify Email" : mode === "login" ? "Welcome Back" : "Start Your Journey"}
          </h2>
          <p className="text-white/70 text-sm relative z-10 font-medium">
            {step === "otp"
              ? `Enter the 6-digit code sent to ${otpEmail}`
              : mode === "login"
              ? "Access your dashboard and listings"
              : "Create an account to list and invest"}
          </p>
        </div>

        {/* Tabs — hidden on OTP step */}
        {step === "form" && (
          <div className="flex border-b border-slate-100 dark:border-primary/5 bg-slate-50 dark:bg-primary/5">
            <button onClick={() => switchMode("login")} className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${mode === "login" ? "border-primary text-primary" : "border-transparent text-slate-400"}`}>
              Log In
            </button>
            <button onClick={() => switchMode("signup")} className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${mode === "signup" ? "border-primary text-primary" : "border-transparent text-slate-400"}`}>
              Create Account
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-8">
          {/* Error / Success */}
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

          {/* ── OTP Step ────────────────────────────────────────────────── */}
          {step === "otp" ? (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-2xl font-black border-2 rounded-2xl bg-slate-50 dark:bg-primary/5 dark:text-white outline-none transition-all focus:border-primary focus:bg-white dark:focus:bg-primary/10 focus:ring-4 focus:ring-primary/10"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify & Continue →"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={otpResendTimer > 0 || isLoading}
                  className="text-xs font-bold text-primary hover:underline disabled:text-slate-400 disabled:no-underline"
                >
                  {otpResendTimer > 0 ? `Resend code in ${otpResendTimer}s` : "Didn't receive the code? Resend"}
                </button>
              </div>

              <button type="button" onClick={() => { setStep("form"); setError(""); setSuccessMsg(""); }} className="w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors">
                ← Back to {mode === "login" ? "login" : "sign up"}
              </button>
            </form>

          ) : (
          // ── Form Step ────────────────────────────────────────────────────
            <form className="space-y-4" onSubmit={mode === "login" ? handleLogin : handleRegister}>
              {mode === "signup" && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-sm">person</span>
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name"
                        className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-100 dark:border-primary/20 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all dark:text-white" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Type</label>
                    <div className="flex gap-3">
                      {[{ val: "user", label: "Buyer / Tenant", icon: "person_search" }, { val: "owner", label: "Property Owner", icon: "home_work" }].map((r) => (
                        <button key={r.val} type="button" onClick={() => setRole(r.val)}
                          className={`flex-1 flex items-center gap-2 p-3 rounded-xl border-2 text-xs font-bold transition-all ${role === r.val ? "border-primary bg-primary/5 text-primary" : "border-slate-100 text-slate-500 hover:border-primary/30"}`}>
                          <span className="material-symbols-outlined text-base">{r.icon}</span>
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-sm">mail</span>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com"
                    className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-100 dark:border-primary/20 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all dark:text-white" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-sm">lock</span>
                  <input type={showPass ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-100 dark:border-primary/20 rounded-xl pl-11 pr-12 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all dark:text-white" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
                    <span className="material-symbols-outlined text-sm">{showPass ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              {mode === "login" && (
                <div className="flex justify-end">
                  <button type="button" className="text-[10px] font-black text-primary uppercase hover:underline">Forgot Password?</button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                {isLoading ? "Please wait..." : mode === "login" ? "Login to Dashboard" : "Create My Account"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-slate-400">
            By continuing, you agree to our <Link href="/terms" className="text-primary hover:underline">Terms</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
