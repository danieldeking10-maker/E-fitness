'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Activity, ArrowRight, Check, ShieldLock, Smartphone, CreditCard, Menu, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      // Hero Reveals
      gsap.from('.reveal-y', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      });

      gsap.from('.reveal-x', {
        x: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.4,
      });

      // Bento Grid Entrance
      gsap.from('.bento-cell', {
        scale: 0.95,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
        delay: 0.2,
      });

      // Section Reveals
      const scrollReveals = gsap.utils.toArray('.scroll-reveal') as HTMLElement[];
      scrollReveals.forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      // Features Sticky Animation
      const featureCards = gsap.utils.toArray('.feature-card') as HTMLElement[];
      featureCards.forEach((card) => {
        gsap.from(card, {
          x: 50,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'top 40%',
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-x-clip bg-bg text-white selection:bg-neon selection:text-bg">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="bento-grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 auto-rows-fr">
              <div className="bento-cell md:col-span-4 lg:col-span-3 lg:row-span-2 glass rounded-[2.5rem] p-10 md:p-14 flex flex-col justify-end relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon/5 blur-[150px] rounded-full group-hover:bg-neon/10 transition-colors duration-1000"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6 reveal-y">
                    <Sparkles className="w-4 h-4 text-neon" />
                    <span className="text-neon text-xs font-bold tracking-[0.3em] uppercase">Phase 1 Live</span>
                  </div>
                  
                  <h1 className="font-heading text-5xl md:text-8xl font-bold leading-[1.05] tracking-tight mb-8 reveal-y">
                    Elite Fitness <br/>
                    <span className="text-neon italic">Powered by AI.</span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 reveal-y leading-relaxed">
                    E-fitness merges cutting-edge neural analysis with elite coaching to transform your physical potential. No templates, just intelligence.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 reveal-y">
                    <Link href="/ai/wellness-assessment" className="btn-neon text-lg group/btn">
                      Start Assessment
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/ai/wellness-companion" className="btn-glass text-lg">
                      Chat with AI
                    </Link>
                  </div>
                </div>
              </div>

              {/* Metric Card */}
              <div className="bento-cell md:col-span-2 lg:col-span-1 glass rounded-[2.5rem] p-8 flex flex-col justify-between reveal-x">
                <div className="flex justify-between items-start">
                  <div className="bg-neon/10 p-3 rounded-2xl">
                    <Activity className="text-neon w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-red-500 text-[10px] font-bold tracking-widest">REAL-TIME</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-zinc-500 font-bold uppercase tracking-widest mb-1">HR Stability</div>
                  <div className="text-5xl font-heading font-bold flex items-baseline gap-1">
                    142 <span className="text-lg font-normal text-zinc-600">bpm</span>
                  </div>
                  <div className="mt-4 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-neon w-[65%] shadow-neon-glow"></div>
                  </div>
                </div>
              </div>

              {/* Video/Image Cell */}
              <div className="bento-cell md:col-span-2 lg:col-span-1 glass rounded-[2.5rem] overflow-hidden relative group reveal-x">
                <video 
                  src="https://videos.pexels.com/video-files/4804847/4804847-uhd_2560_1440_25fps.mp4" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                   <div className="h-2 w-2 bg-neon rounded-full"></div>
                   <span className="text-xs font-bold uppercase tracking-widest">Training Peak</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Sticky Scroll */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-32 flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/2 lg:sticky lg:top-32 lg:h-fit flex flex-col justify-center">
            <div className="inline-block px-4 py-1.5 rounded-full border border-neon/30 bg-neon/5 text-neon text-[10px] font-bold uppercase tracking-[0.2em] mb-6 w-fit">
              Core Ecosystem
            </div>
            <h2 className="font-heading text-6xl md:text-7xl font-bold leading-[1] mb-8 tracking-tighter">
              Intelligence <br/>
              <span className="text-zinc-500 italic">for your</span> <br/>
              Physique.
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl max-w-md leading-relaxed">
              E-fitness uses proprietary AI models to build, track, and optimize your entire wellness ecosystem in real-time.
            </p>
          </div>

          <div className="lg:w-1/2 space-y-[30vh] py-[10vh]">
            {[
              {
                num: '01',
                title: 'Wellness Assessment',
                desc: 'A multi-dimensional analysis of your current metabolic state, sleep quality, and physical constraints through deep-learning protocols.',
                href: '/ai/wellness-assessment',
              },
              {
                num: '02',
                title: 'Workout Generator',
                desc: 'Dynamic training plans that adapt instantly to your recovery score, local equipment availability, and biological readiness.',
                href: '/ai/workout-generator',
              },
              {
                num: '03',
                title: 'AI Companion',
                desc: 'A 24/7 fitness intelligence at your fingertips. Ask about nutrition, form optimization, or science-backed recovery protocols.',
                href: '/ai/wellness-companion',
              },
            ].map((feature) => (
              <div key={feature.num} className="feature-card glass p-10 md:p-14 rounded-[3rem] group hover:border-neon/30 transition-colors duration-500">
                <div className="text-neon font-heading text-5xl font-bold mb-8 opacity-50 group-hover:opacity-100 transition-opacity">{feature.num}</div>
                <h3 className="font-heading text-3xl md:text-4xl font-bold mb-6 tracking-tight">{feature.title}</h3>
                <p className="text-zinc-400 text-lg leading-relaxed mb-10">{feature.desc}</p>
                <Link href={feature.href} className="text-neon font-bold text-sm flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                  Explore Feature <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Sessions Section - Carousel */}
        <section className="py-32 bg-zinc-950/50 border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(192,255,0,0.03),_transparent_70%)]"></div>
          
          <div className="max-w-7xl mx-auto px-6 md:px-8 mb-20 text-center relative z-10">
            <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6 tracking-tight">Live & Synchronized.</h2>
            <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              Train with world-class instructors in high-fidelity live streams, or access our curated library of elite recorded content.
            </p>
          </div>

          <div className="flex gap-8 overflow-x-auto px-[8%] pb-12 scrollbar-hide snap-x snap-mandatory relative z-10">
            {[
              {
                title: 'Morning Power',
                instructor: 'Sarah Chen',
                focus: 'HIIT & METABOLIC SPIKE',
                time: '45 MINS',
                tag: 'LIVE NOW',
                img: 'https://images.unsplash.com/photo-1517130038641-a774d04afb3c?auto=format&w=1200&q=80&fit=crop',
              },
              {
                title: 'Base Hypertrophy',
                instructor: 'Marcus Thorne',
                focus: 'STRUCTURAL BALANCE',
                time: '60 MINS',
                tag: 'RECORDED',
                img: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&w=1200&q=80&fit=crop',
              },
              {
                title: 'Flow Recovery',
                instructor: 'Elara Vance',
                focus: 'MOBILITY & CNS CALM',
                time: '30 MINS',
                tag: 'UPCOMING',
                img: 'https://images.unsplash.com/photo-1549995546-87cb41aa98a4?auto=format&w=1200&q=80&fit=crop',
              },
            ].map((session) => (
              <div key={session.title} className="min-w-[85%] md:min-w-[42%] glass rounded-[3rem] overflow-hidden snap-center group">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img src={session.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={session.title} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                  <div className={cn(
                    "absolute top-8 left-8 text-white text-[10px] font-bold px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md",
                    session.tag === 'LIVE NOW' ? "bg-red-600/80" : "bg-zinc-900/80"
                  )}>
                    {session.tag === 'LIVE NOW' && <span className="h-1.5 w-1.5 bg-white rounded-full animate-ping"></span>}
                    {session.tag}
                  </div>
                </div>
                <div className="p-10 md:p-14">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-heading text-3xl font-bold mb-2">{session.title}</h3>
                      <div className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">{session.focus}</div>
                    </div>
                    <div className="text-neon font-bold text-sm bg-neon/10 px-3 py-1 rounded-lg">{session.time}</div>
                  </div>
                  <p className="text-zinc-500 mb-10 leading-relaxed font-medium">Instructor: <span className="text-zinc-300">{session.instructor}</span></p>
                  <button className="w-full bg-white/5 border border-white/10 py-5 rounded-2xl font-bold hover:bg-neon hover:text-bg transition-all duration-300 text-lg">
                    {session.tag === 'RECORDED' ? 'Start Training' : 'Join Session'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-40 px-6 md:px-8 bg-bg relative">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-end justify-center">
            {[
              {
                name: 'Guest',
                price: 'Free',
                desc: 'Core Assessments',
                height: 'lg:h-[450px]',
                features: ['Basic Wellness Assessment', 'Community Access', 'Daily Habit Log'],
              },
              {
                name: 'Core',
                price: '$12',
                desc: 'Daily Intelligence',
                height: 'lg:h-[550px]',
                features: ['Unlimited AI Workouts', 'Companion Chat Access', 'Progress Analytics', 'Personalized Macros'],
              },
              {
                name: 'Infinite',
                price: '$29',
                desc: 'The Elite Path',
                height: 'lg:h-[650px]',
                features: ['Everything in Core', 'All Live Session Keys', 'Biometric Hardware Sync', '1-on-1 Coach Access'],
                recommended: true,
              },
            ].map((plan) => (
              <div 
                key={plan.name} 
                className={cn(
                  "glass p-12 rounded-[3.5rem] w-full lg:w-[380px] flex flex-col justify-between relative scroll-reveal transition-all duration-500 hover:-translate-y-2",
                  plan.height,
                  plan.recommended && "border-neon/40 bg-neon/5 lg:w-[420px] shadow-neon-glow/10"
                )}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 right-10 bg-neon text-bg px-5 py-2 rounded-full text-xs font-bold tracking-widest">ELITE ACCESS</div>
                )}
                <div>
                  <div className="font-heading text-2xl font-bold mb-3">{plan.name}</div>
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-10">{plan.desc}</div>
                  <ul className="space-y-4">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                        <div className="bg-neon/10 p-1 rounded-full">
                          <Check className="text-neon w-3.5 h-3.5" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-12">
                  <div className="text-5xl font-heading font-bold mb-8">
                    {plan.price}{plan.price !== 'Free' && <span className="text-sm font-normal text-zinc-600 ml-1">/mo</span>}
                  </div>
                  <button className={cn(
                    "w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300",
                    plan.recommended ? "bg-neon text-bg hover:shadow-neon-glow" : "bg-white/5 border border-white/10 hover:bg-white/10"
                  )}>
                    {plan.name === 'Guest' ? 'Start Free' : `Go ${plan.name}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-20 text-center scroll-reveal">
            <span className="text-[10px] font-bold tracking-[0.4em] text-zinc-600 uppercase mb-8 block">Secure Local Payments via Mobile Money</span>
            <div className="flex justify-center items-center gap-12 text-zinc-700 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <Smartphone className="w-10 h-10" />
              <CreditCard className="w-10 h-10" />
              <ShieldLock className="w-10 h-10" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingAI />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full px-6 py-6 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between glass rounded-full px-8 py-4">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="h-9 w-9 bg-neon rounded-xl flex items-center justify-center text-bg font-black text-lg group-hover:rotate-12 transition-transform duration-500 shadow-neon-glow/20">E</div>
          <span className="font-heading text-xl font-bold tracking-tighter">E-fitness</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-[13px] font-bold text-zinc-500 uppercase tracking-widest">
          <Link href="/ai/wellness-assessment" className="hover:text-neon transition-colors">Assessment</Link>
          <Link href="/ai/workout-generator" className="hover:text-neon transition-colors">Generator</Link>
          <Link href="/ai/wellness-companion" className="hover:text-neon transition-colors">Companion</Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-sm font-bold text-zinc-400 hover:text-white transition-colors mr-4">Sign In</Link>
          <Link href="/register" className="bg-neon text-bg px-6 py-2.5 rounded-full text-[13px] font-bold hover:shadow-neon-glow hover:scale-105 transition-all duration-300">
            Get Started
          </Link>
          <button className="md:hidden glass h-10 w-10 flex items-center justify-center rounded-full">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="py-24 px-6 md:px-8 border-t border-white/5 bg-zinc-950/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 bg-neon rounded-lg flex items-center justify-center text-bg font-black text-sm">E</div>
            <span className="font-heading font-bold tracking-tighter text-xl text-white">E-fitness</span>
          </div>
          <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
            Neural analysis and elite coaching fused into one seamless intelligence.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          <div>
            <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-6">Platform</div>
            <ul className="space-y-4 text-[13px] font-medium text-zinc-500">
              <li><Link href="/ai/wellness-assessment" className="hover:text-neon transition-colors">AI Assessment</Link></li>
              <li><Link href="/ai/workout-generator" className="hover:text-neon transition-colors">Plan Generator</Link></li>
              <li><Link href="/ai/wellness-companion" className="hover:text-neon transition-colors">Companion Chat</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-6">Experience</div>
            <ul className="space-y-4 text-[13px] font-medium text-zinc-500">
              <li><Link href="#" className="hover:text-neon transition-colors">Live Streams</Link></li>
              <li><Link href="#" className="hover:text-neon transition-colors">Elite Library</Link></li>
              <li><Link href="#" className="hover:text-neon transition-colors">Coaching</Link></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-6">Connect</div>
            <ul className="space-y-4 text-[13px] font-medium text-zinc-500">
              <li><a href="#" className="hover:text-neon transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-neon transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-neon transition-colors">Discord</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6">
        <div className="text-[11px] text-zinc-600 font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} E-fitness Platform. Precise. Personal. Powerful.
        </div>
        <div className="flex gap-8 text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

function FloatingAI() {
  return (
    <div className="fixed bottom-10 right-10 z-50">
      <Link href="/ai/wellness-companion" className="group">
        <div className="glass h-16 w-16 md:h-20 md:w-20 rounded-[2rem] flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all duration-500 shadow-2xl shadow-neon/30 border-neon/20 hover:border-neon/50">
          <div className="h-10 w-10 md:h-12 md:w-12 bg-neon rounded-2xl flex items-center justify-center text-bg font-black text-lg md:text-xl group-hover:shadow-[0_0_20px_rgba(192,255,0,0.5)] transition-all duration-500">AI</div>
        </div>
        {/* Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 glass rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none whitespace-nowrap border-neon/20">
          <span className="text-[10px] font-bold text-neon uppercase tracking-widest">Chat with Companion</span>
        </div>
      </Link>
    </div>
  );
}
