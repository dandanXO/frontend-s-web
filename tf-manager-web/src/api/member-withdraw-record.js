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

export const getMemberWithdrawRecordEwalltPay = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord/getEwalltPay", Method.GET, memberWithdrawRecord, ContentType.form);
};

export const getAffiliateWithdrawRecordCryptoPay = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord/getAffiliateCryptoPay", Method.GET, memberWithdrawRecord, ContentType.form);
};

export const getAffiliateWithdrawRecordEwalltPay = (memberWithdrawRecord) => {
  return https().request("/memberWithdrawRecord/getAffiliateEwalltPay", Method.GET, memberWithdrawRecord, ContentType.form);
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

export const fromApplyToChecking = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/applyToChecking?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromAffiliateApplyToChecking = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/affiliateApplyToChecking?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromApplyToPending = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/applyToPending?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromAffiliateApplyToPending = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/affiliateApplyToPending?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromPendingToApply = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/pendingToApply?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromAffiliatePendingToApply = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/affiliatePendingToApply?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromCheckingToApply = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/checkingToApply?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromAffiliateCheckingToApply = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/affiliateCheckingToApply?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromCheckingToBeforePaid = (id, wd) => {
  return https().request(`/memberWithdrawRecord/${id}/checkingToBeforePaid?_method=PUT`, Method.POST, { withdrawDate: wd }, ContentType.form);
};

export const fromAffiliateCheckingToBeforePaid = (id, wd) => {
  return https().request(`/memberWithdrawRecord/${id}/affiliateCheckingToBeforePaid?_method=PUT`, Method.POST, { withdrawDate: wd }, ContentType.form);
};

export const fromCheckingToFail = (id, cancelType, remark, wd) => {
  return https().request(`/memberWithdrawRecord/${id}/checkingToFail?_method=PUT`, Method.POST, { cancelType: cancelType, remark: remark, withdrawDate: wd }, ContentType.form);
};

export const fromAffiliateCheckingToFail = (id, cancelType, remark, wd) => {
  return https().request(`/memberWithdrawRecord/${id}/affiliateCheckingToFail?_method=PUT`, Method.POST, { cancelType: cancelType, remark: remark, withdrawDate: wd }, ContentType.form);
};

export const fromToFail = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/toFail?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromToConfirm = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/toConfirm?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromAffiliateToFail = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/affiliateToFail?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromAffiliateToConfirm = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/affiliateToConfirm?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromBeforePaidToPay = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/beforePaidToPay?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromAffiliateBeforePaidToPay = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/affiliateBeforePaidToPay?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromPayToBeforePaid = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/payToBeforePaid?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromAffiliatePayToBeforePaid = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/affiliatePayToBeforePaid?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromPayToSuccess = (id, paymentCard, wd) => {
  return https().request(`/memberWithdrawRecord/${id}/payToSuccess?_method=PUT`, Method.POST, { paymentCard: paymentCard, withdrawDate: wd }, ContentType.form);
};

export const fromAffiliatePayToSuccess = (id, paymentCard, wd) => {
  return https().request(`/memberWithdrawRecord/${id}/affiliatePayToSuccess?_method=PUT`, Method.POST, { paymentCard: paymentCard, withdrawDate: wd }, ContentType.form);
};

export const fromPayToFail = (id, cancelType, remark, wd) => {
  return https().request(`/memberWithdrawRecord/${id}/payToFail?_method=PUT`, Method.POST, { cancelType: cancelType, remark: remark, withdrawDate: wd }, ContentType.form);
};

export const fromAffiliatePayToFail = (id, cancelType, remark, wd) => {
  return https().request(`/memberWithdrawRecord/${id}/affiliatePayToFail?_method=PUT`, Method.POST, { cancelType: cancelType, remark: remark, withdrawDate: wd }, ContentType.form);
};

export const fromPayToAutopay = (id, withdrawPlatformId, wd) => {
  return https().request(`/memberWithdrawRecord/${id}/payToAutopay?_method=PUT`, Method.POST, { withdrawPlatformId: withdrawPlatformId, withdrawDate: wd }, ContentType.form);
};

export const fromAffiliatePayToAutopay = (id, withdrawPlatformId, wd) => {
  return https().request(`/memberWithdrawRecord/${id}/affiliatePayToAutopay?_method=PUT`, Method.POST, { withdrawPlatformId: withdrawPlatformId, withdrawDate: wd }, ContentType.form);
};

export const fromAutopayToPay = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/autopayToPay?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromAffiliateAutopayToPay = async (ids) => {
  await https().httpClient.post('/memberWithdrawRecord/affiliateAutopayToPay?_method=PUT', JSON.stringify(ids), { headers: { "Content-Type": "application/json" } });
};

export const fromAutopayToFail = (id, cancelType, remark, wd) => {
  return https().request(`/memberWithdrawRecord/${id}/autopayToFail?_method=PUT`, Method.POST, { cancelType: cancelType, remark: remark, withdrawDate: wd }, ContentType.form);
};

export const fromAffiliateAutopayToFail = (id, cancelType, remark, wd) => {
  return https().request(`/memberWithdrawRecord/${id}/affiliateAutopayToFail?_method=PUT`, Method.POST, { cancelType: cancelType, remark: remark, withdrawDate: wd }, ContentType.form);
};

export const fromAutopayToSuccess = (id, wd) => {
  return https().request(`/memberWithdrawRecord/${id}/autopayToSuccess?_method=PUT`, Method.POST, { withdrawDate: wd }, ContentType.form);
};

export const fromAffiliateAutopayToSuccess = (id, wd) => {
  return https().request(`/memberWithdrawRecord/${id}/affiliateAutopayToSuccess?_method=PUT`, Method.POST, { withdrawDate: wd }, ContentType.form);
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

export const getWithdrawPlatformList = (id, wd) => {
  return https().request("/memberWithdrawRecord/getAutoPay", Method.GET, { id: id, withdrawDate: wd }, ContentType.form);
};

export const getExportWithdrawRecord = (query) => {
  return https().request("/memberWithdrawRecord/exportWithdraw", Method.GET, query, ContentType.form);
};

export const getExportAffiliateWithdrawRecord = (query) => {
  return https().request("/memberWithdrawRecord/exportAffiliateWithdraw", Method.GET, query, ContentType.form);
};
