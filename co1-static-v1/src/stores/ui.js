import { defineStore } from "pinia";

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
      adjust_register_event: "",
      maintenanceStartTime: "",
      maintenanceEndTime: "",
      firstScreenLoading: !!sessionStorage.getItem("FIRST_SCREEN_CACHE") || true
    };
  },
  actions: {
    setScrollPosition: (_axis = "vertical", _offset = 0, _duration = 0) => null,
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
