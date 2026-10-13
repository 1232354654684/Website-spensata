import React, { useMemo, useState, useEffect } from 'react';
import {
  Youtube,
  ExternalLink,
  ChevronRight,
  Play,
  BellRing,
  Camera,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { HeroSlider } from '../components/HeroSlider';
import { StatsCounter } from '../components/StatsCounter';
import { NewsCard } from '../components/NewsCard';
import { GaleriAlbumCard } from '../components/GaleriAlbumCard';
import { useSchoolData } from '../context/SchoolDataContext';
import { dataService } from '../services/dataService';
import { GaleriAlbumItem, GaleriFotoItem } from '../types';

/**
 * KONFIGURASI JUMLAH BERITA TERBARU DI BERANDA
 * Ubah nilai variabel ini untuk mengatur berapa banyak berita yang ditampilkan di Beranda
 */
export const JUMLAH_BERITA_BERANDA = 4;

interface HomePageProps {
  onNavigate: (pageId: string) => void;
  onSelectArticle: (articleId: string) => void;
  onOpenLightbox: (item: GaleriFotoItem) => void;
  onNavigateToAllNews: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectArticle,
  onOpenLightbox,
  onNavigateToAllNews
}) => {
  const { data } = useSchoolData();

  // Real-time Firestore onSnapshot listener untuk koleksi 'galeri'
  const [galeriAlbums, setGaleriAlbums] = useState<GaleriAlbumItem[]>(() => data.galeri || []);
  const [galeriLoading, setGaleriLoading] = useState<boolean>(!data.galeri || data.galeri.length === 0);
  const [galeriError, setGaleriError] = useState<string | null>(null);

  useEffect(() => {
    // Sinkronisasi real-time memakai dataService.subscribeGaleri yang sama dengan halaman Galeri Foto
    const unsubscribe = dataService.subscribeGaleri(
      (albums) => {
        setGaleriAlbums(albums);
        setGaleriError(null);
        setGaleriLoading(false);
      },
      (err) => {
        console.error('Error fetching galeri on HomePage:', err);
        setGaleriError(err?.message || 'Gagal memuat dokumentasi galeri foto.');
        setGaleriLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Urutkan dari tanggal terbaru dan batasi tampilkan 6 album/foto terbaru saja
  const latestGaleriAlbums = useMemo(() => {
    return galeriAlbums.slice(0, 6);
  }, [galeriAlbums]);

  // Helper untuk mendapatkan ID YouTube dari URL
  const getYouTubeId = (url: string) => {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : '';
  };

  // Urutkan berita dari tanggal terbaru ke terlama, lalu batasi dengan JUMLAH_BERITA_BERANDA
  // Hanya tampilkan berita berstatus 'Terbit'
  const latestArticles = useMemo(() => {
    const published = data.berita.filter((b) => b.status === 'Terbit');

    const parseArticleDate = (dateStr: string) => {
      if (!dateStr) return 0;
      const [datePart = '', timePart = '00:00'] = dateStr.split(' ');
      const [day = 1, month = 1, year = 2026] = datePart.split('/').map(Number);
      const [hour = 0, min = 0] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hour, min).getTime();
    };

    return [...published]
      .sort((a, b) => parseArticleDate(b.tanggal) - parseArticleDate(a.tanggal))
      .slice(0, JUMLAH_BERITA_BERANDA);
  }, [data.berita]);

  // Cari artikel maklumat atau gunakan artikel terbitan pertama
  const maklumatArticle = useMemo(() => {
    const published = data.berita.filter((b) => b.status === 'Terbit');
    return (
      published.find((b) => b.judul.toLowerCase().includes('maklumat')) ||
      published[0] ||
      null
    );
  }, [data.berita]);

  return (
    <div className="space-y-12">
      {/* 1. Hero Carousel (Full Width) */}
      <HeroSlider onNavigate={onNavigate} />

      {/* 2. Maklumat / Notice Banner (Full Width) */}
      {maklumatArticle && (
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
                {maklumatArticle.ringkasan || data.identitas.slogan}
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectArticle(maklumatArticle.id)}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors border border-white/20 self-start sm:self-auto cursor-pointer"
          >
            <span>Baca Maklumat</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </section>
      )}

      {/* 3. Sambutan Kepala Sekolah (Full Width) */}
      {data.kepalaSekolah.nama && (
        <section
          aria-labelledby="sambutan-kepsek-heading"
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            <div className="flex-shrink-0 text-center">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden ring-4 ring-[#0E4A6B] dark:ring-[#E5A823] shadow-md">
                <img
                  src={data.kepalaSekolah.foto}
                  alt={data.kepalaSekolah.nama}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-2 leading-tight">
                {data.kepalaSekolah.nama}
              </h3>
              <span className="inline-block text-[11px] font-bold text-[#0E4A6B] dark:text-[#E5A823] bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full mt-1">
                {data.kepalaSekolah.jabatan}
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
                Selamat Datang di {data.identitas.nama || 'SMP Negeri 1 Tambak'}
              </h2>
              {data.kepalaSekolah.sambutanSingkat && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{data.kepalaSekolah.sambutanSingkat}"
                </p>
              )}
              <div className="pt-1">
                <button
                  onClick={() => onNavigate('profil')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#0E4A6B] dark:border-[#E5A823] text-[#0E4A6B] dark:text-[#E5A823] hover:bg-[#0E4A6B] hover:text-white dark:hover:bg-[#E5A823] dark:hover:text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>Baca Sambutan Lengkap & Profil</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Statistik "Sekolah dalam Angka" (Full Width) */}
      <StatsCounter />

      {/* 5. Section: Tulisan & Berita Terbaru (Full Width: 4 kolom desktop, 2 kolom tablet, 1 kolom mobile) */}
      {latestArticles.length > 0 && (
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
              Warta dan publikasi resmi terkini dari {data.identitas.nama || 'SMP Negeri 1 Tambak'}
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-sm font-bold shadow-sm hover:shadow-md transition-all group cursor-pointer"
            >
              <span>Lihat Semua Berita</span>
              <ChevronRight className="w-4 h-4 text-[#0E4A6B] dark:text-[#E5A823] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      )}

      {/* 6. Section: Video Kegiatan Sekolah (Full Width: 3 kolom desktop, 2 kolom tablet, 1 kolom mobile) */}
      {data.galeriVideo.length > 0 && (
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
            {data.mediaSosial.youtube && (
              <a
                href={data.mediaSosial.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Youtube className="w-4 h-4 fill-current" />
                <span>Kanal YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Grid 3 Video Sejajar di Desktop, 2 di Tablet, 1 di Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.galeriVideo.slice(0, 3).map((video) => {
              const ytid = getYouTubeId(video.tautanYouTube);
              const thumbUrl = `https://img.youtube.com/vi/${ytid}/hqdefault.jpg`;

              return (
                <div
                  key={video.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
                >
                  {/* Thumbnail dengan tombol Play */}
                  <a
                    href={video.tautanYouTube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-video bg-black overflow-hidden block"
                  >
                    <img
                      src={thumbUrl}
                      alt={video.judul}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/45 transition-colors flex items-center justify-center">
                      <span className="w-12 h-12 rounded-full bg-[#E5A823] text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </span>
                    </div>
                    {/* Durasi badge di thumbnail */}
                    {video.durasi && (
                      <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {video.durasi}
                      </span>
                    )}
                  </a>

                  {/* Konten Kartu */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                        <span>
                          {video.durasi ? `Durasi ${video.durasi}` : ''}
                          {video.tanggal ? ` · Tahun ${video.tanggal}` : ''}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#0E4A6B] dark:group-hover:text-[#E5A823] transition-colors line-clamp-2">
                        {video.judul}
                      </h3>

                      {video.deskripsi && (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                          {video.deskripsi}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <a
                        href={video.tautanYouTube}
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
              );
            })}
          </div>
        </section>
      )}

      {/* 7. Section: Dokumentasi & Galeri Foto (Sinkron dengan Koleksi Firestore 'galeri') */}
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
            className="text-xs sm:text-sm font-bold text-[#0E4A6B] dark:text-[#E5A823] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Lihat Semua Galeri</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {galeriLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-2.5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <Loader2 className="w-7 h-7 animate-spin text-[#0E4A6B] dark:text-[#E5A823]" />
            <span className="text-xs sm:text-sm font-medium">Memuat dokumentasi galeri terbaru...</span>
          </div>
        ) : galeriError ? (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm">Gagal memuat dokumentasi galeri</p>
              <p className="text-xs text-rose-500/80 leading-relaxed">{galeriError}</p>
            </div>
          </div>
        ) : latestGaleriAlbums.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-400 space-y-2.5 shadow-sm">
            <Camera className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="font-bold text-slate-700 dark:text-slate-200 text-base sm:text-lg">
              Belum ada dokumentasi
            </p>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Dokumentasi kegiatan dan album Google Foto akan tampil di sini saat ditambahkan oleh admin sekolah.
            </p>
          </div>
        ) : (
          /* Grid 3 kolom di desktop, 2 di tablet, 1 di HP */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestGaleriAlbums.map((album) => (
              <GaleriAlbumCard
                key={album.id}
                album={album}
                schoolShortName={data.identitas.singkatan || 'SPENSATA'}
                onOpenPhoto={(_alb, _photoIdx) => {
                  onNavigate('galeri-foto');
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
