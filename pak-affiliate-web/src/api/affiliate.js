import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getAffiliateDownline = (id, query) => {
  return https().request(`/affiliate/${id}/downline`, Method.GET, query, ContentType.form);
};

export const getAffiliateDownlineSums = (id, query) => {
  return https().request(`/affiliate/${id}/downline-total`, Method.GET, query, ContentType.form);
};

export const regsterAffiliate = (affiliate) => {
  return https().request("/affiliate", Method.POST, affiliate, ContentType.form);
};

export const editAffiliateCommission = (id, affiliateCommission) => {
  return https().request(`/affiliate/${id}/commission?_method=PUT`, Method.POST, affiliateCommission, ContentType.form);
};

export const getAffiliateInfo = (id) => {
  return https().request(`/affiliate/${id}`, Method.GET);
};

export const loadBanks = (currencyId) => {
  return https('affiliate').request(`/session/withdraw/card?currencyId=${currencyId}`, Method.GET);
}

export const loadBankCards = () => {
  return https('affiliate').request(`/session/bankCard`, Method.GET);
}

export const addBankCard = (bci) => {
  return https('affiliate').request(`/session/bankCard`, Method.POST, bci, ContentType.form);
}

export const confirmWithdraw = (bci) => {
  return https('affiliate').request(`/session/withdraw/`, Method.POST, bci, ContentType.form);
}

export const confirmMainWithdraw = (bci) => {
  return https('affiliate').request(`/session/aff-main-wallet-withdraw/`, Method.POST, bci, ContentType.form);
}

export const withdrawEntrance = () => {
  return https('affiliate').request(`/session/withdraw/entrance`);
}

export function deleteBankCard(cardId) {
  return https('affiliate').request(`/session/bankCard/${cardId}?_method=delete`, Method.POST);
}

export const getAffiliateBalance = (id) => {
  return https().request(`/affiliate/${id}/balance`, Method.GET);
};

export const getAffiliateCommissionBalance = (id) => {
  return https().request(`/affiliate/${id}/commission-balance`, Method.GET);
};

// export const getAffiliateRealName = (id) => {
//   return https().request(`/affiliate/${id}/realName`, Method.GET);
// };

export const updateRealName = (updateInfo) => {
  return https('affiliate').request(`/session/account`, Method.POST, updateInfo, ContentType.form);
}

export const getAffiliateDomain = (id) => {
  return https().request(`/affiliate/${id}/domain`, Method.GET);
};

export const checkHasWithdrawPw = (id, siteId) => {
  return https().request(`/affiliate/${id}/hasWithdrawPw`, Method.GET, { siteId: siteId }, ContentType.form);
};

export const getSecurityQuestions = (id) => {
  return https().request(`/affiliate/${id}/securityQuestion`, Method.GET);
};

export const createSecurityQuestion = (id, securityQuestion) => {
  return https().request(`/affiliate/${id}/securityQuestion`, Method.POST, securityQuestion, ContentType.form);
};

export const checkAnswer = (id, answer) => {
  return https().request(`/affiliate/${id}/checkAnswer`, Method.GET, answer, ContentType.form);
};

export const checkWithdrawPassword = (id, siteId, withdrawPassword) => {
  return https().request(`/affiliate/${id}/checkWithdrawPassword`, Method.GET, { siteId: siteId, withdrawPassword: withdrawPassword }, ContentType.form);
};

export const loadMemberSummary = (id, query) => {
  return https().request(`/downline/${id}`, Method.GET, query, ContentType.form);
};

export const loadMemberInfo = (id, memberId, recordTime) => {
  return https().request(`/downline/${id}/downlineInfo`, Method.GET, { memberId, recordTime }, ContentType.form);
};

export const assignTag = (affId, memberId, tags) => {
  return https().request(`/downline/${affId}/assignTag?_method=PUT`, Method.POST, { memberId: memberId, tagIds: tags.length !== 0 ? tags.join(",") : [] }, ContentType.form);
};

export const assignRemark = (affId, memberId, remark) => {
  return https().request(`/downline/${affId}/assignRemark/${memberId}?_method=PUT`, Method.POST, { remark: remark }, ContentType.form);
};

export const getAuthenticator = (id, siteId) => {
  return https().request(`/affiliate/${id}/hasGoogleAuthenticator`, Method.GET, { siteId: siteId }, ContentType.form);
};

export const validPwd2GoogleKey = (id, siteId, password) => {
  return https().request(`/affiliate/${id}/validPwd2GoogleKey`, Method.GET, { siteId: siteId, password: password }, ContentType.form);
}

export const bindGoogleKey = (id, siteId, code) => {
  return https().request(`/affiliate/${id}/bindGoogleKey?_method=PUT`, Method.POST, { siteId: siteId, code: code }, ContentType.form);
}

export const registerMember = (form) => {
  return https().request(`/downline/registerMember`, Method.POST, form, ContentType.form);
}

export const editMemberRatio = (memberId, ratio) => {
  return https().request(`/downline/${memberId}/editRatio?_method=PUT`, Method.POST, { memberShareRatio: ratio }, ContentType.form);
};

export const getDownlineShareRatio = (affId) => {
  return https().request(`/affiliate/${affId}/getDownlineShareRatio`, Method.GET);
};

export const getAffiliateTree = (affId) => {
  return https().request(`/affiliate/${affId}/getTree`, Method.GET);
};

export const recycleMemberBalance = (recycleForm) => {
  return https().request(`/downline/${recycleForm.memberId}/recycleBalance?_method=PUT`, Method.POST, { amount: recycleForm.amount }, ContentType.form);
};

export const getAffiliatePoint = () => {
  return https().request('/affiliate/point', Method.GET);
};

export const redeemPoint = () => {
  return https().request('/affiliate/redeem-point?_method=PUT', Method.POST);
};

export const getDownlineAffiliates = () => {
  return https().request('/downline/getAllDownlines', Method.GET);
};

export const getDownlineMembers = (id) => {
  return https().request(`/downline/${id}/getDownlineMembers`, Method.GET);
};
