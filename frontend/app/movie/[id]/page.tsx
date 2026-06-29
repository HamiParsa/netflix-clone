"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import Image from "next/image";

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

const planAccent: Record<string, string> = {
  basic: "#38bdf8",
  standard: "#a78bfa",
  premium: "#fbbf24",
};

export default function MoviePage() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();

  const movieId = params.id as string;

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.subscription.plan === "none") {
      router.push("/subscription");
      return;
    }
    if (user.subscription.expiresAt) {
      const expiryDate = new Date(user.subscription.expiresAt);
      if (expiryDate < new Date()) {
        router.push("/subscription");
        return;
      }
    }
  }, [user, router]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/movies/${movieId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!response.ok) {
          if (response.status === 403)
            throw new Error("Subscription required to view this content");
          throw new Error("Failed to fetch movie");
        }
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load movie");
      } finally {
        setIsLoading(false);
      }
    };
    if (token && user?.subscription.plan !== "none") fetchMovie();
  }, [movieId, token, user]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0A0A0F" }}
      >
        <div className="flex flex-col items-center gap-4">
          <span className="inline-block w-8 h-8 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
          <p className="text-sm" style={{ color: "rgba(200,200,212,0.4)" }}>
            Loading…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen"
        style={{ background: "#0A0A0F", fontFamily: "Inter, sans-serif" }}
      >
        <header
          className="sticky top-0 z-50 px-5 py-3"
          style={{
            background: "rgba(10,10,15,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Link href="/">
            <span
              className="text-xl font-black tracking-[-0.04em]"
              style={{ color: "#E50914" }}
            >
              NET<span style={{ color: "#fff" }}>FLIX</span>
            </span>
          </Link>
        </header>
        <main className="flex items-center justify-center min-h-[80vh] px-5">
          <div
            className="text-center rounded-2xl px-10 py-12 max-w-sm w-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="text-4xl mb-4 block">⚠</span>
            <h1 className="text-xl font-bold text-white mb-2">
              Something went wrong
            </h1>
            <p
              className="text-sm mb-8"
              style={{ color: "rgba(200,200,212,0.5)" }}
            >
              {error}
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110"
              style={{ background: "#E50914" }}
            >
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!movie) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0A0A0F" }}
      >
        <p className="text-sm" style={{ color: "rgba(200,200,212,0.4)" }}>
          Movie not found
        </p>
      </div>
    );
  }

  const accent = planAccent[movie.requiredPlan] ?? "#fff";

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0A0A0F", fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-5 py-3"
        style={{
          background: "rgba(10,10,15,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/">
            <span
              className="text-xl font-black tracking-[-0.04em]"
              style={{ color: "#E50914" }}
            >
              NET<span style={{ color: "#fff" }}>FLIX</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-white"
            style={{ color: "rgba(200,200,212,0.5)" }}
          >
            ← Back
          </Link>
        </div>
      </header>

      {/* Backdrop */}
      <div className="relative h-[50vh] overflow-hidden">
        {movie.backdropUrl ? (
          <Image
            width={1920}
            height={1080}
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: "rgba(255,255,255,0.03)" }}
          />
        )}
        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.0) 30%, rgba(10,10,15,0.85) 80%, #0A0A0F 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,10,15,0.6) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Content */}
      <main className="relative -mt-40 z-10 max-w-5xl mx-auto px-5 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 w-40 md:w-52">
            {movie.posterUrl ? (
              <Image
                width={300}
                height={450}
                loading="eager"
                priority
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full rounded-xl object-cover"
                style={{ boxShadow: "0 24px 48px rgba(0,0,0,0.6)" }}
              />
            ) : (
              <div
                className="w-full aspect-2/3 rounded-xl flex items-center justify-center text-3xl"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                🎞
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pt-2">
            {/* Plan badge */}
            <div className="mb-3">
              <span
                className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-lg"
                style={{
                  background: `${accent}18`,
                  color: accent,
                  border: `1px solid ${accent}30`,
                }}
              >
                {movie.requiredPlan}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              {movie.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span
                className="text-sm"
                style={{ color: "rgba(200,200,212,0.5)" }}
              >
                {movie.releaseYear}
              </span>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
              <span
                className="text-sm"
                style={{ color: "rgba(200,200,212,0.5)" }}
              >
                {movie.duration}
              </span>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
              <span
                className="text-sm font-semibold"
                style={{ color: "#fbbf24" }}
              >
                ★ {movie.rating}
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-7">
              {movie.genre.map((g) => (
                <span
                  key={g}
                  className="text-xs px-3 py-1 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(200,200,212,0.6)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Play button */}
            <button
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{ background: "#E50914" }}
            >
              <span className="text-base">▶</span>
              Play Now
            </button>
          </div>
        </div>

        {/* Description */}
        <div
          className="mt-12 rounded-2xl p-7"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p
            className="text-[11px] tracking-[0.25em] uppercase font-semibold mb-3"
            style={{ color: "#E50914" }}
          >
            About
          </p>
          <p
            className="text-base leading-relaxed"
            style={{ color: "rgba(200,200,212,0.75)" }}
          >
            {movie.description}
          </p>
        </div>
      </main>
    </div>
  );
}
