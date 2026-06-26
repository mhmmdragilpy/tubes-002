import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate, requireRole } from "@/lib/authMiddleware";

export async function GET() {
  try {
    const periodes = await prisma.periodePenilaian.findMany({
      orderBy: { tgl_mulai: "desc" },
      include: {
        adminHR: { include: { user: { select: { nama: true } } } },
      },
    });
    return NextResponse.json({ success: true, data: periodes });
  } catch (error) {
    console.error("GetAllPeriode error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    const roleError = requireRole(auth.user!, ["ADMIN_HR"]);
    if (roleError) return roleError;

    const { nama_periode, tgl_mulai, tgl_selesai } = await req.json();

    if (!nama_periode || !tgl_mulai || !tgl_selesai) {
      return NextResponse.json({ success: false, message: "nama_periode, tgl_mulai, dan tgl_selesai wajib diisi." }, { status: 400 });
    }

    const admin = await prisma.adminHR.findUnique({ where: { id_user: auth.user!.id_user } });
    if (!admin) {
      return NextResponse.json({ success: false, message: "Hanya Admin HR yang dapat membuat periode." }, { status: 403 });
    }

    const periode = await prisma.periodePenilaian.create({
      data: {
        id_admin: admin.id_admin,
        nama_periode,
        tgl_mulai: new Date(tgl_mulai),
        tgl_selesai: new Date(tgl_selesai),
        status: "DRAFT",
      },
    });

    return NextResponse.json({ success: true, message: "Periode berhasil dibuat.", data: periode }, { status: 201 });
  } catch (error) {
    console.error("CreatePeriode error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
