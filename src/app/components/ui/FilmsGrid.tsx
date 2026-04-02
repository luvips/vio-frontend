"use client";

import { useEffect, useMemo, useState } from "react";
import { MovieSchema } from "@/schemas/movie";
import { PAGE_SIZE } from "@/services/home";
import MovieCard from "./MovieCard";
import SkeletonCard from "./SkeletonCard";
import { type Movie } from "@/lib/movies";

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
        const response = await fetch("/api/backend/movies/search?query=popular", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed with status ${response.status}`);
        }

        const data = (await response.json()) as { results?: unknown };
        const rawResults = Array.isArray(data.results) ? data.results : [];
        const parsed = rawResults
          .map((item) => MovieSchema.safeParse(item))
          .filter((result) => result.success)
          .map((result) => result.data)
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
            Peliculas sugeridas
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
