import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getPromoCodeConfigList = (query) => {
  return https().request("/privilege/promo-code-redeem-config", Method.GET, query, ContentType.form);
};

export const createPromoCodeConfig = (rain) => {
  return https().request("/privilege/promo-code-redeem-config", Method.POST, rain, ContentType.json);
};

export const updatePromoCodeConfig = (rain) => {
  return https().request("/privilege/promo-code-redeem-config?_method=PUT", Method.POST, rain, ContentType.json);
};

export const getWays = () => {
  return https().request("/privilege/ways", Method.GET);
};

export const updatePromoCodeConfigStatus = (id, state) => {
  return https().request(`/privilege/promo-code-redeem-config/${id}/state?_method=PUT`, Method.POST, { state: state }, ContentType.form);
};
