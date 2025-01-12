import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getTopRankingList = (topRanking) => {
  return https().request("/top-bonus-ranking", Method.GET, topRanking, ContentType.form);
};

export const createTopRanking = (topRanking) => {
  return https().request("/top-bonus-ranking", Method.POST, topRanking, ContentType.form);
};

export const updateTopRanking = (topRanking) => {
  return https().request(`/top-bonus-ranking?_method=PUT`, Method.POST, topRanking, ContentType.form);
};

export const delTopRanking = (ids) => {
  return https().request(`/top-bonus-ranking?_method=DELETE`, Method.POST, { ids: ids }, ContentType.form);
};
