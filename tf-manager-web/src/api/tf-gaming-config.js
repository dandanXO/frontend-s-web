import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getConfigList = (siteId) => {
  return https().request("/tf-gaming-config", Method.GET, { siteId: siteId }, ContentType.form);
};

export const updateConfig = (config) => {
  return https().request(`/tf-gaming-config/edit?_method=PUT`, Method.POST, config, ContentType.form);
};

export const updateConfigState = (id, state) => {
  return https().request(`/tf-gaming-config/${id}/state?_method=PUT`, Method.POST, { state: state }, ContentType.form);
};
