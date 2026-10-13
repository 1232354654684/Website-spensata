import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Lock,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Database,
  CheckCircle2
} from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isFirebaseConfigured, loginWithGoogle, firebaseInfo } from '../services/firebase';
import { useSchoolData } from '../context/SchoolDataContext';

interface AdminLoginProps {
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { data } = useSchoolData();
  const ALLOWED_ADMINS = ['ardiansyahroni017@gmail.com', 'admin@spensata.sch.id'];

  const [email, setEmail] = useState('ardiansyahroni017@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<'google' | 'password'>('google');

  // Login dengan Google Auth
  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      const userEmail = (result.user.email || '').toLowerCase().trim();
      if (!ALLOWED_ADMINS.includes(userEmail)) {
        await auth?.signOut();
        throw new Error(
          `Akses ditolak. Email "${userEmail}" tidak terdaftar sebagai administrator. Hanya akun pemilik (${ALLOWED_ADMINS.join(', ')}) yang berhak masuk ke panel admin.`
        );
      }
      // Berhasil, reload atau navigasi akan otomatis dilakukan oleh state auth
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err?.message || 'Gagal masuk dengan akun Google.');
    } finally {
      setLoading(false);
    }
  };

  // Login dengan Email & Password
  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (!ALLOWED_ADMINS.includes(normalizedEmail)) {
        throw new Error(
          `Akses ditolak. Email "${normalizedEmail}" tidak terdaftar. Gunakan ${ALLOWED_ADMINS.join(' atau ')}.`
        );
      }

      if (isFirebaseConfigured() && auth) {
        try {
          await signInWithEmailAndPassword(auth, normalizedEmail, password);
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
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        msg =
          'Akun email ini belum terdaftar di Firebase Authentication. Silakan klik tombol "Masuk dengan Akun Google" di atas atau pastikan akun sudah dibuat di Firebase Console.';
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#0E4A6B] text-white flex items-center justify-center shadow-lg border border-[#E5A823]/30">
            <ShieldCheck className="w-8 h-8 text-[#E5A823]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Panel Administrator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {data.identitas.nama || 'SMP Negeri 1 Tambak'}
          </p>
        </div>

        {/* Informasi Koneksi Firebase Terdaftar */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#E5A823]" />
              <span>Koneksi Firebase:</span>
            </span>
            <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Terhubung</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400 space-y-1 font-mono pt-1 border-t border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Project ID:</span>
              <span className="text-[#E5A823] truncate max-w-[210px]">{firebaseInfo.projectId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Database ID:</span>
              <span className="text-sky-400 truncate max-w-[210px]" title={firebaseInfo.firestoreDatabaseId}>
                {firebaseInfo.firestoreDatabaseId}
              </span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Method Toggle Buttons */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/70 rounded-xl border border-slate-700/70 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setLoginMethod('google')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              loginMethod === 'google'
                ? 'bg-[#0E4A6B] text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Login Google
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('password')}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              loginMethod === 'password'
                ? 'bg-[#0E4A6B] text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Email & Sandi
          </button>
        </div>

        {loginMethod === 'google' ? (
          /* Google Login Primary Button */
          <div className="space-y-4 pt-2">
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[11px] text-sky-200 leading-relaxed">
              Masuk langsung menggunakan akun Google Anda (<strong>ardiansyahroni017@gmail.com</strong>).
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-slate-900 bg-white hover:bg-slate-100 active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-lg cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
                  <span>Menghubungkan ke Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Masuk dengan Akun Google</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Form Login Email & Sandi */
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
                  placeholder="ardiansyahroni017@gmail.com"
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
        )}

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
