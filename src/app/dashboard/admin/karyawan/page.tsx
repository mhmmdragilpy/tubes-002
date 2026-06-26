"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit, Loader2, X } from "lucide-react";
import axios from "axios";

export default function DaftarKaryawan() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"ADD" | "EDIT">("ADD");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nip: "", nama: "", email: "", jabatan: "", departemen: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/karyawan");
      if (res.data.success) setData(res.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode: "ADD" | "EDIT", k?: any) => {
    setModalMode(mode);
    if (mode === "EDIT" && k) {
      setSelectedId(k.id_karyawan);
      setFormData({ nip: k.nip, nama: k.nama, email: k.email, jabatan: k.jabatan, departemen: k.departemen });
    } else {
      setFormData({ nip: "", nama: "", email: "", jabatan: "", departemen: "" });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === "ADD") {
        await axios.post("/api/karyawan", formData);
      } else {
        await axios.put(`/api/karyawan/${selectedId}`, {
          nama: formData.nama,
          jabatan: formData.jabatan,
          departemen: formData.departemen
        });
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert("Gagal menyimpan data!");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus karyawan ini? Data yang terkait juga akan terhapus.")) {
      try {
        await axios.delete(`/api/karyawan/${id}`);
        fetchData();
      } catch (error) {
        alert("Gagal menghapus data!");
      }
    }
  };

  const filteredData = data.filter((k) => 
    k.nama.toLowerCase().includes(search.toLowerCase()) || 
    k.nip.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Daftar Karyawan</h1>
          <p className="text-slate-500 mt-1 font-medium">Kelola data master karyawan dan hak akses.</p>
        </div>
        <button onClick={() => handleOpenModal("ADD")} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-500/30">
          <Plus className="w-5 h-5" />
          Tambah Karyawan
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-200/60 bg-white flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan NIP atau Nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex justify-center items-center h-64">
               <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
             </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/80">NIP</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/80">Nama & Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/80">Jabatan & Dept</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/80">Atasan</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/80 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((k) => (
                  <tr key={k.id_karyawan} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-medium text-slate-600">{k.nip}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{k.nama}</p>
                      <p className="text-xs text-slate-500">{k.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-800">{k.jabatan}</p>
                      <p className="text-xs text-slate-500">{k.departemen}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{k.atasan_nama}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal("EDIT", k)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(k.id_karyawan)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Tidak ada data karyawan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg">
                {modalMode === "ADD" ? "Tambah Karyawan Baru" : "Edit Data Karyawan"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">NIP</label>
                <input required disabled={modalMode === "EDIT"} type="text" value={formData.nip} onChange={e => setFormData({...formData, nip: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                <input required disabled={modalMode === "EDIT"} type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jabatan</label>
                  <input required type="text" value={formData.jabatan} onChange={e => setFormData({...formData, jabatan: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Departemen</label>
                  <input required type="text" value={formData.departemen} onChange={e => setFormData({...formData, departemen: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              {modalMode === "ADD" && (
                <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  Password default untuk akun ini adalah <span className="font-mono font-bold text-slate-700">password123</span>
                </p>
              )}
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-md shadow-brand-500/20">
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
