import { Notify } from "quasar";
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
  const notify = (option) => {
    const { type } = option;

    switch (type) {
      case "success":
        Notify.create({
          ...option,
          type: "positive",
          position: "top",
          icon: "check_circle_outline"
        });
        break;
      case "error":
        Notify.create({
          ...option,
          type: "negative",
          position: "top",
          icon: "report_problem"
        });
        break;
      case "warning":
        Notify.create({
          ...option,
          type: "warning",
          position: "top",
          icon: "report_problem"
        });
        break;
      case "info":
        Notify.create({
          ...option,
          type: "info",
          position: "top",
          icon: "info"
        });
        break;
      case "redPacket":
        Notify.create({
          ...option,
          message: `领取彩金成功！彩金：${option.params.redPacket}元`,
          type: "positive",
          position: "top",
          icon: "check_circle_outline"
        });
        break;
      case "red-packet":
        Notify.create({
          ...option,
          message: `领取奖金成功！奖金：${option.params.redPacket}元`,
          type: "positive",
          position: "top",
          icon: "check_circle_outline"
        });
        break;
      default:
    }
  };

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
