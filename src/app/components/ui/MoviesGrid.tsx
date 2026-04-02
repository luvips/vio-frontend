import MovieCard from "./MovieCard";
import SkeletonCard from "./SkeletonCard";
import { type Movie } from "@/lib/movies";

const GRID_CLASS = "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3";

export function MoviesGrid({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-bold" style={{ color: "#888" }}>
          No hay peliculas para mostrar en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className={GRID_CLASS}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

export function MoviesGridSkeleton() {
  return (
    <div className={GRID_CLASS}>
      {Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
