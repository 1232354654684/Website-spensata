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
import { ARTICLES, PHOTO_GALLERY } from './data/schoolData';
import { GalleryItem } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('beranda');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('post-59');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
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

      if (mainRoute === 'berita' && parts[1]) {
        // Can be an ID or an index
        const target = ARTICLES.find((a) => a.id === parts[1]) || ARTICLES[parseInt(parts[1], 10)] || ARTICLES[0];
        setSelectedArticleId(target.id);
        setCurrentPage('berita-detail');
      } else if (mainRoute === 'berita' || mainRoute === 'arsip') {
        setCurrentPage('berita');
      } else if (
        ['beranda', 'profil', 'visi-misi', 'galeri-foto', 'galeri-video', 'e-learning', 'hubungi-kami'].includes(
          mainRoute
        )
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

  const activeArticle = ARTICLES.find((a) => a.id === selectedArticleId) || ARTICLES[0];

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
          <ArticleDetailPage
            article={activeArticle}
            onSelectArticle={handleSelectArticle}
            onNavigateToArchive={() => navigateTo('berita')}
          />
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
        items={PHOTO_GALLERY}
        onClose={() => setLightboxItem(null)}
        onNavigate={(newItem) => setLightboxItem(newItem)}
      />
    </div>
  );
}
