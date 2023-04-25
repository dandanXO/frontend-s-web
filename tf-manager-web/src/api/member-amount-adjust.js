import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const createAddMemberAmountAdjust = (memberAmountAdjust) => {
  return https().request("/memberAmountAdjust/add", Method.POST, memberAmountAdjust, ContentType.form);
};

export const createDeductMemberAmountAdjust = (memberAmountAdjust) => {
  return https().request("/memberAmountAdjust/deduct", Method.POST, memberAmountAdjust, ContentType.form);
};

export const getMemberAmountAdjust = (memberAmountAdjust) => {
  return https().request("/memberAmountAdjust", Method.GET, memberAmountAdjust, ContentType.form);
};

export const getTotalReimburseAmount = (memberAmountAdjust) => {
  return https().request("/memberAmountAdjust/totalReimburseAmount", Method.GET, memberAmountAdjust, ContentType.form);
};

export const getTotalDeductionAmount = (memberAmountAdjust) => {
  return https().request("/memberAmountAdjust/totalDeductionAmount", Method.GET, memberAmountAdjust, ContentType.form);
};

export const getNumberOfReimburse = (memberAmountAdjust) => {
  return https().request("/memberAmountAdjust/numberOfReimburse", Method.GET, memberAmountAdjust, ContentType.form);
};

export const getNumberOfDeduct = (memberAmountAdjust) => {
  return https().request("/memberAmountAdjust/numberOfDeduct", Method.GET, memberAmountAdjust, ContentType.form);
};

export const createBatchAmountAdjust = (memberAmountAdjust) => {
  return https(5 * 60 * 1000).request("/memberAmountAdjust/createBatch", Method.POST, { memberAmountAdjusts: JSON.stringify(memberAmountAdjust) }, ContentType.form);
};

export const getExport = (query) => {
  return https().request("/memberAmountAdjust/export", Method.GET, query, ContentType.form);
};
