export type SerperSearchType = "news" | "search" | "scholar" | "webpage";

export type SerperSearchInterval = "lastWeek" | "lastMonth";

export type SerperSearchParams = {
  type: SerperSearchType;
  query: string;
  gl: "br" | "us";
  hl: "pt" | "en";
  location: string;
  interval: SerperSearchInterval;
};

export type SerperSearchResult = {
  title: string;
  link: string;
  snippet: string;
  position: number;
};

export interface SerperSearchSuccess {
  success: true;
  results: SerperSearchResult[];
  relatedSearches?: string[];
}

export interface SerperSearchFailure {
  success: false;
  error: string;
  details?: string;
}

export type SerperSearchResponse = SerperSearchSuccess | SerperSearchFailure;

export type SerperAPIPayload = {
  q: string;
  num: number;
  type: SerperSearchType;
  tbs?: string;
  gl: string;
  hl: string;
  location?: string;
};

export type SerperWebPageParams = {
  url: string;
};

export type SerperWebPageSuccess = {
  success: true;
  url: string;
  text: string;
  title: string;
};

export type SerperWebPageFailure = {
  success: false;
  error: string;
  details?: string;
};

export type SerperWebPageResponse = SerperWebPageSuccess | SerperWebPageFailure;
