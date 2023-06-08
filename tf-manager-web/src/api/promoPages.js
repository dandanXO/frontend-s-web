import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getPromoPagesList = (promoPages) => {
  for (const key in promoPages) {
    if (promoPages[key] === null || promoPages[key] === undefined || promoPages[key] === "") {
      delete promoPages[key];
    }
  }
  return https().request("/promo-pages", Method.GET, promoPages, ContentType.form);
};

export const createPromoPages = (formData) => {
  return https().request("/promo-pages/create", Method.POST, formData, ContentType.json);
};

export const updatePromoPages = (promoPages) => {
  return https().request(`/promo-pages/update?_method=PUT`, Method.POST, promoPages, ContentType.json);
};

export const updatePromoPagesState = async (id, state) => {
  await https().request(`/promo-pages/${id}/state?_method=PUT`, Method.POST, { state: state }, ContentType.form);
};

export const deletePromoPages = async (ids) => {
  console.log(ids)
  await https().request(`/promo-pages?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const getPromoPageById = (id, siteId) => {
  if (siteId) {
    return https().request(`/promo-pages/${id}/promoPage?siteId=${siteId}`, Method.GET);
  } else {
    return https().request(`/promo-pages/${id}/promoPage`, Method.GET);
  }
};
