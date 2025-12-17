import { createStep } from "@mastra/core";
import {
  categorizeStepOutputSchema,
  selectStepOutputSchema,
} from "../schemas/searchResultSchema";

export const selectTopResultsStep = createStep({
  id: "select-top-results",
  description:
    "Selects the top 5-10 most relevant articles for full reading based on theme and focus area using LLM",
  inputSchema: categorizeStepOutputSchema,
  outputSchema: selectStepOutputSchema,

  execute: async ({ inputData, mastra }) => {
    const { theme, focusArea, categorizedResults } = inputData;

    if (categorizedResults.length === 0) {
      return {
        theme,
        focusArea,
        selectedResults: [],
        totalSelected: 0,
      };
    }

    const prompt = `You are an expert content curator selecting the most valuable articles for deep reading.

Theme: "${theme}"
Focus area: "${focusArea}"

Select the TOP 5-10 most relevant and valuable articles for someone interested in this theme and focus area.

Prioritize:
1. Breaking changes (highest priority if relevant)
2. New features that match the focus area
3. Best practices directly related to the focus area
4. Innovative tools or approaches
5. Content with high relevance scores

Articles:
${categorizedResults
  .map(
    (result, index) =>
      `${index + 1}. ${result.title} - ${result.link}
Category: ${result.category}
Snippet: ${result.snippet}
Relevance Score: ${result.relevanceScore}/10
Relevance Reason: ${result.relevanceReason}
Category Reason: ${result.categoryReason}`
  )
  .join("\n\n")}

Respond ONLY with a JSON array containing 5-10 selected articles. Each item must contain:
- index (number, 1-based, from the list above)
- selectionReason (max 100 words explaining why this article is essential reading)
- priority (number 1-10, where 10 is highest priority for reading)

Sort the array by priority (highest first).
`;

    const contentAgent = mastra.getAgent("contentFilterAgent");

    const { text } = await contentAgent.generate([
      { role: "user", content: prompt },
    ]);

    let aiResults: Array<{
      index: number;
      selectionReason: string;
      priority: number;
    }> = [];

    try {
      aiResults = JSON.parse(text);
    } catch (error) {
      console.error("Failed to parse AI response:", text);
    }

    console.log("🤖 AI selection --->", aiResults);

    const selectedResults = aiResults
      .filter((item) => categorizedResults[item.index - 1])
      .map((item) => {
        const original = categorizedResults[item.index - 1];

        return {
          title: original.title,
          link: original.link,
          snippet: original.snippet,
          relevanceScore: original.relevanceScore,
          relevanceReason: original.relevanceReason,
          category: original.category,
          categoryReason: original.categoryReason,
          selectionReason: item.selectionReason,
          priority: item.priority,
        };
      })
      .sort((a, b) => b.priority - a.priority);

    return {
      theme,
      focusArea,
      selectedResults,
      totalSelected: selectedResults.length,
    };
  },
});
