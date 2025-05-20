import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getPlatformSummary = (query) => {
  return https().request('/affiliateSummary/platformReport', Method.GET, query, ContentType.form);
};