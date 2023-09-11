import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getExportList = (query) => {
  return https().request("downloadManager/list", Method.GET, query, ContentType.form);
};
