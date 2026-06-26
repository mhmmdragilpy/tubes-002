"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Send, Star, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";
import axios from "axios";

// Dimensi statis untuk deskripsi dan urutan, walau indikator ditarik dari API
const dimensiDeskripsi: Record<string, string> = {
  "Amanah": "Memegang teguh kepercayaan yang diberikan.",
  "Kompeten": "Terus belajar dan mengembangkan kapabilitas.",
  "Harmonis": "Saling peduli dan menghargai perbedaan.",
  "Loyal": "Berdedikasi dan mengutamakan kepentingan bangsa dan negara.",
  "Adaptif": "Terus berinovasi dan antusias dalam menggerakkan maupun menghadapi perubahan.",
  "Kolaboratif": "Membangun kerjasama yang sinergis.",
};

const colorMap: Record<string, string> = {
  "Amanah": "from-sky-500 to-blue-600",
  "Kompeten": "from-emerald-400 to-teal-600",
  "Harmonis": "from-pink-500 to-rose-600",
  "Loyal": "from-amber-400 to-orange-500",
  "Adaptif": "from-indigo-400 to-violet-600",
  "Kolaboratif": "from-teal-400 to-cyan-600",
};

export default function PenilaianDynamicFormPage() {
  const params = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formDetail, setFormDetail] = useState<any>(null);
  const [dimensiAkhlak, setDimensiAkhlak] = useState<any[]>([]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [jawaban, setJawaban] = useState<Record<number, { skor: number; komentar: string }>>({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const formId = params.formId;
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/penilaian/form/detail/${formId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          const data = res.data.data;
          setFormDetail(data);
          
          if (data.status === "SUBMITTED") {
            setSubmitted(true);
            setLoading(false);
            return;
          }

          // Group indikator by dimensi
          const grouped: Record<string, any[]> = {};
          data.semuaIndikator.forEach((ind: any) => {
            if (!grouped[ind.dimensi]) grouped[ind.dimensi] = [];
            grouped[ind.dimensi].push({ id: ind.id_indikator, teks: ind.deskripsi });
          });

          // Urutan AKHLAK: Amanah, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif
          const order = ["Amanah", "Kompeten", "Harmonis", "Loyal", "Adaptif", "Kolaboratif"];
          const finalDimensi = order.map(dimName => {
            // Mapping from API ENUM (e.g., 'AMANAH') to Capitalized ('Amanah')
            const enumKey = dimName.toUpperCase();
            return {
              nama: dimName,
              deskripsi: dimensiDeskripsi[dimName],
              indikator: grouped[enumKey] || []
            };
          }).filter(d => d.indikator.length > 0);

          setDimensiAkhlak(finalDimensi);
        } else {
          alert("Gagal memuat form: " + res.data.message);
          router.push("/dashboard/karyawan/penugasan");
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          alert("Form tidak ditemukan");
          router.push("/dashboard/karyawan/penugasan");
        }
        console.error("Fetch form error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [params.formId, router]);

  const current = dimensiAkhlak[currentStep];
  const totalSteps = dimensiAkhlak.length;

  const handleSkor = (idIndikator: number, skor: number) => {
    setJawaban((prev) => ({
      ...prev,
      [idIndikator]: { ...prev[idIndikator], skor, komentar: prev[idIndikator]?.komentar || "" },
    }));
  };

  const handleKomentar = (idIndikator: number, komentar: string) => {
    setJawaban((prev) => ({
      ...prev,
      [idIndikator]: { ...prev[idIndikator], skor: prev[idIndikator]?.skor || 0, komentar },
    }));
  };

  const allCurrentFilled = current?.indikator.every((ind: any) => jawaban[ind.id]?.skor > 0);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      
      const payload = Object.keys(jawaban).map(idStr => ({
        id_indikator: parseInt(idStr),
        skor: jawaban[parseInt(idStr)].skor,
        komentar: jawaban[parseInt(idStr)].komentar || ""
      }));

      const res = await axios.post(`/api/penilaian/submit/${params.formId}`, { jawaban: payload }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setSubmitted(true);
      } else {
        alert("Gagal mengirim evaluasi: " + res.data.message);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Terjadi kesalahan saat mengirim evaluasi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-brand-500" />
        <p className="font-bold text-slate-500 animate-pulse">Memuat Form Evaluasi...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="glass-panel p-12 text-center max-w-lg border-t-[6px] border-t-emerald-500 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl"></div>
          
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 border-[6px] border-white flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/20 relative z-10">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Evaluasi Selesai!</h2>
          <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed max-w-sm mx-auto">
            Form Penilaian 360° ini telah berhasil disubmit dan tidak dapat diubah lagi.
          </p>
          <button 
            onClick={() => router.push("/dashboard/karyawan/penugasan")}
            className="mt-10 px-8 py-4 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-brand-600 transition-all duration-300 shadow-lg hover:shadow-brand-500/30 transform hover:-translate-y-1 w-full sm:w-auto"
          >
            Kembali ke Daftar Tugas
          </button>
        </div>
      </div>
    );
  }

  const targetName = formDetail?.karyawan?.user?.nama || "Karyawan";
  const targetInitials = targetName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header Profile Target */}
      <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 border border-slate-200/60 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-100 to-teal-50 border border-brand-200 flex items-center justify-center shadow-inner">
            <span className="text-3xl font-black text-brand-600">{targetInitials}</span>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{targetName}</h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-3">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold uppercase tracking-widest border border-slate-200">Subjek Evaluasi</span>
              <span className="px-3 py-1 bg-sky-50 text-sky-600 rounded-md text-xs font-bold uppercase tracking-widest border border-sky-200">Tipe: {formDetail?.tipe_penilaian}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Stepper */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-50/50 pointer-events-none"></div>
        <div className="relative z-10 flex items-center justify-between gap-2 mb-6">
          {dimensiAkhlak.map((d, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center group relative">
              {idx !== 0 && (
                <div className={`absolute left-0 top-5 -translate-y-1/2 -translate-x-1/2 w-full h-[2px] -z-10 transition-colors duration-500 ${idx <= currentStep ? "bg-brand-500" : "bg-slate-200"}`}></div>
              )}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-500 border-2 ${
                  idx < currentStep
                    ? "bg-brand-500 border-brand-500 text-white shadow-md"
                    : idx === currentStep
                    ? "bg-white border-brand-500 text-brand-600 shadow-lg shadow-brand-500/20 scale-110"
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {idx < currentStep ? "✓" : idx + 1}
              </div>
              <span className={`text-[11px] mt-3 font-bold tracking-wider uppercase transition-colors duration-300 ${idx === currentStep ? "text-brand-600" : "text-slate-400"}`}>
                {d.nama}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Dimension Banner */}
      <div className={`relative overflow-hidden bg-gradient-to-r ${colorMap[current.nama]} rounded-3xl p-8 sm:p-10 text-white shadow-xl transform transition-all duration-500`}>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none -translate-y-1/4 translate-x-1/4"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">Dimensi {currentStep + 1} / {totalSteps}</span>
          </div>
          <h2 className="text-4xl font-black mb-2 tracking-tight">{current.nama}</h2>
          <p className="text-white/80 font-medium text-lg max-w-xl leading-relaxed">{current.deskripsi}</p>
        </div>
      </div>

      {/* Indicators List */}
      <div className="space-y-6">
        {current.indikator.map((ind: any, idx: number) => (
          <div key={ind.id} className="card p-6 sm:p-8 hover:shadow-lg transition-all duration-300 group border-l-[6px] border-l-transparent hover:border-l-brand-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
               <span className="text-8xl font-black">{idx + 1}</span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-6 leading-relaxed relative z-10">
              {ind.teks}
            </h3>

            {/* Interactive Star Rating */}
            <div className="bg-slate-50/80 rounded-2xl p-5 mb-5 border border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest shrink-0">Beri Nilai:</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleSkor(ind.id, star)}
                    className="group/star transition-all duration-200 hover:scale-125 outline-none focus:ring-2 focus:ring-brand-500/50 rounded-full"
                  >
                    <Star
                      className={`w-10 h-10 transition-all duration-300 ${
                        star <= (jawaban[ind.id]?.skor || 0)
                          ? "text-amber-400 fill-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]"
                          : "text-slate-200 group-hover/star:text-amber-200 fill-transparent"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {jawaban[ind.id]?.skor > 0 && (
                <div className="sm:ml-auto inline-flex items-center justify-center bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg border border-amber-200 font-black text-lg shadow-sm">
                  {jawaban[ind.id].skor}.0
                </div>
              )}
            </div>

            {/* Textarea for Comments */}
            <div className="relative z-10">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                <MessageSquare className="w-3.5 h-3.5" /> Komentar Kualitatif (Opsional)
              </label>
              <textarea
                rows={3}
                placeholder="Berikan alasan atau bukti spesifik terkait nilai yang Anda berikan..."
                value={jawaban[ind.id]?.komentar || ""}
                onChange={(e) => handleKomentar(ind.id, e.target.value)}
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all shadow-sm resize-none placeholder-slate-400"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-200/80">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0 || submitting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          Sebelumnya
        </button>

        {currentStep < totalSteps - 1 ? (
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
            }}
            disabled={!allCurrentFilled || submitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-slate-900 shadow-lg hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 group"
          >
            Lanjut ke {dimensiAkhlak[currentStep + 1]?.nama}
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allCurrentFilled || submitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {submitting ? "Memproses..." : "Kirim Evaluasi Final"}
          </button>
        )}
      </div>
    </div>
  );
}
