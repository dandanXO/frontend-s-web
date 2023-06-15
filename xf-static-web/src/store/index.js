import { defineStore } from "pinia";
import { login, logout } from "@/api/index/login";
import { loadBalance, loadMemberInfo } from "@/api/personal/personal";
import { useSessionStorage } from "@vueuse/core";
import { MAIN } from "@/utils/utils";
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
      currency: { value: "￥", label: "RMB"},
    };
  },
  actions: {
    memberLogin(loginInfo) {
      return login(loginInfo)
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
  },
});
