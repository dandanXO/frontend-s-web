import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getDepositReport = (data) => {
  return https().request("/report/depositReportList", Method.GET, data, ContentType.form);
};

export const getDailyReport = (data) => {
  return https().request("/report/dailyDepositReport", Method.GET, data, ContentType.form);
};

export const getTotalDeposit = (data) => {
  return https().request("/report/totalDepositReport", Method.GET, data, ContentType.form);
};
