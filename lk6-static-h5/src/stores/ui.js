import { defineStore } from "pinia";
import { useRoute } from "vue-router";

export const useUI = defineStore("ui-store", {
  state: () => {
    return {
      drawerRight: false,
      footer: true,
      orientation: "landscape",
      pageName: "优惠详细信息",
      slotLists: [],
      siteId: 6,
      matchInsuranceLists: [],
      maintenanceStartTime: "",
      maintenanceEndTime: ""
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
    notify(options) {
      const id = `${Date.now()}-${Math.floor(Math.random() * 100)}`;
      this.notificationQueue.push({
        ...options,
        id,
        zIndex: this.notificationZIndex++,
        timeout: options.timeout ?? 3000
      });
    },
  }
});
