import { state } from "./state";
import { UserMutationTypes } from "./mutation-types";
import { UserActionTypes } from "./action-types";
import { removeToken, removeId, removeSiteId, removeLoginName, removeRealName } from "@/utils/cookies";
import { getDevice } from "@/utils/util";
import { resetRouter } from "@/router";
import { loginRequest, updatePasswordRequest, userInfoRequest, registerRequest } from "../../../api/user";
import { updateRealName } from "../../../api/affiliate";
import { ElMessage } from "element-plus";
import i18n from "../../../i18n/index";

export const actions = {
  async [UserActionTypes.ACTION_LOGIN](
    { commit },
    userInfo
  ) {
    let { userName, password } = userInfo;
    userName = userName.trim();
    const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
    const { data: loginInfo } = await loginRequest({ userName: userName, password, way: regDevice });
    commit(UserMutationTypes.SET_TOKEN, loginInfo.token);
    commit(UserMutationTypes.SET_ID, loginInfo.id);
    commit(UserMutationTypes.SET_LOGIN_NAME, loginInfo.loginName);
    commit(UserMutationTypes.SET_REAL_NAME, loginInfo.realName);
    commit(UserMutationTypes.SET_SITE_ID, loginInfo.siteId);
  },
  async [UserActionTypes.ACTION_REGISTER](
    { commit },
    userInfo
  ) {
    let { userName, password, confirmPwd, telephone, email, siteId, captchaCode, codeId, codeAffiliate, codePersonalAffiliate, birthday } = userInfo;
    userName = userName.trim();
    const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
    await registerRequest({ loginName: userName, password, confirmPwd: confirmPwd, telephone, email, siteId, captchaCode, codePersonalAffiliate, codeId, codeAffiliate, birthday, regDevice: regDevice });
  },

  [UserActionTypes.ACTION_RESET_TOKEN](
    { commit }) {
    removeToken();
    commit(UserMutationTypes.SET_TOKEN, "");
  },

  [UserActionTypes.ACTION_RESET_ID](
    { commit }) {
    removeId();
    commit(UserMutationTypes.SET_ID, "");
  },

  [UserActionTypes.ACTION_RESET_LOGIN_NAME](
    { commit }) {
    removeLoginName();
    commit(UserMutationTypes.SET_LOGIN_NAME, "");
  },
  [UserActionTypes.ACTION_RESET_REAL_NAME](
    { commit }) {
    removeRealName();
    commit(UserMutationTypes.SET_REAL_NAME, "");
  },

  [UserActionTypes.ACTION_RESET_SITE_ID](
    { commit }) {
    removeSiteId();
    commit(UserMutationTypes.SET_SITE_ID, "");
  },

  async [UserActionTypes.ACTION_GET_USER_INFO](
    { commit }
  ) {
    if (state.token === "") {
      throw Error("token is undefined!");
    }
    const { data: loginInfo } = await userInfoRequest();
    commit(UserMutationTypes.SET_LOGIN_USER, loginInfo);
  },

  async [UserActionTypes.ACTION_LOGOUT](
    { dispatch }
  ) {
    // await logoutRequest();
    await dispatch(UserActionTypes.ACTION_RESET_TOKEN, undefined);
    await dispatch(UserActionTypes.ACTION_RESET_ID, undefined);
    await dispatch(UserActionTypes.ACTION_RESET_LOGIN_NAME, undefined);
    await dispatch(UserActionTypes.ACTION_RESET_REAL_NAME, undefined);
    await dispatch(UserActionTypes.ACTION_RESET_SITE_ID, undefined);
    resetRouter();
  },

  async [UserActionTypes.ACTION_UPDATE_LOGIN](
    _ctx,
    updateInfo // seems like it is the only required one
  ) {
    await updatePasswordRequest(updateInfo.affId, { password: updateInfo.password, oldPassword: updateInfo.oldPassword });
    ElMessage({ message: i18n.global.t('message.success'), type: "success" });
  },
  async [UserActionTypes.ACTION_UPDATE_REAL_NAME](
    { commit },
    updateInfo // seems like it is the only required one
  ) {
    await updateRealName(updateInfo);
    ElMessage({ message: i18n.global.t('message.success'), type: "success" });
    commit(UserMutationTypes.SET_REAL_NAME, updateInfo.realName);
  }
};
