'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Activity,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Play,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AthleteProfile,
  getAthleteProfile,
  toggleEventRegistration,
} from '@/lib/athlete-store';
import { FITNESS_EVENTS } from '@/data/fitness-events';
import { SiteNavbar } from '@/components/SiteNavbar';
import { SiteFooter } from '@/components/SiteFooter';

export default function DashboardPage() {
  const [profile, setProfile] = useState<AthleteProfile | null>(null);
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>({
    Mon: true,
    Tue: true,
    Wed: false,
    Thu: true,
    Fri: false,
    Sat: false,
    Sun: false,
  });

  useEffect(() => {
    setProfile(getAthleteProfile());

    const handleUpdate = () => {
      setProfile(getAthleteProfile());
    };
    window.addEventListener('athlete_profile_updated', handleUpdate);
    return () => window.removeEventListener('athlete_profile_updated', handleUpdate);
  }, []);

  const toggleDay = (day: string) => {
    setCompletedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const readiness = profile?.readinessScore || 86;
  const activePlan = profile?.activeWorkoutPlan;
  const registeredEvents = FITNESS_EVENTS.filter((ev) =>
    (profile?.registeredEventIds || []).includes(ev.id)
  );
  const completedDaysCount = Object.values(completedDays).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-bg text-white selection:bg-neon selection:text-bg flex flex-col">
      <SiteNavbar />

      <main className="flex-1 pt-28 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-neon mb-2">
                Athlete Command Center
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight">
                {profile?.name || 'Athlete'} · Performance Hub
              </h1>
              <p className="text-zinc-400 text-xs mt-1.5 font-mono">
                {profile?.email || 'athlete@e-fitness.io'} · Last Calibration:{' '}
                {profile?.lastAssessmentDate || 'Recent'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/ai/wellness-assessment"
                className="btn-glass px-5 py-3 text-xs font-bold flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-neon" />
                <span>Recalibrate Intake</span>
              </Link>
              <Link
                href="/ai/wellness-companion"
                className="btn-neon px-5 py-3 text-xs font-bold flex items-center gap-2"
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Open Companion</span>
              </Link>
            </div>
          </header>

          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface/90 p-6 rounded-3xl border border-neon/40 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                  CNS Readiness
                </span>
                <Activity className="w-4 h-4 text-neon" />
              </div>
              <div className="my-4">
                <div className="text-5xl font-heading font-black tracking-tight text-white tabular">
                  {readiness}
                  <span className="text-xl text-neon font-normal">%</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  {readiness >= 80
                    ? 'Optimal neuromuscular firing'
                    : 'Moderate CNS fatigue. Respect RPE limits.'}
                </p>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neon transition-all duration-700"
                  style={{ width: `${readiness}%` }}
                />
              </div>
            </div>

            <div className="bg-surface/90 p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                  Sleep Architecture
                </span>
                <Clock className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="my-4">
                <div className="text-4xl font-heading font-black tracking-tight text-white tabular">
                  {profile?.sleepQuality || 80}
                  <span className="text-lg text-zinc-400 font-normal">%</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Slow-wave deep restoration cycle
                </p>
              </div>
              <div className="text-[11px] font-mono text-zinc-500">
                Target: 7.5 – 8.5 Hours
              </div>
            </div>

            <div className="bg-surface/90 p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                  Target Cadence
                </span>
                <Calendar className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="my-4">
                <div className="text-4xl font-heading font-black tracking-tight text-white tabular">
                  {profile?.frequency || '4'}{' '}
                  <span className="text-sm text-zinc-400 font-normal uppercase">
                    Days / Wk
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Microcycle split periodization
                </p>
              </div>
              <div className="text-[11px] font-mono text-zinc-500">
                Split: Upper / Lower / Kinetic
              </div>
            </div>

            <div className="bg-surface/90 p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                  Logged Sessions
                </span>
                <CheckCircle2 className="w-4 h-4 text-neon" />
              </div>
              <div className="my-4">
                <div className="text-4xl font-heading font-black tracking-tight text-white tabular">
                  {profile?.completedWorkoutsCount || 14}
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Historical sessions completed
                </p>
              </div>
              <div className="text-[11px] font-mono text-neon">
                {registeredEvents.length} Upcoming Events Saved
              </div>
            </div>
          </div>

          {/* Registered Fitness Events */}
          <section className="bg-surface/90 rounded-3xl p-7 md:p-9 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-neon mb-1">
                  3D Stage & Schedule Reservations
                </div>
                <h2 className="font-heading text-2xl font-bold tracking-tight">
                  Registered Fitness Events
                </h2>
              </div>
              <Link
                href="/#events"
                className="text-xs font-bold text-neon hover:underline flex items-center gap-1"
              >
                <span>Browse All 5 Events</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {registeredEvents.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-sm text-zinc-400">
                  No fitness events saved yet. Select any discipline on the welcoming 3D stage to reserve your spot.
                </p>
                <Link
                  href="/#events"
                  className="inline-flex items-center gap-2 text-xs font-bold text-neon hover:underline"
                >
                  <span>Explore Events</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {registeredEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={ev.img}
                        alt={ev.title}
                        className="h-16 w-20 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div>
                        <div className="text-[11px] font-mono text-neon">
                          {ev.category} · {ev.schedule}
                        </div>
                        <div className="font-heading font-bold text-base text-white">
                          {ev.title}
                        </div>
                        <div className="text-xs text-zinc-400">
                          {ev.coach} · {ev.durationMinutes} min
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Link
                        href={`/ai/workout-generator?event=${ev.id}`}
                        className="px-3.5 py-2 rounded-xl bg-neon text-bg text-xs font-bold whitespace-nowrap"
                      >
                        Launch
                      </Link>
                      <button
                        type="button"
                        onClick={() => setProfile(toggleEventRegistration(ev.id))}
                        aria-label={`Remove ${ev.title}`}
                        className="p-2 rounded-xl bg-white/[0.05] text-zinc-400 hover:text-white border border-white/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Main Grid: Active Protocol + Microcycle / Intake */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-surface/90 rounded-3xl p-7 md:p-9 border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-neon mb-1">
                    Active Prescribed Protocol
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
                    {activePlan?.title || 'Hypertrophy & Kinetic Balance'}
                  </h2>
                  <p className="text-xs font-mono text-zinc-400 mt-1 tabular">
                    Focus: {activePlan?.focus || 'Hypertrophy'} ·{' '}
                    {activePlan?.duration || 45} Minutes ·{' '}
                    {activePlan?.exercises?.length || 4} Exercises
                  </p>
                </div>

                <Link
                  href="/ai/workout-generator"
                  className="btn-neon px-6 py-3 text-xs font-bold flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Session</span>
                </Link>
              </div>

              <div className="space-y-3">
                {(
                  activePlan?.exercises || [
                    {
                      name: 'Barbell Back Squat',
                      focus: 'Quads & Glutes',
                      sets: 4,
                      reps: 8,
                      load: '75% 1RM',
                    },
                    {
                      name: 'Bulgarian Split Squat',
                      focus: 'Unilateral Force',
                      sets: 3,
                      reps: 10,
                      load: 'RPE 8',
                    },
                    {
                      name: 'Romanian Deadlift',
                      focus: 'Posterior Chain',
                      sets: 3,
                      reps: 10,
                      load: 'RPE 7.5',
                    },
                    {
                      name: 'Pallof Core Matrix',
                      focus: 'Anti-Rotational Trunk',
                      sets: 3,
                      reps: 12,
                      load: 'Controlled',
                    },
                  ]
                ).map((ex: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between hover:border-white/25 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-xl bg-neon/10 text-neon flex items-center justify-center font-mono font-bold text-xs tabular">
                        0{idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">
                          {ex.name}
                        </div>
                        <div className="text-xs text-zinc-400">{ex.focus}</div>
                      </div>
                    </div>

                    <div className="text-right font-mono tabular">
                      <div className="text-sm font-bold text-white">
                        {ex.sets} × {ex.reps}
                      </div>
                      <div className="text-[11px] text-neon">{ex.load}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-surface/90 rounded-3xl p-7 border border-white/10 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-lg">
                    Weekly Schedule
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Tap day
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                    (day) => {
                      const done = completedDays[day];
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={cn(
                            'py-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1',
                            done
                              ? 'bg-neon text-bg border-neon font-bold'
                              : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:border-white/25'
                          )}
                        >
                          <span className="text-[10px] uppercase font-mono">
                            {day}
                          </span>
                          <CheckCircle2
                            className={cn(
                              'w-3.5 h-3.5',
                              done ? 'opacity-100' : 'opacity-30'
                            )}
                          />
                        </button>
                      );
                    }
                  )}
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed tabular">
                  {completedDaysCount} of {profile?.frequency || '4'} target sessions logged this week.
                </p>
              </div>

              <div className="bg-surface/90 rounded-3xl p-7 border border-white/10 space-y-4">
                <h3 className="font-heading font-bold text-lg">
                  Athlete Intake Profile
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-1">
                      Primary Objective
                    </span>
                    <span className="text-zinc-200 font-medium">
                      {profile?.goals || 'Hypertrophy & Strength'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-1">
                      Physical Constraints
                    </span>
                    <span className="text-zinc-200 font-medium">
                      {profile?.constraints?.length
                        ? profile.constraints.join(', ')
                        : 'None registered'}
                    </span>
                  </div>
                </div>

                <Link
                  href="/ai/wellness-assessment"
                  className="w-full py-3 rounded-xl border border-white/15 hover:border-neon/50 hover:text-neon text-zinc-300 text-xs font-bold text-center block transition-colors"
                >
                  Update Biometric Parameters
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
