import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getAffiliateReport = (query) => {
  return https().request("/report/getAffiliateReport", Method.GET, query, ContentType.form);
};
