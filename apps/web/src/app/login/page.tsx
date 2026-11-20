'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { saveAthleteProfile } from '@/lib/athlete-store';
import { SiteNavbar } from '@/components/SiteNavbar';
import { SiteFooter } from '@/components/SiteFooter';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    saveAthleteProfile({
      email,
      name: email
        .split('@')[0]
        .replace('.', ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()),
    });

    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-bg text-white selection:bg-neon selection:text-bg flex flex-col">
      <SiteNavbar />

      <main className="flex-1 flex items-center justify-center px-6 pt-28 pb-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-neon mb-3">
              Member Portal
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
              Welcome <span className="text-neon">Back</span>
            </h1>
            <p className="text-zinc-400 text-sm">
              Access your athlete hub, saved combine events, and training protocols.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-surface/90 rounded-3xl p-8 md:p-10 shadow-2xl border border-white/10 space-y-6"
          >
            {success ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-neon mx-auto" />
                <h3 className="font-heading font-bold text-xl">
                  Identity Verified
                </h3>
                <p className="text-xs text-zinc-400">
                  Loading Athlete Performance Hub...
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@domain.com"
                    className="w-full bg-black/40 border border-white/15 rounded-2xl p-4 text-sm outline-none focus:border-neon/60 transition-colors placeholder:text-zinc-600"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 block">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-black/40 border border-white/15 rounded-2xl p-4 text-sm outline-none focus:border-neon/60 transition-colors placeholder:text-zinc-600 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-neon py-4 text-xs font-bold tracking-wider uppercase disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Activity className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>Access Athlete Hub</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </>
            )}

            <div className="pt-5 border-t border-white/10 text-center text-xs text-zinc-400">
              Don&apos;t have an athlete profile?{' '}
              <Link
                href="/register"
                className="text-neon hover:underline font-bold"
              >
                Register Now
              </Link>
            </div>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
