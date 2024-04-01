import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getIpLocation = (ip) => {
  return https().request("/util/ip", Method.GET, { ip: ip }, ContentType.form);
};
