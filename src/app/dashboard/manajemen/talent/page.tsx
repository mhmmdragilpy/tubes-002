"use client";

import { useState, useEffect } from "react";
import { Users, Loader2, Info, ArrowUpRight, ChevronRight, UserCircle2 } from "lucide-react";
import axios from "axios";

// 9-Box Grid Layout Array (dari kiri-atas ke kanan-bawah)
const boxLayout = [
  { id: 7, title: "Potential Gem", desc: "Potensi Tinggi, Performa Rendah", color: "bg-gradient-to-br from-amber-50 to-amber-100", border: "border-amber-300", text: "text-amber-800", badge: "bg-amber-200/60" },
  { id: 8, title: "High Potential", desc: "Potensi Tinggi, Performa Menengah", color: "bg-gradient-to-br from-emerald-50 to-emerald-100", border: "border-emerald-300", text: "text-emerald-800", badge: "bg-emerald-200/60" },
  { id: 9, title: "Star / Future Leader", desc: "Potensi & Performa Sangat Tinggi", color: "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30 shadow-lg text-white", border: "border-emerald-600", text: "text-white", badge: "bg-white/20 text-white" },
  { id: 4, title: "Inconsistent Player", desc: "Potensi Menengah, Performa Rendah", color: "bg-gradient-to-br from-rose-50 to-rose-100", border: "border-rose-300", text: "text-rose-800", badge: "bg-rose-200/60" },
  { id: 5, title: "Core Employee", desc: "Tulang Punggung Operasional", color: "bg-gradient-to-br from-blue-50 to-blue-100", border: "border-blue-300", text: "text-blue-800", badge: "bg-blue-200/60" },
  { id: 6, title: "High Performer", desc: "Performa Tinggi, Potensi Menengah", color: "bg-gradient-to-br from-emerald-50 to-emerald-100", border: "border-emerald-300", text: "text-emerald-800", badge: "bg-emerald-200/60" },
  { id: 1, title: "Underperformer", desc: "Butuh Evaluasi Mendalam", color: "bg-gradient-to-br from-rose-100 to-rose-200", border: "border-rose-400", text: "text-rose-900", badge: "bg-rose-300/60" },
  { id: 2, title: "Effective", desc: "Potensi Rendah, Performa Menengah", color: "bg-gradient-to-br from-amber-50 to-amber-100", border: "border-amber-300", text: "text-amber-800", badge: "bg-amber-200/60" },
  { id: 3, title: "Solid Professional", desc: "Performa Tinggi, Potensi Rendah", color: "bg-gradient-to-br from-blue-50 to-blue-100", border: "border-blue-300", text: "text-blue-800", badge: "bg-blue-200/60" },
];

export default function TalentMatrixPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const res = await axios.get("/api/talent", {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch talent data");
      } finally {
        setLoading(false);
      }
    };
    fetchTalents();
  }, []);

  const getTalentsInBox = (boxId: number) => {
    return data.filter(k => k.boxId === boxId);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Matriks Talent (9-Box Grid)</h1>
          <p className="text-slate-500 mt-1 font-medium">Pemetaan suksesi karyawan berbasis Potensi vs Kinerja AKHLAK.</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-brand-50 to-teal-50 border border-brand-100 rounded-2xl p-5 flex gap-5 shadow-sm">
        <div className="bg-white shadow-sm p-3 rounded-xl h-fit">
          <Info className="w-6 h-6 text-brand-600" />
        </div>
        <div>
          <h3 className="font-extrabold text-brand-900 text-lg">Metodologi Pemetaan AKHLAK 360</h3>
          <p className="text-sm text-brand-700/80 mt-1.5 leading-relaxed">
            <strong className="text-brand-800">Sumbu Y (Potensi):</strong> Menggunakan rata-rata dimensi Kompeten & Adaptif sebagai indikator Agility.<br/>
            <strong className="text-brand-800">Sumbu X (Kinerja):</strong> Menggunakan rata-rata dimensi operasional lainnya (Amanah, Harmonis, Loyal, Kolaboratif).
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
        </div>
      ) : data.length === 0 ? (
        <div className="card p-10 flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Users className="w-8 h-8" />
           </div>
           <h2 className="text-xl font-bold text-slate-700">Belum Ada Data Pemetaan</h2>
           <p className="text-slate-500 mt-2 max-w-md">Data evaluasi belum memadai untuk merumuskan matriks 9-box.</p>
        </div>
      ) : (
        <div className="card p-6 md:p-10 relative overflow-hidden bg-white/50">
          
          <div className="relative pt-8 pl-12 pr-4 pb-8 overflow-x-auto">
            {/* Y-Axis Label */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 origin-center flex items-center gap-3 font-black text-slate-300 tracking-[0.2em] text-sm uppercase">
              <ArrowUpRight className="w-5 h-5 rotate-45" /> Potensi (Agility)
            </div>
            
            {/* X-Axis Label */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-3 font-black text-slate-300 tracking-[0.2em] text-sm uppercase">
              Kinerja (Core Values) <ArrowUpRight className="w-5 h-5 rotate-45" />
            </div>

            <div className="min-w-[900px] max-w-6xl mx-auto">
              {/* The 3x3 Grid */}
              <div className="grid grid-cols-3 gap-5 pb-8 pl-6 relative">
                {boxLayout.map((box) => {
                  const talents = getTalentsInBox(box.id);
                  return (
                    <div key={box.id} className={`group relative rounded-2xl border-2 p-5 h-64 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${box.color} ${box.border}`}>
                      
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className={`font-black text-[15px] uppercase tracking-wider leading-tight ${box.text}`}>{box.title}</h3>
                          <p className={`text-[11px] font-semibold mt-1 opacity-80 ${box.text}`}>{box.desc}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-sm font-bold shadow-sm backdrop-blur-md ${box.badge}`}>
                          {talents.length}
                        </span>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto pr-2 space-y-2.5 custom-scrollbar">
                        {talents.map(t => (
                          <div key={t.id_karyawan} className={`px-3 py-2.5 rounded-xl shadow-sm flex items-center gap-3 transition-colors ${box.id === 9 ? 'bg-white/20 text-white border border-white/30 hover:bg-white/30' : 'bg-white border border-white/50 hover:bg-slate-50 ' + box.text}`}>
                            <div className={`p-1.5 rounded-full ${box.id === 9 ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                              <UserCircle2 className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-xs font-bold truncate">{t.nama}</span>
                              <span className="text-[10px] opacity-70 truncate font-semibold">{t.jabatan}</span>
                            </div>
                          </div>
                        ))}
                        {talents.length === 0 && (
                          <div className={`h-full w-full flex items-center justify-center flex-col opacity-40 ${box.text}`}>
                            <Users className="w-8 h-8 mb-2 opacity-50" />
                            <span className="text-xs font-bold italic">Tidak ada kandidat</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* X-Axis Labels Bottom */}
              <div className="grid grid-cols-3 gap-5 pl-6 text-center text-xs font-black text-slate-300 uppercase tracking-widest mt-2">
                <div>Low Performance</div>
                <div>Medium Performance</div>
                <div>High Performance</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
      `}} />
    </div>
  );
}
