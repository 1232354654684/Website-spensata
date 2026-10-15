import React, { useEffect, useRef, useState } from 'react';
import { Users, GraduationCap, School, Trophy, Sparkles } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';

interface StatCardProps {
  id: string;
  value: number;
  label: string;
  sublabel?: string;
  unit: string;
}

// Komponen kartu statistik tunggal yang dipakai ulang untuk keempat kartu
const StatCard: React.FC<StatCardProps> = ({ id, value, label, sublabel, unit }) => {
  const getIcon = () => {
    switch (id) {
      case 'students':
        return <Users className="w-6 h-6 text-[#0E4A6B] dark:text-[#5FB0DB]" />;
      case 'staff':
        return <GraduationCap className="w-6 h-6 text-[#0E4A6B] dark:text-[#5FB0DB]" />;
      case 'classes':
        return <School className="w-6 h-6 text-[#0E4A6B] dark:text-[#5FB0DB]" />;
      case 'extracurricular':
        return <Trophy className="w-6 h-6 text-[#0E4A6B] dark:text-[#5FB0DB]" />;
      default:
        return <Sparkles className="w-6 h-6 text-[#0E4A6B] dark:text-[#5FB0DB]" />;
    }
  };

  return (
    <div className="relative p-5 sm:p-6 rounded-2xl bg-sky-50/80 dark:bg-slate-800/60 border border-sky-100/90 dark:border-slate-700/60 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      {/* Icon & Unit Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-xs border border-sky-100/60 dark:border-slate-600/40">
          {getIcon()}
        </div>
        {unit && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-700 text-[#0E4A6B] dark:text-sky-300 border border-sky-100/80 dark:border-slate-600/60">
            {unit}
          </span>
        )}
      </div>

      {/* Number, Label, and Sublabel */}
      <div>
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-[#0E4A6B] dark:text-[#5FB0DB] mb-1.5">
          {value}
        </div>

        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
          {label}
        </h3>

        {sublabel && (
          <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
};

export const StatsCounter: React.FC = () => {
  const { data } = useSchoolData();
  const stats = data.statistik;
  const containerRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState<{ [key: string]: number }>({});
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!containerRef.current || stats.length === 0) return;

    // Cek preferensi reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const finalCounts: { [key: string]: number } = {};
      stats.forEach((s) => {
        finalCounts[s.id] = s.nilai;
      });
      setCounts(finalCounts);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const startTime = performance.now();
          const duration = 1600; // ms

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);

            const nextCounts: { [key: string]: number } = {};
            stats.forEach((stat) => {
              nextCounts[stat.id] = Math.round(stat.nilai * easeOutProgress);
            });

            setCounts(nextCounts);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated, stats]);

  if (stats.length === 0) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      aria-label="Sekolah dalam Angka"
      className="my-10 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5A823]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E4A6B] dark:text-[#E5A823]">
              Profil Sekolah dalam Angka
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Data Sekolah Terkini
          </h2>
        </div>
      </div>

      {/* Grid Kartu dengan gaya warna dan efek hover yang SAMA PERSIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            id={stat.id}
            value={counts[stat.id] ?? 0}
            label={stat.label}
            sublabel={stat.sublabel}
            unit={stat.satuan}
          />
        ))}
      </div>
    </section>
  );
};
