import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getMemberDepositRecords = (id, query) => {
  return https().request(`/affiliateDepositRecord/${id}`, Method.GET, query, ContentType.form);
};
