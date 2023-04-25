import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getMemberWithdrawRecordApply = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord/getApply", Method.GET, memberWithdrawRecord, ContentType.form);
};

export const getAffiliateWithdrawRecordApply = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord/getAffiliateApply", Method.GET, memberWithdrawRecord, ContentType.form);
};

export const getMemberWithdrawRecordPending = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord/getPending", Method.GET, memberWithdrawRecord, ContentType.form);
};

export const getAffiliateWithdrawRecordPending = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord/getAffiliatePending", Method.GET, memberWithdrawRecord, ContentType.form);
};

export const getMemberWithdrawRecordChecking = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord/getChecking", Method.GET, memberWithdrawRecord, ContentType.form);
};

export const getAffiliateWithdrawRecordChecking = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord/getAffiliateChecking", Method.GET, memberWithdrawRecord, ContentType.form);
};

export const getMemberWithdrawRecordBeforePaid = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord/getBeforePaid", Method.GET, memberWithdrawRecord, ContentType.form);
};

export const getAffiliateWithdrawRecordBeforePaid = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord/getAffiliateBeforePaid", Method.GET, memberWithdrawRecord, ContentType.form);
};

export const getMemberWithdrawRecordPay = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord/getPay", Method.GET, memberWithdrawRecord, ContentType.form);
};

export const getMemberWithdrawRecordCryptoPay = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord/getCryptoPay", Method.GET, memberWithdrawRecord, ContentType.form);
};

export const getAffiliateWithdrawRecordCryptoPay = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord/getAffiliateCryptoPay", Method.GET, memberWithdrawRecord, ContentType.form);
};

export const getAffiliateWithdrawRecordPay = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord/getAffiliatePay", Method.GET, memberWithdrawRecord, ContentType.form);
};

export const getMemberWithdrawRecordAutopay = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord/getAutopay", Method.GET, memberWithdrawRecord, ContentType.form);
};

export const getAffiliateWithdrawRecordAutopay = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord/getAffiliateAutopay", Method.GET, memberWithdrawRecord, ContentType.form);
};

