import { createTool } from "@mastra/core";
import { inputWorkflowSchema } from "../../schemas/worflowSchema";
import {
  searchStepOutputSchema,
  scrapingInputSchema,
  scrapingOutputSchema,
} from "../../schemas/searchResultSchema";
import { search } from "../../services/serperWebSearchService";
import { scrapePage } from "../../services/serperWebPage";
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

export const getScrapingWebTool = createTool({
  id: "scrape-web-page",
  description: "Scrapes content from a specific web page URL and returns the text and title.",
  inputSchema: scrapingInputSchema,
  outputSchema: scrapingOutputSchema,
  execute: async ({ context }) => {
    const result = await scrapePage({
      url: context.url,
    });

    if (!result.success) {
      throw new Error(`Failed to scrape page: ${result.error}`);
    }

    return {
      url: result.url,
      text: result.text,
      title: result.title,
    };
  },
});
