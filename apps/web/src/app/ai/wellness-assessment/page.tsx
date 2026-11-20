'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Bone,
  Brain,
  CalendarDays,
  CheckCircle2,
  Flame,
  Target,
} from 'lucide-react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { getApiBaseUrl } from '@/lib/api';
import { getAthleteProfile, saveAthleteProfile } from '@/lib/athlete-store';
import { SiteNavbar } from '@/components/SiteNavbar';
import { SiteFooter } from '@/components/SiteFooter';

type Step = 1 | 2 | 3;

export default function WellnessAssessmentPage() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    goals: '',
    constraints: [] as string[],
    sleepQuality: 75,
    frequency: '3',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = getAthleteProfile();
    if (existing.goals) {
      setFormData({
        goals: existing.goals,
        constraints: existing.constraints || [],
        sleepQuality: existing.sleepQuality || 75,
        frequency: existing.frequency || '3',
      });
    }
  }, []);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
      );
    }
  }, [step, result]);

  const handleNext = () => {
    if (step < 3) setStep((s) => (s + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/ai/wellness-assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goals: formData.goals,
          constraints: formData.constraints,
          sleepQuality: formData.sleepQuality,
          frequency: formData.frequency,
        }),
      });

      const data = await res.json();
      setResult(data);

      saveAthleteProfile({
        goals: formData.goals,
        constraints: formData.constraints,
        sleepQuality: formData.sleepQuality,
        frequency: formData.frequency,
        readinessScore:
          data.readinessScore ||
          Math.min(96, Math.max(60, Math.round(formData.sleepQuality * 0.8 + 20))),
        lastAssessmentDate: new Date().toLocaleDateString(),
      });
    } catch (err) {
      console.error(err);
      const fallbackScore = Math.min(
        96,
        Math.max(60, Math.round(formData.sleepQuality * 0.8 + 20))
      );
      setResult({
        readinessScore: fallbackScore,
        assessment: {
          summary:
            'Intake parameters synchronized. Neurological readiness calibrated to recovery metrics.',
        },
        recommendations: [
          'Prioritize knee stability exercises (Bulgarian Split Squats and eccentric loading).',
          'Maintain consistent sleep cycles (7.5 - 8.5 hours) to support central nervous system recovery.',
          'Target 2.0g/kg protein intake distributed across 3-4 meals for muscular synthesis.',
          'Implement 10 minutes of post-session diaphragmatic breathwork to accelerate autonomic calming.',
        ],
      });
      saveAthleteProfile({
        goals: formData.goals,
        constraints: formData.constraints,
        sleepQuality: formData.sleepQuality,
        frequency: formData.frequency,
        readinessScore: fallbackScore,
        lastAssessmentDate: new Date().toLocaleDateString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-white selection:bg-neon selection:text-bg flex flex-col">
      <SiteNavbar />

      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {!result ? (
            <>
              <header className="text-center mb-10">
                <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-neon mb-3">
                  Biometric Intake Protocol
                </div>
                <h1 className="font-heading text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
                  Wellness <span className="text-neon">Assessment</span>
                </h1>
                <p className="text-zinc-400 font-mono text-xs tabular">
                  Step {step} of 3 ·{' '}
                  {step === 1
                    ? 'Primary Objectives'
                    : step === 2
                    ? 'Biological Constraints'
                    : 'Training Cadence'}
                </p>
              </header>

              <div
                ref={cardRef}
                className="bg-surface/90 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10"
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-neon" />
                      <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-300">
                        Primary Objective
                      </label>
                    </div>
                    <textarea
                      autoFocus
                      className="w-full bg-black/40 border border-white/15 rounded-2xl p-6 text-base outline-none focus:border-neon/60 transition-colors min-h-[180px] leading-relaxed placeholder:text-zinc-600"
                      placeholder="Describe your 12-week target... (e.g. increase squat strength, improve 5k pace, build shoulder mobility)"
                      value={formData.goals}
                      onChange={(e) =>
                        setFormData({ ...formData, goals: e.target.value })
                      }
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-10">
                    <div>
                      <div className="flex items-center gap-3 mb-5">
                        <Brain className="w-4 h-4 text-neon" />
                        <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-300">
                          Physical Constraints
                        </label>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {[
                          { id: 'knee', label: 'Knee Sensitivity', icon: Flame },
                          { id: 'back', label: 'Lower Back Pain', icon: Bone },
                          { id: 'mobility', label: 'Limited Mobility', icon: Activity },
                          { id: 'custom', label: 'Shoulder Impingement', icon: Brain },
                        ].map((item) => {
                          const selected = formData.constraints.includes(item.label);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  constraints: selected
                                    ? formData.constraints.filter(
                                        (c) => c !== item.label
                                      )
                                    : [...formData.constraints, item.label],
                                });
                              }}
                              className={cn(
                                'p-5 rounded-2xl border transition-all flex items-center gap-3.5 text-left',
                                selected
                                  ? 'border-neon bg-neon/10 text-white'
                                  : 'border-white/10 bg-black/30 text-zinc-400 hover:border-white/25'
                              )}
                            >
                              <item.icon
                                className={cn(
                                  'w-5 h-5',
                                  selected ? 'text-neon' : 'text-zinc-500'
                                )}
                              />
                              <span className="text-sm font-bold">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <Activity className="w-4 h-4 text-neon" />
                          <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-300">
                            Sleep Quality Index
                          </label>
                        </div>
                        <span className="text-neon font-mono font-bold text-sm tabular">
                          {formData.sleepQuality}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        className="w-full h-1.5 bg-zinc-900 rounded-full appearance-none accent-neon cursor-pointer"
                        value={formData.sleepQuality}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sleepQuality: parseInt(e.target.value, 10),
                          })
                        }
                      />
                      <div className="flex justify-between mt-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                        <span>Sleep Deprived</span>
                        <span>Elite Recovery</span>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <CalendarDays className="w-4 h-4 text-neon" />
                        <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-300">
                          Weekly Commitment
                        </label>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {['1-2', '3', '4', '5+'].map((freq) => (
                          <button
                            key={freq}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, frequency: freq })
                            }
                            className={cn(
                              'py-6 rounded-2xl border font-heading font-black text-2xl transition-all tabular',
                              formData.frequency === freq
                                ? 'border-neon bg-neon text-bg'
                                : 'border-white/10 bg-black/30 text-zinc-400 hover:border-white/25 hover:text-white'
                            )}
                          >
                            {freq}
                          </button>
                        ))}
                      </div>
                      <p className="text-center mt-5 text-zinc-400 text-xs font-mono uppercase tracking-widest">
                        Training days per week
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-12 flex items-center justify-between gap-4">
                  <div className="flex gap-2.5">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={cn(
                          'h-1.5 rounded-full transition-all duration-500',
                          step === s ? 'w-10 bg-neon' : 'w-4 bg-zinc-800'
                        )}
                      />
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="btn-glass px-6 py-3 text-xs"
                      >
                        Back
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={step === 3 ? handleSubmit : handleNext}
                      disabled={loading || (step === 1 && !formData.goals)}
                      className="btn-neon px-8 py-3 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 animate-spin" />
                          <span>Analyzing...</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <span>
                            {step === 3 ? 'Finalize Analysis' : 'Next Step'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div
              ref={cardRef}
              className="bg-surface/90 rounded-3xl p-8 md:p-12 shadow-2xl border border-neon/35"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-neon mb-5">
                  <CheckCircle2 className="w-8 h-8 text-bg" />
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
                  Biometrics <span className="text-neon">Synced</span>
                </h2>
                <p className="text-zinc-300 text-sm max-w-md mx-auto mb-7 leading-relaxed">
                  {result.assessment?.summary ||
                    `Profile calibrated for ${formData.frequency} days/week training cadence.`}
                </p>

                <div className="max-w-xs mx-auto p-5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                      Readiness Index
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      Sleep & constraints factored
                    </div>
                  </div>
                  <div className="text-3xl font-heading font-black text-neon tabular">
                    {result.readinessScore || 85}%
                  </div>
                </div>
              </div>

              <div className="bg-black/50 rounded-2xl p-7 border border-white/10 mb-8">
                <p className="text-[11px] font-mono text-neon uppercase tracking-[0.24em] mb-5">
                  Core Recommendations
                </p>
                <div className="space-y-3.5">
                  {(result.recommendations || []).map((rec: string, i: number) => (
                    <div key={i} className="flex gap-3.5 items-start">
                      <span className="font-mono text-xs text-neon font-bold mt-0.5 tabular">
                        0{i + 1}
                      </span>
                      <p className="text-zinc-200 text-sm leading-relaxed">
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <Link
                  href="/ai/workout-generator"
                  className="btn-neon py-3.5 text-xs text-center font-bold"
                >
                  Generate Workout
                </Link>
                <Link
                  href="/dashboard"
                  className="btn-glass py-3.5 text-xs text-center font-bold"
                >
                  Athlete Hub
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setStep(1);
                  }}
                  className="py-3.5 text-xs text-zinc-300 hover:text-white transition-colors border border-white/15 rounded-full font-bold"
                >
                  Re-assess
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
