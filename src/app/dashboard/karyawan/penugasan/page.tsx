"use client";

import { useEffect, useState } from "react";
import { ClipboardList, ChevronRight, Loader2, Info } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function PenugasanKaryawanPage() {
  const [loading, setLoading] = useState(true);
  const [tugasPenilaian, setTugasPenilaian] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/dashboard/karyawan", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setTugasPenilaian(res.data.data.tugasPenilaian);
        }
      } catch (error) {
        console.error("Gagal memuat tugas penilaian:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Penugasan Evaluasi</h1>
          <p className="text-slate-500 mt-1 font-medium">Daftar rekan sejawat (peer), bawahan, atau atasan yang wajib Anda nilai.</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 flex gap-4">
        <div className="bg-brand-100 p-2 rounded-lg h-fit">
          <Info className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h3 className="font-bold text-brand-900">Petunjuk Evaluasi 360 Derajat</h3>
          <p className="text-sm text-brand-700 mt-1">
            Silakan lengkapi seluruh form penilaian di bawah ini dengan objektif dan jujur. Penilaian Anda akan berkontribusi langsung pada pemetaan 9-Box Grid dan profil AKHLAK dari rekan kerja Anda.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
        </div>
      ) : (
        <div className="card overflow-hidden shadow-md">
          <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Daftar Tugas Penilaian Anda</h2>
                <p className="text-sm font-medium text-slate-500 mt-0.5">Terdapat {tugasPenilaian.filter(t => t.status !== "Selesai").length} evaluasi yang belum Anda selesaikan.</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-y border-slate-200/60">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Target Evaluasi</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Sebagai</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tenggat Waktu</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {tugasPenilaian.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <ClipboardList className="w-12 h-12 text-slate-200 mb-3" />
                        <p className="font-semibold">Belum ada tugas penilaian untuk Anda.</p>
                        <p className="text-sm">Silakan tunggu penugasan dari atasan atau Admin HR.</p>
                      </div>
                    </td>
                  </tr>
                )}
                {tugasPenilaian.map((t: any) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{t.target}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border ${
                        t.tipe === "SELF" ? "bg-purple-50 text-purple-600 border-purple-200" :
                        t.tipe === "PEER" ? "bg-sky-50 text-sky-600 border-sky-200" :
                        t.tipe === "ATASAN" ? "bg-indigo-50 text-indigo-600 border-indigo-200" :
                        "bg-emerald-50 text-emerald-600 border-emerald-200"
                      }`}>
                        {t.tipe}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                      {t.deadline}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
                        t.status === "Selesai" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                        t.status === "Proses" ? "bg-amber-50 text-amber-600 border-amber-200" :
                        "bg-rose-50 text-rose-600 border-rose-200"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                          t.status === "Selesai" ? "bg-emerald-500" :
                          t.status === "Proses" ? "bg-amber-500" :
                          "bg-rose-500"
                        }`}></div>
                        {t.status === "Proses" ? "Belum Dikerjakan" : t.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {t.status !== "Selesai" ? (
                        <Link href={`/dashboard/penilaian/form/${t.id}`}>
                          <button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-brand-500/30 transition-all duration-300 hover:-translate-y-0.5">
                            Mulai Nilai
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-100 border border-slate-200 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed">
                          Sudah Terkirim ✓
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
