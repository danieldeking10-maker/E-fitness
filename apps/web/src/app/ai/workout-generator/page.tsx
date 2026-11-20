'use client';

import Link from 'next/link';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Award,
  Brain,
  Check,
  Clock,
  Dumbbell,
  Flame,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Timer,
  X,
  Zap,
} from 'lucide-react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { getApiBaseUrl } from '@/lib/api';
import { getAthleteProfile, saveAthleteProfile } from '@/lib/athlete-store';
import { FITNESS_EVENTS } from '@/data/fitness-events';
import { SiteNavbar } from '@/components/SiteNavbar';
import { SiteFooter } from '@/components/SiteFooter';

interface Exercise {
  name: string;
  focus: string;
  sets: number;
  reps: number | string;
  load: string;
  rest?: string;
  cue?: string;
  img: string;
}

interface WorkoutPlan {
  title: string;
  focus: string;
  duration: number | string;
  exercises: Exercise[];
  coachNotes: string;
}

const FALLBACK_PLAN: WorkoutPlan = {
  title: 'Hypertrophy & Kinetic Balance',
  focus: 'Hypertrophy',
  duration: 45,
  exercises: [
    {
      name: 'Barbell Back Squat',
      focus: 'Quads, Glutes & Spinal Erectors',
      sets: 4,
      reps: 8,
      load: '75% 1RM',
      rest: '120s',
      cue: 'Control 3-second descent, drive floor away while keeping ribcage clamped down.',
      img: '/images/workout_squat_technique_1790903690484.jpg',
    },
    {
      name: 'Bulgarian Split Squat',
      focus: 'Unilateral Force & Hip Stability',
      sets: 3,
      reps: 10,
      load: 'RPE 8',
      rest: '90s',
      cue: 'Slight forward torso pitch to load gluteus medius; avoid bouncing at bottom.',
      img: '/images/workout_split_squat_1790903700979.jpg',
    },
    {
      name: 'Romanian Deadlift',
      focus: 'Posterior Kinetic Chain',
      sets: 3,
      reps: 10,
      load: 'RPE 7.5',
      rest: '90s',
      cue: 'Push pelvis back toward the wall; maintain soft knee flexion and lats packed.',
      img: '/images/workout_deadlift_biomechanics_1790903711478.jpg',
    },
    {
      name: 'Pallof Core Matrix',
      focus: 'Anti-Rotational Trunk Stiffness',
      sets: 3,
      reps: 12,
      load: 'Controlled Load',
      rest: '60s',
      cue: 'Exhale through the press; lock hips straight forward with zero trunk twist.',
      img: '/images/athlete_recovery_biometrics_1790903721681.jpg',
    },
  ],
  coachNotes:
    'CNS profile primed. Maintain a deliberate 3-second eccentric tempo on compound movements to maximize mechanical tension without excessive tendon strain.',
};

