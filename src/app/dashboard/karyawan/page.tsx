"use client";

import { useEffect, useState } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, Cell
} from "recharts";
import { ClipboardList, TrendingUp, TrendingDown, Award, Sparkles, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function KaryawanDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/dashboard/karyawan", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center p-10 text-slate-500">Gagal memuat data.</div>;
  }

  const { karyawan, periode, nilaiAkhir, predikat, personalRadar, gapAnalysis, tugasPenilaian } = data;

  // Mencari kekuatan (nilai self tertinggi) dan blind spot (gap terendah negatif)
  let kekuatan = { name: "-", skor: 0 };
  let blindSpot = { name: "-", gap: 0 };
  
  if (personalRadar && personalRadar.length > 0) {
    const highest = [...personalRadar].sort((a, b) => b.self - a.self)[0];
    kekuatan = { name: highest.subject, skor: highest.self };
  }
  
  if (gapAnalysis && gapAnalysis.length > 0) {
    const lowest = [...gapAnalysis].sort((a, b) => a.gap - b.gap)[0];
    if (lowest.gap < 0) {
      blindSpot = { name: lowest.name, gap: lowest.gap };
    }
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-brand-600 p-8 sm:p-10 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-teal-400 opacity-20 rounded-full blur-2xl translate-y-1/2 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-xs font-bold text-white tracking-widest uppercase">
              {periode ? periode.nama_periode : "Tidak ada periode aktif"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Personal Dashboard</h1>
          <p className="text-brand-100 mt-2 text-lg max-w-2xl font-medium">
            Selamat datang, <span className="text-white font-bold">{karyawan?.user?.nama || "Karyawan"}</span>. Pantau kinerja Anda dan lengkapi evaluasi 360 derajat untuk membangun budaya kerja yang unggul.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 group hover:-translate-y-1 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-500"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nilai Akhir</p>
          </div>
          <h3 className="text-4xl font-black text-slate-800 tracking-tight">{nilaiAkhir}</h3>
          <p className="text-sm font-semibold text-brand-600 mt-2 flex items-center gap-1">
            Predikat: <span className="bg-brand-100 px-2 py-0.5 rounded-md">{predikat}</span>
          </p>
        </div>

        <div className="card p-6 group hover:-translate-y-1 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-teal-500"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kekuatan</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{kekuatan.name}</h3>
          <p className="text-sm font-medium text-slate-500 mt-2">Skor Diri: <span className="font-bold text-teal-600">{kekuatan.skor}</span></p>
        </div>

        <div className="card p-6 group hover:-translate-y-1 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <TrendingDown className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Blind Spot</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{blindSpot.name}</h3>
          <p className="text-sm font-medium text-slate-500 mt-2">Gap Orang Lain: <span className="font-bold text-amber-600">{blindSpot.gap}</span></p>
        </div>

        <div className="card p-6 group hover:-translate-y-1 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ClipboardList className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tugas Penilaian</p>
          </div>
          <h3 className="text-4xl font-black text-slate-800 tracking-tight">{tugasPenilaian.length}</h3>
          <p className="text-sm font-bold text-rose-500 mt-2">
            Belum Selesai: {tugasPenilaian.filter((t: any) => t.status !== "Selesai").length}
          </p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Profil AKHLAK Anda</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Perbandingan antara Penilaian Diri dan Orang Lain</p>
          </div>
          <div className="flex-1 min-h-[350px]">
            {personalRadar.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={personalRadar}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 13, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#94a3b8' }} />
                  <Radar name="Penilaian Orang Lain" dataKey="others" stroke="#0ea5e9" strokeWidth={3} fill="#0ea5e9" fillOpacity={0.15} />
                  <Radar name="Penilaian Diri" dataKey="self" stroke="#10b981" strokeWidth={3} fill="#10b981" fillOpacity={0.15} />
                  <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 600, paddingTop: '20px' }} iconType="circle" />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ fontWeight: 600, fontSize: '14px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">Data belum tersedia</div>
            )}
          </div>
        </div>

        <div className="card p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Analisis Kesenjangan (Gap)</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Mengukur overestimate (hijau) atau underestimate (oranye) diri</p>
          </div>
          <div className="flex-1 min-h-[350px]">
             {gapAnalysis.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gapAnalysis} layout="vertical" margin={{ top: 5, right: 30, left: 15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" domain={[-1, 1]} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fill: '#334155', fontSize: 13, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="gap" radius={[0, 8, 8, 0]} barSize={24}>
                    {gapAnalysis.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.gap >= 0 ? "#14b8a6" : "#f59e0b"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="flex h-full items-center justify-center text-slate-400">Data belum tersedia</div>
            )}
          </div>
        </div>
      </div>

      {/* Task Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-slate-200/60 bg-white">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Daftar Tugas Penilaian</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Form yang harus Anda selesaikan pada periode aktif ini</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/80">Target Evaluasi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/80">Relasi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/80">Tenggat Waktu</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/80">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/80">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tugasPenilaian.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Belum ada tugas penilaian untuk saat ini.</td>
                </tr>
              )}
              {tugasPenilaian.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors duration-200 group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{t.target}</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase border ${
                      t.tipe === "SELF" ? "bg-purple-50 text-purple-600 border-purple-200" :
                      t.tipe === "PEER" ? "bg-sky-50 text-sky-600 border-sky-200" :
                      t.tipe === "ATASAN" ? "bg-indigo-50 text-indigo-600 border-indigo-200" :
                      "bg-emerald-50 text-emerald-600 border-emerald-200"
                    }`}>
                      {t.tipe}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{t.deadline}</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                      t.status === "Selesai" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                      t.status === "Proses" ? "bg-amber-50 text-amber-600 border-amber-200" :
                      "bg-rose-50 text-rose-600 border-rose-200"
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        t.status === "Selesai" ? "bg-emerald-500" :
                        t.status === "Proses" ? "bg-amber-500" :
                        "bg-rose-500"
                      }`}></div>
                      {t.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {t.status !== "Selesai" ? (
                      <Link href={`/dashboard/penilaian/form/${t.id}`}>
                        <button className="flex items-center gap-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-brand-600 transition-all duration-300 shadow-sm hover:shadow-brand-500/20">
                          {t.status === "Proses" ? "Lanjutkan" : "Mulai"}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">Terkirim ✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
