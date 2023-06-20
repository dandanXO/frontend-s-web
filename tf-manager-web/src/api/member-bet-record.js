import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getMemberBetRecords = (query) => {
  return https().request("/memberBetRecord", Method.GET, query, ContentType.form);
};

// export const getMemberBetRecordsTotal = (query) => {
//   return https().request("/memberBetRecord/total", Method.GET, query, ContentType.form);
// };

// export const getMemberBetRecordsTotalRecord = (query) => {
//   return https().request("/memberBetRecord/totalRecord", Method.GET, query, ContentType.form);
// };

export const getExport = (query) => {
  return https().request("/memberBetRecord/export", Method.GET, query, ContentType.form);
};
