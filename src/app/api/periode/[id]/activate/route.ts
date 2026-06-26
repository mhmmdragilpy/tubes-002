import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate, requireRole } from "@/lib/authMiddleware";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    const roleError = requireRole(auth.user!, ["ADMIN_HR"]);
    if (roleError) return roleError;

    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const periode = await prisma.periodePenilaian.update({
      where: { id_periode: id },
      data: { status: "ACTIVE" },
    });
    return NextResponse.json({ success: true, message: "Periode diaktifkan.", data: periode });
  } catch (error) {
    console.error("ActivatePeriode error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
