import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "akhlak360-super-secret-key-2026";
const JWT_EXPIRES_IN = "24h";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email dan password wajib diisi." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ success: false, message: "Email atau password salah." }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Email atau password salah." }, { status: 401 });
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json({ success: false, message: "Akun Anda tidak aktif. Hubungi Admin HR." }, { status: 403 });
    }

    const token = jwt.sign(
      { id_user: user.id_user, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return NextResponse.json({
      success: true,
      message: "Login berhasil.",
      data: {
        token,
        user: {
          id_user: user.id_user,
          nama: user.nama,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
