'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

type PlanType = 'basic' | 'standard' | 'premium';

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
  type: PlanType;
  accent: string;
  accentMuted: string;
  badge?: string;
}

const PLANS: Plan[] = [
  {
    name: 'Basic',
    price: '$9.99',
    period: '/month',
    type: 'basic',
    accent: '#38bdf8',
    accentMuted: 'rgba(56,189,248,0.12)',
    features: [
      'Watch in HD',
      'Watch on 1 device at a time',
      'Ad-supported viewing',
    ],
  },
  {
    name: 'Standard',
    price: '$15.99',
    period: '/month',
    type: 'standard',
    accent: '#a78bfa',
    accentMuted: 'rgba(167,139,250,0.12)',
    badge: 'Most Popular',
    features: [
      'Watch in Full HD',
      'Watch on 2 devices at a time',
      'Ad-free viewing',
    ],
  },
  {
    name: 'Premium',
    price: '$19.99',
    period: '/month',
    type: 'premium',
    accent: '#fbbf24',
    accentMuted: 'rgba(251,191,36,0.12)',
    features: [
      'Watch in 4K Ultra HD',
      'Watch on 4 devices at a time',
      'Ad-free viewing',
      'Download to watch offline',
    ],
  },
];

export default function SubscriptionPage() {
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, token } = useAuth();
  

  if (!user) {
    return (
      <div
        className="relative flex items-center justify-center min-h-screen overflow-hidden"
        style={{ background: '#0A0A0F', fontFamily: 'Inter, sans-serif' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(229,9,20,0.15) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 text-center px-6">
          <span className="text-2xl font-black tracking-[-0.04em]" style={{ color: '#E50914' }}>
            NET<span style={{ color: '#fff' }}>FLIX</span>
          </span>
          <h2 className="text-2xl font-bold text-white mt-6 mb-2">Sign in to continue</h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(200,200,212,0.5)' }}>
            You need to log in to view subscription plans
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
            style={{ background: '#E50914' }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleSelectPlan = async (planType: PlanType) => {
    setError('');
    setIsLoading(true);
    setLoadingPlan(planType);

    try {
      const response = await fetch('http://localhost:5000/api/subscription/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: planType }),
      });

      if (!response.ok) throw new Error('Failed to activate subscription');
      router.push('/');
    } catch (err) {
      setError('Failed to activate subscription. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setLoadingPlan(null);
    }
  };

  const currentPlan = user.subscription.plan;
  const isSubscribed = currentPlan !== 'none';

  return (
    <div
      className="min-h-screen"
      style={{ background: '#0A0A0F', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(229,9,20,0.12) 0%, transparent 65%)',
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
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <span className="text-xl font-black tracking-[-0.04em]" style={{ color: '#E50914' }}>
              NET<span style={{ color: '#fff' }}>FLIX</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium transition-colors duration-150 hover:text-white"
            style={{ color: 'rgba(200,200,212,0.5)' }}
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-6xl mx-auto px-5 py-16">
        {/* Title */}
        <div className="text-center mb-14">
          <p
            className="text-[11px] tracking-[0.3em] uppercase font-semibold mb-3"
            style={{ color: '#E50914' }}
          >
            Subscription
          </p>
          <h1
            className="text-4xl sm:text-5xl font-black tracking-[-0.03em] text-white mb-4"
          >
            Choose Your Plan
          </h1>
          <p className="text-base" style={{ color: 'rgba(200,200,212,0.5)' }}>
            {isSubscribed
              ? `You're currently on the ${currentPlan.toUpperCase()} plan`
              : 'Select a plan to start watching'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-center gap-3 rounded-xl px-5 py-4 mb-10 max-w-lg mx-auto text-sm"
            style={{
              background: 'rgba(229,9,20,0.12)',
              border: '1px solid rgba(229,9,20,0.25)',
              color: '#fca5a5',
            }}
          >
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-5">
          {PLANS.map((plan) => {
            const isCurrentPlan = currentPlan === plan.type;
            const isPlanLoading = loadingPlan === plan.type;

            return (
              <div
                key={plan.type}
                className="relative rounded-2xl p-7 flex flex-col transition-all duration-300"
                style={{
                  background: isCurrentPlan
                    ? plan.accentMuted
                    : 'rgba(255,255,255,0.04)',
                  border: isCurrentPlan
                    ? `1px solid ${plan.accent}40`
                    : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isCurrentPlan
                    ? `0 0 40px ${plan.accent}18`
                    : '0 4px 24px rgba(0,0,0,0.3)',
                }}
              >
                {/* Most Popular badge */}
                {plan.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{
                      background: plan.accent,
                      color: '#0A0A0F',
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Current plan badge */}
                {isCurrentPlan && (
                  <div
                    className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-lg self-start mb-4"
                    style={{
                      background: `${plan.accent}25`,
                      color: plan.accent,
                      border: `1px solid ${plan.accent}40`,
                    }}
                  >
                    Current Plan
                  </div>
                )}

                {/* Plan name */}
                <h2
                  className="text-lg font-bold mb-1"
                  style={{ color: isCurrentPlan ? plan.accent : 'rgba(255,255,255,0.9)' }}
                >
                  {plan.name}
                </h2>

                {/* Price */}
                <div className="flex items-end gap-1 mb-6">
                  <span
                    className="text-4xl font-black tracking-tight"
                    style={{ color: '#fff' }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-sm mb-1.5"
                    style={{ color: 'rgba(200,200,212,0.4)' }}
                  >
                    {plan.period}
                  </span>
                </div>

                {/* Divider */}
                <div
                  className="h-px mb-6"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                />

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-sm"
                      style={{ color: 'rgba(200,200,212,0.75)' }}
                    >
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0"
                        style={{ background: `${plan.accent}25`, color: plan.accent }}
                      >
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  onClick={() => !isCurrentPlan && handleSelectPlan(plan.type)}
                  disabled={isLoading || isCurrentPlan}
                  className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed"
                  style={
                    isCurrentPlan
                      ? {
                          background: `${plan.accent}18`,
                          color: plan.accent,
                          border: `1px solid ${plan.accent}30`,
                        }
                      : {
                          background: plan.accent,
                          color: '#0A0A0F',
                          opacity: isLoading && !isPlanLoading ? 0.4 : 1,
                        }
                  }
                >
                  {isPlanLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 rounded-full border-2 border-black/20 border-t-black/70 animate-spin" />
                      Processing…
                    </span>
                  ) : isCurrentPlan ? (
                    'Active'
                  ) : (
                    `Get ${plan.name}`
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p
          className="text-center text-xs mt-10"
          style={{ color: 'rgba(200,200,212,0.3)' }}
        >
          All plans include unlimited movies and TV shows. Cancel anytime.
        </p>
      </main>
    </div>
  );
}