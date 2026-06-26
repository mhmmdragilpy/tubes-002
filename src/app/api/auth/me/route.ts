import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

export async function GET(req: NextRequest) {
  try {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    const user = await prisma.user.findUnique({
      where: { id_user: auth.user!.id_user },
      select: {
        id_user: true,
        nama: true,
        email: true,
        role: true,
        status: true,
        karyawan: { select: { nip: true, jabatan: true, departemen: true } },
        atasan: { select: { nip: true, jabatan: true } },
        adminHR: { select: { nip: true, jabatan: true } },
        manajemen: { select: { jabatan: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("GetProfile error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
