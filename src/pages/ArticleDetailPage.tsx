import React, { useState } from 'react';
import {
  Calendar,
  User,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { BeritaItem } from '../types';
import { useSchoolData } from '../context/SchoolDataContext';

interface ArticleDetailPageProps {
  article: BeritaItem;
  onSelectArticle: (articleId: string) => void;
  onNavigateToArchive: () => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  article,
  onSelectArticle,
  onNavigateToArchive
}) => {
  const { data } = useSchoolData();
  const [copied, setCopied] = useState(false);

  const publishedArticles = data.berita.filter((b) => b.status === 'Terbit');

  const currentIndex = publishedArticles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? publishedArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex >= 0 && currentIndex < publishedArticles.length - 1
      ? publishedArticles[currentIndex + 1]
      : null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const otherArticles = publishedArticles.filter((a) => a.id !== article.id).slice(0, 3);

  const title = article.judul || (article as any).title || '';
  const excerpt = article.ringkasan || (article as any).excerpt || '';
  const content = article.isi || (article as any).content || [];
  const date = article.tanggal || (article as any).date || '';
  const author = article.penulis || (article as any).author || '';
  const category = article.kategori || (article as any).category || '';
  const coverImage = article.fotoSampul || (article as any).coverImage || '';

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      <Breadcrumb
        items={[
          { label: 'Tulisan & Berita', onClick: onNavigateToArchive },
          { label: title }
        ]}
      />

      {/* Article Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {/* Cover Image */}
        {coverImage && (
          <div className="relative aspect-[16/9] max-h-[460px] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover"
            />
            {category && (
              <div className="absolute top-4 left-4 bg-[#0E4A6B]/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-md">
                {category}
              </div>
            )}
          </div>
        )}

        <div className="p-6 sm:p-10 space-y-6">
          {/* Metadata */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{date}</span>
              </span>
            )}
            {author && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Oleh {author}</span>
                </span>
              </>
            )}

          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-[1.2] tracking-tight">
            {title}
          </h1>

          {/* Lead Excerpt */}
          {excerpt && (
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed border-l-4 border-[#0E4A6B] dark:border-[#E5A823] pl-4 italic bg-slate-50 dark:bg-slate-800/40 py-2 rounded-r-xl">
              {excerpt}
            </p>
          )}

          {/* Body Content */}
          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed pt-2">
            {Array.isArray(content) ? (
              content.map((paragraph, index) => <p key={index}>{paragraph}</p>)
            ) : (
              <p>{content}</p>
            )}
          </div>

          {/* Share & Actions Bar */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Tautan Disalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>Salin Tautan Artikel</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Prev / Next Article Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevArticle ? (
          <button
            onClick={() => onSelectArticle(prevArticle.id)}
            className="text-left p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#0E4A6B] dark:hover:border-[#E5A823] shadow-sm transition-all group cursor-pointer"
          >
            <span className="flex items-center gap-1 text-xs font-bold text-slate-400 mb-1">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Tulisan Sebelumnya</span>
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#0E4A6B] dark:group-hover:text-[#E5A823] transition-colors">
              {prevArticle.judul}
            </h4>
          </button>
        ) : (
          <div />
        )}

        {nextArticle ? (
          <button
            onClick={() => onSelectArticle(nextArticle.id)}
            className="text-right p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#0E4A6B] dark:hover:border-[#E5A823] shadow-sm transition-all group ml-auto w-full cursor-pointer"
          >
            <span className="flex items-center justify-end gap-1 text-xs font-bold text-slate-400 mb-1">
              <span>Tulisan Berikutnya</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#0E4A6B] dark:group-hover:text-[#E5A823] transition-colors">
              {nextArticle.judul}
            </h4>
          </button>
        ) : (
          <div />
        )}
      </div>

      {/* Rekomendasi Tulisan Lain */}
      {otherArticles.length > 0 && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Tulisan Lainnya dari {data.identitas.nama || 'SMP Negeri 1 Tambak'}
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {otherArticles.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectArticle(item.id)}
                className="py-3.5 flex items-center justify-between cursor-pointer group transition-colors"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0E4A6B] dark:group-hover:text-[#E5A823] transition-colors">
                    {item.judul}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span>{item.tanggal.split(' ')[0]}</span>
                    <span>·</span>
                    <span>{item.penulis}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-4" />
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
