import { defineStore } from "pinia";
import { login, logout, mobileLogin, register } from "@/api/index/login";
import { loadBalance, loadMemberInfo } from "@/api/personal/personal";
import { getUnreadTotal } from "@/api/personal/mailbox";
import { useSessionStorage } from "@vueuse/core";
import { MAIN } from "@/utils/utils";
import { getCSAFromServer } from "@/api/index/site";
import { uiStore } from "./ui";
import { getVIPDetails, getVIPDetailsNotLoggedIn } from "@/api/index/promo";
// import { message } from "ant-design-vue";

const TOKEN_KEY = "TOKEN";

export const userStore = defineStore("userStore", {
  state: () => {
    return {
      id: "",
      nickName: "",
      realName: "",
      birthday: "",
      phone: "",
      email: "",
      token: useSessionStorage(TOKEN_KEY, null),
      memberType: "",
      balance: 0,
      vip: "",
      evip: "",
      currency: { value: "￥", label: "RMB" },
      loginPageVisible: false,
      regPageVisible: false,
      currentDeposit: "0.0000",
      levelUpDeposit: "0",
      siteId: process.env.VUE_APP_SITEID,
      unreadTotal: 0,
      visitorId: "",
      profilePhoto: "",
      withdrawType: "",
      frequency: "",
      regSuccessGuideVisible: false,
      isRequirePhoneValidation: false,
    };
  },
  actions: {
    hasToken() {
      return !!sessionStorage.getItem("TOKEN");
    },
    memberLogin(loginInfo) {
      return login(loginInfo)
        .then((ret) => {
          if (ret.code === 0) {
            this.token = ret.data;
            this.getBalance();
            this.getMemberInfo();
            this.getUnreadMail();
          } else {
            window.captchaObj.reset();
            uiStore().notify({
              type: "error",
              message: ret.message
            });
            // throw new Error(ret.message);
          }
        })
        .catch((err) => {
          console.log(err);
          window.captchaObj.reset();
          // message.error(err.message);
        });
    },
    autoLogin(token) {
      this.token = token;
      this.getBalance();
      this.getMemberInfo();
      this.getUnreadMail();
    },
    telephoneLogin(loginInfo) {
      return mobileLogin(loginInfo)
        .then((ret) => {
          if (ret.code === 0) {
            this.token = ret.data;
            this.getBalance();
            this.getMemberInfo();
            this.getUnreadMail();
          } else {
            uiStore().notify({
              type: "error",
              message: ret.message
            });
            // throw new Error(ret.message);
          }
        })
        .catch((err) => {
          console.log(err);
          // message.error(err.message);
        });
    },
    getUnreadMail() {
      getUnreadTotal()
        .then((response) => {
          if (response.code === 0) {
            this.unreadTotal = response.data;
          }
        })
        .catch((error) => {});
    },
    getMemberInfo() {
      if (this.token) {
        return loadMemberInfo().then((ret) => {
          if (ret.code === 0) {
            this.id = ret.data.id;
            this.nickName = ret.data.loginName;
            this.realName = ret.data.realName;
            this.birthday = ret.data.birthday;
            this.email = ret.data.email;
            this.phone = ret.data.telephone;
            this.memberType = ret.data.memberType;
            this.vip = ret.data.vip;
            this.evip = ret.data.evip;
            this.currentDeposit = ret.data.currentDeposit;
            this.levelUpDeposit = ret.data.levelUpDeposit;
            this.profilePhoto = ret.data.profilePhoto;

            this.withdrawType = ret.data.withdrawType;
          } else {
            uiStore().notify({
              type: "error",
              message: ret.message
            });
          }
        });
      }
    },
    getBalance() {
      if (this.token) {
        return loadBalance(MAIN).then((ret) => {
          this.balance = ret.data;
        });
      }
    },
    getCurrentDeposit() {
      return this.currentDeposit;
    },
    getLevelUpDeposit() {
      return this.levelUpDeposit;
    },
    memberLogout() {
      return logout().then(() => {
        this.token = null;
        sessionStorage.removeItem("vipData");
        sessionStorage.removeItem("TOKEN");
        if (this.frequency === "EVERYTIME") {
          localStorage.removeItem("isImpt");
        }
        // this.vip = 'VIP0'
        // this.currentDeposit = "0.0000"
        location.reload();
      });
    },
    openLiveChat() {
      // const left = (screen.width - 350) * 2;
      // const top = (screen.height - 650) / 4;

      // return getCSAFromServer()
      //   .then((res) => {
      //     // console.log(res.data);
      //     var lineUrl = "";
      //     const randNum = Math.floor(Math.random() * 2) + 1;
      //     if (randNum === 1) {
      //       lineUrl = res.data.liveUrl1;
      //     } else {
      //       lineUrl = res.data.liveUrl2;
      //     }

      const token = this.token ?? "";
      //     window.open(
      //       // `https://csweb01.c8nhwrqx4.com/?partnerCode=DYCS&way=WEB&lang=zh-CN&token=${this.token}`,
      //       `${lineUrl}&token=${token}`,
      //       "Chat Server",
      //       "resizable=yes, width=" + 800 + ", height=" + 880 + ", top=" + top + ", left=" + left
      //     );
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });

      const width = 500;
      const height = 880;
      const left = (screen.width - 350) * 2;
      const top = (screen.height - 650) / 4;

      const url = `https://8xjp0t3ydi.ipbr7k9r.com/chatwindow.aspx?siteId=65001994&planId=099fb0e7-cad5-43d0-aa03-2ed2257e0e12`;
      window.open(url, "_blank", `resizable=yes, width=${width}, height=${height}, top=${top}, left=${left}`);
    }
  }
});
