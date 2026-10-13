import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';
import { useSchoolData } from '../context/SchoolDataContext';

interface AdminLoginProps {
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { data } = useSchoolData();
  const ADMIN_EMAIL = 'admin@spensata.sch.id';
  const [email, setEmail] = useState('admin@spensata.sch.id');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (normalizedEmail !== ADMIN_EMAIL) {
        throw new Error(`Akses ditolak. Hanya email ${ADMIN_EMAIL} yang terdaftar sebagai satu-satunya administrator.`);
      }

      if (isFirebaseConfigured() && auth) {
        await signInWithEmailAndPassword(auth, normalizedEmail, password);
      } else {
        // Mode pratinjau / offline saat kredensial Firebase belum dimasukkan
        if (password !== '123456') {
          throw new Error('Kata sandi salah. Kata sandi untuk admin@spensata.sch.id adalah 123456.');
        }
        localStorage.setItem('spensata_demo_admin', 'true');
        window.location.reload();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      let msg = 'Gagal masuk. Periksa kembali email dan kata sandi Anda.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        msg = 'Email atau kata sandi tidak cocok. Pastikan akun admin@spensata.sch.id dengan kata sandi 123456 telah didaftarkan di Firebase Console.';
      } else if (err.code === 'auth/wrong-password') {
        msg = 'Kata sandi yang Anda masukkan salah. (Gunakan kata sandi: 123456)';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Format alamat email tidak valid.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Terlalu banyak percobaan masuk yang gagal. Silakan coba lagi nanti.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail(ADMIN_EMAIL);
    setPassword('123456');
    localStorage.setItem('spensata_demo_admin', 'true');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-slate-100">
      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-8">
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

        {/* Status Koneksi Firebase */}
        <div className="mb-6 p-3 rounded-xl bg-slate-700/50 border border-slate-600/60 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium">Status Penyimpanan:</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                isFirebaseConfigured()
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {isFirebaseConfigured() ? 'Firebase Terhubung' : 'Penyimpanan Offline/Demo'}
            </span>
          </div>
          {!isFirebaseConfigured() && (
            <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
              Kunci Firebase belum diatur di file lingkungan (.env). Anda dapat masuk menggunakan akun resmi <strong className="text-amber-300">admin@spensata.sch.id</strong> dengan kata sandi <strong className="text-amber-300">123456</strong>.
            </p>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-slate-900 bg-[#E5A823] hover:bg-[#d49818] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
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

        {!isFirebaseConfigured() && (
          <div className="mt-4 pt-4 border-t border-slate-700 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-xs text-amber-300 hover:text-amber-200 underline cursor-pointer"
            >
              Masuk Otomatis sebagai admin@spensata.sch.id (Pratinjau)
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
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
