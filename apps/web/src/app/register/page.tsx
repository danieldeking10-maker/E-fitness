'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { saveAthleteProfile } from '@/lib/athlete-store';
import { SiteNavbar } from '@/components/SiteNavbar';
import { SiteFooter } from '@/components/SiteFooter';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    goal: 'Hypertrophy & Kinetic Balance',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!form.name || !form.email || form.password.length < 6) return;
      setStep(2);
      return;
    }

    setLoading(true);
    saveAthleteProfile({
      name: form.name,
      email: form.email,
      goals: form.goal,
      readinessScore: 88,
    });

    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  };

  const goals = [
    'Build Pure Strength & Force Output',
    'Hypertrophy & Kinetic Balance',
    'Conditioning & Cardiovascular VO2',
    'General Joint Resilience & Longevity',
  ];

  return (
    <div className="min-h-screen bg-bg text-white selection:bg-neon selection:text-bg flex flex-col">
      <SiteNavbar />

      <main className="flex-1 flex items-center justify-center px-6 pt-28 pb-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-500',
                    step === s ? 'w-8 bg-neon' : 'w-3 bg-zinc-800'
                  )}
                />
              ))}
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              Join <span className="text-neon">E-fitness</span>
            </h1>
            <p className="text-zinc-400 text-xs font-mono uppercase tracking-wider tabular">
              Step {step} of 2 · Setup athlete credentials
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
                  Profile Configured
                </h3>
                <p className="text-xs text-zinc-400">
                  Directing to Athlete Performance Hub...
                </p>
              </div>
            ) : step === 1 ? (
              <>
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Marcus Thorne"
                    className="w-full bg-black/40 border border-white/15 rounded-2xl p-4 text-sm outline-none focus:border-neon/60 transition-colors placeholder:text-zinc-600"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="marcus@athlete.io"
                    className="w-full bg-black/40 border border-white/15 rounded-2xl p-4 text-sm outline-none focus:border-neon/60 transition-colors placeholder:text-zinc-600"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 block">
                    Create Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder="At least 6 characters"
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
                  className="w-full btn-neon py-4 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2"
                >
                  <span>Continue to Goals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 block">
                    Primary Athletic Objective
                  </label>
                  <div className="space-y-2.5">
                    {goals.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setForm({ ...form, goal: g })}
                        className={cn(
                          'w-full p-4 rounded-2xl border text-left text-xs font-bold transition-colors',
                          form.goal === g
                            ? 'bg-neon/10 border-neon text-white'
                            : 'bg-black/30 border-white/10 text-zinc-400 hover:border-white/25'
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-glass px-6 py-4 text-xs font-bold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-neon py-4 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Activity className="w-4 h-4 animate-spin" />
                        <span>Initializing...</span>
                      </span>
                    ) : (
                      'Complete Athlete Profile'
                    )}
                  </button>
                </div>
              </>
            )}

            <div className="pt-5 border-t border-white/10 text-center text-xs text-zinc-400">
              Already have an athlete profile?{' '}
              <Link href="/login" className="text-neon hover:underline font-bold">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
