"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
    { icon: "add_box", label: "Add Property", href: "/dashboard/add-property" },
    { icon: "list_alt", label: "My Listings", href: "/dashboard/my-listings" },
    { icon: "chat_bubble", label: "Messages", href: "/dashboard/messages" },
    { icon: "person", label: "Profile", href: "/dashboard/profile" },
  ];

  if (user.role === "admin") {
    navItems.push({ icon: "admin_panel_settings", label: "Admin Portal", href: "/dashboard/admin" });
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-primary text-white flex flex-col shadow-2xl transition-all duration-300 z-50`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Link href="/" className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? "w-auto" : "w-0"}`}>
            <span className="font-black text-white text-xl whitespace-nowrap tracking-tight">NITHURI</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white/50 hover:text-white transition-colors">
            <span className="material-symbols-outlined">{isSidebarOpen ? "menu_open" : "menu"}</span>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                  ? "bg-white text-primary shadow-xl shadow-black/10 scale-[1.02]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {isSidebarOpen && <span className="flex-1">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            {isSidebarOpen && <span>Logout Session</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-primary px-6 py-3 flex items-center justify-between text-white shadow-lg relative z-40">
          <div>
            <h1 className="text-xl font-black capitalize tracking-tight">
              {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
            </h1>
            <p className="text-white/60 text-xs hidden sm:block font-medium">Estate Management • {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-white uppercase tracking-tight">{user.name}</p>
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center font-black text-sm shadow-xl shadow-black/10 cursor-pointer hover:scale-105 transition-transform">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50/50 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
