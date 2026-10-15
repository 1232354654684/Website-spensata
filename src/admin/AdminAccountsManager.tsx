import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Info,
  Calendar,
  Send
} from 'lucide-react';
import { initializeApp, deleteApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut as secondarySignOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, auth, firebaseConfig, isFirebaseConfigured } from '../services/firebase';
import { useSchoolData } from '../context/SchoolDataContext';
import { Administrator } from '../types';

const PRIMARY_ADMIN_EMAILS = [
  'ardiansyahroni017@gmail.com',
  'admin@spensata.sch.id'
];

export const AdminAccountsManager: React.FC = () => {
  const { currentUser } = useSchoolData();

  // Form states
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Action status (reset email & delete)
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Delete confirmation modal
  const [adminToDelete, setAdminToDelete] = useState<Administrator | null>(null);

  // Admins list from Firestore
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  // Real-time listener to 'administrators' collection
  useEffect(() => {
    if (!isFirebaseConfigured() || !db) {
      setLoadingAdmins(false);
      return;
    }

    const unsub = onSnapshot(
      collection(db, 'administrators'),
      (snapshot) => {
        const list: Administrator[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            email: docSnap.id,
            nama: data.nama || docSnap.id,
            dibuatOleh: data.dibuatOleh || '-',
            dibuatPada: data.dibuatPada || ''
          });
        });
        // Urutkan berdasarkan tanggal pembuatan terbaru
        list.sort((a, b) => (b.dibuatPada || '').localeCompare(a.dibuatPada || ''));
        setAdministrators(list);
        setLoadingAdmins(false);
      },
      (error) => {
        console.error('Error listening to administrators:', error);
        setLoadingAdmins(false);
      }
    );

    return () => unsub();
  }, []);

  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(d);
    } catch {
      return isoString;
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setActionNotice(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanNama = nama.trim();

    // 1. Validasi Format Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setFormError('Format alamat email tidak valid.');
      return;
    }

    // 2. Cegah email pemilik atau email yang sudah terdaftar
    if (PRIMARY_ADMIN_EMAILS.includes(cleanEmail)) {
      setFormError('Alamat email ini adalah akun pemilik utama yang sudah memiliki hak akses penuh.');
      return;
    }

    const emailExists = administrators.some(
      (a) => a.email.toLowerCase() === cleanEmail
    );
    if (emailExists) {
      setFormError(`Alamat email "${cleanEmail}" sudah terdaftar di daftar administrator.`);
      return;
    }

    // 3. Validasi Kata Sandi Minimal 8 Karakter
    if (password.length < 8) {
      setFormError('Kata sandi harus minimal 8 karakter.');
      return;
    }

    // 4. Validasi Konfirmasi Sandi
    if (password !== confirmPassword) {
      setFormError('Konfirmasi kata sandi tidak cocok. Harap periksa kembali.');
      return;
    }

    setIsSubmitting(true);

    // 5. Buat akun menggunakan instance Firebase kedua agar sesi admin aktif tidak terganggu
    const secondaryAppName = `admin-creator-${Date.now()}`;
    let secondaryApp: ReturnType<typeof initializeApp> | null = null;

    try {
      secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
      const secondaryAuth = getAuth(secondaryApp);

      // Buat akun di Firebase Authentication
      await createUserWithEmailAndPassword(secondaryAuth, cleanEmail, password);
      // Langsung signOut dari instance kedua
      await secondarySignOut(secondaryAuth);
    } catch (authErr: any) {
      console.error('Secondary Auth Creation Error:', authErr);
      let errMsg = 'Gagal membuat akun autentikasi.';
      if (authErr?.code === 'auth/email-already-in-use') {
        errMsg = 'Alamat email ini sudah terdaftar di Firebase Authentication. Jika ingin menjadikannya admin, daftarkan dokumen atau gunakan email lain.';
      } else if (authErr?.code === 'auth/weak-password') {
        errMsg = 'Kata sandi terlalu lemah. Gunakan minimal 8 karakter kombinasi huruf dan angka.';
      } else if (authErr?.code === 'auth/invalid-email') {
        errMsg = 'Format alamat email tidak valid menurut standar Firebase.';
      } else if (authErr?.message) {
        errMsg = authErr.message;
      }
      setFormError(errMsg);
      setIsSubmitting(false);
      return;
    } finally {
      if (secondaryApp) {
        try {
          await deleteApp(secondaryApp);
        } catch {
          // ignore
        }
      }
    }

    // 6. Simpan dokumen ke Firestore koleksi "administrators" memakai sesi admin aktif
    try {
      if (!db) {
        throw new Error('Koneksi Firestore belum siap.');
      }

      await setDoc(doc(db, 'administrators', cleanEmail), {
        email: cleanEmail,
        nama: cleanNama,
        dibuatOleh: currentUser?.email || 'admin@spensata.sch.id',
        dibuatPada: new Date().toISOString()
      });

      setFormSuccess(
        `Akun admin "${cleanNama}" (${cleanEmail}) berhasil dibuat dan diberikan hak administrator!`
      );
      // Reset form
      setNama('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (dbErr: any) {
      console.error('Firestore save administrator error:', dbErr);
      let errMsg = 'Akun Auth berhasil dibuat, namun gagal menyimpan data hak akses ke Firestore.';
      if (dbErr?.code === 'permission-denied' || dbErr?.message?.includes('insufficient permissions')) {
        errMsg = 'Tidak ada izin (permission-denied). Pastikan aturan firestore.rules sudah mengizinkan penulisan ke koleksi "administrators".';
      } else if (dbErr?.message) {
        errMsg = `${errMsg} (${dbErr.message})`;
      }
      setFormError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendResetEmail = async (targetEmail: string) => {
    setActionNotice(null);
    setActionLoading(`reset-${targetEmail}`);
    try {
      if (!auth) {
        throw new Error('Layanan Firebase Auth belum aktif.');
      }
      await sendPasswordResetEmail(auth, targetEmail);
      setActionNotice({
        type: 'success',
        text: `Email instruksi reset kata sandi telah dikirim ke "${targetEmail}".`
      });
    } catch (err: any) {
      console.error('Reset password email error:', err);
      let msg = 'Gagal mengirim email reset kata sandi.';
      if (err?.code === 'auth/user-not-found') {
        msg = 'Akun pengguna ini tidak ditemukan di Firebase Authentication.';
      } else if (err?.message) {
        msg = err.message;
      }
      setActionNotice({
        type: 'error',
        text: msg
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmRevokeAccess = async () => {
    if (!adminToDelete) return;
    const targetEmail = adminToDelete.email;
    setActionNotice(null);
    setActionLoading(`delete-${targetEmail}`);

    try {
      if (!db) {
        throw new Error('Koneksi database tidak tersedia.');
      }

      await deleteDoc(doc(db, 'administrators', targetEmail));
      setActionNotice({
        type: 'success',
        text: `Hak akses administrator untuk "${adminToDelete.nama}" (${targetEmail}) berhasil dicabut.`
      });
      setAdminToDelete(null);
    } catch (err: any) {
      console.error('Revoke admin access error:', err);
      let msg = 'Gagal mencabut hak akses administrator.';
      if (err?.code === 'permission-denied') {
        msg = 'Tidak ada izin untuk menghapus administrator dari Firestore.';
      } else if (err?.message) {
        msg = err.message;
      }
      setActionNotice({
        type: 'error',
        text: msg
      });
    } finally {
      setActionLoading(null);
    }
  };

  const currentLoggedInEmail = currentUser?.email?.toLowerCase().trim() || '';

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/70">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0E4A6B] border border-sky-400/30 flex items-center justify-center text-sky-300 flex-shrink-0 shadow-lg">
              <Users className="w-6 h-6 text-[#E5A823]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Kelola Akun Administrator</span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E5A823]/20 text-[#E5A823] border border-[#E5A823]/30">
                  {administrators.length + PRIMARY_ADMIN_EMAILS.length} Akun Terdaftar
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Tambah dan atur hak akses admin website SMP Negeri 1 Tambak tanpa perlu membuka Firebase Console.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Notices */}
        {actionNotice && (
          <div
            className={`mt-4 p-4 rounded-2xl text-xs flex items-start gap-3 animate-in fade-in ${
              actionNotice.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-200'
            }`}
          >
            {actionNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            )}
            <span className="leading-relaxed font-medium">{actionNotice.text}</span>
          </div>
        )}

        {/* Form Tambah Akun Admin Baru */}
        <div className="mt-6 pt-2">
          <div className="flex items-center gap-2 text-sm font-bold text-white mb-4">
            <UserPlus className="w-4 h-4 text-[#E5A823]" />
            <span>Tambah Akun Administrator Baru</span>
          </div>

          {formError && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed">{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed">{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nama Lengkap Admin <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Budi Santoso, S.Pd."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823] focus:ring-1 focus:ring-[#E5A823]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Alamat Email Admin <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh: admin2@spensata.sch.id"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823] focus:ring-1 focus:ring-[#E5A823]"
                  />
                </div>
              </div>

              {/* Kata Sandi */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kata Sandi (Min. 8 Karakter) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823] focus:ring-1 focus:ring-[#E5A823]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer"
                    title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Kata Sandi */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Konfirmasi Kata Sandi <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823] focus:ring-1 focus:ring-[#E5A823]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer"
                    title={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#E5A823] text-slate-900 hover:bg-[#d49818] active:scale-[0.99] transition flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mendaftarkan Admin...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Daftarkan Akun Admin</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tabel Daftar Admin */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-700/70">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Daftar Akun Administrator Aktif</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Semua akun di bawah ini memiliki akses penuh ke Dashboard dan penyimpanan Firestore.
            </p>
          </div>
        </div>

        {/* Info Box Penjelasan */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 space-y-2">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold text-slate-200">
                Mekanisme Hak Akses & Tombol &quot;Cabut Akses&quot;:
              </p>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Tombol <strong className="text-rose-400">&quot;Cabut Akses&quot;</strong> akan menghapus dokumen dari koleksi <code className="text-sky-300 bg-slate-800 px-1 py-0.5 rounded">administrators</code> di Firestore. Akun autentikasi Firebase pengguna tetap ada, namun akun tersebut <strong>tidak lagi dapat membuka dashboard</strong> maupun mengubah data sekolah karena dicegah oleh aturan keamanan <code className="text-amber-300 bg-slate-800 px-1 py-0.5 rounded">firestore.rules</code>.
              </p>
            </div>
          </div>
        </div>

        {loadingAdmins ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#E5A823]" />
            <span className="text-xs">Memuat daftar administrator...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Nama Administrator</th>
                  <th className="py-3 px-4">Alamat Email</th>
                  <th className="py-3 px-4">Peran / Hak Akses</th>
                  <th className="py-3 px-4">Dibuat Pada</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-xs">
                {/* 1. Baris Akun Pemilik Utama */}
                {PRIMARY_ADMIN_EMAILS.map((primaryEmail) => {
                  const isCurrent = currentLoggedInEmail === primaryEmail.toLowerCase();
                  return (
                    <tr
                      key={`primary-${primaryEmail}`}
                      className="hover:bg-slate-750/50 transition-colors bg-slate-900/30"
                    >
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#E5A823]/20 border border-[#E5A823]/40 text-[#E5A823] flex items-center justify-center font-bold text-xs">
                            P
                          </div>
                          <div>
                            <div>Pemilik Utama Situs</div>
                            {isCurrent && (
                              <span className="text-[10px] text-emerald-400 font-normal">
                                (Sesi Aktif Anda Saat Ini)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {primaryEmail}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E5A823]/20 text-[#E5A823] border border-[#E5A823]/30">
                          <Shield className="w-3 h-3" />
                          <span>Pemilik Utama</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        Sistem Inti (Bawaan)
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSendResetEmail(primaryEmail)}
                            disabled={actionLoading === `reset-${primaryEmail}`}
                            className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 transition cursor-pointer"
                            title="Kirim Email Reset Sandi"
                          >
                            {actionLoading === `reset-${primaryEmail}` ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <KeyRound className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <span
                            className="px-2 py-1 rounded text-[10px] text-slate-500 bg-slate-800/80 cursor-not-allowed"
                            title="Akun pemilik utama tidak boleh dicabut"
                          >
                            Terkunci
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* 2. Baris Administrator Tambahan dari Firestore */}
                {administrators.map((admin) => {
                  const isCurrent = currentLoggedInEmail === admin.email.toLowerCase();
                  const isPrimary = PRIMARY_ADMIN_EMAILS.includes(admin.email.toLowerCase());
                  const isSelfOrPrimary = isCurrent || isPrimary;

                  return (
                    <tr
                      key={admin.email}
                      className="hover:bg-slate-750/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#0E4A6B] border border-sky-400/30 text-sky-200 flex items-center justify-center font-bold text-xs uppercase">
                            {admin.nama.charAt(0) || 'A'}
                          </div>
                          <div>
                            <div>{admin.nama}</div>
                            {isCurrent && (
                              <span className="text-[10px] text-emerald-400 font-normal">
                                (Sesi Aktif Anda)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {admin.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Administrator</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{formatDate(admin.dibuatPada)}</span>
                        </div>
                        {admin.dibuatOleh && (
                          <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                            Oleh: {admin.dibuatOleh}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Tombol Kirim Email Reset Sandi */}
                          <button
                            type="button"
                            onClick={() => handleSendResetEmail(admin.email)}
                            disabled={actionLoading === `reset-${admin.email}`}
                            className="px-2.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20 transition flex items-center gap-1.5 cursor-pointer text-xs"
                            title="Kirim tautan reset kata sandi ke email ini"
                          >
                            {actionLoading === `reset-${admin.email}` ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <KeyRound className="w-3.5 h-3.5 text-sky-400" />
                            )}
                            <span className="hidden sm:inline">Reset Sandi</span>
                          </button>

                          {/* Tombol Cabut Akses */}
                          {isSelfOrPrimary ? (
                            <span
                              className="px-2.5 py-1.5 rounded-lg text-xs text-slate-500 bg-slate-800/80 cursor-not-allowed"
                              title="Akun Anda sendiri atau pemilik utama tidak dapat dicabut"
                            >
                              Tidak Dapat Dicabut
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setAdminToDelete(admin)}
                              disabled={actionLoading === `delete-${admin.email}`}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition flex items-center gap-1.5 cursor-pointer text-xs"
                              title="Cabut hak administrator akun ini"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                              <span className="hidden sm:inline">Cabut Akses</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {administrators.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-slate-500 text-xs italic"
                    >
                      Belum ada akun admin tambahan yang didaftarkan. Gunakan formulir di atas untuk menambahkan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Cabut Akses */}
      {adminToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-850 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Cabut Akses Administrator?</h4>
            </div>

            <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                Apakah Anda yakin ingin mencabut hak administrator untuk:
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                <div className="font-bold text-white text-sm">{adminToDelete.nama}</div>
                <div className="text-slate-400 font-mono text-[11px]">{adminToDelete.email}</div>
              </div>
              <p className="text-[11px] text-amber-300/90 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                Pencabutan akses ini akan menghapus dokumen dari database. Akun pengguna di Firebase Auth tetap ada, namun akun tersebut tidak lagi memiliki izin untuk mengakses Dashboard maupun mengubah data sekolah.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAdminToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmRevokeAccess}
                disabled={actionLoading === `delete-${adminToDelete.email}`}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {actionLoading === `delete-${adminToDelete.email}` ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mencabut...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Cabut Akses</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
