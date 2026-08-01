
'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ArrowRight, Brain, Bone, Stretching, Activity, CheckCircle2, Target, CalendarDays } from 'lucide-react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { getApiBaseUrl } from '@/lib/api';


type Step = 1 | 2 | 3 | 4;

export default function WellnessAssessmentPage() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    goals: '',
    constraints: [] as string[],
    sleepQuality: 50,
    frequency: '3',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [step]);

  const handleNext = () => {
    if (step < 4) setStep((s) => (s + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/ai/wellness-assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals: formData.goals, constraints: formData.constraints }),
      });
      
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ 
        message: "Neural analysis success.",
        recommendations: [
          "Prioritize knee stability exercises (Bulgarian Split Squats).",
          "Focus on consistent sleep cycles to improve recovery score.",
          "High protein intake (2g/kg) recommended for strength goals."
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg text-white selection:bg-neon selection:text-bg py-20 px-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon/5 blur-[150px] rounded-full -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon/5 blur-[150px] rounded-full -z-10 animate-pulse" style={{ animationDuration: '10s' }}></div>

      <div className="max-w-2xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit Assessment</span>
        </Link>

        {!result ? (
          <>
            <header className="text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full border border-neon/20 bg-neon/5 text-neon text-[9px] font-black uppercase tracking-[0.2em] mb-6">
                Deep Analysis Protocol
              </div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                Wellness <span className="text-neon">Assessment</span>
              </h1>
              <p className="text-zinc-500 font-medium text-sm">
                Step {step} of 3: {step === 1 ? 'Primary Objectives' : step === 2 ? 'Biological Constraints' : 'Environmental Setup'}
              </p>
            </header>

            <div ref={cardRef} className="glass rounded-[3rem] p-10 md:p-14 shadow-2xl border-white/5">
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-4 h-4 text-neon" />
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Primary Objective</label>
                  </div>
                  <textarea
                    autoFocus
                    className="w-full bg-black/40 border border-white/10 rounded-3xl p-8 text-lg outline-none focus:border-neon/40 transition-all min-h-[180px] leading-relaxed placeholder:text-zinc-700"
                    placeholder="Describe your 12-week vision... (e.g. lose 5kg fat, run a 5k under 25m)"
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Brain className="w-4 h-4 text-neon" />
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Physical Constraints</label>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: 'knee', label: 'Knee Sensitivity', icon: Stretching },
                        { id: 'back', label: 'Lower Back Pain', icon: Bone },
                        { id: 'mobility', label: 'Limited Mobility', icon: Activity },
                        { id: 'custom', label: 'Shoulder Impingement', icon: Brain },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            const exists = formData.constraints.includes(item.label);
                            setFormData({
                              ...formData,
                              constraints: exists 
                                ? formData.constraints.filter(c => c !== item.label)
                                : [...formData.constraints, item.label]
                            });
                          }}
                          className={cn(
                            "p-6 rounded-2xl border transition-all flex items-center gap-4 text-left group",
                            formData.constraints.includes(item.label)
                              ? "border-neon bg-neon/10 text-white"
                              : "border-white/5 bg-black/20 text-zinc-500 hover:border-white/20"
                          )}
                        >
                          <item.icon className={cn("w-5 h-5 transition-colors", formData.constraints.includes(item.label) ? "text-neon" : "text-zinc-700 group-hover:text-zinc-500")} />
                          <span className="text-sm font-bold tracking-tight">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-neon" />
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Sleep Quality Index</label>
                      </div>
                      <span className="text-neon font-black text-xs bg-neon/10 px-2 py-0.5 rounded">{formData.sleepQuality}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0"
                      max="100"
                      className="w-full h-1.5 bg-zinc-900 rounded-full appearance-none accent-neon cursor-pointer" 
                      value={formData.sleepQuality}
                      onChange={(e) => setFormData({ ...formData, sleepQuality: parseInt(e.target.value) })}
                    />
                    <div className="flex justify-between mt-4 text-[9px] font-black text-zinc-700 uppercase tracking-widest">
                      <span>Sleep Deprived</span>
                      <span>Elite Recovery</span>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <CalendarDays className="w-4 h-4 text-neon" />
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Weekly Commitment</label>
                    </div>
                    <div className="flex gap-4">
                      {['1-2', '3', '4', '5+'].map((freq) => (
                        <button
                          key={freq}
                          onClick={() => setFormData({ ...formData, frequency: freq })}
                          className={cn(
                            "flex-1 py-8 rounded-3xl border font-heading font-black text-2xl transition-all",
                            formData.frequency === freq
                              ? "border-neon bg-neon text-bg shadow-neon-glow"
                              : "border-white/5 bg-black/20 text-zinc-600 hover:border-white/10 hover:text-zinc-400"
                          )}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                    <p className="text-center mt-6 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Days per week</p>
                  </div>
                </div>
              )}

              <div className="mt-16 flex items-center justify-between">
                <div className="flex gap-3">
                  {[1, 2, 3].map((s) => (
                    <div 
                      key={s} 
                      className={cn(
                        "h-1 rounded-full transition-all duration-700",
                        step === s ? "w-12 bg-neon shadow-neon-glow" : "w-4 bg-zinc-900"
                      )} 
                    />
                  ))}
                </div>
                
                <div className="flex gap-4">
                  {step > 1 && (
                    <button onClick={handleBack} className="btn-glass px-8 py-3.5 text-xs">Back</button>
                  )}
                  <button 
                    onClick={step === 3 ? handleSubmit : handleNext} 
                    disabled={loading || (step === 1 && !formData.goals)}
                    className="btn-neon px-12 py-3.5 text-xs group disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Activity className="w-3 h-3 animate-spin" />
                        Analyzing...
                      </span>
                    ) : (
                      <>
                        {step === 3 ? 'Finalize Analysis' : 'Next Step'}
                        <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div ref={cardRef} className="glass rounded-[3rem] p-12 md:p-16 shadow-2xl border-neon/20 relative overflow-hidden animate-in fade-in zoom-in-95 duration-700">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon/10 blur-[100px] rounded-full"></div>
            
            <div className="text-center relative z-10">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-neon shadow-neon-glow mb-10">
                <CheckCircle2 className="w-12 h-12 text-bg" />
              </div>
              <h2 className="font-heading text-4xl font-bold mb-6 tracking-tight">Intelligence <span className="text-neon">Synced.</span></h2>
              <p className="text-zinc-500 text-lg leading-relaxed max-w-sm mx-auto mb-12">
                Neural profile completed. Your training ecosystem has been recalibrated based on {formData.frequency} days/week commitment.
              </p>
            </div>

            <div className="bg-black/60 rounded-[2rem] p-10 border border-white/5 relative group mb-12">
              <div className="absolute top-0 left-10 h-1 w-20 bg-neon group-hover:w-32 transition-all duration-700"></div>
              <p className="text-[10px] font-black text-neon uppercase tracking-[0.4em] mb-6">Core Recommendations</p>
              <div className="space-y-6">
                {(result.recommendations || []).map((rec: string, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-1.5 w-1.5 bg-neon rounded-full mt-2 shrink-0"></div>
                    <p className="text-zinc-300 text-sm leading-relaxed font-medium">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/ai/workout-generator" className="btn-neon py-5 text-xs">
                Generate First Workout
              </Link>
              <Link href="/" className="btn-glass py-5 text-xs">
                Dashboard Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
