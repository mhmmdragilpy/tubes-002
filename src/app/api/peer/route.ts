import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

export async function GET(req: NextRequest) {
  try {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    // Pastikan dia adalah Atasan
    if (auth.user!.role !== "ATASAN") {
      return NextResponse.json({ success: false, message: "Hanya Atasan yang dapat melihat daftar ini" }, { status: 403 });
    }

    const atasan = await prisma.atasan.findUnique({
      where: { id_user: auth.user!.id_user }
    });

    if (!atasan) {
      return NextResponse.json({ success: false, message: "Data atasan tidak ditemukan" }, { status: 404 });
    }

    // Ambil daftar peer dari karyawan yang berada di bawah atasan ini
    const peerList = await prisma.daftarPeer.findMany({
      where: {
        karyawan: {
          id_atasan: atasan.id_atasan
        }
      },
      include: {
        karyawan: { include: { user: true } },
        peer: { include: { user: true } }
      }
    });

    const formattedList = peerList.map((p: any) => ({
      id: p.id_peer,
      karyawan: p.karyawan.user.nama,
      peer: p.peer.user.nama,
      hubungan: "Peer",
      status: p.status
    }));

    return NextResponse.json({ success: true, data: formattedList });
  } catch (error) {
    console.error("Get Peer error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
