'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Mic, Settings, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { getApiBaseUrl } from '@/lib/api';


interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export default function WellnessCompanionPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      text: "Hello! I've analyzed your workout from earlier. Your heart rate recovery was exceptionally fast (32bpm in 60s). This suggests your cardiovascular base is improving.",
      timestamp: '14:20',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -40,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
      });
      gsap.from(footerRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        delay: 0.2,
      });
    });
    return () => ctx.revert();
  }, []);

  const onSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/ai/wellness-companion/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      });
      
      if (!res.ok) throw new Error('API request failed');
      
      const data = await res.json();
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: data.reply || "Based on your current fatigue markers, I recommend holding the intensity but adding one extra set to your primary lifts.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: "I'm having a slight sync issue, but based on your profile, ensure you're hydrating properly today. Let's try again in a moment.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-[100svh] flex flex-col bg-bg text-white selection:bg-neon selection:text-bg overflow-hidden relative">
      {/* Top Bar */}
      <header ref={headerRef} className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between glass z-20">
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/" className="h-9 w-9 md:h-11 md:w-11 border border-white/10 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
          <div className="h-10 w-10 md:h-12 md:w-12 bg-neon rounded-2xl flex items-center justify-center text-bg font-black shadow-neon-glow transform -rotate-3">AI</div>
          <div>
            <div className="font-heading font-bold text-xs md:text-sm tracking-tight">Wellness Companion</div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-neon rounded-full animate-pulse shadow-[0_0_8px_#C0FF00]"></span>
              <span className="text-[9px] md:text-[10px] text-neon font-black uppercase tracking-[0.2em]">Neural Active</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="h-9 w-9 md:h-11 md:w-11 glass border-white/5 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 scroll-smooth scrollbar-hide no-scrollbar"
      >
        <div className="max-w-3xl mx-auto space-y-12 pb-10">
          <div className="text-center py-10 opacity-50">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[8px] md:text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">
               Precision Coaching Matrix Engaged
             </div>
          </div>

          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex flex-col max-w-[90%] md:max-w-[75%] animate-in fade-in slide-in-from-bottom-4 duration-700",
                msg.role === 'user' ? "items-end ml-auto" : "items-start"
              )}
            >
              <div 
                className={cn(
                  "p-5 md:p-7 rounded-[2.5rem] text-sm md:text-[15px] leading-relaxed relative group transition-all duration-500",
                  msg.role === 'ai' 
                    ? "bg-zinc-900/60 border border-white/5 rounded-tl-none hover:border-neon/20" 
                    : "bg-neon text-bg font-black rounded-tr-none shadow-neon-glow"
                )}
              >
                {msg.text}
                <div className={cn(
                  "absolute opacity-0 group-hover:opacity-60 transition-opacity text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 py-2",
                  msg.role === 'ai' ? "left-1 -bottom-8" : "right-1 -bottom-8"
                )}>
                  SYNCED {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex flex-col items-start max-w-[85%] animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="bg-zinc-900/40 border border-white/5 p-6 rounded-[2rem] rounded-tl-none">
                <div className="flex gap-2">
                  <div className="h-1.5 w-1.5 bg-neon rounded-full animate-bounce shadow-neon-glow" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-1.5 w-1.5 bg-neon rounded-full animate-bounce shadow-neon-glow" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-1.5 w-1.5 bg-neon rounded-full animate-bounce shadow-neon-glow" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Input */}
      <footer ref={footerRef} className="p-4 md:p-10 relative z-20 glass border-t border-white/5">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar mask-fade-right">
            {[
              'Recovery Protocol',
              'Macro Analysis',
              'Form Optimization',
              'Next Session',
              'Sleep Quality'
            ].map(tag => (
              <button 
                key={tag} 
                onClick={() => setInputValue(tag)}
                className="glass px-6 py-3 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap hover:border-neon/50 hover:text-neon hover:bg-neon/5 transition-all duration-300"
              >
                {tag}
              </button>
            ))}
          </div>
          
          <form onSubmit={onSend} className="relative group">
            <div className="absolute inset-0 bg-neon/10 blur-[40px] rounded-[3rem] opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
            <input 
              type="text" 
              placeholder="Query your companion..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-[2.5rem] px-8 md:px-10 py-6 md:py-8 text-sm md:text-base outline-none focus:border-neon/50 transition-all shadow-2xl relative z-10 pr-32 placeholder:text-zinc-600" 
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3 md:gap-4 z-20">
               <button type="button" className="h-12 w-12 md:h-14 md:w-14 text-zinc-600 hover:text-neon transition-colors flex items-center justify-center">
                 <Mic className="w-5 h-5 md:w-6 md:h-6" />
               </button>
               <button 
                 type="submit" 
                 disabled={!inputValue.trim() || loading}
                 className="h-12 w-12 md:h-14 md:w-14 bg-neon text-bg rounded-2xl flex items-center justify-center font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale shadow-neon-glow"
               >
                 <ArrowRight className="w-6 h-6 md:w-7 md:h-7" />
               </button>
            </div>
          </form>

          <div className="flex items-center justify-center gap-10 opacity-30">
             <span className="h-px flex-1 bg-zinc-800"></span>
             <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.4em] whitespace-nowrap">
               E-fitness AI v2.4.0
             </p>
             <span className="h-px flex-1 bg-zinc-800"></span>
          </div>
        </div>
      </footer>

      {/* Ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon/[0.03] blur-[150px] rounded-full -z-10 pointer-events-none"></div>
    </main>
  );
}
