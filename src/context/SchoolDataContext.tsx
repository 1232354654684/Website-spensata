import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  SchoolStoreData,
  SchoolIdentity,
  Headmaster,
  SocialMedia,
  VisiMisi,
  Sejarah,
  ELearningData,
  StatistikItem,
  SaranaItem,
  HeroSlideItem,
  BeritaItem,
  GaleriFotoItem,
  GaleriVideoItem,
  GaleriAlbumItem
} from '../types';
import { dataService } from '../services/dataService';
import { auth, isFirebaseConfigured, firebaseInfo, loginWithGoogle } from '../services/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

interface SchoolDataContextType {
  data: SchoolStoreData;
  loading: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  currentUser: User | null;
  firebaseInfo: {
    projectId: string;
    firestoreDatabaseId: string;
  };
  faviconConfig: {
    faviconUrl: string;
    faviconUpdatedAt: number;
  };
  loginWithGoogle: () => Promise<any>;
  logoutAdmin: () => Promise<void>;
  seedData: (force?: boolean) => Promise<{ success: boolean; message: string }>;
  refreshData: () => void;
  saveFavicon: (url: string) => Promise<void>;
  resetFavicon: () => Promise<void>;
}

/**
 * Dynamically updates or creates <link rel="icon"> and <link rel="apple-touch-icon"> in document.head
 */
export function applyFaviconToDocument(rawUrl?: string, updatedAt?: number) {
  if (typeof document === 'undefined') return;

  const defaultFavicon = '/favicon.png?v=2';
  let targetHref = defaultFavicon;

  if (rawUrl && rawUrl.trim()) {
    const trimmed = rawUrl.trim();
    if (trimmed.startsWith('data:image/')) {
      targetHref = trimmed;
    } else {
      const sep = trimmed.includes('?') ? '&' : '?';
      targetHref = `${trimmed}${sep}v=${updatedAt || Date.now()}`;
    }
  }

  // Update or create <link rel="icon">
  let iconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
  if (!iconLink) {
    iconLink = document.createElement('link');
    iconLink.rel = 'icon';
    iconLink.type = 'image/png';
    document.head.appendChild(iconLink);
  }
  iconLink.href = targetHref;

  // Update or create <link rel="apple-touch-icon">
  let appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement | null;
  if (!appleLink) {
    appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    document.head.appendChild(appleLink);
  }
  appleLink.href = targetHref;

  // Fallback to default if custom remote url fails to load
  if (targetHref !== defaultFavicon && !targetHref.startsWith('data:image/')) {
    const testImg = new Image();
    testImg.onerror = () => {
      console.warn('Custom favicon failed to load, reverting to default /favicon.png');
      if (iconLink) iconLink.href = defaultFavicon;
      if (appleLink) appleLink.href = defaultFavicon;
    };
    testImg.src = targetHref;
  }
}

const defaultSnapshot = dataService.getSnapshot();

const SchoolDataContext = createContext<SchoolDataContextType>({
  data: defaultSnapshot,
  loading: false,
  isLoading: false,
  isAdmin: false,
  currentUser: null,
  firebaseInfo: {
    projectId: firebaseInfo.projectId,
    firestoreDatabaseId: firebaseInfo.firestoreDatabaseId
  },
  faviconConfig: {
    faviconUrl: '',
    faviconUpdatedAt: 0
  },
  loginWithGoogle: async () => {},
  logoutAdmin: async () => {},
  seedData: async () => ({ success: false, message: '' }),
  refreshData: () => {},
  saveFavicon: async () => {},
  resetFavicon: async () => {}
});

