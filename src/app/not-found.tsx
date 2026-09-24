import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-black text-lime-400 mb-4">404</h1>
      <h2 className="text-2xl font-bold uppercase tracking-wider mb-2">Page Not Found</h2>
      <p className="text-neutral-400 text-sm max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved. Head back to the workout library to keep training.
      </p>
      <Link
        href="/"
        className="bg-lime-400 text-neutral-950 font-bold px-8 py-3 rounded-lg hover:bg-lime-300 transition-colors uppercase tracking-wider text-sm shadow-lg"
      >
        Back to Home
      </Link>
    </div>
  );
}