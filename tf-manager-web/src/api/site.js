import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getSites = (site) => {
  return https().request("/site", Method.GET, site, ContentType.form);
};

export const createSite = (site) => {
  return https().request("/site", Method.POST, site, ContentType.form);
};

export const updateSite = async (site) => {
  await https().request(`/site/${site.id}?_method=PUT`, Method.POST, site, ContentType.form);
};

export const updateSiteState = async (id, state) => {
  await https().request(`/site/${id}/state?_method=PUT`, Method.POST, { state: state }, ContentType.form);
};

export const updateSiteMenu = async (id, param) => {
  await https().request(`/site/${id}/param?_method=PUT`, Method.POST, { param: param }, ContentType.form);
};

export const getSiteListSimple = () => {
  return https().request("/site/systemSiteList", Method.GET);
}

export const getSiteListSimpleNoParenId = () => {
  return https().request("/site/systemSiteListNoParenId", Method.GET);
}

export const getSiteExcelMapping = () => {
  return https().request("/site/excelMapping", Method.GET);
}
