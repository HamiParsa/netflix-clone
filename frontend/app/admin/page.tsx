'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string[];
  releaseYear: number;
  duration: string;
  rating: number;
  posterUrl: string;
  backdropUrl: string;
  requiredPlan: string;
}

const inputClass = "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200";
const inputStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
};
const focusStyle = {
  border: '1px solid rgba(99,102,241,0.5)',
  background: 'rgba(255,255,255,0.08)',
};
const blurStyle = {
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.06)',
};

const planAccent: Record<string, string> = {
  basic: '#38bdf8',
  standard: '#a78bfa',
  premium: '#fbbf24',
};

export default function AdminPanel() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
    duration: '',
    rating: 8,
    posterUrl: '',
    backdropUrl: '',
    requiredPlan: 'basic',
  });
  const hasMounted = useRef(false);
  const router = useRouter();
  const { user, token } = useAuth();

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      setMounted(true);
    }
    if (mounted && !user?.isAdmin) {
      router.push('/');
    }
  }, [user, router, mounted]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/movies', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchMovies();
  }, [token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'releaseYear' || name === 'rating' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const movieData = {
      ...formData,
      genre: formData.genre.split(',').map((g) => g.trim()),
    };
    try {
      const url = editingMovie
        ? `http://localhost:5000/api/movies/${editingMovie._id}`
        : 'http://localhost:5000/api/movies';
      const method = editingMovie ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movieData),
      });
      if (!response.ok) throw new Error('Failed to save movie');
      const result = await response.json();
      if (editingMovie) {
        setMovies(movies.map((m) => (m._id === editingMovie._id ? result.movie : m)));
      } else {
        setMovies([...movies, result.movie]);
      }
      resetForm();
      setShowForm(false);
    } catch (error) {
      alert('Error saving movie');
      console.error(error);
    }
  };

  const handleDelete = async (movieId: string) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/movies/${movieId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete');
      setMovies(movies.filter((m) => m._id !== movieId));
    } catch (error) {
      alert('Error deleting movie');
      console.error(error);
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      genre: movie.genre.join(', '),
      releaseYear: movie.releaseYear,
      duration: movie.duration,
      rating: movie.rating,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      requiredPlan: movie.requiredPlan,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      genre: '',
      releaseYear: new Date().getFullYear(),
      duration: '',
      rating: 8,
      posterUrl: '',
      backdropUrl: '',
      requiredPlan: 'basic',
    });
    setEditingMovie(null);
  };

  if (!mounted) return <div className="min-h-screen" style={{ background: '#0A0A0F' }} />;
  if (!user?.isAdmin) return null;

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0F', fontFamily: 'Inter, sans-serif' }}>
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 35% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 65%)',
        }}
      />

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-50 px-5 py-3"
        style={{
          background: 'rgba(10,10,15,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <span className="text-xl font-black tracking-[-0.04em]" style={{ color: '#E50914' }}>
                NET<span style={{ color: '#fff' }}>FLIX</span>
              </span>
            </Link>
            <span
              className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-lg"
              style={{
                background: 'rgba(99,102,241,0.15)',
                color: '#818cf8',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              Admin
            </span>
          </div>
          <Link
            href="/"
            className="text-sm font-medium transition-colors duration-150 hover:text-white"
            style={{ color: 'rgba(200,200,212,0.5)' }}
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-5 py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p
              className="text-[11px] tracking-[0.25em] uppercase font-semibold mb-1"
              style={{ color: '#818cf8' }}
            >
              Management
            </p>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: '#fff', letterSpacing: '-0.02em' }}
            >
              Movie Library
            </h1>
          </div>

          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:brightness-110 active:scale-95"
            style={
              showForm
                ? { background: 'rgba(255,255,255,0.07)', color: 'rgba(200,200,212,0.7)', border: '1px solid rgba(255,255,255,0.08)' }
                : { background: '#6366f1', color: '#fff' }
            }
          >
            {showForm ? '✕ Cancel' : '+ Add Movie'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div
            className="rounded-2xl p-7 mb-8"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <h2 className="text-lg font-bold text-white mb-6">
              {editingMovie ? 'Edit Movie' : 'New Movie'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold tracking-wide uppercase" style={{ color: 'rgba(200,200,212,0.5)' }}>
                  Title
                </label>
                <input
                  type="text" name="title" value={formData.title}
                  onChange={handleInputChange} required
                  className={inputClass} style={inputStyle}
                  onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold tracking-wide uppercase" style={{ color: 'rgba(200,200,212,0.5)' }}>
                  Description
                </label>
                <textarea
                  name="description" value={formData.description}
                  onChange={handleInputChange} required rows={3}
                  className={inputClass + ' resize-none'} style={inputStyle}
                  onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                />
              </div>

              {/* Genre */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold tracking-wide uppercase" style={{ color: 'rgba(200,200,212,0.5)' }}>
                  Genre <span style={{ color: 'rgba(200,200,212,0.3)' }}>(comma separated)</span>
                </label>
                <input
                  type="text" name="genre" value={formData.genre}
                  onChange={handleInputChange} placeholder="Action, Sci-Fi, Drama"
                  className={inputClass} style={inputStyle}
                  onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                />
              </div>

              {/* Row: Year + Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold tracking-wide uppercase" style={{ color: 'rgba(200,200,212,0.5)' }}>
                    Release Year
                  </label>
                  <input
                    type="number" name="releaseYear" value={formData.releaseYear}
                    onChange={handleInputChange}
                    className={inputClass} style={inputStyle}
                    onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                    onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold tracking-wide uppercase" style={{ color: 'rgba(200,200,212,0.5)' }}>
                    Duration
                  </label>
                  <input
                    type="text" name="duration" value={formData.duration}
                    onChange={handleInputChange} placeholder="2h 30m"
                    className={inputClass} style={inputStyle}
                    onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                    onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                  />
                </div>
              </div>

              {/* Row: Rating + Plan */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold tracking-wide uppercase" style={{ color: 'rgba(200,200,212,0.5)' }}>
                    Rating <span style={{ color: 'rgba(200,200,212,0.3)' }}>(0–10)</span>
                  </label>
                  <input
                    type="number" name="rating" value={formData.rating}
                    onChange={handleInputChange} min="0" max="10" step="0.1"
                    className={inputClass} style={inputStyle}
                    onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                    onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold tracking-wide uppercase" style={{ color: 'rgba(200,200,212,0.5)' }}>
                    Required Plan
                  </label>
                  <select
                    name="requiredPlan" value={formData.requiredPlan}
                    onChange={handleInputChange}
                    className={inputClass} style={inputStyle}
                    onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                    onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                  >
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>

              {/* Poster URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold tracking-wide uppercase" style={{ color: 'rgba(200,200,212,0.5)' }}>
                  Poster URL
                </label>
                <input
                  type="url" name="posterUrl" value={formData.posterUrl}
                  onChange={handleInputChange}
                  className={inputClass} style={inputStyle}
                  onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                />
              </div>

              {/* Backdrop URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold tracking-wide uppercase" style={{ color: 'rgba(200,200,212,0.5)' }}>
                  Backdrop URL
                </label>
                <input
                  type="url" name="backdropUrl" value={formData.backdropUrl}
                  onChange={handleInputChange}
                  className={inputClass} style={inputStyle}
                  onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] mt-2"
                style={{ background: '#6366f1' }}
              >
                {editingMovie ? 'Save Changes' : 'Create Movie'}
              </button>
            </form>
          </div>
        )}

        {/* Movies table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          {/* Table header */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h2 className="text-sm font-semibold" style={{ color: 'rgba(200,200,212,0.7)' }}>
              All Movies
            </h2>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(200,200,212,0.5)' }}
            >
              {movies.length} titles
            </span>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-sm" style={{ color: 'rgba(200,200,212,0.3)' }}>
              Loading…
            </div>
          ) : movies.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-3xl mb-3">🎬</p>
              <p className="text-sm" style={{ color: 'rgba(200,200,212,0.3)' }}>No movies yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Title', 'Year', 'Rating', 'Plan', 'Actions'].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[11px] font-semibold tracking-widest uppercase"
                        style={{ color: 'rgba(200,200,212,0.35)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {movies.map((movie) => (
                    <tr
                      key={movie._id}
                      className="transition-colors duration-150"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td className="px-5 py-4 text-sm font-medium" style={{ color: '#fff' }}>
                        {movie.title}
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: 'rgba(200,200,212,0.5)' }}>
                        {movie.releaseYear}
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: '#fbbf24' }}>
                        ★ {movie.rating}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-md"
                          style={{
                            background: `${planAccent[movie.requiredPlan] ?? '#fff'}18`,
                            color: planAccent[movie.requiredPlan] ?? '#fff',
                          }}
                        >
                          {movie.requiredPlan}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(movie)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:brightness-110"
                            style={{
                              background: 'rgba(99,102,241,0.15)',
                              color: '#818cf8',
                              border: '1px solid rgba(99,102,241,0.2)',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(movie._id)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:brightness-110"
                            style={{
                              background: 'rgba(229,9,20,0.12)',
                              color: '#f87171',
                              border: '1px solid rgba(229,9,20,0.2)',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}