import React from 'react';
import {
  Building2,
  Award,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { SCHOOL_INFO, SCHOOL_VISION_MISSION } from '../data/schoolData';

export const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <Breadcrumb items={[{ label: 'Profil Sekolah' }]} />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#0E4A6B] to-[#12587e] dark:from-[#0E4A6B]/90 dark:to-[#0A3550] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E5A823] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Satuan Pendidikan Pelaksana Program Sekolah Penggerak</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Profil SMP Negeri 1 Tambak
          </h1>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
            Berkarakter Kuat, Berprestasi Hebat. Membentuk generasi penerus bangsa yang unggul, religius, berbudaya lingkungan, dan cakap dalam era digital.
          </p>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* Sambutan Kepala Sekolah */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 text-center">
            <div className="relative w-36 h-36 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-[#0E4A6B] dark:ring-[#E5A823] shadow-lg">
              <img
                src={SCHOOL_INFO.headmaster.photoUrl}
                alt={SCHOOL_INFO.headmaster.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {SCHOOL_INFO.headmaster.name}
            </h3>
            <p className="text-xs font-bold text-[#0E4A6B] dark:text-[#E5A823] mt-1">
              {SCHOOL_INFO.headmaster.role}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">NIP: {SCHOOL_INFO.headmaster.nip}</p>
          </div>

          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-6 bg-[#E5A823] rounded-full" />
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Sambutan Kepala Sekolah
              </h2>
            </div>

            <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {SCHOOL_INFO.headmaster.welcomeSpeech.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Identitas Resmi Sekolah */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Building2 className="w-6 h-6 text-[#0E4A6B] dark:text-[#E5A823]" />
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Identitas Resmi Satuan Pendidikan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Nama Sekolah
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
                {SCHOOL_INFO.name}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Slogan & Motto
              </span>
              <span className="text-base font-bold text-[#0E4A6B] dark:text-[#E5A823] mt-0.5 block">
                "{SCHOOL_INFO.slogan}"
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Nomor Pokok Sekolah Nasional (NPSN)
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
                {SCHOOL_INFO.npsn}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Status Akreditasi
              </span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{SCHOOL_INFO.akreditasi}</span>
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Program Unggulan Nasional
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#E5A823]" />
                <span>{SCHOOL_INFO.program}</span>
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Waktu Pembelajaran
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>{SCHOOL_INFO.waktuBelajar}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah Singkat Sekolah */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#0E4A6B] dark:text-[#E5A823]" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Sejarah Sekolah
            </h2>
          </div>
          <span className="text-xs text-slate-400 italic">
            * GANTI DENGAN DATA ASLI bila ada SK terbaru
          </span>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {SCHOOL_VISION_MISSION.sejarah.uraian.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Sarana & Prasarana */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="w-2 h-6 bg-[#0E4A6B] dark:bg-[#E5A823] rounded-full" />
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sarana dan Fasilitas Pendukung
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SCHOOL_VISION_MISSION.saranaPrasarana.map((sarana, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-[#0E4A6B]/10 dark:bg-[#E5A823]/10 text-[#0E4A6B] dark:text-[#E5A823] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {sarana.nama}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {sarana.jumlah}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
