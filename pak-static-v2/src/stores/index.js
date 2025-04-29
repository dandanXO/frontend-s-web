import { defineStore } from "pinia";
import { api, cashier, eventapi } from "boot/axios";
import { SessionStorage, Notify, Platform } from "quasar";
import LocalStorage from "boot/local-storage";
import { isAndroid, isInPwa } from "boot/utils";
import { useUI } from "stores/ui";
import OneSignal from "onesignal-cordova-plugin";

var qs = require("qs");
const TOKEN_KEY = "TOKEN";

const createFtdEvent = (triggeredPixels) => {
  return new CustomEvent("ftdSuccess", { detail: triggeredPixels });
};

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
      currency: { value: "₨", label: "Rs" },
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
      visitorId: "",
      h5Url: "https://0vsadwuz3sh.com/",
      isFbPixel: false,
      paytypeWithPrivilege: "",
      extraPrivilegeId: "",
      ftd: "CLOSE",
      isTkPixel: false,
      hasUpdatedOneSignal: false,
      isReferralReady: false,
      isFromGooglePackage: false,
      isCheckGaid: false
    };
  },
  actions: {
    hasToken() {
      if (isAndroid() || isInPwa() || this.isFromGooglePackage) {
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
        if ((Platform.is.capacitor && Platform.is.android) || this.isFromGooglePackage) {
          regDevice = "ANDROID";
        }
      }
      loginInfo.way = regDevice;
      var string = qs.stringify(loginInfo);
      return api.post("/member/pakLogin", string).then((ret) => {
        if (ret.code === 0) {
          if (isAndroid() || isInPwa() || this.isFromGooglePackage) {
            LocalStorage.set("TOKEN", ret.data, 86400);
          } else {
            SessionStorage.set("TOKEN", ret.data);
          }
          this.token = ret.data;
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
        if ((Platform.is.capacitor && Platform.is.android) || this.isFromGooglePackage) {
          regDevice = "ANDROID";
        }
      }
      loginInfo.way = regDevice;
      var string = qs.stringify(loginInfo);
      return api.post("/member/mobileLogin", string).then((ret) => {
        if (ret.code === 0) {
          if (isAndroid() || isInPwa() || this.isFromGooglePackage) {
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
      this.token =
        isAndroid() || isInPwa() || this.isFromGooglePackage
          ? LocalStorage.getItem("TOKEN")
          : SessionStorage.getItem("TOKEN");
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
            console.log(res);
            if (res.code === 0) {
              if ((this.isFbPixel || this.isTkPixel) && this.balance === 0 && res.data !== 0) {
                const triggeredPixels = [];
                if (this.isFbPixel) triggeredPixels.push("fb");
                if (this.isTkPixel) triggeredPixels.push("tk");
                const isNewUser = sessionStorage.getItem("newUserFtd");
                if (isNewUser && isNewUser === this.nickName) {
                  document.dispatchEvent(createFtdEvent(triggeredPixels));
                }
              }
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
          if (total.code === 0) {
            this.unreadInboxMail = total.data;
          }
        });
      }
    },
    autoLogin(token) {
      const ui = useUI();
      if (isAndroid() || isInPwa() || this.isFromGooglePackage) {
        LocalStorage.set("TOKEN", token, 86400);
        ui.showLoggedIn();
      } else {
        SessionStorage.set("TOKEN", token);
        ui.showLoggedIn();
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
