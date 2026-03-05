import { Suspense } from "react";
import { getTopRatedMovies } from "@/lib/tmdb";
import { MoviesGrid, MoviesGridSkeleton } from "@/app/components/ui/MoviesGrid";

async function Content() {
  const { results: movies } = await getTopRatedMovies();
  return <MoviesGrid movies={movies} />;
}

export default function TopRatedPage() {
  return (
    <main>
      <div style={{ background: "#3949ab", borderBottom: "4px solid #000" }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-xs font-black tracking-widest mb-1 uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>
            Clasificacion
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-none">
            TOP RATED
          </h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Suspense fallback={<MoviesGridSkeleton />}>
          <Content />
        </Suspense>
      </div>
    </main>
  );
}
