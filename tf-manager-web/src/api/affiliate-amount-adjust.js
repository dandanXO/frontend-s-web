import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const createAddAffiliateAmountAdjust = (affiliateAmountAdjust) => {
  return https().request("/affiliateAmountAdjust/add", Method.POST, affiliateAmountAdjust, ContentType.form);
};

export const createDeductAffiliateAmountAdjust = (affiliateAmountAdjust) => {
  return https().request("/affiliateAmountAdjust/deduct", Method.POST, affiliateAmountAdjust, ContentType.form);
};

export const getAffiliateAmountAdjust = (affiliateAmountAdjust) => {
  return https().request("/affiliateAmountAdjust", Method.GET, affiliateAmountAdjust, ContentType.form);
};

export const getTotalReimburseAmount = (affiliateAmountAdjust) => {
  return https().request("/affiliateAmountAdjust/totalReimburseAmount", Method.GET, affiliateAmountAdjust, ContentType.form);
};

export const getTotalDeductionAmount = (affiliateAmountAdjust) => {
  return https().request("/affiliateAmountAdjust/totalDeductionAmount", Method.GET, affiliateAmountAdjust, ContentType.form);
};

export const getNumberOfReimburse = (affiliateAmountAdjust) => {
  return https().request("/affiliateAmountAdjust/numberOfReimburse", Method.GET, affiliateAmountAdjust, ContentType.form);
};

export const getNumberOfDeduct = (affiliateAmountAdjust) => {
  return https().request("/affiliateAmountAdjust/numberOfDeduct", Method.GET, affiliateAmountAdjust, ContentType.form);
};

export const createBatchAmountAdjust = (affiliateAmountAdjust) => {
  return https(5 * 60 * 1000).request("/affiliateAmountAdjust/createBatch", Method.POST, { affiliateAmountAdjust: JSON.stringify(affiliateAmountAdjust) }, ContentType.form);
};

export const getExport = (query) => {
  return https().request("/affiliateAmountAdjust/export", Method.GET, query, ContentType.form);
};
