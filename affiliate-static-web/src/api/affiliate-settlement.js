import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getAffiliateSettlement = (query) => {
  return https().request("/affiliateSettlement/", Method.GET, query, ContentType.form);
};

export const getAffiliateSettlementReport = (date, id) => {
  return https().request("/affiliateSettlement/settlementReport?date=" + date + "&id=" + id, Method.GET);
};

export const adjustAmount = (id, adjust) => {
  return https().request(`/affiliateSettlement/${id}/adjust?_method=PUT`, Method.POST, adjust, ContentType.form);
};

export const pay = (id, memberId, siteId) => {
  return https().request(`/affiliateSettlement/${id}/pay?_method=PUT&memberId=` + memberId + '&siteId=' + siteId, Method.POST, {}, ContentType.form);
};
