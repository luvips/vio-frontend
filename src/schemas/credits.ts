import { z } from "zod";

export const CastMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
  order: z.number(),
});

export const CrewMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string(),
  department: z.string(),
  profile_path: z.string().nullable(),
});

export const MovieCreditsSchema = z.object({
  cast: z.array(CastMemberSchema),
  crew: z.array(CrewMemberSchema),
});

export type CastMember = z.infer<typeof CastMemberSchema>;
export type MovieCredits = z.infer<typeof MovieCreditsSchema>;
