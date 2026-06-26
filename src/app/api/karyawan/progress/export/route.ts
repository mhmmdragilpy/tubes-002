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

    const csvRows = [];
    csvRows.push(["NIP", "Nama", "Departemen", "Self", "Atasan", "Peer", "Progress (%)"].join(","));

    for (const k of karyawans) {
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

      csvRows.push([
        k.nip,
        `"${k.user.nama}"`,
        k.departemen,
        self,
        atasan,
        peer,
        progress
      ].join(","));
    }

    const csvContent = csvRows.join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=progress_akhlak_360.csv"
      }
    });

  } catch (error) {
    console.error("Export progress error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
