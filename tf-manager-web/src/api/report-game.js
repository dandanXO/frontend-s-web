import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getGameReport = (data) => {
  return https().request("/report/gameReportList", Method.GET, data, ContentType.form);
};

export const getGameReportList = (data) => {
  return https().request("/report/gameReportAll", Method.GET, data, ContentType.form);
};

export const getDailyReport = (data) => {
  return https().request("/report/dailyGameReport", Method.GET, data, ContentType.form);
};

export const getExportReport = (data) => {
  return https().request("/report/requestGameReportExport", Method.GET, data, ContentType.form);
};
