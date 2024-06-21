import { defineStore } from "pinia";

export const useUI = defineStore("ui-store", {
  state: () => {
    return {
      footer: true,
      orientation: "landscape",
      themeColor: "purple-8",
      leftDrawerOpen: false,
      appVersion: "",
      isCardUpdate: false,
      //Affiliate A: Came From Affiliate 5D0E5C
      isAffiliateA: false,
      //Affiliate B: Came From slot-win.cc.
      isAffiliateB: false,
      //tiktok
      isAffiliateC: false,
      adjust_click_register_event: "",
      adjust_open_app_event: "",
      adjust_register_fail_event: "",
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
    setDrawer(status) {
      this.leftDrawerOpen = status;
    },
    setVersion(version) {
      this.appVersion = version;
    }
  }
});
