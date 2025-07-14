import { defineStore } from "pinia";

export const usePromoStore = defineStore("promo", {
  state: () => {
    return {
      shownFloatingOrDialogList: [],
      isShowSticky: false
    };
  },
  actions: {
    addShownFloatingOrDialogList(promoCode) {
      this.shownFloatingOrDialogList.push(promoCode);
    },
    removeShownFloatingOrDialogList(promoCode) {
      this.shownFloatingOrDialogList = this.shownFloatingOrDialogList.filter((code) => code !== promoCode);
    },
    setIsShowSticky(value) {
      this.isShowSticky = value;
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
