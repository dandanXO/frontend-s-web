import { defineStore } from "pinia";

export const useUI = defineStore("ui-store", {
  state: () => {
    return {
      footer: true,
      orientation: 'landscape',
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
    }
  }
});
