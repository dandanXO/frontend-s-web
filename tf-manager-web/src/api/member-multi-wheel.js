import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getMemberMultiWheel = (query) => {
  return https().request("/member-multi-wheel", Method.GET, query, ContentType.form);
};

export const deleteMemberMultiWheel = (ids) => {
  return https().request("/member-multi-wheel/delete?id=" + ids, Method.POST);
};

export const addMemberMultiWheel = (row) => {
  return https().request("/member-multi-wheel/add", Method.POST, row, ContentType.form);
};

export const getMemberMultiWheelSetting = (site) => {
  return https().request("/member-multi-wheel/setting?siteId=" + site, Method.GET);
};

export const editMemberMultiWheelSetting = (row, siteId) => {
  return https().request("/member-multi-wheel/edit?siteId=" + siteId, Method.POST, row, ContentType.form);
};

export const randomMember = (site) => {
  return https().request("/member-multi-wheel/random?siteId=" + site, Method.GET);
};
