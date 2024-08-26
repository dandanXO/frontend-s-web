import { defineStore } from "pinia";
import { EDITION } from "src/constant/edition";
import { useRoute } from "vue-router";

export const useUI = defineStore("ui-store", {
  state: () => {
    return {
      drawerRight: false,
      footer: true,
      orientation: "landscape",
      themeColor: "primary",
      pageName: "优惠详细信息",
      slotLists: [],
      downloadUrl: "",
      adjust_click_register_event: "",
      adjust_open_app_event: "",
      adjust_register_fail_event: "",
      adjust_register_event: "",
      maintenanceStartTime: "",
      maintenanceEndTime: "",
      edition: sessionStorage.getItem("HOME_EDITION") || EDITION.NORMAL
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
    }
  }
});
