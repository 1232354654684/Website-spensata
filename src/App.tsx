import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { SearchModal } from './components/SearchModal';
import { GalleryLightbox } from './components/GalleryLightbox';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { VisiMisiPage } from './pages/VisiMisiPage';
import { GalleryPhotoPage } from './pages/GalleryPhotoPage';
import { GalleryVideoPage } from './pages/GalleryVideoPage';
import { ELearningPage } from './pages/ELearningPage';
import { ContactPage } from './pages/ContactPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { ArchivePage } from './pages/ArchivePage';
import { AdminDashboard } from './admin/AdminDashboard';
import { FaviconManager } from './components/FaviconManager';
import { SchoolDataProvider, useSchoolData } from './context/SchoolDataContext';
import { GaleriFotoItem } from './types';

function AppContent() {
  const { data, isLoading } = useSchoolData();
  const [currentPage, setCurrentPage] = useState<string>('beranda');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string>('');
  const [lightboxItem, setLightboxItem] = useState<GaleriFotoItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spensata-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Dark mode class toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('spensata-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('spensata-theme', 'light');
    }
  }, [isDarkMode]);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Synchronize route with pathname (/berita/:slug) and hash routes (/#profil, /#berita, etc.)
  useEffect(() => {
    const syncRouteFromLocation = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.replace(/^#\/?/, '');

      // 1. Path format: /berita/:slug
      if (path.startsWith('/berita/')) {
        const rawSlug = decodeURIComponent(path.replace(/^\/berita\//, '').split('/')[0] || '').trim();
        if (rawSlug) {
          setSelectedArticleSlug(rawSlug);
          setCurrentPage('berita-detail');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      // 2. Backward compatibility: #berita/:id or #berita/:slug
      if (hash.startsWith('berita/')) {
        const legacyParam = decodeURIComponent(hash.replace(/^berita\//, '').split('/')[0] || '').trim();
        if (legacyParam) {
          setSelectedArticleSlug(legacyParam);
          setCurrentPage('berita-detail');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      // 3. Regular routes (admin, berita/arsip, beranda, profil, visi-misi, galeri-foto, galeri-video, e-learning, hubungi-kami)
      const targetRoute = hash || (path === '/' ? 'beranda' : path.replace(/^\//, ''));

      if (targetRoute === 'admin') {
        setCurrentPage('admin');
      } else if (targetRoute === 'berita' || targetRoute === 'arsip') {
        setCurrentPage('berita');
      } else if (
        [
          'beranda',
          'profil',
          'visi-misi',
          'galeri-foto',
          'galeri-video',
          'e-learning',
          'hubungi-kami'
        ].includes(targetRoute)
      ) {
        setCurrentPage(targetRoute);
      } else {
        if (path === '/' || !path) {
          setCurrentPage('beranda');
        } else if (path === '/berita' || path === '/arsip') {
          setCurrentPage('berita');
        } else {
          setCurrentPage('beranda');
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', syncRouteFromLocation);
    window.addEventListener('hashchange', syncRouteFromLocation);
    syncRouteFromLocation();

    return () => {
      window.removeEventListener('popstate', syncRouteFromLocation);
      window.removeEventListener('hashchange', syncRouteFromLocation);
    };
  }, []);

  const navigateTo = (pageId: string) => {
    if (pageId === 'beranda') {
      window.history.pushState(null, '', '/');
      setCurrentPage('beranda');
    } else if (pageId === 'berita' || pageId === 'arsip') {
      window.history.pushState(null, '', '/#berita');
      setCurrentPage('berita');
    } else if (pageId === 'admin') {
      window.history.pushState(null, '', '/#admin');
      setCurrentPage('admin');
    } else {
      window.history.pushState(null, '', `/#${pageId}`);
      setCurrentPage(pageId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (slugOrId: string) => {
    // Resolve slug if available
    const matched = data.berita.find(
      (a) =>
        a.slug === slugOrId ||
        a.id === slugOrId ||
        (a.slug && a.slug.toLowerCase() === slugOrId.toLowerCase())
    );
    const targetSlug = matched?.slug || slugOrId;

    window.history.pushState(null, '', `/berita/${targetSlug}`);
    setSelectedArticleSlug(targetSlug);
    setCurrentPage('berita-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const publishedArticles = data.berita.filter((b) => b.status === 'Terbit');
  const activeArticle = selectedArticleSlug
    ? publishedArticles.find(
        (a) =>
          a.slug === selectedArticleSlug ||
          a.id === selectedArticleSlug ||
          (a.slug && a.slug.toLowerCase() === selectedArticleSlug.toLowerCase())
      ) ||
      data.berita.find(
        (a) =>
          a.slug === selectedArticleSlug ||
          a.id === selectedArticleSlug ||
          (a.slug && a.slug.toLowerCase() === selectedArticleSlug.toLowerCase())
      )
    : null;

  // Otomatis arahkan tautan lama (#berita/:id atau /berita/:id) ke /berita/:slug bersih jika berita punya slug
  useEffect(() => {
    if (currentPage === 'berita-detail' && activeArticle) {
      const bestSlug = activeArticle.slug || activeArticle.id;
      const expectedPath = `/berita/${bestSlug}`;
      if (window.location.pathname !== expectedPath || window.location.hash) {
        window.history.replaceState(null, '', expectedPath);
      }
    }
  }, [currentPage, activeArticle]);

  // Admin route /#admin rendering
  if (currentPage === 'admin') {
    return <AdminDashboard />;
  }

  // Loading state saat data awal Firestore belum siap (tampilan minimalis tanpa teks)
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        {/* Logo sekolah dengan animasi berdenyut pelan */}
        <img
          src="/logo-sekolah.png"
          alt="SMP Negeri 1 Tambak"
          className="w-24 h-24 object-contain animate-logo-pulse select-none pointer-events-none"
        />

        {/* Garis progres tipis di bawah logo */}
        <div className="w-32 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-6 relative">
          <div className="h-full w-1/2 bg-[#0E4A6B] dark:bg-[#E5A823] rounded-full animate-progress-slide" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Sticky Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {currentPage === 'beranda' && (
          <HomePage
            onNavigate={navigateTo}
            onSelectArticle={handleSelectArticle}
            onOpenLightbox={(item) => setLightboxItem(item)}
            onNavigateToAllNews={() => navigateTo('berita')}
          />
        )}

        {currentPage === 'profil' && <ProfilePage />}

        {currentPage === 'visi-misi' && <VisiMisiPage />}

        {currentPage === 'galeri-foto' && (
          <GalleryPhotoPage onOpenLightbox={(item) => setLightboxItem(item)} />
        )}

        {currentPage === 'galeri-video' && <GalleryVideoPage />}

        {currentPage === 'e-learning' && <ELearningPage />}

        {currentPage === 'hubungi-kami' && <ContactPage />}

        {currentPage === 'berita-detail' && (
          activeArticle ? (
            <ArticleDetailPage
              article={activeArticle}
              onSelectArticle={handleSelectArticle}
              onNavigateToArchive={() => navigateTo('berita')}
            />
          ) : (
            <div className="max-w-2xl mx-auto py-16 px-6 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center font-bold text-2xl">
                !
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Berita Tidak Ditemukan
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
                Tulisan atau artikel yang Anda cari tidak tersedia atau mungkin telah dipindahkan.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => navigateTo('beranda')}
                  className="px-6 py-3 rounded-xl bg-[#0E4A6B] hover:bg-[#0a3550] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Kembali ke Beranda
                </button>
                <button
                  onClick={() => navigateTo('berita')}
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all cursor-pointer"
                >
                  Lihat Semua Berita
                </button>
              </div>
            </div>
          )
        )}

        {(currentPage === 'berita' || currentPage === 'arsip') && (
          <ArchivePage onSelectArticle={handleSelectArticle} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Floating Back to Top Button */}
      <BackToTop />

      {/* Global Interactive Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToArticle={handleSelectArticle}
        onNavigateToPage={navigateTo}
      />

      {/* Global Photo Lightbox Modal */}
      <GalleryLightbox
        item={lightboxItem}
        items={data.galeriFoto}
        onClose={() => setLightboxItem(null)}
        onNavigate={(newItem) => setLightboxItem(newItem)}
      />
    </div>
  );
}

export default function App() {
  return (
    <SchoolDataProvider>
      <FaviconManager />
      <AppContent />
    </SchoolDataProvider>
  );
}
