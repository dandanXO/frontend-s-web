import { useUI } from "src/stores/ui";

/**
 * @typedef {Object} NotifyObj
 */

/**
 * @typedef {(options: import('stores/ui').NotificationOptions) => void} Notify
 */

/**
 * @returns {NotifyObj & Notify}
 */
export const useNotify = () => {
  const ui = useUI();
  const notify = ui.notify;

  return notify;
};
