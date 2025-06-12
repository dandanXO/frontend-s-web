import { defineStore, acceptHMRUpdate } from "pinia";
import LocalStorage from "src/cs-client-web/utils/local-storage";

export const useUserStore = defineStore("user", {
  state: () => ({
    userId: "guest",
    username: "",
    nickname: "",
    to_id: "",
    token: null,
    is_storage_enabled: true,
    memory_prefix: "",
    local_memory: {}
  }),

  getters: {
    //
  },

  actions: {
    prepareForReLogin() {
      let partnerId = LocalStorage.get("partnerId");
      let partnerCode = LocalStorage.get("partnerCode");
      let token = LocalStorage.get("pretoken");
      let lang = LocalStorage.get("lang");
      let way = LocalStorage.get("way");
      let type = LocalStorage.get("type") ?? "";
      let referrer_url = LocalStorage.get("referrer");

      let preChat = LocalStorage.get("preChat");
      let questionTypes = LocalStorage.get("questionTypes");
      //let chatGuid = LocalStorage.get('chatGuid');
      //let loginDetails = LocalStorage.get('loginDetails');

      LocalStorage.clearPrefix();

      LocalStorage.set("partnerId", partnerId);
      LocalStorage.set("partnerCode", partnerCode);
      LocalStorage.set("pretoken", token);
      LocalStorage.set("lang", lang);
      LocalStorage.set("way", way);
      LocalStorage.set("referrer", referrer_url);

      if (preChat) {
        LocalStorage.set("preChat", preChat);
        LocalStorage.set("questionTypes", questionTypes);
      }

      LocalStorage.set("type", type);

      //LocalStorage.set('chatGuid', chatGuid);
      //LocalStorage.set("loginDetails", loginDetails);
    },
    logout() {
      let chatGuid = LocalStorage.get("chatGuid");

      LocalStorage.clearPrefix();
      LocalStorage.set("chatGuid", chatGuid);
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
