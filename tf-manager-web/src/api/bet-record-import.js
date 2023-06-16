import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const createBatchBetRecord = (betRecords) => {
  return https(5 * 60 * 1000).request("/betRecordImport/createBatch", Method.POST, { betRecords: JSON.stringify(betRecords) }, ContentType.form);
};

export const getBetRecordImport = (betRecords) => {
  return https().request("/betRecordImport", Method.GET, betRecords, ContentType.form);
};
