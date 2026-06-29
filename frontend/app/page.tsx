'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';

interface Movie {
  _id: string;
  title: string;
  genre: string[];
  releaseYear: number;
  rating: number;
  posterUrl: string;
  requiredPlan: string;
}



const planColors: Record<string, string> = {
  none: 'bg-white/10 text-white/50',
  basic: 'bg-sky-500/20 text-sky-300',
  standard: 'bg-violet-500/20 text-violet-300',
  premium: 'bg-amber-500/20 text-amber-300',
};

const planLabel: Record<string, string> = {
  none: 'FREE',
  basic: 'BASIC',
  standard: 'STANDARD',
  premium: 'PREMIUM',
};

export default function Home() {
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, logout } = useAuth();
  
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/movies');
        if (!response.ok) throw new Error('Failed to fetch movies');
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);
  

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  // If not logged in, show landing page
  if (!user) {
    return (
      <div
        className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
        style={{ background: '#0A0A0F' }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(229,9,20,0.18) 0%, transparent 70%)',
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
          <div
            className="text-[11px] tracking-[0.3em] uppercase mb-6 font-semibold"
            style={{ color: '#E50914' }}
          >
            Welcome
          </div>

          <h1
            className="text-6xl sm:text-7xl font-black tracking-[-0.04em] leading-none mb-4"
            style={{
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            NET
            <span style={{ color: '#E50914' }}>FLIX</span>
          </h1>

          <p
            className="text-base mb-10 leading-relaxed"
            style={{ color: 'rgba(200,200,212,0.7)' }}
          >
            Unlimited movies, TV shows and more.
          </p>

          <div className="flex gap-3 w-full">
            <Link
              href="/login"
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-white text-center transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{ background: '#E50914' }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-center transition-all duration-200 hover:bg-white/10 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userPlan = user.subscription?.plan ?? 'none';

  return (
    <div
      className="min-h-screen"
      style={{ background: '#0A0A0F', color: '#fff', fontFamily: 'Inter, sans-serif' }}
    >
      {/* ─── Header ─── */}
      <header
        className="sticky top-0 z-50 px-5 py-3"
        style={{
          background: 'rgba(10,10,15,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <span
            className="text-xl font-black tracking-[-0.04em] select-none"
            style={{ color: '#E50914', letterSpacing: '-0.03em' }}
          >
            NET<span style={{ color: '#fff' }}>FLIX</span>
          </span>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors duration-150"
              style={{ color: '#fff' }}
            >
              Home
            </Link>
            <Link
              href="/subscription"
              className="text-sm font-medium transition-colors duration-150"
              style={{ color: 'rgba(200,200,212,0.55)' }}
            >
              Plans
            </Link>
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2.5">
            <span
              className="hidden md:block text-sm"
              style={{ color: 'rgba(200,200,212,0.55)' }}
            >
              {user.name}
            </span>

            {/* Plan badge */}
            <span
              className={`text-[11px] font-bold tracking-widest px-2.5 py-1 rounded-lg ${planColors[userPlan] ?? planColors['none']}`}
            >
              {planLabel[userPlan] ?? 'FREE'}
            </span>

            {user.isAdmin && (
              <Link
                href="/admin"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 hover:brightness-110"
                style={{
                  background: 'rgba(59,130,246,0.15)',
                  color: '#93c5fd',
                  border: '1px solid rgba(59,130,246,0.2)',
                }}
              >
                Admin
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 hover:brightness-110 active:scale-95"
              style={{
                background: 'rgba(229,9,20,0.15)',
                color: '#f87171',
                border: '1px solid rgba(229,9,20,0.2)',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main className="max-w-7xl mx-auto px-5 py-10">
        {/* Section header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p
              className="text-[11px] tracking-[0.25em] uppercase font-semibold mb-1"
              style={{ color: '#E50914' }}
            >
              Trending Now
            </p>
            <h2
              className="text-2xl font-bold tracking-tight"
              style={{ color: '#fff', letterSpacing: '-0.02em' }}
            >
              Popular Movies
            </h2>
          </div>
          <span
            className="text-xs font-medium hidden sm:block"
            style={{ color: 'rgba(200,200,212,0.4)' }}
          >
            {!isLoading && `${movies.length} titles`}
          </span>
        </div>

        {/* States */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden animate-pulse">
                <div
                  className="aspect-2/3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                />
                <div className="pt-3 space-y-2">
                  <div
                    className="h-3 rounded-full w-3/4"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  />
                  <div
                    className="h-2.5 rounded-full w-1/2"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-4xl mb-3">🎬</span>
            <p className="font-semibold" style={{ color: 'rgba(200,200,212,0.5)' }}>
              No movies available yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <Link
                key={movie._id}
                href={`/movie/${movie._id}`}
                className="group block"
              >
                {/* Poster */}
                <div
                  className="relative aspect-2/3 rounded-xl overflow-hidden mb-3 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                  }}
                >
                  {movie.posterUrl ? (
                    <Image
                      width={300}
                      height={450}
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center h-full text-3xl"
                      style={{ color: 'rgba(255,255,255,0.15)' }}
                    >
                      🎞
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-semibold" style={{ color: '#fbbf24' }}>
                        ★ {movie.rating}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {movie.releaseYear}
                      </span>
                    </div>
                    {movie.genre?.length > 0 && (
                      <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {movie.genre.slice(0, 2).join(' · ')}
                      </p>
                    )}
                  </div>

                  {/* Plan badge — top right */}
                  <div className="absolute top-2 right-2">
                    <span
                      className="text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded-md"
                      style={{
                        background: 'rgba(0,0,0,0.65)',
                        color:
                          movie.requiredPlan === 'premium'
                            ? '#fbbf24'
                            : movie.requiredPlan === 'standard'
                            ? '#a78bfa'
                            : 'rgba(255,255,255,0.5)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {movie.requiredPlan?.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Info below poster */}
                <h3
                  className="text-sm font-semibold truncate leading-tight"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                  {movie.title}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(200,200,212,0.4)' }}>
                  {movie.releaseYear}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}