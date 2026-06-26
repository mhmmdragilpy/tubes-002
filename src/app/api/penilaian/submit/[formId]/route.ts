import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

export async function POST(req: NextRequest, { params }: { params: Promise<{ formId: string }> }) {
  try {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    const { formId: fIdStr } = await params;
    const formId = parseInt(fIdStr);
    const { jawaban } = await req.json();

    if (!jawaban || !Array.isArray(jawaban) || jawaban.length === 0) {
      return NextResponse.json({ success: false, message: "Data jawaban wajib diisi." }, { status: 400 });
    }

    // --- Inject Dummy Data Handler ---
    if ([991, 992, 993].includes(formId)) {
      // Pura-puranya submit berhasil
      return NextResponse.json({ success: true, message: "Penilaian dummy berhasil disimulasikan." });
    }
    // ---------------------------------

    const form = await prisma.formPenilaian.findUnique({ where: { id_form: formId } });
    if (!form) {
      return NextResponse.json({ success: false, message: "Form tidak ditemukan." }, { status: 404 });
    }
    if (form.id_penilai !== auth.user!.id_user) {
      return NextResponse.json({ success: false, message: "Anda tidak berhak mengisi form ini." }, { status: 403 });
    }
    if (form.status === "SUBMITTED") {
      return NextResponse.json({ success: false, message: "Form sudah pernah di-submit." }, { status: 400 });
    }

    await prisma.jawabanPenilaian.deleteMany({ where: { id_form: formId } });

    await prisma.jawabanPenilaian.createMany({
      data: jawaban.map((j: { id_indikator: number; skor: number; komentar?: string }) => ({
        id_form: formId,
        id_indikator: j.id_indikator,
        skor: j.skor,
        komentar: j.komentar || null,
      })),
    });

    await prisma.formPenilaian.update({
      where: { id_form: formId },
      data: { status: "SUBMITTED", tgl_submit: new Date() },
    });

    return NextResponse.json({ success: true, message: "Penilaian berhasil disimpan." });
  } catch (error) {
    console.error("SubmitPenilaian error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
