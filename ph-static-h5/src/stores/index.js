import { defineStore } from "pinia";
import { api, cashier, eventapi } from "boot/axios";
import { SessionStorage, Notify, Platform } from "quasar";
import liff from '@line/liff';
import { useRouter } from "vue-router";
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
      validId: "",
      birthday: "",
      telephone: "",
      email: "",
      memberType: "",
      balance: 0,
      token: SessionStorage.getItem("TOKEN") || "",
      vip: "",
      currency: { value: "₱", label: "peso"},
    };
  },
  actions: {
    hasToken() {
      return !!SessionStorage.getItem("TOKEN");
    },
    memberLogin(loginInfo) {
      var regDevice = Platform.is.mobile ? "H5" : "WEB"
      if (("standalone" in window.navigator) && window.navigator.standalone) {      
        regDevice = "IOS"
      } else {
        regDevice = Platform.is.mobile ? "H5" : "WEB";
        if (Platform.is.capacitor) {
          if (Platform.is.android) {
            regDevice = "ANDROID"
          }
        }
      }
      loginInfo.way = regDevice
      var string = qs.stringify(loginInfo);
      return api.post("/member/login", string).then((ret) => {
        if (ret.data.code === 0) {
          SessionStorage.set("TOKEN", ret.data.data);
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
      return api.get("/session/member").then((res) => {
        const ret = res.data;
        if (ret.code === 0) {
          this.id= ret.data.id;
          this.nickName = ret.data.loginName;
          this.realName = ret.data.realName;
          this.validId = ret.data.validId;
          this.birthday = ret.data.birthday;
          this.email = ret.data.email;
          this.telephone = ret.data.telephone;
          this.memberType = ret.data.memberType;
          this.vip = ret.data.vip;
          this.profilePicture = ret.data.pictureUrl;
          this.displayName = ret.data.displayName
        } else {
          this.memberLogout();
        }
      });
    },
    getBalance() {
      if (this.token) {
        api
          .get("/session/balance?v=123", {
            params: {
              platform: "MAIN"
            }
          })
          .then((ret) => {
            const res = ret.data;
            if (res.code === 0) {
              this.balance = res.data;
            } else {
              this.balance = 0;
            }
          });
      }
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
