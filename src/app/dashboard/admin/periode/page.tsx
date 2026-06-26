"use client";

import { useState, useEffect } from "react";
import { Plus, CheckCircle, Clock, Loader2, X, Trash2 } from "lucide-react";
import axios from "axios";

export default function KelolaPeriode() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nama_periode: "", tgl_mulai: "", tgl_selesai: "" });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/periode");
      if (res.data.success) setData(res.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id: number) => {
    try {
      await axios.put(`/api/periode/${id}/activate`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchData();
    } catch (error) {
      alert("Gagal mengaktifkan periode");
    }
  };

  const handleClose = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menutup periode ini? Karyawan tidak akan bisa mengisi form lagi.")) {
      try {
        await axios.put(`/api/periode/${id}/close`, {}, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        fetchData();
      } catch (error) {
        alert("Gagal menutup periode");
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Hapus periode ini secara permanen?")) {
      try {
        await axios.delete(`/api/periode/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        fetchData();
      } catch (error) {
        alert("Gagal menghapus periode");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/periode", formData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setShowModal(false);
      setFormData({ nama_periode: "", tgl_mulai: "", tgl_selesai: "" });
      fetchData();
    } catch (error) {
      alert("Gagal membuat periode. Pastikan Anda memiliki akses.");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Kelola Periode Penilaian</h1>
          <p className="text-slate-500 mt-1 font-medium">Buka dan tutup periode evaluasi AKHLAK 360.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-500/30">
          <Plus className="w-5 h-5" />
          Buat Periode Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          </div>
        ) : (
          data.map((p) => (
            <div key={p.id_periode} className="card p-6 flex flex-col relative overflow-hidden group">
              {p.status === "ACTIVE" && <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>}
              {p.status === "CLOSED" && <div className="absolute top-0 left-0 w-full h-1 bg-slate-300"></div>}
              {p.status === "DRAFT" && <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>}
              
              <div className="flex justify-between items-start mb-4">
                <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                  p.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                  p.status === "CLOSED" ? "bg-slate-100 text-slate-500 border border-slate-200" :
                  "bg-amber-50 text-amber-600 border border-amber-200"
                }`}>
                  {p.status}
                </div>
                {p.status === "DRAFT" && (
                  <button onClick={() => handleDelete(p.id_periode)} className="text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <h3 className="text-xl font-black text-slate-800 mb-1">{p.nama_periode}</h3>
              <p className="text-sm font-medium text-slate-500 mb-6">
                {new Date(p.tgl_mulai).toLocaleDateString('id-ID')} - {new Date(p.tgl_selesai).toLocaleDateString('id-ID')}
              </p>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                {p.status === "DRAFT" && (
                  <button 
                    onClick={() => handleActivate(p.id_periode)}
                    className="flex-1 bg-brand-50 hover:bg-brand-100 text-brand-700 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    Aktifkan
                  </button>
                )}
                {p.status === "ACTIVE" && (
                  <button 
                    onClick={() => handleClose(p.id_periode)}
                    className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    Tutup Periode
                  </button>
                )}
                <button className="px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-bold transition-colors">
                  Detail
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form Tambah Periode */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg">Buat Periode Penilaian</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Periode</label>
                <input required type="text" placeholder="Contoh: Semester 1 2026" value={formData.nama_periode} onChange={e => setFormData({...formData, nama_periode: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Mulai</label>
                  <input required type="date" value={formData.tgl_mulai} onChange={e => setFormData({...formData, tgl_mulai: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Selesai</label>
                  <input required type="date" value={formData.tgl_selesai} onChange={e => setFormData({...formData, tgl_selesai: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-md shadow-brand-500/20">
                  Simpan Periode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
