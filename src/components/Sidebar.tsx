"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users, UserCheck, FileText,
  ClipboardList, LogOut, ChevronLeft, ChevronRight, Shield
} from "lucide-react";

interface UserData {
  id_user: number;
  nama: string;
  email: string;
  role: string;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const roleKey = user?.role || "KARYAWAN";
  
  const menuItems: Record<string, { name: string; icon: any; path: string }[]> = {
    ADMIN_HR: [
      { name: "Monitoring Progress", icon: LayoutDashboard, path: "/dashboard/admin" },
      { name: "Kelola Periode", icon: ClipboardList, path: "/dashboard/admin/periode" },
      { name: "Daftar Karyawan", icon: Users, path: "/dashboard/admin/karyawan" },
      { name: "Laporan", icon: FileText, path: "/dashboard/admin/laporan" },
    ],
    MANAJEMEN: [
      { name: "Executive Dashboard", icon: LayoutDashboard, path: "/dashboard/manajemen" },
      { name: "Talent Mapping", icon: Users, path: "/dashboard/manajemen/talent" },
      { name: "Laporan Strategis", icon: FileText, path: "/dashboard/manajemen/laporan" },
    ],
    KARYAWAN: [
      { name: "Personal Dashboard", icon: LayoutDashboard, path: "/dashboard/karyawan" },
      { name: "Penugasan Evaluasi", icon: ClipboardList, path: "/dashboard/karyawan/penugasan" },
    ],
    ATASAN: [
      { name: "Dashboard Tim", icon: LayoutDashboard, path: "/dashboard/atasan" },
      { name: "Approve Peer", icon: UserCheck, path: "/dashboard/atasan/peer" },
      { name: "Penugasan Evaluasi", icon: ClipboardList, path: "/dashboard/penilaian" },
    ],
  };

  const currentMenu = menuItems[roleKey] || menuItems.KARYAWAN;

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
    <div
      className={`${
        collapsed ? "w-20" : "w-72"
      } h-full bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col justify-between transition-all duration-300 relative z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-20 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-300 hover:shadow-md transition-all shadow-sm z-50 cursor-pointer"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className={`p-6 ${collapsed ? "px-4" : ""}`}>
          {collapsed ? (
            <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-brand-500 to-teal-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <span className="text-white text-sm font-bold">A</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-teal-400 flex items-center justify-center shadow-lg shadow-brand-500/20 shrink-0">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">AKHLAK 360</h2>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Energi Nusantara</p>
              </div>
            </div>
          )}
        </div>

        {!collapsed && user && (
          <div className="mx-4 mt-2 mb-6 p-3 rounded-2xl bg-slate-50 border border-slate-100/80 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-brand-600 font-bold text-sm shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user.nama}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Shield className="w-3 h-3 text-brand-500" />
                  <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">{roleLabel[roleKey]}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className={`mt-2 space-y-1 ${collapsed ? "px-2" : "px-4"}`}>
          {!collapsed && (
            <div className="px-2 mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Menu Navigasi</span>
            </div>
          )}
          {currentMenu.map((item, idx) => {
            const isActive = pathname === item.path;
            return (
              <Link key={idx} href={item.path}>
                <div
                  className={`flex items-center ${collapsed ? "justify-center" : ""} gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    isActive
                      ? "bg-brand-50 text-brand-700 font-semibold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  {isActive && !collapsed && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 rounded-r-full"></div>
                  )}
                  <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isActive ? "text-brand-600 scale-110" : "text-slate-400 group-hover:text-brand-500 group-hover:scale-110"}`} />
                  {!collapsed && <span className="text-sm z-10">{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={`p-4 ${collapsed ? "px-2" : ""}`}>
        <button
          onClick={handleLogout}
          className={`flex items-center ${collapsed ? "justify-center" : ""} gap-3 w-full px-3 py-2.5 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-transform duration-200 group-hover:-translate-x-1" />
          {!collapsed && <span className="font-semibold text-sm">Keluar Sistem</span>}
        </button>
      </div>
    </div>
  );
}
