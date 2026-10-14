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
  const [selectedArticleId, setSelectedArticleId] = useState<string>('');
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

  // Hash-based navigation synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'beranda';
      const parts = hash.split('/');
      const mainRoute = parts[0];

      if (mainRoute === 'admin') {
        setCurrentPage('admin');
      } else if (mainRoute === 'berita' && parts[1]) {
        setSelectedArticleId(parts[1]);
        setCurrentPage('berita-detail');
      } else if (mainRoute === 'berita' || mainRoute === 'arsip') {
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
        ].includes(mainRoute)
      ) {
        setCurrentPage(mainRoute);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    if (window.location.hash) {
      handleHashChange();
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (pageId: string) => {
    window.location.hash = pageId;
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    window.location.hash = `berita/${articleId}`;
    setCurrentPage('berita-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin route /#admin rendering
  if (currentPage === 'admin') {
    return <AdminDashboard />;
  }

  // Loading state saat data awal Firestore belum siap
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <div className="w-12 h-12 rounded-full border-4 border-[#0E4A6B]/20 border-t-[#0E4A6B] dark:border-[#E5A823]/20 dark:border-t-[#E5A823] animate-spin mb-4" />
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
          Memuat Data Sekolah...
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Menghubungkan ke basis data terpusat
        </p>
      </div>
    );
  }

  const publishedArticles = data.berita.filter((b) => b.status === 'Terbit');
  const activeArticle = selectedArticleId
    ? publishedArticles.find((a) => a.id === selectedArticleId) ||
      data.berita.find((a) => a.id === selectedArticleId)
    : null;

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
              <div className="pt-2">
                <button
                  onClick={() => navigateTo('berita')}
                  className="px-6 py-3 rounded-xl bg-[#0E4A6B] hover:bg-[#0a3550] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
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
