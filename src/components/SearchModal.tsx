import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, FileText, Video, ArrowRight, BookOpen } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { sortNewsByNewest, formatNewsDisplayDate } from '../utils/dateHelper';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToArticle: (articleId: string) => void;
  onNavigateToPage: (pageId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToArticle,
  onNavigateToPage
}) => {
  const { data } = useSchoolData();
  const [query, setQuery] = useState('');

  // Handle ESC shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter items
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { articles: [], photos: [], videos: [], pages: [] };

    const publishedArticles = data.berita.filter((b) => b.status === 'Terbit');

    const filteredArticles = sortNewsByNewest(
      publishedArticles.filter(
        (a) =>
          (a.judul && a.judul.toLowerCase().includes(q)) ||
          (a.ringkasan && a.ringkasan.toLowerCase().includes(q)) ||
          (Array.isArray(a.tag) && a.tag.some((t) => t.toLowerCase().includes(q)))
      )
    );

    const filteredPhotos = data.galeriFoto.filter(
      (p) =>
        (p.judul && p.judul.toLowerCase().includes(q)) ||
        (p.deskripsi && p.deskripsi.toLowerCase().includes(q)) ||
        (p.kategori && p.kategori.toLowerCase().includes(q))
    );

    const filteredVideos = data.galeriVideo.filter(
      (v) =>
        (v.judul && v.judul.toLowerCase().includes(q)) ||
        (v.deskripsi && v.deskripsi.toLowerCase().includes(q))
    );

    const staticPages = [
      { id: 'profil', title: 'Profil Sekolah & Sejarah', desc: 'Identitas, Kepala Sekolah, Sarana' },
      { id: 'visi-misi', title: 'Visi dan Misi', desc: 'Arah dan komitmen pendidikan SPENSATA' },
      { id: 'e-learning', title: 'Portal E-Learning Pijar', desc: 'Akses Pijar Guru & Pijar Siswa' },
      { id: 'hubungi-kami', title: 'Hubungi Kami & Lokasi', desc: 'Kontak, Peta dan Layanan TU' }
    ].filter((p) => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));

    return {
      articles: filteredArticles,
      photos: filteredPhotos,
      videos: filteredVideos,
      pages: staticPages
    };
  }, [query, data]);

  const totalResults =
    results.articles.length +
    results.photos.length +
    results.videos.length +
    results.pages.length;

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari berita, foto, video, informasi..."
            className="w-full py-4 px-3 text-slate-900 dark:text-white bg-transparent focus:outline-none text-base sm:text-lg placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm font-medium">Ketik kata kunci untuk mulai mencari.</p>
              <p className="text-xs mt-1 text-slate-400">Contoh: "SPECTRA", "SPMB", "Pramuka", "Pijar", "Kepala Sekolah"</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-10 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm font-semibold">Tidak ditemukan hasil untuk "{query}"</p>
              <p className="text-xs mt-1">Coba gunakan kata kunci umum lainnya.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Pages */}
              {results.pages.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Halaman Utama
                  </h4>
                  <div className="space-y-1.5">
                    {results.pages.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onNavigateToPage(p.id);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <BookOpen className="w-4 h-4 text-[#0E4A6B] dark:text-[#E5A823]" />
                          <div>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#0E4A6B] dark:group-hover:text-[#E5A823]">
                              {p.title}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 block">
                              {p.desc}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles */}
              {results.articles.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Tulisan & Berita ({results.articles.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.articles.map((art) => (
                      <button
                        key={art.id}
                        onClick={() => {
                          onNavigateToArticle(art.slug || art.id);
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-start justify-between group transition-colors gap-3 cursor-pointer"
                      >
                        <div className="flex items-start gap-2.5">
                          <FileText className="w-4 h-4 text-[#0E4A6B] dark:text-[#E5A823] mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#0E4A6B] dark:group-hover:text-[#E5A823] line-clamp-1">
                              {art.judul}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              <span>{formatNewsDisplayDate(art)}</span>
                              <span aria-hidden="true">·</span>
                              <span>{art.penulis}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Photos */}
              {results.photos.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Galeri Foto ({results.photos.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {results.photos.map((ph) => (
                      <button
                        key={ph.id}
                        onClick={() => {
                          onNavigateToPage('galeri-foto');
                          onClose();
                        }}
                        className="text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors group cursor-pointer"
                      >
                        <img
                          src={ph.foto}
                          alt={ph.judul}
                          className="w-12 h-10 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="overflow-hidden">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-[#0E4A6B] dark:group-hover:text-[#E5A823]">
                            {ph.judul}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">{ph.kategori}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {results.videos.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Video Sekolah ({results.videos.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.videos.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          onNavigateToPage('galeri-video');
                          onClose();
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Video className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#0E4A6B] dark:group-hover:text-[#E5A823]">
                            {v.judul}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">{v.durasi}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Gunakan kata kunci bahasa Indonesia</span>
          <span>Tekan ESC untuk menutup</span>
        </div>
      </div>
    </div>
  );
};
