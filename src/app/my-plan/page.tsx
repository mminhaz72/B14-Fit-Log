'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MyPlanPage() {
  const [activeTab, setActiveTab] = useState<'plan' | 'saved'>('plan');
  const [planWorkouts, setPlanWorkouts] = useState<any[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<any[]>([]);
  const [doneWorkouts, setDoneWorkouts] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('duration');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const storedPlan = JSON.parse(localStorage.getItem('fitLogPlan') || '[]');
    const storedSaved = JSON.parse(localStorage.getItem('fitLogSaved') || '[]');
    const storedDone = JSON.parse(localStorage.getItem('fitLogDone') || '[]');
    setPlanWorkouts(storedPlan);
    setSavedWorkouts(storedSaved);
    setDoneWorkouts(storedDone);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRemoveFromPlan = (id: number) => {
    const updated = planWorkouts.filter((item) => item.id !== id);
    setPlanWorkouts(updated);
    localStorage.setItem('fitLogPlan', JSON.stringify(updated));
    showToast('❌ Removed from today\'s plan');
  };

  const handleRemoveFromSaved = (id: number) => {
    const updated = savedWorkouts.filter((item) => item.id !== id);
    setSavedWorkouts(updated);
    localStorage.setItem('fitLogSaved', JSON.stringify(updated));
    showToast('❌ Removed from saved list');
  };

  const handleToggleDone = (id: number) => {
    let updatedDone = [...doneWorkouts];
    if (updatedDone.includes(id)) {
      updatedDone = updatedDone.filter((item) => item !== id);
      showToast('🔄 Workout marked incomplete');
    } else {
      updatedDone.push(id);
      showToast('🎉 Workout marked as done!');
    }
    setDoneWorkouts(updatedDone);
    localStorage.setItem('fitLogDone', JSON.stringify(updatedDone));
  };

  const rawList = activeTab === 'plan' ? planWorkouts : savedWorkouts;

  const sortedList = [...rawList].sort((a, b) => {
    if (sortBy === 'duration') return Number(a.duration) - Number(b.duration);
    if (sortBy === 'calories') return Number(b.caloriesBurned) - Number(b.caloriesBurned);
    if (sortBy === 'rating') return Number(b.rating) - Number(a.rating);
    return 0;
  });

  const totalExercises = planWorkouts.length;
  const totalDuration = planWorkouts.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);
  const totalCalories = planWorkouts.reduce((acc, curr) => acc + (Number(curr.caloriesBurned) || 0), 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 lg:p-12 relative">
      {toast && (
        <div className="fixed top-20 right-6 bg-lime-400 text-neutral-950 font-bold px-6 py-3 rounded-lg shadow-2xl z-50">
          {toast}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-wider mb-2">MY PLAN</h1>
        <p className="text-neutral-400 text-sm mb-8">Cap of five lifts for today. Finish them, then load more.</p>

        <div className="grid grid-cols-3 gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8 text-center shadow-lg">
          <div>
            <p className="text-neutral-400 text-xs uppercase font-semibold">Exercises</p>
            <p className="text-3xl font-black text-lime-400 mt-1">{totalExercises}</p>
          </div>
          <div>
            <p className="text-neutral-400 text-xs uppercase font-semibold">Minutes</p>
            <p className="text-3xl font-black text-white mt-1">{totalDuration}m</p>
          </div>
          <div>
            <p className="text-neutral-400 text-xs uppercase font-semibold">Calories</p>
            <p className="text-3xl font-black text-white mt-1">{totalCalories}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 mb-8 gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('plan')}
              className={`pb-3 font-bold text-sm uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'plan' ? 'border-lime-400 text-lime-400' : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Today's Plan ({planWorkouts.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-3 font-bold text-sm uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'saved' ? 'border-lime-400 text-lime-400' : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Saved ({savedWorkouts.length})
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-lg mb-3 md:mb-0">
            <span className="text-xs text-neutral-400 uppercase font-semibold">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-lime-400 font-bold text-sm focus:outline-none cursor-pointer"
            >
              <option value="duration" className="bg-neutral-900 text-white">Duration</option>
              <option value="calories" className="bg-neutral-900 text-white">Calories</option>
              <option value="rating" className="bg-neutral-900 text-white">Rating</option>
            </select>
          </div>
        </div>

        {sortedList.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
            <h3 className="text-xl font-bold uppercase tracking-wider mb-2">NOTHING HERE YET</h3>
            <p className="text-neutral-400 text-sm mb-6">Browse the library and add a lift to get today moving.</p>
            <Link
              href="/"
              className="bg-lime-400 text-neutral-950 font-bold px-8 py-3 rounded-md hover:bg-lime-300 transition-colors inline-block uppercase tracking-wider text-sm shadow-lg"
            >
              Go to workouts
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedList.map((workout) => {
              const isDone = doneWorkouts.includes(workout.id);
              return (
                <div
                  key={workout.id}
                  className={`bg-neutral-900 border rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${
                    isDone ? 'border-lime-400/50 bg-neutral-900/80 opacity-75' : 'border-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img src={workout.image} alt={workout.name} className="w-20 h-20 object-cover rounded-lg bg-neutral-800" />
                    <div>
                      <span className="text-xs text-lime-400 font-semibold uppercase">{workout.muscleGroups?.[0]}</span>
                      <h3 className={`text-lg font-bold uppercase ${isDone ? 'line-through text-neutral-400' : 'text-white'}`}>
                        {workout.name}
                      </h3>
                      <p className="text-neutral-400 text-xs mt-1">
                        ⏱️ {workout.duration} min | 🔥 {workout.caloriesBurned} kcal | ⭐ {workout.rating}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                    <Link
                      href={`/workouts/${workout.id}`}
                      className="bg-neutral-800 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-neutral-700 transition-all uppercase"
                    >
                      View Details
                    </Link>

                    {activeTab === 'plan' && (
                      <button
                        onClick={() => handleToggleDone(workout.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all uppercase ${
                          isDone
                            ? 'bg-lime-400 text-neutral-950 hover:bg-lime-300'
                            : 'bg-neutral-800 text-lime-400 border border-lime-400/30 hover:bg-lime-400 hover:text-neutral-950'
                        }`}
                      >
                        {isDone ? '✓ Done' : 'Mark as Done'}
                      </button>
                    )}

                    <button
                      onClick={() => activeTab === 'plan' ? handleRemoveFromPlan(workout.id) : handleRemoveFromSaved(workout.id)}
                      className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                    >
                      ✕ Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}