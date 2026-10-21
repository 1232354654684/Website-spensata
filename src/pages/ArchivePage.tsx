import React, { useState, useMemo } from 'react';
import { Newspaper, Calendar, ArrowRight, User, Search } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { useSchoolData } from '../context/SchoolDataContext';
import { sortNewsByNewest, formatNewsDisplayDate } from '../utils/dateHelper';

interface ArchivePageProps {
  onSelectArticle: (articleId: string) => void;
}

export const ArchivePage: React.FC<ArchivePageProps> = ({ onSelectArticle }) => {
  const { data } = useSchoolData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Hanya tampilkan berita yang berstatus Terbit
  const publishedArticles = useMemo(() => {
    return data.berita.filter((b) => b.status === 'Terbit');
  }, [data.berita]);

  const categories = useMemo(() => {
    const list = Array.from(new Set(publishedArticles.map((a) => a.kategori).filter(Boolean)));
    return ['Semua', ...list];
  }, [publishedArticles]);

  // Urutkan artikel dari yang paling baru ke terlama secara descending
  const sortedArticles = useMemo(() => {
    return sortNewsByNewest(publishedArticles);
  }, [publishedArticles]);

  const filteredArticles = useMemo(() => {
    return sortedArticles.filter((art) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (art.judul && art.judul.toLowerCase().includes(q)) ||
        (art.ringkasan && art.ringkasan.toLowerCase().includes(q));
      const matchesCategory =
        selectedCategory === 'Semua' || art.kategori === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [sortedArticles, searchQuery, selectedCategory]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Breadcrumb items={[{ label: 'Semua Berita & Publikasi' }]} />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0E4A6B] to-[#12587e] dark:from-[#0E4A6B]/90 dark:to-[#0A3550] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E5A823] uppercase tracking-wider">
            <Newspaper className="w-4 h-4" />
            <span>Warta & Informasi Sekolah</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Semua Berita & Publikasi
          </h1>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
            Daftar lengkap publikasi kegiatan, pengumuman resmi, dan artikel pendidikan {data.identitas.nama || 'SMP Negeri 1 Tambak'}.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0E4A6B] text-white dark:bg-[#E5A823] dark:text-slate-950 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul berita..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E4A6B] dark:focus:ring-[#E5A823]"
          />
        </div>
      </div>

      {/* Article Listing */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Daftar Berita ({filteredArticles.length} Tulisan)
          </h2>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="text-sm">Tidak ada tulisan yang cocok dengan pencarian Anda.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => onSelectArticle(art.slug || art.id)}
                className="py-5 cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-[#0E4A6B] dark:text-[#E5A823]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatNewsDisplayDate(art)}</span>
                    </span>
                    {art.penulis && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span>{art.penulis}</span>
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0E4A6B] dark:group-hover:text-[#E5A823] transition-colors leading-snug">
                    {art.judul}
                  </h3>

                  {art.ringkasan && (
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                      {art.ringkasan}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0 self-end sm:self-center">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 group-hover:bg-[#0E4A6B] group-hover:text-white dark:group-hover:bg-[#E5A823] dark:group-hover:text-slate-950 flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
