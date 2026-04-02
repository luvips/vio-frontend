import Image from "next/image";
import Link from "next/link";
import BackButton from "@/app/components/ui/BackButton";
import TicketLabel from "@/app/components/movie/TicketLabel";
import TicketValue from "@/app/components/movie/TicketValue";
import ScoreBox from "@/app/components/movie/ScoreBox";
import Perforation from "@/app/components/movie/Perforation";
import MovieActions from "@/app/components/movie/MovieActions";
import MovieCard from "@/app/components/ui/MovieCard";
import { getMovieDetailData } from "@/services/movie";

const PALETTE = ["#e53935","#ff6d00","#43a047","#00acc1","#3949ab","#e91e8c","#8e24aa","#795548"];

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { movie, director, topCast, similarMovies, backdropUrl, posterUrl, year, runtime } =
    await getMovieDetailData(Number(id));

  return (
    <main style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <div className="max-w-4xl mx-auto px-4 py-10">

        <BackButton />

        <div style={{ border: "3px solid #000", background: "#fff" }}>

          <div className="relative h-48 md:h-64 overflow-hidden" style={{ borderBottom: "3px solid #000" }}>
            {backdropUrl ? (
              <>
                <Image src={backdropUrl} alt="" fill className="object-cover" style={{ opacity: 0.55 }} priority />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 100%)" }} />
              </>
            ) : (
              <div className="h-full" style={{ background: "#000" }} />
            )}

            <div className="absolute top-3 right-4 opacity-20 select-none">
              <p className="font-black text-white text-4xl tracking-widest rotate-[-15deg]">ADMIT ONE</p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5">
              {year && (
                <span
                  className="inline-block text-xs font-black tracking-widest px-2 py-0.5 mb-2"
                  style={{ background: "#ffbd3f", color: "#000" }}
                >
                  {year}
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-black text-white uppercase leading-tight">
                {movie.title}
              </h1>
            </div>
          </div>

          <div className="flex">

            <div
              className="flex-shrink-0 flex flex-col items-center gap-4 p-4"
              style={{ width: "160px", borderRight: "3px solid #000", background: "#fafafa" }}
            >
              {posterUrl && (
                <div style={{ width: "120px", border: "2px solid #000" }}>
                  <div className="relative" style={{ aspectRatio: "2/3" }}>
                    <Image src={posterUrl} alt={movie.title} fill className="object-cover" sizes="120px" />
                  </div>
                </div>
              )}

              <ScoreBox score={movie.vote_average} />

              <div>
                <TicketLabel>Rating</TicketLabel>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const filled = i + 1 <= Math.round(movie.vote_average / 2);
                    return (
                      <span key={i} className="text-base font-black" style={{ color: filled ? "#ffbd3f" : "#ddd" }}>★</span>
                    );
                  })}
                </div>
                <p className="text-xs font-semibold mt-0.5" style={{ color: "#888" }}>
                  {movie.vote_count.toLocaleString()} votos
                </p>
              </div>
            </div>

            <div className="flex-1 p-6">

              <div className="grid grid-cols-2 gap-4 mb-5">
                {director && (
                  <div>
                    <TicketLabel>Director</TicketLabel>
                    <TicketValue>{director.name}</TicketValue>
                  </div>
                )}
                {runtime && (
                  <div>
                    <TicketLabel>Duracion</TicketLabel>
                    <TicketValue>{runtime}</TicketValue>
                  </div>
                )}
                {year && (
                  <div>
                    <TicketLabel>Estreno</TicketLabel>
                    <TicketValue>{movie.release_date}</TicketValue>
                  </div>
                )}
                {movie.status && (
                  <div>
                    <TicketLabel>Estado</TicketLabel>
                    <TicketValue>{movie.status}</TicketValue>
                  </div>
                )}
              </div>

              {movie.genres.length > 0 && (
                <div className="mb-5">
                  <TicketLabel>Generos</TicketLabel>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {movie.genres.map((g, i) => (
                      <span
                        key={g.id}
                        className="text-xs font-black px-2.5 py-1 uppercase tracking-wide text-white"
                        style={{ background: PALETTE[i % PALETTE.length] }}
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {movie.tagline && (
                <p className="text-sm font-bold italic mb-4" style={{ color: "#555" }}>
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}

              {movie.overview && (
                <div>
                  <TicketLabel>Sinopsis</TicketLabel>
                  <p className="text-sm font-medium leading-relaxed mt-1" style={{ color: "#333" }}>
                    {movie.overview}
                  </p>
                </div>
              )}

              <MovieActions tmdbId={movie.id} />
            </div>
          </div>

          {topCast.length > 0 && (
            <>
              <Perforation />
              <div className="p-6" style={{ borderTop: "none" }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-0.5 w-6" style={{ background: "#00acc1" }} />
                  <p className="text-xs font-black tracking-widest uppercase">Reparto</p>
                  <div className="flex-1 h-0.5" style={{ background: "#e0e0e0" }} />
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {topCast.map((actor) => {
                    return (
                      <div key={actor.id} className="flex flex-col items-center text-center">
                        <div
                          className="w-12 h-12 overflow-hidden mb-1.5 flex-shrink-0"
                          style={{ background: "#e0e0e0", border: "2px solid #000" }}
                        >
                          {actor.profileUrl ? (
                            <Image src={actor.profileUrl} alt={actor.name} width={48} height={48} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-black" style={{ color: "#999" }}>?</div>
                          )}
                        </div>
                        <p className="text-xs font-black text-black line-clamp-2 leading-tight uppercase" style={{ fontSize: "10px" }}>
                          {actor.name}
                        </p>
                        <p className="line-clamp-1 font-medium mt-0.5" style={{ color: "#888", fontSize: "10px" }}>
                          {actor.character}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div
            className="flex items-center justify-between px-6 py-3"
            style={{ borderTop: "3px solid #000", background: "#000" }}
          >
            <span className="font-black text-xs tracking-widest" style={{ color: "#ffbd3f" }}>
              VIO — #{movie.id}
            </span>
            <span className="font-black text-xs tracking-widest text-white opacity-40">
              ★ NOT TRANSFERABLE ★
            </span>
            <span className="font-black text-xs tracking-widest" style={{ color: "#ffbd3f" }}>
              {year ?? "—"}
            </span>
          </div>
        </div>

        {similarMovies.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6" style={{ background: "#8e24aa" }} />
                <h2 className="text-base font-black uppercase tracking-widest text-black">
                  Peliculas similares
                </h2>
              </div>
              <Link
                href={`/movie/${movie.id}/similar`}
                className="text-xs font-black tracking-widest uppercase px-4 py-2 transition-opacity hover:opacity-80"
                style={{ background: "#000", color: "#ffbd3f" }}
              >
                VER MAS
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
              {similarMovies.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
