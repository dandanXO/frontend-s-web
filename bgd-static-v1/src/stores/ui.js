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
      charityUrl: "",
      footerIcon: "",
      maintenanceStartTime: "",
      maintenanceEndTime: "",
      isPageInitialized: false,
      firstScreenLoading: !!sessionStorage.getItem("FIRST_SCREEN_CACHE") || true
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
      api.get("/app/download/affiliate/url?siteCode=BGD&affiliateCode=857738").then((res) => {
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
