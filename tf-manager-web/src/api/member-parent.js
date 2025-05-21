import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getExport = (query) => {
  return https().request("/member-parent/export", Method.GET, query, ContentType.form);
};
