import { defineStore } from "pinia";
import { api, cashier, eventapi } from "boot/axios";
import { SessionStorage, Notify, Platform } from "quasar";
import LocalStorage from "boot/local-storage";
import { isAndroid } from "boot/utils";
import { useUI } from "./ui";
import { getVIPDetails, getVIPDetailsNotLoggedIn } from "../api/index/promo";

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
      name2: "",
      birthday: "",
      phone: "",
      email: "",
      memberType: "",
      balance: 0,
      token: getStoreToken(),
      vip: "",
      evip: "",
      gender: "",
      currency: { value: "￥", label: "RMB" },
      personalAddress: "",
      unreadInboxMail: 0,
      phoneVerified: false,
      emailVerified: false,
      currentDeposit: "",
      levelUpDeposit: "",
      currentBetAmt: "",
      vipProgress: 0,
      currentUpgradeBetAmt: "",
      visitorId: "",
      profilePhoto: "",
      isDisplayLogin: false,
      withdrawType: "",
      regSuccessGuideVisible: false,
      chatGuid: ""
    };
  },
  actions: {
    hasToken() {
      if (isAndroid()) {
        console.log("android");
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
    isNotAppPromo() {
      // console.log(window.location.pathname);
      //当 LH H5 在 /promotion 或者某些页面时，很多Api都不需要Call + 省时间。
      if (
        window.location.pathname === "/deposit" ||
        window.location.pathname === "/vip" ||
        window.location.pathname === "/promotion"
      ) {
        // console.log("IS In App")
        return false;
      }
      return true;
    },
    memberLogin(loginInfo) {
      var regDevice = Platform.is.mobile ? "H5" : "WEB";
      if ("standalone" in window.navigator && window.navigator.standalone) {
        //Temp Fix with H5 sin.
        regDevice = "H5";
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
        } else {
          window.captchaObj.reset();
          useUI().notify({
            type: "error",
            message: ret.message
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
          useUI().notify({
            type: "error",
            message: ret.message
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
          this.name2 = response.data.name2;
          this.birthday = response.data.birthday;
          this.email = response.data.email;
          this.phone = response.data.telephone;
          this.memberType = response.data.memberType;
          this.vip = response.data.vip;
          this.profilePicture = response.data.pictureUrl;
          this.displayName = response.data.displayName;
          this.currentDeposit = response.data.currentDeposit;
          this.levelUpDeposit = response.data.levelUpDeposit;
          // this.personalAddress = response.data.personalAddress
          this.phoneVerified = response.data.phoneVerified;
          this.emailVerified = response.data.emailVerified;
          this.gender = response.data.gender;
          if (response.data.evip) {
            var exclusive = JSON.parse(response.data.evip);
            this.evip = exclusive.wap;
          }

          this.profilePhoto = response.data.profilePhoto;
          this.unreadInboxMail = 0;

          this.withdrawType = response.data.withdrawType;
          // this.unreadInboxMail = 16;
          this.getBalance();
        } else {
          this.memberLogout();
        }
      });
    },
    getVIPInfo() {
      if (this.token) {
        return getVIPDetails().then((res) => {
          if (res.code === 0) {
            sessionStorage.setItem("vipData", JSON.stringify(res)); // Update the stored data
            this.handleVIPData(res);
          }
          return res;
        });
      } else {
        return getVIPDetailsNotLoggedIn().then((res) => {
          if (res.code === 0) {
            sessionStorage.setItem("vipData", JSON.stringify(res)); // Update the stored data
            this.handleVIPData(res);
          }
          return res;
        });
      }
    },
    handleVIPData(res) {
      this.currentBetAmt = res.data.currentBetAmount;
      const _vip = this.vip || "VIP0";
      const vipLevel = _vip.replace("VIP", "");
      const currentVip = parseInt(_vip.match(/\d+/)[0]);
      if (res.data.vipBonusVOList && res.data.vipBonusVOList[vipLevel]) {
        this.currentUpgradeBetAmt = res.data.vipBonusVOList[vipLevel].upgradeBetAmount;
      }

      if (currentVip === 12) {
        this.vipProgress = parseFloat(this.currentUpgradeBetAmt) / parseFloat(this.currentUpgradeBetAmt);
      } else {
        this.vipProgress = parseFloat(this.currentBetAmt) / parseFloat(this.currentUpgradeBetAmt);
      }
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
    getCurrentDeposit() {
      return this.currentDeposit;
    },
    getLevelUpDeposit() {
      return this.levelUpDeposit;
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
        SessionStorage.remove("vipData");

        location.reload();
      });
    }
  }
});
