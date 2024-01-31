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
