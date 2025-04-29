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
  return https().request("/promo-pages/create", Method.POST, formData, ContentType.form);
};

export const updatePromoPages = (promoPages) => {
  return https().request(`/promo-pages/update?_method=PUT`, Method.POST, promoPages, ContentType.form);
};

export const updatePromoPagesState = async (id, state) => {
  await https().request(`/promo-pages/${id}/state?_method=PUT`, Method.POST, { state: state }, ContentType.form);
};

export const deletePromoPages = async (ids) => {
  console.log(ids)
  await https().request(`/promo-pages?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const getPromoPageById = (id) => {
  return https().request(`/promo-pages/${id}/promoPage`, Method.GET);
};

export const getActivePromoPageList = (siteId) => {
  return https().request("/promo-pages/list", Method.GET, { siteId: siteId }, ContentType.form);
};

export const updateFastAccessState = async (id, state) => {
  await https().request(`/promo-pages/${id}/fastAccessState?_method=PUT`, Method.POST, { state: state }, ContentType.form);
};

export const getSimplePromoPageList = (siteId) => {
  return https().request(`/promo-pages/simple-list`, Method.GET, { siteId: siteId }, ContentType.form);
};
