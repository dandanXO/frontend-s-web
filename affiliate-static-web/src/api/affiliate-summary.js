import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const dashboardSummary = (id, query) => {
  return https().request(`/affiliateSummary/${id}`, Method.GET, query, ContentType.form);
};

export const getDailyReport = (id, query) => {
  return https().request(`/affiliateSummary/${id}/dailyReport`, Method.GET, query, ContentType.form);
};

export const getChildDailyReport = (id, query) => {
  return https().request(`/affiliateSummary/${id}/childDailyReport`, Method.GET, query, ContentType.form);
};
