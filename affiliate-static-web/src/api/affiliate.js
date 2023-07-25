import { ContentType, Method } from "axios-mapper";
import https from "../utils/https";

export const getAffiliateDownline = (id, query) => {
  return https().request(`/affiliate/${id}/downline`, Method.GET, query, ContentType.form);
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

export const withdrawEntrance = () => {
  return https('affiliate').request(`/session/withdraw/entrance`);
}

export function deleteBankCard(cardId) {
  return https('affiliate').request(`/session/bankCard/${cardId}?_method=delete`, Method.POST);
}

export const getAffiliateBalance = (id) => {
  return https().request(`/affiliate/${id}/balance`, Method.GET);
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
