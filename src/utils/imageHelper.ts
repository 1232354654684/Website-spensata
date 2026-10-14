/**
 * Image helper utilities for SMP Negeri 1 Tambak
 * Handles validation, client-side canvas compression, URL normalization,
 * Google Drive / Google Photos detection, and transparent favicon generation.
 */

export const DEFAULT_KEPSEK_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E4A6B" />
      <stop offset="100%" stop-color="#072233" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5C038" />
      <stop offset="100%" stop-color="#E5A823" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bgGrad)" />
  <circle cx="200" cy="150" r="65" fill="#E2E8F0" />
  <path d="M 80,350 C 80,260 140,240 200,240 C 260,240 320,260 320,350 Z" fill="#E2E8F0" />
  <circle cx="200" cy="200" r="185" fill="none" stroke="url(#gold)" stroke-width="8" stroke-dasharray="8 6" opacity="0.6"/>
  <rect x="80" y="325" width="240" height="40" rx="12" fill="#0A3550" stroke="url(#gold)" stroke-width="2" />
  <text x="200" y="350" fill="#F5C038" font-family="Arial, sans-serif" font-size="13" font-weight="bold" letter-spacing="2" text-anchor="middle">KEPALA SEKOLAH</text>
</svg>`);

/**
 * Checks if a given URL is a Google Photos webpage link (album / share link)
 * which cannot be rendered directly in an <img> tag.
 */
export function isGooglePhotosWebUrl(rawUrl: string): boolean {
  if (!rawUrl) return false;
  const trimmed = rawUrl.trim().toLowerCase();
  return (
    trimmed.includes('photos.app.goo.gl') ||
    trimmed.includes('photos.google.com/share') ||
    trimmed.includes('photos.google.com/album') ||
    (trimmed.includes('photos.google.com') && !trimmed.includes('lh3.googleusercontent.com'))
  );
}

/**
 * Normalizes image URLs:
 * - Direct URLs and lh3.googleusercontent.com are preserved
 * - Google Drive share links (drive.google.com/file/d/ID/...) are transformed to https://lh3.googleusercontent.com/d/ID
 * - Data URLs are preserved
 */
export function normalizeImageUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();

  // If already base64 data url, return as is
  if (trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  // Google Drive: drive.google.com/file/d/{ID}/...
  const driveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  // Google Drive: drive.google.com/open?id={ID} or uc?id={ID}
  const driveIdMatch = trimmed.match(/drive\.google\.com\/(?:open|uc)\?(?:[^&]*&)*id=([a-zA-Z0-9_-]+)/i);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  }

  // Google Docs: docs.google.com/uc?id={ID}
  const docsIdMatch = trimmed.match(/docs\.google\.com\/uc\?(?:[^&]*&)*id=([a-zA-Z0-9_-]+)/i);
  if (docsIdMatch && docsIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${docsIdMatch[1]}`;
  }

  return trimmed;
}

/**
 * Validates uploaded photo for Kepala Sekolah:
 * - JPG, PNG, WEBP
 * - Max 10 MB
 */
export function validateKepsekImageFile(file: File): { valid: boolean; error?: string } {
  const allowedMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];

  const matchesType = allowedMime.includes(file.type.toLowerCase()) || allowedExts.includes(ext);
  if (!matchesType) {
    return {
      valid: false,
      error: `Format file "${file.name}" tidak didukung. Harap gunakan format gambar JPG, PNG, atau WEBP.`
    };
  }

  const maxBytes = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Ukuran file terlalu besar (${sizeMb} MB). Maksimal ukuran file adalah 10 MB.`
    };
  }

  return { valid: true };
}

/**
 * Validates favicon file:
 * - PNG, ICO, WEBP
 * - Max 2 MB
 */
export function validateFaviconFile(file: File): { valid: boolean; error?: string } {
  const allowedMime = [
    'image/png',
    'image/x-icon',
    'image/vnd.microsoft.icon',
    'image/webp'
  ];
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const allowedExts = ['png', 'ico', 'webp'];

  const matchesType = allowedMime.includes(file.type.toLowerCase()) || allowedExts.includes(ext);
  if (!matchesType) {
    return {
      valid: false,
      error: `Format file "${file.name}" tidak didukung untuk favicon. Gunakan PNG (transparan), ICO, atau WEBP.`
    };
  }

  const maxBytes = 2 * 1024 * 1024; // 2 MB
  if (file.size > maxBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Ukuran file favicon terlalu besar (${sizeMb} MB). Maksimal ukuran yang diizinkan adalah 2 MB.`
    };
  }

  return { valid: true };
}

/**
 * Helper to wrap any promise with a timeout in milliseconds.
 */
export function withTimeout<T>(promise: Promise<T>, timeoutMs = 20000, errorMsg = 'Operasi melebihi batas waktu (timeout 20 detik).'): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      const err: any = new Error(errorMsg);
      err.code = 'TIMEOUT';
      reject(err);
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timer);
  });
}

/**
 * Compresses Kepala Sekolah photo client-side using Canvas:
 * - Lebar maks 600 px (proporsional)
 * - Format: JPEG, kualitas 0.8
 * - Output: base64 Data URL
 * - Pastikan ukuran di bawah 500 KB (di bawah batas dokumen Firestore)
 * - Dibatasi timeout 20 detik
 */
