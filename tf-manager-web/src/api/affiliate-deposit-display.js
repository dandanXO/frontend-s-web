import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getAffiliateDepositDisplayList = (affiliateDepositDisplay) => {
  return https().request("/affiliate-deposit-display", Method.GET, affiliateDepositDisplay, ContentType.form);
};

export const createAffiliateDepositDisplay = (affiliateDepositDisplay) => {
  return https().request(`/affiliate-deposit-display`, Method.POST, affiliateDepositDisplay, ContentType.form);
};

export const updateAffiliateDepositDisplay = (affiliateDepositDisplay) => {
  return https().request(`/affiliate-deposit-display/update?_method=PUT`, Method.POST, affiliateDepositDisplay, ContentType.form);
};

export const getAffiliateDepositSetting = (siteId) => {
  return https().request("/affiliate-deposit-display/setting", Method.GET, siteId, ContentType.form);
};

export const createAffiliateDepositSetting = (affiliateDepositSetting) => {
  return https().request(`/affiliate-deposit-display/setting`, Method.POST, affiliateDepositSetting, ContentType.form);
};

export const updateAffiliateDepositSetting = (affiliateDepositSetting) => {
  return https().request(`/affiliate-deposit-display/setting/update?_method=PUT`, Method.POST, affiliateDepositSetting, ContentType.form);
};

export const getAffiliateBySiteId = (siteId) => {
  return https().request(`/affiliate-deposit-display/affiliate-list?siteId=${siteId}`, Method.GET);
};
