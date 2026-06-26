import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const periodeAktif = await prisma.periodePenilaian.findFirst({
      where: { status: "ACTIVE" }
    });

    const karyawans = await prisma.karyawan.findMany({
      include: {
        user: true,
        formDinilai: periodeAktif ? {
          where: { id_periode: periodeAktif.id_periode }
        } : false
      }
    });

    const data = karyawans.map(k => {
      let progress = 0;
      let self = "Belum";
      let atasan = "Belum";
      let peer = "Belum";
      
      if (periodeAktif && k.formDinilai) {
        const totalForms = k.formDinilai.length;
        if (totalForms > 0) {
          const completedForms = k.formDinilai.filter((f: any) => f.status === "SUBMITTED").length;
          progress = Math.round((completedForms / totalForms) * 100);
          
          const s = k.formDinilai.find((f: any) => f.tipe_penilaian === "SELF");
          if (s) self = s.status === "SUBMITTED" ? "Selesai" : (s.status === "DRAFT" ? "Proses" : "Belum");

          const a = k.formDinilai.find((f: any) => f.tipe_penilaian === "ATASAN");
          if (a) atasan = a.status === "SUBMITTED" ? "Selesai" : (a.status === "DRAFT" ? "Proses" : "Belum");

          const p = k.formDinilai.find((f: any) => f.tipe_penilaian === "PEER");
          if (p) peer = p.status === "SUBMITTED" ? "Selesai" : (p.status === "DRAFT" ? "Proses" : "Belum");
        }
      }

      return {
        id: k.id_karyawan,
        nip: k.nip,
        nama: k.user.nama,
        departemen: k.departemen,
        jabatan: k.jabatan,
        self,
        atasan,
        peer,
        bawahan: "-", // Disederhanakan
        progress
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Progress fetch error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan" }, { status: 500 });
  }
}
