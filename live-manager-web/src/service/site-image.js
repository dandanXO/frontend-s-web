import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getSiteImage = (data) => {
  return https().request("/siteImage", Method.GET, data, ContentType.form);
};

export const createSiteImage = (data) => {
  return https().request("/siteImage", Method.POST, data, ContentType.form);
};

export const updateSiteImage = (data) => {
  return https().request(`/siteImage/${data.id}?_method=PUT`, Method.POST, data, ContentType.form);
};

export const deleteSiteImage = async (ids) => {
  await https().request(`/siteImage?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
