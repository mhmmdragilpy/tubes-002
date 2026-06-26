import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/lib/authMiddleware";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    const { status } = await req.json();
    const id_peer = parseInt(idStr);

    // Di dunia nyata, pastikan Atasan yang login berhak mengubah status peer ini

    const updated = await prisma.daftarPeer.update({
      where: { id_peer },
      data: { status }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update Peer error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
