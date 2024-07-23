import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getBetGameTypeRebateRecord = (query) => {
  return https().request("/bet-game-type-rebate-record", Method.GET, query, ContentType.form);
};

export const getBetGameTypeRebateRecordForExport = (query) => {
  return https().request("/bet-game-type-rebate-record/export", Method.GET, query, ContentType.form);
};

export const getTotal = (query) => {
  return https().request("/bet-game-type-rebate-record/total", Method.GET, query, ContentType.form);
};

export const adjustAmount = (id, adjust) => {
  return https().request(`/bet-game-type-rebate-record/${id}?_method=PUT`, Method.POST, adjust, ContentType.form);
};

export const adjustBetAmount = (id, adjust) => {
  return https().request(`/bet-game-type-rebate-record/bet/${id}?_method=PUT`, Method.POST, adjust, ContentType.form);
};

export const distribute = (rebate) => {
  return https().request("/bet-game-type-rebate-record/rebate", Method.POST, rebate, ContentType.form);
};

export const batchCancel = (records) => {
  return https(5 * 60 * 1000).request("/bet-game-type-rebate-record/batchCancel", Method.POST, { records: JSON.stringify(records) }, ContentType.form);
};

export const cancelByQuery = (rebate) => {
  return https().request("/bet-game-type-rebate-record/cancelByQuery?_method=PUT", Method.POST, rebate, ContentType.form);
};
