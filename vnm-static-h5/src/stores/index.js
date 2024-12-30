import { defineStore } from "pinia";
import { api, cashier, eventapi } from "boot/axios";
import { SessionStorage, Notify, Platform } from "quasar";
import LocalStorage from "boot/local-storage";
import { isAndroid } from "boot/utils";
import OneSignal from "onesignal-cordova-plugin";

var qs = require("qs");
const TOKEN_KEY = "TOKEN";

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
      birthday: "",
      phone: "",
      email: "",
      memberType: "",
      balance: 0,
      token: getStoreToken(),
      vip: "",
      evip: "",
      h5Url: "",
      currency: { value: "VNDP", label: "VNDP" },
      personalAddress: "",
      unreadInboxMail: 0,
      phoneVerified: false,
      emailVerified: false,
      currentDeposit: "",
      levelUpDeposit: "",
      registeredWithdrawPassword: false,
      visitorId: "",
      googleadid: "",
      aaid: "",
      hasUpdatedOneSignal: false,
      isAffiliateA: false,
      withdrawType: ""
    };
  },
  actions: {
    hasToken() {
      if (isAndroid()) {
        // console.log("android");
        if (LocalStorage.getItem("TOKEN", "") !== "") {
          return true;
        } else {
          return false;
        }
      } else {
        return !!SessionStorage.getItem("TOKEN");
      }
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
    },
    isApp() {
      if (
        (Platform.is.ios && "standalone" in window.navigator && window.navigator.standalone) ||
        (Platform.is.android && Platform.is.capacitor)
      ) {
        return true;
      } else {
        return false;
      }
    },
    setPhone(tel) {
      this.phone = tel;
    },
    memberLogin(loginInfo) {
      var regDevice = Platform.is.mobile ? "H5" : "WEB";
      if ("standalone" in window.navigator && window.navigator.standalone) {
        regDevice = "IOS";
      } else {
        regDevice = Platform.is.mobile ? "H5" : "WEB";
        if (Platform.is.capacitor && Platform.is.android) {
          regDevice = "ANDROID";
        }
      }
      loginInfo.way = regDevice;
      var string = qs.stringify(loginInfo);
      return api.post("/member/login", string).then((ret) => {
        if (ret.code === 0) {
          if (isAndroid()) {
            LocalStorage.set("TOKEN", ret.data, 86400);
          } else {
            SessionStorage.set("TOKEN", ret.data);
          }

          this.hasUpdatedOneSignal = false;

          if (isAndroid() && OneSignal !== undefined) {
            OneSignal.logout();
          }
        } else {
          Notify.create({
            color: "negative",
            position: "top",
            message: ret.message,
            icon: "report_problem"
          });
        }
      });
    },
    memberLoginviaPhone(loginInfo) {
      var regDevice = Platform.is.mobile ? "H5" : "WEB";
      if ("standalone" in window.navigator && window.navigator.standalone) {
        regDevice = "IOS";
      } else {
        regDevice = Platform.is.mobile ? "H5" : "WEB";
        if (Platform.is.capacitor && Platform.is.android) {
          regDevice = "ANDROID";
        }
      }
      loginInfo.way = regDevice;
      var string = qs.stringify(loginInfo);
      return api.post("/member/mobileLogin", string).then((ret) => {
        if (ret.code === 0) {
          if (isAndroid()) {
            LocalStorage.set("TOKEN", ret.data, 86400);
          } else {
            SessionStorage.set("TOKEN", ret.data);
          }
        } else {
          Notify.create({
            color: "negative",
            position: "top",
            message: ret.message,
            icon: "report_problem"
          });
        }
      });
    },
    getMemberInfo() {
      api.interceptors.request.use(async (req) => {
        var token;
        if (isAndroid()) {
          token = LocalStorage.getItem("TOKEN");
        } else {
          token = SessionStorage.getItem("TOKEN");
        }
        req.headers.token = token;
        return req;
      });
      cashier.interceptors.request.use(async (req) => {
        var token;
        if (isAndroid()) {
          token = LocalStorage.getItem("TOKEN");
        } else {
          token = SessionStorage.getItem("TOKEN");
        }
        req.headers.TOKEN = token;
        return req;
      });
      eventapi.interceptors.request.use(async (req) => {
        var token;
        if (isAndroid()) {
          token = LocalStorage.getItem("TOKEN");
        } else {
          token = SessionStorage.getItem("TOKEN");
        }
        req.headers.TOKEN = token;
        return req;
      });
      return api.get("/session/member").then((response) => {
        if (response.code === 0) {
          this.id = response.data.id;
          this.nickName = response.data.loginName;
          this.realName = response.data.realName;
          this.birthday = response.data.birthday;
          this.email = response.data.email;
          this.phone = response.data.telephone;
          this.memberType = response.data.memberType;
          this.vip = response.data.vip;
          this.profilePicture = response.data.pictureUrl;
          this.displayName = response.data.displayName;
          this.currentDeposit = response.data.currentDeposit;
          this.levelUpDeposit = response.data.levelUpDeposit;
          this.registeredWithdrawPassword = response.data.registeredWithdrawPassword;
          // this.personalAddress = response.data.personalAddress
          this.phoneVerified = response.data.phoneVerified;
          this.emailVerified = response.data.emailVerified;
          this.withdrawType = response.data.withdrawType;
          if (response.data.evip) {
            var exclusive = JSON.parse(response.data.evip);
            this.evip = exclusive.wap;
            this.h5Url = exclusive.web;
          }

          if (!this.hasUpdatedOneSignal && isAndroid() && OneSignal !== undefined) {
            OneSignal.login(this.nickName);
            OneSignal.User.addTag("user_name", this.nickName);
            OneSignal.User.addTag("VIP", this.vip);
            this.hasUpdatedOneSignal = true;
          }

          this.unreadInboxMail = 0;
          // this.unreadInboxMail = 16;
          this.getBalance();
        } else {
          this.memberLogout();
        }
      });
    },
    getBalance() {
      if (this.token) {
        return api
          .get("/session/balance?v=123", {
            params: {
              platform: "MAIN"
            }
          })
          .then((res) => {
            if (res.code === 0) {
              this.balance = res.data;
            } else {
              this.balance = 0;
            }
          });
      }
    },
    getUnreadTotal() {
      if (this.token) {
        return api.get("/session/pm/inbox/getUnreadTotal").then((total) => {
          console.log(total);
          if (total.code === 0) {
            this.unreadInboxMail = total.data;
          }
        });
      }
    },
    autoLogin(token) {
      this.token = token;
      if (isAndroid()) {
        LocalStorage.set("TOKEN", token, 86400);
      } else {
        SessionStorage.set("TOKEN", token);
      }
    },
    memberLogout() {
      return api.post("/session/logout").then(() => {
        LocalStorage.remove("TOKEN");
        SessionStorage.remove("TOKEN");

        location.reload();
      });
    }
  }
});
