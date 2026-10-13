import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';

interface HeroSliderProps {
  onNavigate: (pageId: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate }) => {
  const { data } = useSchoolData();
  const slides = data.heroSlides;
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const total = slides.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (total <= 1 || isHovered) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, total]);

  if (total === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % total);
  };

  const handleCtaClick = (targetHash: string) => {
    const page = (targetHash || '').replace('#', '');
    if (page) onNavigate(page);
  };

  return (
    <section
      aria-label="Sorotan Utama SMP Negeri 1 Tambak"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[500px] sm:h-[560px] md:h-[620px] rounded-3xl overflow-hidden shadow-xl border border-slate-200/50 dark:border-slate-800 bg-slate-900"
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.id || index}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Scale Animation */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={slide.gambar}
                alt={slide.judul}
                className={`w-full h-full object-cover transform transition-transform duration-[7000ms] ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-900/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E4A6B]/90 via-[#0E4A6B]/50 to-transparent" />

            {/* Content Container */}
            <div className="relative z-20 h-full max-w-6xl mx-auto px-6 sm:px-12 flex flex-col justify-end pb-16 sm:pb-20">
              <div className="max-w-2xl text-white space-y-4">
                {slide.badge && (
                  <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-[#E5A823]">
                    <span className="w-2 h-2 rounded-full bg-[#E5A823] animate-pulse" />
                    <span>{slide.badge}</span>
                  </div>
                )}

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
                  {slide.judul}
                </h1>

                {slide.subjudul && (
                  <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed max-w-xl font-normal">
                    {slide.subjudul}
                  </p>
                )}

                {/* CTA Buttons */}
                {(slide.teksTombolUtama || slide.teksTombolKedua) && (
                  <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                    {slide.teksTombolUtama && (
                      <button
                        onClick={() => handleCtaClick(slide.tautanTombolUtama || '#profil')}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#E5A823] hover:bg-[#d89c1a] text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-[#E5A823]/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E5A823] cursor-pointer"
                      >
                        <span>{slide.teksTombolUtama}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    {slide.teksTombolKedua && (
                      <button
                        onClick={() => handleCtaClick(slide.tautanTombolKedua || '#hubungi-kami')}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base backdrop-blur-md border border-white/20 hover:border-white/40 hover:-translate-y-0.5 active:translate-y-0 transition-all focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
                      >
                        <span>{slide.teksTombolKedua}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Prev / Next Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Slide sebelumnya"
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/40 hover:bg-slate-900/80 text-white backdrop-blur-md border border-white/10 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#E5A823] cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Slide berikutnya"
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/40 hover:bg-slate-900/80 text-white backdrop-blur-md border border-white/10 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#E5A823] cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Pindah ke slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                  i === current
                    ? 'w-8 bg-[#E5A823]'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
