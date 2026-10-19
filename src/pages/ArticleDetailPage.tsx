import React, { useState, useEffect } from 'react';
import {
  Calendar,
  User,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Copy
} from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { BeritaItem } from '../types';
import { useSchoolData } from '../context/SchoolDataContext';

interface ArticleDetailPageProps {
  article: BeritaItem;
  onSelectArticle: (slugOrId: string) => void;
  onNavigateToArchive: () => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  article,
  onSelectArticle,
  onNavigateToArchive
}) => {
  const { data } = useSchoolData();
  const [copied, setCopied] = useState(false);

  const title = article.judul || (article as any).title || '';
  const excerpt = article.ringkasan || (article as any).excerpt || '';
  const content = article.isi || (article as any).content || [];
  const date = article.tanggal || (article as any).date || '';
  const author = article.penulis || (article as any).author || '';
  const category = article.kategori || (article as any).category || '';
  const coverImage = article.fotoSampul || (article as any).coverImage || '';
  const slug = article.slug || article.id;

  // Update document.title saat halaman detail berita dibuka, kembalikan saat unmount
  useEffect(() => {
    const originalTitle = document.title;
    const schoolName = data.identitas.nama || 'SMP Negeri 1 Tambak';
    if (title) {
      document.title = `${title} - ${schoolName}`;
    }
    return () => {
      document.title = originalTitle;
    };
  }, [title, data.identitas.nama]);

  const publishedArticles = data.berita.filter((b) => b.status === 'Terbit');

  const currentIndex = publishedArticles.findIndex((a) => a.id === article.id || a.slug === article.slug);
  const prevArticle = currentIndex > 0 ? publishedArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex >= 0 && currentIndex < publishedArticles.length - 1
      ? publishedArticles[currentIndex + 1]
      : null;

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/berita/${slug}`
    : `/berita/${slug}`;

  const fallbackCopy = (text: string) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy text', e);
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        })
        .catch(() => fallbackCopy(shareUrl));
    } else {
      fallbackCopy(shareUrl);
    }
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`;

  const otherArticles = publishedArticles.filter((a) => a.id !== article.id && a.slug !== article.slug).slice(0, 3);

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
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2.5">
            {/* Tombol Salin Tautan */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
              title="Salin tautan artikel ini"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Tautan Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Salin Tautan</span>
                </>
              )}
            </button>

            {/* Tombol Bagikan ke WhatsApp */}
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              title="Bagikan artikel ini ke WhatsApp"
            >
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Bagikan ke WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Prev / Next Article Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevArticle ? (
          <button
            onClick={() => onSelectArticle(prevArticle.slug || prevArticle.id)}
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
            onClick={() => onSelectArticle(nextArticle.slug || nextArticle.id)}
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
                onClick={() => onSelectArticle(item.slug || item.id)}
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
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
