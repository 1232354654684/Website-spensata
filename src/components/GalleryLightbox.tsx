import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GaleriFotoItem } from '../types';

interface GalleryLightboxProps {
  item: GaleriFotoItem | null;
  items: GaleriFotoItem[];
  onClose: () => void;
  onNavigate: (newItem: GaleriFotoItem) => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  item,
  items,
  onClose,
  onNavigate
}) => {
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        const currentIndex = items.findIndex((i) => i.id === item.id);
        if (currentIndex > 0) {
          onNavigate(items[currentIndex - 1]);
        } else {
          onNavigate(items[items.length - 1]);
        }
      }
      if (e.key === 'ArrowRight') {
        const currentIndex = items.findIndex((i) => i.id === item.id);
        if (currentIndex < items.length - 1) {
          onNavigate(items[currentIndex + 1]);
        } else {
          onNavigate(items[0]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [item, items, onClose, onNavigate]);

  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);
  const title = item.judul || (item as any).title || '';
  const description = item.deskripsi || (item as any).description || '';
  const photoUrl = item.foto || (item as any).imageUrl || '';
  const category = item.kategori || (item as any).category || '';
  const date = item.tanggal || (item as any).date || '';

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      onNavigate(items[currentIndex - 1]);
    } else {
      onNavigate(items[items.length - 1]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < items.length - 1) {
      onNavigate(items[currentIndex + 1]);
    } else {
      onNavigate(items[0]);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md transition-opacity"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Tutup pratinjau"
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#E5A823] cursor-pointer"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      <button
        onClick={handlePrev}
        aria-label="Foto sebelumnya"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#E5A823] cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next button */}
      <button
        onClick={handleNext}
        aria-label="Foto berikutnya"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#E5A823] cursor-pointer"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] max-h-[68vh] overflow-hidden">
          <img
            src={photoUrl}
            alt={title}
            className="w-full h-full object-contain max-h-[68vh]"
          />
        </div>

        <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#E5A823] font-semibold mb-1">
              <span>{category}</span>
              <span aria-hidden="true">·</span>
              <span>{date}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">{title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">{description}</p>
          </div>
          <div className="text-xs text-slate-400 flex-shrink-0 self-start sm:self-auto">
            Foto {currentIndex + 1} dari {items.length}
          </div>
        </div>
      </div>
    </div>
  );
};
