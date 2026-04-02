const DEFAULT_MOVIE_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const MOVIE_IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_MOVIE_IMAGE_BASE_URL ?? DEFAULT_MOVIE_IMAGE_BASE_URL;

export const POSTER_SIZES = {
  small: "w185",
  medium: "w342",
  large: "w500",
  original: "original",
} as const;

export const BACKDROP_SIZES = {
  small: "w300",
  medium: "w780",
  large: "w1280",
  original: "original",
} as const;

export const PROFILE_SIZES = {
  small: "w45",
  medium: "w185",
  large: "h632",
} as const;
