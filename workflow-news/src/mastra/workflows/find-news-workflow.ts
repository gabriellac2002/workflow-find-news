import { createWorkflow } from "@mastra/core/workflows";
import { inputWorkflowSchema, outputSchema } from "../../schemas/worflowSchema";
import { searchNewsStep } from "../../steps/search-news-step";
import { filterResultsStep } from "../../steps/filter-results-step";
import { categorizeResultsStep } from "../../steps/categorize-results-step";
import { selectTopResultsStep } from "../../steps/select-top-results-step";

export const findNewsWorkflow = createWorkflow({
  id: "find-news-workflow",
  description:
    "Searches for news articles based on a theme and focus area, filters for quality, categorizes by type, and selects top results",
  inputSchema: inputWorkflowSchema,
  outputSchema: outputSchema,
})
  .then(searchNewsStep)
  .then(filterResultsStep)
  .then(categorizeResultsStep)
  .then(selectTopResultsStep)
  .commit();
