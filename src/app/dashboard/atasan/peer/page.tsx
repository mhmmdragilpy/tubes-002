"use client";

import { useState, useEffect } from "react";
import { UserCheck, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import axios from "axios";

export default function ApprovePeerPage() {
  const [peerList, setPeerList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");

  const fetchPeers = async () => {
    try {
      const res = await axios.get("/api/peer", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.data.success) setPeerList(res.data.data.filter((p: any) => p.status === "PENDING"));
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
      fetchPeers(); // refresh to remove from pending list
    } catch (error) {
      alert("Gagal mengupdate status peer");
    }
  };

  const handleApprove = (id: number) => handleUpdatePeer(id, "APPROVED");
  const handleReject = (id: number) => handleUpdatePeer(id, "REJECTED");

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Persetujuan Penilai Peer</h1>
        <p className="text-slate-500 mt-1 font-medium">Tinjau dan setujui rekan kerja yang ditunjuk untuk menilai bawahan Anda.</p>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
        </div>
      ) : peerList.length === 0 ? (
        <div className="card p-10 flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <UserCheck className="w-8 h-8" />
           </div>
           <h2 className="text-xl font-bold text-slate-700">Daftar Pengajuan Peer Kosong</h2>
           <p className="text-slate-500 mt-2 max-w-md">Saat ini belum ada pengajuan penilai rekan kerja (peer) dari bawahan Anda yang perlu disetujui.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="divide-y divide-slate-100">
            {peerList.map((p) => (
              <div key={p.id} className="px-6 py-4 hover:bg-brand-50/30 transition-colors duration-150">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{p.peer}</p>
                    <p className="text-xs text-slate-400">Menilai: {p.karyawan} ({p.hubungan})</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleApprove(p.id)} className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors">
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleReject(p.id)} className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
