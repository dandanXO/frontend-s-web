import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getFreezeRecords = (site) => {
  return https().request("/freeze", Method.GET, site, ContentType.form);
};

export const getExportMemberFreeze = (query) => {
  return https().request("/freeze/export", Method.GET, query, ContentType.form);
};
