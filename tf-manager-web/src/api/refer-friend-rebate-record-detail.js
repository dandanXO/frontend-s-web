import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getReferFriendRebateRecordDetails = (query) => {
  return https().request("/refer-rebate-record-detail", Method.GET, query, ContentType.form);
};
