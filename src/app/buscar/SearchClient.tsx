"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MoviesGrid } from "@/app/components/ui/MoviesGrid";
import { MovieSchema, type Movie } from "@/schemas/movie";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = useMemo(() => (searchParams.get("q") ?? "").trim(), [searchParams]);
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!query) {
      setResults([]);
      setIsLoading(false);
      setHasError(false);
      return () => {
        isMounted = false;
      };
    }

    async function loadSearch() {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await fetch(`/api/backend/movies/search?query=${encodeURIComponent(query)}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }

        const data = (await response.json()) as { results?: unknown };
        const parsed = (Array.isArray(data.results) ? data.results : [])
          .map((item) => MovieSchema.safeParse(item))
          .filter((result) => result.success)
          .map((result) => result.data);

        if (isMounted) {
          setResults(parsed);
        }
      } catch {
        if (isMounted) {
          setHasError(true);
          setResults([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSearch();

    return () => {
      isMounted = false;
    };
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6 border-b-2 pb-4" style={{ borderColor: "#000" }}>
        <div>
          <p className="text-xs font-black tracking-widest uppercase mb-1" style={{ color: "#999" }}>
            Resultados de búsqueda
          </p>
          <h1 className="text-xl font-black uppercase tracking-wide text-black">
            {query || "Buscar películas"}
          </h1>
        </div>
      </div>

      {!query ? (
        <p className="text-sm font-semibold" style={{ color: "#777" }}>
          Escribe algo en el buscador de arriba y presiona Enter.
        </p>
      ) : isLoading ? (
        <p className="text-sm font-bold text-center py-20" style={{ color: "#aaa" }}>
          Buscando películas...
        </p>
      ) : hasError ? (
        <p className="text-sm font-bold text-center py-20" style={{ color: "#e53935" }}>
          No se pudo completar la búsqueda. Intenta de nuevo.
        </p>
      ) : results.length > 0 ? (
        <MoviesGrid movies={results} />
      ) : (
        <p className="text-sm font-bold text-center py-20" style={{ color: "#aaa" }}>
          No se encontraron películas para “{query}”.
        </p>
      )}
    </div>
  );
}
