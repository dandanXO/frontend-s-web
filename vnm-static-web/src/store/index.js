import { defineStore } from "pinia";
import { login, logout, mobileLogin } from "@/api/index/login";
import { loadBalance, loadMemberInfo } from "@/api/personal/personal";
import { useSessionStorage } from "@vueuse/core";
import { MAIN } from "@/utils/utils";
import { getCSAFromServer } from "@/api/index/site";
import { ElMessage } from "element-plus";
import vueI18n from "@/i18n";
import { getUnreadTotal } from "@/api/personal/mailbox";

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
      registeredWithdrawPassword: false,
      currency: { value: "VNDP", label: "VNDP" },
      loginPageVisible: false,
      regPageVisible: false,
      currentDeposit: "0.0000",
      levelUpDeposit: "0",
      siteId: 8,
      unreadTotal: 0,
      visitorId: "",
      isAffiliateA: false,
      withdrawType: ""
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
            ElMessage.error(ret.message);
            // throw new Error(ret.message);
          }
        })
        .catch((err) => {
          console.log(err);
          // message.error(err.message);
        });
    },
    autoLogin(token) {
      this.token = token;
      this.getBalance();
      this.getMemberInfo();
    },
    getUnreadMail() {
      getUnreadTotal().then((response) => {
        if (response.code === 0) {
          this.unreadTotal = response.data;
        }
      }).catch((error) => {
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
            this.currentDeposit = ret.data.currentDeposit;
            this.levelUpDeposit = ret.data.levelUpDeposit;
            this.registeredWithdrawPassword = ret.data.registeredWithdrawPassword;
            this.withdrawType = ret.data.withdrawType;
          } else {
            ElMessage.error(ret.message);
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
        // this.vip = 'VIP0'
        // this.currentDeposit = "0.0000"
        location.reload();
      });
    },
    openLiveChat() {
      const left = (screen.width - 350) * 2;
      const top = (screen.height - 650) / 4;

      return getCSAFromServer()
        .then((res) => {
          // console.log(res.data);
          var lineUrl = "";
          const randNum = Math.floor(Math.random() * 2) + 1;
          if (randNum === 1) {
            lineUrl = res.data.liveUrl1;
          } else {
            lineUrl = res.data.liveUrl2;
          }
          window.open(
            // `https://csweb01.c8nhwrqx4.com/?partnerCode=DYCS&way=WEB&lang=zh-CN&token=${this.token}`,
            `https://csweb01.amv4xjcbd.com/?partnerId=7&way=WEB&lang=${
              vueI18n.global.locale.value === "vi" ? "vn" : vueI18n.global.locale.value
            }&token=${this.token}`,
            `${lineUrl}&token=${this.token}`,
            "Chat Server",
            "resizable=yes, width=" + 800 + ", height=" + 880 + ", top=" + top + ", left=" + left
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
});

export const i18nStore = defineStore("i18nStore", () => {
  const languageLocale = localStorage.getItem("languageLocale") || "vi";
  const languageVal = ref(languageLocale);

  function setLanguage(l) {
    languageVal.value = l;
    // when vue-i18n is being used with legacy: false, note that i18n.global.locale is a ref, so we must set it via .value:
    vueI18n.global.locale.value = l;

    // otherwise - when using legacy: true, we set it like this:
    // vueI18n.global.locale = l;
    localStorage.setItem("languageLocale", l);
  }
  return { languageVal, setLanguage };
});
