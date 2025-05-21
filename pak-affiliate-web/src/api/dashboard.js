import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getDashboardData = (query) => {
  return https().request('/affiliate-dashboard/data', Method.GET, query, ContentType.form);
};

export const getDashboardDataByMonth = (query) => {
  return https().request('/affiliate-dashboard/data-by-month', Method.GET, query, ContentType.form);
};
