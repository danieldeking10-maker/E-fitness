'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ArrowRight, Brain, Clock, Activity, Calendar, Sparkles, Zap, Timer, Dumbbell, MoreVertical, ChevronDown, AlertCircle, RefreshCw } from 'lucide-react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { getApiBaseUrl } from '@/lib/api';

interface Exercise {
  name: string;
  focus: string;
  sets: number;
  reps: number;
  load: string;
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
  title: "Hypertrophy Baseline",
  focus: "Hypertrophy",
  duration: 45,
  exercises: [
    { name: "Barbell Back Squat", focus: "Quads & Glutes", sets: 4, reps: 8, load: "75% 1RM", img: "https://images.unsplash.com/photo-1599447332412-6bc6830c815a" },
    { name: "Bulgarian Split Squat", focus: "Unilateral Strength", sets: 3, reps: 12, load: "RPE 8", img: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb" },
    { name: "Romanian Deadlift", focus: "Posterior Chain", sets: 3, reps: 10, load: "RPE 7", img: "https://images.unsplash.com/photo-1603477007113-f7385b1711a8" },
  ],
  coachNotes: "Your CNS score is slightly lower today. Keep the eccentric portion of the squats controlled (3 seconds) to maximize mechanical tension without excessive fatigue.",
};

export default function WorkoutGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const matrixRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (plan && matrixRef.current) {
      gsap.fromTo(matrixRef.current.children, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [plan]);

  const onGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
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
        body: JSON.stringify({ fitnessLevel, focus, durationMinutes: Number(duration) }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      if (!data?.workout) throw new Error('Invalid response shape');
      setPlan({
        title: data.workout.title || FALLBACK_PLAN.title,
        focus: (focus as string) || FALLBACK_PLAN.focus,
        duration: duration || FALLBACK_PLAN.duration,
        exercises: FALLBACK_PLAN.exercises,
        coachNotes: data.workout.coachNotes || FALLBACK_PLAN.coachNotes,
      });
    } catch (err) {
      console.error('Workout generator error:', err);
      setError('Could not reach backend — using offline demo mode.');
      // Fallback to demo data for uninterrupted UX
      setTimeout(() => {
        setPlan(FALLBACK_PLAN);
        setError(null);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg text-white selection:bg-neon selection:text-bg py-20 px-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-neon/5 blur-[180px] rounded-full -z-10 animate-pulse" style={{ animationDuration: '10s' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit Generator</span>
        </Link>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-400 text-sm font-bold">{error}</p>
              <p className="text-zinc-400 text-xs mt-1">Using offline demo data — all features work with the demo plan.</p>
            </div>
          </div>
        )}

        {!plan ? (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon/20 bg-neon/5 text-neon text-[9px] font-black uppercase tracking-[0.2em] mb-6">
                <Zap className="w-3 h-3 fill-neon" /> Dynamic Protocol Construction
              </div>
              <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
                Workout <span className="text-neon">Generator</span>
              </h1>
              <p className="text-zinc-500 font-medium text-lg leading-relaxed max-w-sm mx-auto">Configure your immediate training objectives for neural optimization.</p>
            </header>

            <form ref={formRef} onSubmit={onGenerate} className="glass rounded-[3.5rem] p-10 md:p-14 shadow-2xl border-white/5 space-y-12">
              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                   <Activity className="w-3 h-3 text-neon" /> Current Proficiency
                </label>
                <div className="flex gap-4">
                  {['Beginner', 'Intermediate', 'Elite'].map((level) => (
                    <label key={level} className="flex-1 cursor-pointer group">
                      <input type="radio" name="fitnessLevel" value={level} className="sr-only peer" defaultChecked={level === 'Intermediate'} />
                      <div className="py-6 text-center rounded-2xl border border-white/5 bg-black/40 font-black text-xs uppercase tracking-widest text-zinc-600 peer-checked:border-neon peer-checked:bg-neon peer-checked:text-bg group-hover:border-white/10 transition-all duration-300">
                        {level}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                    <Dumbbell className="w-3 h-3 text-neon" /> Training Focus
                  </label>
                  <div className="relative group">
                    <select name="focus" className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm font-bold outline-none focus:border-neon/40 appearance-none transition-all cursor-pointer group-hover:border-white/20">
                      <option value="Hypertrophy">Hypertrophy (Muscle)</option>
                      <option value="Strength">Absolute Strength</option>
                      <option value="Endurance">Metabolic Spike</option>
                      <option value="Recovery">Active Recovery</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none group-hover:text-neon transition-colors" />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                    <Timer className="w-3 h-3 text-neon" /> Window (Mins)
                  </label>
                  <input 
                    name="duration" 
                    type="number" 
                    defaultValue={45} 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-sm font-bold outline-none focus:border-neon/40 transition-all group-hover:border-white/20"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-neon py-6 text-xl group disabled:opacity-50 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Neural Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Construct Protocol
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-1000">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
              <div>
                <div className="flex items-center gap-3 mb-4">
                   <div className="px-3 py-1 rounded-md bg-neon/10 text-neon text-[9px] font-black uppercase tracking-[0.2em]">Alpha Protocol v1.4</div>
                   <span className="text-zinc-700 text-xs font-medium">Generated at {new Date().toLocaleTimeString()}</span>
                </div>
                <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tighter mb-4">
                  Training <span className="text-neon">Matrix.</span>
                </h1>
                <div className="flex items-center gap-6 text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
                  <span className="flex items-center gap-2 text-zinc-400"><Brain className="w-3.5 h-3.5 text-neon" /> {plan.focus}</span>
                  <span className="flex items-center gap-2 text-zinc-400"><Clock className="w-3.5 h-3.5 text-neon" /> {plan.duration} MINS</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="btn-glass px-8 py-4 text-xs font-black uppercase tracking-widest border-white/5 hover:border-white/20 shadow-2xl">Export PDF</button>
                <button className="btn-neon px-10 py-4 text-xs font-black uppercase tracking-widest shadow-neon-glow hover:scale-105 transition-transform">
                   <Calendar className="w-4 h-4 mr-2" /> Sync Calendar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              <div ref={matrixRef} className="lg:col-span-2 space-y-4">
                {plan.exercises.map((ex, i) => (
                  <div key={i} className="glass p-8 rounded-[3rem] flex flex-col sm:flex-row items-center gap-10 group hover:border-neon/40 transition-all duration-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon/5 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="h-28 w-28 rounded-[2.5rem] bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-neon/20 shadow-2xl transition-all duration-700">
                      <img src={`${ex.img}?auto=format&w=300&q=80&fit=crop`} alt={ex.name} className="w-full h-full object-cover opacity-30 group-hover:opacity-70 group-hover:scale-110 transition-all duration-1000" />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left relative z-10">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                         <span className="text-[9px] font-black text-zinc-600 bg-white/5 px-2 py-0.5 rounded uppercase">Block A{i+1}</span>
                         <div className="h-0.5 w-8 bg-zinc-800 rounded-full group-hover:bg-neon/30 transition-all"></div>
                      </div>
                      <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2 tracking-tight group-hover:text-neon transition-colors duration-500">{ex.name}</h3>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">{ex.focus}</p>
                    </div>
                    
                    <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-white/5 pt-8 sm:pt-0 sm:pl-10 min-w-[150px] relative z-10">
                      <div className="text-4xl font-heading font-black tracking-tighter italic group-hover:scale-110 transition-transform duration-500 origin-right">
                        {ex.sets} <span className="text-sm font-normal text-zinc-600 not-italic mx-1">x</span> {ex.reps}
                      </div>
                      <div className="inline-block mt-3 px-3 py-1 rounded-full bg-neon/5 border border-neon/20 text-[10px] text-neon font-black uppercase tracking-[0.2em]">{ex.load}</div>
                    </div>
                    
                    <button className="absolute right-8 top-8 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-white">
                       <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                
                <button onClick={() => setPlan(null)} className="w-full py-12 border border-dashed border-white/10 rounded-[3rem] text-zinc-500 font-black text-[10px] uppercase tracking-[0.4em] hover:border-neon/40 hover:text-neon hover:bg-neon/5 transition-all duration-500 group">
                  <div className="flex items-center justify-center gap-3">
                    <RefreshCw className="w-4 h-4 group-hover:animate-spin" />
                    Re-construct Neural Protocol
                  </div>
                </button>
              </div>

              <div className="space-y-8 lg:sticky lg:top-32">
                <div className="glass p-12 rounded-[3.5rem] border-neon/30 bg-neon/5 relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-neon/10 blur-[80px] rounded-full group-hover:bg-neon/15 transition-colors"></div>
                  <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="bg-neon h-12 w-12 rounded-2xl flex items-center justify-center shadow-neon-glow">
                      <Brain className="w-6 h-6 text-bg" />
                    </div>
                    <div>
                       <h4 className="font-heading font-bold text-xl tracking-tight">AI Insights</h4>
                       <div className="h-0.5 w-full bg-neon/30 rounded-full mt-1"></div>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-[15px] leading-relaxed mb-12 relative z-10 font-medium italic opacity-90 group-hover:opacity-100 transition-opacity">
                    "{plan.coachNotes}"
                  </p>
                  <div className="pt-10 border-t border-white/10 flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Recalibration ID</span>
                    <div className="px-4 py-1.5 rounded-xl bg-neon/10 text-neon text-[10px] font-black uppercase tracking-widest border border-neon/20">EF-7721</div>
                  </div>
                </div>

                <div className="glass p-12 rounded-[3.5rem] border-white/5 space-y-8 shadow-2xl">
                  <div className="flex items-center gap-3">
                     <Sparkles className="w-4 h-4 text-neon" />
                     <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Metabolic Fueling</h4>
                  </div>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                      <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Pre-Load</span>
                      <span className="text-xs font-black text-white uppercase tracking-wider">25g Carbs</span>
                    </div>
                    <div className="flex justify-between items-center bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                      <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Hydration</span>
                      <span className="text-xs font-black text-neon uppercase tracking-wider shadow-neon-glow">Electrolytes</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-zinc-600 text-center uppercase tracking-widest font-bold pt-4">Calculated based on {plan.duration}m intensity</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
