import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const registerAffiliate = (affiliate) => {
  return https().request("/affiliate/registration", Method.POST, affiliate, ContentType.form);
};

export const getAffiliates = (query) => {
  return https().request("/affiliate", Method.GET, query, ContentType.form);
};

export const getParentAffiliates = (query) => {
  return https().request("/affiliate/parent", Method.GET, query, ContentType.form);
};

export const getAffiliatesForExport = (query) => {
  return https().request("/affiliate/export", Method.GET, query, ContentType.form);
};

export const getAffiliateDownline = (id, query) => {
  return https().request(`/affiliate/${id}/downline`, Method.GET, query, ContentType.form);
};

export const getAffiliateChild = (id) => {
  return https().request(`/affiliate/${id}/affiliateChild`, Method.GET);
};

export const getAffiliateDetails = (id, site) => {
  return https().request(`/affiliate/${id}`, Method.GET, { siteId: site }, ContentType.form);
};

export const approveAffiliate = (id, approveBy) => {
  return https().request(`/affiliate/${id}/approve?_method=PUT`, Method.POST, { approveBy: approveBy }, ContentType.form);
};

export const disableAffiliate = (id, member) => {
  return https().request(`/affiliate/${id}/disable?_method=PUT`, Method.POST, member, ContentType.form);
};

export const listApproveAffiliate = (id, approveBy) => {
  return https().request(`/affiliate/${id}/listApprove?_method=PUT`, Method.POST, { approveBy: approveBy }, ContentType.form);
};

export const listDisableAffiliate = (id, member) => {
  return https().request(`/affiliate/${id}/listDisable?_method=PUT`, Method.POST, member, ContentType.form);
};

export const updateCommissionModel = (id, model) => {
  return https().request(`/affiliate/${id}/commissionModel?_method=PUT`, Method.POST, { model: model }, ContentType.form);
};

export const updateCommissionRate = (id, commission) => {
  return https().request(`/affiliate/${id}/commission?_method=PUT`, Method.POST, { commission: commission }, ContentType.form);
};

export const updateAffiliatePassword = (id, password, site) => {
  return https().request(`/affiliate/${id}/password?_method=PUT`, Method.POST, { password: password, site: site }, ContentType.form);
};

export const updateAffiliateFinancial = (id, financialId, site) => {
  return https().request(`/affiliate/${id}/financialId?_method=PUT`, Method.POST, { financialId: financialId, site: site }, ContentType.form);
};

export const updateTimeType = (id, timeType) => {
  return https().request(`/affiliate/${id}/timeType?_method=PUT`, Method.POST, { timeType: timeType }, ContentType.form);
};

export const getAffiliateRemark = (id, query) => {
  return https().request(`/affiliate/${id}/memberRemark`, Method.GET, query, ContentType.form);
};

export const addAffiliateRemark = (remark) => {
  return https().request("/affiliate/remark", Method.POST, remark, ContentType.form);
};

export const editAffiliateRemark = (id, remark) => {
  return https().request(`/affiliate/remark/${id}?_method=PUT`, Method.POST, { remark: remark }, ContentType.form);
};

export const deleteAffiliateRemark = (id) => {
  return https().request(`/affiliate/remark/${id}`, Method.DELETE, ContentType.form);
};
