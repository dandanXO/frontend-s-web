import { state } from "./state";
import { UserMutationTypes } from "./mutation-types";
import { UserActionTypes } from "./action-types";
import { removeToken } from "@/utils/cookies";
import { resetRouter } from "@/router";
import { loginRequest, updatePasswordRequest, userInfoRequest } from "../../../api/user";
import { ElMessage } from "element-plus";
import i18n from "../../../i18n/index";

export const actions = {
  async [UserActionTypes.ACTION_LOGIN](
    { commit },
    userInfo
  ) {
    let { userName, password } = userInfo;
    userName = userName.trim();
    const { data: token } = await loginRequest({ userName: userName, password });
    commit(UserMutationTypes.SET_TOKEN, token);
  },
  [UserActionTypes.ACTION_RESET_TOKEN](
    { commit }) {
    removeToken();
    commit(UserMutationTypes.SET_TOKEN, "");
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
    sessionStorage.removeItem("WITHDRAW");
    sessionStorage.removeItem("BEFORE_PAID");
    sessionStorage.removeItem("PAYMENT");
    resetRouter();
  },

  async [UserActionTypes.ACTION_UPDATE_LOGIN](
    _ctx,
    updateInfo // seems like it is the only required one
  ) {
    await updatePasswordRequest({ password: updateInfo.password, oldPassword: updateInfo.oldPassword });
    ElMessage({ message: i18n.global.t('message.changeSuccess'), type: "success" });
  }
};
