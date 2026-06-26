import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

export async function GET(req: NextRequest) {
  try {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    // 1. Get active periode or most recent
    let periodeAktif = await prisma.periodePenilaian.findFirst({
      where: { status: "ACTIVE" }
    });

    if (!periodeAktif) {
      // Fallback to most recently created period if none is active
      periodeAktif = await prisma.periodePenilaian.findFirst({
        orderBy: { created_at: "desc" }
      });
    }

    if (!periodeAktif) {
      return NextResponse.json({ success: true, data: [] });
    }

    // 2. Ambil semua Karyawan beserta Form yang SUBMITTED di periode aktif
    const karyawans = await prisma.karyawan.findMany({
      include: {
        user: true,
        formDinilai: {
          where: { 
            id_periode: periodeAktif.id_periode,
            status: "SUBMITTED"
          },
          include: {
            jawabans: true
          }
        }
      }
    });

    // 3. Kalkulasi 360-degree Score
    const hasilLaporan = karyawans.map(k => {
      const forms = k.formDinilai;

      // Pisahkan form berdasarkan tipe
      const selfForms = forms.filter(f => f.tipe_penilaian === "SELF");
      const atasanForms = forms.filter(f => f.tipe_penilaian === "ATASAN");
      const peerForms = forms.filter(f => f.tipe_penilaian === "PEER");

      // Fungsi bantu hitung rata-rata skor dari array form
      const getAvgScore = (formArray: any[]) => {
        if (formArray.length === 0) return 0;
        let totalScore = 0;
        let totalQuestions = 0;
        formArray.forEach(f => {
          f.jawabans.forEach((j: any) => {
            totalScore += j.skor;
            totalQuestions++;
          });
        });
        return totalQuestions === 0 ? 0 : totalScore / totalQuestions;
      };

      const scoreSelf = getAvgScore(selfForms);
      const scoreAtasan = getAvgScore(atasanForms);
      const scorePeer = getAvgScore(peerForms);

      // Hitung bobot dinamis jika ada yang belum dinilai
      let weightSelf = 0.1;
      let weightAtasan = 0.6;
      let weightPeer = 0.3;

      let totalWeight = 0;
      if (scoreSelf > 0) totalWeight += weightSelf;
      if (scoreAtasan > 0) totalWeight += weightAtasan;
      if (scorePeer > 0) totalWeight += weightPeer;

      let finalScore = 0;
      if (totalWeight > 0) {
        // Normalisasi bobot
        const nWeightSelf = scoreSelf > 0 ? (weightSelf / totalWeight) : 0;
        const nWeightAtasan = scoreAtasan > 0 ? (weightAtasan / totalWeight) : 0;
        const nWeightPeer = scorePeer > 0 ? (weightPeer / totalWeight) : 0;

        finalScore = (scoreSelf * nWeightSelf) + (scoreAtasan * nWeightAtasan) + (scorePeer * nWeightPeer);
      }

      // Predikat (Contoh rule: > 4.5 Sangat Baik, > 3.5 Baik, > 2.5 Cukup, else Kurang)
      let predikat = "Kurang";
      if (finalScore >= 4.5) predikat = "Sangat Baik";
      else if (finalScore >= 3.5) predikat = "Baik";
      else if (finalScore >= 2.5) predikat = "Cukup";
      else if (finalScore === 0) predikat = "Belum Dinilai";

      return {
        id_karyawan: k.id_karyawan,
        nip: k.nip,
        nama: k.user.nama,
        departemen: k.departemen,
        jabatan: k.jabatan,
        scoreSelf: parseFloat(scoreSelf.toFixed(2)),
        scoreAtasan: parseFloat(scoreAtasan.toFixed(2)),
        scorePeer: parseFloat(scorePeer.toFixed(2)),
        finalScore: parseFloat(finalScore.toFixed(2)),
        predikat
      };
    });

    // Urutkan berdasarkan finalScore tertinggi
    hasilLaporan.sort((a, b) => b.finalScore - a.finalScore);

    return NextResponse.json({ success: true, data: hasilLaporan, periode: periodeAktif.nama_periode });
  } catch (error) {
    console.error("Laporan API error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
