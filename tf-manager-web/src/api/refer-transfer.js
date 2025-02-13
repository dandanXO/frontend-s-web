import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getReferTransferRecords = (query) => {
  return https().request("/refer-transfer-record", Method.GET, query, ContentType.form);
};
