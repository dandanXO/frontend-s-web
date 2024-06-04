import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getAffiliateBetRebateRecord = (query) => {
  return https().request("/affiliate-bet-rebate-record", Method.GET, query, ContentType.form);
};

export const getTotal = (query) => {
  return https().request("/affiliate-bet-rebate-record/total", Method.GET, query, ContentType.form);
};

export const adjustRebateAmount = (id, adjust) => {
  return https().request(`/affiliate-bet-rebate-record/${id}?_method=PUT`, Method.POST, adjust, ContentType.form);
};

export const adjustBetAmount = (id, adjust) => {
  return https().request(`/affiliate-bet-rebate-record/bet/${id}?_method=PUT`, Method.POST, adjust, ContentType.form);
};

export const distribute = (rebate) => {
  return https().request("/affiliate-bet-rebate-record/rebate", Method.POST, rebate, ContentType.form);
};

export const batchDistribute = (ids) => {
  return https().request("/affiliate-bet-rebate-record/selective-rebate", Method.POST, { ids: ids }, ContentType.form);
};
