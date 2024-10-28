import { WebSocketActionTypes } from "@/store/modules/socket/action-types";
import { SOCKET_REMOVE_EVENT } from "@/store/modules/socket/mutation-types";

export const actions = {
  [WebSocketActionTypes.REMOVE_SOCKET_EVENTS]({ commit }, messageToRemove) {
    commit(SOCKET_REMOVE_EVENT, messageToRemove);
  },
};
