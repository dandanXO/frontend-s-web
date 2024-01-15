import { SOCKET_ONCLOSE, SOCKET_ONERROR, SOCKET_ONMESSAGE, SOCKET_ONOPEN } from "./mutation-types";

export const mutations = {
  [SOCKET_ONOPEN](state, event) {
    console.log(`${event.currentTarget.url} 连接成功`);
    state.isConnected = true
  },
  [SOCKET_ONCLOSE](state, event) {
    console.log(`${event.currentTarget.url} 连接关闭`);
    state.isConnected = false
  },
  [SOCKET_ONERROR](state, event) {
    console.error(`${event.currentTarget.url} 连接异常`);
  },
  [SOCKET_ONMESSAGE](state, message) {
    console.log(`${event.currentTarget.url} 接收消息 %O`, message);
    if (message.event === 'HEARTBEAT') {
      return;
    }
    let added = false;
    if (message.event === 'MENU') {
      sessionStorage.setItem(message.menuItem, message.itemCount)
    } else if (message.event !== 'REMOVE') {
      if (sessionStorage.getItem(message.event)) {
        sessionStorage.setItem(message.event, parseInt(sessionStorage.getItem(message.event)) + 1);
      } else {
        sessionStorage.setItem(message.event, 1)
      }
    }
    state.event.forEach(e => {
      if (message.event === e.event) {
        state.event.splice(state.event.indexOf(e), 1, message);
        added = true;
      }
    })
    if (!added) {
      state.event.push(message);
    }
  },
};
