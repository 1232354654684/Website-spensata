import React, { useState, useMemo } from 'react';
import { Camera, ZoomIn } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { PHOTO_GALLERY } from '../data/schoolData';
import { GalleryItem } from '../types';

interface GalleryPhotoPageProps {
  onOpenLightbox: (item: GalleryItem) => void;
}

export const GalleryPhotoPage: React.FC<GalleryPhotoPageProps> = ({ onOpenLightbox }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = useMemo(() => {
    const list = Array.from(new Set(PHOTO_GALLERY.map((p) => p.category)));
    return ['Semua', ...list];
  }, []);

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'Semua') return PHOTO_GALLERY;
    return PHOTO_GALLERY.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Breadcrumb items={[{ label: 'Galeri', href: '#galeri-foto' }, { label: 'Galeri Foto' }]} />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0E4A6B] to-[#12587e] dark:from-[#0E4A6B]/90 dark:to-[#0A3550] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E5A823] uppercase tracking-wider">
            <Camera className="w-4 h-4" />
            <span>Dokumentasi Resmi Sekolah</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Galeri Foto SPENSATA
          </h1>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
            Rekam jejak aktivitas pembelajaran, workshop digital, upacara kelulusan, dan pembinaan karakter di SMP Negeri 1 Tambak.
          </p>
        </div>
      </div>

      {/* Filter Tabs (Buttons with click handlers, anti-slop compliant) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#0E4A6B] text-white dark:bg-[#E5A823] dark:text-slate-950 shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
            }`}
          >
            {cat} {cat === 'Semua' ? `(${PHOTO_GALLERY.length})` : ''}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <article
            key={photo.id}
            onClick={() => onOpenLightbox(photo)}
            className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white">
                  <ZoomIn className="w-5 h-5" />
                </span>
              </div>
              <div className="absolute top-3 left-3 bg-[#0E4A6B]/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-sm">
                {photo.category}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-medium block mb-1">
                  {photo.date}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0E4A6B] dark:group-hover:text-[#E5A823] transition-colors leading-snug">
                  {photo.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  {photo.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-[#0E4A6B] dark:text-[#E5A823] flex items-center justify-between">
                <span>Perbesar Foto</span>
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
