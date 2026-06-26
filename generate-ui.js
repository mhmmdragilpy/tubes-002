const fs = require('fs');
const path = require('path');

const lofiDir = path.join(__dirname, 'ui-design/lofi');
const hifiDir = path.join(__dirname, 'ui-design/hifi');

if (!fs.existsSync(lofiDir)) fs.mkdirSync(lofiDir, { recursive: true });
if (!fs.existsSync(hifiDir)) fs.mkdirSync(hifiDir, { recursive: true });

// Data definitions
const navLinks = {
  admin: [
    { title: 'Dashboard', url: 'dashboard-admin.html', active: 'dashboard-admin.html' },
    { title: 'Kelola Karyawan', url: 'kelola-karyawan.html', active: 'kelola-karyawan.html' }
  ],
  atasan: [
    { title: 'Dashboard', url: 'dashboard-atasan.html', active: 'dashboard-atasan.html' },
    { title: 'Persetujuan Peer', url: 'persetujuan-peer.html', active: 'persetujuan-peer.html' }
  ],
  karyawan: [
    { title: 'Dashboard', url: 'dashboard-karyawan.html', active: 'dashboard-karyawan.html' },
    { title: 'Penugasan Penilaian', url: 'penugasan-karyawan.html', active: 'penugasan-karyawan.html' }
  ],
  manajemen: [
    { title: 'Executive Dashboard', url: 'dashboard-manajemen.html', active: 'dashboard-manajemen.html' },
    { title: 'Laporan 9-Box', url: 'laporan-9box.html', active: 'laporan-9box.html' },
    { title: 'Laporan Akhir', url: 'laporan-akhir.html', active: 'laporan-akhir.html' }
  ]
};

// ==========================
// LO-FI TEMPLATE
// ==========================
const lofiStyle = `
  * { box-sizing: border-box; font-family: 'Courier New', monospace; }
  body { background: #e5e5e5; margin: 0; padding: 20px; color: #000; }
  .wf-container { max-width: 1200px; margin: 0 auto; background: #fff; border: 3px solid #000; display: flex; flex-direction: column; min-height: 90vh; }
  .wf-header { border-bottom: 3px solid #000; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; background: #f0f0f0; font-weight: bold; }
  .wf-sidebar { width: 250px; border-right: 3px solid #000; padding: 20px; background: #fafafa; }
  .wf-main { flex: 1; padding: 30px; }
  .wf-box { border: 2px solid #000; padding: 20px; margin-bottom: 20px; background: #fff; position: relative; }
  .wf-btn { display: inline-block; border: 2px solid #000; padding: 10px 20px; background: #e0e0e0; text-decoration: none; color: #000; font-weight: bold; text-align: center; cursor: pointer; }
  .wf-btn-primary { background: #555; color: white; }
  .wf-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
  .wf-table th, .wf-table td { border: 2px solid #000; padding: 12px; text-align: left; }
  .wf-nav-item { border: 2px solid #000; padding: 10px; margin-bottom: 10px; background: #eee; font-weight: bold; display: block; text-decoration: none; color: black; }
  .wf-nav-item.active { background: #ccc; }
  .wf-placeholder { border: 2px dashed #000; background: #eee; display: flex; align-items: center; justify-content: center; height: 150px; font-weight: bold; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
  .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 20px; }
`;

