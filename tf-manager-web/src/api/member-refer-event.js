import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getMemberReferRecord = (form) => {
  return https().request("/refer-friend/rebate", Method.GET, form, ContentType.form);
};

export const getMemberReferRewardRecord = (form) => {
  return https().request("/refer-friend-reward", Method.GET, form, ContentType.form);
};

export const getMemberReferParent = (form) => {
  return https().request("/refer-friend/parent", Method.GET, form, ContentType.form);
};

export const getMemberReferSummary = (form) => {
  return https().request("/refer-friend/summary", Method.GET, form, ContentType.form);
};

export const getPakMemberReferParent = (form) => {
  return https().request("/refer-friend/parent-pak", Method.GET, form, ContentType.form);
};

export const requestPakReferRecord = (query) => {
  return https().request("/refer-friend/requestPakReferExport", Method.GET, query, ContentType.form);
};

export const getPakMemberReferSummary = (form) => {
  return https().request("/refer-friend/summary-pak", Method.GET, form, ContentType.form);
};

export const changeMemberReferrer = (siteId, memberId, loginName) => {
  return https().request("/refer-friend/change-referrer?_method=PUT", Method.POST, { siteId: siteId, memberId: memberId, referrerLoginName: loginName }, ContentType.form);
}

export const batchUpdateFrozenMember = (members, siteId, remarks) => {
  return https(5 * 60 * 1000).request("/refer-friend/importFrozen", Method.POST, { siteId: siteId, memberFrozenList: JSON.stringify(members), remarks: remarks }, ContentType.form);
};

export const rejectRecord = (id, recordTime) => {
  return https().request("/refer-friend-reward/reject?_method=PUT", Method.POST, { id: id, recordTime: recordTime }, ContentType.form);
}

export const exportPakMemberReferSummaryBulk = (form) => {
  return https().request("/refer-friend/bulk-summary-pak-export", Method.GET, form, ContentType.form);
}

export const getPakMemberReferSummaryNew = (form) => {
  return https().request("/refer-friend/summary-pak-new", Method.GET, form, ContentType.form);
};

export const getPakMemberReferParentNew = (form) => {
  return https().request("/refer-friend/parent-pak-new", Method.GET, form, ContentType.form);
};
