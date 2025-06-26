import { defineStore } from "pinia";

export const usePromoStore = defineStore("promo", {
  state: () => {
    return {
      shownFloatingOrDialogList: []
    };
  },
  actions: {
    addShownFloatingOrDialogList(promoCode) {
      this.shownFloatingOrDialogList.push(promoCode);
    }
  },
  getters: {
    isShownSpinLuckyWheel(state) {
      return state.shownFloatingOrDialogList.includes("spin-lucky-wheel");
    },
    isShownNewPlayerWheel(state) {
      return state.shownFloatingOrDialogList.includes("newplayer-spin-wheel");
    }
  }
});
