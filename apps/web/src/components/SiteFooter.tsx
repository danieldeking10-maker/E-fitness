import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="py-16 px-6 md:px-8 border-t border-white/10 bg-[#08090C] text-zinc-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="space-y-3">
          <Link
            href="/"
            className="font-heading font-extrabold tracking-tight text-xl text-white inline-block"
          >
            E-fitness
          </Link>
          <p className="text-zinc-500 text-xs max-w-xs leading-relaxed">
            Biomechanical periodization, interactive 3D workout stages, and precision recovery analytics engineered for modern athletes.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          <div>
            <div className="text-[11px] font-bold text-white uppercase tracking-widest mb-4">
              Training Suite
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/#events" className="hover:text-neon transition-colors">
                  Event Schedule
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-neon transition-colors">
                  Athlete Hub
                </Link>
              </li>
              <li>
                <Link href="/ai/wellness-assessment" className="hover:text-neon transition-colors">
                  Wellness Assessment
                </Link>
              </li>
              <li>
                <Link href="/ai/workout-generator" className="hover:text-neon transition-colors">
                  Workout Generator
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-[11px] font-bold text-white uppercase tracking-widest mb-4">
              Coaching & Science
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/ai/wellness-companion" className="hover:text-neon transition-colors">
                  Wellness Companion
                </Link>
              </li>
              <li className="text-zinc-500">CNS Readiness Scoring</li>
              <li className="text-zinc-500">Eccentric Force Periodization</li>
              <li className="text-zinc-500">Autonomic HRV Recovery</li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="text-[11px] font-bold text-white uppercase tracking-widest mb-4">
              Membership
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/login" className="hover:text-neon transition-colors">
                  Member Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-neon transition-colors">
                  Create Athlete Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-500">
        <div>&copy; {new Date().getFullYear()} E-fitness. All rights reserved.</div>
        <div className="flex gap-6">
          <Link href="/ai/wellness-assessment" className="hover:text-white transition-colors">
            Biometric Calibration
          </Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Performance Archive
          </Link>
        </div>
      </div>
    </footer>
  );
}
