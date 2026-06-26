import { redirect } from "next/navigation";

export default function PenilaianRedirectPage() {
  // Jika ada yang mencoba mengakses /dashboard/penilaian langsung, arahkan ke daftar penugasan
  redirect("/dashboard/karyawan/penugasan");
}
