import { useStore } from "../store";
import { SOCKET_ONCLOSE, SOCKET_ONERROR, SOCKET_ONMESSAGE, SOCKET_ONOPEN } from "../store/modules/socket/mutation-types";

const store = useStore();

export class Socket {
  constructor(store) {
    this.store = store
  }

  async connection() {
    this.webSocket = new WebSocket(`${process.env.VUE_APP_SOCKET}/ws/notice`);
    this.webSocket.onmessage = message => {
      const data = JSON.parse(message.data);
      this.store.commit(SOCKET_ONMESSAGE, data);
    };
    this.webSocket.onopen = ev => {
      this.store.commit(SOCKET_ONOPEN, ev);
      this.webSocket.send(store.state.user.siteId ? store.state.user.siteId : 0);
    };
    this.webSocket.onerror = ev => this.store.commit(SOCKET_ONERROR, ev);
    this.webSocket.onclose = ev => this.store.commit(SOCKET_ONCLOSE, ev);
  }
}
