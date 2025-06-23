import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getConfigs = (config) => {
  return https().request("/config", Method.GET, config, ContentType.form);
};

export const getDefaultConfigs = (defaultConfig) => {
  return https().request("/config/default", Method.GET, defaultConfig, ContentType.form);
};

export const createConfig = (config) => {
  return https().request("/config", Method.POST, config, ContentType.form);
};

export const updateConfig = async (config) => {
  await https().request(`/config/${config.id}?_method=PUT`, Method.POST, config, ContentType.form);
};

export const updateBatch = async (configs) => {
  await https().httpClient.post('/config?_method=PUT', JSON.stringify(configs), { headers: { "Content-Type": "application/json" } });
}

export const updateOrderBatch = async (orders) => {
  await https().httpClient.post('/config/order?_method=PUT', JSON.stringify(orders), { headers: { "Content-Type": "application/json" } });
}

export const deleteById = async (id) => {
  await https().request(`/config/${id}?_method=DELETE`, Method.POST);
}

export const getConfigList = (code, siteId) => {
  return https().request("/config/list", Method.GET, { code: code, siteId: siteId }, ContentType.form);
};

export const getConfigListByGroup = (group, siteId) => {
  return https().request("/config/list-by-group", Method.GET, { configGroup: group, siteId: siteId }, ContentType.form);
};

export const getSupportDarkMode = (siteId) => {
  return https().request("/config/supportDarkMode", Method.GET, { siteId: siteId }, ContentType.form);
};

export const getOpenForMember = (siteId, code, memberId) => {
  return https().request(`/config/openForMember/${memberId}`, Method.GET, { siteId: siteId, code: code }, ContentType.form);
};

export const getGroup = (id) => {
  return https().request("/config/group", Method.GET, { id }, ContentType.form);
};
