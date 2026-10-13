import React, { useState } from 'react';
import {
  Camera,
  ExternalLink,
  Calendar,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { GaleriAlbumItem } from '../types';

interface GaleriAlbumCardProps {
  album: GaleriAlbumItem;
  schoolShortName?: string;
  onOpenPhoto?: (album: GaleriAlbumItem, photoIndex: number) => void;
}

export const GaleriAlbumCard: React.FC<GaleriAlbumCardProps> = ({
  album,
  schoolShortName = 'SPENSATA',
  onOpenPhoto
}) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const markFailed = (url: string) => {
    setFailedImages((prev) => {
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  };

  const hasCover = Boolean(album.linkSampul && album.linkSampul.trim() !== '');
  const isCoverBroken = album.linkSampul ? failedImages.has(album.linkSampul) : false;
  const hasPhotos = Boolean(album.daftarFoto && album.daftarFoto.length > 0);

  return (
    <article className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* Sampul Album */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
          {hasCover && !isCoverBroken ? (
            <img
              src={album.linkSampul}
              alt={album.judul}
              referrerPolicy="no-referrer"
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
            /* Placeholder tema sekolah dengan ikon foto jika linkSampul kosong */
            <div className="w-full h-full bg-gradient-to-br from-[#0E4A6B] to-[#12587e] dark:from-[#0E4A6B] dark:to-[#0A3550] text-white flex flex-col items-center justify-center p-4 text-center relative">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm mb-2 shadow-inner">
                <Camera className="w-7 h-7 text-[#E5A823]" />
              </div>
              <span className="text-xs font-bold tracking-wider text-slate-100 uppercase">
                {schoolShortName}
              </span>
              <span className="text-[11px] text-slate-300 mt-0.5">
                Album Google Foto
              </span>
            </div>
          )}

          {/* Badge jumlah foto jika daftarFoto terisi */}
          {hasPhotos && (
            <div className="absolute top-3 right-3 bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
              <ImageIcon className="w-3.5 h-3.5 text-[#E5A823]" />
              <span>{album.daftarFoto!.length} Foto</span>
            </div>
          )}
        </div>

        {/* Isi Kartu */}
        <div className="p-5 space-y-3">
          {/* Tanggal kegiatan */}
          {album.tanggal && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-[#E5A823]" />
              <span>{album.tanggal}</span>
            </div>
          )}

          {/* Judul Album */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#0E4A6B] dark:group-hover:text-[#E5A823] transition-colors line-clamp-2">
            {album.judul}
          </h3>

          {/* Deskripsi Singkat */}
          {album.deskripsi && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {album.deskripsi}
            </p>
          )}

          {/* Pratinjau Foto jika daftarFoto tersedia */}
          {hasPhotos && (
            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Pratinjau Foto</span>
                {onOpenPhoto && (
                  <span className="text-[10px] text-slate-400">Klik untuk perbesar</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {album.daftarFoto!.slice(0, 3).map((fotoUrl, idx) => {
                  const isPhotoBroken = failedImages.has(fotoUrl);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onOpenPhoto && onOpenPhoto(album, idx)}
                      disabled={!onOpenPhoto}
                      className={`relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition ${
                        onOpenPhoto
                          ? 'hover:opacity-90 hover:scale-105 cursor-pointer'
                          : 'cursor-default'
                      }`}
                      title={onOpenPhoto ? 'Klik untuk memperbesar foto' : album.judul}
                    >
                      {isPhotoBroken ? (
                        <div className="w-full h-full bg-[#0E4A6B]/80 flex flex-col items-center justify-center p-1 text-[9px] text-white text-center leading-tight">
                          <AlertCircle className="w-3.5 h-3.5 text-[#E5A823] mb-0.5" />
                          <span>Foto gagal</span>
                        </div>
                      ) : (
                        <img
                          src={fotoUrl}
                          alt={`${album.judul} - foto ${idx + 1}`}
                          referrerPolicy="no-referrer"
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

      {/* Tombol Aksi */}
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

        {hasPhotos && onOpenPhoto && (
          <button
            type="button"
            onClick={() => onOpenPhoto(album, 0)}
            className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0E4A6B] dark:hover:text-[#E5A823] transition cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Lihat Pratinjau ({album.daftarFoto!.length} Foto)</span>
          </button>
        )}
      </div>
    </article>
  );
};
