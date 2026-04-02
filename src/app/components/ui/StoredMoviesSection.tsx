"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMovieDetails } from "@/lib/api/movies";
import { getPosterUrl, type MovieDetail } from "@/lib/movies";
import {
  getStoredMovieIds,
  removeStoredMovieId,
  type StoredListKind,
} from "@/lib/movies/lists";

type Props = {
  kind: StoredListKind;
  title: string;
  subtitle: string;
  emptyText: string;
};

export default function StoredMoviesSection({ kind, title, subtitle, emptyText }: Props) {
  const [movies, setMovies] = useState<MovieDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMovies = useCallback(async () => {
    setIsLoading(true);
    const ids = getStoredMovieIds(kind);

    if (ids.length === 0) {
      setMovies([]);
      setIsLoading(false);
      return;
    }

    const details = await Promise.all(ids.map((id) => getMovieDetails(id)));
    setMovies(details);
    setIsLoading(false);
  }, [kind]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadMovies();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadMovies]);

  const sortedMovies = useMemo(
    () => [...movies].sort((a, b) => (b.release_date || "").localeCompare(a.release_date || "")),
    [movies],
  );

  return (
    <main style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8 border-b-2 pb-4" style={{ borderColor: "#000" }}>
          <div>
            <p className="text-xs font-black tracking-widest uppercase mb-1" style={{ color: "#999" }}>
              Tu coleccion
            </p>
            <h1 className="text-2xl font-black uppercase tracking-wide text-black">{title}</h1>
            <p className="text-sm font-semibold mt-1" style={{ color: "#777" }}>{subtitle}</p>
          </div>
          <span className="text-xs font-semibold" style={{ color: "#aaa" }}>
            {sortedMovies.length} guardadas
          </span>
        </div>

        {isLoading ? (
          <p className="text-sm font-bold text-center py-20" style={{ color: "#aaa" }}>
            Cargando peliculas...
          </p>
        ) : sortedMovies.length === 0 ? (
          <p className="text-sm font-bold text-center py-20" style={{ color: "#aaa" }}>
            {emptyText}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {sortedMovies.map((movie) => {
              const poster = getPosterUrl(movie.poster_path, "medium");

              return (
                <div key={movie.id}>
                  <Link href={`/movie/${movie.id}`} className="group block">
                    <div className="relative overflow-hidden" style={{ aspectRatio: "2/3" }}>
                      {poster ? (
                        <Image
                          src={poster}
                          alt={movie.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                        />
                      ) : (
                        <div
                          className="flex h-full items-center justify-center text-xs font-bold"
                          style={{ background: "#f0f0f0", color: "#999" }}
                        >
                          SIN IMAGEN
                        </div>
                      )}
                    </div>
                    <div className="pt-2 pb-1">
                      <p className="text-sm font-bold text-black line-clamp-2 leading-tight group-hover:underline">
                        {movie.title}
                      </p>
                      <p className="text-xs font-medium mt-1" style={{ color: "#888" }}>
                        {movie.release_date?.substring(0, 4) || "Sin fecha"}
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      removeStoredMovieId(kind, movie.id);
                      setMovies((prev) => prev.filter((item) => item.id !== movie.id));
                    }}
                    className="w-full px-2 py-2 text-[10px] font-black tracking-widest uppercase border-2"
                    style={{ borderColor: "#ddd", color: "#777" }}
                  >
                    Quitar
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
