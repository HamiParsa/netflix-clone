'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await register(name, email, password);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';

      if (errorMessage.includes('already exists')) {
        setError('This email is already registered. Please log in instead.');
      } else if (errorMessage.includes('Registration failed')) {
        setError('Registration failed. Please try again.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = '1px solid rgba(229,9,20,0.5)';
    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
  };

  const passwordStrength = (p: string) => {
    if (p.length === 0) return null;
    if (p.length < 6) return { label: 'Too short', color: '#ef4444', width: '25%' };
    if (p.length < 8) return { label: 'Weak', color: '#f97316', width: '50%' };
    if (p.match(/[A-Z]/) && p.match(/[0-9]/)) return { label: 'Strong', color: '#22c55e', width: '100%' };
    return { label: 'Good', color: '#eab308', width: '75%' };
  };

  const strength = passwordStrength(password);

  return (
    <div
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
      style={{ background: '#0A0A0F', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(229,9,20,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-sm mx-4 rounded-2xl px-8 py-10"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <span
            className="text-2xl font-black tracking-[-0.04em]"
            style={{ color: '#E50914' }}
          >
            NET<span style={{ color: '#fff' }}>FLIX</span>
          </span>
          <p className="text-sm mt-2" style={{ color: 'rgba(200,200,212,0.5)' }}>
            Create your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-3 rounded-xl px-4 py-3 mb-5 text-sm"
            style={{
              background: 'rgba(229,9,20,0.12)',
              border: '1px solid rgba(229,9,20,0.25)',
              color: '#fca5a5',
            }}
          >
            <span className="mt-0.5 shrink-0">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            className="flex items-start gap-3 rounded-xl px-4 py-3 mb-5 text-sm"
            style={{
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.2)',
              color: '#86efac',
            }}
          >
            <span className="mt-0.5 shrink-0">✓</span>
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block text-xs font-semibold tracking-wide uppercase"
              style={{ color: 'rgba(200,200,212,0.5)' }}
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="name"
              placeholder="Your Name"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 disabled:opacity-40"
              style={inputBase}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-semibold tracking-wide uppercase"
              style={{ color: 'rgba(200,200,212,0.5)' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
              placeholder="your@email.com"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 disabled:opacity-40"
              style={inputBase}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold tracking-wide uppercase"
              style={{ color: 'rgba(200,200,212,0.5)' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all duration-200 disabled:opacity-40"
                style={inputBase}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lg leading-none transition-opacity hover:opacity-100"
                style={{ color: 'rgba(200,200,212,0.35)' }}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>

            {/* Password strength bar */}
            {strength && (
              <div className="space-y-1 pt-1">
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: strength.width, background: strength.color }}
                  />
                </div>
                <p className="text-[11px]" style={{ color: strength.color }}>
                  {strength.label}
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl text-sm font-bold tracking-wide text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            style={{ background: isLoading ? 'rgba(229,9,20,0.6)' : '#E50914' }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Creating account…
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          <span className="text-xs" style={{ color: 'rgba(200,200,212,0.3)' }}>or</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
        </div>

        {/* Login link */}
        <p className="text-center text-sm" style={{ color: 'rgba(200,200,212,0.45)' }}>
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold transition-colors duration-150 hover:underline"
            style={{ color: '#E50914' }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}