import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getMemberEditLogList = (memberEditLog) => {
  return https().request("/member-edit-log", Method.GET, memberEditLog, ContentType.form);
};

export const preCheckForCreate = (memberMainInfo) => {
  return https().request("/member-edit-log/check", Method.POST, memberMainInfo, ContentType.json);
};

export const createMemberEditLog = (memberEditLog) => {
  return https().request("/member-edit-log/create", Method.POST, memberEditLog, ContentType.json);
};

export const check = (id, site) => {
  return https().request("/member-edit-log/checked/" + id + "/" + site, Method.POST);
};
