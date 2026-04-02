"use client";

import { useEffect, useMemo, useState } from "react";
import { MovieSchema } from "@/schemas/movie";
import { PAGE_SIZE } from "@/services/home";
import MovieCard from "./MovieCard";
import SkeletonCard from "./SkeletonCard";
import { type Movie } from "@/lib/movies";

const POPULAR_SEED_QUERIES = ["the", "film", "movie", "love", "war", "world"];

export default function FilmsGrid() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadMovies() {
      setIsLoading(true);
      setHasError(false);

      try {
        const responses = await Promise.all(
          POPULAR_SEED_QUERIES.map((query) =>
            fetch(`/api/backend/movies/search?query=${encodeURIComponent(query)}`, {
              method: "GET",
              credentials: "include",
              cache: "no-store",
            })
          )
        );

        const payloads = await Promise.all(
          responses.map(async (response) => {
            if (!response.ok) {
              throw new Error(`Failed with status ${response.status}`);
            }
            return (await response.json()) as { results?: unknown };
          })
        );

        const merged = payloads.flatMap((payload) => (Array.isArray(payload.results) ? payload.results : []));
        const byId = new Map<number, { movie: Movie; popularity: number }>();

        merged.forEach((item) => {
          const parsedMovie = MovieSchema.safeParse(item);
          if (!parsedMovie.success) return;

          const movie = parsedMovie.data;
          const popularity =
            typeof (item as { popularity?: unknown }).popularity === "number"
              ? (item as { popularity: number }).popularity
              : movie.vote_average;

          const existing = byId.get(movie.id);
          if (!existing || popularity > existing.popularity) {
            byId.set(movie.id, {
              movie,
              popularity,
            });
          }
        });

        const parsed = [...byId.values()]
          .sort((a, b) => {
            return b.popularity - a.popularity;
          })
          .map((entry) => entry.movie)
          .slice(0, PAGE_SIZE);

        if (isMounted) {
          setMovies(parsed);
        }
      } catch {
        if (isMounted) {
          setHasError(true);
          setMovies([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    if (movies.length > 0) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      );
    }

    return (
      <div className="py-14 text-center">
        <p className="text-sm font-bold" style={{ color: "#888" }}>
          {hasError
            ? "No se pudieron cargar peliculas desde el backend."
            : "No hay peliculas para mostrar en este momento."}
        </p>
      </div>
    );
  }, [hasError, isLoading, movies]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">

      <div className="flex items-center justify-between mb-8 border-b-2 pb-4" style={{ borderColor: "#000" }}>
        <div>
          <p className="text-xs font-black tracking-widest uppercase mb-1" style={{ color: "#999" }}>
            Recomendado
          </p>
          <h2 className="text-xl font-black uppercase tracking-wide text-black">
            Mas populares
          </h2>
        </div>
        <span className="text-xs font-semibold" style={{ color: "#aaa" }}>
          Usa el buscador para resultados mas precisos
        </span>
      </div>

      {content}
    </section>
  );
}

export function FilmsGridSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="h-10 w-64 mb-8" style={{ background: "#e0e0e0" }} />
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}
