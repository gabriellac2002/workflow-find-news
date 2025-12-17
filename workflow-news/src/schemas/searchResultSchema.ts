import z from "zod";

export const searchResultItemSchema = z.object({
  title: z.string(),
  link: z.string().url(),
  snippet: z.string(),
  position: z.number(),
});

export const categoryEnum = z.enum([
  "breaking-changes",
  "new-features",
  "best-practices",
  "tools",
  "other",
]);

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
  theme: z.string(),
  focusArea: z.string(),
  filteredResults: z.array(filteredResultItemSchema),
  removedCount: z.number(),
  keptCount: z.number(),
});

export const categorizedResultItemSchema = z.object({
  title: z.string(),
  link: z.string().url(),
  snippet: z.string(),
  relevanceScore: z.number().min(0).max(10),
  relevanceReason: z.string(),
  category: categoryEnum,
  categoryReason: z.string(),
});

export const categorizeStepOutputSchema = z.object({
  theme: z.string(),
  focusArea: z.string(),
  categorizedResults: z.array(categorizedResultItemSchema),
});

export const selectedResultItemSchema = z.object({
  title: z.string(),
  link: z.string().url(),
  snippet: z.string(),
  relevanceScore: z.number().min(0).max(10),
  relevanceReason: z.string(),
  category: categoryEnum,
  categoryReason: z.string(),
  selectionReason: z.string(),
  priority: z.number().min(1).max(10),
});

export const selectStepOutputSchema = z.object({
  theme: z.string(),
  focusArea: z.string(),
  selectedResults: z.array(selectedResultItemSchema),
  totalSelected: z.number(),
});

export type SearchResultItem = z.infer<typeof searchResultItemSchema>;
export type SearchStepOutput = z.infer<typeof searchStepOutputSchema>;
export type FilteredResultItem = z.infer<typeof filteredResultItemSchema>;
export type FilterStepOutput = z.infer<typeof filterStepOutputSchema>;
export type CategorizedResultItem = z.infer<typeof categorizedResultItemSchema>;
export type CategorizeStepOutput = z.infer<typeof categorizeStepOutputSchema>;
export type SelectedResultItem = z.infer<typeof selectedResultItemSchema>;
export type SelectStepOutput = z.infer<typeof selectStepOutputSchema>;
export type Category = z.infer<typeof categoryEnum>;
