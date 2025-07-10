import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getReferWheelSpins = (query) => {
  return https().request("/member-refer-wheel-spin", Method.GET, query, ContentType.form);
};

export const getDetails = (query) => {
  return https().request("/member-refer-wheel-spin/details", Method.GET, query, ContentType.form);
};
