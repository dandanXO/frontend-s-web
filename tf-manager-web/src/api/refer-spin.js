import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getCalculated = (query) => {
  return https().request("/promo-refer-spin", Method.GET, query, ContentType.form);
};
