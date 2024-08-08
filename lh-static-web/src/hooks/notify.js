import { uiStore } from "@/store/ui";

/**
 * @typedef {Object} NotifyObj
 * @property {(message: string) => void} NotifyObj.success - Adds a success notification to the queue.
 * @property {(message: string) => void} NotifyObj.info - Adds an info notification to the queue.
 * @property {(message: string) => void} NotifyObj.error - Adds an error notification to the queue.
 * @property {(message: string) => void} NotifyObj.warning - Adds a warning notification to the queue.
 * @property {(message: string, redPacket: Object) => void} NotifyObj.redPacket - Adds a red packet notification to the queue.
 */

/**
 * @typedef {(options: import('@/store/ui').NotificationOptions) => void} Notify
 */

/**
 * @returns {NotifyObj & Notify}
 */
export const useNotify = () => {
  const ui = uiStore();
  const notify = ui.notify;

  const notifyWithPresetType = (messageOrOptions, presetType, params) =>
    typeof messageOrOptions === "string"
      ? notify({ message: messageOrOptions, type: presetType, params })
      : notify({ params, ...messageOrOptions, type: presetType });

  notify.success = (message) => notifyWithPresetType(message, "success");
  notify.info = (message) => notifyWithPresetType(message, "info");
  notify.error = (message) => notifyWithPresetType(message, "error");
  notify.warning = (message) => notifyWithPresetType(message, "warning");
  notify.redPacket = (message, redPacket) => notifyWithPresetType(message, "red-packet", { redPacket });

  return notify;
};
