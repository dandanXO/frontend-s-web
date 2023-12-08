import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const transferToMember = (id, transfer) => {
  return https().request(`/transfer/${id}`, Method.POST, transfer, ContentType.form);
};

export const getTransferRecords = (id, query) => {
  return https().request(`/transfer/${id}`, Method.GET, query, ContentType.form);
};

export const getTotal = (id, query) => {
  return https().request(`/transfer/${id}/total`, Method.GET, query, ContentType.form);
};
