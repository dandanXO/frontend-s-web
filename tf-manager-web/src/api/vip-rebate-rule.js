import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getVipRebateRule = (rule) => {
  return https().request("/vip-rebate-rule", Method.GET, rule, ContentType.form);
};

export const createVipRebateRule = (rule) => {
  return https().request("/vip-rebate-rule", Method.POST, rule, ContentType.form);
};

export const updateVipRebateRule = (rule) => {
  return https().request(`/vip-rebate-rule/${rule.id}?_method=PUT`, Method.POST, rule, ContentType.form);
};

export const deleteVipRebateRule = (ids) => {
  return https().request(`/vip-rebate-rule?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
