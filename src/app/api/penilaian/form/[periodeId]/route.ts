import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

export async function GET(req: NextRequest, { params }: { params: Promise<{ periodeId: string }> }) {
  try {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    const { periodeId: pIdStr } = await params;
    const periodeId = parseInt(pIdStr);
    const userId = auth.user!.id_user;

    const forms = await prisma.formPenilaian.findMany({
      where: { id_periode: periodeId, id_penilai: userId },
      include: {
        karyawan: {
          include: { user: { select: { nama: true } } },
        },
      },
      orderBy: { id_form: "asc" },
    });

    return NextResponse.json({ success: true, data: forms });
  } catch (error) {
    console.error("GetMyForms error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
