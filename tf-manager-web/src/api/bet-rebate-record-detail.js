import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getBetRebateRecordDetails = (query) => {
  return https().request("/bet-rebate-record-detail", Method.GET, query, ContentType.form);
};
