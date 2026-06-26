import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    let periodeAktif = await prisma.periodePenilaian.findFirst({
      where: { status: "ACTIVE" }
    });

    if (!periodeAktif) {
      periodeAktif = await prisma.periodePenilaian.findFirst({
        orderBy: { created_at: "desc" }
      });
    }

    if (!periodeAktif) {
      return new NextResponse("Belum ada periode berjalan", { status: 400 });
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
            jawabans: true
          }
        }
      }
    });

    const csvRows = [];
    csvRows.push(["NIP", "Nama", "Departemen", "Jabatan", "Score Self (10%)", "Score Atasan (60%)", "Score Peer (30%)", "Final Score", "Predikat"].join(","));

    karyawans.forEach(k => {
      const forms = k.formDinilai;
      const selfForms = forms.filter((f: any) => f.tipe_penilaian === "SELF");
      const atasanForms = forms.filter((f: any) => f.tipe_penilaian === "ATASAN");
      const peerForms = forms.filter((f: any) => f.tipe_penilaian === "PEER");

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

      let weightSelf = 0.1;
      let weightAtasan = 0.6;
      let weightPeer = 0.3;

      let totalWeight = 0;
      if (scoreSelf > 0) totalWeight += weightSelf;
      if (scoreAtasan > 0) totalWeight += weightAtasan;
      if (scorePeer > 0) totalWeight += weightPeer;

      let finalScore = 0;
      if (totalWeight > 0) {
        const nWeightSelf = scoreSelf > 0 ? (weightSelf / totalWeight) : 0;
        const nWeightAtasan = scoreAtasan > 0 ? (weightAtasan / totalWeight) : 0;
        const nWeightPeer = scorePeer > 0 ? (weightPeer / totalWeight) : 0;
        finalScore = (scoreSelf * nWeightSelf) + (scoreAtasan * nWeightAtasan) + (scorePeer * nWeightPeer);
      }

      let predikat = "Kurang";
      if (finalScore >= 4.5) predikat = "Sangat Baik";
      else if (finalScore >= 3.5) predikat = "Baik";
      else if (finalScore >= 2.5) predikat = "Cukup";
      else if (finalScore === 0) predikat = "Belum Dinilai";

      csvRows.push([
        k.nip,
        `"${k.user.nama}"`,
        k.departemen,
        k.jabatan,
        scoreSelf.toFixed(2),
        scoreAtasan.toFixed(2),
        scorePeer.toFixed(2),
        finalScore.toFixed(2),
        predikat
      ].join(","));
    });

    const csvContent = csvRows.join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=Laporan_Akhir_${periodeAktif.nama_periode.replace(/\s+/g, '_')}.csv`
      }
    });

  } catch (error) {
    console.error("Laporan Export error:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}
