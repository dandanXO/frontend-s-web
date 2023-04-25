import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getVips = (query) => {
  return https().request("/vip", Method.GET, query, ContentType.form);
};

export const getVipList = (query) => {
  return https().request("/vip/getList", Method.GET, query, ContentType.form);
};

export const createVip = (vip) => {
  return https().request("/vip", Method.POST, vip, ContentType.form);
};

export const updateVip = (vip) => {
  return https().request(`/vip/${vip.id}?_method=PUT`, Method.POST, vip, ContentType.form);
};

export const deleteVip = (ids) => {
  return https().request(`/vip?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
