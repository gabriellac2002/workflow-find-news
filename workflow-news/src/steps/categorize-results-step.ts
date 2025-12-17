import { createStep } from "@mastra/core";
import {
  filterStepOutputSchema,
  categorizeStepOutputSchema,
  Category,
  categoryEnum,
} from "../schemas/searchResultSchema";

export const categorizeResultsStep = createStep({
  id: "categorize-results",
  description:
    "Categorizes filtered articles into breaking changes, new features, best practices, and tools using LLM",
  inputSchema: filterStepOutputSchema,
  outputSchema: categorizeStepOutputSchema,

  execute: async ({ inputData, mastra }) => {
    const { filteredResults, theme, focusArea } = inputData;

    if (filteredResults.length === 0) {
      return {
        categorizedResults: [],
        theme,
        focusArea,
      };
    }

    const prompt = `You are an expert technical content categorizer.

Theme: "${theme}"
Focus area: "${focusArea}"

Allowed categories (use EXACTLY one of these strings):
${categoryEnum.options.map((c) => `- ${c}`).join("\n")}

Articles:
${filteredResults
  .map(
    (result, index) =>
      `${index + 1}. ${result.title} - ${result.link}
Snippet: ${result.snippet}
Relevance: ${result.relevanceReason}`
  )
  .join("\n\n")}

Respond ONLY with a JSON array. Each item must contain:
- index (number, 1-based)
- category (one of: "breaking-changes", "new-features", "best-practices", "tools", "other")
- categoryReason (max 50 words explaining why it fits this category)
`;

    const contentAgent = mastra.getAgent("contentFilterAgent");

    const { text } = await contentAgent.generate([
      { role: "user", content: prompt },
    ]);

    let aiResults: Array<{
      index: number;
      category: Category;
      categoryReason: string;
    }> = [];

    try {
      aiResults = JSON.parse(text);
    } catch (error) {
      console.error("Failed to parse AI response:", text);
    }

    console.log("🤖 AI categorization --->", aiResults);

    const categorizedResults = aiResults
      .filter((item) => filteredResults[item.index - 1])
      .map((item) => {
        const original = filteredResults[item.index - 1];

        return {
          title: original.title,
          link: original.link,
          snippet: original.snippet,
          relevanceScore: original.relevanceScore,
          relevanceReason: original.relevanceReason,
          category: item.category,
          categoryReason: item.categoryReason,
        };
      });

    return {
      theme,
      focusArea,
      categorizedResults,
    };
  },
});
