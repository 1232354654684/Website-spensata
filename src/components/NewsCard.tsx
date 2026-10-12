import React from 'react';
import { Calendar, User, Eye, ArrowUpRight } from 'lucide-react';
import { Article } from '../types';

interface NewsCardProps {
  article: Article;
  onSelect: (articleId: string) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, onSelect }) => {
  return (
    <article
      onClick={() => onSelect(article.id)}
      className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={article.coverImage}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 left-3 bg-[#0E4A6B]/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-sm">
          {article.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tanggal */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Calendar className="w-3.5 h-3.5 text-[#0E4A6B] dark:text-[#E5A823]" />
            <span className="font-semibold">{article.date.split(' ')[0]}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0E4A6B] dark:group-hover:text-[#E5A823] transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>

          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Action Link */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#0E4A6B] dark:text-[#E5A823]">
          <span>Baca Selengkapnya</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </article>
  );
};
