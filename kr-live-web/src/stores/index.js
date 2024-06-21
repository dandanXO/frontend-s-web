import { defineStore } from "pinia";
import { api, cashier, eventapi } from "boot/axios";
import { SessionStorage, Notify, Platform } from "quasar";
import liff from "@line/liff";
import { useUI } from "stores/ui";
import moment from 'moment';

var qs = require("qs");
const TOKEN_KEY = "TOKEN";

export const userStore = defineStore("userStore", {
  state: () => {
    return {
      id: 0,
      profilePicture: "",
      displayName: "",
      nickName: "",
      realName: "",
      birthday: "",
      telephone: "",
      email: "",
      memberType: "",
      balance: 0,
      token: SessionStorage.getItem("TOKEN") || "",
      vip: "",
      currency: { value: "₩", label: "บาท" },
      unreadCount: 0,
      currentDeposit: "",
      levelUpDeposit: "",
      phoneVerified: false,
      emailVerified: false,
      appDownloadUrl: "",
      visitorId: "",
      announcementList: undefined,
      financeRecords: undefined,
      isOffline: false,
    };
  },
  actions: {
    setAppDownloadUrl(url) {
      this.appDownloadUrl = url;
    },
    getAppDownloadUrl() {
      return this.appDownloadUrl;
    },
    getUnreadTotal() {
      api.get("/session/inbox/getUnreadTotal").then((ret) => {
        const res = ret.data;
        if (res.code === 0) {
          this.unreadCount = res.data;
        }
      });
    },
    hasToken() {
      return !!SessionStorage.getItem("TOKEN") || !!this.token;
    },
    memberLogin(loginInfo) {
      var regDevice = Platform.is.mobile ? "H5" : "WEB";
      if ("standalone" in window.navigator && window.navigator.standalone) {
        regDevice = "IOS";
      } else {
        regDevice = Platform.is.mobile ? "H5" : "WEB";
        if (Platform.is.capacitor) {
          if (Platform.is.android) {
            regDevice = "ANDROID";
          }
        }
      }
      loginInfo.way = regDevice;
      var string = qs.stringify(loginInfo);
      return api.post("/member/login", string).then((ret) => {
        if (ret.data.code === 0) {
          SessionStorage.set("TOKEN", ret.data.data);
          this.token = ret.data.data;
          this.getMemberInfo();
          this.getBalance();
          this.getUnreadTotal();
        } else {
          Notify.create({
            color: "negative",
            position: "top",
            message: ret.data.message,
            icon: "report_problem"
          });
        }
      });
    },
    getAnnouncementList() {
      return new Promise((resolve, reject) => {
        if(Array.isArray(this.announcementList)) {
          return resolve(this.announcementList);
        } else {
          api.get("/announcement").then((res) => {
            const { data: { code, data: { announcements } } } = res;
            
            const formatDate = (timestamp) => moment(timestamp).format("YYYY/MM/DD");
            
            if (code === 0) {
              const announcementsFormattedData = announcements.map((item) => ({
                ...item,
                createTime: formatDate(item.createTime)
              }));
              this.announcementList = announcementsFormattedData;
              resolve(this.announcementList);
            }
          })
          .catch((err) => {
              console.log(err);
              reject();
          });
        }
      })
    },
    getFinanceRecords() {
      return new Promise((resolve, reject) => {
        if(this.financeRecords === null) {
          return;
        } else if(Array.isArray(this.financeRecords)) {
          return resolve(this.financeRecords);
        } else {
          if(this.financeRecords == undefined) {
            this.financeRecords = null;
          }

          api.get("/member/withdraw-deposit-record").then((res) => {
            const { data: { code, data } } = res;
            
            if (code === 0) {
              const displayTypes = ['WITHDRAW']; 
              this.financeRecords = data.filter(({ transactionType }) => displayTypes.includes(transactionType));
              resolve(this.financeRecords);
            }
          })
          .catch((err) => {
              console.log(err);
              reject();
          });
        }
      })
    },
    getMemberInfo() {
      const ui = useUI();
      api.interceptors.request.use(async (req) => {
        const token = SessionStorage.getItem("TOKEN");
        req.headers.token = token;
        return req;
      });
      cashier.interceptors.request.use(async (req) => {
        const token = SessionStorage.getItem("TOKEN");
        req.headers.TOKEN = token;
        return req;
      });
      eventapi.interceptors.request.use(async (req) => {
        const token = SessionStorage.getItem("TOKEN");
        req.headers.TOKEN = token;
        return req;
      });
      return api.get("/session/member").then((res) => {
        const ret = res.data;
        if (ret.code === 0) {
          this.id = ret.data.id;
          this.nickName = ret.data.loginName;
          this.name2 = ret.data.name2;
          this.realName = ret.data.realName;
          this.birthday = ret.data.birthday;
          this.email = ret.data.email;
          this.telephone = ret.data.telephone;
          this.memberType = ret.data.memberType;
          this.vip = ret.data.vip;
          this.profilePicture = ret.data.pictureUrl;
          this.displayName = ret.data.displayName;
          this.currentDeposit = ret.data.currentDeposit;
          this.levelUpDeposit = ret.data.levelUpDeposit;
          this.phoneVerified = ret.data.phoneVerified;
          this.emailVerified = ret.data.emailVerified;

          if (ret.data.regHost && ret.data.regHost.indexOf("slot-win.cc") > -1) {
            ui.isAffiliateB = true;

            fbq("init", "873960514528284");

            // fbq("init", "722685126460216");
            fbq("track", "PageView");
            fbq("track", "ViewContent");
          }
        } else {
          this.memberLogout();
        }
      });
    },
    getBalance() {
      if (this.token && !this.isOffline) {
        api.get("/session/balance?v=123", {
          params: {
            platform: "MAIN"
          }
        }).then((ret) => {
          const res = ret.data;
          if (res.code === 0) {
            this.balance = Math.floor(res.data);
          } else {
            this.balance = 0;
          }
        });
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
        (Platform.is.ios &&
          "standalone" in window.navigator &&
          window.navigator.standalone) ||
        (Platform.is.android && Platform.is.capacitor)
      ) {
        return true;
      } else {
        return false;
      }
    },
    memberLogout() {
      return api.post("/session/logout").then(() => {
        SessionStorage.remove("TOKEN");
        location.reload();
      });
    }
  }
});
