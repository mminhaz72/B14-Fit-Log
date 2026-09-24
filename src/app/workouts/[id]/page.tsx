'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WorkoutDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`https://api.abcz.workers.dev/api/fitlog/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setWorkout(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching workout details:', err);
        setLoading(false);
      });
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToPlan = () => {
    const plan = JSON.parse(localStorage.getItem('fitLogPlan') || '[]');
    if (plan.length >= 5) {
      showToast('⚠️ Plan limit reached (Max 5 lifts for today)!');
      return;
    }
    if (!plan.some((item: any) => item.id === workout.id)) {
      plan.push(workout);
      localStorage.setItem('fitLogPlan', JSON.stringify(plan));
      showToast('✅ Added to today\'s plan');
    } else {
      showToast('ℹ️ Already in today\'s plan');
    }
  };

  const handleSaveForLater = () => {
    const saved = JSON.parse(localStorage.getItem('fitLogSaved') || '[]');
    if (!saved.some((item: any) => item.id === workout.id)) {
      saved.push(workout);
      localStorage.setItem('fitLogSaved', JSON.stringify(saved));
      showToast('💾 Saved for later');
    } else {
      showToast('ℹ️ Already saved');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">Loading details...</div>;
  }

  if (!workout) {
    return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">Workout not found.</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 lg:p-16 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 bg-lime-400 text-neutral-950 font-bold px-6 py-3 rounded-lg shadow-2xl z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-xs text-neutral-400 hover:text-lime-400 mb-6 inline-block uppercase tracking-wider">
          ← Back to Library
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side: Image */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden h-[450px]">
            <img src={workout.image} alt={workout.name} className="w-full h-full object-cover" />
          </div>

          {/* Right Side: Details & Specs */}
          <div>
            <div className="flex gap-2 mb-3">
              {workout.muscleGroups?.map((mg: string, i: number) => (
                <span key={i} className="bg-neutral-900 border border-neutral-800 text-lime-400 text-xs px-3 py-1 rounded font-bold uppercase">
                  {mg}
                </span>
              ))}
            </div>
            <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight mb-3">{workout.name}</h1>
            <p className="text-neutral-400 text-sm lg:text-base mb-6 leading-relaxed">{workout.description}</p>

            {/* Key Specs Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden mb-8">
              <div className="grid grid-cols-2 border-b border-neutral-800 p-3 text-xs text-neutral-400 uppercase font-semibold">
                <span>Specification</span>
                <span>Detail</span>
              </div>
              <div className="grid grid-cols-2 p-3 text-sm border-b border-neutral-800/60">
                <span className="text-neutral-400">Equipment</span>
                <span className="font-bold">{workout.equipment}</span>
              </div>
              <div className="grid grid-cols-2 p-3 text-sm border-b border-neutral-800/60">
                <span className="text-neutral-400">Difficulty</span>
                <span className="font-bold text-lime-400">{workout.difficulty}</span>
              </div>
              <div className="grid grid-cols-2 p-3 text-sm border-b border-neutral-800/60">
                <span className="text-neutral-400">Sets & Reps</span>
                <span className="font-bold">{workout.sets} Sets / {workout.reps}</span>
              </div>
              <div className="grid grid-cols-2 p-3 text-sm border-b border-neutral-800/60">
                <span className="text-neutral-400">Duration</span>
                <span className="font-bold">{workout.duration} min</span>
              </div>
              <div className="grid grid-cols-2 p-3 text-sm border-b border-neutral-800/60">
                <span className="text-neutral-400">Calories Burned</span>
                <span className="font-bold">{workout.caloriesBurned} kcal</span>
              </div>
              <div className="grid grid-cols-2 p-3 text-sm">
                <span className="text-neutral-400">Rating</span>
                <span className="font-bold">⭐ {workout.rating}</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h3 className="text-lg font-black uppercase tracking-wider mb-4">Instructions</h3>
              <ol className="space-y-3">
                {workout.instructions?.map((step: string, index: number) => (
                  <li key={index} className="flex gap-3 text-sm text-neutral-300 bg-neutral-900/50 p-3 rounded-lg border border-neutral-800/50">
                    <span className="text-lime-400 font-bold">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToPlan}
                className="flex-1 bg-lime-400 text-neutral-950 font-bold py-3.5 px-6 rounded-lg hover:bg-lime-300 transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                ⚡ Add to today's plan
              </button>
              <button
                onClick={handleSaveForLater}
                className="flex-1 bg-neutral-900 border border-neutral-700 text-white font-bold py-3.5 px-6 rounded-lg hover:border-lime-400 transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2"
              >
                💾 Save for later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}