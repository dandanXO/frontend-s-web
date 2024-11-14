import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getEditRecord = (query) => {
  return https().request("/ratio-edit-record", Method.GET, query, ContentType.form);
};
