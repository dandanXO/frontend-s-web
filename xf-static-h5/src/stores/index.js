import { defineStore } from "pinia";
import { api, cashier, eventapi } from "boot/axios";
import { SessionStorage, Notify, Platform } from "quasar";
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
      phone: "",
      email: "",
      memberType: "",
      balance: 0,
      token: SessionStorage.getItem("TOKEN") || "",
      vip: "",
	  evip: "",
      currency: { value: "￥", label: "RMB"},
      personalAddress: '',
      unreadInboxMail: 0,
    };
  },
  actions: {
    hasToken() {
      return !!SessionStorage.getItem("TOKEN");
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
        if (ret.code === 0) {
          SessionStorage.set("TOKEN", ret.data);
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
      return api.get("/session/member").then((response) => {
        if (response.code === 0) {
          this.id= response.data.id;
          this.nickName = response.data.loginName;
          this.realName = response.data.realName;
          this.birthday = response.data.birthday;
          this.email = response.data.email;
          this.phone = response.data.telephone;
          this.memberType = response.data.memberType;
          this.vip = response.data.vip;
          this.profilePicture = response.data.pictureUrl;
          this.displayName = response.data.displayName
          // this.personalAddress = response.data.personalAddress
		  var exclusive = JSON.parse(response.data.evip);
          this.evip = exclusive.wap;
          this.unreadInboxMail = 16
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
    autoLogin(token) {
      SessionStorage.set("TOKEN", token);
    },
    memberLogout() {
      return api
        .post("/session/logout")
        .then(() => {
          SessionStorage.remove("TOKEN");
          location.reload();
        });
    }
  }
});
