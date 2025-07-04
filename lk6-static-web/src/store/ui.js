import { defineStore } from "pinia";

/**
 * @typedef {Object} NotificationOptions
 * @property {'success'|'error'|'warning'|'red-packet'|'info'} type - The type of notification.
 * @property {Object} [params] - Additional parameters for the notification.
 * @property {String} [message] - The notification message.
 * @property {Number} [duration] - The notification duration.
 * @property {Function} [onClose] - The notification close callback.
 */

export const uiStore = defineStore("ui-store", {
  state: () => {
    return {
      title: "",
      footer: true,
      orientation: "landscape",
      downloadUrl: "",
      innerWidth: window.innerWidth,
      notificationQueue: [],
      notificationZIndex: 2000,
      maintenanceStartTime: "",
      maintenanceEndTime: "",
      isGameModalOpened: false,
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
    setTitle(title) {
      this.title = title;
    },
    /**
     * Adds a notification to the queue with a unique ID and z-index.
     *
     * @param {NotificationOptions} options - The notification options.
     */
    notify(options) {
      const id = `${Date.now()}-${Math.floor(Math.random() * 100)}`;
      this.notificationQueue.push({
        ...options,
        id,
        zIndex: this.notificationZIndex++,
        duration: options.duration ?? 3000
      });
    },
    async removeNotification(id) {
      const index = this.notificationQueue.findIndex((notification) => notification.id === id);
      if (index < 0) return;
      if (this.notificationQueue[index].onClose) await this.notificationQueue[index].onClose();
      this.notificationQueue.splice(index, 1);
    }
  }
});
