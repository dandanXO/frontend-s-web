import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getDepositRecords = (id, query) => {
  return https().request(`/affiliateDepositRecord/${id}`, Method.GET, query, ContentType.form);
};

export const getMemberDepositRecords = (id, query) => {
  return https().request(`/affiliateDepositRecord/${id}/member`, Method.GET, query, ContentType.form);
};

export const getTotal = (id, query) => {
  return https().request(`/affiliateDepositRecord/${id}/total`, Method.GET, query, ContentType.form);
};
