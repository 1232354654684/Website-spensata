import React from 'react';
import {
  Laptop,
  GraduationCap,
  Users,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  FileCheck,
  Calendar,
  BookOpen
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { useSchoolData } from '../context/SchoolDataContext';

export const ELearningPage: React.FC = () => {
  const { data } = useSchoolData();
  const { elearning, identitas } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <Breadcrumb items={[{ label: 'E-Learning' }]} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0E4A6B] to-[#12587e] dark:from-[#0E4A6B]/90 dark:to-[#0A3550] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E5A823] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{identitas.program || 'Digitalisasi Pendidikan · Sekolah Penggerak'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Portal E-Learning Pijar Sekolah
          </h1>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
            Sistem pembelajaran dan manajemen akademik terpadu {identitas.nama || 'SMP Negeri 1 Tambak'}. Akses materi, penugasan, presensi, dan penilaian secara efisien dalam satu pintu.
          </p>
        </div>
      </div>

      {/* 2 Big Cards: Pijar Guru & Pijar Siswa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pijar Guru */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0E4A6B]/5 dark:bg-[#E5A823]/5 rounded-bl-full pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0E4A6B] text-white flex items-center justify-center shadow-md">
                <Users className="w-7 h-7 text-[#E5A823]" />
              </div>
              {elearning.guru.label && (
                <span className="text-xs font-bold text-[#0E4A6B] dark:text-[#E5A823] bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {elearning.guru.label}
                </span>
              )}
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {elearning.guru.nama || 'Pijar Guru (SIM Sekolah)'}
            </h2>

            {elearning.guru.deskripsi && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {elearning.guru.deskripsi}
              </p>
            )}

            {Array.isArray(elearning.guru.fitur) && elearning.guru.fitur.length > 0 && (
              <div className="mt-6 space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Fitur Utama Pendidik:
                </span>
                {elearning.guru.fitur.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <a
              href={elearning.guru.tautan || 'https://sim.pijarsekolah.id/login'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#0E4A6B] hover:bg-[#0a3550] text-white font-bold text-sm shadow-lg shadow-[#0E4A6B]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Masuk sebagai Guru</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Gunakan NIP / Akun SIM Pijar resmi dari admin sekolah
            </p>
          </div>
        </div>

        {/* Pijar Siswa */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5A823]/10 rounded-bl-full pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#E5A823] text-slate-950 flex items-center justify-center shadow-md">
                <GraduationCap className="w-7 h-7 text-slate-950" />
              </div>
              {elearning.siswa.label && (
                <span className="text-xs font-bold text-slate-700 dark:text-[#E5A823] bg-amber-50 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {elearning.siswa.label}
                </span>
              )}
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {elearning.siswa.nama || 'Pijar Siswa'}
            </h2>

            {elearning.siswa.deskripsi && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {elearning.siswa.deskripsi}
              </p>
            )}

            {Array.isArray(elearning.siswa.fitur) && elearning.siswa.fitur.length > 0 && (
              <div className="mt-6 space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Fitur Utama Murid:
                </span>
                {elearning.siswa.fitur.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-[#E5A823] mt-0.5 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <a
              href={elearning.siswa.tautan || 'https://siswa.pijarsekolah.id/login'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#E5A823] hover:bg-[#d89c1a] text-slate-950 font-bold text-sm shadow-lg shadow-[#E5A823]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Masuk sebagai Murid</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Gunakan NISN dan kata sandi yang telah dibagikan wali kelas
            </p>
          </div>
        </div>
      </div>

      {/* Ekosistem Teknologi & SPECTRA */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Laptop className="w-6 h-6 text-[#0E4A6B] dark:text-[#E5A823]" />
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Digitalisasi Pendidikan di {identitas.nama || 'SMP Negeri 1 Tambak'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#0E4A6B]/10 dark:bg-[#E5A823]/10 text-[#0E4A6B] dark:text-[#E5A823] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">Pijar Sekolah</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Platform e-learning berbasis cloud yang mendukung konten belajar multimedia, ujian daring CBT, dan bank soal terverifikasi kurikulum nasional.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#0E4A6B]/10 dark:bg-[#E5A823]/10 text-[#0E4A6B] dark:text-[#E5A823] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">Aplikasi SPECTRA</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Sistem manajemen terintegrasi sekolah untuk monitoring presensi digital, tata kelola berkas guru, dan komunikasi orang tua.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#0E4A6B]/10 dark:bg-[#E5A823]/10 text-[#0E4A6B] dark:text-[#E5A823] flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">Kurikulum Merdeka</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Mendukung asesmen diagnostik, formatif, dan sumatif dengan laporan rapor capaian kompetensi yang transparan.
            </p>
          </div>
        </div>

        {/* Bantuan Teknis */}
        {identitas.email && (
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 flex items-start gap-3.5">
            <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                Kendala Login atau Lupa Kata Sandi?
              </span>
              Silakan hubungi Tim IT / Helpdesk Laboratorium Komputer {identitas.nama || 'SMP Negeri 1 Tambak'} pada jam kerja sekolah atau kirim email ke{' '}
              <a href={`mailto:${identitas.email}`} className="font-semibold underline text-[#0E4A6B] dark:text-[#E5A823]">
                {identitas.email}
              </a>
              .
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
