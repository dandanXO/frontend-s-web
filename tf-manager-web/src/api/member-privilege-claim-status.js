import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getmemberPrivilegeClaimStatusRecord = (query) => {
  return https().request("/member-privilege-claim-status", Method.GET, query, ContentType.form);
};