export const fromApplyToChecking = (ids) => {
  return https().request(`/memberWithdrawRecord/applyToChecking?_method=PUT`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const fromAffiliateApplyToChecking = (ids) => {
  return https().request(`/memberWithdrawRecord/affiliateApplyToChecking?_method=PUT`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const fromApplyToPending = (ids) => {
  return https().request(`/memberWithdrawRecord/applyToPending?_method=PUT`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const fromAffiliateApplyToPending = (ids) => {
  return https().request(`/memberWithdrawRecord/affiliateApplyToPending?_method=PUT`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const fromPendingToApply = (ids) => {
  return https().request(`/memberWithdrawRecord/pendingToApply?_method=PUT`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const fromAffiliatePendingToApply = (ids) => {
  return https().request(`/memberWithdrawRecord/affiliatePendingToApply?_method=PUT`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const fromCheckingToApply = (ids) => {
  return https().request(`/memberWithdrawRecord/checkingToApply?_method=PUT`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const fromAffiliateCheckingToApply = (ids) => {
  return https().request(`/memberWithdrawRecord/affiliateCheckingToApply?_method=PUT`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const fromCheckingToBeforePaid = (id) => {
  return https().request(`/memberWithdrawRecord/${id}/checkingToBeforePaid?_method=PUT`, Method.POST, {}, ContentType.form);
};

export const fromAffiliateCheckingToBeforePaid = (id) => {
  return https().request(`/memberWithdrawRecord/${id}/affiliateCheckingToBeforePaid?_method=PUT`, Method.POST, {}, ContentType.form);
};

export const fromCheckingToFail = (id, cancelType, remark) => {
  return https().request(`/memberWithdrawRecord/${id}/checkingToFail?_method=PUT`, Method.POST, { cancelType: cancelType, remark: remark }, ContentType.form);
};

export const fromAffiliateCheckingToFail = (id, cancelType, remark) => {
  return https().request(`/memberWithdrawRecord/${id}/affiliateCheckingToFail?_method=PUT`, Method.POST, { cancelType: cancelType, remark: remark }, ContentType.form);
};

export const fromBeforePaidToPay = (ids) => {
  return https().request(`/memberWithdrawRecord/beforePaidToPay?_method=PUT`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const fromAffiliateBeforePaidToPay = (ids) => {
  return https().request(`/memberWithdrawRecord/affiliateBeforePaidToPay?_method=PUT`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const fromPayToBeforePaid = (ids) => {
  return https().request(`/memberWithdrawRecord/payToBeforePaid?_method=PUT`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const fromAffiliatePayToBeforePaid = (ids) => {
  return https().request(`/memberWithdrawRecord/affiliatePayToBeforePaid?_method=PUT`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const fromPayToSuccess = (id, paymentCard) => {
  return https().request(`/memberWithdrawRecord/${id}/payToSuccess?_method=PUT`, Method.POST, { paymentCard: paymentCard }, ContentType.form);
};

export const fromAffiliatePayToSuccess = (id, paymentCard) => {
  return https().request(`/memberWithdrawRecord/${id}/affiliatePayToSuccess?_method=PUT`, Method.POST, { paymentCard: paymentCard }, ContentType.form);
};

export const fromPayToFail = (id, cancelType, remark) => {
  return https().request(`/memberWithdrawRecord/${id}/payToFail?_method=PUT`, Method.POST, { cancelType: cancelType, remark: remark }, ContentType.form);
};

export const fromAffiliatePayToFail = (id, cancelType, remark) => {
  return https().request(`/memberWithdrawRecord/${id}/affiliatePayToFail?_method=PUT`, Method.POST, { cancelType: cancelType, remark: remark }, ContentType.form);
};

export const fromPayToAutopay = (id, withdrawPlatformId) => {
  return https().request(`/memberWithdrawRecord/${id}/payToAutopay?_method=PUT`, Method.POST, { withdrawPlatformId: withdrawPlatformId }, ContentType.form);
};

export const fromAffiliatePayToAutopay = (id, withdrawPlatformId) => {
  return https().request(`/memberWithdrawRecord/${id}/affiliatePayToAutopay?_method=PUT`, Method.POST, { withdrawPlatformId: withdrawPlatformId }, ContentType.form);
};

export const fromAutopayToPay = (ids) => {
  return https().request(`/memberWithdrawRecord/autopayToPay?_method=PUT`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const fromAffiliateAutopayToPay = (ids) => {
  return https().request(`/memberWithdrawRecord/affiliateAutopayToPay?_method=PUT`, Method.POST, { ids: ids.join(",") }, ContentType.form);
};

export const fromAutopayToFail = (id, cancelType, remark) => {
  return https().request(`/memberWithdrawRecord/${id}/autopayToFail?_method=PUT`, Method.POST, { cancelType: cancelType, remark: remark }, ContentType.form);
};

export const fromAffiliateAutopayToFail = (id, cancelType, remark) => {
  return https().request(`/memberWithdrawRecord/${id}/affiliateAutopayToFail?_method=PUT`, Method.POST, { cancelType: cancelType, remark: remark }, ContentType.form);
};

export const getMemberWithdrawRecord = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord", Method.GET, memberWithdrawRecord, ContentType.form);
};

export const getTotalWithdrawAmountByStatus = (query) => {
  return https().request("/memberWithdrawRecord/totalWithdrawAmountByStatus", Method.GET, query, ContentType.form);
};

export const getTotalWithdrawAmount = (query) => {
  return https().request("/memberWithdrawRecord/totalWithdrawAmount", Method.GET, query, ContentType.form);
};

export const getWithdrawPlatformList = (id) => {
  return https().request("/memberWithdrawRecord/getAutoPay", Method.GET, { id: id }, ContentType.form);
};
