import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getAffiliateBetRebateRecordDetail = (query) => {
  return https().request("/affiliate-bet-rebate-record-detail", Method.GET, query, ContentType.form);
};
