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
  return new CustomEvent("ftdPurchaseSuccess", { detail: triggeredPixels });
};

export const userStore = defineStore("userStore", {
  state: () => {
    const getStoreToken = () => {
      if (isAndroid() || isInPwa() || this.isFromGooglePackage) {
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
      hasDeposit: "",
      currentMailData: {},
      guest: false,
      readMsgLists: [],
      aaid: "",
      googleadid: "",
      visitorId: "",
      h5Url: "https://m.b9mega1.com/",
      isFbPixel: false,
      isOldFBPixel: false,
      hasUpdatedOneSignal: false,
      paytypeWithPrivilege: "",
      extraPrivilegeId: "",
      ftd: "CLOSE",
      isTkPixel: false,
      isGoogleLogin: false,
      isFirstLandOnHomePage: true,
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
          this.getMemberInfo("fromlogin");
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
          if (isAndroid() || isInPwa() || this.isFromGooglePackage) {
            LocalStorage.set("TOKEN", ret.data, 86400);
          } else {
            SessionStorage.set("TOKEN", ret.data);
          }
          this.getMemberInfo("fromlogin");
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
    getMemberInfo(from) {
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
            hasDeposit,
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
          this.hasDeposit = hasDeposit;
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
          if (from === "fromlogin") {
            if (!this.hasDeposit) {
              localStorage.setItem("newPlayerGuide", "1");
              localStorage.removeItem("completeddepositguide");
              localStorage.removeItem("completedreferguide");
              localStorage.removeItem("completedwithdrawguide");
            } else {
              localStorage.setItem("newPlayerGuide", "END");
            }
          }
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
              if ((this.isOldFBPixel || this.isTkPixel) && res.data !== 0) {
                // debugger;
                const triggeredPixels = [];
                if (this.isOldFBPixel) triggeredPixels.push("fb");
                if (this.isTkPixel) triggeredPixels.push("tk");
                const isNewFtd = localStorage.getItem("newUserFtd");
                // const UserPurchaseComplete = localStorage.getItem("UserPurchaseComplete") || "";
                if (isNewFtd) {
                  if (isNewFtd && isNewFtd === this.nickName && this.isOldFBPixel === true) {
                    document.dispatchEvent(createFtdEvent(triggeredPixels));
                  }
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
        LocalStorage.remove("newPlayerGuide");

        this.hasUpdatedOneSignal = false;

        if (isAndroid() && OneSignal !== undefined) {
          OneSignal.logout();
        }

        // location.href = "/";
        window.location.reload();
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
