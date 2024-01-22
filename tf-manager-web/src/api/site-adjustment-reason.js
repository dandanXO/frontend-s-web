import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getReasons = (request) => {
  return https().request("/siteAdjustmentReason", Method.GET, request, ContentType.form);
};

export const getReasonTypes = () => {
  return https().request("/siteAdjustmentReason/reasonTypes", Method.GET, ContentType.form);
};

export const createReason = (reason) => {
  return https().request("/siteAdjustmentReason", Method.POST, reason, ContentType.form);
};

export const updateReason = async (reason) => {
  await https().request(`/siteAdjustmentReason/${reason.id}?_method=PUT`, Method.POST, reason, ContentType.form);
};

export const deleteReasons = async (ids) => {
  await https().request(`/siteAdjustmentReason?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
