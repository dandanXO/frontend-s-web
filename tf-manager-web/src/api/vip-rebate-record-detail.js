import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getVipRebateRecordDetails = (query) => {
  return https().request("/vip-rebate-record-detail", Method.GET, query, ContentType.form);
};
