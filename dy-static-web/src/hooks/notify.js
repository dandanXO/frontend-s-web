import { ElMessage } from "element-plus";

/**
 * @typedef {Object} NotifyObj
 * @property {(redPacket: number) => void} NotifyObj.redPacket - Adds a red packet notification to the queue.
 */

/**
 * @returns {NotifyObj & ElMessage}
 */
export const useNotify = () => {
  const notify = ElMessage;
  notify.redPacket = (message, redPacket) => notify.success(`领取彩金成功！彩金：${redPacket}元`);

  return notify;
};
