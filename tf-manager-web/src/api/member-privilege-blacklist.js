import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getBlacklist = (blacklist) => {
  return https().request("/privilegeBlacklist", Method.GET, blacklist, ContentType.form);
};

export const createBlacklist = (blacklist) => {
  return https().request("/privilegeBlacklist", Method.POST, blacklist, ContentType.form);
};

export const createBatchBlacklist = (blacklist) => {
  return https(5 * 60 * 1000).request("/privilegeBlacklist/createBatch", Method.POST, { privilegeBlacklists: JSON.stringify(blacklist) }, ContentType.form);
};

export const deleteBlacklist = (ids) => {
  return https().request(`/privilegeBlacklist?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const getExportMemberPrivilegeBlacklist = (query) => {
  return https().request("/privilegeBlacklist/export", Method.GET, query, ContentType.form);
};
