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
    },
    removeShownFloatingOrDialogList(promoCode) {
      this.shownFloatingOrDialogList = this.shownFloatingOrDialogList.filter(
        code => code !== promoCode
      );
    }
  },
  getters: {
    isShownSpinLuckyWheel(state) {
      return state.shownFloatingOrDialogList.includes("spin-lucky-wheel");
    }
  }
});
