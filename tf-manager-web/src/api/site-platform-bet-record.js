import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getBetRecords = (form) => {
  return https().request("/site-platform-bet-record", Method.GET, form, ContentType.form);
};

export const exportBetRecords = (form) => {
  return https().request("/site-platform-bet-record/export", Method.GET, form, ContentType.form);
};
