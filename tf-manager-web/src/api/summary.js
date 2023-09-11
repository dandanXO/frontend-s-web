import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const generateSummary = (summary) => {
  return https().request("/manual-summary", Method.POST, summary, ContentType.form);
};

export const generateAffiliateSummary = (summary) => {
  return https().request("/manual-summary/affiliate", Method.POST, summary, ContentType.form);
};
