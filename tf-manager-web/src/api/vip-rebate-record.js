import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getVipRebateRecord = (query) => {
  return https().request("/vip-rebate-record", Method.GET, query, ContentType.form);
};

export const getTotal = (query) => {
  return https().request("/vip-rebate-record/total", Method.GET, query, ContentType.form);
};

export const adjustAmount = (id, adjust) => {
  return https().request(`/vip-rebate-record/${id}?_method=PUT`, Method.POST, adjust, ContentType.form);
};

export const distribute = (rebate) => {
  return https().request("/vip-rebate-record/rebate", Method.POST, rebate, ContentType.form);
};
