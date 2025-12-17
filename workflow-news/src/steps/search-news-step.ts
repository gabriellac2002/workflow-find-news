import { createStep } from "@mastra/core";
import { getScrapingTool } from "../mastra/tools/scraping-tool";
import { inputWorkflowSchema } from "../schemas/worflowSchema";
import { searchStepOutputSchema } from "../schemas/searchResultSchema";
import { z } from "zod";

const searchOutputSchema = z.intersection(
  inputWorkflowSchema,
  searchStepOutputSchema
);

export const searchNewsStep = createStep({
  id: "search-news",
  description: "Search for news articles based on theme and focus area",
  inputSchema: inputWorkflowSchema,
  outputSchema: searchOutputSchema,
  execute: async ({ inputData, ...rest }) => {
    const result = await getScrapingTool.execute?.({
      context: inputData,
      ...rest,
    });

    return {
      ...inputData,
      ...result,
    };
  },
});
