import { MovieListSchema, type MovieList } from "@/schemas/movie";
import { MovieDetailSchema, type MovieDetail } from "@/schemas/movie-detail";
import { MovieCreditsSchema, type MovieCredits } from "@/schemas/credits";
import { fetchTMDB } from "./fetcher";

export async function getPopularMovies(page = 1): Promise<MovieList> {
  const data = await fetchTMDB("/movie/popular", { page: String(page), language: "es-MX" });
  return MovieListSchema.parse(data);
}

export async function getTopRatedMovies(page = 1): Promise<MovieList> {
  const data = await fetchTMDB("/movie/top_rated", { page: String(page), language: "es-MX" });
  return MovieListSchema.parse(data);
}

export async function getUpcomingMovies(page = 1): Promise<MovieList> {
  const data = await fetchTMDB("/movie/upcoming", { page: String(page), language: "es-MX", region: "MX" });
  return MovieListSchema.parse(data);
}

export async function searchMovies(query: string, page = 1): Promise<MovieList> {
  const data = await fetchTMDB("/search/movie", { query, page: String(page), language: "es-MX" });
  return MovieListSchema.parse(data);
}

export async function getMovieDetails(id: number): Promise<MovieDetail> {
  const data = await fetchTMDB(`/movie/${id}`, { language: "es-MX" });
  return MovieDetailSchema.parse(data);
}

export async function getMovieCredits(id: number): Promise<MovieCredits> {
  const data = await fetchTMDB(`/movie/${id}/credits`, { language: "es-MX" });
  return MovieCreditsSchema.parse(data);
}

export async function getSimilarMovies(id: number, page = 1): Promise<MovieList> {
  const data = await fetchTMDB(`/movie/${id}/similar`, { language: "es-MX", page: String(page) });
  return MovieListSchema.parse(data);
}

export async function discoverMovies(opts: {
  genre?: number;
  type?: "popular" | "top_rated";
  page?: number;
}): Promise<MovieList> {
  const { genre, type = "popular", page = 1 } = opts;
  const sort_by = type === "top_rated" ? "vote_average.desc" : "popularity.desc";
  const params: Record<string, string> = {
    language: "es-MX",
    sort_by,
    "vote_count.gte": "100",
    page: String(page),
  };
  if (genre) params["with_genres"] = String(genre);
  const data = await fetchTMDB("/discover/movie", params);
  return MovieListSchema.parse(data);
}
