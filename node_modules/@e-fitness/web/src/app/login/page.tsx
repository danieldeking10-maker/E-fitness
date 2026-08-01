'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Activity } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-bg text-white selection:bg-neon selection:text-bg flex flex-col relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon/5 blur-[150px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neon/5 blur-[120px] rounded-full -z-10"></div>

      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full px-6 py-6 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="h-9 w-9 bg-neon rounded-xl flex items-center justify-center text-bg font-black text-lg group-hover:rotate-12 transition-transform duration-500 shadow-neon-glow/20">E</div>
            <span className="font-heading text-xl font-bold tracking-tighter">E-fitness</span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 pt-24">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center mb-12">
            <h1 className="font-heading text-5xl font-bold tracking-tighter mb-4">
              Welcome <span className="text-neon">Back.</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium">Access your neural training ecosystem.</p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-[3rem] p-10 md:p-12 shadow-2xl border-white/5 space-y-8">
            <div className="space-y-5">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm outline-none focus:border-neon/40 transition-all placeholder:text-zinc-700"
                required
              />
            </div>

            <div className="space-y-5">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm outline-none focus:border-neon/40 transition-all pr-14 placeholder:text-zinc-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-neon transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-neon rounded border-zinc-700" />
                <span className="text-zinc-500 font-medium">Remember device</span>
              </label>
              <a href="#" className="text-neon font-bold hover:underline">Reset Identity</a>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full btn-neon py-5 text-sm group disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Sign In
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>

            <p className="text-center text-zinc-600 text-xs font-medium">
              No profile yet?{' '}
              <Link href="/register" className="text-neon font-bold hover:underline">Initialize Account</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
