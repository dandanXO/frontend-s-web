import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getWithdrawReport = (data) => {
  return https().request("/report/withdrawReportList", Method.GET, data, ContentType.form);
};

export const getDailyReport = (data) => {
  return https().request("/report/dailyWithdrawReport", Method.GET, data, ContentType.form);
};
