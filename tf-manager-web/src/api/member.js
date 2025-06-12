import { ContentType, Method } from 'axios-mapper'
import https from '../utils/https'

export const getMembers = members => {
  return https().request('/member', Method.GET, members, ContentType.form)
}

export const getMemberDetails = (id, site) => {
  return https().request(
    `/member/${id}/${site}`,
    Method.GET,
    {},
    ContentType.form
  )
}

export const getMemberLoginRecord = query => {
  return https().request(
    `/member/loginRecord`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberTransactionRecord = query => {
  return https().request(
    `/member/transactionRecord`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberRemark = (id, query) => {
  return https().request(
    `/member/${id}/memberRemark`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getNewRegisterMemberLists = siteId => {
  return https().request(
    `/member/getNewRegister/${siteId}`,
    Method.GET,
    {},
    ContentType.form
  )
}
export const registerMember = member => {
  return https().request(
    '/member/registration',
    Method.POST,
    member,
    ContentType.form
  )
}

export const distributePromotion = promo => {
  return https().request('/member/promo', Method.POST, promo, ContentType.form)
}

export const updatePassword = (id, password, site) => {
  return https().request(
    `/member/${id}/password?_method=PUT`,
    Method.POST,
    { password: password, site: site },
    ContentType.form
  )
}

export const getMemberStatus = (id, site) => {
  return https().request(
    `/member/status/${id}/${site}`,
    Method.GET,
    {},
    ContentType.form
  )
}

export const freezeMember = (id, member) => {
  return https().request(
    `/member/${id}/freeze?_method=PUT`,
    Method.POST,
    member,
    ContentType.form
  )
}

export const unfreezeMember = (id, member) => {
  return https().request(
    `/member/${id}/unfreeze?_method=PUT`,
    Method.POST,
    member,
    ContentType.form
  )
}

export const normalMember = (id, siteId) => {
  return https().request(
    `/member/${id}/normal?_method=PUT`,
    Method.POST,
    { siteId: siteId },
    ContentType.form
  )
}

export const updateVip = (id, vipId, site) => {
  return https().request(
    `/member/${id}/vipId?_method=PUT`,
    Method.POST,
    { vipId: vipId, site: site },
    ContentType.form
  )
}

export const updateFinancial = (id, financialId, site) => {
  return https().request(
    `/member/${id}/financialId?_method=PUT`,
    Method.POST,
    { financialId: financialId, site: site },
    ContentType.form
  )
}

export const updateRisk = (id, riskId, site) => {
  return https().request(
    `/member/${id}/riskId?_method=PUT`,
    Method.POST,
    { riskId: riskId, site: site },
    ContentType.form
  )
}

export const addMemberRemark = remark => {
  return https().request(
    '/member/remark',
    Method.POST,
    remark,
    ContentType.form
  )
}

export const editMemberRemark = (id, remark) => {
  return https().request(
    `/member/remark/${id}?_method=PUT`,
    Method.POST,
    { remark: remark },
    ContentType.form
  )
}

export const deleteMemberRemark = id => {
  return https().request(
    `/member/remark/${id}?_method=DELETE`,
    Method.POST,
    ContentType.form
  )
}

// CANNOT USE IT
// export const getMemberNameList = siteId => {
//   return https().request(
//     `/member/nameList/${siteId}`,
//     Method.GET,
//     siteId,
//     ContentType.form
//   )
// }

export const getMemberPrivilegeRecord = (id, query) => {
  return https().request(
    `/member/${id}/memberPrivilegeRecord`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberPrivilegeRecordTotal = (id, query) => {
  return https().request(
    `/member/${id}/memberPrivilegeRecordTotal`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberPrivilegeRecordNameList = (id, query) => {
  return https().request(
    `/member/${id}/memberPrivilegeRecordNameList`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberMoneyChangeList = (id, query) => {
  return https().request(
    `/member/${id}/memberMoneyChange`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberDepositRecord = (id, query) => {
  return https().request(
    `/member/${id}/depositRecord`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberDepositRecordTotalAmount = (id, query) => {
  return https().request(
    `/member/${id}/depositRecordTotalAmount`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberWithdrawRecord = (id, query) => {
  return https().request(
    `/member/${id}/withdrawRecord`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberWithdrawRecordTotalAmount = (id, query) => {
  return https().request(
    `/member/${id}/withdrawRecordTotalAmount`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberTransferRecord = (id, query) => {
  return https().request(
    `/member/${id}/transferRecord`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberBank = (id, query) => {
  return https().request(
    `/member/${id}/memberBankCard`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberBankLog = (id, query) => {
  return https().request(
    `/member/${id}/memberBankCardRecord`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberListBySiteId = siteId => {
  return https().request(
    '/member/memberList',
    Method.GET,
    { siteId: siteId },
    ContentType.form
  )
}

export const getMemberWithdrawCard = (id, query) => {
  return https().request(
    `/member/${id}/withdraw/card`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const addMemberBankCard = (id, bankCard) => {
  return https().request(
    `/member/${id}/bankCard`,
    Method.POST,
    bankCard,
    ContentType.form
  )
}

export const findIdByLoginName = (loginName, sid) => {
  return https().request(
    '/member/loginName',
    Method.GET,
    { loginName: loginName, siteId: sid },
    ContentType.form
  )
}

export const getPlatformBalance = (id, platformCode, siteId) => {
  return https().request(
    `/member/${id}/getBalance`,
    Method.GET,
    { platformCode: platformCode, siteId: siteId },
    ContentType.form
  )
}

export const platformFundTransfer = (id, transfer) => {
  return https().request(
    `/member/${id}/platform-fund-transfer`,
    Method.POST,
    transfer,
    ContentType.form
  )
}

export const getMemberBalance = id => {
  return https().request(`/member/${id}/getMemberBalance`, Method.GET)
}

export const getMemberRealName = (id, siteId) => {
  return https().request(
    `/member/${id}/unmaskRealName?siteId=${siteId}`,
    Method.GET
  )
}

export const getMemberEmail = (id, siteId) => {
  return https().request(
    `/member/${id}/unmaskEmail?siteId=${siteId}`,
    Method.GET
  )
}

export const getMemberTelephone = (id, siteId) => {
  return https().request(
    `/member/${id}/unmaskTelephone?siteId=${siteId}`,
    Method.GET
  )
}

export const getMemberReferFriend = query => {
  return https().request(
    `/member/referFriend`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getAffiliateInfo = (id, siteId) => {
  return https().request(`/member/${id}/affiliate?siteId=${siteId}`, Method.GET)
}

export const getMemberBalanceByLoginNameSite = (
  loginName,
  siteId,
  currency
) => {
  return https().request(
    `/member/getMemberBalanceByLoginNameSite`,
    Method.GET,
    { loginName: loginName, siteId: siteId, currency: currency },
    ContentType.form
  )
}

export const updateMemberType = (id, memberType, siteId) => {
  return https().request(
    `/member/${id}/memberType?_method=PUT`,
    Method.POST,
    { memberType: memberType, siteId: siteId },
    ContentType.form
  )
}

export const unlockMember = (id, siteId) => {
  return https().request(
    `/member/${id}/unlock?_method=PUT`,
    Method.POST,
    { id: id, siteId: siteId },
    ContentType.form
  )
}

export const refreshBalance = (id, site) => {
  return https().request(
    `/member/balance/${id}/${site}`,
    Method.GET,
    {},
    ContentType.form
  )
}

export const getDnW = (id, site) => {
  return https().request(
    `/member/dnw/${id}/${site}`,
    Method.GET,
    {},
    ContentType.form
  )
}

export const getClaimableRebate = (id, site) => {
  return https().request(
    `/member/claimableRebate/${id}/${site}`,
    Method.GET,
    {},
    ContentType.form
  )
}

export const getClaimableRedPacketRebate = (id, site) => {
  return https().request(
    `/member/claimableRedPacketRebate/${id}/${site}`,
    Method.GET,
    {},
    ContentType.form
  )
}

export const forceLogout = (id, siteId) => {
  return https().request(
    `/member/logoutPLayer/${id}`,
    Method.POST,
    { siteId: siteId },
    ContentType.form
  )
}

export const requestExportSiteMember = query => {
  return https().request('/member/export', Method.GET, query, ContentType.form)
}

export const getMemberDepositSuccessRecord = (id, query) => {
  return https().request(
    `/member/${id}/depositSuccessRecord`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getMemberWithdrawSuccessRecord = (id, query) => {
  return https().request(
    `/member/${id}/withdrawSuccessRecord`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const syncMemberDetail = (id, siteId) => {
  return https().request(
    `/member/sync/${id}`,
    Method.GET,
    { siteId: siteId },
    ContentType.form
  )
}

export const showAlert = siteId => {
  return https().request('/member/alert', Method.GET, siteId, ContentType.form)
}

export const requestMemberMoneyChangeExport = query => {
  return https().request(
    '/member/requestMemberMoneyChangeExport',
    Method.GET,
    query,
    ContentType.form
  )
}

export const unbindBankCard = cardId => {
  return https().request(
    `/member/bankCard/${cardId}?_method=PUT`,
    Method.POST,
    ContentType.form
  )
}

export const getShareRatio = memberId => {
  return https().request(`/member/${memberId}/getShareRatio`, Method.GET)
}

export const editShareRatio = (memberId, ratio) => {
  return https().request(
    `/member/${memberId}/editShareRatio?_method=PUT`,
    Method.POST,
    { memberShareRatio: ratio },
    ContentType.form
  )
}

export const getMemberVipFin = (siteId, names) => {
  return https().request(
    `/member/memberVipFin`,
    Method.GET,
    { siteId: siteId, memberLoginNames: names },
    ContentType.form
  )
}

export const getMemberVipFinById = (siteId, ids, loginName) => {
  return https().request(
    `/member/memberVipFinById`,
    Method.GET,
    { siteId: siteId, memberIds: ids, loginName: loginName },
    ContentType.form
  )
}

export const updateWithdrawType = (id, withdrawType, siteId) => {
  return https().request(
    `/member/${id}/withdrawType?_method=PUT`,
    Method.POST,
    { withdrawType: withdrawType, siteId: siteId },
    ContentType.form
  )
}

export const toggleMemberWallet = (id, siteId) => {
  return https().request(`/member/toggleWallet/${id}/${siteId}`, Method.GET)
}

export const walletBalance = (id, siteId) => {
  return https().request(`/member/all-wallet/${id}/${siteId}`, Method.GET)
}

export const freezeMemberBatchUpdate = memberFreeze => {
  return https(5 * 60 * 1000).request(
    '/member/freezeMemberBatchUpdate',
    Method.POST,
    { memberFreeze: JSON.stringify(memberFreeze) },
    ContentType.form
  )
}

export const getRolloverEvents = (id, query) => {
  return https().request(
    `/member/${id}/rollover-events`,
    Method.GET,
    query,
    ContentType.form
  )
}

export const getWithdrawableBalance = (id, siteId) => {
  return https().request(
    `/member/${id}/withdrawableBalance`,
    Method.GET,
    { siteId: siteId },
    ContentType.form
  )
}

export const refreshWithdrawableBalance = (id, siteId) => {
  return https().request(
    `/member/${id}/withdrawableBalance/refresh?_method=PUT`,
    Method.POST,
    { siteId: siteId },
    ContentType.form
  )
}

export const updateOpenTransfer = (memberId, siteId, state) => {
  return https().request(
    `/member/update-open-transfer?_method=PUT`,
    Method.POST,
    {
      memberId: memberId,
      siteId: siteId,
      state: state,
    },
    ContentType.form
  )
}

export const unbindTelephone = (id, siteId) => {
  return https().request(
    `/member/${id}/unbindTelephone?_method=PUT`,
    Method.POST,
    { siteId: siteId },
    ContentType.form
  )
}

export const unbindEmail = (id, siteId) => {
  return https().request(
    `/member/${id}/unbindEmail?_method=PUT`,
    Method.POST,
    { siteId: siteId },
    ContentType.form
  )
}
