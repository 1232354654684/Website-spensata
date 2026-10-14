import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Camera,
  ExternalLink,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { GaleriAlbumCard } from '../components/GaleriAlbumCard';
import { useSchoolData } from '../context/SchoolDataContext';
import { dataService } from '../services/dataService';
import { GaleriAlbumItem } from '../types';

interface GalleryPhotoPageProps {
  onOpenLightbox?: (item: any) => void;
}

export const GalleryPhotoPage: React.FC<GalleryPhotoPageProps> = () => {
  const { data } = useSchoolData();

  // Sinkronisasi data real-time dengan koleksi Firestore 'galeri' menggunakan fungsi yang sama
  const [albums, setAlbums] = useState<GaleriAlbumItem[]>(() => data.galeri || []);
  const [loading, setLoading] = useState<boolean>(!data.galeri || data.galeri.length === 0);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('Semua');
  const [failedLightboxImages, setFailedLightboxImages] = useState<Set<string>>(new Set());

  // Lightbox State
  const [lightboxState, setLightboxState] = useState<{
    album: GaleriAlbumItem;
    photoIndex: number;
  } | null>(null);

  // Touch tracking for mobile swipe in Lightbox
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubscribe = dataService.subscribeGaleri(
      (items) => {
        setAlbums(items);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('Error in GalleryPhotoPage onSnapshot:', err);
        setError(err?.message || 'Gagal memuat album galeri foto dari database.');
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const markLightboxFailed = (url: string) => {
    setFailedLightboxImages((prev) => {
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
      return {
        ...prev,
        photoIndex: (prev.photoIndex - 1 + total) % total
      };
    });
  };

  const handleNextPhoto = () => {
    if (!lightboxState || !lightboxState.album.daftarFoto) return;
    const total = lightboxState.album.daftarFoto.length;
    if (total <= 1) return;
    setLightboxState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        photoIndex: (prev.photoIndex + 1) % total
      };
    });
  };

  // Mobile swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleNextPhoto();
    } else if (distance < -minSwipeDistance) {
      handlePrevPhoto();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <Breadcrumb
        items={[
          { label: 'Beranda', href: '#beranda' },
          { label: 'Galeri', href: '#galeri-foto' },
          { label: 'Galeri Foto' }
        ]}
      />

      {/* Header Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0E4A6B] via-[#0E4A6B]/95 to-slate-900 text-white p-6 sm:p-10 shadow-lg">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#E5A823]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A823]/20 border border-[#E5A823]/30 text-[#E5A823] text-xs font-bold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>Dokumentasi Resmi Sekolah</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Galeri Foto & Album Kegiatan
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
            Arsip dokumentasi visual beragam kegiatan akademik, perkemahan, upacara, dan prestasi
            peserta didik {data.identitas.nama}. Album lengkap tersimpan secara aman di
            Google Foto.
          </p>
        </div>
      </div>

      {/* Search and Year Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul album atau kegiatan..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E4A6B] dark:focus:ring-[#E5A823]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
              title="Hapus pencarian"
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

      {/* Loading & Error States */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-[#0E4A6B] dark:text-[#E5A823]" />
          <p className="text-sm font-medium">Memuat album galeri foto...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm">Gagal memuat galeri</p>
            <p className="text-xs text-rose-500/80 leading-relaxed">{error}</p>
          </div>
        </div>
      ) : filteredAlbums.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-slate-400 text-sm space-y-2.5 shadow-sm">
          <ImageIcon className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="font-bold text-slate-700 dark:text-slate-200 text-base">
            Tidak ada album foto yang ditemukan
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery || selectedYear !== 'Semua'
              ? 'Coba ganti kata kunci pencarian atau pilih filter tahun lain.'
              : 'Belum ada dokumentasi album yang tersimpan di database.'}
          </p>
        </div>
      ) : (
        /* Responsive Album Cards Grid: 3 cols on desktop, 2 on tablet, 1 on mobile */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlbums.map((album) => (
            <GaleriAlbumCard
              key={album.id}
              album={album}
              schoolShortName={data.identitas.singkatan || 'SPENSATA'}
              onOpenPhoto={(alb, idx) => {
                setLightboxState({ album: alb, photoIndex: idx });
              }}
            />
          ))}
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
              {failedLightboxImages.has(lightboxState.album.daftarFoto[lightboxState.photoIndex]) ? (
                <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center max-w-sm space-y-3">
                  <AlertCircle className="w-10 h-10 text-[#E5A823] mx-auto" />
                  <p className="text-sm font-semibold text-white">Foto tidak dapat dimuat</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tautan gambar Google Foto tidak dapat diakses langsung. Anda tetap dapat membuka album lengkap di Google Foto.
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
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={() =>
                    markLightboxFailed(lightboxState.album.daftarFoto![lightboxState.photoIndex])
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
                      referrerPolicy="no-referrer"
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
