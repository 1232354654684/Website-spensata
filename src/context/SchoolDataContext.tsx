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
  loginWithGoogle: () => Promise<any>;
  logoutAdmin: () => Promise<void>;
  seedData: (force?: boolean) => Promise<{ success: boolean; message: string }>;
  refreshData: () => void;
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
  loginWithGoogle: async () => {},
  logoutAdmin: async () => {},
  seedData: async () => ({ success: false, message: '' }),
  refreshData: () => {}
});

export const SchoolDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SchoolStoreData>(defaultSnapshot);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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
      dataService.subscribe<GaleriAlbumItem[]>('galeri', (val) => {
        if (Array.isArray(val)) {
          setData((prev) => ({ ...prev, galeri: val }));
        }
      })
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

  return (
    <SchoolDataContext.Provider
      value={{
        data,
        loading,
        isLoading: loading,
        isAdmin,
        currentUser,
        firebaseInfo,
        loginWithGoogle,
        logoutAdmin,
        seedData,
        refreshData
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
};

export const useSchoolData = () => useContext(SchoolDataContext);
