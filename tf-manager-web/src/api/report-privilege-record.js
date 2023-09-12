import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getPrivilegeRecord = (data) => {
  return https().request("/report/privilegeRecordReport", Method.GET, data, ContentType.form);
};

export const getTotalPrivilegeAmount = (data) => {
  return https().request("/report/getTotalPrivilegeAmount", Method.GET, data, ContentType.form);
};
