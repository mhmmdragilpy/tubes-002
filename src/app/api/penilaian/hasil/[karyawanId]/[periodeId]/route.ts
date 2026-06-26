import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

export async function GET(req: NextRequest, { params }: { params: Promise<{ karyawanId: string, periodeId: string }> }) {
  try {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    const { karyawanId: kIdStr, periodeId: pIdStr } = await params;
    const karyawanId = parseInt(kIdStr);
    const periodeId = parseInt(pIdStr);

    const forms = await prisma.formPenilaian.findMany({
      where: {
        id_karyawan: karyawanId,
        id_periode: periodeId,
        status: "SUBMITTED",
      },
      include: { jawabans: { include: { indikator: true } } },
    });

    const bobotMap: Record<string, number> = {
      ATASAN: 0.4,
      BAWAHAN: 0.3,
      PEER: 0.2,
      SELF: 0.1,
    };

    const nilaiPerTipe: Record<string, number[]> = {};

    for (const form of forms) {
      const tipe = form.tipe_penilaian;
      const avgSkor = form.jawabans.reduce((sum, j) => sum + j.skor, 0) / (form.jawabans.length || 1);
      if (!nilaiPerTipe[tipe]) nilaiPerTipe[tipe] = [];
      nilaiPerTipe[tipe].push(avgSkor);
    }

    let nilaiAkhir = 0;
    for (const [tipe, skorList] of Object.entries(nilaiPerTipe)) {
      const avgTipe = skorList.reduce((a, b) => a + b, 0) / skorList.length;
      const bobot = bobotMap[tipe] || 0;
      nilaiAkhir += avgTipe * bobot;
    }

    let predikat = "Kurang";
    if (nilaiAkhir >= 4.5) predikat = "Sangat Baik";
    else if (nilaiAkhir >= 3.5) predikat = "Baik";
    else if (nilaiAkhir >= 2.5) predikat = "Cukup";

    return NextResponse.json({
      success: true,
      data: {
        karyawanId,
        periodeId,
        nilaiPerTipe: Object.fromEntries(
          Object.entries(nilaiPerTipe).map(([k, v]) => [k, v.reduce((a, b) => a + b, 0) / v.length])
        ),
        nilaiAkhir: parseFloat(nilaiAkhir.toFixed(2)),
        predikat,
      },
    });
  } catch (error) {
    console.error("GetHasilPenilaian error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
