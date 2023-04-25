import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getRiskLevel = (riskLevel) => {
  return https().request("/riskLevel", Method.GET, riskLevel, ContentType.form);
};

export const createRiskLevel = (riskLevel) => {
  return https().request("/riskLevel", Method.POST, riskLevel, ContentType.form);
};

export const updateRiskLevel = (riskLevel) => {
  return https().request(`/riskLevel/${riskLevel.id}?_method=PUT`, Method.POST, riskLevel, ContentType.form);
};

export const deleteRiskLevel = (ids) => {
  return https().request(`/riskLevel?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const selectList = (query) => {
  return https().request("/riskLevel/list", Method.GET, query, ContentType.form);
};
