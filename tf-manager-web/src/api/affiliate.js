import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getAffiliateInfo = (id, siteId) => {
  return https().request(`/affiliate/${id}/detail?siteId=${siteId}`, Method.GET);
};

export const getMemberLoginRecord = (query) => {
  return https().request(`/affiliate/loginRecord`, Method.GET, query, ContentType.form);
};

export const getMemberMoneyChangeList = (id, query) => {
  return https().request(`/affiliate/${id}/memberMoneyChange`, Method.GET, query, ContentType.form);
};

export const getMemberWithdrawRecord = (id, query) => {
  return https().request(`/affiliate/${id}/withdrawRecord`, Method.GET, query, ContentType.form);
};

export const getMemberWithdrawRecordTotalAmount = (id, query) => {
  return https().request(`/affiliate/${id}/withdrawRecordTotalAmount`, Method.GET, query, ContentType.form);
};

export const getMemberBank = (id, query) => {
  return https().request(`/affiliate/${id}/memberBankCard`, Method.GET, query, ContentType.form);
};

export const getMemberBankLog = (id, query) => {
  return https().request(`/affiliate/${id}/memberBankCardRecord`, Method.GET, query, ContentType.form);
};
