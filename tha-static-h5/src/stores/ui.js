import { defineStore } from "pinia";

export const useUI = defineStore("ui-store", {
  state: () => {
    return {
      footer: true,
      orientation: 'landscape',
      themeColor: 'purple-8',
      leftDrawerOpen: false,
      appVersion: "",
      isCardUpdate: false
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
      this.orientation = 'portrait'
    },
    orientationLandscape() {
      this.orientation = 'landscape'
    },
    setDrawer(status){
      this.leftDrawerOpen= status;
    },
    setVersion(version){
      this.appVersion= version;
    }
  }
});
