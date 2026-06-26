"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Users, ClipboardList, UserCheck, Loader2 } from "lucide-react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const timData = [
  { nama: "Ahmad Fauzi", jabatan: "Supervisor", skor: 4.3, predikat: "Sangat Baik" },
  { nama: "Ratna Sari", jabatan: "Staff Marketing", skor: 3.9, predikat: "Baik" },
  { nama: "Mega Putri", jabatan: "Staff HR", skor: 3.5, predikat: "Cukup" },
  { nama: "Rizky Pratama", jabatan: "Developer", skor: 4.1, predikat: "Baik" },
];

const perbandinganTim = [
  { name: "Ahmad Fauzi", Amanah: 4.5, Kompeten: 4.3, Harmonis: 4.1, Loyal: 4.4, Adaptif: 4.0, Kolaboratif: 4.5 },
  { name: "Ratna Sari", Amanah: 4.0, Kompeten: 3.8, Harmonis: 4.2, Loyal: 3.7, Adaptif: 3.9, Kolaboratif: 3.8 },
  { name: "Mega Putri", Amanah: 3.5, Kompeten: 3.3, Harmonis: 3.8, Loyal: 3.6, Adaptif: 3.4, Kolaboratif: 3.4 },
  { name: "Rizky P.", Amanah: 4.2, Kompeten: 4.0, Harmonis: 4.3, Loyal: 4.1, Adaptif: 3.9, Kolaboratif: 4.1 },
];

export default function AtasanDashboard() {
  const [peerList, setPeerList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");

  const fetchPeers = async () => {
    try {
      const res = await axios.get("/api/peer", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.data.success) setPeerList(res.data.data);
    } catch (error) {
      console.error("Failed to fetch peers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeers();
  }, []);

  const handleUpdatePeer = async (id: number, status: string) => {
    try {
      await axios.put(`/api/peer/${id}`, { status }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchPeers();
    } catch (error) {
      alert("Gagal mengupdate status peer");
    }
  };

  const handleApprove = (id: number) => handleUpdatePeer(id, "APPROVED");
  const handleReject = (id: number) => handleUpdatePeer(id, "REJECTED");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Atasan</h1>
        <p className="text-slate-500 mt-1">Selamat datang, Ahmad Fauzi — Supervisor Operasional</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-5 border-t-4 border-t-brand-500">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Bawahan</p>
            <Users className="w-5 h-5 text-brand-500" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">{timData.length}</h3>
        </div>
        <div className="card p-5 border-t-4 border-t-amber-400">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Persetujuan Peer Pending</p>
            <UserCheck className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-3xl font-bold text-amber-500 mt-1">{peerList.filter((p) => p.status === "PENDING").length}</h3>
        </div>
        <div className="card p-5 border-t-4 border-t-teal-400">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tugas Penilaian</p>
            <ClipboardList className="w-5 h-5 text-teal-500" />
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">4</h3>
          <p className="text-xs text-red-500 font-semibold mt-1">2 belum diisi</p>
        </div>
      </div>

      {/* Perbandingan Tim Chart */}
      <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-lg font-bold text-slate-800 mb-1">Perbandingan Skor AKHLAK Tim</h2>
        <p className="text-xs text-slate-400 mb-4">Rata-rata skor per dimensi dari seluruh bawahan langsung</p>
        <div className="min-h-[350px]">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={perbandinganTim} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Amanah" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Kompeten" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Harmonis" fill="#ec4899" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Loyal" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Adaptif" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Kolaboratif" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daftar Bawahan */}
        <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">Hasil Penilaian Bawahan</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {timData.map((t, idx) => (
              <div key={idx} className="flex items-center justify-between px-6 py-4 hover:bg-brand-50/30 transition-colors duration-150">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {t.nama.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.nama}</p>
                    <p className="text-xs text-slate-400">{t.jabatan}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-800">{t.skor}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    t.skor >= 4.0 ? "bg-emerald-100 text-emerald-700" :
                    t.skor >= 3.5 ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-600"
                  }`}>{t.predikat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approve/Reject Peer */}
        <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">Persetujuan Daftar Peer</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {peerList.map((p) => (
              <div key={p.id} className="px-6 py-4 hover:bg-brand-50/30 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{p.peer}</p>
                    <p className="text-xs text-slate-400">Menilai: {p.karyawan} ({p.hubungan})</p>
                  </div>
                  {p.status === "PENDING" ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleApprove(p.id)} className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors">
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleReject(p.id)} className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      p.status === "APPROVED" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-600 border-red-200"
                    }`}>{p.status === "APPROVED" ? "Disetujui" : "Ditolak"}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
