import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id_karyawan = parseInt(idStr);
    const { nama, jabatan, departemen } = await req.json();

    const karyawan = await prisma.karyawan.update({
      where: { id_karyawan },
      data: {
        jabatan,
        departemen,
        user: {
          update: { nama }
        }
      },
      include: { user: true }
    });

    return NextResponse.json({ success: true, message: "Karyawan berhasil diupdate", data: karyawan });
  } catch (error) {
    console.error("Update Karyawan Error:", error);
    return NextResponse.json({ success: false, message: "Gagal update karyawan" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id_karyawan = parseInt(idStr);

    // Dapatkan id_user terlebih dahulu
    const karyawan = await prisma.karyawan.findUnique({
      where: { id_karyawan }
    });

    if (!karyawan) {
      return NextResponse.json({ success: false, message: "Karyawan tidak ditemukan" }, { status: 404 });
    }

    // Hapus User (akan cascade menghapus karyawan)
    await prisma.user.delete({
      where: { id_user: karyawan.id_user }
    });

    return NextResponse.json({ success: true, message: "Karyawan berhasil dihapus" });
  } catch (error) {
    console.error("Delete Karyawan Error:", error);
    return NextResponse.json({ success: false, message: "Gagal menghapus karyawan" }, { status: 500 });
  }
}
