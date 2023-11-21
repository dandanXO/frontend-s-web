import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getRedPacketRains = (query) => {
  return https().request("/privilege/red-packet-rain", Method.GET, query, ContentType.form);
};
