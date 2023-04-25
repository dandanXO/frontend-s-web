import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getAffiliateCommission = (affiliateCommission) => {
  return https().request("/affiliate-commission", Method.GET, affiliateCommission, ContentType.form);
};

export const createAffiliateCommission = (affiliateCommission) => {
  return https().request("/affiliate-commission", Method.POST, affiliateCommission, ContentType.form);
};

export const updateAffiliateCommission = (affiliateCommission) => {
  return https().request(`/affiliate-commission/${affiliateCommission.id}?_method=PUT`, Method.POST, affiliateCommission, ContentType.form);
};

export const deleteAffiliateCommission = (ids) => {
  return https().request(`/affiliate-commission?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
