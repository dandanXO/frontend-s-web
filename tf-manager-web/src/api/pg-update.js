import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const updatePending = async (updateBet) => {
  return https().request("/pg-update", Method.POST, updateBet, ContentType.form);
};

export const getPending = (query) => {
  return https().request("/pg-update", Method.GET, query, ContentType.form);
};
