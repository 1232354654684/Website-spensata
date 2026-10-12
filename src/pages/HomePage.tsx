import React, { useMemo } from 'react';
import {
  Youtube,
  ExternalLink,
  ChevronRight,
  Play,
  BellRing
} from 'lucide-react';
import { HeroSlider } from '../components/HeroSlider';
import { StatsCounter } from '../components/StatsCounter';
import { NewsCard } from '../components/NewsCard';
import {
  SCHOOL_INFO,
  ARTICLES,
  PHOTO_GALLERY,
  VIDEO_GALLERY
} from '../data/schoolData';
import { GalleryItem } from '../types';

/**
 * KONFIGURASI JUMLAH BERITA TERBARU DI BERANDA
 * Ubah nilai variabel ini untuk mengatur berapa banyak berita yang ditampilkan di Beranda
 */
export const JUMLAH_BERITA_BERANDA = 4;

interface HomePageProps {
  onNavigate: (pageId: string) => void;
  onSelectArticle: (articleId: string) => void;
  onOpenLightbox: (item: GalleryItem) => void;
  onNavigateToAllNews: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectArticle,
  onOpenLightbox,
  onNavigateToAllNews
}) => {
  // Urutkan berita dari tanggal terbaru ke terlama, lalu batasi dengan JUMLAH_BERITA_BERANDA
  const latestArticles = useMemo(() => {
    const parseArticleDate = (dateStr: string) => {
      const [datePart, timePart = '00:00'] = dateStr.split(' ');
      const [day, month, year] = datePart.split('/').map(Number);
      const [hour, min] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hour, min).getTime();
    };

    return [...ARTICLES]
      .sort((a, b) => parseArticleDate(b.date) - parseArticleDate(a.date))
      .slice(0, JUMLAH_BERITA_BERANDA);
  }, []);

  return (
    <div className="space-y-12">
      {/* 1. Hero Carousel (Full Width) */}
      <HeroSlider onNavigate={onNavigate} />

      {/* 2. Maklumat / Notice Banner (Full Width) */}
      <section
        aria-label="Maklumat Resmi"
        className="bg-gradient-to-r from-[#0E4A6B] to-[#12587e] dark:from-[#0E4A6B]/80 dark:to-[#0A3550] text-white rounded-3xl p-5 sm:p-6 shadow-sm border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white/15 text-[#E5A823] flex items-center justify-center flex-shrink-0">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#E5A823] uppercase tracking-wide">
              Pengumuman & Maklumat Pelayanan
            </div>
            <p className="text-sm font-medium text-slate-100 mt-0.5">
              SMP Negeri 1 Tambak berkomitmen memberikan pelayanan publik yang transparan, bebas pungli, dan ramah anak.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectArticle('post-59')}
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors border border-white/20 self-start sm:self-auto"
        >
          <span>Baca Maklumat</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>

      {/* 3. Sambutan Kepala Sekolah (Full Width) */}
      <section
        aria-labelledby="sambutan-kepsek-heading"
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm"
      >
        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          <div className="flex-shrink-0 text-center">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden ring-4 ring-[#0E4A6B] dark:ring-[#E5A823] shadow-md">
              <img
                src={SCHOOL_INFO.headmaster.photoUrl}
                alt={SCHOOL_INFO.headmaster.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-2 leading-tight">
              {SCHOOL_INFO.headmaster.name}
            </h3>
            <span className="inline-block text-[11px] font-bold text-[#0E4A6B] dark:text-[#E5A823] bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full mt-1">
              {SCHOOL_INFO.headmaster.role}
            </span>
          </div>

          <div className="flex-1 space-y-2.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0E4A6B] dark:text-[#E5A823]">
              <span className="w-2 h-2 rounded-full bg-[#E5A823]" />
              <span>Sambutan Pimpinan Sekolah</span>
            </div>
            <h2
              id="sambutan-kepsek-heading"
              className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              Selamat Datang di SMP Negeri 1 Tambak
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "{SCHOOL_INFO.headmaster.welcomeShort}"
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate('profil')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#0E4A6B] dark:border-[#E5A823] text-[#0E4A6B] dark:text-[#E5A823] hover:bg-[#0E4A6B] hover:text-white dark:hover:bg-[#E5A823] dark:hover:text-slate-950 font-bold text-xs transition-colors"
              >
                <span>Baca Sambutan Lengkap & Profil</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Statistik "Sekolah dalam Angka" (Full Width) */}
      <StatsCounter />

      {/* 5. Section: Tulisan & Berita Terbaru (Full Width: 4 kolom desktop, 2 kolom tablet, 1 kolom mobile) */}
      <section aria-labelledby="tulisan-terbaru-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#0E4A6B] dark:bg-[#E5A823] rounded-full" />
            <h2
              id="tulisan-terbaru-heading"
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              Tulisan & Berita Terbaru
            </h2>
          </div>
          <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Warta dan publikasi resmi terkini dari SMP Negeri 1 Tambak
          </span>
        </div>

        {/* Grid: 4 kolom desktop (lg:grid-cols-4), 2 kolom tablet (md:grid-cols-2), 1 kolom mobile (grid-cols-1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestArticles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              onSelect={onSelectArticle}
            />
          ))}
        </div>

        {/* Tombol Lihat Semua Berita di bawah bagian itu */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={onNavigateToAllNews}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-sm font-bold shadow-sm hover:shadow-md transition-all group"
          >
            <span>Lihat Semua Berita</span>
            <ChevronRight className="w-4 h-4 text-[#0E4A6B] dark:text-[#E5A823] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 6. Section: Video Kegiatan Sekolah (Full Width: 3 kolom desktop, 2 kolom tablet, 1 kolom mobile) */}
      <section aria-labelledby="video-terbaru-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-red-600 rounded-full" />
            <h2
              id="video-terbaru-heading"
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              Video Kegiatan Sekolah
            </h2>
          </div>

          {/* Tombol Kanal YouTube tetap di kanan atas judul bagian */}
          <a
            href={SCHOOL_INFO.socialMedia.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Youtube className="w-4 h-4 fill-current" />
            <span>Kanal YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Grid 3 Video Sejajar di Desktop, 2 di Tablet, 1 di Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VIDEO_GALLERY.map((video) => (
            <div
              key={video.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Thumbnail dengan tombol Play */}
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-video bg-black overflow-hidden block"
              >
                <img
                  src={
                    video.thumbnailUrl ||
                    `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
                  }
                  alt={video.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/45 transition-colors flex items-center justify-center">
                  <span className="w-12 h-12 rounded-full bg-[#E5A823] text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </span>
                </div>
                {/* Durasi badge di thumbnail */}
                <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {video.duration}
                </span>
                {video.isSample && (
                  <span className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    Contoh
                  </span>
                )}
              </a>

              {/* Konten Kartu */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Durasi {video.duration} · Tahun {video.date}</span>
                    {video.isSample && (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                        (contoh, ganti dengan video asli)
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#0E4A6B] dark:group-hover:text-[#E5A823] transition-colors line-clamp-2">
                    {video.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
                  >
                    <Youtube className="w-4 h-4 fill-current" />
                    <span>Tonton di YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Section: Galeri Foto Unggulan (Full Width) */}
      <section aria-labelledby="galeri-foto-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#E5A823] rounded-full" />
            <h2
              id="galeri-foto-heading"
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              Dokumentasi & Galeri Foto
            </h2>
          </div>

          <button
            onClick={() => onNavigate('galeri-foto')}
            className="text-xs sm:text-sm font-bold text-[#0E4A6B] dark:text-[#E5A823] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Lihat Semua Foto</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Photo Tiles Full Width in 3-col on desktop, 2-col on tablet, 1-col on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PHOTO_GALLERY.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenLightbox(item)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <span className="text-[11px] font-semibold text-[#E5A823] uppercase tracking-wider mb-1">
                  {item.category}
                </span>
                <h3 className="text-base font-bold leading-snug line-clamp-2 group-hover:text-[#E5A823] transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
