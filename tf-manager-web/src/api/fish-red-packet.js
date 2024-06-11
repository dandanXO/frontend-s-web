import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getFishRedPacketParam = (siteId) => {
  return https().request("/fish-red-packet", Method.GET, { siteId: siteId }, ContentType.form);
};

export const updateFishRedPacketParam = (siteId, param) => {
  return https().request(`/fish-red-packet?_method=PUT`, Method.POST, { siteId: siteId, param: param }, ContentType.form);
};

export const getSiteWithPromo = () => {
  return https().request("/fish-red-packet/sites", Method.GET);
}
