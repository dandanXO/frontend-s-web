import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getPrivilegeReport = (data) => {
  return https().request("/report/privilegeReportList", Method.GET, data, ContentType.form);
};

export const getDailyReport = (data) => {
  return https().request("/report/dailyPrivilegeReport", Method.GET, data, ContentType.form);
};

export const getTotalPrivilegeAmount = (data) => {
  return https().request("/report/getTotalPrivilegeReport", Method.GET, data, ContentType.form);
};
