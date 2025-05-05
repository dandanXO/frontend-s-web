import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getReferFriendRebateRecord = (query) => {
  return https().request("/refer-rebate-record", Method.GET, query, ContentType.form);
};

export const getTotal = (query) => {
  return https().request("/refer-rebate-record/total", Method.GET, query, ContentType.form);
};

export const adjustAmount = (id, adjust) => {
  return https().request(`/refer-rebate-record/${id}?_method=PUT`, Method.POST, adjust, ContentType.form);
};

export const distribute = (rebate) => {
  return https().request("/refer-rebate-record/rebate", Method.POST, rebate, ContentType.form);
};

export const getReferFriendRebatePointRecord = (query) => {
  return https().request("/refer-rebate-record/point_record", Method.GET, query, ContentType.form);
}
