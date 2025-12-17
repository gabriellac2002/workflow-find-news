import { createWorkflow } from "@mastra/core/workflows";
import { inputWorkflowSchema, outputSchema } from "../../schemas/worflowSchema";
import { searchNewsStep } from "../../steps/search-news-step";
import { filterResultsStep } from "../../steps/filter-results-step";
import { formatOutputStep } from "../../steps/format-output-step";

export const findNewsWorkflow = createWorkflow({
  id: "find-news-workflow",
  description:
    "Searches for news articles based on a theme and focus area, then filters for quality",
  inputSchema: inputWorkflowSchema,
  outputSchema: outputSchema,
})
  .then(searchNewsStep)
  .then(filterResultsStep)
  // .then(formatOutputStep)
  .commit();
