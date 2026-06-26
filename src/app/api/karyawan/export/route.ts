import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const karyawans = await prisma.karyawan.findMany({
      include: {
        user: true,
      }
    });

    const csvRows = [];
    // Header
    csvRows.push(["NIP", "Nama", "Email", "Departemen", "Jabatan"].join(","));

    for (const k of karyawans) {
      csvRows.push([
        k.nip,
        `"${k.user.nama}"`,
        k.user.email,
        k.departemen,
        k.jabatan
      ].join(","));
    }

    const csvContent = csvRows.join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=data_karyawan.csv"
      }
    });

  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}
