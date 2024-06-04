import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getNbaMatch = (query) => {
  return https().request("/nba-match", Method.GET, query, ContentType.form);
};

export const createNbaMatch = (nbaMatch) => {
  return https().request("/nba-match", Method.POST, nbaMatch, ContentType.form);
};

export const updateNbaMatch = (id, nbaMatch) => {
  return https().request(`/nba-match/${id}?_method=PUT`, Method.POST, nbaMatch, ContentType.form);
};

export const updateToShow = (id, toShow) => {
  return https().request(`/nba-match/${id}/toShow?_method=PUT`, Method.POST, { toShow: toShow }, ContentType.form);
};

export const endNbaMatch = (nbaMatch) => {
  return https().request('/nba-match/end?_method=PUT', Method.POST, nbaMatch, ContentType.form);
};

export const deleteNbaMatch = (id) => {
  return https().request(`/nba-match/${id}?_method=DELETE`, Method.POST);
};

export const getNbaMatchRecord = (query) => {
  return https().request("/nba-match/record", Method.GET, query, ContentType.form);
};

export const settleNbaMatchRecord = (id) => {
  return https().request(`/nba-match/record/settle/${id}?_method=PUT`, Method.POST);
};

export const cancelNbaMatchRecord = (id) => {
  return https().request(`/nba-match/record/cancel/${id}?_method=PUT`, Method.POST);
};

export const settleAllNbaMatchRecord = (siteId) => {
  return https().request('/nba-match/record/settle/all?_method=PUT', Method.POST, { siteId: siteId }, ContentType.form);
};
