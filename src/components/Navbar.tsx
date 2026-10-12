import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Moon,
  Sun,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';

interface NavbarProps {
  currentPage: string;
  onNavigate: (pageId: string) => void;
  onOpenSearch: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenSearch,
  isDarkMode,
  onToggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [galleryDropdownOpen, setGalleryDropdownOpen] = useState(false);
  const [elearningDropdownOpen, setElearningDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setGalleryDropdownOpen(false);
    setElearningDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* Main Navigation Bar */}
      <div
        className={`w-full transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border-b border-slate-200/80 dark:border-slate-800'
            : 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* School Logo & Title */}
            <div
              onClick={() => handleNavClick('beranda')}
              className="flex items-center gap-3.5 cursor-pointer group"
            >
              {/* Emblem Logo */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0E4A6B] to-[#0A3550] dark:from-[#5FB0DB] dark:to-[#0E4A6B] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
                <BookOpen className="w-6 h-6 text-[#E5A823]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-[#0E4A6B] dark:group-hover:text-[#E5A823] transition-colors leading-tight">
                    {SCHOOL_INFO.name}
                  </h1>
                </div>
                <p className="text-xs sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {SCHOOL_INFO.slogan}
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Beranda */}
              <button
                onClick={() => handleNavClick('beranda')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  currentPage === 'beranda'
                    ? 'text-[#0E4A6B] dark:text-[#E5A823] bg-slate-100 dark:bg-slate-800'
                    : 'text-slate-700 dark:text-slate-200 hover:text-[#0E4A6B] dark:hover:text-[#E5A823] hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                Beranda
              </button>

              {/* Profil Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setProfileDropdownOpen(true)}
                onMouseLeave={() => setProfileDropdownOpen(false)}
              >
                <button
                  onClick={() => handleNavClick('profil')}
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    currentPage === 'profil'
                      ? 'text-[#0E4A6B] dark:text-[#E5A823] bg-slate-100 dark:bg-slate-800'
                      : 'text-slate-700 dark:text-slate-200 hover:text-[#0E4A6B] dark:hover:text-[#E5A823] hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>Profil</span>
                  <ChevronDown className="w-4 h-4 opacity-70" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute top-full left-0 w-52 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => handleNavClick('profil')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0E4A6B] dark:hover:text-[#E5A823]"
                    >
                      Profil Sekolah
                    </button>
                    <button
                      onClick={() => handleNavClick('profil')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0E4A6B] dark:hover:text-[#E5A823]"
                    >
                      Identitas Resmi
                    </button>
                    <button
                      onClick={() => handleNavClick('profil')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0E4A6B] dark:hover:text-[#E5A823]"
                    >
                      Sejarah Sekolah
                    </button>
                    <button
                      onClick={() => handleNavClick('profil')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0E4A6B] dark:hover:text-[#E5A823]"
                    >
                      Sarana & Prasarana
                    </button>
                  </div>
                )}
              </div>

              {/* Visi dan Misi */}
              <button
                onClick={() => handleNavClick('visi-misi')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  currentPage === 'visi-misi'
                    ? 'text-[#0E4A6B] dark:text-[#E5A823] bg-slate-100 dark:bg-slate-800'
                    : 'text-slate-700 dark:text-slate-200 hover:text-[#0E4A6B] dark:hover:text-[#E5A823] hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                Visi dan Misi
              </button>

              {/* Galeri Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setGalleryDropdownOpen(true)}
                onMouseLeave={() => setGalleryDropdownOpen(false)}
              >
                <button
                  onClick={() => handleNavClick('galeri-foto')}
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    currentPage === 'galeri-foto' || currentPage === 'galeri-video'
                      ? 'text-[#0E4A6B] dark:text-[#E5A823] bg-slate-100 dark:bg-slate-800'
                      : 'text-slate-700 dark:text-slate-200 hover:text-[#0E4A6B] dark:hover:text-[#E5A823] hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>Galeri</span>
                  <ChevronDown className="w-4 h-4 opacity-70" />
                </button>

                {galleryDropdownOpen && (
                  <div className="absolute top-full left-0 w-44 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => handleNavClick('galeri-foto')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0E4A6B] dark:hover:text-[#E5A823]"
                    >
                      Galeri Foto
                    </button>
                    <button
                      onClick={() => handleNavClick('galeri-video')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0E4A6B] dark:hover:text-[#E5A823]"
                    >
                      Galeri Video
                    </button>
                  </div>
                )}
              </div>

              {/* E-Learning Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setElearningDropdownOpen(true)}
                onMouseLeave={() => setElearningDropdownOpen(false)}
              >
                <button
                  onClick={() => handleNavClick('e-learning')}
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    currentPage === 'e-learning'
                      ? 'text-[#0E4A6B] dark:text-[#E5A823] bg-slate-100 dark:bg-slate-800'
                      : 'text-slate-700 dark:text-slate-200 hover:text-[#0E4A6B] dark:hover:text-[#E5A823] hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>E-Learning</span>
                  <ChevronDown className="w-4 h-4 opacity-70" />
                </button>

                {elearningDropdownOpen && (
                  <div className="absolute top-full left-0 w-52 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => handleNavClick('e-learning')}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0E4A6B] dark:hover:text-[#E5A823]"
                    >
                      Beranda E-Learning
                    </button>
                    <a
                      href="https://sim.pijarsekolah.id/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0E4A6B] dark:hover:text-[#E5A823]"
                    >
                      <span>Pijar Guru</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                    <a
                      href="https://siswa.pijarsekolah.id/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0E4A6B] dark:hover:text-[#E5A823]"
                    >
                      <span>Pijar Siswa</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                )}
              </div>

              {/* Hubungi Kami */}
              <button
                onClick={() => handleNavClick('hubungi-kami')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  currentPage === 'hubungi-kami'
                    ? 'text-[#0E4A6B] dark:text-[#E5A823] bg-slate-100 dark:bg-slate-800'
                    : 'text-slate-700 dark:text-slate-200 hover:text-[#0E4A6B] dark:hover:text-[#E5A823] hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                Hubungi Kami
              </button>
            </nav>

            {/* Quick Utility Actions: Search & Theme & Mobile Hamburger */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={onOpenSearch}
                aria-label="Cari di website"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0E4A6B] dark:hover:text-[#E5A823] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0E4A6B]"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Cari</span>
                <kbd className="hidden sm:inline-block text-[10px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-400">
                  Ctrl+K
                </kbd>
              </button>

              {/* Dark / Light Mode Toggle */}
              <button
                onClick={onToggleTheme}
                aria-label={isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#0E4A6B] dark:hover:text-[#E5A823] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0E4A6B]"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-[#E5A823]" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
                className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0E4A6B]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-200">
            <button
              onClick={() => handleNavClick('beranda')}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm ${
                currentPage === 'beranda'
                  ? 'bg-[#0E4A6B] text-white dark:bg-[#E5A823] dark:text-slate-950'
                  : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Beranda
            </button>

            <button
              onClick={() => handleNavClick('profil')}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm ${
                currentPage === 'profil'
                  ? 'bg-[#0E4A6B] text-white dark:bg-[#E5A823] dark:text-slate-950'
                  : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Profil Sekolah
            </button>

            <button
              onClick={() => handleNavClick('visi-misi')}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm ${
                currentPage === 'visi-misi'
                  ? 'bg-[#0E4A6B] text-white dark:bg-[#E5A823] dark:text-slate-950'
                  : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Visi dan Misi
            </button>

            {/* Galeri accordion in mobile */}
            <div className="space-y-1 pl-2 border-l-2 border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-2 py-1">
                Galeri
              </span>
              <button
                onClick={() => handleNavClick('galeri-foto')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                  currentPage === 'galeri-foto'
                    ? 'text-[#0E4A6B] dark:text-[#E5A823] font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Galeri Foto
              </button>
              <button
                onClick={() => handleNavClick('galeri-video')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                  currentPage === 'galeri-video'
                    ? 'text-[#0E4A6B] dark:text-[#E5A823] font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Galeri Video
              </button>
            </div>

            {/* E-Learning in mobile */}
            <div className="space-y-1 pl-2 border-l-2 border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-2 py-1">
                E-Learning
              </span>
              <button
                onClick={() => handleNavClick('e-learning')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                  currentPage === 'e-learning'
                    ? 'text-[#0E4A6B] dark:text-[#E5A823] font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Beranda E-Learning
              </button>
              <a
                href="https://sim.pijarsekolah.id/login"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span>Pijar Guru (SIM)</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <a
                href="https://siswa.pijarsekolah.id/login"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span>Pijar Siswa</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>

            <button
              onClick={() => handleNavClick('hubungi-kami')}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-semibold text-sm ${
                currentPage === 'hubungi-kami'
                  ? 'bg-[#0E4A6B] text-white dark:bg-[#E5A823] dark:text-slate-950'
                  : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Hubungi Kami
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
