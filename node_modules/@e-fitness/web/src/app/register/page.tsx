'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Activity, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    goal: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
  };

  const goals = [
    'Build Strength',
    'Lose Fat',
    'Improve Endurance',
    'General Wellness',
  ];

  const isValidStep1 = form.name.trim() && form.email.trim() && form.password.trim().length >= 6;

  return (
    <main className="min-h-screen bg-bg text-white selection:bg-neon selection:text-bg flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-neon/5 blur-[150px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon/5 blur-[150px] rounded-full -z-10"></div>

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
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2].map(s => (
                <div key={s} className={cn(
                  "h-1.5 rounded-full transition-all duration-700",
                  step >= s ? "w-10 bg-neon shadow-neon-glow" : "w-4 bg-zinc-900"
                )} />
              ))}
            </div>
            <h1 className="font-heading text-5xl font-bold tracking-tighter mb-4">
              {step === 1 ? 'Create' : 'Your'}{' '}
              <span className="text-neon">{step === 1 ? 'Profile.' : 'Focus.'}</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium">
              {step === 1
                ? 'Initialize your neural training identity.'
                : 'Set your primary training objective.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-[3rem] p-10 md:p-12 shadow-2xl border-white/5 space-y-8">
            {step === 1 ? (
              <>
                <div className="space-y-5">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Alex Rivera"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm outline-none focus:border-neon/40 transition-all placeholder:text-zinc-700"
                    required
                  />
                </div>

                <div className="space-y-5">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
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
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      placeholder="Min. 6 characters"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm outline-none focus:border-neon/40 transition-all pr-14 placeholder:text-zinc-700"
                      required
                      minLength={6}
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
              </>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {goals.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm({ ...form, goal: g })}
                    className={cn(
                      "p-6 rounded-2xl border transition-all flex items-center justify-between text-left group",
                      form.goal === g
                        ? "border-neon bg-neon/10 text-white"
                        : "border-white/5 bg-black/20 text-zinc-500 hover:border-white/20"
                    )}
                  >
                    <span className="text-sm font-bold tracking-tight">{g}</span>
                    {form.goal === g && (
                      <div className="bg-neon rounded-full p-1">
                        <Check className="w-3.5 h-3.5 text-bg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (step === 1 && !isValidStep1) || (step === 2 && !form.goal)}
              className="w-full btn-neon py-5 text-sm group disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4 animate-spin" />
                  Initializing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  {step === 1 ? 'Continue to Goal' : 'Activate Account'}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>

            <p className="text-center text-zinc-600 text-xs font-medium">
              Already have a profile?{' '}
              <Link href="/login" className="text-neon font-bold hover:underline">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
