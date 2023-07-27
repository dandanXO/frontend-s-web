import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getAdsPopoutList = (adsPopout) => {
  for (const key in adsPopout) {
    if (adsPopout[key] === null || adsPopout[key] === undefined || adsPopout[key] === "") {
      delete adsPopout[key];
    }
  }
  return https().request("/site-ads-popout", Method.GET, adsPopout, ContentType.form);
};

export const createAdsPopout = (adsPopout) => {
  return https().request("/site-ads-popout/create", Method.POST, adsPopout, ContentType.json);
};

export const updateAdsPopout = (adsPopout) => {
  return https().request(`/site-ads-popout/update?_method=PUT`, Method.POST, adsPopout, ContentType.json);
};

export const updateAdsPopoupStatus = async (id, status) => {
  await https().request(`/site-ads-popout/${id}/status?_method=PUT`, Method.POST, { status: status }, ContentType.form);
};

export const deleteAdsPopout = async (ids) => {
  await https().request(`/site-ads-popout?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const getAdsPopOutById = (id, siteId) => {
  if (siteId) {
    return https().request(`/site-ads-popout/${id}?siteId=${siteId}`, Method.GET);
  } else {
    return https().request(`/site-ads-popout/${id}`, Method.GET);
  }
};
