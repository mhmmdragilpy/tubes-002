import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "akhlak360-super-secret-key-2026";

export interface AuthUser {
  id_user: number;
  email: string;
  role: string;
}

/**
 * Validates the Authorization header and returns the user payload or an error response.
 */
export function authenticate(req: NextRequest): { user?: AuthUser; error?: NextResponse } {
  const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: NextResponse.json({ success: false, message: "Akses ditolak. Token tidak ditemukan." }, { status: 401 }) };
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return { user: decoded };
  } catch (err) {
    return { error: NextResponse.json({ success: false, message: "Token tidak valid atau sudah kadaluarsa." }, { status: 401 }) };
  }
}

/**
 * Checks if the user has one of the required roles.
 */
export function requireRole(user: AuthUser, allowedRoles: string[]): NextResponse | null {
  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json({ success: false, message: "Anda tidak memiliki izin (role) yang sesuai." }, { status: 403 });
  }
  return null;
}
