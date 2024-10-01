import { defineStore } from "pinia";
import { api } from "boot/axios";
import { SessionStorage, Notify, Platform } from "quasar";
import LocalStorage from "boot/local-storage";
import { isAndroid } from "boot/utils";
import OneSignal from "onesignal-cordova-plugin";
import { loadBalance } from "src/api/personal/personal";

import qs from "qs";

import { getStorage } from "src/utils/helper";

const TOKEN_KEY = "TOKEN";

const storage = getStorage();

export const userStore = defineStore("userStore", {
  state: () => {
    const getStoreToken = () => {
      if (isAndroid()) {
        return LocalStorage.getItem("TOKEN", "");
      } else {
        return SessionStorage.getItem("TOKEN") || "";
      }
    };

    return {
      id: 0,
      profilePicture: "",
      displayName: "",
      nickName: "",
      realName: "",
      validId: "",
      birthday: "",
      telephone: "",
      email: "",
      memberType: "",
      balance: 0,
      vip: "",
      token: getStoreToken(),
      currency: { value: "₱", label: "peso" },
      currentDeposit: 0,
      levelUpDeposit: 0,
      hasClosedDL: false,
      hasUpdatedOneSignal: false,
      aaid: "",
      googleadid: ""
    };
  },
  actions: {
    hasToken() {
      return !!this.token;
    },
    async memberLogin(loginInfo) {
      const bodyData = qs.stringify(loginInfo);

      const res = await api.post("/member/login", bodyData);

      if (res.code === 0) {
        storage.setItem(TOKEN_KEY, res.data);
        this.token = res.data;
      } else {
        Notify.create({
          color: "negative",
          position: "top",
          message: res.data.message,
          icon: "report_problem"
        });
      }
    },
    async getMemberInfo() {
      const res = await api.get("/session/member");

      if (res.code === 0) {
        this.id = res.data.id;
        this.nickName = res.data.loginName;
        this.realName = res.data.realName;
        this.validId = res.data.validId;
        this.birthday = res.data.birthday;
        this.email = res.data.email;
        this.telephone = res.data.telephone;
        this.memberType = res.data.memberType;
        this.vip = res.data.vip;
        this.profilePicture = res.data.pictureUrl;
        this.displayName = res.data.displayName;

        if (!this.hasUpdatedOneSignal && isAndroid() && OneSignal !== undefined) {
          OneSignal.login(this.nickName);
          OneSignal.User.addTag("user_name", this.nickName);
          OneSignal.User.addTag("VIP", this.vip);
          this.hasUpdatedOneSignal = true;
        }

        this.getBalance();
      } else this.memberLogout();
    },
    getBalance() {
      if (this.token) {
        loadBalance("MAIN").then((res) => (this.balance = res.code === 0 ? res.data : 0));
      }
    },
    getCurrentDeposit() {
      return this.currentDeposit;
    },
    getLevelUpDeposit() {
      return this.levelUpDeposit;
    },
    autoLogin(token) {
      if (isAndroid()) {
        LocalStorage.set("TOKEN", token, 86400);
      } else {
        storage.setItem(TOKEN_KEY, token);
        this.token = token;
      }
    },
    async memberLogout() {
      storage.removeItem(TOKEN_KEY);

      const res = await api.post("/session/logout");

      this.token = null;
      this.hasUpdatedOneSignal = false;

      if (isAndroid() && OneSignal !== undefined) {
        OneSignal.logout();
      }

      LocalStorage.remove("TOKEN");
      SessionStorage.remove("TOKEN");

      location.reload();

      return res;
    },
    getDeviceType() {
      var regDevice = Platform.is.mobile ? "H5" : "WEB";
      if ("standalone" in window.navigator && window.navigator.standalone) {
        regDevice = "IOS";
      } else {
        regDevice = Platform.is.mobile ? "H5" : "WEB";
        if (Platform.is.capacitor && Platform.is.android) {
          regDevice = "ANDROID";
        }
      }
      return regDevice;
    },
    isMobileSafari() {
      if (Platform.is.ios && Platform.is.mobile && Platform.is.safari) {
        return true;
      }
      return false;
    }
  },
  getters: {
    isApp: () =>
      (Platform.is.ios && "standalone" in window.navigator && window.navigator.standalone) ||
      (Platform.is.android && Platform.is.capacitor)
  }
});
