import { UserMutationTypes } from "./mutation-types";
import { setToken } from "@/utils/cookies";

export const mutations = {
  [UserMutationTypes.SET_TOKEN](state, token) {
    setToken(token);
    state.token = token;
  },

  [UserMutationTypes.SET_LOGIN_USER](state, loginInfo) {
    state.name = loginInfo.loginName;
    state.permissions = loginInfo.permissions;
    state.userType = loginInfo.userType;
    state.siteName = loginInfo.siteName;
    state.siteId = loginInfo.siteId;
    state.sites = loginInfo.sites;
    console.log(state.siteId);
  },

  [UserMutationTypes.SET_AVATAR](state, avatar) {
    state.avatar = avatar;
  }
};
