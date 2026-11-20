'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/#events', label: 'Events' },
  { href: '/dashboard', label: 'Athlete Hub' },
  { href: '/ai/wellness-assessment', label: 'Assessment' },
  { href: '/ai/workout-generator', label: 'Generator' },
  { href: '/ai/wellness-companion', label: 'Companion' },
];

export function SiteNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#0A0A0A]/92 border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-8 h-16">
        <Link
          href="/"
          className="font-heading text-lg font-extrabold tracking-tight text-white hover:text-neon transition-colors whitespace-nowrap"
        >
          E-fitness
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href !== '/#events' && pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-xs font-semibold tracking-wide transition-colors whitespace-nowrap',
                  isActive
                    ? 'text-neon'
                    : 'text-zinc-400 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors px-3 py-2 whitespace-nowrap"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-neon text-bg px-5 py-2 rounded-full text-xs font-bold hover:shadow-neon-glow transition-all active:scale-95 whitespace-nowrap"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="lg:hidden p-2 rounded-lg text-zinc-300 hover:text-white border border-white/10 bg-white/[0.04]"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0A0A0A] px-6 py-5 space-y-4">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href !== '/#events' && pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'text-sm font-semibold py-1.5 transition-colors',
                    isActive ? 'text-neon' : 'text-zinc-300 hover:text-white'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-white/10 flex items-center gap-3">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 py-2.5 text-center rounded-full border border-white/15 text-xs font-bold text-white"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="flex-1 py-2.5 text-center rounded-full bg-neon text-bg text-xs font-bold"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
