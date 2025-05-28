import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useAffiliateStore = defineStore("affiliate", {
  state: () => {
    return {};
  },
  actions: {
    async checkIsCanShowDividendPage () {
      const res = await api.get("/session/affiliate");

      const affiliateLevel = res.data.affiliateLevel;
      const commission = res.data.commission;

      if (affiliateLevel === "JUNIOR_AFFILIATE" && commission === 0) {
        return false;
      }

      return true;
    }
  },
  getters: {
    isShowDividendPage() {
      return this.showDividendPage;
    }
  }
});
