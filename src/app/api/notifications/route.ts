import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

export async function GET(req: NextRequest) {
  try {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    const user = auth.user!;
    const notifications: { id: string, title: string, message: string, actionUrl: string, createdAt: string }[] = [];

    // Fallback logic for active period
    let periodeAktif = await prisma.periodePenilaian.findFirst({
      where: { status: "ACTIVE" }
    });
    if (!periodeAktif) {
      periodeAktif = await prisma.periodePenilaian.findFirst({
        orderBy: { created_at: "desc" }
      });
    }

    if (user.role === "KARYAWAN" || user.role === "ATASAN") {
      if (periodeAktif && periodeAktif.status === "ACTIVE") {
        // Cek jumlah form DRAFT (tugas evaluasi yang belum disubmit)
        const countDraft = await prisma.formPenilaian.count({
          where: {
            id_penilai: user.id_user,
            id_periode: periodeAktif.id_periode,
            status: "DRAFT"
          }
        });

        if (countDraft > 0) {
          notifications.push({
            id: `draft-${Date.now()}`,
            title: "Tugas Evaluasi",
            message: `Anda memiliki ${countDraft} evaluasi 360° yang belum diselesaikan pada periode berjalan.`,
            actionUrl: "/dashboard/karyawan/penugasan",
            createdAt: new Date().toISOString()
          });
        }
      }
    }

    if (user.role === "ATASAN") {
      // Cek persetujuan peer
      const atasan = await prisma.atasan.findUnique({ where: { id_user: user.id_user } });
      if (atasan) {
        const countPendingPeer = await prisma.daftarPeer.count({
          where: {
            status: "PENDING",
            karyawan: {
              id_atasan: atasan.id_atasan
            }
          }
        });

        if (countPendingPeer > 0) {
          notifications.push({
            id: `peer-${Date.now()}`,
            title: "Persetujuan Peer",
            message: `Terdapat ${countPendingPeer} pengajuan penilai peer dari bawahan yang menunggu persetujuan Anda.`,
            actionUrl: "/dashboard/atasan/persetujuan",
            createdAt: new Date().toISOString()
          });
        }
      }
    }

    if (user.role === "ADMIN_HR" || user.role === "MANAJEMEN") {
      if (!periodeAktif || periodeAktif.status === "CLOSED") {
        notifications.push({
          id: `periode-closed-${Date.now()}`,
          title: "Sistem Periode",
          message: "Saat ini tidak ada periode evaluasi yang berjalan. Laporan hanya menampilkan data lampau.",
          actionUrl: user.role === "ADMIN_HR" ? "/dashboard/admin/periode" : "/dashboard/manajemen/laporan",
          createdAt: new Date().toISOString()
        });
      } else {
        notifications.push({
          id: `periode-active-${Date.now()}`,
          title: "Informasi Periode",
          message: `Periode ${periodeAktif.nama_periode} sedang berlangsung. Pantau progres karyawan secara berkala.`,
          actionUrl: user.role === "ADMIN_HR" ? "/dashboard/admin/progress" : "/dashboard/manajemen",
          createdAt: periodeAktif.created_at.toISOString()
        });
      }
    }

    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    console.error("Notifications API Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
