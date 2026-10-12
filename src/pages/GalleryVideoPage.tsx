import React from 'react';
import { Video, Youtube, ExternalLink } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { VIDEO_GALLERY, SCHOOL_INFO } from '../data/schoolData';

export const GalleryVideoPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Breadcrumb items={[{ label: 'Galeri', href: '#galeri-foto' }, { label: 'Galeri Video' }]} />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0E4A6B] to-[#12587e] dark:from-[#0E4A6B]/90 dark:to-[#0A3550] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E5A823] uppercase tracking-wider">
            <Video className="w-4 h-4" />
            <span>Kanal Multimedia SPENSATA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Galeri Video Sekolah
          </h1>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
            Saksikan tayangan visual kegiatan belajar, pertunjukan seni P5, perkemahan pramuka, dan profil sekolah langsung melalui saluran resmi kami.
          </p>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {VIDEO_GALLERY.map((video) => (
          <div
            key={video.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col"
          >
            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                title={video.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                  <span>Durasi: {video.duration}</span>
                  <span>·</span>
                  <span>Tahun {video.date}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {video.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {video.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <a
                  href={video.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
                >
                  <Youtube className="w-4 h-4 fill-current" />
                  <span>Buka di YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA subscribe channel */}
      <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Ingin melihat lebih banyak tayangan kegiatan?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kunjungi saluran resmi @spensata di YouTube untuk arsip video upacara, ekstrakurikuler, dan pentas seni.
          </p>
        </div>

        <a
          href={SCHOOL_INFO.socialMedia.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-colors"
        >
          <Youtube className="w-4 h-4" />
          <span>Kunjungi Kanal YouTube</span>
        </a>
      </div>
    </div>
  );
};
