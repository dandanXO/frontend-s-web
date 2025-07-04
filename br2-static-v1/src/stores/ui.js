import { defineStore } from "pinia";
import { useRoute } from "vue-router";

/**
 * @typedef {Object} NotificationOptions
 * @property {'success'|'error'|'warning'|'red-packet'|'info'} type - The type of notification.
 * @property {Object} [params] - Additional parameters for the notification.
 * @property {String} [message] - The notification message.
 * @property {String} [confirmBtnText] - The text of confirm button.
 * @property {String} [cancelBtnText] - The text of cancel button.
 * @property {string[]} actions - The actions of notification. Default: ['confirm', 'cancel']
 */

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
      firstScreenLoading: !!sessionStorage.getItem("FIRST_SCREEN_CACHE") || true,
      loginView: "",
      promoBg: "",
      hideDownload: false,
      jackpotAmt: 0,
      notificationQueue: [],
      notificationZIndex: 9500,
      duringNotificationAnimation: false
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
    /**
     * Adds a notification to the queue with a unique ID and z-index.
     *
     * @param {NotificationOptions} options - The notification options.
     */
    notify(options) {
      return new Promise((resolve, reject) => {
        const id = `${Date.now()}-${Math.floor(Math.random() * 100)}`;
        const notificationOjb = {
          ...options,
          id,
          zIndex: this.notificationZIndex++,
          actions: options.actions || ["confirm", "cancel"],
          _onConfirm: () => resolve({ type: "confirm" }),
          _onCancel: () => resolve({ type: "cancel" })
        };
        this.notificationQueue.push(notificationOjb);
      });
    },
    async removeNotification(id, type) {
      console.log(id);
      const index = this.notificationQueue.findIndex((notification) => notification.id === id);
      if (index < 0) return;

      const notification = this.notificationQueue[index];
      this.duringNotificationAnimation = true;

      setTimeout(() => {
        if (type === "confirm" && typeof notification._onConfirm === "function") {
          notification._onConfirm();
        }
        if (type === "cancel" && typeof notification._onCancel === "function") {
          notification._onCancel();
        }

        const currentIndex = this.notificationQueue.findIndex(n => n.id === id);
        if (currentIndex >= 0) {
          this.notificationQueue.splice(currentIndex, 1);
        }

        this.duringNotificationAnimation = false;
      }, 500);
    }
  }
});
