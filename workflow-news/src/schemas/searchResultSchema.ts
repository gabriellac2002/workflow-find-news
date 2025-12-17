import z from "zod";

export const searchResultItemSchema = z.object({
  title: z.string(),
  link: z.string().url(),
  snippet: z.string(),
  position: z.number(),
});

export const searchStepOutputSchema = z.object({
  results: z.array(searchResultItemSchema),
  totalResults: z.number(),
});

export const filteredResultItemSchema = z.object({
  title: z.string(),
  link: z.string().url(),
  snippet: z.string(),
  relevanceScore: z.number().min(0).max(10),
  relevanceReason: z.string(),
  isRelevant: z.boolean(),
});

export const filterStepOutputSchema = z.object({
  filteredResults: z.array(filteredResultItemSchema),
  removedCount: z.number(),
  keptCount: z.number(),
});

export type SearchResultItem = z.infer<typeof searchResultItemSchema>;
export type SearchStepOutput = z.infer<typeof searchStepOutputSchema>;
export type FilteredResultItem = z.infer<typeof filteredResultItemSchema>;
export type FilterStepOutput = z.infer<typeof filterStepOutputSchema>;
