import { auth } from '../services/firebase';

const UPLOAD_ENDPOINT = import.meta.env.VITE_UPLOAD_ENDPOINT || '/upload.php';

export type UploadFolder =
  | 'berita'
  | 'galeri'
  | 'profil'
  | 'guru'
  | 'prestasi'
  | 'pengaturan'
  | 'lainnya';

/**
 * Validates uploaded image file on client side:
 * - Only JPG, PNG, WEBP, GIF allowed
 * - Max file size 5 MB
 */
export function validateImageUpload(file: File): { valid: boolean; error?: string } {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

  const isValidType =
    allowedMimes.includes(file.type.toLowerCase()) || allowedExts.includes(ext);

  if (!isValidType) {
    return {
      valid: false,
      error: `Format file "${file.name}" tidak didukung. Harap gunakan format gambar JPG, PNG, WEBP, atau GIF.`
    };
  }

  const maxBytes = 5 * 1024 * 1024; // 5 MB
  if (file.size > maxBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Ukuran file "${file.name}" (${sizeMb} MB) melebihi batas maksimal 5 MB. Harap gunakan gambar yang lebih kecil.`
    };
  }

  return { valid: true };
}

/**
 * Checks whether compression should be skipped:
 * Logo and favicon (PNG with transparency) as well as GIF animations
 * are sent as-is without compression to preserve alpha transparency and animation.
 */
function shouldSkipCompression(file: File, folder: UploadFolder): boolean {
  const name = file.name.toLowerCase();
  const isPng = file.type === 'image/png' || name.endsWith('.png');
  const isGif = file.type === 'image/gif' || name.endsWith('.gif');
  const isIco = file.type === 'image/x-icon' || name.endsWith('.ico');
  const isFaviconOrLogo = name.includes('logo') || name.includes('favicon');

  if (isGif || isIco) return true;
  if (folder === 'pengaturan' && isPng) return true;
  if (isFaviconOrLogo && isPng) return true;

  return false;
}

/**
 * Compresses image in browser via HTML5 Canvas:
 * - Longest side max 1600 px
 * - Quality 0.85
 * - Output JPEG or WEBP
 */
async function compressImageInBrowser(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gagal memuat gambar untuk kompresi.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxSide = 1600;

        if (width > maxSide || height > maxSide) {
          if (width > height) {
            height = Math.round((height * maxSide) / width);
            width = maxSide;
          } else {
            width = Math.round((width * maxSide) / height);
            height = maxSide;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const outputFormat =
          file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          outputFormat,
          0.85
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * 1. uploadFoto(file, folder): string (URL)
 * - Validasi sisi klien: JPG, PNG, WEBP, GIF; maksimal 5 MB.
 * - Kompresi browser: sisi terpanjang maksimal 1600 px, kualitas 0.85, JPEG/WEBP.
 *   Pengecualian: logo dan favicon (PNG transparan) dikirim apa adanya.
 * - Kirim ke endpoint PHP dengan FormData tanpa header custom.
 * - Mengembalikan URL foto dari server hosting.
 */
export async function uploadFoto(file: File, folder: UploadFolder = 'lainnya'): Promise<string> {
  // 1. Validasi
  const validation = validateImageUpload(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'File tidak valid.');
  }

  // 2. Kompresi gambar jika bukan logo/favicon/transparan
  let fileToSend: Blob = file;
  if (!shouldSkipCompression(file, folder)) {
    try {
      fileToSend = await compressImageInBrowser(file);
    } catch (compressErr) {
      console.warn('Kompresi browser gagal, mengirim file asli:', compressErr);
      fileToSend = file;
    }
  }

  // 3. Ambil idToken dari Firebase Auth jika tersedia
  let idToken = '';
  try {
    if (auth?.currentUser) {
      idToken = await auth.currentUser.getIdToken();
    }
  } catch (tokenErr) {
    console.warn('Gagal mengambil ID Token Firebase Auth:', tokenErr);
  }

  // 4. Siapkan FormData
  const formData = new FormData();
  formData.append('action', 'upload');
  formData.append('folder', folder);
  formData.append('idToken', idToken);
  formData.append('file', fileToSend, file.name);

  // 5. Kirim HTTP POST ke endpoint upload
  let response: Response;
  try {
    response = await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData
    });
  } catch (netErr) {
    console.error('Fetch UPLOAD_ENDPOINT error:', netErr);
    throw new Error('Gagal menghubungi server upload. Coba lagi nanti.');
  }

  if (!response.ok) {
    console.error('UPLOAD_ENDPOINT returned non-200 status:', response.status);
    throw new Error('Gagal menghubungi server upload. Coba lagi nanti.');
  }

  let result: any;
  try {
    result = await response.json();
  } catch (jsonErr) {
    console.error('Parse JSON UPLOAD_ENDPOINT error:', jsonErr);
    throw new Error('Gagal menghubungi server upload. Coba lagi nanti.');
  }

  if (result && result.ok && result.url) {
    return result.url;
  }

  if (result && result.error) {
    throw new Error(result.error);
  }

  throw new Error('Gagal menghubungi server upload. Coba lagi nanti.');
}

/**
 * 2. hapusFoto(url): kirim FormData { action: "delete", url, idToken }
 * - Hanya dipanggil jika URL memuat "/uploads/" dan domainnya berakhiran "spensata.sch.id".
 * - URL lain (misalnya foto lama dari Firebase Storage) dilewati tanpa error.
 * - Kegagalan hapus tidak boleh menghalangi proses lain (cukup catat ke console).
 */
export async function hapusFoto(url?: string | null): Promise<void> {
  if (!url || typeof url !== 'string') return;
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return;

  // Validasi URL: harus memuat "/uploads/" dan domain berakhiran "spensata.sch.id"
  try {
    const parsed = new URL(trimmedUrl);
    const hasUploadsPath = parsed.pathname.includes('/uploads/');
    const isSpensataDomain = parsed.hostname.toLowerCase().endsWith('spensata.sch.id');

    if (!hasUploadsPath || !isSpensataDomain) {
      return;
    }
  } catch {
    // Bukan URL valid
    return;
  }

  try {
    let idToken = '';
    if (auth?.currentUser) {
      idToken = await auth.currentUser.getIdToken();
    }

    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('url', trimmedUrl);
    formData.append('idToken', idToken);

    await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData
    });
  } catch (err) {
    console.warn('Gagal menghapus foto lama di server hosting:', err);
  }
}
