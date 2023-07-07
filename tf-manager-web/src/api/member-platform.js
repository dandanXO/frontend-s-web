import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getMemberPlatformList = (query) => {
  return https().request("/member-platform", Method.GET, query, ContentType.form);
};

export const getPlatformList = (query) => {
  return https().request("/member-platform/platform-list", Method.GET, query, ContentType.form);
};

export const manualRegister = (row) => {
  return https().request("/member-platform/manual", Method.GET, row, ContentType.form);
};

export const deleteMemberPlatform = (ids) => {
  return https().request(`/member-platform?_method=DELETE`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const updatePassword = (row) => {
  return https().request("/member-platform/updatePassword", Method.GET, row, ContentType.form);
};
