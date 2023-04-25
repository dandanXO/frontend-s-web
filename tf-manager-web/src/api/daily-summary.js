import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getSiteDailySummary = (form) => {
  return https().request("/site-daily-summary", Method.GET, form, ContentType.form);
};
