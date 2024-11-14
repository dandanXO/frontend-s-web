import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getMemberPointRecordList = (query) => {
  return https().request("/member-point", Method.GET, query, ContentType.form);
};

export const addMemberPointRecord = (form) => {
  return https().request('/member-point', Method.POST, form, ContentType.form);
};

export const getAffiliatePointRecordList = (query) => {
  return https().request("/member-point/affiliate", Method.GET, query, ContentType.form);
};

export const addAffiliatePointRecord = (form) => {
  return https().request('/member-point/affiliate', Method.POST, form, ContentType.form);
};
