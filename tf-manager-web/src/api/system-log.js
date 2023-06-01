import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getSystemLog = (systemLog) => {
  return https().request("/system-log", Method.GET, systemLog, ContentType.json);
};
