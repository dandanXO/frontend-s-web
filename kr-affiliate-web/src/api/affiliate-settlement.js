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

export const pay = (id) => {
  return https().request(`/affiliateSettlement/${id}/pay?_method=PUT`, Method.POST, {}, ContentType.form);
};

export const getMonthlyCommissionReport = (id, date) => {
  return https().request(`/affiliateSettlement/monthlyCommissionReport/${id}`, Method.GET, { recordMonth: date }, ContentType.form);
};

export const getCommissionReportByDate = (query) => {
  return https().request('/affiliateSettlement/commissionReportByDates', Method.GET, { recordDates: query.recordTime }, ContentType.form);
};
