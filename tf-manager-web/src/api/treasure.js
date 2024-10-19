import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getTreasureClaimRecord = (query) => {
  return https().request("/treasure", Method.GET, query, ContentType.form);
};

export const getTreasureKeyRecord = (query) => {
  return https().request("/treasure/key", Method.GET, query, ContentType.form);
};

export const getTreasureCheckInRecord = (query) => {
  return https().request("/treasure/check-in", Method.GET, query, ContentType.form);
};
