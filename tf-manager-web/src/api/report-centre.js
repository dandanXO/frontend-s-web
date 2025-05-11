import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getFinanceReport = (data) => {
  return https().request("/report/getFinanceReport/", Method.GET, data, ContentType.json);
};
export const getFinanceReportExport = (data) => {
  return https().request("/report/requestFinanceReportExport/", Method.GET, data, ContentType.json);
};

export const getTotalFinanceReport = (data) => {
  return https().request("/report/getTotalFinanceReport/", Method.GET, data, ContentType.json);
};

export const getSiteMemberReport = (data) => {
  return https().request("/report/getSiteMemberReport/", Method.GET, data, ContentType.json);
};

export const getSiteMemberReportExport = (data) => {
  return https().request("/report/requestSiteMemberReportExport/", Method.GET, data, ContentType.json);
};

export const getTotalSiteMemberReport = (data) => {
  return https().request("/report/getTotalSiteMemberReport/", Method.GET, data, ContentType.json);
};

export const getKoreaStatsReport = () => {
  return https().request("/report/krwSiteReport/", Method.GET);
};

export const getVipReport = (data) => {
  return https().request("/report/vip-report/", Method.GET, data, ContentType.json);
};

export const getSiteRetentionReport = (data) => {
  return https().request("/report/site-retention-report", Method.GET, data, ContentType.json)
};

export const getAffiliateRetentionReport = (data) => {
  return https().request("/report/affiliate-retention-report", Method.GET, data, ContentType.json)
};
