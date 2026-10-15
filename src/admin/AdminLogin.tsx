import React, { useState } from 'react';
import {
  Mail,
  Lock,
  AlertCircle,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../services/firebase';
import { useSchoolData } from '../context/SchoolDataContext';
import { SchoolLogo } from '../components/SchoolLogo';

interface AdminLoginProps {
  onBackToSite: () => void;
}

const PRIMARY_ADMIN_EMAILS = [
  'ardiansyahroni017@gmail.com',
  'admin@spensata.sch.id'
];

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { data } = useSchoolData();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login dengan Email & Password
  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (isFirebaseConfigured() && auth) {
        try {
          const userCred = await signInWithEmailAndPassword(auth, normalizedEmail, password);
          const loggedEmail = (userCred.user.email || normalizedEmail).toLowerCase().trim();

          // Cek apakah pemilik utama atau ada di koleksi administrators
          const isPrimary = PRIMARY_ADMIN_EMAILS.includes(loggedEmail);
          let isSecondary = false;

          if (!isPrimary && db) {
            const adminDoc = await getDoc(doc(db, 'administrators', loggedEmail));
            isSecondary = adminDoc.exists();
          }

          if (!isPrimary && !isSecondary) {
            await signOut(auth);
            throw new Error('Akses ditolak. Akun ini tidak memiliki izin administrator.');
          }
        } catch (firebaseErr: any) {
          // Jika akun belum dibuat di Firebase Console, izinkan demo jika password 123456
          if (
            password === '123456' &&
            (firebaseErr.code === 'auth/user-not-found' ||
              firebaseErr.code === 'auth/invalid-credential')
          ) {
            localStorage.setItem('spensata_demo_admin', 'true');
            window.location.reload();
            return;
          }
          throw firebaseErr;
        }
      } else {
        if (password !== '123456') {
          throw new Error('Kata sandi salah. Kata sandi default adalah 123456.');
        }
        localStorage.setItem('spensata_demo_admin', 'true');
        window.location.reload();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      let msg = 'Gagal masuk. Periksa kembali email dan kata sandi Anda.';
      if (err.message === 'Akses ditolak. Akun ini tidak memiliki izin administrator.') {
        msg = err.message;
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        msg = 'Email atau kata sandi salah. Hubungi administrator situs jika Anda lupa kata sandi.';
      } else if (err.code === 'auth/wrong-password') {
        msg = 'Kata sandi yang Anda masukkan salah.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Format alamat email tidak valid.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-slate-100">
      <div className="w-full max-w-md bg-slate-800/95 border border-slate-700 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-sm space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <SchoolLogo className="w-full h-full object-contain filter drop-shadow-md" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Panel Administrator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {data.identitas.nama || 'SMP Negeri 1 Tambak'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form Login Email & Sandi */}
        <form onSubmit={handleSubmitPassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Alamat Email Admin
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@spensata.sch.id"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823] focus:ring-1 focus:ring-[#E5A823]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#E5A823] focus:ring-1 focus:ring-[#E5A823]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-slate-900 bg-[#E5A823] hover:bg-[#d49818] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <span>Masuk ke Dashboard</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBackToSite}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Publik</span>
          </button>
        </div>
      </div>
    </div>
  );
};
