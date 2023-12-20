import { UserMutationTypes } from "./mutation-types";
import { setToken, setId, setSiteId, setSiteCode, setLoginName, setRealName, setAffiliateLevel } from "@/utils/cookies";

export const mutations = {
  [UserMutationTypes.SET_TOKEN](state, token) {
    setToken(token);
    state.token = token;
  },

  [UserMutationTypes.SET_ID](state, id) {
    setId(id);
    state.id = id;
  },

  [UserMutationTypes.SET_LOGIN_NAME](state, loginName) {
    setLoginName(loginName);
    state.name = loginName;
  },

  [UserMutationTypes.SET_REAL_NAME](state, realName) {
    setRealName(realName);
    state.realName = realName;
  },

  [UserMutationTypes.SET_SITE_ID](state, siteId) {
    setSiteId(siteId);
    state.siteId = siteId;
  },

  [UserMutationTypes.SET_SITE_CODE](state, siteCode) {
    setSiteCode(siteCode);
    state.siteCode = siteCode;
  },

  [UserMutationTypes.SET_AFFILIATE_LEVEL](state, affiliateLevel) {
    setAffiliateLevel(affiliateLevel);
    state.affiliateLevel = affiliateLevel;
  },

  [UserMutationTypes.SET_LOGIN_USER](state, loginInfo) {
    state.name = loginInfo.loginName;
    state.permissions = loginInfo.permissions;
    state.userType = loginInfo.userType;
  },

  [UserMutationTypes.SET_AVATAR](state, avatar) {
    state.avatar = avatar;
  }
};
