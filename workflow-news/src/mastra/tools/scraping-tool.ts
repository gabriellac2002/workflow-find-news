import { createTool } from "@mastra/core";
import { inputWorkflowSchema } from "../../schemas/worflowSchema";
import { searchStepOutputSchema } from "../../schemas/searchResultSchema";
import { search } from "../../services/serperWebSearchService";
import { SerperSearchParams } from "../../types/serper";

export const getScrapingTool = createTool({
  id: "get-data-from-web",
  description: "Fetches and scrapes data from the web.",
  inputSchema: inputWorkflowSchema,
  outputSchema: searchStepOutputSchema,
  execute: async ({ context }) => {
    const searchParams: SerperSearchParams = {
      query: `${context.theme} ${context.focusArea}`,
      type: "news" as const,
      interval: "lastWeek",
      gl: "us",
      hl: "en",
      location: "-",
    };

    const result = await search(searchParams);

    if (!result.success) {
      return {
        results: [],
        totalResults: 0,
      };
    }

    return {
      results: result.results,
      totalResults: result.results.length,
    };
  },
});
