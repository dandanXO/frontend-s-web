import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getNbaMatchPreseason = (query) => {
  return https().request("/nba-match-preseason", Method.GET, query, ContentType.form);
};

export const createNbaMatchPreseason = (nbaMatchPreseason) => {
  return https().request("/nba-match-preseason", Method.POST, nbaMatchPreseason, ContentType.form);
};

export const updateNbaMatchPreseason = (id, nbaMatchPreseason) => {
  return https().request(`/nba-match-preseason/${id}?_method=PUT`, Method.POST, nbaMatchPreseason, ContentType.form);
};

export const updateToShow = (id, toShow) => {
  return https().request(`/nba-match-preseason/${id}/toShow?_method=PUT`, Method.POST, { toShow: toShow }, ContentType.form);
};

export const endNbaMatchPreseason = (nbaMatchPreseason) => {
  return https().request('/nba-match-preseason/end?_method=PUT', Method.POST, nbaMatchPreseason, ContentType.form);
};

export const deleteNbaMatchPreseason = (id) => {
  return https().request(`/nba-match-preseason/${id}?_method=DELETE`, Method.POST);
};

export const getNbaMatchPreseasonRecord = (query) => {
  return https().request("/nba-match-preseason/record", Method.GET, query, ContentType.form);
};

export const settleNbaMatchPreseasonRecord = (id) => {
  return https().request(`/nba-match-preseason/record/settle/${id}?_method=PUT`, Method.POST);
};

export const cancelNbaMatchPreseasonRecord = (id) => {
  return https().request(`/nba-match-preseason/record/cancel/${id}?_method=PUT`, Method.POST);
};

export const settleAllNbaMatchPreseasonRecord = (siteId) => {
  return https().request('/nba-match-preseason/record/settle/all?_method=PUT', Method.POST, { siteId: siteId }, ContentType.form);
};
