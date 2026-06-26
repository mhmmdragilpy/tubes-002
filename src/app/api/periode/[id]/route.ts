import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate, requireRole } from "@/lib/authMiddleware";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    const roleError = requireRole(auth.user!, ["ADMIN_HR"]);
    if (roleError) return roleError;

    const id = parseInt(idStr);

    const periode = await prisma.periodePenilaian.findUnique({ where: { id_periode: id } });
    if (!periode) return NextResponse.json({ success: false, message: "Tidak ditemukan" }, { status: 404 });
    if (periode.status !== "DRAFT") {
      return NextResponse.json({ success: false, message: "Hanya periode DRAFT yang bisa dihapus" }, { status: 400 });
    }

    await prisma.periodePenilaian.delete({ where: { id_periode: id } });

    return NextResponse.json({ success: true, message: "Periode dihapus." });
  } catch (error) {
    console.error("DeletePeriode error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
