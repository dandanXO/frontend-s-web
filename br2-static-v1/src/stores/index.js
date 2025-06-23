import { defineStore } from "pinia";
import { api, cashier, eventapi } from "boot/axios";
import { SessionStorage, Notify, Platform } from "quasar";
import LocalStorage from "boot/local-storage";
import OneSignal from "onesignal-cordova-plugin";
import { isAndroid, isInPwa } from "boot/utils";

var qs = require("qs");
const TOKEN_KEY = "TOKEN";

export const userStore = defineStore("userStore", {
  state: () => {
    const getStoreToken = () => {
      if (isAndroid() || isInPwa()) {
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
      currency: { value: "R$", label: "BRL" },
      personalAddress: "",
      unreadInboxMail: 0,
      phoneVerified: false,
      emailVerified: false,
      currentDeposit: "",
      levelUpDeposit: "",
      currentMailData: {},
      guest: false,
      readMsgLists: [],
      aaid: "",
      googleadid: "",
      h5Url: "https://bra.akb188.com/",
      hasUpdatedOneSignal: false,
      paytypeWithPrivilege: "",
      extraPrivilegeId: "",
      ftdPrivilegeId: "",
      ftd: true,
      spinWheelLuckyPromoInfo: {
        startTime: "",
        currAmount: 0,
        targetWithdrawAmount: 0,
        spinChance: 0,
        status: ""
      }
    };
  },
  actions: {
    hasToken() {
      if (isAndroid() || isInPwa()) {
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
          if (isAndroid() || isInPwa()) {
            LocalStorage.set("TOKEN", ret.data, 31536000);
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
          if (isAndroid() || isInPwa()) {
            LocalStorage.set("TOKEN", ret.data, 31536000);
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
    addReadMsg(id) {
      this.readMsgLists = SessionStorage.getItem("READ_MAIL_IDS") || [];
      if (this.readMsgLists.length === 0) {
        SessionStorage.set("READ_MAIL_IDS", [id]);
      } else {
        this.readMsgLists.push(id);
        SessionStorage.set("READ_MAIL_IDS", this.readMsgLists);
      }
    },
    setReadMsg() {
      this.readMsgLists = SessionStorage.getItem("READ_MAIL_IDS") || [];
    },
    getMemberInfo() {
      // api.interceptors.request.use(async (req) => {
      //   var token;
      //   if (isAndroid()) {
      //     token = LocalStorage.getItem("TOKEN");
      //   } else {
      //     token = SessionStorage.getItem("TOKEN");
      //   }
      //   req.headers.token = token;
      //   return req;
      // });
      // cashier.interceptors.request.use(async (req) => {
      //   var token;
      //   if (isAndroid()) {
      //     token = LocalStorage.getItem("TOKEN");
      //   } else {
      //     token = SessionStorage.getItem("TOKEN");
      //   }
      //   req.headers.token = token;
      //   return req;
      // });
      // eventapi.interceptors.request.use(async (req) => {
      //   var token;
      //   if (isAndroid()) {
      //     token = LocalStorage.getItem("TOKEN");
      //   } else {
      //     token = SessionStorage.getItem("TOKEN");
      //   }
      //   req.headers.token = token;
      //   return req;
      // });
      // debugger;
      this.token = isAndroid() || isInPwa() ? LocalStorage.getItem("TOKEN") : SessionStorage.getItem("TOKEN");
      return api.get("/session/member").then((response) => {
        if (response.code === 0) {
          const {
            id,
            loginName,
            realName,
            birthday,
            email,
            telephone,
            memberType,
            vip,
            pictureUrl,
            displayName,
            phoneVerified,
            emailVerified,
            evip,
            currentDeposit,
            levelUpDeposit,
            guest
          } = response.data;

          this.id = id;
          this.nickName = loginName;
          this.realName = realName;
          this.birthday = birthday;
          this.email = email;
          this.phone = telephone;
          this.memberType = memberType;
          this.vip = vip;
          this.profilePicture = pictureUrl;
          this.displayName = displayName;
          this.phoneVerified = phoneVerified;
          this.emailVerified = emailVerified;
          this.currentDeposit = parseFloat(currentDeposit);
          this.levelUpDeposit = parseFloat(levelUpDeposit);
          this.guest = guest;

          if (!this.hasUpdatedOneSignal && isAndroid() && OneSignal !== undefined) {
            OneSignal.login(this.nickName);
            OneSignal.User.addTag("user_name", this.nickName);
            OneSignal.User.addTag("VIP", this.vip);
            this.hasUpdatedOneSignal = true;
          }

          if (evip) {
            var exclusive = JSON.parse(evip);
            this.evip = exclusive.wap;
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
        return api.get("/session/inbox/getUnreadTotal").then((total) => {
          if (total.code === 0) {
            this.unreadInboxMail = total.data;
          }
        });
      }
    },
    autoLogin(token) {
      this.token = token;
      if (isAndroid() || isInPwa()) {
        LocalStorage.set("TOKEN", token, 31536000);
      } else {
        SessionStorage.set("TOKEN", token);
      }
    },
    memberLogout() {
      return api.post("/session/logout").then(() => {
        LocalStorage.remove("TOKEN");
        SessionStorage.remove("TOKEN");

        this.hasUpdatedOneSignal = false;

        if (isAndroid() && OneSignal !== undefined) {
          OneSignal.logout();
        }

        location.href = "/";
      });
    },
    setMailData(mailData) {
      this.currentMailData = mailData;
    },
    getCurrentDeposit() {
      return this.currentDeposit;
    }
  }
});
