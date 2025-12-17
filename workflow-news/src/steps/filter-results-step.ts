import { createStep } from "@mastra/core";
import { z } from "zod";
import {
  searchStepOutputSchema,
  filterStepOutputSchema,
} from "../schemas/searchResultSchema";
import { inputWorkflowSchema } from "../schemas/worflowSchema";

const filterInputSchema = z.intersection(
  inputWorkflowSchema,
  searchStepOutputSchema
);

export const filterResultsStep = createStep({
  id: "filter-results",
  description:
    "Filters search results to remove clickbait, basic tutorials, and duplicate content using LLM",
  inputSchema: filterInputSchema,
  outputSchema: filterStepOutputSchema,

  execute: async ({ inputData, mastra }) => {
    const { theme, focusArea, results } = inputData;

    if (results.length === 0) {
      return {
        filteredResults: [],
        removedCount: 0,
        keptCount: 0,
      };
    }

    const prompt = `You are an expert content curator.

Theme: "${theme}"
Focus area: "${focusArea}"

Filter the following articles. Remove clickbait, basic tutorials, or duplicate content.

Articles:
${results
  .map((result, index) => `${index + 1}. ${result.title} - ${result.link}`)
  .join("\n")}

Respond ONLY with a JSON array. Each item must contain:
- index (number, 1-based)
- isRelevant (boolean)
- relevanceScore (0-10)
- relevanceReason (max 50 words)
`;

    const contentAgent = mastra.getAgent("contentFilterAgent");

    const { text } = await contentAgent.generate([
      { role: "user", content: prompt },
    ]);

    let aiResults: Array<{
      index: number;
      isRelevant: boolean;
      relevanceScore: number;
      relevanceReason: string;
    }> = [];

    try {
      aiResults = JSON.parse(text);
    } catch (error) {
      console.error("Failed to parse AI response:", text);
    }

    console.log("🤖 AI response --->", aiResults);

    const filteredResults = aiResults
      .filter((item) => item.isRelevant && results[item.index - 1])
      .map((item) => {
        const original = results[item.index - 1];

        return {
          title: original.title,
          link: original.link,
          snippet: original.snippet,
          relevanceScore: item.relevanceScore,
          relevanceReason: item.relevanceReason,
          isRelevant: true,
        };
      });

    const keptCount = filteredResults.length;
    const removedCount = results.length - keptCount;

    return {
      filteredResults,
      keptCount,
      removedCount,
    };
  },
});
