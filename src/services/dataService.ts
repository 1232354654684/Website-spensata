import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { db, storage, isFirebaseConfigured, auth } from './firebase';
import rawSeedData from '../../seed-data.json';
import { SchoolStoreData, GaleriAlbumItem } from '../types';

/**
 * Shared helper to parse album date string or timestamp for accurate descending sorting
 */
export function parseDateString(dateStr?: string, timestamp?: any): number {
  if (timestamp) {
    if (typeof timestamp === 'number') return timestamp;
    if (timestamp?.toMillis) return timestamp.toMillis();
    if (timestamp?.seconds) return timestamp.seconds * 1000;
  }
  if (!dateStr) return 0;
  const direct = Date.parse(dateStr);
  if (!isNaN(direct)) return direct;

  const monthMap: Record<string, number> = {
    jan: 0, januari: 0,
    feb: 1, februari: 1,
    mar: 2, maret: 2,
    apr: 3, april: 3,
    mei: 4, may: 4,
    jun: 5, juni: 5,
    jul: 6, juli: 6,
    agu: 7, agustus: 7, aug: 7,
    sep: 8, september: 8,
    okt: 9, oktober: 9, oct: 9,
    nov: 10, november: 10,
    des: 11, desember: 11, dec: 11
  };

  const parts = dateStr.trim().toLowerCase().split(/[\s,/-]+/);
  if (parts.length >= 3) {
    let day = parseInt(parts[0], 10);
    const monthName = parts[1];
    let year = parseInt(parts[2], 10);

    if (day > 1900) {
      year = parseInt(parts[0], 10);
      day = parseInt(parts[2], 10);
    }

    const monthIndex = monthMap[monthName] ?? -1;
    if (monthIndex !== -1 && !isNaN(day) && !isNaN(year)) {
      return new Date(year, monthIndex, day).getTime();
    }
  }

  const yearMatch = dateStr.match(/\b(20\d\d)\b/);
  if (yearMatch) {
    return new Date(parseInt(yearMatch[1], 10), 0, 1).getTime();
  }

  return 0;
}

export function sortAlbumsByNewest(albums: GaleriAlbumItem[]): GaleriAlbumItem[] {
  return [...albums].sort((a, b) => {
    const timeA = parseDateString(a.tanggal, a.dibuatPada);
    const timeB = parseDateString(b.tanggal, b.dibuatPada);
    if (timeA !== timeB) return timeB - timeA;
    return (b.id || '').localeCompare(a.id || '');
  });
}

const LOCAL_STORAGE_KEY = 'spensata_offline_store';

// Initialize in-memory / local fallback from seed-data
const getInitialStore = (): SchoolStoreData => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }
  return rawSeedData as unknown as SchoolStoreData;
};

let localStore: SchoolStoreData = getInitialStore();
const localListeners: Map<string, Set<(data: any) => void>> = new Map();

const persistLocalStore = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localStore));
    } catch {
      // ignore
    }
  }
};

const notifyLocalListeners = (key: string, data: any) => {
  const listeners = localListeners.get(key);
  if (listeners) {
    listeners.forEach((callback) => callback(data));
  }
};

