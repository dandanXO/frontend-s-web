import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getSportMatch = (query) => {
  return https().request("/sport-match", Method.GET, query, ContentType.form);
};

export const createSportMatch = (sportMatch) => {
  return https().request("/sport-match", Method.POST, sportMatch, ContentType.form);
};

export const updateSportMatch = (id, sportMatch) => {
  return https().request(`/sport-match/${id}?_method=PUT`, Method.POST, sportMatch, ContentType.form);
};

export const endSportMatch = (sportMatch) => {
  return https().request('/sport-match/end?_method=PUT', Method.POST, sportMatch, ContentType.form);
};

export const settleSportMatch = (sportMatch) => {
  return https().request('/sport-match/settle?_method=PUT', Method.POST, sportMatch, ContentType.form);
};

export const deleteSportMatch = (id) => {
  return https().request(`/sport-match/${id}?_method=DELETE`, Method.POST);
};

export const getSportMatchRecord = (query) => {
  return https().request("/sport-match/record", Method.GET, query, ContentType.form);
};

export const settleSportMatchRecord = (id) => {
  return https().request(`/sport-match/record/settle/${id}?_method=PUT`, Method.POST);
};

export const cancelSportMatchRecord = (id) => {
  return https().request(`/sport-match/record/cancel/${id}?_method=PUT`, Method.POST);
};

export const settleAllSportMatchRecord = (siteId) => {
  return https().request('/sport-match/record/settle/all?_method=PUT', Method.POST, { siteId: siteId }, ContentType.form);
};
