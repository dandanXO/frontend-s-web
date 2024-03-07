import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getExportList = (query) => {
  return https().request("downloadManager/list", Method.GET, query, ContentType.form);
};

export const deleteDownloadUrl = (id) => {
  return https().request(`downloadManager/${id}?_method=DELETE`, Method.POST);
};
