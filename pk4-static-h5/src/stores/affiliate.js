import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useAffiliateStore = defineStore("affiliate", {
  state: () => ({
    affiliateInfo: {},
  }),
  actions: {
    async fetchAffiliateInfo() {
      // Only fetch if affiliateInfo is empty
      if (Object.keys(this.affiliateInfo).length === 0) {
        const res = await api.get("/session/affiliate");
        this.affiliateInfo = res.data;
      }
      return this.affiliateInfo;
    },

    async checkIsCanShowDividendPage() {
      // Ensure affiliateInfo is loaded before checking
      const affiliateInfo = await this.fetchAffiliateInfo();

      return !(affiliateInfo.affiliateLevel === "JUNIOR_AFFILIATE" && affiliateInfo.commission === 0);
    },

    async checkIsCanShowContract() {
      // Ensure affiliateInfo is loaded before checking
      const affiliateInfo = await this.fetchAffiliateInfo();

      return !(affiliateInfo.affiliateLevel === "MASTER_AFFILIATE");
    },
  },
  getters: {
    isShowDividendPage() {
      return !(this.affiliateInfo.affiliateLevel === "JUNIOR_AFFILIATE" && this.affiliateInfo.commission === 0);
    },
  },
});

