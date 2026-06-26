import { PrismaClient, RoleType, DimensiAkhlak } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper for random int between min and max (inclusive)
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
  console.log('Start seeding comprehensive data...');

  // 1. Clean existing data
  await prisma.jawabanPenilaian.deleteMany();
  await prisma.formPenilaian.deleteMany();
  await prisma.hasilPenilaian.deleteMany();
  await prisma.periodePenilaian.deleteMany(); // Must delete before AdminHR
  await prisma.daftarPeer.deleteMany();
  await prisma.karyawan.deleteMany();
  await prisma.atasan.deleteMany();
  await prisma.adminHR.deleteMany();
  await prisma.manajemen.deleteMany();
  await prisma.user.deleteMany();
  await prisma.indikatorAkhlak.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 2. Create Core Users (Admin & Manajemen)
  const adminUser = await prisma.user.create({
    data: {
      nama: 'Ahmad Admin',
      email: 'admin@energinusantara.com',
      password: hashedPassword,
      role: RoleType.ADMIN_HR,
      adminHR: {
        create: { nip: 'EN-ADM-001', jabatan: 'Senior HR Manager' }
      }
    },
    include: { adminHR: true }
  });

  const manajemenUser = await prisma.user.create({
    data: {
      nama: 'Bapak Direktur',
      email: 'manajemen@energinusantara.com',
      password: hashedPassword,
      role: RoleType.MANAJEMEN,
      manajemen: {
        create: { jabatan: 'Direktur Utama' }
      }
    }
  });

  // 3. Create Atasan
  const atasanUser = await prisma.user.create({
    data: {
      nama: 'Hendri Wijaya (Atasan)',
      email: 'atasan@energinusantara.com',
      password: hashedPassword,
      role: RoleType.ATASAN,
      atasan: {
        create: { nip: 'EN-MGR-001', jabatan: 'Manager IT' }
      }
    },
    include: { atasan: true }
  });

  // 4. Create 10 Karyawan
  const karyawanData = [
    { nama: 'Rizky Pratama', email: 'rizky@energinusantara.com', nip: 'EN-DEV-001', jabatan: 'Frontend Developer' },
    { nama: 'Siti Rahmawati', email: 'siti@energinusantara.com', nip: 'EN-DEV-002', jabatan: 'Backend Developer' },
    { nama: 'Budi Santoso', email: 'budi@energinusantara.com', nip: 'EN-QA-001', jabatan: 'QA Engineer' },
    { nama: 'Ayu Lestari', email: 'ayu@energinusantara.com', nip: 'EN-UIX-001', jabatan: 'UI/UX Designer' },
    { nama: 'Deni Saputra', email: 'deni@energinusantara.com', nip: 'EN-PM-001', jabatan: 'Project Manager' },
    { nama: 'Fajar Hidayat', email: 'fajar@energinusantara.com', nip: 'EN-DEV-003', jabatan: 'Fullstack Developer' },
    { nama: 'Gita Pertiwi', email: 'gita@energinusantara.com', nip: 'EN-DEV-004', jabatan: 'Data Analyst' },
    { nama: 'Hendra Gunawan', email: 'hendra@energinusantara.com', nip: 'EN-SYS-001', jabatan: 'System Administrator' },
    { nama: 'Iqbal Ramadhan', email: 'iqbal@energinusantara.com', nip: 'EN-DEV-005', jabatan: 'Mobile Developer' },
    { nama: 'Joko Widodo', email: 'joko@energinusantara.com', nip: 'EN-SEC-001', jabatan: 'Security Analyst' },
    // Tambahan 20 Karyawan untuk meramaikan data
    { nama: 'Kemal Pasha', email: 'kemal@energinusantara.com', nip: 'EN-DEV-006', jabatan: 'DevOps Engineer' },
    { nama: 'Lina Marlina', email: 'lina@energinusantara.com', nip: 'EN-HR-001', jabatan: 'HR Specialist' },
    { nama: 'Mira Lesmana', email: 'mira@energinusantara.com', nip: 'EN-MKT-001', jabatan: 'Marketing Staff' },
    { nama: 'Nando Pratama', email: 'nando@energinusantara.com', nip: 'EN-FIN-001', jabatan: 'Finance Analyst' },
    { nama: 'Oki Setiawan', email: 'oki@energinusantara.com', nip: 'EN-DEV-007', jabatan: 'Backend Developer' },
    { nama: 'Putri Amelia', email: 'putri@energinusantara.com', nip: 'EN-QA-002', jabatan: 'QA Tester' },
    { nama: 'Qori Akbar', email: 'qori@energinusantara.com', nip: 'EN-PM-002', jabatan: 'Scrum Master' },
    { nama: 'Rina Nose', email: 'rina@energinusantara.com', nip: 'EN-UIX-002', jabatan: 'Product Designer' },
    { nama: 'Sandy Aulia', email: 'sandy@energinusantara.com', nip: 'EN-DEV-008', jabatan: 'Frontend Developer' },
    { nama: 'Tono Subroto', email: 'tono@energinusantara.com', nip: 'EN-SYS-002', jabatan: 'Network Engineer' },
    { nama: 'Umar Dani', email: 'umar@energinusantara.com', nip: 'EN-DEV-009', jabatan: 'Fullstack Developer' },
    { nama: 'Vina Panduwinata', email: 'vina@energinusantara.com', nip: 'EN-FIN-002', jabatan: 'Accountant' },
    { nama: 'Wira Dharma', email: 'wira@energinusantara.com', nip: 'EN-SEC-002', jabatan: 'Security Specialist' },
    { nama: 'Xander Kurniawan', email: 'xander@energinusantara.com', nip: 'EN-DEV-010', jabatan: 'Mobile Developer' },
    { nama: 'Yuni Shara', email: 'yuni@energinusantara.com', nip: 'EN-HR-002', jabatan: 'Recruiter' },
    { nama: 'Zainuddin MZ', email: 'zainuddin@energinusantara.com', nip: 'EN-MKT-002', jabatan: 'Content Writer' },
    { nama: 'Andi Mallarangeng', email: 'andi@energinusantara.com', nip: 'EN-DEV-011', jabatan: 'Backend Developer' },
    { nama: 'Bambang Pamungkas', email: 'bambang@energinusantara.com', nip: 'EN-QA-003', jabatan: 'Automation QA' },
    { nama: 'Cita Citata', email: 'cita@energinusantara.com', nip: 'EN-PM-003', jabatan: 'Product Owner' },
    { nama: 'Didi Kempot', email: 'didi@energinusantara.com', nip: 'EN-UIX-003', jabatan: 'UX Researcher' },
  ];

  const karyawans = [];
  for (const k of karyawanData) {
    const user = await prisma.user.create({
      data: {
        nama: k.nama,
        email: k.email,
        password: hashedPassword,
        role: RoleType.KARYAWAN,
        karyawan: {
          create: {
            nip: k.nip,
            jabatan: k.jabatan,
            departemen: 'IT Department',
            id_atasan: atasanUser.atasan!.id_atasan
          }
        }
      },
      include: { karyawan: true }
    });
    karyawans.push(user);
  }

  // 5. Create Indikator AKHLAK
  const indikatorData = [
    { dimensi: DimensiAkhlak.AMANAH, name_indikator: 'A1', deskripsi: 'Memenuhi janji dan komitmen sesuai dengan tugas dan tanggungjawab.', bobot: 0.16 },
    { dimensi: DimensiAkhlak.AMANAH, name_indikator: 'A2', deskripsi: 'Bertanggungjawab atas tugas, keputusan dan tindakan yang dilakukan.', bobot: 0.16 },
    { dimensi: DimensiAkhlak.KOMPETEN, name_indikator: 'K1', deskripsi: 'Meningkatkan kompetensi diri untuk menjawab tantangan yang selalu berubah.', bobot: 0.16 },
    { dimensi: DimensiAkhlak.KOMPETEN, name_indikator: 'K2', deskripsi: 'Menyelesaikan tugas dengan kualitas terbaik.', bobot: 0.16 },
    { dimensi: DimensiAkhlak.HARMONIS, name_indikator: 'H1', deskripsi: 'Menghargai setiap orang apapun latar belakangnya.', bobot: 0.16 },
    { dimensi: DimensiAkhlak.HARMONIS, name_indikator: 'H2', deskripsi: 'Membangun lingkungan kerja yang kondusif dan inklusif.', bobot: 0.16 },
    { dimensi: DimensiAkhlak.LOYAL, name_indikator: 'L1', deskripsi: 'Menjaga nama baik sesama karyawan, pimpinan, BUMN, dan Negara.', bobot: 0.17 },
    { dimensi: DimensiAkhlak.ADAPTIF, name_indikator: 'Ad1', deskripsi: 'Cepat menyesuaikan diri untuk menjadi lebih baik dalam menghadapi perubahan.', bobot: 0.17 },
    { dimensi: DimensiAkhlak.KOLABORATIF, name_indikator: 'C1', deskripsi: 'Terbuka dalam bekerja sama untuk menghasilkan nilai tambah.', bobot: 0.17 },
  ];

  const indikators = [];
  for (const ind of indikatorData) {
    const created = await prisma.indikatorAkhlak.create({ data: ind });
    indikators.push(created);
  }

  // 6. Create Periode
  const periode = await prisma.periodePenilaian.create({
    data: {
      id_admin: adminUser.adminHR!.id_admin,
      nama_periode: 'Semester 1 2026',
      tgl_mulai: new Date('2026-01-01'),
      tgl_selesai: new Date('2026-06-30'),
      status: 'ACTIVE'
    }
  });

  // 7. Assign Peers (Each Karyawan evaluated by 2 peers)
  for (let i = 0; i < karyawans.length; i++) {
    const p1 = (i + 1) % karyawans.length;
    const p2 = (i + 2) % karyawans.length;

    await prisma.daftarPeer.createMany({
      data: [
        { id_karyawan: karyawans[i].karyawan!.id_karyawan, id_karyawan_peer: karyawans[p1].karyawan!.id_karyawan, status: 'APPROVED' },
        { id_karyawan: karyawans[i].karyawan!.id_karyawan, id_karyawan_peer: karyawans[p2].karyawan!.id_karyawan, status: 'APPROVED' }
      ]
    });
  }

  // Biases for 9-Box Grid spread (30 employees)
  const boxBiases = [
    { k: 5, p: 5 }, // 0: Rizky - Star (High/High)
    { k: 4, p: 5 }, // 1: Siti - High Pot (Med/High)
    { k: 2, p: 5 }, // 2: Budi - Gem (Low/High)
    { k: 5, p: 4 }, // 3: Ayu - High Perf (High/Med)
    { k: 4, p: 4 }, // 4: Deni - Core (Med/Med)
    { k: 2, p: 4 }, // 5: Fajar - Inconsistent (Low/Med)
    { k: 5, p: 2 }, // 6: Gita - Solid Pro (High/Low)
    { k: 4, p: 2 }, // 7: Hendra - Effective (Med/Low)
    { k: 2, p: 2 }, // 8: Iqbal - Underperformer (Low/Low)
    { k: 4, p: 4 }, // 9: Joko - Core (Med/Med)
    
    { k: 5, p: 5 }, // 10: Kemal - Star
    { k: 4, p: 5 }, // 11: Lina - High Pot
    { k: 2, p: 5 }, // 12: Mira - Gem
    { k: 5, p: 4 }, // 13: Nando - High Perf
    { k: 4, p: 4 }, // 14: Oki - Core
    { k: 2, p: 4 }, // 15: Putri - Inconsistent
    { k: 5, p: 2 }, // 16: Qori - Solid Pro
    { k: 4, p: 2 }, // 17: Rina - Effective
    { k: 2, p: 2 }, // 18: Sandy - Underperformer
    { k: 4, p: 4 }, // 19: Tono - Core
    
    { k: 5, p: 5 }, // 20: Umar - Star
    { k: 4, p: 5 }, // 21: Vina - High Pot
    { k: 2, p: 5 }, // 22: Wira - Gem
    { k: 5, p: 4 }, // 23: Xander - High Perf
    { k: 4, p: 4 }, // 24: Yuni - Core
    { k: 2, p: 4 }, // 25: Zainuddin - Inconsistent
    { k: 5, p: 2 }, // 26: Andi - Solid Pro
    { k: 4, p: 2 }, // 27: Bambang - Effective
    { k: 2, p: 2 }, // 28: Cita - Underperformer
    { k: 5, p: 5 }, // 29: Didi - Star
  ];

  // 8. Generate Forms and Answers (All forms submitted)
  for (let idx = 0; idx < karyawans.length; idx++) {
    const k = karyawans[idx];
    const bias = boxBiases[idx];

    // Helper to generate score based on bias
    const getBiasedScore = (dimensi: DimensiAkhlak) => {
      let target = (dimensi === 'KOMPETEN' || dimensi === 'ADAPTIF') ? bias.p : bias.k;
      // Add a little randomness but keep it close to target
      if (target === 5) return randomInt(4, 5);
      if (target === 4) return randomInt(3, 4);
      if (target === 2) return randomInt(1, 3);
      return 3;
    };

    // A. SELF Form
    const isRizkyOrSiti = idx === 0 || idx === 1;
    
    const formSelf = await prisma.formPenilaian.create({
      data: {
        id_karyawan: k.karyawan!.id_karyawan,
        id_periode: periode.id_periode,
        id_penilai: k.id_user,
        tipe_penilaian: 'SELF',
        status: isRizkyOrSiti ? 'DRAFT' : 'SUBMITTED',
        tgl_submit: isRizkyOrSiti ? null : new Date()
      }
    });

    if (!isRizkyOrSiti) {
      for (const ind of indikators) {
        await prisma.jawabanPenilaian.create({
          data: { id_form: formSelf.id_form, id_indikator: ind.id_indikator, skor: getBiasedScore(ind.dimensi) }
        });
      }
    }

    // B. ATASAN Form
    const formAtasan = await prisma.formPenilaian.create({
      data: {
        id_karyawan: k.karyawan!.id_karyawan,
        id_periode: periode.id_periode,
        id_penilai: atasanUser.id_user,
        tipe_penilaian: 'ATASAN',
        status: 'SUBMITTED',
        tgl_submit: new Date()
      }
    });

    for (const ind of indikators) {
      await prisma.jawabanPenilaian.create({
        data: { id_form: formAtasan.id_form, id_indikator: ind.id_indikator, skor: getBiasedScore(ind.dimensi) }
      });
    }

    // C. PEER Forms (Find who evaluates this Karyawan)
    const peerEvaluators = await prisma.daftarPeer.findMany({
      where: { id_karyawan: k.karyawan!.id_karyawan, status: 'APPROVED' },
      include: { peer: true }
    });

    for (const pe of peerEvaluators) {
      const isReviewerRizkyOrSiti = pe.peer.id_user === karyawans[0].id_user || pe.peer.id_user === karyawans[1].id_user;

      const formPeer = await prisma.formPenilaian.create({
        data: {
          id_karyawan: k.karyawan!.id_karyawan,
          id_periode: periode.id_periode,
          id_penilai: pe.peer.id_user,
          tipe_penilaian: 'PEER',
          status: isReviewerRizkyOrSiti ? 'DRAFT' : 'SUBMITTED',
          tgl_submit: isReviewerRizkyOrSiti ? null : new Date()
        }
      });

      if (!isReviewerRizkyOrSiti) {
        for (const ind of indikators) {
          await prisma.jawabanPenilaian.create({
            data: { id_form: formPeer.id_form, id_indikator: ind.id_indikator, skor: getBiasedScore(ind.dimensi) }
          });
        }
      }
    }
  }

  // 9. Generate 15 Pending Peers just for demonstration
  for (let i = 0; i < 15; i++) {
    const kIndex = randomInt(0, karyawans.length - 1);
    const pIndex = randomInt(0, karyawans.length - 1);
    
    if (kIndex !== pIndex) {
      // Check if already exists to avoid duplicates
      const exists = await prisma.daftarPeer.findFirst({
        where: { id_karyawan: karyawans[kIndex].karyawan!.id_karyawan, id_karyawan_peer: karyawans[pIndex].karyawan!.id_karyawan }
      });
      
      if (!exists) {
        await prisma.daftarPeer.create({
          data: {
            id_karyawan: karyawans[kIndex].karyawan!.id_karyawan,
            id_karyawan_peer: karyawans[pIndex].karyawan!.id_karyawan,
            status: 'PENDING'
          }
        });
      }
    }
  }

  console.log('Seeding completed! Generated 10 Karyawans, 1 Atasan, 1 Admin, 1 Manajemen with fully submitted 360-degree forms and answers.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
