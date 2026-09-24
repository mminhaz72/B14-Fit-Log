'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      const plan = JSON.parse(localStorage.getItem('fitLogPlan') || '[]');
      const saved = JSON.parse(localStorage.getItem('fitLogSaved') || '[]');
      setPlanCount(plan.length);
      setSavedCount(saved.length);
    };

    updateCounts();
    const interval = setInterval(updateCounts, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-neutral-950 border-b border-neutral-800 sticky top-0 z-50 px-6 lg:px-16 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5">
        <img src="/logo.png" alt="FitLog Logo" className="w-8 h-8 object-contain" />
        <span className="font-black text-lg tracking-wider text-white uppercase">FITLOG</span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-6 text-sm font-semibold">
        <Link
          href="/"
          className={`transition-colors uppercase tracking-wider ${
            pathname === '/' ? 'text-lime-400 border-b-2 border-lime-400 pb-1' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Workout
        </Link>
        <Link
          href="/my-plan"
          className={`transition-colors uppercase tracking-wider ${
            pathname === '/my-plan' ? 'text-lime-400 border-b-2 border-lime-400 pb-1' : 'text-neutral-400 hover:text-white'
          }`}
        >
          My Plan
        </Link>
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-3">
        <Link
          href="/my-plan"
          className="bg-lime-400 text-neutral-950 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md hover:bg-lime-300 transition-all"
        >
          <span>Plan:</span>
          <span className="bg-neutral-950 text-lime-400 px-1.5 py-0.5 rounded-full">{planCount}</span>
        </Link>
        <Link
          href="/my-plan"
          className="border border-neutral-700 text-neutral-300 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:border-lime-400 hover:text-white transition-all"
        >
          <span>Saved:</span>
          <span className="bg-neutral-800 text-white px-1.5 py-0.5 rounded-full">{savedCount}</span>
        </Link>
      </div>
    </nav>
  );
}