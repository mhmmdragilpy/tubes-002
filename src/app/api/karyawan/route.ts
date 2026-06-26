import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const karyawans = await prisma.karyawan.findMany({
      include: {
        user: true,
        atasan: {
          include: { user: true }
        }
      }
    });

    const formattedData = karyawans.map(k => ({
      id_karyawan: k.id_karyawan,
      id_user: k.id_user,
      nip: k.nip,
      nama: k.user.nama,
      email: k.user.email,
      departemen: k.departemen,
      jabatan: k.jabatan,
      atasan_nama: k.atasan ? k.atasan.user.nama : "-"
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error fetching karyawan:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nip, nama, email, password, departemen, jabatan, role } = await req.json();
    
    // Hash password skipped for simplicity in demo or should be added
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password || 'password123', 10);

    const newUser = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        role: role || 'KARYAWAN',
        karyawan: {
          create: {
            nip,
            departemen,
            jabatan
          }
        }
      },
      include: { karyawan: true }
    });

    return NextResponse.json({ success: true, message: "Karyawan berhasil ditambahkan", data: newUser });
  } catch (error) {
    console.error("Error adding karyawan:", error);
    return NextResponse.json({ success: false, message: "Gagal menambahkan karyawan" }, { status: 500 });
  }
}