export const SchoolDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SchoolStoreData>(defaultSnapshot);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [faviconConfig, setFaviconConfig] = useState<{
    faviconUrl: string;
    faviconUpdatedAt: number;
  }>({
    faviconUrl: '',
    faviconUpdatedAt: 0
  });
  const [isDemoAdmin, setIsDemoAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('spensata_demo_admin') === 'true';
    }
    return false;
  });

  // Track Firebase Auth or local admin status
  useEffect(() => {
    if (isFirebaseConfigured() && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
      return () => unsubscribe();
    }
  }, []);

  // Subscribe to all documents and collections using dataService
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    // Single documents
    unsubs.push(
      dataService.subscribe<SchoolIdentity>('identitas', (val) => {
        if (val) setData((prev) => ({ ...prev, identitas: val }));
      }, 'info')
    );

    unsubs.push(
      dataService.subscribe<Headmaster>('kepalaSekolah', (val) => {
        if (val) setData((prev) => ({ ...prev, kepalaSekolah: val }));
      }, 'info')
    );

    unsubs.push(
      dataService.subscribe<SocialMedia>('mediaSosial', (val) => {
        if (val) setData((prev) => ({ ...prev, mediaSosial: val }));
      }, 'info')
    );

    unsubs.push(
      dataService.subscribe<VisiMisi>('visiMisi', (val) => {
        if (val) setData((prev) => ({ ...prev, visiMisi: val }));
      }, 'info')
    );

    unsubs.push(
      dataService.subscribe<Sejarah>('sejarah', (val) => {
        if (val) setData((prev) => ({ ...prev, sejarah: val }));
      }, 'info')
    );

    unsubs.push(
      dataService.subscribe<ELearningData>('elearning', (val) => {
        if (val) setData((prev) => ({ ...prev, elearning: val }));
      }, 'info')
    );

    // Collections
    unsubs.push(
      dataService.subscribe<StatistikItem[]>('statistik', (val) => {
        if (Array.isArray(val)) {
          const sorted = [...val].sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
          setData((prev) => ({ ...prev, statistik: sorted }));
        }
      })
    );

    unsubs.push(
      dataService.subscribe<SaranaItem[]>('sarana', (val) => {
        if (Array.isArray(val)) {
          const sorted = [...val].sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
          setData((prev) => ({ ...prev, sarana: sorted }));
        }
      })
    );

    unsubs.push(
      dataService.subscribe<HeroSlideItem[]>('heroSlides', (val) => {
        if (Array.isArray(val)) {
          const sorted = [...val].sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
          setData((prev) => ({ ...prev, heroSlides: sorted }));
        }
      })
    );

    unsubs.push(
      dataService.subscribe<BeritaItem[]>('berita', (val) => {
        if (Array.isArray(val)) {
          setData((prev) => ({ ...prev, berita: val }));
        }
      })
    );

    unsubs.push(
      dataService.subscribe<GaleriFotoItem[]>('galeriFoto', (val) => {
        if (Array.isArray(val)) {
          const sorted = [...val].sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
          setData((prev) => ({ ...prev, galeriFoto: sorted }));
        }
      })
    );

    unsubs.push(
      dataService.subscribe<GaleriVideoItem[]>('galeriVideo', (val) => {
        if (Array.isArray(val)) {
          const sorted = [...val].sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
          setData((prev) => ({ ...prev, galeriVideo: sorted }));
        }
      })
    );

    unsubs.push(
      dataService.subscribeGaleri((val) => {
        if (Array.isArray(val)) {
          setData((prev) => ({ ...prev, galeri: val }));
        }
      })
    );

    // Pengaturan Situs (Favicon, Logo, dan konfigurasi realtime)
    unsubs.push(
      dataService.subscribe<{ faviconUrl?: string; faviconUpdatedAt?: number }>(
        'pengaturan',
        (val) => {
          const url = val?.faviconUrl || '';
          const updatedAt = val?.faviconUpdatedAt || 0;
          setFaviconConfig({ faviconUrl: url, faviconUpdatedAt: updatedAt });
          applyFaviconToDocument(url, updatedAt);
        },
        'situs'
      )
    );

    setLoading(false);

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  const PRIMARY_ADMIN_EMAILS = [
    'ardiansyahroni017@gmail.com',
    'admin@spensata.sch.id'
  ];

  const isAdmin = useMemo(() => {
    if (currentUser && currentUser.email) {
      const email = currentUser.email.toLowerCase().trim();
      return PRIMARY_ADMIN_EMAILS.includes(email);
    }
    return isDemoAdmin;
  }, [currentUser, isDemoAdmin]);

  const logoutAdmin = async () => {
    if (isFirebaseConfigured() && auth) {
      await signOut(auth);
    }
    setIsDemoAdmin(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('spensata_demo_admin');
    }
  };

  const seedData = async (force = false) => {
    const res = await dataService.seedInitialData(force);
    setData(dataService.getSnapshot());
    return res;
  };

  const refreshData = () => {
    setData(dataService.getSnapshot());
  };

  const saveFavicon = async (url: string) => {
    const timestamp = Date.now();
    await dataService.saveFavicon(url, timestamp);
    setFaviconConfig({ faviconUrl: url, faviconUpdatedAt: timestamp });
    applyFaviconToDocument(url, timestamp);
  };

  const resetFavicon = async () => {
    await dataService.resetFavicon();
    setFaviconConfig({ faviconUrl: '', faviconUpdatedAt: Date.now() });
    applyFaviconToDocument('', Date.now());
  };

  return (
    <SchoolDataContext.Provider
      value={{
        data,
        loading,
        isLoading: loading,
        isAdmin,
        currentUser,
        firebaseInfo,
        faviconConfig,
        loginWithGoogle,
        logoutAdmin,
        seedData,
        refreshData,
        saveFavicon,
        resetFavicon
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
};

export const useSchoolData = () => useContext(SchoolDataContext);
