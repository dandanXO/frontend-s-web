import { defineStore } from "pinia";

export const uiStore = defineStore("ui-store", {
  state: () => {
    return {
      title: "",
      footer: true,
      orientation: "landscape",
      maintenanceStartTime: "",
      maintenanceEndTime: "",
      notificationQueue: [],
      notificationZIndex: 2000,

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
    notify(options) {
      const id = `${Date.now()}-${Math.floor(Math.random() * 100)}`;
      this.notificationQueue.push({
        ...options,
        id,
        zIndex: this.notificationZIndex++,
        duration: options.duration ?? 3000
      });
    },
    setTitle(title) {
      this.title = title;
    }
  }
});
