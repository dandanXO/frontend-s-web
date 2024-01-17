import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getAffiliateRecord = (id) => {
  return https().request(`/affiliateRecord/${id}`, Method.GET);
};

export const getAffiliateSummary = (query) => {
  return https().request("/affiliateRecord/summary", Method.GET, query, ContentType.form);
};

export const getAffiliateSummaryNewMember = (query) => {
  return https().request("/affiliateRecord/summary/newMember", Method.GET, query, ContentType.form);
};

export const getAffiliateMonthSummary = (query) => {
  return https().request("/affiliateRecord/month-summary", Method.GET, query, ContentType.form);
};

export const getAffiliateMonthSummaryDetail = (id, query) => {
  return https().request(`/affiliateRecord/month-summary/details/${id}`, Method.GET, query, ContentType.form);
};

export const getSummariesForExport = (query) => {
  return https().request("/affiliateRecord/month-summary/export", Method.GET, query, ContentType.form);
};

export const updateSettlementState = (ids, state) => {
  return https().request("/affiliateRecord/month-summary/settle?_method=PUT", Method.POST, { ids: ids.join(","), state: state }, ContentType.form);
};

export const getAffiliateList = (siteId) => {
  return https().request(`/affiliateRecord/getAllAffiliateBySiteId?siteId=${siteId}`, Method.GET);
}
