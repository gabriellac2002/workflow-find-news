import axios from "axios";
import {
  SerperWebPageParams,
  SerperWebPageResponse,
  SerperWebPageSuccess,
} from "../types/serper";

const SCRAPE_URL = "https://scrape.serper.dev";
const API_KEY = process.env.SERPER_API_KEY || null;

async function fetchSerperScrapeAPI(
  url: string,
  payload: SerperWebPageParams
): Promise<SerperWebPageResponse> {
  try {
    const response = await axios.request({
      method: "post",
      url: `${SCRAPE_URL}`,
      data: payload,
      maxBodyLength: Infinity,
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("Serper Scrape API response data:", response);

    const successResult: SerperWebPageSuccess = {
      success: true,
      url,
      text: response.data.text,
      title: response.data.metadata?.title || "",
    };

    return successResult;
  } catch (error) {
    console.error("Error fetching data from Serper Scrape API:", error);
    return {
      success: false,
      error: "Failed to scrape webpage",
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function scrapePage(
  params: SerperWebPageParams
): Promise<SerperWebPageResponse> {
  if (!API_KEY) {
    throw new Error("SERPER_API_KEY is not defined.");
  }

  if (!params.url || !params.url.trim()) {
    return {
      success: false,
      error: "URL parameter is required",
    };
  }

  const result = await fetchSerperScrapeAPI(params.url, params);

  return result;
}
