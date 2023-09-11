import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getPlatformGameReport = (data) => {
  return https().request("/report/platformGameReportList", Method.GET, data, ContentType.form);
};

export const getDailyReport = (data) => {
  return https().request("/report/dailyPlatformGameReport", Method.GET, data, ContentType.form);
};

export const getExportReport = (data) => {
  return https().request("/report/requestPlatformGameReportExport", Method.GET, data, ContentType.form);
};
