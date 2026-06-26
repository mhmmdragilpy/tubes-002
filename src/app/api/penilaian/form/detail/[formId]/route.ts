import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

export async function GET(req: NextRequest, { params }: { params: Promise<{ formId: string }> }) {
  try {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    const { formId: fIdStr } = await params;
    const formId = parseInt(fIdStr);

    // --- Inject Dummy Data Handler ---
    if ([991, 992, 993].includes(formId)) {
      const semuaIndikator = await prisma.indikatorAkhlak.findMany({ orderBy: { id_indikator: "asc" } });
      let tipe = "SELF";
      let targetName = "Anda (Penilaian Diri)";
      if (formId === 992) { tipe = "PEER"; targetName = "Budi (Rekan Sejawat)"; }
      if (formId === 993) { tipe = "ATASAN"; targetName = "Rizky (Bawahan)"; }
      
      return NextResponse.json({
        success: true,
        data: {
          id_form: formId,
          tipe_penilaian: tipe,
          status: "DRAFT",
          karyawan: { user: { nama: targetName } },
          penilai: { nama: "Atasan Dummy" },
          jawabans: [],
          semuaIndikator
        }
      });
    }
    // ---------------------------------

    const form = await prisma.formPenilaian.findUnique({
      where: { id_form: formId },
      include: {
        karyawan: { include: { user: { select: { nama: true } } } },
        penilai: { select: { nama: true } },
        jawabans: {
          include: { indikator: true },
          orderBy: { id_indikator: "asc" },
        },
      },
    });

    if (!form) {
      return NextResponse.json({ success: false, message: "Form tidak ditemukan." }, { status: 404 });
    }

    // Check if user is the penilai or admin etc. (Skipping fine-grained check for now, per original backend logic)
    const semuaIndikator = await prisma.indikatorAkhlak.findMany({ orderBy: { id_indikator: "asc" } });

    return NextResponse.json({ success: true, data: { ...form, semuaIndikator } });
  } catch (error) {
    console.error("GetFormDetail error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
