'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import {
  Activity,
  ArrowRight,
  BookmarkCheck,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Dumbbell,
  Play,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SiteNavbar } from '@/components/SiteNavbar';
import { SiteFooter } from '@/components/SiteFooter';
import { FitnessSlideshow3D } from '@/components/FitnessSlideshow3D';
import {
  EventCategory,
  FITNESS_EVENTS,
  FitnessEvent,
} from '@/data/fitness-events';
import {
  getAthleteProfile,
  toggleEventRegistration,
} from '@/lib/athlete-store';

type FilterTab = 'All' | EventCategory;

const FILTER_TABS: FilterTab[] = ['All', 'Strength', 'Conditioning', 'Recovery'];

const ECOSYSTEM_MODULES = [
  {
    num: '01',
    title: 'Wellness Assessment',
    summary:
      'Calibrate your neurological readiness, nocturnal sleep quality, orthopedic constraints, and training cadence.',
    href: '/ai/wellness-assessment',
    cta: 'Run Intake Assessment',
  },
  {
    num: '02',
    title: 'Workout Generator',
    summary:
      'Periodized strength, conditioning, and mobility sessions built around your equipment, duration, and live timer.',
    href: '/ai/workout-generator',
    cta: 'Open Generator',
  },
  {
    num: '03',
    title: 'Wellness Companion',
    summary:
      'On-demand exercise physiology guidance for recovery pacing, macronutrient timing, and form adjustments.',
    href: '/ai/wellness-companion',
    cta: 'Consult Companion',
  },
  {
    num: '04',
    title: 'Athlete Performance Hub',
    summary:
      'Track registered combine events, completed microcycles, readiness scores, and active prescribed workouts.',
    href: '/dashboard',
    cta: 'Open Athlete Hub',
  },
];

const PLANS = [
  {
    name: 'Guest Pass',
    monthlyPrice: '$0',
    annualPrice: '$0',
    desc: 'Essential biological screening & event inspection',
    features: [
      'Core Wellness Assessment',
      'Baseline Readiness Index',
      'Event Schedule & Protocol Preview',
      'Daily Biometric Profile',
    ],
    ctaHref: '/ai/wellness-assessment',
    ctaLabel: 'Start Free Assessment',
  },
  {
    name: 'Core Athlete',
    monthlyPrice: '$15',
    annualPrice: '$12',
    desc: 'Complete daily coaching & adaptive programming',
    features: [
      'Unlimited Workout Generation',
      'Full Wellness Companion History',
      'Constraint-Aware Movement Swaps',
      'Interactive Live Rest Timer',
      'Weekly Microcycle Tracking',
    ],
    recommended: true,
    ctaHref: '/register',
    ctaLabel: 'Join Core Athlete',
  },
  {
    name: 'Elite Infinite',
    monthlyPrice: '$35',
    annualPrice: '$28',
    desc: 'Full combine event access & lab telemetry',
    features: [
      'Everything in Core Athlete',
      'Priority Live Combine Reservations',
      'Structured Deload Periodization',
      'Voice-Guided Recovery Briefings',
      'Dedicated Athlete Command Center',
    ],
    ctaHref: '/register',
    ctaLabel: 'Join Elite Infinite',
  },
];

