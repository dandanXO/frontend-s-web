import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getVipWheelParam = (siteId) => {
  return https().request("/vipWheel", Method.GET, { siteId: siteId }, ContentType.form);
};

export const updateVipWheelParam = (siteId, param) => {
  return https().request(`/vipWheel?_method=PUT`, Method.POST, { siteId: siteId, param: param }, ContentType.form);
};

export const getVipWheelRecords = (vipWheel) => {
  return https().request("/vipWheel/records", Method.GET, vipWheel, ContentType.form);
};

export const getSiteWithPromo = () => {
  return https().request("/vipWheel/sites", Method.GET);
}