export const dataService = {
  isConfigured: () => isFirebaseConfigured(),

  /**
   * Get single document or full collection
   */
  async get<T>(collectionName: string, docId?: string): Promise<T | null> {
    if (isFirebaseConfigured() && db) {
      try {
        if (docId) {
          const docRef = doc(db, collectionName, docId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            return { id: snap.id, ...snap.data() } as T;
          }
          return null;
        } else {
          const colRef = collection(db, collectionName);
          const snap = await getDocs(colRef);
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          return items as unknown as T;
        }
      } catch (err) {
        console.warn(`Firestore get error for ${collectionName}:`, err);
      }
    }

    // Local fallback
    if (docId) {
      if (collectionName in localStore) {
        const val = (localStore as any)[collectionName];
        if (Array.isArray(val)) {
          return (val.find((item: any) => item.id === docId) || null) as T;
        }
        return val as T;
      }
      return null;
    } else {
      if (collectionName in localStore) {
        return (localStore as any)[collectionName] as T;
      }
      return null;
    }
  },

  /**
   * Set document data (creates or replaces)
   */
  async set<T>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
    if (isFirebaseConfigured() && db) {
      // Validasi sesi Firebase Auth sebelum menulis
      if (!auth?.currentUser) {
        const authErr: any = new Error('Sesi login habis, silakan login ulang.');
        authErr.code = 'permission-denied';
        throw authErr;
      }

      try {
        const docRef = doc(db, collectionName, docId);
        await setDoc(docRef, data as any, { merge: true });
      } catch (err: any) {
        console.error(`Firestore set error for ${collectionName}/${docId}:`, {
          code: err?.code,
          message: err?.message,
          user: auth?.currentUser?.email
        });
        const errCode = err?.code || '';
        const errMsg = err?.message || String(err);
        if (errCode === 'permission-denied' || errMsg.includes('insufficient permissions')) {
          const userEmail = auth?.currentUser?.email;
          const permErr: any = new Error(
            userEmail
              ? `Izin ditolak oleh Firebase Security Rules. Akun "${userEmail}" tidak memiliki hak akses administrator untuk mengubah ${collectionName}/${docId}.`
              : 'Sesi login habis, silakan login ulang.'
          );
          permErr.code = 'permission-denied';
          throw permErr;
        }
        throw new Error(`Gagal menyimpan ke Firestore (${collectionName}/${docId}): ${errMsg}`);
      }
    }

    // Local fallback and memory sync
    if (collectionName in localStore) {
      const val = (localStore as any)[collectionName];
      if (Array.isArray(val)) {
        const idx = val.findIndex((item: any) => item.id === docId);
        if (idx >= 0) {
          val[idx] = { ...val[idx], ...data, id: docId };
        } else {
          val.push({ ...data, id: docId });
        }
      } else {
        (localStore as any)[collectionName] = { ...val, ...data };
      }
    } else {
      (localStore as any)[collectionName] = data;
    }
    persistLocalStore();
    notifyLocalListeners(
      docId ? `${collectionName}/${docId}` : collectionName,
      (localStore as any)[collectionName]
    );
    notifyLocalListeners(collectionName, (localStore as any)[collectionName]);
  },

  /**
   * Add new item to a collection
   */
  async add<T>(collectionName: string, data: T): Promise<string> {
    let assignedId = (data as any)?.id || `${collectionName}-${Date.now()}`;
    if (isFirebaseConfigured() && db) {
      try {
        const colRef = collection(db, collectionName);
        const docRef = await addDoc(colRef, data as any);
        assignedId = docRef.id;
      } catch (err: any) {
        console.error(`Firestore add error for ${collectionName}:`, err);
        throw new Error(`Gagal menambahkan data ke Firestore (${collectionName}): ${err?.message || err}`);
      }
    }

    // Local fallback and memory sync
    const newItem = { ...(data as any), id: assignedId };
    if (!Array.isArray((localStore as any)[collectionName])) {
      (localStore as any)[collectionName] = [];
    }
    (localStore as any)[collectionName].push(newItem);
    persistLocalStore();
    notifyLocalListeners(collectionName, (localStore as any)[collectionName]);
    return assignedId;
  },

  /**
   * Check if a document exists in Firestore or local store
   */
  async exists(collectionName: string, docId: string): Promise<boolean> {
    if (isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, collectionName, docId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return true;
        }
      } catch (err) {
        console.warn(`Firestore check exists error for ${collectionName}/${docId}:`, err);
      }
    }

    // Local fallback check
    if (collectionName in localStore) {
      const val = (localStore as any)[collectionName];
      if (Array.isArray(val)) {
        return val.some((item: any) => item.id === docId);
      }
    }
    return false;
  },

  /**
   * Save website favicon configuration to Firestore collection 'pengaturan', doc 'situs'
   */
  async saveFavicon(faviconUrl: string, faviconUpdatedAt = Date.now()): Promise<void> {
    if (isFirebaseConfigured() && !auth?.currentUser) {
      const authErr: any = new Error('Sesi login habis, silakan login ulang.');
      authErr.code = 'permission-denied';
      throw authErr;
    }
    await this.set('pengaturan', 'situs', {
      faviconUrl,
      faviconUpdatedAt
    });
  },

  /**
   * Reset website favicon configuration back to default
   */
  async resetFavicon(): Promise<void> {
    if (isFirebaseConfigured() && !auth?.currentUser) {
      const authErr: any = new Error('Sesi login habis, silakan login ulang.');
      authErr.code = 'permission-denied';
      throw authErr;
    }
    await this.set('pengaturan', 'situs', {
      faviconUrl: '',
      faviconUpdatedAt: Date.now()
    });
  },

  /**
   * Sync initial seed items for 'berita' (post-58, post-59, etc.) to Firestore.
   * Uses setDoc with { merge: true } to preserve or create documents with their exact IDs.
   */
  async syncInitialBerita(force = false): Promise<{ synced: number; total: number; message: string }> {
    const seedNews: any[] = (rawSeedData as any).berita || [];
    let synced = 0;

    if (isFirebaseConfigured() && db) {
      try {
        for (const item of seedNews) {
          const itemId = item.id;
          if (!itemId) continue;
          const docRef = doc(db, 'berita', itemId);
          if (force) {
            await setDoc(docRef, item, { merge: true });
            synced++;
          } else {
            const snap = await getDoc(docRef);
            if (!snap.exists()) {
              await setDoc(docRef, item, { merge: true });
              synced++;
            }
          }
        }
        return {
          synced,
          total: seedNews.length,
          message: `Berhasil menyinkronkan ${synced} dari ${seedNews.length} berita awal ke Firestore.`
        };
      } catch (err: any) {
        console.error('Error in syncInitialBerita:', err);
        throw new Error(`Gagal menyinkronkan berita awal ke Firestore: ${err?.message || err}`);
      }
    }

    return {
      synced: seedNews.length,
      total: seedNews.length,
      message: 'Berita awal tersedia di penyimpanan lokal.'
    };
  },

  /**
   * Update existing document using setDoc with { merge: true }
   * This guarantees that if the document does not yet exist in Firestore,
   * it will be automatically created without error, and existing fields are merged.
   */
  async update<T>(collectionName: string, docId: string, data: Partial<T>): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, collectionName, docId);
        // Requirement 1: Use setDoc with { merge: true } instead of updateDoc
        await setDoc(docRef, data as any, { merge: true });
      } catch (err: any) {
        console.error(`Firestore update error for ${collectionName}/${docId}:`, err);
        throw new Error(`Gagal memperbarui data di Firestore (${collectionName}/${docId}): ${err?.message || err}`);
      }
    }

    // Local fallback and memory sync
    if (collectionName in localStore) {
      const val = (localStore as any)[collectionName];
      if (Array.isArray(val)) {
        const idx = val.findIndex((item: any) => item.id === docId);
        if (idx >= 0) {
          val[idx] = { ...val[idx], ...data, id: docId };
        } else {
          val.push({ ...data, id: docId });
        }
      } else {
        (localStore as any)[collectionName] = { ...val, ...data };
      }
    }
    persistLocalStore();
    notifyLocalListeners(
      docId ? `${collectionName}/${docId}` : collectionName,
      (localStore as any)[collectionName]
    );
    notifyLocalListeners(collectionName, (localStore as any)[collectionName]);
  },

  /**
   * Delete document by ID
   */
  async delete(collectionName: string, docId: string): Promise<void> {
    if (isFirebaseConfigured() && db) {
      try {
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
      } catch (err: any) {
        console.error(`Firestore delete error for ${collectionName}/${docId}:`, err);
        throw new Error(`Gagal menghapus data dari Firestore (${collectionName}/${docId}): ${err?.message || err}`);
      }
    }

    // Local fallback and memory sync
    if (Array.isArray((localStore as any)[collectionName])) {
      (localStore as any)[collectionName] = (localStore as any)[collectionName].filter(
        (item: any) => item.id !== docId
      );
    }
    persistLocalStore();
    notifyLocalListeners(collectionName, (localStore as any)[collectionName]);
  },

  /**
   * Subscribe to document or collection in real-time
   * Uses Firestore onSnapshot if available, with graceful local fallback
   */
  subscribe<T>(
    collectionName: string,
    callback: (data: T) => void,
    docId?: string
  ): () => void {
    if (isFirebaseConfigured() && db) {
      try {
        if (docId) {
          const docRef = doc(db, collectionName, docId);
          const unsubscribe = onSnapshot(
            docRef,
            (snap) => {
              if (snap.exists()) {
                callback({ id: snap.id, ...snap.data() } as T);
              } else {
                // If doc doesn't exist yet in firestore, provide initial seed fallback
                if (collectionName in localStore) {
                  callback((localStore as any)[collectionName] as T);
                }
              }
            },
            (error) => {
              console.warn(`Firestore subscription error on ${collectionName}/${docId}:`, error);
              if (collectionName in localStore) {
                callback((localStore as any)[collectionName] as T);
              }
            }
          );
          return unsubscribe;
        } else {
          const colRef = collection(db, collectionName);
          const q = query(colRef);
          let initialReceived = false;
          const unsubscribe = onSnapshot(
            q,
            (snap) => {
              if (!snap.empty) {
                const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                callback(items as unknown as T);
              } else {
                // If firestore collection is completely empty:
                // For 'berita', auto-seed initial news items so post-58 etc. exist in Firestore!
                if (!initialReceived && collectionName === 'berita') {
                  dataService.syncInitialBerita(false).catch((e) => console.warn('Auto sync berita:', e));
                }
                // Provide initial seed fallback on first load, or empty array if explicitly emptied
                if (!initialReceived && collectionName in localStore) {
                  callback((localStore as any)[collectionName] as T);
                } else {
                  callback([] as unknown as T);
                }
              }
              initialReceived = true;
            },
            (error) => {
              console.warn(`Firestore subscription error on ${collectionName}:`, error);
              if (collectionName in localStore) {
                callback((localStore as any)[collectionName] as T);
              }
            }
          );
          return unsubscribe;
        }
      } catch (err) {
        console.warn(`Error initializing onSnapshot for ${collectionName}:`, err);
      }
    }

    // Local subscription fallback
    const key = docId ? `${collectionName}/${docId}` : collectionName;
    if (!localListeners.has(key)) {
      localListeners.set(key, new Set());
    }
    const setOfCallbacks = localListeners.get(key)!;
    setOfCallbacks.add(callback as any);

    // Initial trigger
    if (collectionName in localStore) {
      const val = (localStore as any)[collectionName];
      if (docId && Array.isArray(val)) {
        callback((val.find((item: any) => item.id === docId) || null) as T);
      } else {
        callback(val as T);
      }
    }

    return () => {
      setOfCallbacks.delete(callback as any);
    };
  },

  /**
   * Shared onSnapshot listener for the 'galeri' collection in Firestore.
   * Automatically sorts albums from newest to oldest.
   * Both Beranda and Halaman Galeri Foto use this same data retrieval function.
   */
  subscribeGaleri(
    callback: (albums: GaleriAlbumItem[]) => void,
    onError?: (err: any) => void
  ): () => void {
    if (isFirebaseConfigured() && db) {
      try {
        const colRef = collection(db, 'galeri');
        const q = query(colRef);
        const unsubscribe = onSnapshot(
          q,
          (snap) => {
            if (!snap.empty) {
              const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as GaleriAlbumItem));
              const sorted = sortAlbumsByNewest(items);
              callback(sorted);
            } else {
              const initial = (localStore as any).galeri || [];
              callback(sortAlbumsByNewest(initial));
            }
          },
          (error) => {
            console.warn('Firestore subscription error on galeri:', error);
            if (onError) onError(error);
            const initial = (localStore as any).galeri || [];
            callback(sortAlbumsByNewest(initial));
          }
        );
        return unsubscribe;
      } catch (err: any) {
        console.warn('Error setting up onSnapshot for galeri:', err);
        if (onError) onError(err);
      }
    }

    // Fallback for local storage / offline store
    const key = 'galeri';
    if (!localListeners.has(key)) {
      localListeners.set(key, new Set());
    }
    const listener = (val: any) => {
      const items = Array.isArray(val) ? val : [];
      callback(sortAlbumsByNewest(items));
    };
    localListeners.get(key)!.add(listener);

    // Initial trigger
    const initial = (localStore as any).galeri || [];
    callback(sortAlbumsByNewest(initial));

    return () => {
      const set = localListeners.get(key);
      if (set) {
        set.delete(listener);
      }
    };
  },

  /**
   * Upload image file or compressed Blob to Firebase Storage with local DataURL fallback
   */
  async uploadFile(fileOrBlob: File | Blob, folder = 'uploads', customFileName?: string): Promise<string> {
    if (isFirebaseConfigured() && storage) {
      try {
        const isFile = fileOrBlob instanceof File;
        const ext = fileOrBlob.type === 'image/png' ? 'png' : fileOrBlob.type === 'image/webp' ? 'webp' : 'jpg';
        const rawName = customFileName || (isFile ? (fileOrBlob as File).name : `photo-${Date.now()}.${ext}`);
        const cleanName = `${Date.now()}-${rawName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const fileRef = ref(storage, `${folder}/${cleanName}`);
        
        await uploadBytes(fileRef, fileOrBlob, {
          contentType: fileOrBlob.type || 'image/jpeg'
        });
        const url = await getDownloadURL(fileRef);
        console.info('Firebase Storage upload success:', url);
        return url;
      } catch (err: any) {
        console.warn(
          `Firebase Storage upload failed (code: ${err?.code || 'unknown'}, message: ${err?.message || err}). Falling back to Base64 Data URL.`
        );
      }
    }

    // Fallback: convert file or compressed blob to Base64 Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(new Error('Gagal mengonversi gambar ke Base64: ' + e));
      reader.readAsDataURL(fileOrBlob);
    });
  },

  /**
   * Seed / Initialise full database with seed-data.json
   */
  async seedInitialData(force = false): Promise<{ success: boolean; message: string; count: number }> {
    let count = 0;
    const seed = rawSeedData;

    // Single documents
    const singleDocs = [
      { col: 'identitas', data: seed.identitas },
      { col: 'kepalaSekolah', data: seed.kepalaSekolah },
      { col: 'mediaSosial', data: seed.mediaSosial },
      { col: 'visiMisi', data: seed.visiMisi },
      { col: 'sejarah', data: seed.sejarah },
      { col: 'elearning', data: seed.elearning }
    ];

    // Collections
    const collections = [
      { col: 'statistik', items: seed.statistik },
      { col: 'sarana', items: seed.sarana },
      { col: 'heroSlides', items: seed.heroSlides },
      { col: 'berita', items: seed.berita },
      { col: 'galeriFoto', items: seed.galeriFoto },
      { col: 'galeriVideo', items: seed.galeriVideo },
      { col: 'galeri', items: (seed as any).galeri || [] }
    ];

    // Update local cache
    localStore = { ...(seed as unknown as SchoolStoreData) };
    persistLocalStore();

    if (isFirebaseConfigured() && db) {
      try {
        // Seed single docs
        for (const docItem of singleDocs) {
          const docRef = doc(db, docItem.col, 'info');
          const snap = await getDoc(docRef);
          if (force || !snap.exists()) {
            await setDoc(docRef, docItem.data, { merge: true });
            count++;
          }
        }

        // Seed collections
        for (const colItem of collections) {
          if (colItem.col === 'berita') {
            for (const item of colItem.items) {
              const itemId = (item as any).id;
              if (itemId) {
                const docRef = doc(db, 'berita', itemId);
                const docSnap = await getDoc(docRef);
                if (force || !docSnap.exists()) {
                  await setDoc(docRef, item, { merge: true });
                  count++;
                }
              }
            }
          } else {
            const colRef = collection(db, colItem.col);
            const snap = await getDocs(colRef);
            if (force || snap.empty) {
              for (const item of colItem.items) {
                const itemId = (item as any).id || `${colItem.col}-${Math.random().toString(36).substring(2, 9)}`;
                await setDoc(doc(db, colItem.col, itemId), item, { merge: true });
                count++;
              }
            }
          }
        }
        return {
          success: true,
          message: `Berhasil menginisialisasi ${count} dokumen ke Firestore`,
          count
        };
      } catch (err: any) {
        console.error('Error seeding to Firestore:', err);
        return {
          success: false,
          message: `Gagal menginisialisasi Firestore: ${err?.message || err}`,
          count
        };
      }
    }

    return {
      success: true,
      message: 'Berhasil memuat data awal sekolah ke penyimpanan lokal',
      count: singleDocs.length + collections.reduce((acc, c) => acc + c.items.length, 0)
    };
  },

  /**
   * Get synchronous snapshot of current store data
   */
  getSnapshot(): SchoolStoreData {
    return localStore;
  }
};
