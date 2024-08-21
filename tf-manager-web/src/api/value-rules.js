import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getValueRulesList = () => {
  return https().request("/value-rules/list", Method.GET);
};

export const getValueRulesRecords = (rules) => {
  return https().request("/value-rules", Method.GET, rules, ContentType.form);
};

export const createValueRules = (rules) => {
  return https().request("/value-rules", Method.POST, rules, ContentType.form);
};

export const updateValueRules = rules => {
  return https().request(
    `/value-rules/${rules.id}?_method=PUT`,
    Method.POST,
    rules,
    ContentType.form
  )
}

export const deleteValueRules = ids => {
  return https().request(
    `/value-rules?_method=DELETE`,
    Method.POST,
    { ids: ids.join(',') },
    ContentType.form
  )
}
