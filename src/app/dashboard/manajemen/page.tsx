"use client";

import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";

const radarData = [
  { subject: "Amanah", self: 4.2, others: 4.5, fullMark: 5 },
  { subject: "Kompeten", self: 4.0, others: 4.3, fullMark: 5 },
  { subject: "Harmonis", self: 4.5, others: 4.1, fullMark: 5 },
  { subject: "Loyal", self: 4.8, others: 4.6, fullMark: 5 },
  { subject: "Adaptif", self: 3.9, others: 4.0, fullMark: 5 },
  { subject: "Kolaboratif", self: 4.4, others: 4.7, fullMark: 5 },
];

const barData = [
  { name: "Amanah", IDP: 15, Talent: 85 },
  { name: "Kompeten", IDP: 40, Talent: 60 },
  { name: "Harmonis", IDP: 20, Talent: 80 },
  { name: "Loyal", IDP: 10, Talent: 90 },
  { name: "Adaptif", IDP: 45, Talent: 55 },
  { name: "Kolaboratif", IDP: 25, Talent: 75 },
];

export default function ManajemenDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Executive Dashboard</h1>
        <p className="text-slate-500 mt-1">Ringkasan Analitik Penilaian AKHLAK 360° - Semester 1 2026</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Rata-rata Skor AKHLAK", value: "4.35", detail: "+0.15 dari Sem. lalu" },
          { title: "Karyawan Dinilai", value: "1,240", detail: "100% Partisipasi" },
          { title: "Masuk Radar Talent", value: "40%", detail: "496 Karyawan" },
          { title: "Butuh IDP", value: "60%", detail: "744 Karyawan" }
        ].map((card, idx) => (
          <div key={idx} className="card p-6 border-t-4 border-t-teal-400 hover:shadow-lg transition-shadow duration-300">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{card.title}</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">{card.value}</h3>
            <p className="text-xs font-medium text-teal-600 mt-2">{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="card p-6 flex flex-col hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Pemetaan Core Values Perusahaan</h2>
          <div className="flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#94a3b8' }} />
                <Radar name="Penilaian Orang Lain (Others)" dataKey="others" stroke="#0ea5e9" fill="#3b82f6" fillOpacity={0.5} />
                <Radar name="Penilaian Diri (Self)" dataKey="self" stroke="#14b8a6" fill="#2dd4bf" fillOpacity={0.3} />
                <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="card p-6 flex flex-col hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Distribusi Rekomendasi (IDP vs Talent)</h2>
          <div className="flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                <Bar name="Individual Dev. Plan (%)" dataKey="IDP" stackId="a" fill="#f59e0b" radius={[0, 0, 4, 4]} />
                <Bar name="Talent Mapping (%)" dataKey="Talent" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
