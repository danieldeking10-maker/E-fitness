'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Trash2, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getApiBaseUrl } from '@/lib/api';
import { SiteNavbar } from '@/components/SiteNavbar';

interface Message {
  id: string;
  role: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'How do I optimize sleep architecture after heavy training?',
  'Calculate target daily protein and hydration intake',
  'What are the best knee-friendly quad compound movements?',
  'How do I identify and manage central nervous system fatigue?',
];

export default function WellnessCompanionPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      text: 'Welcome back. I am your E-fitness Coaching Companion. Your biometrics and recovery targets are synced—ask about training periodization, sleep restoration, nutrition timing, or movement mechanics.',
      timestamp: 'Ready',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!voiceEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const onSend = async (e?: React.FormEvent, customText?: string) => {
    e?.preventDefault();
    const query = (customText || inputValue).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/ai/wellness-companion/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      const replyText =
        data.reply ||
        'Protocol acknowledged. Focus on progressive overload and allow sufficient inter-set recovery.';

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (voiceEnabled) {
        speakText(replyText);
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: 'Hydration and sleep remain your primary restorative levers today. Aim for 2.0g protein/kg bodyweight and 8 hours of nocturnal slow-wave sleep.',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setMessages([
      {
        id: Date.now().toString(),
        role: 'ai',
        text: 'Conversation cleared. Ready for your next training or recovery inquiry.',
        timestamp: 'Ready',
      },
    ]);
  };

  return (
    <div className="h-[100svh] flex flex-col bg-bg text-white selection:bg-neon selection:text-bg overflow-hidden">
      <SiteNavbar />

      {/* Sub-header for Companion controls */}
      <div className="pt-16 border-b border-white/10 bg-[#0D0F14]">
        <div className="max-w-4xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-base md:text-lg tracking-tight text-white">
              Wellness Performance Companion
            </h1>
            <p className="text-[11px] font-mono text-zinc-400">
              Exercise Science · Recovery & Nutrition Guidance
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={cn(
                'h-9 px-3.5 rounded-full border text-xs font-bold flex items-center gap-1.5 transition-colors',
                voiceEnabled
                  ? 'bg-neon/15 border-neon/40 text-neon'
                  : 'bg-white/[0.04] border-white/10 text-zinc-300 hover:text-white'
              )}
              title={voiceEnabled ? 'Voice readout active' : 'Enable voice readout'}
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {voiceEnabled ? 'Voice On' : 'Voice Off'}
              </span>
            </button>

            <button
              type="button"
              onClick={clearChat}
              className="h-9 w-9 border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors bg-white/[0.04]"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scrollbar-hide"
      >
        <div className="max-w-3xl mx-auto space-y-6 pb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex flex-col',
                msg.role === 'user' ? 'items-end' : 'items-start'
              )}
            >
              <div className="flex items-center gap-2 mb-1.5 px-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400 tabular">
                <span>
                  {msg.role === 'user' ? 'Athlete' : 'E-fitness Coach'}
                </span>
                <span>· {msg.timestamp}</span>
              </div>

              <div
                className={cn(
                  'p-5 rounded-3xl max-w-[88%] text-sm leading-relaxed whitespace-pre-wrap',
                  msg.role === 'user'
                    ? 'bg-white/10 border border-white/15 text-white rounded-tr-none'
                    : 'bg-surface/95 border border-neon/25 text-zinc-200 rounded-tl-none'
                )}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex flex-col items-start">
              <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 px-1">
                Reviewing Exercise Physiology...
              </div>
              <div className="bg-surface/90 px-5 py-4 rounded-3xl rounded-tl-none border border-white/10 text-zinc-300 text-sm">
                Formulating physiological recommendation...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Footer */}
      <footer className="p-4 md:p-5 border-t border-white/10 bg-[#0D0F14]">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onSend(undefined, prompt)}
                className="px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 text-xs text-zinc-300 hover:text-white hover:border-neon/40 whitespace-nowrap transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={onSend} className="relative flex items-center">
            <input
              type="text"
              placeholder="Ask about recovery, hypertrophy, nutrition timing, or movement form..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-black/60 border border-white/15 rounded-full px-6 py-3.5 text-sm outline-none focus:border-neon/60 transition-colors pr-14 placeholder:text-zinc-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              aria-label="Send message"
              className="absolute right-1.5 h-10 w-10 bg-neon text-bg rounded-full flex items-center justify-center font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