const FAQS = [
  {
    q: 'How does E-fitness calculate my readiness score?',
    a: 'We evaluate your sleep architecture index, training frequency cadence, and orthopedic constraints to compute a calibrated readiness percentage that scales session volume and RPE targets.',
  },
  {
    q: 'Can I load any 3D slideshow event directly into a live workout?',
    a: 'Yes. Every event featured in the 3D stage and schedule links directly into the Workout Generator with sets, reps, rest intervals, and technical cues preloaded for live execution.',
  },
  {
    q: 'How do biomechanical constraints affect generated protocols?',
    a: 'If you record knee sensitivity, lower-back fatigue, or shoulder restrictions in the Wellness Assessment, your active profile flags those constraints so coaching recommendations stay joint-friendly.',
  },
  {
    q: 'Where are my RSVP events and completed workouts stored?',
    a: 'Your Athlete Performance Hub syncs registered combine events, completed session counts, weekly day checkmarks, and active protocols across every page of the application.',
  },
];

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState<FilterTab>('All');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedEvent, setSelectedEvent] = useState<FitnessEvent | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [readinessScore, setReadinessScore] = useState<number>(86);

  useEffect(() => {
    const syncProfile = () => {
      const profile = getAthleteProfile();
      setRegisteredIds(profile.registeredEventIds || []);
      setReadinessScore(profile.readinessScore || 86);
    };
    syncProfile();
    window.addEventListener('athlete_profile_updated', syncProfile);
    return () => window.removeEventListener('athlete_profile_updated', syncProfile);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleToggleRegister = (eventId: string) => {
    const updated = toggleEventRegistration(eventId);
    setRegisteredIds(updated.registeredEventIds || []);
  };

  const filteredEvents =
    activeCategory === 'All'
      ? FITNESS_EVENTS
      : FITNESS_EVENTS.filter((ev) => ev.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-bg text-zinc-100 selection:bg-neon selection:text-bg">
      <SiteNavbar />

      <main>
        <FitnessSlideshow3D
          events={FITNESS_EVENTS}
          onInspectEvent={(ev) => setSelectedEvent(ev)}
          registeredIds={registeredIds}
          onToggleRegister={handleToggleRegister}
        />

        {/* Athlete Quick Action Bar */}
        <section className="border-b border-white/10 bg-[#0D0F14]">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-2xl bg-neon/10 border border-neon/25 flex items-center justify-center text-neon shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  CNS Readiness
                </div>
                <div className="font-heading text-2xl font-extrabold text-white tabular">
                  {readinessScore}%
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-200 shrink-0">
                <Calendar className="w-5 h-5 text-neon" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Registered Events
                </div>
                <div className="font-heading text-2xl font-extrabold text-white tabular">
                  {registeredIds.length} Saved
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-200 shrink-0">
                <Dumbbell className="w-5 h-5 text-neon" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Live Protocols
                </div>
                <div className="font-heading text-2xl font-extrabold text-white tabular">
                  {FITNESS_EVENTS.length} Disciplines
                </div>
              </div>
            </div>

            <div className="flex sm:justify-end">
              <Link
                href="/ai/wellness-assessment"
                className="w-full sm:w-auto btn-neon py-3 px-6 text-xs font-bold gap-2"
              >
                <span>Calibrate Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Fitness Events & Workout Schedule */}
        <section id="events" className="max-w-7xl mx-auto px-6 md:px-8 py-24">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div className="max-w-2xl">
              <div className="text-[11px] font-mono uppercase tracking-[0.24em] text-neon mb-3">
                Realistic Fitness Events & Sessions
              </div>
              <h2 className="font-heading text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
                Train Live or Load Any Protocol.
              </h2>
            </div>

            <div
              role="tablist"
              aria-label="Filter fitness events by discipline"
              className="flex flex-wrap items-center gap-2 bg-white/[0.04] border border-white/10 p-1.5 rounded-full self-start"
            >
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === tab}
                  onClick={() => setActiveCategory(tab)}
                  className={cn(
                    'px-4 py-2 rounded-full text-xs font-bold transition-all',
                    activeCategory === tab
                      ? 'bg-neon text-bg'
                      : 'text-zinc-400 hover:text-white'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredEvents.map((ev) => {
              const isSaved = registeredIds.includes(ev.id);
              return (
                <article
                  key={ev.id}
                  className="bg-surface/90 border border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-neon/40 transition-colors"
                >
                  <div>
                    <div className="aspect-[16/10] relative overflow-hidden bg-zinc-900">
                      <img
                        src={ev.img}
                        alt={ev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 bg-[#0A0A0A]/90 border border-white/15 px-3 py-1 rounded-md text-[11px] font-mono text-neon">
                        {ev.slideNum} · {ev.category}
                      </div>
                    </div>

                    <div className="p-7">
                      <div className="text-[11px] font-mono text-zinc-400 mb-2 tabular">
                        {ev.schedule} · {ev.venue}
                      </div>
                      <h3 className="font-heading text-xl font-bold tracking-tight text-white mb-2">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-5 line-clamp-3">
                        {ev.overview}
                      </p>

                      <div className="flex items-center justify-between text-xs font-mono text-zinc-300 pt-4 border-t border-white/10 tabular">
                        <span>{ev.coach}</span>
                        <span className="text-neon">
                          {ev.durationMinutes} min · {ev.intensity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-7 pb-7 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(ev)}
                      className="flex-1 bg-white/[0.06] border border-white/15 hover:bg-neon hover:text-bg hover:border-neon py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Inspect</span>
                    </button>

                    <Link
                      href={`/ai/workout-generator?event=${ev.id}`}
                      className="flex-1 bg-neon/10 border border-neon/35 text-neon hover:bg-neon hover:text-bg py-3 rounded-xl text-xs font-bold transition-all text-center"
                    >
                      Load Workout
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleToggleRegister(ev.id)}
                      aria-label={isSaved ? `Remove ${ev.title} RSVP` : `RSVP for ${ev.title}`}
                      className={cn(
                        'h-10 w-10 rounded-xl border flex items-center justify-center transition-colors shrink-0',
                        isSaved
                          ? 'bg-neon text-bg border-neon'
                          : 'bg-white/[0.04] border-white/15 text-zinc-300 hover:border-white/35'
                      )}
                    >
                      <BookmarkCheck className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Core Ecosystem */}
        <section className="border-y border-white/10 bg-[#0D0F14] py-24 px-6 md:px-8">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
            <div className="lg:w-5/12 lg:sticky lg:top-28 lg:h-fit">
              <div className="text-[11px] font-mono uppercase tracking-[0.24em] text-neon mb-4">
                Integrated Coaching System
              </div>
              <h2 className="font-heading text-4xl md:text-6xl font-extrabold leading-[1.04] tracking-tight mb-6">
                Intelligence for Every Rep & Recovery Cycle.
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed mb-8">
                Every module shares your live biometric profile—connecting readiness intake, generated workouts, event RSVPs, and physiological coaching into a single cohesive platform.
              </p>
              <Link
                href="/dashboard"
                className="btn-glass w-fit text-xs font-bold gap-2"
              >
                <span>Open Athlete Hub</span>
                <ArrowRight className="w-4 h-4 text-neon" />
              </Link>
            </div>

            <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {ECOSYSTEM_MODULES.map((mod) => (
                <div
                  key={mod.num}
                  className="bg-surface/90 border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:border-neon/35 transition-colors"
                >
                  <div>
                    <div className="font-mono text-2xl font-bold text-neon mb-4 tabular">
                      {mod.num}
                    </div>
                    <h3 className="font-heading text-2xl font-bold tracking-tight mb-3 text-white">
                      {mod.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                      {mod.summary}
                    </p>
                  </div>
                  <Link
                    href={mod.href}
                    className="text-neon text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    <span>{mod.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Membership Pricing */}
        <section className="py-24 px-6 md:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.24em] text-neon mb-3">
                Transparent Membership
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight">
                Invest in Physical Longevity.
              </h2>
            </div>

            <div className="inline-flex items-center gap-1.5 p-1.5 bg-white/[0.04] border border-white/10 rounded-full self-start">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={cn(
                  'px-5 py-2 rounded-full text-xs font-bold transition-all',
                  billingCycle === 'monthly'
                    ? 'bg-white text-bg'
                    : 'text-zinc-400 hover:text-white'
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={cn(
                  'px-5 py-2 rounded-full text-xs font-bold transition-all',
                  billingCycle === 'annual'
                    ? 'bg-neon text-bg'
                    : 'text-zinc-400 hover:text-white'
                )}
              >
                Annual · Save 20%
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-stretch">
            {PLANS.map((plan) => {
              const price =
                billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
              return (
                <div
                  key={plan.name}
                  className={cn(
                    'bg-surface/90 border rounded-3xl p-8 md:p-10 flex flex-col justify-between transition-colors',
                    plan.recommended
                      ? 'border-neon/60 bg-neon/[0.03]'
                      : 'border-white/10 hover:border-white/25'
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading text-2xl font-bold text-white">
                        {plan.name}
                      </h3>
                      {plan.recommended && (
                        <span className="text-[11px] font-mono uppercase tracking-wider text-neon">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-400 text-xs mb-7">{plan.desc}</p>

                    <div className="mb-8">
                      <div className="text-5xl font-heading font-black tracking-tight text-white tabular">
                        {price}
                        <span className="text-sm font-normal text-zinc-400 ml-1">
                          /month
                        </span>
                      </div>
                      {billingCycle === 'annual' && plan.monthlyPrice !== '$0' && (
                        <div className="text-xs font-mono text-neon mt-1.5 tabular">
                          Billed annually (${Number(price.replace('$', '')) * 12}/yr)
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3 pt-6 border-t border-white/10">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-3 text-xs text-zinc-300"
                        >
                          <Check className="w-4 h-4 text-neon shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-9">
                    <Link
                      href={plan.ctaHref}
                      className={cn(
                        'w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider block text-center transition-all',
                        plan.recommended
                          ? 'bg-neon text-bg hover:shadow-neon-glow'
                          : 'bg-white/[0.06] border border-white/15 text-white hover:bg-white/10'
                      )}
                    >
                      {plan.ctaLabel}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 max-w-4xl mx-auto px-6 md:px-8 border-t border-white/10">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
              Science & Protocol Inquiries
            </h2>
            <p className="text-zinc-400 text-sm">
              How our readiness calibration, event protocols, and generative programming work together.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="bg-surface/85 border border-white/10 rounded-2xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-heading font-bold text-base md:text-lg text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-neon shrink-0 transition-transform duration-300',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-zinc-400 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Event Protocol Inspection Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#12151B] border border-white/15 rounded-3xl p-6 md:p-8 relative max-h-[90svh] overflow-y-auto shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              aria-label="Close protocol inspection"
              className="absolute top-5 right-5 h-9 w-9 rounded-full bg-white/[0.06] border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-neon mb-2">
              {selectedEvent.slideNum} · {selectedEvent.category} · {selectedEvent.schedule}
            </div>
            <h3 className="font-heading text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
              {selectedEvent.title}
            </h3>
            <div className="text-xs font-mono text-zinc-400 mb-5 flex flex-wrap gap-4 tabular">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-neon" />
                {selectedEvent.coach}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neon" />
                {selectedEvent.durationMinutes} min · {selectedEvent.intensity}
              </span>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed mb-6">
              {selectedEvent.overview}
            </p>

            <div className="space-y-2.5 mb-7">
              <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                Programmed Movements
              </div>
              {selectedEvent.exercises.map((ex, i) => (
                <div
                  key={ex.name}
                  className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-sm font-bold text-white">
                      0{i + 1}. {ex.name}
                    </div>
                    <div className="text-xs text-zinc-400">{ex.focus}</div>
                  </div>
                  <div className="text-right font-mono text-xs tabular shrink-0">
                    <div className="text-white font-bold">
                      {ex.sets} × {ex.reps}
                    </div>
                    <div className="text-neon">{ex.load}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/ai/workout-generator?event=${selectedEvent.id}`}
                onClick={() => setSelectedEvent(null)}
                className="btn-neon flex-1 py-3.5 text-xs font-bold text-center gap-2"
              >
                <span>Load into Generator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => handleToggleRegister(selectedEvent.id)}
                className={cn(
                  'px-6 py-3.5 rounded-full text-xs font-bold border transition-colors',
                  registeredIds.includes(selectedEvent.id)
                    ? 'border-neon bg-neon/15 text-neon'
                    : 'border-white/15 text-white hover:border-white/30'
                )}
              >
                {registeredIds.includes(selectedEvent.id)
                  ? 'Saved in Athlete Hub'
                  : 'Save Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
