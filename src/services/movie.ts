import {
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
  getPosterUrl,
  getBackdropUrl,
  getProfileUrl,
} from "@/lib/tmdb";

const PAGE_SIZE = 14;

export async function getMovieDetailData(movieId: number) {
  const [movie, credits, similar] = await Promise.all([
    getMovieDetails(movieId),
    getMovieCredits(movieId),
    getSimilarMovies(movieId),
  ]);

  return {
    movie,
    director: credits.crew.find((c) => c.job === "Director") ?? null,
    topCast: credits.cast.slice(0, 8).map((actor) => ({
      ...actor,
      profileUrl: getProfileUrl(actor.profile_path, "small"),
    })),
    similarMovies: similar.results.slice(0, 7),
    backdropUrl: getBackdropUrl(movie.backdrop_path, "large"),
    posterUrl: getPosterUrl(movie.poster_path, "large"),
    year: movie.release_date?.substring(0, 4) ?? null,
    runtime: movie.runtime
      ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
      : null,
  };
}

export async function getSimilarMoviesPageData(movieId: number, page: number) {
  const [movie, similar] = await Promise.all([
    getMovieDetails(movieId),
    getSimilarMovies(movieId, page),
  ]);

  return {
    movie,
    movies: similar.results.slice(0, PAGE_SIZE),
    totalPages: Math.min(500, similar.total_pages),
  };
}
