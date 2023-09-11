import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getAffiliateSettlementChecking = (query) => {
  return https().request("/affiliateSettlement/checking", Method.GET, query, ContentType.form);
};

export const getAffiliateCommisionReport = (date, id) => {
  return https().request("/affiliateSettlement/commisionReport?date=" + date + "&id=" + id, Method.GET);
};

export const deleteSettlementChecking = (id) => {
  return https().request(`/affiliateSettlement/${id}/checking?_method=DELETE`, Method.POST, {}, ContentType.form);
};

export const adjustAmount = (id, adjust) => {
  return https().request(`/affiliateSettlement/${id}/checking/adjust?_method=PUT`, Method.POST, adjust, ContentType.form);
};

export const pay = (id) => {
  return https().request(`/affiliateSettlement/${id}/pay?_method=PUT`, Method.POST, {}, ContentType.form);
};

export const getAffiliateSettlementPay = (query) => {
  return https().request("/affiliateSettlement/pay", Method.GET, query, ContentType.form);
};

export const updatetoChecking = (id) => {
  return https().request(`/affiliateSettlement/${id}/pay/toChecking?_method=PUT`, Method.POST, {}, ContentType.form);
};

export const confirmPay = (id) => {
  return https().request(`/affiliateSettlement/${id}/pay?_method=PUT`, Method.POST, {}, ContentType.form);
};
