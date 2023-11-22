import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getRedPacketRains = (query) => {
  return https().request("/privilege/red-packet-rain", Method.GET, query, ContentType.form);
};

export const createRedPacketRain = (rain) => {
  return https().request("/privilege/red-packet-rain", Method.POST, rain, ContentType.json);
};

export const updateRedPacketRain = (rain) => {
  return https().request("/privilege/red-packet-rain?_method=PUT", Method.POST, rain, ContentType.json);
};
