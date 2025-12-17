import axios from "axios";
import {
  SerperAPIPayload,
  SerperSearchParams,
  SerperSearchResponse,
  SerperSearchSuccess,
} from "../types/serper";
import { intervalMapping } from "../utils/serperWebSearchService";

const BASE_URL = "https://google.serper.dev";
const API_KEY = process.env.SERPER_API_KEY || null;

async function fetchSerperAPI(
  type: string,
  query: string,
  payload: SerperAPIPayload
): Promise<SerperSearchResponse> {
  try {
    const response = await axios.request({
      method: "post",
      url: `${BASE_URL}/search`,
      data: payload,
      maxBodyLength: Infinity,
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("Serper API response data:", response);

    const results = response.data[type] || response.data.organic || [];
    const relatedSearches = response.data.relatedSearches;

    if (!results?.length) {
      console.log("Serper returned empty results for query:", query);
    }

    const successResult: SerperSearchSuccess = {
      success: true,
      results,
      relatedSearches,
    };

    return successResult;
  } catch (error) {
    console.error("Error fetching data from Serper API:", error);
    return {
      success: false,
      error: "Failed to execute Serper search",
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function search(
  params: SerperSearchParams
): Promise<SerperSearchResponse> {
  if (!API_KEY) {
    throw new Error("SERPER_API_KEY is not defined.");
  }

  if (!params.query || !params.query.trim()) {
    return {
      success: false,
      error: "Query parameter is required",
    };
  }

  const { type, query, interval, gl, hl, location } = params;
  //console.log("🕛 WEB SEARCH", { type, query, interval, gl, hl, location });

  const tbs = intervalMapping[interval];

  const payload: SerperAPIPayload = {
    q: query,
    num: 30,
    type,
    tbs: tbs !== "" ? tbs : undefined,
    gl,
    hl,
    location: location !== "-" ? location : undefined,
  };

  const response = await fetchSerperAPI(type, query, payload);
  return response;
}
