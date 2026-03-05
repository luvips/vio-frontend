import { z } from "zod";

export const MovieDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string(),
  vote_average: z.number(),
  vote_count: z.number(),
  runtime: z.number().nullable(),
  tagline: z.string().optional().nullable(),
  genres: z.array(z.object({ id: z.number(), name: z.string() })),
  status: z.string().optional(),
});

export type MovieDetail = z.infer<typeof MovieDetailSchema>;
