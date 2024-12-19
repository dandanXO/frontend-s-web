import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getIDVerificationList = (query) => {
  return https().request("/idVerification", Method.GET, query, ContentType.form);
};

export const updateVerificationStatus = (record) => {
  return https().request(`/idVerification/${record.id}?_method=PUT`, Method.POST, record, ContentType.form);
};
