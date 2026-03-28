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
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
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

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-background-dark overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-primary/20 flex flex-col shadow-sm transition-all duration-300 z-50`}>
        <div className="p-6 border-b border-slate-100 dark:border-primary/10 flex items-center justify-between">
          <Link href="/" className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? "w-auto" : "w-0"}`}>
             <span className="font-black text-primary text-xl whitespace-nowrap">NITHURI</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-primary transition-colors">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-slate-500 dark:text-slate-400 hover:bg-primary/5 hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {isSidebarOpen && <span className="flex-1">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-primary/10">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-primary/20 px-8 py-4 flex items-center justify-between transition-colors duration-300">
          <div>
            <h1 className="text-xl font-black dark:text-white capitalize">
              {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
            </h1>
            <p className="text-slate-500 text-sm hidden sm:block">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{user.name}</p>
                <p className="text-[10px] font-bold text-primary uppercase">{user.role}</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow-lg shadow-primary/20">
                {user.avatar ? (
                   <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover" />
                ) : (
                   user.name.charAt(0).toUpperCase()
                )}
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/20 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
