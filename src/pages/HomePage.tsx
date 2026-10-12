import React, { useMemo } from 'react';
import {
  Calendar,
  Eye,
  Youtube,
  ExternalLink,
  ChevronRight,
  Play,
  MessageSquare,
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

  const popularArticle = ARTICLES.find((a) => a.isPopular) || ARTICLES[5];

  return (
    <div className="space-y-12">
      {/* Hero Carousel */}
      <HeroSlider onNavigate={onNavigate} />

      {/* Maklumat / Notice Banner */}
      <section
        aria-label="Maklumat Resmi"
        className="bg-gradient-to-r from-[#0E4A6B] to-[#12587e] dark:from-[#0E4A6B]/80 dark:to-[#0A3550] text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/15 text-[#E5A823] flex items-center justify-center flex-shrink-0">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#E5A823] uppercase tracking-wide">
              Pengumuman & Maklumat Pelayanan
            </div>
            <p className="text-sm font-medium text-slate-100">
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

      {/* Statistik "Sekolah dalam Angka" */}
      <StatsCounter />

      {/* Section: Tulisan & Berita Terbaru (4 kolom desktop, 2 kolom tablet, 1 kolom mobile) */}
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

      {/* 2-Column Main Content & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* LEFT COLUMN: Galeri, Video (8 cols) */}
        <div className="lg:col-span-8 space-y-12">

          {/* Section: Galeri Foto Unggulan */}
          <section aria-labelledby="galeri-foto-heading">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#E5A823] rounded-full" />
                <h2
                  id="galeri-foto-heading"
                  className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                >
                  Dokumentasi & Galeri Foto
                </h2>
              </div>

              <button
                onClick={() => onNavigate('galeri-foto')}
                className="text-xs sm:text-sm font-bold text-[#0E4A6B] dark:text-[#E5A823] hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua Foto</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 6 Photo Tiles from attachment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                  
                  <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                    <span className="text-[11px] font-semibold text-[#E5A823] uppercase tracking-wider mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-[#E5A823] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Video Terbaru */}
          <section aria-labelledby="video-terbaru-heading">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full" />
                <h2
                  id="video-terbaru-heading"
                  className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                >
                  Video Kegiatan Sekolah
                </h2>
              </div>

              <a
                href={SCHOOL_INFO.socialMedia.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
              >
                <span>Kanal YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {VIDEO_GALLERY.map((video) => (
                <div
                  key={video.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col"
                >
                  {/* YouTube Player Embed */}
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

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Durasi: {video.duration} · Tahun {video.date}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {video.description}
                      </p>
                    </div>

                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Tonton Langsung di YouTube</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Card: Sambutan Kepala Sekolah */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-center">
            {/* Foto Kepala Sekolah */}
            <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-[#0E4A6B] dark:ring-[#E5A823] shadow-md">
              <img
                src={SCHOOL_INFO.headmaster.photoUrl}
                alt={SCHOOL_INFO.headmaster.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
              {SCHOOL_INFO.headmaster.name}
            </h3>
            <span className="inline-block text-xs font-bold text-[#0E4A6B] dark:text-[#E5A823] bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full mt-1.5 mb-3">
              {SCHOOL_INFO.headmaster.role}
            </span>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-left line-clamp-4 italic mb-4">
              "{SCHOOL_INFO.headmaster.welcomeShort}"
            </p>

            <button
              onClick={() => onNavigate('profil')}
              className="w-full py-2.5 px-4 rounded-xl border border-[#0E4A6B] dark:border-[#E5A823] text-[#0E4A6B] dark:text-[#E5A823] font-bold text-xs hover:bg-[#0E4A6B] hover:text-white dark:hover:bg-[#E5A823] dark:hover:text-slate-950 transition-colors"
            >
              Baca Sambutan Lengkap
            </button>
          </div>

          {/* Card: Paling Dikomentari */}
          {popularArticle && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-[#E5A823]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Paling Dikomentari
                </h3>
              </div>

              <div
                onClick={() => onSelectArticle(popularArticle.id)}
                className="group cursor-pointer space-y-2.5 pt-1"
              >
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={popularArticle.coverImage}
                    alt={popularArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0E4A6B] dark:group-hover:text-[#E5A823] transition-colors leading-snug">
                  {popularArticle.title}
                </h4>

                <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{popularArticle.date}</span>
                  </span>
                  <span>·</span>
                  <span className="truncate max-w-[130px]">{popularArticle.author}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-slate-400" />
                    <span>Dilihat {popularArticle.views} kali</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
