'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.abcz.workers.dev/api/fitlog')
      .then((res) => res.json())
      .then((data) => {
        setWorkouts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching workouts:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Hero Section */}
      <section className="py-20 px-6 lg:px-16 border-b border-neutral-800 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="max-w-xl text-left">
          <span className="text-lime-400 text-xs font-bold uppercase tracking-widest bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-md inline-block mb-4">
            WORKOUT LIBRARY
          </span>
          <h1 className="text-4xl lg:text-6xl font-black mb-4 uppercase tracking-tight leading-none">
            TRAIN WITH INTENT. LOG EVERY SET.
          </h1>
          <p className="text-neutral-400 text-base mb-8">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today’s plan, and watch the week's work add up.
          </p>
          <a
            href="#library"
            className="bg-lime-400 text-neutral-950 font-bold px-6 py-3.5 rounded-lg hover:bg-lime-300 transition-colors inline-flex items-center gap-2 text-sm uppercase tracking-wider shadow-lg"
          >
            BROWSE WORKOUTS ↓
          </a>
        </div>
        <div className="w-full lg:w-[450px] h-[320px] flex items-center justify-center">
          <img 
            src="/banner.png" 
            alt="Hero Workout" 
            className="w-full h-full object-contain"
          />
        </div>
      </section>

      {/* Library Section */}
      <section id="library" className="py-16 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-wider">THE LIBRARY</h2>
            <p className="text-neutral-400 text-sm mt-1">Twelve lifts covering every major muscle group.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-400 mb-4"></div>
            <p className="text-neutral-400 text-lg font-medium">Loading workouts…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout: any) => (
              <Link
                key={workout.id}
                href={`/workouts/${workout.id}`}
                className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-lime-400 transition-all group flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="h-52 overflow-hidden bg-neutral-800 relative">
                    <img 
                      src={workout.image} 
                      alt={workout.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {workout.muscleGroups?.map((mg: string, i: number) => (
                        <span key={i} className="bg-neutral-800 text-lime-400 text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                          {mg}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-wide mt-2 mb-1 group-hover:text-lime-400 transition-colors">
                      {workout.name}
                    </h3>
                    <p className="text-neutral-400 text-xs">Equipment: {workout.equipment}</p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-3 border-t border-neutral-800/60 flex justify-between items-center text-xs text-neutral-400 font-medium">
                  <span>⏱️ {workout.duration} min</span>
                  <span>🔥 {workout.caloriesBurned} kcal</span>
                  <span>⭐ {workout.rating}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}