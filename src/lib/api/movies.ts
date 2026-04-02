import { MovieListSchema, MovieSchema, type MovieList } from "@/schemas/movie";
import { MovieDetailSchema, type MovieDetail } from "@/schemas/movie-detail";
import { MovieCreditsSchema, type MovieCredits } from "@/schemas/credits";
import { GENRE_NAMES } from "@/lib/movies";
import { fetchBackend } from "./fetcher";

type ActionResult = {
	success: boolean;
	message?: string;
};

function emptyMovieList(): MovieList {
	return {
		page: 1,
		results: [],
		total_pages: 1,
		total_results: 0,
	};
}

function emptyMovieDetail(id: number): MovieDetail {
	return {
		id,
		title: "Pelicula no disponible",
		overview: "No se pudo cargar la informacion de esta pelicula.",
		poster_path: null,
		backdrop_path: null,
		release_date: "",
		vote_average: 0,
		vote_count: 0,
		runtime: null,
		tagline: null,
		genres: [],
		status: "Unavailable",
	};
}

function toMovieList(data: unknown): MovieList {
	if (Array.isArray(data)) {
		const normalized = data
			.map((item) => MovieSchema.safeParse(item))
			.filter((result) => result.success)
			.map((result) => result.data);

		return MovieListSchema.parse({
			page: 1,
			results: normalized,
			total_pages: 1,
			total_results: normalized.length,
		});
	}

	const obj = (data ?? {}) as {
		page?: unknown;
		results?: unknown;
		total_pages?: unknown;
		total_results?: unknown;
	};

	const rawResults = Array.isArray(obj.results) ? obj.results : [];
	const normalizedResults = rawResults
		.map((item) => MovieSchema.safeParse(item))
		.filter((result) => result.success)
		.map((result) => result.data);

	const parsed = MovieListSchema.parse({
		page: typeof obj.page === "number" ? obj.page : 1,
		results: normalizedResults,
		total_pages: typeof obj.total_pages === "number" ? obj.total_pages : 1,
		total_results:
			typeof obj.total_results === "number" ? obj.total_results : normalizedResults.length,
	});

	return {
		...parsed,
		total_pages: Math.max(1, parsed.total_pages || 1),
		total_results: Math.max(parsed.total_results, parsed.results.length),
	};
}

function keywordForType(type: "popular" | "top_rated" | "upcoming"): string {
	if (type === "top_rated") return "top rated";
	if (type === "upcoming") return "upcoming";
	return "popular";
}

async function searchList(query: string): Promise<MovieList> {
	try {
		const params = new URLSearchParams({ query });
		const data = await fetchBackend<unknown>(`/movies/search?${params.toString()}`);
		return toMovieList(data);
	} catch {
		return emptyMovieList();
	}
}

export async function getPopularMovies(page = 1): Promise<MovieList> {
	void page;
	return searchList(keywordForType("popular"));
}

export async function getTopRatedMovies(page = 1): Promise<MovieList> {
	void page;
	return searchList(keywordForType("top_rated"));
}

export async function getUpcomingMovies(page = 1): Promise<MovieList> {
	void page;
	return searchList(keywordForType("upcoming"));
}

export async function searchMovies(query: string, page = 1): Promise<MovieList> {
	void page;
	return searchList(query);
}

export async function discoverMovies(opts: {
	genre?: number;
	type?: "popular" | "top_rated";
	page?: number;
}): Promise<MovieList> {
	void opts.page;
	const typeKeyword = keywordForType(opts.type ?? "popular");
	const genreLabel = opts.genre ? GENRE_NAMES[opts.genre] : "";
	const query = [typeKeyword, genreLabel].filter(Boolean).join(" ").trim();
	return searchList(query || typeKeyword);
}

export async function getMovieDetails(id: number): Promise<MovieDetail> {
	try {
		const data = await fetchBackend<unknown>(`/movies/${id}`);
		return MovieDetailSchema.parse(data);
	} catch {
		return emptyMovieDetail(id);
	}
}

export async function getMovieCredits(id: number): Promise<MovieCredits> {
	void id;
	return MovieCreditsSchema.parse({ cast: [], crew: [] });
}

export async function getSimilarMovies(id: number, page = 1): Promise<MovieList> {
	void page;
	const detail = await getMovieDetails(id);
	const genreText = detail.genres[0]?.name ?? "";
	const titleHint = detail.title.split(" ").slice(0, 2).join(" ");
	const query = [genreText, titleHint].filter(Boolean).join(" ").trim() || "movie";
	const list = await searchList(query);
	return {
		...list,
		results: list.results.filter((movie) => movie.id !== id),
		total_results: Math.max(0, list.total_results - 1),
	};
}

export async function addToFavorites(tmdbId: number): Promise<ActionResult> {
	return fetchBackend<ActionResult>("/movies/favorites", {
		method: "POST",
		body: JSON.stringify({ tmdb_id: tmdbId }),
	});
}

export async function addToWatchLater(tmdbId: number): Promise<ActionResult> {
	return fetchBackend<ActionResult>("/movies/watch-later", {
		method: "POST",
		body: JSON.stringify({ tmdb_id: tmdbId }),
	});
}
