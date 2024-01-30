import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getMemberRebateRule = (rule) => {
  return https().request("/member-rebate-rule", Method.GET, rule, ContentType.form);
};

export const createMemberRebateRule = (rule) => {
  return https().request("/member-rebate-rule", Method.POST, rule, ContentType.form);
};

export const updateMemberRebateRule = (rule) => {
  return https().request(`/member-rebate-rule/${rule.id}?_method=PUT`, Method.POST, rule, ContentType.form);
};

export const deleteMemberRebateRule = (ids) => {
  return https().request(`/member-rebate-rule?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};
