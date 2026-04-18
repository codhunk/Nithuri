"use client";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import AuthModal from "./AuthModal";
import { useAuth } from "@/contexts/AuthContext";

/** Inline SVG sun icon */
function SunIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

/** Inline SVG moon icon */
function MoonIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: "login" as "login" | "signup" });
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isDark = theme === "dark";

  const openLogin = () => setAuthModal({ isOpen: true, mode: "login" });
  const openSignup = () => setAuthModal({ isOpen: true, mode: "signup" });
  const closeAuth = () => setAuthModal({ ...authModal, isOpen: false });

  return (
    <>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-primary/10 dark:border-primary/20 px-6 md:px-20 py-2 bg-white dark:bg-slate-900 sticky top-0 z-50 shadow-sm transition-colors duration-300">
        {/* Brand */}
        <div className="flex items-center gap-3 text-primary">
          <Link href="/">
            <img src="/logo-bg.png" alt="Logo" className="w-full h-20" />
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex flex-1 justify-end items-center gap-6">
          <nav className="flex items-center gap-8">
            {[
              { label: "Properties", href: "/properties" },
              { label: "Services", href: "/services" },
              { label: "Invest", href: "/invest" },
              { label: "Tourism", href: "/tourism" },
              { label: "About", href: "/about" },
            ].map((item) => (
              <Link
                key={item.label}
                className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ── Dark / Light toggle pill ── */}
          {/* <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="relative flex items-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer bg-slate-200 dark:bg-primary/20"
          >
            <div
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white dark:bg-primary shadow-sm flex items-center justify-center transition-all duration-300 ${isDark ? "left-7" : "left-0.5"}`}
            >
              {isDark ? <MoonIcon size={12} /> : <SunIcon size={12} />}
            </div>
          </button> */}

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
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">{user.name.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-slate-500 dark:text-slate-400 text-sm font-bold hover:text-red-500 transition-colors px-3 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              // ── Guest state ──
              <>
                <button
                  onClick={openLogin}
                  className="text-slate-600 dark:text-slate-300 text-sm font-bold hover:text-primary transition-colors px-4 py-2"
                >
                  Login
                </button>
                <button
                  onClick={openSignup}
                  className="bg-primary/10 dark:bg-primary/20 text-primary px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-all"
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

        {/* Mobile: icon toggle + hamburger (Toggle commented out) */}
        <div className="flex lg:hidden items-center gap-3">
          {/* <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer"
            style={{
              backgroundColor: isDark ? "#004c40" : "#e2e8f0",
              color: isDark ? "#e2e8f0" : "#f59e0b",
            }}
          >
            {isDark ? <MoonIcon size={18} /> : <SunIcon size={18} />}
          </button> */}
          <button
            className="text-primary dark:text-primary"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-primary/10 dark:border-primary/20 shadow-md lg:hidden z-50 transition-colors duration-300">
            <div className="flex flex-col p-6 gap-4">
              {[
                { label: "Properties", href: "/properties" },
                { label: "Services", href: "/services" },
                { label: "Invest", href: "/invest" },
                { label: "Tourism", href: "/tourism" },
                { label: "About", href: "/about" },
              ].map((item) => (
                <Link
                  key={item.label}
                  className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary dark:hover:text-primary"
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <hr className="border-slate-100 dark:border-primary/10" />
              <div className="flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="w-full flex items-center gap-3 bg-primary/10 dark:bg-primary/20 text-primary py-3 px-4 rounded-xl text-sm font-bold shadow-sm"
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
                      className="w-full text-slate-500 dark:text-slate-400 text-sm font-bold py-3 px-4 hover:text-red-500 transition-colors text-left border border-slate-100 dark:border-primary/10 rounded-xl"
                    >
                      Logout Session
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setMenuOpen(false); openLogin(); }}
                      className="w-full text-slate-700 dark:text-slate-300 text-sm font-bold py-3 px-4 hover:text-primary transition-colors text-left border border-slate-100 dark:border-primary/10 rounded-xl"
                    >
                      Login Account
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); openSignup(); }}
                      className="w-full bg-primary/10 dark:bg-primary/20 text-primary py-3 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all text-center"
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
    </>
  );
}
