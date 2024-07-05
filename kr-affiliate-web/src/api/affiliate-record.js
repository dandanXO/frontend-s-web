import { Method, ContentType } from 'axios-mapper'
import https from '../utils/https'

export const getAffiliateRecord = id => {
  return https().request(`/affiliateRecord/${id}`, Method.GET)
}

export const getAffiliateList = (id) => {
  return https().request(`/affiliateRecord/getAllDownlineByMemberId/${id}`, Method.GET);
}

export const getAffiliateSummary = (query) => {
  return https().request("/downline/summaryChild", Method.GET, query, ContentType.form);
};

export const getTotalSummary = (query) => {
  return https().request("/downline/affiliateSummary", Method.GET, query, ContentType.form);
};
