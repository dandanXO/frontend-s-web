import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useRoute } from "vue-router";
import { userStore } from ".";
import { isInPwa } from "src/boot/utils";

export const useUI = defineStore("ui-store", {
  state: () => {
    return {
      drawerRight: false,
      footer: true,
      orientation: "landscape",
      pageName: "优惠详细信息",
      slotLists: [],
      bottomInsetHeight: 0,
      CSAUrl: "",
      LiveUrl: null,
      downloadAppUrl: "",
      loggedIn: false,
      shouldFetchDownloadAppUrl: false,
      instagramUrl: "",
      tiktokUrl: "",
      whatsappUrl: "",
      youtubeUrl: "",
      footerIcon: "",
      maintenanceStartTime: "",
      maintenanceEndTime: "",
      adjust_register_event: ""
    };
  },
  actions: {
    setScrollPosition: (axis = "vertical", offset = 0, duration = 0) => null,
    hiddenFooter() {
      this.footer = false;
    },
    showFooter() {
      this.footer = true;
    },
    orientationPotrait() {
      this.orientation = "portrait";
    },
    orientationLandscape() {
      this.orientation = "landscape";
    },
    changePromoName(name) {
      this.pageName = name;
    },
    showLoggedIn() {
      this.loggedIn = true;
    },
    getTopDownloadUrl() {
      const siteCode = process.env.SITE;
      const affiliateCode = "A74B03";
      api.get(`/app/download/affiliate/url?siteCode=${siteCode}&affiliateCode=${affiliateCode}`).then((res) => {
        if (res.code === 0) {
          this.downloadAppUrl = res.data.url;
        }
      });
    }
  },
  getters: {
    hideDownload() {
      const store = userStore();
      const hasReferralCode = !!sessionStorage.getItem("REFERRAL_CODE");
      if (isInPwa()) return true;
      if (!store.token && hasReferralCode) return true;
      return false;
    }
  }
});
