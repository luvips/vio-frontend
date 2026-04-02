import {
  getPopularMovies,
} from "@/lib/api";

export const PAGE_SIZE = 14;

export async function getHomeGridData() {
	const data = await getPopularMovies(1);
  return {
		movies: data.results.slice(0, PAGE_SIZE),
		totalPages: 1,
  };
}
