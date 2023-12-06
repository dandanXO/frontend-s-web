import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getBetRebateRecord = (query) => {
  return https().request("/bet-rebate-record", Method.GET, query, ContentType.form);
};

export const getTotal = (query) => {
  return https().request("/bet-rebate-record/total", Method.GET, query, ContentType.form);
};

export const adjustAmount = (id, adjust) => {
  return https().request(`/bet-rebate-record/${id}?_method=PUT`, Method.POST, adjust, ContentType.form);
};

export const distribute = (rebate) => {
  return https().request("/bet-rebate-record/rebate", Method.POST, rebate, ContentType.form);
};
