import { Notify, useQuasar } from "quasar";
/**
 * @typedef {Object} NotifyObj
 * @property {(message: string) => void} NotifyObj.success - Adds a success notification to the queue.
 * @property {(message: string) => void} NotifyObj.info - Adds an info notification to the queue.
 * @property {(message: string) => void} NotifyObj.error - Adds an error notification to the queue.
 * @property {(message: string) => void} NotifyObj.warning - Adds a warning notification to the queue.
 * @property {(message: string, redPacket: Object) => void} NotifyObj.redPacket - Adds a red packet notification to the queue.
 */

/**
 * @returns {NotifyObj & Notify}
 */
export const useNotify = () => {
  const $q = useQuasar();
  const notify = $q.notify;

  notify.success = (message) =>
    notify({
      type: "positive",
      message,
      position: "top",
      icon: "check_circle_outline"
    });

  notify.error = (message) =>
    notify({
      type: "negative",
      message,
      position: "top",
      icon: "report_problem"
    });

  notify.warning = (message) =>
    notify({
      type: "warning",
      message,
      position: "top",
      icon: "report_problem"
    });

  notify.info = (message) =>
    notify({
      type: "info",
      message,
      position: "top",
      icon: "info"
    });

  notify.redPacket = (message, redPacket) =>
    notify({
      type: "positive",
      message: `领取彩金成功！彩金：${redPacket}元`,
      position: "top",
      icon: "check_circle_outline"
    });

  return notify;
};
