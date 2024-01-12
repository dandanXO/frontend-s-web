import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getAffiliateFinancialConfigList = (affiliateFinancialConfig) => {
  return https().request("/affiliate-financial-config", Method.GET, affiliateFinancialConfig, ContentType.form);
};

export const createAffiliateFinancialConfig = (affiliateFinancialConfig) => {
  return https().request(`/affiliate-financial-config`, Method.POST, affiliateFinancialConfig, ContentType.form);
};

export const updateAffiliateFinancialConfig = (affiliateFinancialConfig) => {
  return https().request(`/affiliate-financial-config/update?_method=PUT`, Method.POST, affiliateFinancialConfig, ContentType.form);
};
