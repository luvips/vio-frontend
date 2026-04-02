import MovieCard from "@/app/components/ui/MovieCard";
import BackButton from "@/app/components/ui/BackButton";
import PaginationLinks from "@/app/components/movie/PaginationLinks";
import { getSimilarMoviesPageData } from "@/services/movie";

export const dynamic = "force-dynamic";

export default async function SimilarMoviesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const movieId = Number(id);
  const page = Math.min(500, Math.max(1, Number(pageParam ?? 1)));

  const { movie, movies, totalPages } = await getSimilarMoviesPageData(movieId, page);

  return (
    <main style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-6 py-10">

        <BackButton />

        <div className="flex items-center gap-3 mb-8 border-b-2 pb-4" style={{ borderColor: "#000" }}>
          <div className="w-1 h-8" style={{ background: "#8e24aa" }} />
          <div>
            <p className="text-xs font-black tracking-widest uppercase mb-0.5" style={{ color: "#aaa" }}>
              Relacionados con
            </p>
            <h1 className="text-xl font-black uppercase tracking-wide text-black">
              {movie.title}
            </h1>
          </div>
          <span className="ml-auto text-xs font-semibold" style={{ color: "#aaa" }}>
            Pág. {page} / {totalPages}
          </span>
        </div>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        ) : (
          <p className="text-sm font-bold text-center py-20" style={{ color: "#aaa" }}>
            No se encontraron películas relacionadas.
          </p>
        )}

        {totalPages > 1 && (
          <PaginationLinks movieId={movieId} page={page} totalPages={totalPages} />
        )}
      </div>
    </main>
  );
}