function renderLoFiWrapper(title, role, currentPage, content) {
  if (role === 'guest') {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>[Lo-Fi] ${title}</title><style>${lofiStyle}</style></head><body><div class="wf-container" style="justify-content: center; align-items: center; background: #fafafa; height: 100vh;">${content}</div></body></html>`;
  }
  
  const sidebarLinks = navLinks[role].map(n => 
    `<a href="${n.url}" class="wf-nav-item ${currentPage === n.active ? 'active' : ''}">${n.title}</a>`
  ).join('');

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>[Lo-Fi] ${title}</title><style>${lofiStyle}</style></head><body>
<div class="wf-container">
  <div class="wf-header">
    <div>AKHLAK 360 Lofi</div>
    <div>Role: ${role.toUpperCase()}</div>
  </div>
  <div style="display:flex;flex:1">
    <div class="wf-sidebar">
      ${sidebarLinks}
      <a href="login.html" class="wf-nav-item" style="margin-top:50px">Logout</a>
    </div>
    <div class="wf-main">
      <h1>${title}</h1>
      ${content}
    </div>
  </div>
</div>
</body></html>`;
}

// ==========================
// HI-FI TEMPLATE
// ==========================
const hifiHead = `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: { sans: ['"Plus Jakarta Sans"', 'sans-serif'] },
          colors: {
            primary: { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
            accent: { 500: '#06b6d4', 600: '#0891b2' }
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; }
    .glass { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); }
    .card-hover { transition: all 0.3s ease; }
    .card-hover:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
  </style>
  <script src="https://unpkg.com/lucide@latest"></script>
`;

function renderHiFiWrapper(title, role, currentPage, content) {
  if (role === 'guest') {
    return `<!DOCTYPE html><html lang="en"><head><title>${title} | AKHLAK 360</title>${hifiHead}</head><body class="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-slate-100">${content}<script>lucide.createIcons();</script></body></html>`;
  }

  const sidebarLinks = navLinks[role].map(n => {
    const isActive = currentPage === n.active;
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ";
    const stateClass = isActive 
      ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30" 
      : "text-slate-600 hover:bg-white hover:text-primary-600 hover:shadow-md";
    return `<a href="${n.url}" class="${baseClass} ${stateClass}"><i data-lucide="layout-dashboard" class="w-5 h-5"></i>${n.title}</a>`;
  }).join('');

  return `<!DOCTYPE html><html lang="en"><head><title>${title} | AKHLAK 360</title>${hifiHead}</head><body class="bg-slate-50 text-slate-800">
<div class="flex h-screen overflow-hidden">
  <!-- Sidebar -->
  <aside class="w-72 glass border-r border-slate-200 flex flex-col relative z-20">
    <div class="p-6 flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-lg">A</div>
      <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-accent-600">AKHLAK 360</span>
    </div>
    <div class="px-6 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Menu ${role}</div>
    <nav class="flex-1 px-4 space-y-2">
      ${sidebarLinks}
    </nav>
    <div class="p-4">
      <a href="login.html" class="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
        <i data-lucide="log-out" class="w-5 h-5"></i><span>Logout</span>
      </a>
    </div>
  </aside>
  <!-- Main Content -->
  <main class="flex-1 overflow-y-auto bg-slate-50 relative">
    <!-- Header -->
    <header class="glass sticky top-0 z-10 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-slate-800 tracking-tight">${title}</h1>
      <div class="flex items-center gap-4">
        <button class="p-2 text-slate-400 hover:text-primary-600 bg-white rounded-full shadow-sm border border-slate-100 relative">
          <i data-lucide="bell" class="w-5 h-5"></i><span class="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>
        <div class="flex items-center gap-3 bg-white pl-2 pr-4 py-1.5 rounded-full shadow-sm border border-slate-100">
          <img src="https://i.pravatar.cc/150?u=${role}" alt="User" class="w-8 h-8 rounded-full border-2 border-primary-100" />
          <div class="flex flex-col">
            <span class="text-sm font-bold text-slate-700 leading-tight">Budi Santoso</span>
            <span class="text-xs text-slate-500 capitalize">${role}</span>
          </div>
        </div>
      </div>
    </header>
    <!-- Content Area -->
    <div class="p-8 max-w-7xl mx-auto space-y-6">
      ${content}
    </div>
  </main>
</div>
<script>lucide.createIcons();</script>
</body></html>`;
}

// ==========================
// PAGES CONTENT
// ==========================

const pagesConfig = {
  login: {
    file: 'login.html', title: 'Sign In', role: 'guest',
    lofi: `<div class="wf-box" style="width:400px; padding:40px;"><h2>AKHLAK 360</h2><p>Silakan Login</p><input type="text" placeholder="NIP/Email" style="width:100%;margin-bottom:15px;padding:10px" /><input type="password" placeholder="Password" style="width:100%;margin-bottom:15px;padding:10px" /><a href="dashboard-karyawan.html" class="wf-btn wf-btn-primary" style="width:100%;text-align:center">LOGIN</a></div>`,
    hifi: `<div class="w-full max-w-md glass rounded-3xl shadow-2xl p-10 border border-white relative overflow-hidden"><div class="absolute -top-20 -right-20 w-40 h-40 bg-primary-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div><div class="absolute -bottom-20 -left-20 w-40 h-40 bg-accent-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div><div class="relative z-10 text-center mb-8"><div class="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg"><i data-lucide="shield-check" class="w-8 h-8"></i></div><h2 class="text-3xl font-extrabold text-slate-800">Welcome Back</h2><p class="text-slate-500 mt-2">Sign in to AKHLAK 360 platform</p></div><form class="relative z-10 space-y-5"><div class="space-y-1"><label class="text-sm font-semibold text-slate-700">Email or NIP</label><div class="relative"><i data-lucide="user" class="absolute left-3 top-3 text-slate-400 w-5 h-5"></i><input type="text" class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all bg-white/50 backdrop-blur-sm" placeholder="Enter your NIP" /></div></div><div class="space-y-1"><label class="text-sm font-semibold text-slate-700">Password</label><div class="relative"><i data-lucide="lock" class="absolute left-3 top-3 text-slate-400 w-5 h-5"></i><input type="password" class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all bg-white/50 backdrop-blur-sm" placeholder="••••••••" /></div></div><div class="flex items-center justify-between"><label class="flex items-center gap-2"><input type="checkbox" class="rounded border-slate-300 text-primary-600 focus:ring-primary-500" /><span class="text-sm text-slate-600">Remember me</span></label><a href="#" class="text-sm font-medium text-primary-600 hover:text-primary-700">Forgot password?</a></div><a href="dashboard-karyawan.html" class="block w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl font-bold text-center shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-0.5">Sign In</a></form></div>`
  },
  adminDashboard: {
    file: 'dashboard-admin.html', title: 'Admin Dashboard', role: 'admin',
    lofi: `<div class="grid-3"><div class="wf-box"><h3>Periode Aktif</h3><h2>Semester 1 2026</h2><button class="wf-btn">Tutup Periode</button></div><div class="wf-box"><h3>Total Karyawan</h3><h2>1,240</h2></div><div class="wf-box"><h3>Progres Evaluasi</h3><h2>85% Selesai</h2></div></div>`,
    hifi: `<div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="glass rounded-2xl p-6 border border-slate-200 shadow-sm card-hover relative overflow-hidden"><div class="absolute top-0 right-0 p-4 opacity-10"><i data-lucide="calendar" class="w-24 h-24"></i></div><p class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Periode Aktif</p><h3 class="text-3xl font-bold text-slate-800 mt-2 mb-4">Semester 1 2026</h3><div class="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit mb-4"><i data-lucide="check-circle-2" class="w-4 h-4"></i><span class="text-xs font-bold">In Progress</span></div><button class="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-colors">Tutup Periode</button></div><div class="glass rounded-2xl p-6 border border-slate-200 shadow-sm card-hover"><div class="flex justify-between items-start"><div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-4"><i data-lucide="users" class="w-6 h-6"></i></div></div><p class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Karyawan</p><h3 class="text-4xl font-extrabold text-slate-800 mt-2">1,240</h3><p class="text-sm text-slate-500 mt-2"><span class="text-emerald-500 font-medium">↑ 12</span> dari periode lalu</p></div><div class="glass rounded-2xl p-6 border border-slate-200 shadow-sm card-hover"><div class="flex justify-between items-start"><div class="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center text-accent-600 mb-4"><i data-lucide="activity" class="w-6 h-6"></i></div></div><p class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Progres Evaluasi</p><h3 class="text-4xl font-extrabold text-slate-800 mt-2">85%</h3><div class="w-full bg-slate-100 h-2 rounded-full mt-4"><div class="bg-accent-500 h-2 rounded-full" style="width: 85%"></div></div><p class="text-sm text-slate-500 mt-2">1,054 karyawan selesai</p></div></div>`
  },
  adminKaryawan: {
    file: 'kelola-karyawan.html', title: 'Kelola Karyawan', role: 'admin',
    lofi: `<div class="wf-box"><button class="wf-btn wf-btn-primary">+ Tambah Karyawan</button><table class="wf-table"><tr><th>NIP</th><th>Nama</th><th>Departemen</th><th>Role</th><th>Aksi</th></tr><tr><td>101</td><td>Andi</td><td>IT</td><td>Karyawan</td><td><button class="wf-btn">Edit</button></td></tr><tr><td>102</td><td>Budi</td><td>HR</td><td>Atasan</td><td><button class="wf-btn">Edit</button></td></tr></table></div>`,
    hifi: `<div class="glass rounded-2xl shadow-sm border border-slate-200 overflow-hidden"><div class="p-6 border-b border-slate-100 flex justify-between items-center bg-white"><div class="relative"><i data-lucide="search" class="absolute left-3 top-2.5 text-slate-400 w-5 h-5"></i><input type="text" placeholder="Cari karyawan..." class="pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64 transition-all" /></div><button class="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm shadow-primary-500/20"><i data-lucide="plus" class="w-5 h-5"></i> Tambah Karyawan</button></div><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead class="bg-slate-50 border-b border-slate-200"><tr><th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">NIP & Nama</th><th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Departemen</th><th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th><th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th></tr></thead><tbody class="divide-y divide-slate-100 bg-white"><tr class="hover:bg-slate-50 transition-colors"><td class="px-6 py-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">AD</div><div><p class="font-bold text-slate-800">Andi Dermawan</p><p class="text-xs text-slate-500">NIP: 101234</p></div></div></td><td class="px-6 py-4 text-slate-600 font-medium">Information Technology</td><td class="px-6 py-4"><span class="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200">Karyawan</span></td><td class="px-6 py-4 text-right"><button class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><i data-lucide="edit-2" class="w-4 h-4"></i></button></td></tr><tr class="hover:bg-slate-50 transition-colors"><td class="px-6 py-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center font-bold">BS</div><div><p class="font-bold text-slate-800">Budi Santoso</p><p class="text-xs text-slate-500">NIP: 101235</p></div></div></td><td class="px-6 py-4 text-slate-600 font-medium">Human Resources</td><td class="px-6 py-4"><span class="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">Atasan</span></td><td class="px-6 py-4 text-right"><button class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><i data-lucide="edit-2" class="w-4 h-4"></i></button></td></tr></tbody></table></div></div>`
  },
  atasanDashboard: {
    file: 'dashboard-atasan.html', title: 'Dashboard Atasan', role: 'atasan',
    lofi: `<div class="grid-2"><div class="wf-box"><h3>Bawahan Menunggu Evaluasi</h3><h2>5 Orang</h2><a href="penugasan-karyawan.html" class="wf-btn wf-btn-primary">Mulai Penilaian</a></div><div class="wf-box"><h3>Pengajuan Peer Review</h3><h2>3 Permintaan</h2><a href="persetujuan-peer.html" class="wf-btn">Lihat Permintaan</a></div></div>`,
    hifi: `<div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="glass rounded-2xl p-6 border border-slate-200 shadow-sm card-hover relative overflow-hidden bg-white"><div class="absolute right-0 top-0 w-32 h-32 bg-primary-50 rounded-bl-full -mr-10 -mt-10"></div><div class="relative z-10"><div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-4"><i data-lucide="users" class="w-6 h-6"></i></div><h3 class="text-slate-500 font-semibold text-sm uppercase tracking-wider">Evaluasi Bawahan</h3><div class="flex items-end gap-3 mt-2"><span class="text-5xl font-extrabold text-slate-800">5</span><span class="text-slate-500 mb-1 font-medium">Orang menunggu dinilai</span></div><a href="penugasan-karyawan.html" class="mt-6 flex items-center justify-between w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition-colors border border-slate-200"><span>Mulai Penilaian</span><i data-lucide="arrow-right" class="w-4 h-4"></i></a></div></div><div class="glass rounded-2xl p-6 border border-slate-200 shadow-sm card-hover relative overflow-hidden bg-white"><div class="absolute right-0 top-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-10 -mt-10"></div><div class="relative z-10"><div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-4"><i data-lucide="clipboard-check" class="w-6 h-6"></i></div><h3 class="text-slate-500 font-semibold text-sm uppercase tracking-wider">Pengajuan Peer Review</h3><div class="flex items-end gap-3 mt-2"><span class="text-5xl font-extrabold text-slate-800">3</span><span class="text-slate-500 mb-1 font-medium">Permintaan butuh persetujuan</span></div><a href="persetujuan-peer.html" class="mt-6 flex items-center justify-between w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-primary-500/20"><span>Lihat Permintaan</span><i data-lucide="arrow-right" class="w-4 h-4"></i></a></div></div></div>`
  },
  atasanPeer: {
    file: 'persetujuan-peer.html', title: 'Persetujuan Peer Review', role: 'atasan',
    lofi: `<div class="wf-box"><table class="wf-table"><tr><th>Pengaju (Reviewer)</th><th>Target (Reviewee)</th><th>Aksi</th></tr><tr><td>Rina (Bawahan)</td><td>Joko (Divisi Lain)</td><td><button class="wf-btn">Setuju</button> <button class="wf-btn">Tolak</button></td></tr></table></div>`,
    hifi: `<div class="glass rounded-2xl shadow-sm border border-slate-200 overflow-hidden bg-white"><div class="p-6 border-b border-slate-100"><h2 class="text-lg font-bold text-slate-800">Daftar Permintaan Peer Review</h2><p class="text-slate-500 text-sm mt-1">Setujui atau tolak permintaan bawahan untuk menilai karyawan divisi lain.</p></div><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead class="bg-slate-50 border-b border-slate-200"><tr><th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pengaju (Bawahan Anda)</th><th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Target Dinilai (Reviewee)</th><th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Keputusan</th></tr></thead><tbody class="divide-y divide-slate-100"><tr class="hover:bg-slate-50 transition-colors"><td class="px-6 py-4"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">RN</div><span class="font-semibold text-slate-800">Rina Suryani</span></div></td><td class="px-6 py-4"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600 text-xs">JK</div><div><p class="font-semibold text-slate-800">Joko Anwar</p><p class="text-xs text-slate-500">Divisi Pemasaran</p></div></div></td><td class="px-6 py-4 text-right"><div class="flex justify-end gap-2"><button class="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg font-bold text-sm transition-colors"><i data-lucide="check" class="w-4 h-4"></i> Setuju</button><button class="flex items-center gap-1 bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded-lg font-bold text-sm transition-colors"><i data-lucide="x" class="w-4 h-4"></i> Tolak</button></div></td></tr></tbody></table></div></div>`
  },
  karyawanDashboard: {
    file: 'dashboard-karyawan.html', title: 'Dashboard Karyawan', role: 'karyawan',
    lofi: `<div class="grid-2"><div class="wf-box"><h3>Tugas Penilaian Anda</h3><h2>3 Pending</h2><a href="penugasan-karyawan.html" class="wf-btn wf-btn-primary">Kerjakan Sekarang</a></div><div class="wf-box"><h3>Skor AKHLAK Saya</h3><div class="wf-placeholder">Radar Chart AKHLAK</div></div></div>`,
    hifi: `<div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="glass rounded-2xl p-6 border border-slate-200 shadow-sm card-hover relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 text-white"><div class="absolute right-0 top-0 opacity-10 p-4"><i data-lucide="file-signature" class="w-32 h-32"></i></div><div class="relative z-10"><div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white mb-6 border border-white/30"><i data-lucide="clipboard-list" class="w-6 h-6"></i></div><h3 class="text-primary-100 font-medium uppercase tracking-wider text-sm">Tugas Penilaian</h3><div class="flex items-end gap-3 mt-1"><span class="text-5xl font-extrabold text-white">3</span><span class="text-primary-100 mb-1 font-medium">Orang menunggu</span></div><a href="penugasan-karyawan.html" class="mt-8 flex items-center justify-center gap-2 w-full py-3 px-4 bg-white hover:bg-slate-50 text-primary-700 font-bold rounded-xl transition-colors shadow-lg"><span>Mulai Evaluasi</span><i data-lucide="arrow-right" class="w-4 h-4"></i></a></div></div><div class="glass rounded-2xl p-6 border border-slate-200 shadow-sm bg-white flex flex-col"><h3 class="text-lg font-bold text-slate-800 mb-1">Skor AKHLAK Anda</h3><p class="text-slate-500 text-sm mb-6">Berdasarkan penilaian 360° periode lalu.</p><div class="flex-1 flex items-center justify-center relative"><div class="w-48 h-48 rounded-full border-4 border-slate-100 flex items-center justify-center relative"><div class="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent transform rotate-45"></div><div class="text-center"><span class="block text-4xl font-extrabold text-slate-800">4.2</span><span class="text-xs font-bold text-slate-500 uppercase">Rata-rata</span></div></div></div><div class="mt-6 flex justify-center gap-4 text-sm font-medium"><div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-primary-500"></span><span class="text-slate-600">Anda</span></div><div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-slate-300"></span><span class="text-slate-600">Target</span></div></div></div></div>`
  },
  karyawanPenugasan: {
    file: 'penugasan-karyawan.html', title: 'Penugasan Penilaian', role: 'karyawan',
    lofi: `<div class="wf-box"><table class="wf-table"><tr><th>Nama Target</th><th>Role Evaluasi</th><th>Status</th><th>Aksi</th></tr><tr><td>Siti (Manager)</td><td>Penilaian Atasan</td><td>Pending</td><td><a href="form-penilaian.html" class="wf-btn wf-btn-primary">Nilai</a></td></tr><tr><td>Tono (Rekan)</td><td>Penilaian Peer</td><td>Selesai</td><td><span class="wf-btn">Selesai</span></td></tr></table></div>`,
    hifi: `<div class="glass rounded-2xl shadow-sm border border-slate-200 overflow-hidden bg-white"><div class="p-6 border-b border-slate-100"><h2 class="text-lg font-bold text-slate-800">Daftar Karyawan yang Harus Dinilai</h2><p class="text-slate-500 text-sm mt-1">Harap berikan penilaian yang objektif berdasarkan Core Values AKHLAK.</p></div><div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"><div class="border border-slate-200 rounded-xl p-5 flex items-center justify-between hover:border-primary-300 hover:shadow-md transition-all bg-slate-50"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">ST</div><div><p class="font-bold text-slate-800 text-lg">Siti Rahma</p><div class="flex items-center gap-2 mt-1"><span class="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">Atasan Anda</span><span class="flex items-center gap-1 text-amber-600 text-xs font-bold"><i data-lucide="clock" class="w-3 h-3"></i> Pending</span></div></div></div><a href="form-penilaian.html" class="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm shadow-primary-500/30">Mulai Evaluasi</a></div><div class="border border-emerald-200 rounded-xl p-5 flex items-center justify-between bg-emerald-50/50 opacity-70"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold text-lg">TN</div><div><p class="font-bold text-slate-800 text-lg">Tono Hartono</p><div class="flex items-center gap-2 mt-1"><span class="px-2 py-0.5 bg-slate-200 text-slate-700 text-xs font-bold rounded">Rekan Sejawat (Peer)</span><span class="flex items-center gap-1 text-emerald-600 text-xs font-bold"><i data-lucide="check-circle-2" class="w-3 h-3"></i> Selesai</span></div></div></div><button disabled class="bg-slate-200 text-slate-500 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2"><i data-lucide="check" class="w-4 h-4"></i> Selesai</button></div></div></div>`
  },
  karyawanForm: {
    file: 'form-penilaian.html', title: 'Form Penilaian AKHLAK', role: 'karyawan',
    lofi: `<div class="wf-box"><p>Menilai: <strong>Siti (Manager)</strong></p><hr style="border-top:2px solid #000; margin: 15px 0" /><h3>1. Amanah</h3><p>Memegang teguh kepercayaan yang diberikan.</p><input type="radio" name="amanah" /> 1 <input type="radio" name="amanah" /> 2 <input type="radio" name="amanah" /> 3 <input type="radio" name="amanah" /> 4 <input type="radio" name="amanah" /> 5<br><br><h3>2. Kompeten</h3><p>Terus belajar dan mengembangkan kapabilitas.</p><input type="radio" name="kompeten" /> 1 - 5<br><br><button class="wf-btn wf-btn-primary">Submit Penilaian</button></div>`,
    hifi: `<div class="max-w-3xl mx-auto"><div class="glass rounded-2xl p-6 border border-slate-200 mb-6 bg-white flex items-center gap-4"><div class="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-md">ST</div><div><p class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Anda sedang menilai</p><h2 class="text-2xl font-bold text-slate-800">Siti Rahma</h2><p class="text-slate-500">Penilaian Atasan • Departemen IT</p></div></div><div class="glass rounded-2xl p-8 border border-slate-200 shadow-sm bg-white space-y-10"><div class="space-y-4"><div><div class="flex items-center gap-3 mb-2"><span class="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">A</span><h3 class="text-xl font-bold text-slate-800">Amanah</h3></div><p class="text-slate-600 pl-11">Memegang teguh kepercayaan yang diberikan. Memenuhi janji dan komitmen.</p></div><div class="pl-11"><div class="flex justify-between items-center gap-2 max-w-lg"><button class="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors">1</button><button class="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors">2</button><button class="flex-1 py-3 border-2 border-primary-500 bg-primary-50 rounded-xl font-bold text-primary-700 shadow-sm">3</button><button class="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors">4</button><button class="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-500 hover:border-primary-400 hover:text-primary-600 transition-colors">5</button></div><div class="flex justify-between max-w-lg mt-2 text-xs font-semibold text-slate-400 uppercase"><span>Sangat Kurang</span><span>Sangat Baik</span></div></div></div><hr class="border-slate-100" /><div class="space-y-4"><div><div class="flex items-center gap-3 mb-2"><span class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">K</span><h3 class="text-xl font-bold text-slate-800">Kompeten</h3></div><p class="text-slate-600 pl-11">Terus belajar dan mengembangkan kapabilitas. Menyelesaikan tugas dengan kualitas terbaik.</p></div><div class="pl-11"><div class="flex justify-between items-center gap-2 max-w-lg"><button class="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors">1</button><button class="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors">2</button><button class="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors">3</button><button class="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors">4</button><button class="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors">5</button></div></div></div><div class="pt-6 border-t border-slate-100 flex justify-end gap-3"><a href="penugasan-karyawan.html" class="px-6 py-3 font-bold text-slate-500 hover:text-slate-700 transition-colors">Batal</a><button class="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-0.5">Submit Penilaian</button></div></div></div>`
  },
  manajemenDashboard: {
    file: 'dashboard-manajemen.html', title: 'Executive Dashboard', role: 'manajemen',
    lofi: `<div class="grid-4"><div class="wf-box"><h4>Rata-rata Skor AKHLAK</h4><h2>4.35</h2></div><div class="wf-box"><h4>Karyawan Dinilai</h4><h2>1,240</h2></div><div class="wf-box"><h4>Masuk Radar Talent</h4><h2>40%</h2></div><div class="wf-box"><h4>Butuh IDP</h4><h2>60%</h2></div></div><div class="grid-2"><div class="wf-box"><h3>Skor per Value (Radar)</h3><div class="wf-placeholder">Radar Chart (Amanah, Kompeten...)</div></div><div class="wf-box"><h3>Analisis Kesenjangan</h3><div class="wf-placeholder">Bar Chart</div></div></div>`,
    hifi: `<div class="grid grid-cols-1 md:grid-cols-4 gap-6"><div class="glass rounded-2xl p-5 border border-slate-200 shadow-sm bg-white"><p class="text-sm font-semibold text-slate-500 mb-1">Rata-rata Skor AKHLAK</p><h3 class="text-3xl font-extrabold text-slate-800">4.35<span class="text-sm font-bold text-slate-400 ml-1">/ 5.0</span></h3><p class="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-1"><i data-lucide="trending-up" class="w-3 h-3"></i> +0.15 dari Sem. lalu</p></div><div class="glass rounded-2xl p-5 border border-slate-200 shadow-sm bg-white"><p class="text-sm font-semibold text-slate-500 mb-1">Karyawan Dinilai</p><h3 class="text-3xl font-extrabold text-slate-800">1,240</h3><p class="text-xs font-bold text-primary-500 mt-2 flex items-center gap-1"><i data-lucide="check-circle" class="w-3 h-3"></i> 100% Partisipasi</p></div><div class="glass rounded-2xl p-5 border border-slate-200 shadow-sm bg-white"><p class="text-sm font-semibold text-slate-500 mb-1">Masuk Radar Talent</p><h3 class="text-3xl font-extrabold text-slate-800">40%</h3><p class="text-xs font-bold text-slate-500 mt-2">496 Karyawan (Kategori 8 & 9)</p></div><div class="glass rounded-2xl p-5 border border-slate-200 shadow-sm bg-white"><p class="text-sm font-semibold text-slate-500 mb-1">Butuh IDP</p><h3 class="text-3xl font-extrabold text-slate-800 text-rose-600">60%</h3><p class="text-xs font-bold text-slate-500 mt-2">744 Karyawan (Perlu Peningkatan)</p></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"><div class="glass rounded-2xl p-6 border border-slate-200 shadow-sm bg-white"><h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><i data-lucide="radar" class="w-5 h-5 text-primary-500"></i> Radar AKHLAK Keseluruhan</h3><div class="aspect-video bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center"><div class="text-center"><i data-lucide="bar-chart-2" class="w-12 h-12 text-slate-300 mx-auto mb-2"></i><p class="text-sm font-semibold text-slate-400">Radar Chart Visualizer</p><p class="text-xs text-slate-400">Amanah: 4.5 | Kompeten: 4.3 | Harmonis: 4.1</p></div></div></div><div class="glass rounded-2xl p-6 border border-slate-200 shadow-sm bg-white"><h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><i data-lucide="bar-chart-3" class="w-5 h-5 text-accent-500"></i> Distribusi Kesenjangan (IDP vs Talent)</h3><div class="aspect-video bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center"><div class="flex items-end gap-2 h-32"><div class="w-8 bg-rose-400 rounded-t-sm h-1/4"></div><div class="w-8 bg-emerald-400 rounded-t-sm h-3/4"></div><div class="w-4"></div><div class="w-8 bg-rose-400 rounded-t-sm h-2/4"></div><div class="w-8 bg-emerald-400 rounded-t-sm h-2/4"></div><div class="w-4"></div><div class="w-8 bg-rose-400 rounded-t-sm h-1/5"></div><div class="w-8 bg-emerald-400 rounded-t-sm h-4/5"></div></div></div></div></div>`
  },
  manajemenLaporan: {
    file: 'laporan-akhir.html', title: 'Laporan Akhir', role: 'manajemen',
    lofi: `<div class="wf-box"><button class="wf-btn">Export PDF</button> <button class="wf-btn">Export CSV</button><table class="wf-table"><tr><th>Peringkat</th><th>Nama</th><th>Skor Akhir</th><th>Kategori 9-Box</th></tr><tr><td>1</td><td>Budi Santoso</td><td>4.85</td><td>Star / Future Leader</td></tr><tr><td>2</td><td>Andi Dermawan</td><td>4.60</td><td>High Performer</td></tr></table></div>`,
    hifi: `<div class="glass rounded-2xl shadow-sm border border-slate-200 bg-white"><div class="p-6 border-b border-slate-100 flex justify-between items-center"><h2 class="text-lg font-bold text-slate-800">Data Peringkat Karyawan (Semester 1 2026)</h2><div class="flex gap-3"><button class="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"><i data-lucide="file-text" class="w-4 h-4"></i> Export CSV</button><button class="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-sm transition-colors border border-rose-200"><i data-lucide="download" class="w-4 h-4"></i> Unduh PDF</button></div></div><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead class="bg-slate-50 border-b border-slate-200"><tr><th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">Rank</th><th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Karyawan</th><th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Skor Akhlak</th><th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori Talent</th></tr></thead><tbody class="divide-y divide-slate-100"><tr class="hover:bg-slate-50 transition-colors"><td class="px-6 py-4"><div class="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold border border-amber-200"><i data-lucide="trophy" class="w-4 h-4"></i></div></td><td class="px-6 py-4"><p class="font-bold text-slate-800">Budi Santoso</p><p class="text-xs text-slate-500">Divisi IT</p></td><td class="px-6 py-4 text-center"><span class="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-lg text-lg">4.85</span></td><td class="px-6 py-4"><span class="px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-sm">Star / Future Leader</span></td></tr><tr class="hover:bg-slate-50 transition-colors"><td class="px-6 py-4 font-bold text-slate-400 pl-8">2</td><td class="px-6 py-4"><p class="font-bold text-slate-800">Andi Dermawan</p><p class="text-xs text-slate-500">Divisi Keuangan</p></td><td class="px-6 py-4 text-center"><span class="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold rounded-lg text-lg">4.60</span></td><td class="px-6 py-4"><span class="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">High Performer</span></td></tr><tr class="hover:bg-slate-50 transition-colors"><td class="px-6 py-4 font-bold text-slate-400 pl-8">3</td><td class="px-6 py-4"><p class="font-bold text-slate-800">Siti Rahma</p><p class="text-xs text-slate-500">Divisi SDM</p></td><td class="px-6 py-4 text-center"><span class="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-extrabold rounded-lg text-lg">4.20</span></td><td class="px-6 py-4"><span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-200">Core Employee</span></td></tr></tbody></table></div></div>`
  },
  manajemenTalent: {
    file: 'laporan-9box.html', title: 'Talent 9-Box Matrix', role: 'manajemen',
    lofi: `<div class="wf-box"><div class="grid-3"><div class="wf-box" style="height:150px">7. Potential Gem</div><div class="wf-box" style="height:150px">8. High Potential</div><div class="wf-box" style="height:150px; border-width: 4px">9. Star (Budi)</div><div class="wf-box" style="height:150px">4. Inconsistent</div><div class="wf-box" style="height:150px">5. Core Employee (Siti)</div><div class="wf-box" style="height:150px">6. High Performer (Andi)</div><div class="wf-box" style="height:150px">1. Underperformer</div><div class="wf-box" style="height:150px">2. Effective</div><div class="wf-box" style="height:150px">3. Solid Professional</div></div></div>`,
    hifi: `<div class="glass rounded-2xl shadow-sm border border-slate-200 p-8 bg-white"><div class="flex items-center justify-between mb-8"><div><h2 class="text-2xl font-bold text-slate-800">9-Box Grid Mapping</h2><p class="text-slate-500 mt-1">Pemetaan Potensi vs Performa Karyawan</p></div><div class="flex gap-2"><span class="flex items-center gap-1 text-xs font-bold text-slate-500"><i data-lucide="arrow-up" class="w-4 h-4"></i> Potensi</span><span class="flex items-center gap-1 text-xs font-bold text-slate-500 ml-4">Performa <i data-lucide="arrow-right" class="w-4 h-4"></i></span></div></div><div class="grid grid-cols-3 gap-4 h-[600px]"><div class="rounded-xl border border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100 p-4 flex flex-col"><span class="inline-block bg-amber-200/60 text-amber-800 text-xs font-bold px-2 py-1 rounded w-fit mb-2">Box 7</span><h4 class="font-bold text-amber-900 text-lg">Potential Gem</h4><p class="text-xs text-amber-700 mt-1 flex-1">Potensi Tinggi, Performa Rendah</p></div><div class="rounded-xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 flex flex-col"><span class="inline-block bg-emerald-200/60 text-emerald-800 text-xs font-bold px-2 py-1 rounded w-fit mb-2">Box 8</span><h4 class="font-bold text-emerald-900 text-lg">High Potential</h4><p class="text-xs text-emerald-700 mt-1 flex-1">Potensi Tinggi, Performa Menengah</p></div><div class="rounded-xl border border-emerald-500 bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30 shadow-lg text-white p-4 flex flex-col transform scale-105 z-10"><span class="inline-block bg-white/20 text-white border border-white/30 text-xs font-bold px-2 py-1 rounded w-fit mb-2">Box 9</span><h4 class="font-extrabold text-white text-xl flex items-center gap-2">Star Leader <i data-lucide="sparkles" class="w-5 h-5 text-yellow-300"></i></h4><p class="text-xs text-emerald-100 mt-1 flex-1">Potensi & Performa Sangat Tinggi</p><div class="mt-4 bg-white/10 rounded-lg p-2"><div class="flex items-center gap-2"><div class="w-6 h-6 rounded-full bg-white text-emerald-600 flex items-center justify-center text-xs font-bold">BS</div><span class="text-sm font-semibold">Budi Santoso</span></div></div></div><div class="rounded-xl border border-rose-300 bg-gradient-to-br from-rose-50 to-rose-100 p-4 flex flex-col"><span class="inline-block bg-rose-200/60 text-rose-800 text-xs font-bold px-2 py-1 rounded w-fit mb-2">Box 4</span><h4 class="font-bold text-rose-900 text-lg">Inconsistent</h4><p class="text-xs text-rose-700 mt-1 flex-1">Potensi Menengah, Performa Rendah</p></div><div class="rounded-xl border border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 p-4 flex flex-col"><span class="inline-block bg-blue-200/60 text-blue-800 text-xs font-bold px-2 py-1 rounded w-fit mb-2">Box 5</span><h4 class="font-bold text-blue-900 text-lg">Core Employee</h4><p class="text-xs text-blue-700 mt-1 flex-1">Tulang Punggung Operasional</p><div class="mt-4 space-y-2"><div class="flex items-center gap-2 bg-white/50 rounded-lg p-1.5"><div class="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold">SR</div><span class="text-xs font-semibold text-slate-700">Siti Rahma</span></div></div></div><div class="rounded-xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 flex flex-col"><span class="inline-block bg-emerald-200/60 text-emerald-800 text-xs font-bold px-2 py-1 rounded w-fit mb-2">Box 6</span><h4 class="font-bold text-emerald-900 text-lg">High Performer</h4><p class="text-xs text-emerald-700 mt-1 flex-1">Performa Tinggi, Potensi Menengah</p><div class="mt-4 space-y-2"><div class="flex items-center gap-2 bg-white/50 rounded-lg p-1.5"><div class="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-bold">AD</div><span class="text-xs font-semibold text-slate-700">Andi Dermawan</span></div></div></div><div class="rounded-xl border border-rose-400 bg-gradient-to-br from-rose-100 to-rose-200 p-4 flex flex-col"><span class="inline-block bg-rose-300/60 text-rose-900 text-xs font-bold px-2 py-1 rounded w-fit mb-2">Box 1</span><h4 class="font-bold text-rose-900 text-lg">Underperformer</h4><p class="text-xs text-rose-800 mt-1 flex-1">Butuh Evaluasi Mendalam</p></div><div class="rounded-xl border border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100 p-4 flex flex-col"><span class="inline-block bg-amber-200/60 text-amber-800 text-xs font-bold px-2 py-1 rounded w-fit mb-2">Box 2</span><h4 class="font-bold text-amber-900 text-lg">Effective</h4><p class="text-xs text-amber-700 mt-1 flex-1">Potensi Rendah, Performa Menengah</p></div><div class="rounded-xl border border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100 p-4 flex flex-col"><span class="inline-block bg-blue-200/60 text-blue-800 text-xs font-bold px-2 py-1 rounded w-fit mb-2">Box 3</span><h4 class="font-bold text-blue-900 text-lg">Solid Pro</h4><p class="text-xs text-blue-700 mt-1 flex-1">Performa Tinggi, Potensi Rendah</p></div></div></div>`
  }
};

// Generate execution
Object.values(pagesConfig).forEach(page => {
  const lofiHtml = renderLoFiWrapper(page.title, page.role, page.file, page.lofi);
  const hifiHtml = renderHiFiWrapper(page.title, page.role, page.file, page.hifi);
  
  fs.writeFileSync(path.join(lofiDir, page.file), lofiHtml);
  fs.writeFileSync(path.join(hifiDir, page.file), hifiHtml);
  
  console.log(`Generated ${page.file} (Lo-Fi & Hi-Fi)`);
});

console.log("All files generated successfully.");
