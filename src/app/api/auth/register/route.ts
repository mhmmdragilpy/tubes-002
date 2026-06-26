import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { authenticate, requireRole } from "@/lib/authMiddleware";

export async function POST(req: NextRequest) {
  try {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    const roleError = requireRole(auth.user!, ["ADMIN_HR"]);
    if (roleError) return roleError;

    const { nama, email, password, role } = await req.json();

    if (!nama || !email || !password || !role) {
      return NextResponse.json({ success: false, message: "Semua field wajib diisi." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, message: "Email sudah terdaftar." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        role,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "User berhasil didaftarkan.",
      data: { id_user: user.id_user, nama: user.nama, email: user.email, role: user.role },
    }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