function WorkoutGeneratorInner() {
  const searchParams = useSearchParams();
  const eventParam = searchParams.get('event');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [liveSessionOpen, setLiveSessionOpen] = useState(false);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);

  const matrixRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eventParam) {
      const matched = FITNESS_EVENTS.find((ev) => ev.id === eventParam);
      if (matched) {
        const eventPlan: WorkoutPlan = {
          title: matched.title,
          focus: matched.category,
          duration: matched.durationMinutes,
          exercises: matched.exercises,
          coachNotes: matched.coachNotes,
        };
        setPlan(eventPlan);
        saveAthleteProfile({ activeWorkoutPlan: eventPlan });
        return;
      }
    }

    const profile = getAthleteProfile();
    if (profile.activeWorkoutPlan) {
      setPlan(profile.activeWorkoutPlan);
    }
  }, [eventParam]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  useEffect(() => {
    if (plan && matrixRef.current) {
      gsap.fromTo(
        matrixRef.current.children,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' }
      );
    }
  }, [plan]);

  const onGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSavedSuccess(false);
    const formData = new FormData(e.currentTarget);
    const fitnessLevel = formData.get('fitnessLevel');
    const focus = formData.get('focus');
    const duration = formData.get('duration');

    setLoading(true);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/ai/workout-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fitnessLevel,
          focus,
          durationMinutes: Number(duration),
        }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      if (!data?.workout) throw new Error('Invalid response shape');

      const newPlan: WorkoutPlan = {
        title: data.workout.title || FALLBACK_PLAN.title,
        focus: (focus as string) || FALLBACK_PLAN.focus,
        duration: duration ? Number(duration) : FALLBACK_PLAN.duration,
        exercises:
          Array.isArray(data.workout.exercises) && data.workout.exercises.length > 0
            ? data.workout.exercises
            : FALLBACK_PLAN.exercises,
        coachNotes: data.workout.coachNotes || FALLBACK_PLAN.coachNotes,
      };

      setPlan(newPlan);
      saveAthleteProfile({ activeWorkoutPlan: newPlan });
    } catch (err) {
      console.warn('Workout generator fallback:', err);
      setPlan(FALLBACK_PLAN);
      saveAthleteProfile({ activeWorkoutPlan: FALLBACK_PLAN });
    } finally {
      setLoading(false);
    }
  };

  const loadPresetEvent = (eventId: string) => {
    const ev = FITNESS_EVENTS.find((item) => item.id === eventId);
    if (!ev) return;
    const nextPlan: WorkoutPlan = {
      title: ev.title,
      focus: ev.category,
      duration: ev.durationMinutes,
      exercises: ev.exercises,
      coachNotes: ev.coachNotes,
    };
    setPlan(nextPlan);
    saveAthleteProfile({ activeWorkoutPlan: nextPlan });
  };

  const handleSaveToProfile = () => {
    if (plan) {
      saveAthleteProfile({ activeWorkoutPlan: plan });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const startLiveWorkout = () => {
    setCurrentExIndex(0);
    setCompletedSets({});
    setTimerSeconds(90);
    setIsTimerRunning(false);
    setSessionFinished(false);
    setLiveSessionOpen(true);
  };

  const toggleSetComplete = (setNum: number) => {
    const key = `${currentExIndex}-${setNum}`;
    const nextState = !completedSets[key];
    setCompletedSets((prev) => ({ ...prev, [key]: nextState }));
    if (nextState) {
      setTimerSeconds(90);
      setIsTimerRunning(true);
    }
  };

  const finishWorkoutSession = () => {
    const profile = getAthleteProfile();
    saveAthleteProfile({
      completedWorkoutsCount: (profile.completedWorkoutsCount || 0) + 1,
    });
    setSessionFinished(true);
  };

  const currentExercise = plan?.exercises[currentExIndex];

  return (
    <main className="flex-1 pt-28 pb-20 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        {!plan ? (
          <div className="bg-surface/90 rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
            <header className="mb-10">
              <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-neon mb-3">
                Algorithmic Periodization
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
                Workout <span className="text-neon">Generator</span>
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
                Input your training baseline, target adaptation, and available time—or load any live fitness event preset below.
              </p>
            </header>

            <div className="mb-10 pb-8 border-b border-white/10">
              <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-3">
                Quick-Load 3D Stage Event Protocols
              </div>
              <div className="flex flex-wrap gap-2">
                {FITNESS_EVENTS.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => loadPresetEvent(ev.id)}
                    className="px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 hover:border-neon/50 hover:text-neon text-xs font-semibold transition-colors"
                  >
                    {ev.slideNum} · {ev.title}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={onGenerate} className="space-y-9">
              <div className="space-y-3">
                <label className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-400 block">
                  Training Age & Baseline
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'Novice', label: 'Beginner', desc: '< 1 Year Training' },
                    { id: 'Intermediate', label: 'Intermediate', desc: '1–3 Years Base' },
                    { id: 'Advanced', label: 'Elite / Advanced', desc: '3+ Years Heavy Loading' },
                  ].map((level) => (
                    <label key={level.id} className="relative block cursor-pointer">
                      <input
                        type="radio"
                        name="fitnessLevel"
                        value={level.id}
                        defaultChecked={level.id === 'Advanced'}
                        className="peer sr-only"
                      />
                      <div className="p-5 rounded-2xl border border-white/10 bg-black/40 peer-checked:border-neon peer-checked:bg-neon/10 transition-all">
                        <div className="font-bold text-sm text-white mb-1">
                          {level.label}
                        </div>
                        <div className="text-xs text-zinc-400">{level.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-400 block">
                  Primary Focus Adaptation
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { id: 'Hypertrophy', label: 'Hypertrophy', icon: Dumbbell },
                    { id: 'Strength', label: 'Absolute Strength', icon: Zap },
                    { id: 'Conditioning', label: 'Work Capacity', icon: Flame },
                    { id: 'Mobility', label: 'Tendon & Joint Flow', icon: Activity },
                  ].map((f) => (
                    <label key={f.id} className="relative block cursor-pointer">
                      <input
                        type="radio"
                        name="focus"
                        value={f.id}
                        defaultChecked={f.id === 'Hypertrophy'}
                        className="peer sr-only"
                      />
                      <div className="p-5 rounded-2xl border border-white/10 bg-black/40 peer-checked:border-neon peer-checked:bg-neon/10 transition-all flex flex-col items-center text-center gap-3">
                        <f.icon className="w-5 h-5 text-neon" />
                        <span className="text-xs font-bold text-zinc-200">
                          {f.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-400 block">
                  Session Time Budget
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['30', '45', '60'].map((mins) => (
                    <label key={mins} className="relative block cursor-pointer">
                      <input
                        type="radio"
                        name="duration"
                        value={mins}
                        defaultChecked={mins === '45'}
                        className="peer sr-only"
                      />
                      <div className="py-4 text-center rounded-2xl border border-white/10 bg-black/40 peer-checked:border-neon peer-checked:bg-neon/10 transition-all">
                        <span className="text-sm font-heading font-bold text-white tabular">
                          {mins} Minutes
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-neon py-4 text-sm font-bold tracking-wider uppercase disabled:opacity-40"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Constructing Protocol...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Construct Protocol <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-white/10">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-neon mb-2">
                  Custom Neural Prescription
                </div>
                <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
                  {plan.title}
                </h1>
                <div className="flex flex-wrap items-center gap-5 text-xs font-mono text-zinc-400 tabular">
                  <span className="flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-neon" /> {plan.focus}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neon" /> {plan.duration} Minutes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-neon" /> {plan.exercises.length} Movements
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={startLiveWorkout}
                  className="btn-neon px-6 py-3 text-xs font-bold flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Live Session</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveToProfile}
                  className="btn-glass px-5 py-3 text-xs font-bold flex items-center gap-2"
                >
                  {savedSuccess && <Check className="w-4 h-4 text-neon" />}
                  <span>{savedSuccess ? 'Saved to Hub' : 'Save to Hub'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlan(null)}
                  className="px-5 py-3 text-xs text-zinc-300 hover:text-white border border-white/15 rounded-full font-bold"
                >
                  New Plan
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-neon/[0.04] border border-neon/25 flex gap-4 items-start">
              <div className="bg-neon/10 p-2.5 rounded-2xl text-neon shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-neon mb-1">
                  Coach Biomechanical Guidance
                </div>
                <p className="text-zinc-200 text-sm leading-relaxed">
                  &ldquo;{plan.coachNotes}&rdquo;
                </p>
              </div>
            </div>

            <div ref={matrixRef} className="space-y-4">
              {plan.exercises.map((ex, i) => (
                <div
                  key={i}
                  className="bg-surface/90 border border-white/10 p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-6 hover:border-neon/35 transition-colors"
                >
                  <div className="h-24 w-28 rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden shrink-0">
                    <img
                      src={ex.img}
                      alt={ex.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-1 tabular">
                      Movement 0{i + 1}
                    </div>
                    <h3 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-white">
                      {ex.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">{ex.focus}</p>
                    {ex.cue && (
                      <p className="text-xs text-zinc-400 italic mt-2">
                        &ldquo;{ex.cue}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6 min-w-[140px] font-mono tabular">
                    <div className="text-3xl font-heading font-black text-white">
                      {ex.sets} × {ex.reps}
                    </div>
                    <div className="mt-1.5 text-xs font-bold text-neon">
                      {ex.load}
                    </div>
                    {ex.rest && (
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        Rest: {ex.rest}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Workout Session Modal */}
      {liveSessionOpen && currentExercise && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#12151B] border border-white/15 rounded-3xl p-7 md:p-9 relative">
            <button
              type="button"
              onClick={() => setLiveSessionOpen(false)}
              aria-label="Close live workout modal"
              className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-white bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            {!sessionFinished ? (
              <div>
                <div className="flex items-center justify-between mb-6 pr-10">
                  <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-neon">
                    Live Session · Movement {currentExIndex + 1} of{' '}
                    {plan?.exercises.length}
                  </div>
                  <div className="text-xs text-zinc-400 tabular font-mono">
                    {Math.round(
                      ((currentExIndex + 1) / (plan?.exercises.length || 1)) * 100
                    )}
                    %
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-center mb-7">
                  <div className="h-28 w-32 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                    <img
                      src={currentExercise.img}
                      alt={currentExercise.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-tight mb-1">
                      {currentExercise.name}
                    </h2>
                    <p className="text-xs text-zinc-400 mb-2">
                      {currentExercise.focus}
                    </p>
                    <div className="text-xs font-mono text-neon tabular">
                      Target: {currentExercise.sets} Sets × {currentExercise.reps} ·{' '}
                      {currentExercise.load}
                    </div>
                  </div>
                </div>

                <div className="mb-7">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-3">
                    Completed Sets
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Array.from({ length: currentExercise.sets }).map((_, idx) => {
                      const isDone = !!completedSets[`${currentExIndex}-${idx}`];
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleSetComplete(idx)}
                          className={cn(
                            'py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all',
                            isDone
                              ? 'bg-neon text-bg border-neon'
                              : 'bg-white/[0.04] border-white/10 text-zinc-300 hover:border-white/30'
                          )}
                        >
                          <Check
                            className={cn(
                              'w-3.5 h-3.5',
                              isDone ? 'opacity-100' : 'opacity-35'
                            )}
                          />
                          <span>Set {idx + 1}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between mb-7">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'p-2.5 rounded-xl',
                        isTimerRunning
                          ? 'bg-neon/20 text-neon'
                          : 'bg-white/5 text-zinc-400'
                      )}
                    >
                      <Timer className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                        Rest Timer
                      </div>
                      <div className="text-2xl font-heading font-black tabular">
                        {Math.floor(timerSeconds / 60)}:
                        {(timerSeconds % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="px-4 py-2 rounded-xl bg-neon text-bg text-xs font-bold flex items-center gap-1.5"
                    >
                      {isTimerRunning ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                      <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTimerSeconds(90);
                        setIsTimerRunning(false);
                      }}
                      className="p-2 rounded-xl bg-white/5 text-zinc-300 hover:text-white"
                      title="Reset 90s"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    disabled={currentExIndex === 0}
                    onClick={() => {
                      setCurrentExIndex((i) => i - 1);
                      setTimerSeconds(90);
                      setIsTimerRunning(false);
                    }}
                    className="btn-glass px-6 py-3 text-xs disabled:opacity-30"
                  >
                    Previous
                  </button>

                  {currentExIndex < (plan?.exercises.length || 1) - 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentExIndex((i) => i + 1);
                        setTimerSeconds(90);
                        setIsTimerRunning(false);
                      }}
                      className="btn-neon px-7 py-3 text-xs font-bold"
                    >
                      Next Movement
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={finishWorkoutSession}
                      className="btn-neon px-7 py-3 text-xs font-bold"
                    >
                      Finish & Log Session
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="h-16 w-16 rounded-full bg-neon text-bg flex items-center justify-center mx-auto mb-5">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-3xl font-bold tracking-tight mb-3">
                  Protocol Completed
                </h3>
                <p className="text-zinc-400 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
                  Workout logged into your athlete profile. Readiness and recovery tracking have been updated.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/dashboard"
                    onClick={() => setLiveSessionOpen(false)}
                    className="btn-neon px-7 py-3.5 text-xs font-bold"
                  >
                    Go to Athlete Hub
                  </Link>
                  <button
                    type="button"
                    onClick={() => setLiveSessionOpen(false)}
                    className="btn-glass px-7 py-3.5 text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default function WorkoutGeneratorPage() {
  return (
    <div className="min-h-screen bg-bg text-white selection:bg-neon selection:text-bg flex flex-col">
      <SiteNavbar />
      <Suspense
        fallback={
          <main className="flex-1 pt-28 pb-20 px-6 max-w-5xl mx-auto w-full">
            <div className="h-96 rounded-3xl bg-surface/60 border border-white/10" />
          </main>
        }
      >
        <WorkoutGeneratorInner />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
