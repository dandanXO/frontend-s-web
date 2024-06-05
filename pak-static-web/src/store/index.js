import { defineStore } from "pinia";
import { login, logout } from "@/api/index/login";
import { loadBalance, loadMemberInfo } from "@/api/personal/personal";
import { useSessionStorage, useLocalStorage } from "@vueuse/core";
import { MAIN } from "@/utils/utils";
import { reactive } from "vue";

const TOKEN_KEY = "TOKEN";
const DARK_MODE = "DARKMODE";
export const globalStore = reactive({
  // isDarkMode: useLocalStorage(DARK_MODE, true),
  isDarkMode: false,
  isMenuActive: true
});
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
      currency: { value: "₹", label: "RS" },
      currentDeposit: "0.0000",
      levelUpDeposit: "0",
      isAffiliateA: false,
      isAffiliate2: false,
      isAffiliate3: false,
      profilePhoto: "",
      accountModalVisible: false
    };
  },
  actions: {
    memberLogin(loginInfo) {
      return login(loginInfo).then((ret) => {
        if (ret.code === 0) {
          this.token = ret.data;
          this.getBalance();
        } else {
          throw new Error(ret.message);
        }
      });
    },
    autoLogin(token) {
      this.token = token;
      this.getBalance();
      this.getMemberInfo();
    },
    getMemberInfo() {
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
          this.currentDeposit = ret.data.currentDeposit;
          this.levelUpDeposit = ret.data.levelUpDeposit;
          this.profilePhoto = ret.data.profilePhoto;
        } else {
          throw new Error(ret.message);
        }
      });
    },
    getBalance() {
      if (this.token) {
        loadBalance(MAIN).then((ret) => {
          this.balance = ret.data;
        });
      }
    },
    getLevelUpDeposit() {
      return this.levelUpDeposit;
    },
    memberLogout() {
      return logout().then(() => (this.token = null));
    },
    openAccountModal() {
      this.accountModalVisible = true;
    }
  },
  getters: {
    currentDepositNumber() {
      return Number(this.currentDeposit);
    }
  }
});
