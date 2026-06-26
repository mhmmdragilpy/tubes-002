"use client";

import { useState, useEffect } from "react";
import { Download, FileText, Loader2, Trophy, Award } from "lucide-react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ManajemenLaporanPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodeName, setPeriodeName] = useState("");

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/laporan", {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        if (res.data.success) {
          setData(res.data.data);
          setPeriodeName(res.data.periode);
        }
      } catch (error) {
        console.error("Failed to fetch laporan");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportCSV = () => {
    window.open("/api/laporan/export", "_blank");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF("landscape");
    
    doc.setFontSize(20);
    doc.text("Laporan Strategis Evaluasi 360° AKHLAK", 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Periode: ${periodeName || "N/A"}`, 14, 30);
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')} (Manajemen)`, 14, 36);

    const tableColumn = ["Peringkat", "Karyawan", "Departemen", "Score Self", "Score Atasan", "Score Peer", "Final Score", "Predikat"];
    const tableRows = data.map((k, i) => [
      i + 1,
      k.nama,
      k.departemen,
      k.scoreSelf,
      k.scoreAtasan,
      k.scorePeer,
      k.finalScore,
      k.predikat
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 253, 250] },
    });

    doc.save(`Laporan_Strategis_AKHLAK_${periodeName ? periodeName.replace(/\s+/g, '_') : 'Export'}.pdf`);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Laporan Strategis</h1>
          <p className="text-slate-500 mt-1 font-medium">Tinjauan peringkat performa karyawan secara keseluruhan.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/30">
            <Download className="w-5 h-5" />
            Unduh Excel (CSV)
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-500/30">
            <FileText className="w-5 h-5" />
            Unduh PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
        </div>
      ) : data.length === 0 ? (
        <div className="card p-10 flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
           </div>
           <h2 className="text-xl font-bold text-slate-700">Belum Ada Data Laporan</h2>
           <p className="text-slate-500 mt-2 max-w-md">Data evaluasi periode aktif belum tersedia atau belum selesai.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top 3 Performers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.slice(0, 3).map((k, i) => (
              <div key={k.id_karyawan} className="card p-6 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150 ${i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : 'bg-orange-600'}`}></div>
                <div className="flex items-center justify-between mb-4 relative">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-slate-100 text-slate-600' : 'bg-orange-100 text-orange-600'}`}>
                    <Trophy className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200">#{i+1}</span>
                </div>
                <div className="relative">
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{k.nama}</h3>
                  <p className="text-sm font-medium text-slate-500">{k.jabatan}</p>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Final Score</p>
                      <p className="text-3xl font-black text-brand-600">{k.finalScore}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                      {k.predikat}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Full Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Peringkat</th>
                    <th className="px-6 py-4">Karyawan</th>
                    <th className="px-6 py-4 text-center">Final Score</th>
                    <th className="px-6 py-4 text-center">Predikat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((k, index) => (
                    <tr key={k.id_karyawan} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">#{index + 1}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{k.nama}</p>
                        <p className="text-xs text-slate-400">{k.nip} • {k.departemen}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-black text-brand-600 bg-brand-50 px-2 py-1 rounded-md">{k.finalScore}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${
                          k.predikat === "Sangat Baik" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                          k.predikat === "Baik" ? "bg-blue-50 text-blue-600 border-blue-200" :
                          k.predikat === "Cukup" ? "bg-amber-50 text-amber-600 border-amber-200" :
                          "bg-rose-50 text-rose-600 border-rose-200"
                        }`}>
                          {k.predikat}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
