import { createStep } from "@mastra/core";
import { z } from "zod";
import { filterStepOutputSchema } from "../schemas/searchResultSchema";
import { outputSchema } from "../schemas/worflowSchema";

export const formatOutputStep = createStep({
  id: "format-output",
  description: "Formats filtered results into final output structure",
  inputSchema: filterStepOutputSchema,
  outputSchema: outputSchema,
  execute: async ({ inputData }) => {
    const { filteredResults, keptCount, removedCount } = inputData;

    const links = filteredResults.map((r) => r.link);

    const summary = `Found ${keptCount} relevant articles (removed ${removedCount} low-quality results):\n\n${filteredResults
      .map(
        (r, i) =>
          `${i + 1}. [Score: ${r.relevanceScore}/10] ${r.title}\n   ${r.snippet}\n   Relevance: ${r.relevanceReason}`
      )
      .join("\n\n")}`;

    return {
      links,
      summary,
    };
  },
});
