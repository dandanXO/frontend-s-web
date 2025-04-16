import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getAffiliateGameStats = (id, query) => {
  return https().request(`/gameStats/${id}/affiliate`, Method.GET, query, ContentType.form);
};

export const getAffiliateChildGameStats = (id, query) => {
  return https().request(`/gameStats/${id}/affiliateChild`, Method.GET, query, ContentType.form);
};

export const countChild = (id, query) => {
  return https().request(`/gameStats/${id}/countChild`, Method.GET, query, ContentType.form);
};

export const getMemberGameStats = (id, query) => {
  return https().request(`/gameStats/${id}/member`, Method.GET, query, ContentType.form);
};

export const getKoreaStatsReport = () => {
  return https().request("/affiliate-statistics", Method.GET);
};
