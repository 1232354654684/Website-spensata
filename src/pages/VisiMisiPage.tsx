import React from 'react';
import { Target, Compass, Award, CheckCircle, Sparkles } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { SCHOOL_VISION_MISSION } from '../data/schoolData';

export const VisiMisiPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <Breadcrumb items={[{ label: 'Visi dan Misi' }]} />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0E4A6B] to-[#12587e] dark:from-[#0E4A6B]/90 dark:to-[#0A3550] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E5A823] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Arah Strategis & Fondasi Nilai</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Visi dan Misi Sekolah
          </h1>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
            Komitmen bersama seluruh civitas akademika SMP Negeri 1 Tambak dalam mengantarkan peserta didik menuju keunggulan masa depan.
          </p>
        </div>
      </div>

      {/* VISI */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Target className="w-6 h-6 text-[#E5A823]" />
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Visi Sekolah
          </h2>
        </div>

        {/* Vision Quote Callout */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border-l-4 border-[#0E4A6B] dark:border-[#E5A823]">
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed italic">
            "{SCHOOL_VISION_MISSION.visi}"
          </p>
        </div>

        {/* Indikator Visi */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
            Indikator Ketercapaian Visi:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-300">
            {SCHOOL_VISION_MISSION.visiIndikator.map((ind, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" />
                <span className="leading-snug">{ind}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISI */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Compass className="w-6 h-6 text-[#0E4A6B] dark:text-[#E5A823]" />
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Misi Sekolah
          </h2>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          Untuk mewujudkan visi tersebut di atas, SMP Negeri 1 Tambak melaksanakan misi-misi strategis berikut:
        </p>

        <ol className="space-y-4">
          {SCHOOL_VISION_MISSION.misi.map((misi, idx) => (
            <li
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start gap-4 transition-colors hover:border-[#0E4A6B]/30 dark:hover:border-[#E5A823]/30"
            >
              <div className="w-8 h-8 rounded-xl bg-[#0E4A6B] text-white dark:bg-[#E5A823] dark:text-slate-950 flex items-center justify-center font-extrabold text-sm flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {misi}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* TUJUAN */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Award className="w-6 h-6 text-[#E5A823]" />
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tujuan Pendidikan Sekolah
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SCHOOL_VISION_MISSION.tujuan.map((tuj, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-[#E5A823] mt-2 flex-shrink-0" />
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {tuj}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
