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

export const getRedPacketRain = (query, id) => {
  return https().request("/privilege/red-packet-rain/list?privilegeId=" + id, Method.GET, query, ContentType.form);
};

export const deleteRedPacketRain = (ids, id) => {
  return https().request("/privilege/red-packet-rain/delete?id=" + ids + "&privilegeId=" + id, Method.POST);
};

export const addRedPacketRain = (row, id) => {
  return https().request("/privilege/red-packet-rain/add?privilegeId=" + id, Method.POST, row, ContentType.form);
};

export const randomMember = (id) => {
  return https().request("/privilege/red-packet-rain/random?privilegeId=" + id, Method.GET);
};
