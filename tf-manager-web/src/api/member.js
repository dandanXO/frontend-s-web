import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getMembers = (members) => {
  return https().request("/member", Method.GET, members, ContentType.form);
};

export const getMemberDetails = (id, site) => {
  return https().request(`/member/${id}/${site}`, Method.GET, {}, ContentType.form);
};

export const getMemberLoginRecord = (query) => {
  return https().request(`/member/loginRecord`, Method.GET, query, ContentType.form);
};

export const getMemberTransactionRecord = (query) => {
  return https().request(`/member/transactionRecord`, Method.GET, query, ContentType.form);
};

export const getMemberRemark = (id, query) => {
  return https().request(`/member/${id}/memberRemark`, Method.GET, query, ContentType.form);
};

export const registerMember = (member) => {
  return https().request("/member/registration", Method.POST, member, ContentType.form);
};

export const distributePromotion = (promo) => {
  return https().request("/member/promo", Method.POST, promo, ContentType.form);
};

export const updatePassword = (id, password) => {
  return https().request(`/member/${id}/password?_method=PUT`, Method.POST, { password: password }, ContentType.form);
};

export const freezeMember = (id, member) => {
  return https().request(`/member/${id}/freeze?_method=PUT`, Method.POST, member, ContentType.form);
};

export const normalMember = (id, siteId) => {
  return https().request(`/member/${id}/normal?_method=PUT`, Method.POST, { siteId: siteId }, ContentType.form);
};

export const updateVip = (id, vipId) => {
  return https().request(`/member/${id}/vipId?_method=PUT`, Method.POST, { vipId: vipId }, ContentType.form);
};

export const updateFinancial = (id, financialId) => {
  return https().request(`/member/${id}/financialId?_method=PUT`, Method.POST, { financialId: financialId }, ContentType.form);
};

export const updateRisk = (id, riskId) => {
  return https().request(`/member/${id}/riskId?_method=PUT`, Method.POST, { riskId: riskId }, ContentType.form);
};

export const addMemberRemark = (remark) => {
  return https().request("/member/remark", Method.POST, remark, ContentType.form);
};

export const editMemberRemark = (id, remark) => {
  return https().request(`/member/remark/${id}?_method=PUT`, Method.POST, { remark: remark }, ContentType.form);
};

export const deleteMemberRemark = (id) => {
  return https().request(`/member/remark/${id}`, Method.DELETE, ContentType.form);
};

export const getMemberNameList = (siteId) => {
  return https().request(`/member/nameList/${siteId}`, Method.GET, siteId, ContentType.form);
};

export const getMemberPrivilegeRecord = (id, query) => {
  return https().request(`/member/${id}/memberPrivilegeRecord`, Method.GET, query, ContentType.form);
};

export const getMemberMoneyChangeList = (id, query) => {
  return https().request(`/member/${id}/memberMoneyChange`, Method.GET, query, ContentType.form);
};

export const getMemberDepositRecord = (id, query) => {
  return https().request(`/member/${id}/depositRecord`, Method.GET, query, ContentType.form);
};

export const getMemberDepositRecordTotalAmount = (id, query) => {
  return https().request(`/member/${id}/depositRecordTotalAmount`, Method.GET, query, ContentType.form);
};

export const getMemberWithdrawRecord = (id, query) => {
  return https().request(`/member/${id}/withdrawRecord`, Method.GET, query, ContentType.form);
};

export const getMemberWithdrawRecordTotalAmount = (id, query) => {
  return https().request(`/member/${id}/withdrawRecordTotalAmount`, Method.GET, query, ContentType.form);
};

export const getMemberTransferRecord = (id, query) => {
  return https().request(`/member/${id}/transferRecord`, Method.GET, query, ContentType.form);
};

export const getMemberBank = (id, query) => {
  return https().request(`/member/${id}/memberBankCard`, Method.GET, query, ContentType.form);
};

export const getMemberBankLog = (id, query) => {
  return https().request(`/member/${id}/memberBankCardRecord`, Method.GET, query, ContentType.form);
};

export const getMemberListBySiteId = (siteId) => {
  return https().request("/member/memberList", Method.GET, { siteId: siteId }, ContentType.form);
};

export const findIdByLoginName = (loginName, sid) => {
  return https().request("/member/loginName", Method.GET, { loginName: loginName, siteId: sid }, ContentType.form);
};

export const getPlatformBalance = (id, platformCode, siteId) => {
  return https().request(`/member/${id}/getBalance`, Method.GET, { platformCode: platformCode, siteId: siteId }, ContentType.form);
};

export const platformFundTransfer = (id, transfer) => {
  return https().request(`/member/${id}/platform-fund-transfer`, Method.POST, transfer, ContentType.form);
};

export const getMemberBalance = (id) => {
  return https().request(`/member/${id}/getMemberBalance`, Method.GET);
};

export const getMemberRealName = (id, siteId) => {
  return https().request(`/member/${id}/unmaskRealName?siteId=${siteId}`, Method.GET);
};

export const getMemberEmail = (id, siteId) => {
  return https().request(`/member/${id}/unmaskEmail?siteId=${siteId}`, Method.GET);
};

export const getMemberTelephone = (id, siteId) => {
  return https().request(`/member/${id}/unmaskTelephone?siteId=${siteId}`, Method.GET);
};

export const getMemberReferFriend = (query) => {
  return https().request(`/member/referFriend`, Method.GET, query, ContentType.form);
};

export const getAffiliateInfo = (id, siteId) => {
  return https().request(`/member/${id}/affiliate?siteId=${siteId}`, Method.GET);
};

export const getMemberBalanceByLoginNameSite = (loginName, siteId) => {
  return https().request(`/member/getMemberBalanceByLoginNameSite`, Method.GET, { loginName: loginName, siteId: siteId }, ContentType.form);
};

export const updateMemberType = (id, memberType, siteId) => {
  return https().request(`/member/${id}/memberType?_method=PUT`, Method.POST, { memberType: memberType, siteId: siteId }, ContentType.form);
};
