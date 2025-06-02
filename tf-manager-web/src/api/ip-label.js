import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getIpLabel = (ipLabel) => {
  return https().request("/ipLabel", Method.GET, ipLabel, ContentType.form);
};

export const createIpLabel = (ipLabel) => {
  return https().request("/ipLabel", Method.POST, ipLabel, ContentType.form);
};

export const updateIpLabel = (ipLabel) => {
  return https().request(`/ipLabel/${ipLabel.id}?_method=PUT`, Method.POST, ipLabel, ContentType.form);
};

export const deleteIpLabel = (ids) => {
  return https().request(`/ipLabel?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const selectIpLabelList = (query) => {
  return https().request("/ipLabel/list", Method.GET, query, ContentType.form);
};

export const selectIpLabelAll = (siteId) => {
  return https().request("/ipLabel/list", Method.GET, { siteId: siteId }, ContentType.form);
};
