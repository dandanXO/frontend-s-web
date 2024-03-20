import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getBetWheelParam = (siteId) => {
  return https().request("/betWheel", Method.GET, { siteId: siteId }, ContentType.form);
};

export const updateBetWheelParam = (siteId, param) => {
  return https().request(`/betWheel?_method=PUT`, Method.POST, { siteId: siteId, param: param }, ContentType.form);
};

export const getBetWheelRecords = (betWheel) => {
  return https().request("/betWheel/records", Method.GET, betWheel, ContentType.form);
};

export const getSiteWithPromo = () => {
  return https().request("/betWheel/sites", Method.GET);
}
