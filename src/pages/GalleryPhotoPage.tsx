import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Camera,
  ExternalLink,
  Search,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { useSchoolData } from '../context/SchoolDataContext';
import { GaleriAlbumItem } from '../types';

interface GalleryPhotoPageProps {
  onOpenLightbox?: (item: any) => void;
}

export const GalleryPhotoPage: React.FC<GalleryPhotoPageProps> = () => {
  const { data } = useSchoolData();
  const albums: GaleriAlbumItem[] = data.galeri || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('Semua');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Lightbox State
  const [lightboxState, setLightboxState] = useState<{
    album: GaleriAlbumItem;
    photoIndex: number;
  } | null>(null);

  // Touch tracking for mobile swipe in Lightbox
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const markFailed = (url: string) => {
    setFailedImages((prev) => {
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  };

  // Extract unique years from album.tanggal
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    albums.forEach((alb) => {
      if (alb.tanggal) {
        const match = alb.tanggal.match(/\b(20\d\d)\b/);
        if (match) {
          yearsSet.add(match[1]);
        }
      }
    });
    const sorted = Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
    return ['Semua', ...sorted];
  }, [albums]);

  // Filtered albums by search query and year
  const filteredAlbums = useMemo(() => {
    return albums.filter((alb) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        alb.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (alb.deskripsi && alb.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesYear =
        selectedYear === 'Semua' || (alb.tanggal && alb.tanggal.includes(selectedYear));

      return matchesSearch && matchesYear;
    });
  }, [albums, searchQuery, selectedYear]);

  // Handle keyboard events for Lightbox
  useEffect(() => {
    if (!lightboxState) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxState(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      } else if (e.key === 'ArrowRight') {
        handleNextPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxState]);

  const handlePrevPhoto = () => {
    if (!lightboxState || !lightboxState.album.daftarFoto) return;
    const total = lightboxState.album.daftarFoto.length;
    if (total <= 1) return;
    setLightboxState((prev) => {
      if (!prev) return null;
      const nextIndex = (prev.photoIndex - 1 + total) % total;
      return { ...prev, photoIndex: nextIndex };
    });
  };

  const handleNextPhoto = () => {
    if (!lightboxState || !lightboxState.album.daftarFoto) return;
    const total = lightboxState.album.daftarFoto.length;
    if (total <= 1) return;
    setLightboxState((prev) => {
      if (!prev) return null;
      const nextIndex = (prev.photoIndex + 1) % total;
      return { ...prev, photoIndex: nextIndex };
    });
  };

  // Mobile touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped left -> next
      handleNextPhoto();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev
      handlePrevPhoto();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Breadcrumb items={[{ label: 'Galeri', href: '#galeri-foto' }, { label: 'Galeri Foto' }]} />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0E4A6B] to-[#12587e] dark:from-[#0E4A6B]/90 dark:to-[#0A3550] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E5A823] uppercase tracking-wider">
            <Camera className="w-4 h-4" />
            <span>Dokumentasi Resmi Sekolah di Google Foto</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Galeri Foto {data.identitas.singkatan || data.identitas.nama || 'SPENSATA'}
          </h1>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
            Koleksi album foto rekam jejak kegiatan belajar mengajar, lomba, pembinaan karakter, dan karya siswa {data.identitas.nama || 'SMP Negeri 1 Tambak'}.
          </p>
        </div>
      </div>

      {/* Search and Year Filter */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul album kegiatan..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E4A6B] dark:focus:ring-[#E5A823]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Year Filter Tabs */}
        {availableYears.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap hidden sm:inline">
              Tahun:
            </span>
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedYear === year
                    ? 'bg-[#0E4A6B] text-white dark:bg-[#E5A823] dark:text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {year === 'Semua' ? 'Semua Tahun' : year}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Album Cards Grid: 3 cols on desktop, 2 on tablet, 1 on mobile */}
      {filteredAlbums.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-slate-400 text-sm space-y-2">
          <ImageIcon className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="font-semibold text-slate-600 dark:text-slate-300">
            Tidak ada album foto yang ditemukan.
          </p>
          <p className="text-xs text-slate-400">
            {searchQuery || selectedYear !== 'Semua'
              ? 'Coba ganti kata kunci pencarian atau pilih tahun lain.'
              : 'Belum ada album yang ditambahkan di koleksi galeri.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => {
            const hasCover = Boolean(album.linkSampul && album.linkSampul.trim() !== '');
            const isCoverBroken = album.linkSampul ? failedImages.has(album.linkSampul) : false;
            const hasPhotos = Boolean(album.daftarFoto && album.daftarFoto.length > 0);

            return (
              <article
                key={album.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Cover Image Area */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {hasCover && !isCoverBroken ? (
                      <img
                        src={album.linkSampul}
                        alt={album.judul}
                        loading="lazy"
                        onError={() => album.linkSampul && markFailed(album.linkSampul)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : isCoverBroken ? (
                      <div className="w-full h-full bg-[#0E4A6B]/90 text-white flex flex-col items-center justify-center p-4 text-center">
                        <AlertCircle className="w-8 h-8 text-[#E5A823] mb-1.5" />
                        <span className="text-xs font-semibold text-slate-100">
                          Foto tidak dapat dimuat
                        </span>
                      </div>
                    ) : (
                      /* Placeholder berlatar warna tema sekolah dengan ikon foto */
                      <div className="w-full h-full bg-gradient-to-br from-[#0E4A6B] to-[#12587e] dark:from-[#0E4A6B] dark:to-[#0A3550] text-white flex flex-col items-center justify-center p-4 text-center relative">
                        <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm mb-2 shadow-inner">
                          <Camera className="w-7 h-7 text-[#E5A823]" />
                        </div>
                        <span className="text-xs font-bold tracking-wider text-slate-100 uppercase">
                          {data.identitas.singkatan || 'SPENSATA'}
                        </span>
                        <span className="text-[11px] text-slate-300 mt-0.5">
                          Album Google Foto
                        </span>
                      </div>
                    )}

                    {/* Photo count badge if available */}
                    {hasPhotos && (
                      <div className="absolute top-3 right-3 bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
                        <ImageIcon className="w-3.5 h-3.5 text-[#E5A823]" />
                        <span>{album.daftarFoto!.length} Foto</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    {/* Date */}
                    {album.tanggal && (
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-[#E5A823]" />
                        <span>{album.tanggal}</span>
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#0E4A6B] dark:group-hover:text-[#E5A823] transition-colors">
                      {album.judul}
                    </h2>

                    {/* Short Description */}
                    {album.deskripsi && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {album.deskripsi}
                      </p>
                    )}

                    {/* Thumbnail Photo Grid (if daftarFoto is filled) */}
                    {hasPhotos && (
                      <div className="pt-2">
                        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                          <span>Pratinjau Foto</span>
                          <span className="text-[10px] text-slate-400">Klik untuk perbesar</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {album.daftarFoto!.slice(0, 3).map((fotoUrl, idx) => {
                            const isPhotoBroken = failedImages.has(fotoUrl);
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setLightboxState({ album, photoIndex: idx })}
                                className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:opacity-90 hover:scale-105 transition cursor-pointer"
                                title="Klik untuk membuka lightbox"
                              >
                                {isPhotoBroken ? (
                                  <div className="w-full h-full bg-[#0E4A6B]/80 flex flex-col items-center justify-center p-1 text-[9px] text-white text-center leading-tight">
                                    <AlertCircle className="w-3.5 h-3.5 text-[#E5A823] mb-0.5" />
                                    <span>Gagal</span>
                                  </div>
                                ) : (
                                  <img
                                    src={fotoUrl}
                                    alt={`${album.judul} - foto ${idx + 1}`}
                                    loading="lazy"
                                    onError={() => markFailed(fotoUrl)}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                                {idx === 2 && album.daftarFoto!.length > 3 && (
                                  <div className="absolute inset-0 bg-slate-950/70 text-white font-bold text-xs flex items-center justify-center">
                                    +{album.daftarFoto!.length - 3}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action: Button to open album on Google Photos */}
                <div className="p-5 pt-0 mt-2 space-y-2">
                  <a
                    href={album.linkAlbum}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E4A6B] hover:bg-[#0a3852] dark:bg-[#E5A823] dark:hover:bg-[#d49818] text-white dark:text-slate-950 text-xs sm:text-sm font-bold shadow-sm transition cursor-pointer"
                  >
                    <span>Lihat Album di Google Foto</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {hasPhotos && (
                    <button
                      type="button"
                      onClick={() => setLightboxState({ album, photoIndex: 0 })}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0E4A6B] dark:hover:text-[#E5A823] transition cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Buka Galeri Foto ({album.daftarFoto!.length} Foto)</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal (for daftarFoto) */}
      {lightboxState && lightboxState.album.daftarFoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-200"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar */}
          <div className="p-4 sm:p-6 flex items-center justify-between text-white border-b border-slate-800 bg-slate-950/60 z-20">
            <div className="space-y-0.5 max-w-[75%]">
              <h3 className="text-sm sm:text-base font-bold truncate">
                {lightboxState.album.judul}
              </h3>
              <p className="text-xs text-slate-400">
                Foto {lightboxState.photoIndex + 1} dari{' '}
                {lightboxState.album.daftarFoto.length}
                {lightboxState.album.tanggal ? ` · ${lightboxState.album.tanggal}` : ''}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={lightboxState.album.linkAlbum}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition"
              >
                <span>Album Google Foto</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setLightboxState(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="Tutup (Esc)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Photo Area */}
          <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
            {/* Left Prev Button */}
            {lightboxState.album.daftarFoto.length > 1 && (
              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 sm:left-6 z-20 p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white transition border border-slate-700/80 shadow-lg cursor-pointer"
                title="Foto Sebelumnya (Panah Kiri)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Current Image */}
            <div className="max-w-4xl max-h-[75vh] w-full h-full flex items-center justify-center">
              {failedImages.has(lightboxState.album.daftarFoto[lightboxState.photoIndex]) ? (
                <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center max-w-sm space-y-3">
                  <AlertCircle className="w-10 h-10 text-[#E5A823] mx-auto" />
                  <p className="text-sm font-semibold text-white">Foto tidak dapat dimuat</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tautan gambar Google Foto tidak dapat diakses secara langsung. Anda dapat melihat album lengkap di Google Foto.
                  </p>
                  <a
                    href={lightboxState.album.linkAlbum}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#E5A823] hover:underline font-bold"
                  >
                    <span>Buka di Google Foto</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <img
                  src={lightboxState.album.daftarFoto[lightboxState.photoIndex]}
                  alt={`${lightboxState.album.judul} - foto ${lightboxState.photoIndex + 1}`}
                  loading="lazy"
                  onError={() =>
                    markFailed(lightboxState.album.daftarFoto![lightboxState.photoIndex])
                  }
                  className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
                />
              )}
            </div>

            {/* Right Next Button */}
            {lightboxState.album.daftarFoto.length > 1 && (
              <button
                onClick={handleNextPhoto}
                className="absolute right-2 sm:right-6 z-20 p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white transition border border-slate-700/80 shadow-lg cursor-pointer"
                title="Foto Selanjutnya (Panah Kanan)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {lightboxState.album.daftarFoto.length > 1 && (
            <div className="p-3 sm:p-4 bg-slate-950/70 border-t border-slate-800 z-20">
              <div className="max-w-3xl mx-auto flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none">
                {lightboxState.album.daftarFoto.map((fotoUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setLightboxState((prev) => (prev ? { ...prev, photoIndex: idx } : null))
                    }
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      lightboxState.photoIndex === idx
                        ? 'border-[#E5A823] scale-105 opacity-100'
                        : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img
                      src={fotoUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
