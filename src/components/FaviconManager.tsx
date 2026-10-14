import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../services/firebase';
import { useSchoolData } from '../context/SchoolDataContext';

export interface SiteSettings {
  faviconUrl?: string;
  faviconUpdatedAt?: number;
  namaSekolah?: string;
}

/**
 * Global Favicon & Title Manager Component
 * Runs at the root level of App.tsx outside any route/login barrier.
 * Listens to Firestore `pengaturan/situs` in realtime via onSnapshot (read: if true).
 * Updates <link rel="icon">, <link rel="apple-touch-icon">, and document.title dynamically.
 */
export const FaviconManager: React.FC = () => {
  const { data, isAdmin } = useSchoolData();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    faviconUrl: '',
    faviconUpdatedAt: 0
  });

  // Realtime listener for Firestore collection 'pengaturan', doc 'situs'
  useEffect(() => {
    if (isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, 'pengaturan', 'situs');
        const unsubscribe = onSnapshot(
          docRef,
          (snap) => {
            if (snap.exists()) {
              const val = snap.data() as SiteSettings;
              setSiteSettings({
                faviconUrl: val?.faviconUrl || '',
                faviconUpdatedAt: val?.faviconUpdatedAt || 0,
                namaSekolah: val?.namaSekolah || ''
              });
              applyFavicon(val?.faviconUrl, val?.faviconUpdatedAt);
            } else {
              applyFavicon('', 0);
            }
          },
          (err) => {
            console.warn('Realtime onSnapshot for pengaturan/situs error:', err);
            // Fallback to default favicon
            applyFavicon('', 0);
          }
        );
        return () => unsubscribe();
      } catch (err) {
        console.warn('Failed to attach onSnapshot listener to pengaturan/situs:', err);
        applyFavicon('', 0);
      }
    } else {
      applyFavicon('', 0);
    }
  }, []);

  // Synchronize document.title depending on active page (especially Login Admin)
  useEffect(() => {
    const updateTitle = () => {
      const hash = window.location.hash.toLowerCase();
      const schoolName = siteSettings.namaSekolah || data.identitas.nama || 'SMP Negeri 1 Tambak';
      const slogan = data.identitas.slogan || 'Berkarakter Kuat Berprestasi Hebat';

      if (hash.includes('admin')) {
        if (!isAdmin) {
          document.title = `Login Admin - ${schoolName}`;
        } else {
          document.title = `Panel Admin - ${schoolName}`;
        }
      } else if (hash.includes('profil')) {
        document.title = `Profil Sekolah - ${schoolName}`;
      } else if (hash.includes('berita')) {
        document.title = `Warta & Berita - ${schoolName}`;
      } else if (hash.includes('galeri')) {
        document.title = `Galeri Dokumentasi - ${schoolName}`;
      } else {
        document.title = `${schoolName} - ${slogan}`;
      }
    };

    updateTitle();
    window.addEventListener('hashchange', updateTitle);
    return () => window.removeEventListener('hashchange', updateTitle);
  }, [data.identitas.nama, data.identitas.slogan, isAdmin, siteSettings.namaSekolah]);

  return null;
};

/**
 * Dynamically updates or injects <link rel="icon"> and <link rel="apple-touch-icon"> in document.head
 */
export function applyFavicon(rawUrl?: string, updatedAt?: number) {
  if (typeof document === 'undefined') return;

  const defaultIco = '/favicon.ico';
  const defaultPng = '/favicon.png?v=2';
  let targetHref = defaultIco;

  if (rawUrl && rawUrl.trim()) {
    const trimmed = rawUrl.trim();
    if (trimmed.startsWith('data:image/')) {
      targetHref = trimmed;
    } else {
      const sep = trimmed.includes('?') ? '&' : '?';
      targetHref = `${trimmed}${sep}v=${updatedAt || Date.now()}`;
    }
  }

  // 1. Update or create primary <link rel="icon">
  let iconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
  if (!iconLink) {
    iconLink = document.createElement('link');
    iconLink.rel = 'icon';
    document.head.appendChild(iconLink);
  }
  iconLink.href = targetHref;
  if (targetHref.startsWith('data:image/png') || targetHref.includes('.png')) {
    iconLink.type = 'image/png';
  } else if (targetHref.includes('.ico')) {
    iconLink.type = 'image/x-icon';
  } else if (targetHref.includes('.svg')) {
    iconLink.type = 'image/svg+xml';
  }

  // 2. Update or create <link rel="apple-touch-icon">
  let appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement | null;
  if (!appleLink) {
    appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    document.head.appendChild(appleLink);
  }
  appleLink.href = targetHref === defaultIco ? defaultPng : targetHref;

  // 3. Fallback check for remote URLs: If URL fails to load, revert to /favicon.ico
  if (targetHref !== defaultIco && !targetHref.startsWith('data:image/')) {
    const testImg = new Image();
    testImg.onerror = () => {
      console.warn('Favicon URL failed to load in browser, reverting to /favicon.ico:', targetHref);
      if (iconLink) {
        iconLink.href = defaultIco;
        iconLink.type = 'image/x-icon';
      }
      if (appleLink) {
        appleLink.href = defaultPng;
      }
    };
    testImg.src = targetHref;
  }
}