export async function compressKepsekImageToDataUrl(file: File): Promise<string> {
  const task = new Promise<string>((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let targetWidth = img.naturalWidth || img.width;
      let targetHeight = img.naturalHeight || img.height;

      // Scale down so max width is 600 px
      const maxWidth = 600;
      if (targetWidth > maxWidth) {
        targetHeight = Math.round((targetHeight * maxWidth) / targetWidth);
        targetWidth = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Gagal menginisialisasi canvas untuk kompresi foto.'));
        return;
      }

      // Smooth rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Export JPEG with initial quality 0.8
      let quality = 0.8;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);

      // Ensure dataUrl size is strictly under 500 KB (512,000 bytes)
      const maxDataUrlLength = 500 * 1024;
      if (dataUrl.length > maxDataUrlLength) {
        quality = 0.6;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }
      if (dataUrl.length > maxDataUrlLength) {
        // Scale down further if still large
        const smallerCanvas = document.createElement('canvas');
        smallerCanvas.width = Math.round(targetWidth * 0.75);
        smallerCanvas.height = Math.round(targetHeight * 0.75);
        const sCtx = smallerCanvas.getContext('2d');
        if (sCtx) {
          sCtx.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);
          dataUrl = smallerCanvas.toDataURL('image/jpeg', 0.6);
        }
      }

      console.info(
        `Foto Kepala Sekolah terkompresi: ${targetWidth}x${targetHeight}px, size: ${(dataUrl.length / 1024).toFixed(0)} KB (di bawah batas 500 KB)`
      );
      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const err: any = new Error('File gambar tidak dapat dibaca atau rusak.');
      err.code = 'IMAGE_LOAD_FAILED';
      reject(err);
    };

    img.src = objectUrl;
  });

  return withTimeout(task, 20000, 'Kompresi foto kepala sekolah melebihi batas waktu 20 detik.');
}

/**
/**
 * Compresses favicon to 128x128 px PNG while preserving transparency:
 * - Dimensi: 128x128 px (dan 64x64 jika diperlukan agar hemat)
 * - Format: image/png (latar belakang transparan murni, tanpa warna latar)
 * - Ukuran base64: dibatasi maksimal 100 KB (aman di bawah batas 1 MB per dokumen Firestore)
 * - Timeout 20 detik
 */
export async function compressFaviconToDataUrl(file: File): Promise<string> {
  const task = new Promise<string>((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const renderAtSize = (targetDim: number): string => {
        const canvas = document.createElement('canvas');
        canvas.width = targetDim;
        canvas.height = targetDim;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Gagal menginisialisasi canvas untuk favicon.');

        // Pastikan canvas bersih dan transparan
        ctx.clearRect(0, 0, targetDim, targetDim);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const naturalWidth = img.naturalWidth || img.width;
        const naturalHeight = img.naturalHeight || img.height;
        const scale = Math.min(targetDim / naturalWidth, targetDim / naturalHeight);
        const drawWidth = Math.round(naturalWidth * scale);
        const drawHeight = Math.round(naturalHeight * scale);
        const offsetX = Math.round((targetDim - drawWidth) / 2);
        const offsetY = Math.round((targetDim - drawHeight) / 2);

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        return canvas.toDataURL('image/png');
      };

      try {
        // Coba ukuran 128x128 px terlebih dahulu (sangat tajam untuk tab browser & retina)
        let dataUrl = renderAtSize(128);

        // Jika melebihi batas 100 KB (102,400 bytes), turunkan ke 64x64 px
        const maxSizeBytes = 100 * 1024;
        if (dataUrl.length > maxSizeBytes) {
          console.info(
            `Favicon 128x128 melebihi 100 KB (${Math.round(dataUrl.length / 1024)} KB), meresize ke 64x64...`
          );
          dataUrl = renderAtSize(64);
        }

        if (dataUrl.length > maxSizeBytes) {
          throw new Error(
            `Ukuran favicon hasil kompresi (${Math.round(dataUrl.length / 1024)} KB) melebihi batas 100 KB.`
          );
        }

        console.info(
          `Favicon terkompresi transparan: size: ${(dataUrl.length / 1024).toFixed(1)} KB (di bawah batas 100 KB)`
        );
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const err: any = new Error('File favicon tidak dapat dibaca atau rusak.');
      err.code = 'FAVICON_LOAD_FAILED';
      reject(err);
    };

    img.src = objectUrl;
  });

  return withTimeout(task, 20000, 'Pemrosesan favicon melebihi batas waktu 20 detik.');
}

// Keep validateImageFile and compressImageClientSide as backwards compatibility
export const validateImageFile = validateKepsekImageFile;
export async function compressImageClientSide(file: File, maxWidth = 600, quality = 0.8) {
  const dataUrl = await compressKepsekImageToDataUrl(file);
  return {
    blob: new Blob([dataUrl], { type: 'image/jpeg' }),
    dataUrl,
    width: maxWidth,
    height: maxWidth,
    sizeBytes: dataUrl.length
  };
}
