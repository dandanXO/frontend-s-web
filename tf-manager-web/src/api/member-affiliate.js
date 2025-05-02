import { ContentType, Method } from 'axios-mapper'
import https from '../utils/https'

export const registerAffiliate = affiliate => {
  return https().request(
    '/affiliate/registration',
    Method.POST,
    affiliate,
    ContentType.form
  )
}

export const getAffiliates = query => {
  return https().request('/affiliate', Method.GET, query, ContentType.form)
}

export const getParentAffiliates = query => {
  return https().request(
    '/affiliate/parent',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getAffiliatesForExport = query => {
  return https().request(
    '/affiliate/export',
    Method.GET,
    query,
    ContentType.form
  )
}

export const getAffiliateDownline = (id, query) => {
  return https().request(
    `/affiliate/${id}/downline`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getAffiliateChild = id => {
  return https().request(`/affiliate/${id}/affiliateChild`, Method.GET)
}

export const getAffiliateDetails = (id, site) => {
  return https().request(
    `/affiliate/${id}`,
    Method.GET,
    { siteId: site },
    ContentType.form
  )
}

export const approveAffiliate = (id, approveBy) => {
  return https().request(
    `/affiliate/${id}/approve?_method=PUT`,
    Method.POST,
    { approveBy: approveBy },
    ContentType.form
  )
}

export const disableAffiliate = (id, member) => {
  return https().request(
    `/affiliate/${id}/disable?_method=PUT`,
    Method.POST,
    member,
    ContentType.form
  )
}

export const listApproveAffiliate = (id, approveBy) => {
  return https().request(
    `/affiliate/${id}/listApprove?_method=PUT`,
    Method.POST,
    { approveBy: approveBy },
    ContentType.form
  )
}

export const listDisableAffiliate = (id, member) => {
  return https().request(
    `/affiliate/${id}/listDisable?_method=PUT`,
    Method.POST,
    member,
    ContentType.form
  )
}

export const updateCommissionModel = (id, model, shareRatio) => {
  return https().request(
    `/affiliate/${id}/commissionModel?_method=PUT`,
    Method.POST,
    { model: model, shareRatio: shareRatio },
    ContentType.form
  )
}

export const updateCommissionRate = (id, commission) => {
  return https().request(
    `/affiliate/${id}/commission?_method=PUT`,
    Method.POST,
    { commission: commission },
    ContentType.form
  )
}

export const updatePaymentFeeRate = (id, fee) => {
  return https().request(
    `/affiliate/${id}/paymentFee?_method=PUT`,
    Method.POST,
    { paymentFee: fee },
    ContentType.form
  )
}

export const updatePlatformFeeRate = (id, fee) => {
  return https().request(
    `/affiliate/${id}/platformFee?_method=PUT`,
    Method.POST,
    { platformFee: fee },
    ContentType.form
  )
}

export const updateAffiliateAlias = (id, alias) => {
  return https().request(
    `/affiliate/${id}/alias?_method=PUT`,
    Method.POST,
    { alias: alias },
    ContentType.form
  )
}

export const updateAffiliatePassword = (id, password, site) => {
  return https().request(
    `/affiliate/${id}/password?_method=PUT`,
    Method.POST,
    { password: password, site: site },
    ContentType.form
  )
}

export const validPwd2GoogleKey = password => {
  return https().request(
    `/authority/user/validPwd2GoogleKey?_method=PUT`,
    Method.POST,
    { password: password },
    ContentType.form
  )
}

export const bindGoogleKey = code => {
  return https().request(
    `/authority/user/bindGoogleKey?_method=PUT`,
    Method.POST,
    { code: code },
    ContentType.form
  )
}

export const updateAffiliateFinancial = (id, financialId, site) => {
  return https().request(
    `/affiliate/${id}/financialId?_method=PUT`,
    Method.POST,
    { financialId: financialId, site: site },
    ContentType.form
  )
}

export const updateTimeType = (id, timeType) => {
  return https().request(
    `/affiliate/${id}/timeType?_method=PUT`,
    Method.POST,
    { timeType: timeType },
    ContentType.form
  )
}

export const updateBelongType = (id, belongType) => {
  return https().request(
    `/affiliate/${id}/belongType?_method=PUT`,
    Method.POST,
    { belongType: belongType },
    ContentType.form
  )
}

export const getAffiliateRemark = (id, query) => {
  return https().request(
    `/affiliate/${id}/memberRemark`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const addAffiliateRemark = remark => {
  return https().request(
    '/affiliate/remark',
    Method.POST,
    remark,
    ContentType.form
  )
}

export const editAffiliateRemark = (id, remark) => {
  return https().request(
    `/affiliate/remark/${id}?_method=PUT`,
    Method.POST,
    { remark: remark },
    ContentType.form
  )
}

export const deleteAffiliateRemark = id => {
  return https().request(
    `/affiliate/remark/${id}?_method=DELETE`,
    Method.POST,
    ContentType.form
  )
}

export const changeNewAffilaite = (id, code, memberType) => {
  return https().request(
    `/affiliate/${id}/changeAffiliate?_method=PUT`,
    Method.POST,
    { affiliateCode: code, memberType: memberType },
    ContentType.form
  )
}

export const getTransferRecords = (id, query) => {
  return https().request(
    `/affiliate/${id}/member/transfer`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const deleteSecurityQuestion = id => {
  return https().request(
    `/affiliate/${id}/resetSecurityQuestion?_method=DELETE`,
    Method.POST,
    ContentType.form
  )
}

export const updateViewLoginName = (id, view) => {
  return https().request(
    `/affiliate/${id}/viewLoginName?_method=PUT`,
    Method.POST,
    { view: view },
    ContentType.form
  )
}

export const getAffiliateShareRatio = (id) => {
  return https().request(
    `/affiliate/${id}/shareRatio`,
    Method.GET
  )
}

export const updateLevel = (id, level) => {
  return https().request(
    `/affiliate/${id}/updateLevel?_method=PUT`,
    Method.POST,
    { affiliateLevel: level },
    ContentType.form
  )
}

export const getDownlineShareRatio = (id) => {
  return https().request(
    `/affiliate/${id}/getLowestShareRatio`,
    Method.GET
  )
}

export const updateRecycleMoneyState = (id, state) => {
  return https().request(
    `/affiliate/${id}/updateRecycleMoney?_method=PUT`,
    Method.POST,
    { state: state },
    ContentType.form
  )
}

export const updateDisplayAmountState = (id, state) => {
  return https().request(
    `/affiliate/${id}/updateDisplayAmount?_method=PUT`,
    Method.POST,
    { state: state },
    ContentType.form
  )
}

export const reactivateAffiliate = (id) => {
  return https().request(
    `/affiliate/${id}/reactivate?_method=PUT`,
    Method.POST
  )
}

export const updateAffiliateWithdrawPassword = (id, password, site) => {
  return https().request(
    `/affiliate/${id}/withdraw-password?_method=PUT`,
    Method.POST,
    { password: password, site: site },
    ContentType.form
  )
}

export const updateIgnoreSettlement = (id, state) => {
  return https().request(
    `/affiliate/${id}/updateIgnoreSettlement?_method=PUT`,
    Method.POST,
    { state: state },
    ContentType.form
  )
}

export const syncAffiliateParentChildren = (id) => {
  return https().request(
    `/affiliate/${id}/syncAff?_method=PUT`,
    Method.POST
  )
}
