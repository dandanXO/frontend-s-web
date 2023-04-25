import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getFinancialLevels = (query) => {
  return https().request("/financial/list", Method.GET, query, ContentType.form);
};

export const getFinancialLevelList = (query) => {
  return https().request("/financial", Method.GET, query, ContentType.form)
};

export const createFinancialLevel = (financialLevel) => {
  return https().request("/financial", Method.POST, financialLevel, ContentType.form);
};

export const updateFinancialLevel = (financialLevel) => {
  return https().request(`/financial/${financialLevel.id}?_method=PUT`, Method.POST, financialLevel, ContentType.form);
};

export const deleteFinancialLevel = (ids) => {
  return https().request(`/financial?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
