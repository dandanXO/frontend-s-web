import { defineStore } from "pinia";
import { login, logout, mobileLogin } from "@/api/index/login";
import { loadBalance, loadMemberInfo } from "@/api/personal/personal";
import { useSessionStorage } from "@vueuse/core";
import { MAIN } from "@/utils/utils";
import { getCSAFromServer } from "@/api/index/site";

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
      unreadTotal: 0,
      siteId: 6,
      visitorId: "",
      withdrawType: "",
    };
  },
  actions: {
    hasToken() {
      return this.token ? true : false;
    },
    memberLogin(loginInfo) {
      return login(loginInfo)
        .then((ret) => {
          if (ret && ret?.code === 0) {
            this.token = ret.data;
            this.getBalance();
            this.getMemberInfo();
          } else {
            window.captchaObj.reset();
            // throw new Error(ret.message);
          }
        })
        .catch((err) => {
          console.log(err);
          window.captchaObj.reset();
          // message.error(err.message);
        });
    },
    getCurrentDeposit() {
      return this.currentDeposit;
    },
    autoLogin(token) {
      this.token = token;
      this.getBalance();
      this.getMemberInfo();
    },
    telephoneLogin(loginInfo) {
      return mobileLogin(loginInfo)
        .then((ret) => {
          if (ret.code === 0) {
            this.token = ret.data;
            this.getBalance();
            this.getMemberInfo();
          } else {
            // throw new Error(ret.message);
          }
        })
        .catch((err) => {
          console.log(err);
          // message.error(err.message);
        });
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
            this.withdrawType = ret.data.withdrawType;
            this.currentDeposit = ret.data.currentDeposit;
          } else {
            throw new Error(ret.message);
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
    memberLogout() {
      return logout().then(() => {
        this.token = null;

        for (var key in sessionStorage) {
          if (key.startsWith("MAILINBOX")) {
            sessionStorage.removeItem(key);
          }
        }
      });
    },
    openLiveChat() {
      // const left = (screen.width - 350) * 2;
      // const top = (screen.height - 650) / 4;

      // return getCSAFromServer()
      //   .then((res) => {
      //     console.log(res.data);
      //     var lineUrl = "";
      //     if (line === 1) {
      //       lineUrl = res.data.liveUrl1;
      //     } else {
      //       lineUrl = res.data.liveUrl2;
      //     }
      //     const token = this.token ?? "";
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

      const token = this.token ?? "";

      const width = 500;
      const height = 880;
      const left = (screen.width - 350) * 2;
      const top = (screen.height - 650) / 4;

      const url = `https://${window.location.host}/live-chat/live-chat?token=${token}`;
      window.open(url, "_blank", `resizable=yes, width=${width}, height=${height}, top=${top}, left=${left}`);
    }
  }
});
