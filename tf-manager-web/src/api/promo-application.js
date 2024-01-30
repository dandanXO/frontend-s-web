import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getPromoApplication = (query) => {
  return https().request("/promo-application", Method.GET, query, ContentType.form);
};
