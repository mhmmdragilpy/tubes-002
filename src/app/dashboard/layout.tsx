"use client";

import { Sidebar } from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";

interface UserData {
  id_user: number;
  nama: string;
  email: string;
  role: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
    // Refresh notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const roleLabel: Record<string, string> = {
    ADMIN_HR: "Admin HR",
    MANAJEMEN: "Manajemen",
    ATASAN: "Atasan",
    KARYAWAN: "Karyawan",
  };

  const initials = user?.nama
    ? user.nama.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "??";

  return (
    <div className="flex h-screen bg-slate-50/50 text-slate-900 overflow-hidden font-sans">
      <div className="z-30 flex h-full">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col z-10 overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-400/10 blur-[100px] pointer-events-none"></div>

        <header className="h-[76px] glass-panel rounded-none border-t-0 border-x-0 border-b border-slate-200/60 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:block">Portal Penilaian 360</p>
          </div>

          <div className="flex items-center space-x-5">
            <div className="hidden sm:flex items-center bg-slate-100/50 hover:bg-slate-100 px-3 py-1.5 rounded-full transition-colors border border-slate-200/50 focus-within:border-brand-300 focus-within:bg-white focus-within:shadow-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Pencarian cepat..." className="bg-transparent border-none focus:outline-none text-sm pl-2 w-48 text-slate-600 placeholder-slate-400" />
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-full transition-all duration-200"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-brand-500/10 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-800">Notifikasi</h4>
                    <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">{notifications.length} Baru</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-500 font-medium">
                        Tidak ada notifikasi baru
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <a href={notif.actionUrl} key={notif.id} className="block p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                          <p className="text-xs font-bold text-slate-800 mb-1 group-hover:text-brand-600 transition-colors">{notif.title}</p>
                          <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
                        </a>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200/60">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-tight">{user?.nama || "Memuat..."}</p>
                <p className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">{user ? roleLabel[user.role] : ""}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm flex items-center justify-center text-brand-600 font-bold hover:shadow-md transition-shadow cursor-pointer">
                {initials}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
          <div className="max-w-[1400px] mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
