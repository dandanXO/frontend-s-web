import { defineStore } from "pinia";
import { login, logout, mobileLogin } from "@/api/index/login";
import { loadBalance, loadMemberInfo } from "@/api/personal/personal";
import { useSessionStorage } from "@vueuse/core";
import { MAIN } from "@/utils/utils";
import { getCSAFromServer } from "@/api/index/site";
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
      visitorId: "",
      withdrawType: "",
      regSuccessGuideVisible: false
    };
  },
  actions: {
    hasToken() {
      return this.token ? true : false;
    },
    memberLogin(loginInfo) {
      return login(loginInfo)
        .then((ret) => {
          if (ret.code === 0) {
            this.token = ret.data;
            this.getBalance();
            this.getMemberInfo();
          } else {
            // throw new Error(ret.message);
            window.captchaObj.reset();
          }
        })
        .catch((err) => {
          window.captchaObj.reset();
          console.log(err);
          // message.error(err.message);
        });
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
            var exclusiveurl = JSON.parse(ret.data.evip);
            this.evip = exclusiveurl;
            this.withdrawType = ret.data.withdrawType;
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
      return logout().then(() => (this.token = null));
    },
    openLiveChat() {
      // const left = (screen.width - 350) * 2;
      // const top = (screen.height - 650) / 4;

      // return getCSAFromServer()
      //   .then((res) => {
      //     console.log(res.data);
      //     window.open(
      //       // `https://csweb01.v6kthwlug.com/?partnerCode=XFCS&lang=zh-CN&token=${this.token}`,
      //       `${res.data}${this.token}`,
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
