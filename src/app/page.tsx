"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ChevronRight, LockKeyhole, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const router = useRouter();

  const testAccounts = [
    { role: "ADMIN_HR", label: "👑 Admin HR (Ahmad Admin)", email: "admin@energinusantara.com", password: "password123" },
    { role: "MANAJEMEN", label: "👔 Manajemen (Bapak Direktur)", email: "manajemen@energinusantara.com", password: "password123" },
    { role: "ATASAN", label: "🕵️ Atasan (Ahmad Fauzi)", email: "atasan@energinusantara.com", password: "password123" },
    { role: "KARYAWAN", label: "🧑‍💻 Karyawan 1 (Rizky)", email: "rizky@energinusantara.com", password: "password123" },
    { role: "KARYAWAN", label: "🧑‍💻 Karyawan 2 (Siti)", email: "siti@energinusantara.com", password: "password123" },
  ];

  const handleQuickSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEmail = e.target.value;
    if (!selectedEmail) return;
    
    const account = testAccounts.find(acc => acc.email === selectedEmail);
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
      setSelectedRole(account.role);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const { token, user } = data.data;
        
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "ADMIN_HR") {
          router.push("/dashboard/admin");
        } else if (user.role === "MANAJEMEN") {
          router.push("/dashboard/manajemen");
        } else if (user.role === "ATASAN") {
          router.push("/dashboard/atasan");
        } else {
          router.push("/dashboard/karyawan");
        }
      } else {
        alert(data.message || "Terjadi kesalahan saat login");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(error.message || "Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600/40 blur-[120px] mix-blend-screen animate-pulse duration-1000"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/30 blur-[150px] mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[15%] w-[30%] h-[30%] rounded-full bg-indigo-500/20 blur-[100px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        
        {/* Left Side: Branding */}
        <div className="flex-1 text-center lg:text-left pt-12 lg:pt-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-semibold tracking-wider text-slate-200 uppercase">Internal Corporate Portal</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Evaluasi AKHLAK <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-teal-400">
              360 Derajat
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Sistem penilaian kinerja komprehensif PT Energi Nusantara. 
            Membangun budaya kerja unggul melalui evaluasi transparan dan objektif.
          </p>
          
          <div className="hidden lg:flex items-center gap-8 mt-12">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">6</span>
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mt-1">Core Values</span>
            </div>
            <div className="w-px h-12 bg-slate-700"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">4</span>
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mt-1">Metode Evaluasi</span>
            </div>
            <div className="w-px h-12 bg-slate-700"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white">100%</span>
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mt-1">Terintegrasi</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full max-w-md">
          <div className="glass-panel p-8 sm:p-10 relative overflow-hidden">
            {/* Glossy top edge highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Selamat Datang</h2>
              <p className="text-slate-500 mt-1 text-sm font-medium">Silakan masuk menggunakan kredensial Anda</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700" htmlFor="email">Email / NIP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all duration-300 sm:text-sm font-medium"
                    placeholder="nama@energinusantara.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700" htmlFor="password">Kata Sandi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <LockKeyhole className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all duration-300 sm:text-sm font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 font-medium cursor-pointer">
                    Ingat Saya
                  </label>
                </div>
                <a href="#" className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                  Lupa Sandi?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 mt-2 border border-transparent rounded-xl shadow-lg shadow-brand-500/20 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5"
              >
                {isLoading ? "Memverifikasi..." : "Masuk"}
                {!isLoading && <ChevronRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200/50">
              <p className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider text-center">Akses Cepat (Demo Selector)</p>
              <div className="relative">
                <select
                  onChange={handleQuickSelect}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white/50 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 cursor-pointer transition-all duration-300"
                  defaultValue=""
                >
                  <option value="" disabled>Pilih Akun Demonstrasi...</option>
                  <optgroup label="Administrator & Eksekutif">
                    {testAccounts.filter(a => a.role === "ADMIN_HR" || a.role === "MANAJEMEN").map(account => (
                      <option key={account.email} value={account.email}>{account.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Manajerial & Karyawan">
                    {testAccounts.filter(a => a.role === "ATASAN" || a.role === "KARYAWAN").map(account => (
                      <option key={account.email} value={account.email}>{account.label}</option>
                    ))}
                  </optgroup>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
