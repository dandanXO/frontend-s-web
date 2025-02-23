import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getCalculated = (query) => {
  return https().request("/promo-refer-spin", Method.GET, query, ContentType.form);
};

export const getClaimRecords = (query) => {
  return https().request("/promo-refer-spin/claim-record", Method.GET, query, ContentType.form);
};

export const getClaimDistributionStats = (query) => {
  return https().request("/promo-refer-spin/stat/claimed-pts-distribution", Method.GET, query, ContentType.form);
};
