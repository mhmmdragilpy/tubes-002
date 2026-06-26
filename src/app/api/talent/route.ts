import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

export async function GET(req: NextRequest) {
  try {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

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

    const karyawans = await prisma.karyawan.findMany({
      include: {
        user: true,
        formDinilai: {
          where: { 
            id_periode: periodeAktif.id_periode,
            status: "SUBMITTED"
          },
          include: {
            jawabans: {
              include: { indikator: true }
            }
          }
        }
      }
    });

    const results = karyawans.map(k => {
      let totalPotensiScore = 0;
      let totalPotensiCount = 0;
      let totalKinerjaScore = 0;
      let totalKinerjaCount = 0;

      // Kumpulkan semua jawaban dari semua form (Self, Atasan, Peer)
      // Disini kita asumsikan bobot rata (bisa dipercanggih dengan bobot Atasan 60%, tapi untuk matriks ini kita ambil rata-rata kasar untuk kemudahan visualisasi)
      // Aturan Potensi: Dimensi KOMPETEN & ADAPTIF
      // Aturan Kinerja: Dimensi AMANAH, HARMONIS, LOYAL, KOLABORATIF
      
      k.formDinilai.forEach(form => {
        form.jawabans.forEach((j: any) => {
          const dim = j.indikator.dimensi;
          if (dim === "KOMPETEN" || dim === "ADAPTIF") {
            totalPotensiScore += j.skor;
            totalPotensiCount++;
          } else {
            totalKinerjaScore += j.skor;
            totalKinerjaCount++;
          }
        });
      });

      const avgPotensi = totalPotensiCount > 0 ? totalPotensiScore / totalPotensiCount : 0;
      const avgKinerja = totalKinerjaCount > 0 ? totalKinerjaScore / totalKinerjaCount : 0;

      // Tentukan Box (1-9)
      // Low: < 3.5, Med: 3.5 - 4.2, High: > 4.2  (Diturunkan sedikit agar data tersebar, karena skor Acak 3-5)
      const getLevel = (score: number) => {
        if (score === 0) return "NONE";
        if (score < 3.8) return "LOW"; // Threshold disesuaikan agar data mock tersebar
        if (score <= 4.4) return "MED";
        return "HIGH";
      };

      const potLevel = getLevel(avgPotensi);
      const kinLevel = getLevel(avgKinerja);

      let boxId = 0;
      let boxName = "Unrated";
      let category = "unrated";

      if (potLevel !== "NONE" && kinLevel !== "NONE") {
        if (potLevel === "HIGH" && kinLevel === "HIGH") { boxId = 9; boxName = "Star / Future Leader"; category = "star"; }
        else if (potLevel === "HIGH" && kinLevel === "MED") { boxId = 8; boxName = "High Potential"; category = "high-pot"; }
        else if (potLevel === "HIGH" && kinLevel === "LOW") { boxId = 7; boxName = "Potential Gem"; category = "enigma"; }
        else if (potLevel === "MED" && kinLevel === "HIGH") { boxId = 6; boxName = "High Performer"; category = "high-perf"; }
        else if (potLevel === "MED" && kinLevel === "MED") { boxId = 5; boxName = "Core Employee"; category = "core"; }
        else if (potLevel === "MED" && kinLevel === "LOW") { boxId = 4; boxName = "Inconsistent Player"; category = "inconsistent"; }
        else if (potLevel === "LOW" && kinLevel === "HIGH") { boxId = 3; boxName = "Solid Professional"; category = "solid"; }
        else if (potLevel === "LOW" && kinLevel === "MED") { boxId = 2; boxName = "Effective"; category = "effective"; }
        else if (potLevel === "LOW" && kinLevel === "LOW") { boxId = 1; boxName = "Underperformer"; category = "risk"; }
      }

      return {
        id_karyawan: k.id_karyawan,
        nama: k.user.nama,
        jabatan: k.jabatan,
        potensiScore: parseFloat(avgPotensi.toFixed(2)),
        kinerjaScore: parseFloat(avgKinerja.toFixed(2)),
        boxId,
        boxName,
        category
      };
    });

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Talent API error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
