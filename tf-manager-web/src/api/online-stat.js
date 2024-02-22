import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getOnlineStats = (siteId, start, end) => {
  return https().request(`/online-statistics`, Method.GET, { siteId: siteId, startDate: start, endDate: end }, ContentType.form);
};

export const getCompareOnlineStats = (siteId, recordTime, days) => {
  return https().request(`/online-statistics/comparison`, Method.GET, { siteId: siteId, recordTime: recordTime, compareDays: days }, ContentType.form);
};
