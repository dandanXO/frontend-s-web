import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getMemberBetRecords = (id, query) => {
  return https().request(`/affiliateBetRecord/${id}`, Method.GET, query, ContentType.form);
};

export const getPlatformsBySite = (siteId) => {
  return https().request(`/affiliateBetRecord/platforms/${siteId}`, Method.GET);
};

export const getVipName = (id, siteId) => {
  return https().request(`/affiliateBetRecord/${id}/vip`, Method.GET, { siteId: siteId }, ContentType.form);
};

export const getTotal = (id, query) => {
  return https().request(`/affiliateBetRecord/${id}/total`, Method.GET, query, ContentType.form);
};
