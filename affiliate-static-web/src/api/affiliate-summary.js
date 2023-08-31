import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const dashboardSummary = (id, query) => {
  return https().request(`/affiliateSummary/${id}`, Method.GET, query, ContentType.form);
};

export const totalCommissionSummary = (id, siteId) => {
  return https().request(`/affiliateSummary/${id}/total`, Method.GET, { siteId: siteId }, ContentType.form);
};

export const memberCommissionSummary = (id, query) => {
  return https().request(`/affiliateSummary/${id}/memberCommission`, Method.GET, query, ContentType.form);
};

export const lastMemberCommissionSummary = (id, siteId) => {
  return https().request(`/affiliateSummary/${id}/lastMemberCommission`, Method.GET, { siteId: siteId }, ContentType.form);
};

export const getMonthCommission = (id, query) => {
  return https().request(`/affiliateSummary/${id}/commission`, Method.GET, query, ContentType.form);
};

export const getLastMonthCommission = (id, siteId) => {
  return https().request(`/affiliateSummary/${id}/lastCommission`, Method.GET, { siteId: siteId }, ContentType.form);
};

export const getDailyReport = (id, query) => {
  return https().request(`/affiliateSummary/${id}/dailyReport`, Method.GET, query, ContentType.form);
};

export const getChildDailyReport = (id, query) => {
  return https().request(`/affiliateSummary/${id}/childDailyReport`, Method.GET, query, ContentType.form);
};
