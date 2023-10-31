import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getAffiliateReport = (query) => {
  return https().request("/report/getAffiliateReport", Method.GET, query, ContentType.form);
};

export const getAffiliateChildReport = (query) => {
  return https().request("/report/getAffiliateChildReport", Method.GET, query, ContentType.form);
};

export const getAffiliateReportTotal = (query) => {
  return https().request("/report/getAffiliateReportTotal", Method.GET, query, ContentType.form);
};

export const getAffiliateReportExport = (query) => {
  return https().request("/report/requestAffiliateReportExport", Method.GET, query, ContentType.form);
};

export const getAffiliateMemberDeposit = (query) => {
  return https().request("/report/getAffiliateMemberDeposit", Method.GET, query, ContentType.form);
};
