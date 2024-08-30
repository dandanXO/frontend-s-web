import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getPromoType = (promoType) => {
  return https().request("/promo-type", Method.GET, promoType, ContentType.form);
};

export const getActivePromoType = (siteId, siteType) => {
  return https().request("/promo-type/active?siteType=" + siteType + "&siteId=" + siteId, Method.GET);
};

export const createPromoType = (promoType) => {
  return https().request("/promo-type", Method.POST, promoType, ContentType.form);
};

export const updatePromoType = (id, promoType) => {
  return https().request(`/promo-type/${id}?_method=PUT`, Method.POST, promoType, ContentType.form);
};

export const updatestatus = (id, state) => {
  return https().request(`/promo-type/${id}/state?_method=PUT`, Method.POST, { state: state }, ContentType.form);
};

export const deletePromoType = (ids) => {
  return https().request(`/promo-type?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
