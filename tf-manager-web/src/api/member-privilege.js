import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const distributePrivilege = (privilege) => {
  return https().request("/member-privilege/distribute", Method.POST, privilege, ContentType.form);
};

export const createBatchPrivilege = (memberPrivileges) => {
  return https(5 * 60 * 1000).request("/member-privilege/createBatch", Method.POST, { memberPrivileges: JSON.stringify(memberPrivileges) }, ContentType.form);
};
