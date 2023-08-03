import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getFinanceReport = (data) => {
  return https().request("/report/getFinanceReport/", Method.GET, data, ContentType.json);
};

export const getSiteMemberReport = (data) => {
  return https().request("/report/getSiteMemberReport/", Method.GET, data, ContentType.json);
};
