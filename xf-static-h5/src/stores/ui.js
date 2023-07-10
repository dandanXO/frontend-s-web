import { defineStore } from "pinia";
import { useRoute } from "vue-router";

export const useUI = defineStore("ui-store", {
  state: () => {
    return {
      drawerRight: false,
      footer: true,
      orientation: 'landscape',
      pageName: '优惠详细信息',
      slotLists: []
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
    changePromoName(name) {
       this.pageName = name
    }
  }
});
