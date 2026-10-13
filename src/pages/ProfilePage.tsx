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
import { useSchoolData } from '../context/SchoolDataContext';

export const ProfilePage: React.FC = () => {
  const { data } = useSchoolData();

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <Breadcrumb items={[{ label: 'Profil Sekolah' }]} />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#0E4A6B] to-[#12587e] dark:from-[#0E4A6B]/90 dark:to-[#0A3550] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          {data.identitas.program && (
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E5A823] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>{data.identitas.program}</span>
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Profil {data.identitas.nama || 'SMP Negeri 1 Tambak'}
          </h1>
          {data.identitas.slogan && (
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
              "{data.identitas.slogan}"
            </p>
          )}
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* Sambutan Kepala Sekolah */}
      {data.kepalaSekolah.nama && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4 text-center">
              <div className="relative w-36 h-36 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-[#0E4A6B] dark:ring-[#E5A823] shadow-lg">
                <img
                  src={data.kepalaSekolah.foto}
                  alt={data.kepalaSekolah.nama}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {data.kepalaSekolah.nama}
              </h3>
              <p className="text-xs font-bold text-[#0E4A6B] dark:text-[#E5A823] mt-1">
                {data.kepalaSekolah.jabatan}
              </p>
              {data.kepalaSekolah.nip && (
                <p className="text-[11px] text-slate-400 mt-0.5">NIP: {data.kepalaSekolah.nip}</p>
              )}
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-6 bg-[#E5A823] rounded-full" />
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Sambutan Kepala Sekolah
                </h2>
              </div>

              <div className="space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {Array.isArray(data.kepalaSekolah.sambutanLengkap) &&
                data.kepalaSekolah.sambutanLengkap.length > 0 ? (
                  data.kepalaSekolah.sambutanLengkap.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                ) : (
                  <p>{data.kepalaSekolah.sambutanSingkat}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Identitas Resmi Sekolah */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Building2 className="w-6 h-6 text-[#0E4A6B] dark:text-[#E5A823]" />
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Identitas Resmi Satuan Pendidikan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm">
          {data.identitas.nama && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Nama Sekolah
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {data.identitas.nama}
                </span>
              </div>
            </div>
          )}

          {data.identitas.slogan && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Slogan & Motto
                </span>
                <span className="text-base font-bold text-[#0E4A6B] dark:text-[#E5A823] mt-0.5 block">
                  "{data.identitas.slogan}"
                </span>
              </div>
            </div>
          )}

          {data.identitas.npsn && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Nomor Pokok Sekolah Nasional (NPSN)
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {data.identitas.npsn}
                </span>
              </div>
            </div>
          )}

          {data.identitas.akreditasi && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Status Akreditasi
                </span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{data.identitas.akreditasi}</span>
                </span>
              </div>
            </div>
          )}

          {data.identitas.program && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Program Unggulan
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#E5A823]" />
                  <span>{data.identitas.program}</span>
                </span>
              </div>
            </div>
          )}

          {data.identitas.waktuBelajar && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Waktu Pembelajaran
                </span>
                <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>{data.identitas.waktuBelajar}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sejarah Singkat Sekolah */}
      {Array.isArray(data.sejarah.uraian) && data.sejarah.uraian.length > 0 && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#0E4A6B] dark:text-[#E5A823]" />
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Sejarah Sekolah
              </h2>
            </div>
            {data.sejarah.tahunBerdiri && (
              <span className="text-xs text-slate-400">
                Didirikan Tahun {data.sejarah.tahunBerdiri}
              </span>
            )}
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {data.sejarah.uraian.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* Sarana & Prasarana */}
      {data.sarana.length > 0 && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="w-2 h-6 bg-[#0E4A6B] dark:bg-[#E5A823] rounded-full" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Sarana dan Fasilitas Pendukung
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.sarana.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0E4A6B]/10 dark:bg-[#E5A823]/10 text-[#0E4A6B] dark:text-[#E5A823] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.nama}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.keterangan}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
