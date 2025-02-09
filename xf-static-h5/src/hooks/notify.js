import { useUI } from 'src/stores/ui';

/**
 * @typedef {Object} NotifyObj
 * @property {(message: string) => void} NotifyObj.success - Adds a success notification to the queue.
 * @property {(message: string) => void} NotifyObj.info - Adds an info notification to the queue.
 * @property {(message: string) => void} NotifyObj.error - Adds an error notification to the queue.
 * @property {(message: string) => void} NotifyObj.warning - Adds a warning notification to the queue.
 * @property {(message: string, redPacket: Object) => void} NotifyObj.redPacket - Adds a red packet notification to the queue.
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
