"use client";
import Link from "next/link";
import { useState } from "react";
import AuthModal from "./AuthModal";
import LabourAuthModal from "./LabourAuthModal";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: "login" as "login" | "signup" });
  const [labourModal, setLabourModal] = useState({ isOpen: false, mode: "login" as "login" | "signup" });
  const { user, logout } = useAuth();

  const openLogin = () => setAuthModal({ isOpen: true, mode: "login" });
  const openSignup = () => setAuthModal({ isOpen: true, mode: "signup" });
  const closeAuth = () => setAuthModal({ ...authModal, isOpen: false });
  
  const openLabourPortal = () => setLabourModal({ isOpen: true, mode: "login" });
  const closeLabour = () => setLabourModal({ ...labourModal, isOpen: false });

  return (
    <>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 px-6 md:px-20 py-2 bg-white sticky top-0 z-50 shadow-sm transition-colors duration-300">
        {/* Brand */}
        <div className="flex items-center gap-3 text-primary">
          <Link href="/">
            <img src="/logo1.png" alt="Logo" className="w-full h-20" />
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex flex-1 justify-end items-center gap-6">
          <nav className="flex items-center gap-8">
            {[
              { label: "Find Work", href: "/work" },
              { label: "Properties", href: "/properties" },
              { label: "Services", href: "/services" },
              { label: "Invest", href: "/invest" },
              { label: "Tourism", href: "/tourism" },
              { label: "About", href: "/about" },
            ].map((item) => (
              <Link
                key={item.label}
                className="text-slate-700 text-sm font-medium hover:text-primary transition-colors"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={openLabourPortal}
              className="text-slate-700 text-sm font-medium hover:text-primary transition-colors"
            >
              Labour
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              // ── Logged-in state ──
              <>
                <Link href="/dashboard" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-all group">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-black uppercase">
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      : user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{user.name.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-slate-500 text-sm font-bold hover:text-red-500 transition-colors px-3 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              // ── Guest state ──
              <>
                <button
                  onClick={openLogin}
                  className="text-slate-600 text-sm font-bold hover:text-primary transition-colors px-4 py-2"
                >
                  Login
                </button>
                <button
                  onClick={openSignup}
                  className="bg-primary/10 text-primary px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-all"
                >
                  Sign Up
                </button>
              </>
            )}
            <Link
              href="/contact"
              className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-95 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            className="group w-12 h-10 flex flex-col items-end justify-center space-y-1 focus:outline-none hover:bg-primary/10 active:scale-95 transition-all px-3"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`h-0.5 bg-primary rounded-full transition-all duration-300 ${menuOpen ? "w-7 rotate-45 translate-y-2.5" : "w-7"}`} />
            <div className={`h-0.5 bg-primary rounded-full transition-all duration-300 ${menuOpen ? "w-0 opacity-0" : "w-5"}`} />
            <div className={`h-0.5 bg-primary rounded-full transition-all duration-300 ${menuOpen ? "w-0 opacity-0" : "w-7"}`} />
            <div className={`h-0.5 bg-primary rounded-full transition-all duration-300 ${menuOpen ? "w-7 -rotate-45 -translate-y-2" : "w-3"}`} />
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-primary/10 shadow-md lg:hidden z-50">
            <div className="flex flex-col p-6 gap-4">
              {[
                { label: "Find Work", href: "/work" },
                { label: "Properties", href: "/properties" },
                { label: "Services", href: "/services" },
                { label: "Invest", href: "/invest" },
                { label: "Tourism", href: "/tourism" },
                { label: "About", href: "/about" },
              ].map((item) => (
                <Link
                  key={item.label}
                  className="text-slate-700 text-sm font-medium hover:text-primary"
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                className="text-slate-700 text-sm font-medium hover:text-primary text-left"
                onClick={() => { setMenuOpen(false); openLabourPortal(); }}
              >
                Labour
              </button>
              <hr className="border-slate-100" />
              <div className="flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="w-full flex items-center gap-3 bg-primary/10 text-primary py-3 px-4 rounded-xl text-sm font-bold shadow-sm"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-black uppercase overflow-hidden">
                        {user.avatar
                          ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          : user.name.charAt(0)}
                      </div>
                      <span>Dashboard ({user.name.split(" ")[0]})</span>
                    </Link>
                    <button
                      onClick={() => { setMenuOpen(false); logout(); }}
                      className="w-full text-slate-500 text-sm font-bold py-3 px-4 hover:text-red-500 transition-colors text-left border border-slate-100 rounded-xl"
                    >
                      Logout Session
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setMenuOpen(false); openLogin(); }}
                      className="w-full text-slate-700 text-sm font-bold py-3 px-4 hover:text-primary transition-colors text-center border border-slate-300 rounded-xl"
                    >
                      Login Account
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); openSignup(); }}
                      className="w-full bg-primary/10 text-primary py-3 rounded-xl text-sm font-bold hover:bg-primary hover:text-white border border-slate-500 transition-all text-center"
                    >
                      Create Account
                    </button>
                  </>
                )}
                <Link
                  href="/contact"
                  className="flex items-center justify-center rounded-xl h-12 px-5 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20"
                  onClick={() => setMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuth}
        initialMode={authModal.mode}
      />
      
      {/* Labour Authentication Modal */}
      <LabourAuthModal
        isOpen={labourModal.isOpen}
        onClose={closeLabour}
        initialMode={labourModal.mode}
      />
    </>
  );
}
