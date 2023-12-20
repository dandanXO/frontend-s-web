import https from "@/utils/https";
import { Method } from "axios-mapper";

export const callTelephone = (id, site) => {
  return https().request("/member/callTelephone?id=" + id + "&site=" + site, Method.GET);
};

export const stopTelephone = (id, site) => {
  return https().request("/member/stopTelephone?id=" + id + "&site=" + site, Method.GET);
};

export const getNetPhone = () => {
  return https().request("/member/allVCall", Method.GET);
};
