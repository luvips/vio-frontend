import { getHomeGridData, PAGE_SIZE } from "@/services/home";
import MovieCard from "./MovieCard";
import SkeletonCard from "./SkeletonCard";

export default async function FilmsGrid() {
  const { movies } = await getHomeGridData();

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

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {movies.length === 0 && (
        <div className="py-14 text-center">
          <p className="text-sm font-bold" style={{ color: "#888" }}>
            No se pudieron cargar peliculas desde el backend.
          </p>
        </div>
      )}
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
