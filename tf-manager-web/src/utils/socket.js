import { useStore } from "../store";
import { SOCKET_ONCLOSE, SOCKET_ONERROR, SOCKET_ONMESSAGE, SOCKET_ONOPEN } from "../store/modules/socket/mutation-types";
import { globals } from '../main.js'

const store = useStore();

export class Socket {
  constructor(store) {
    this.store = store
    this.timeout = 2 * 1000
    this.timeoutObj = null
    this.serverTimeoutObj = null
    this.timeoutNum = null
  }

  async connection() {
    const wssSocket = globals.$baseWss;
    this.webSocket = new WebSocket(`${wssSocket}/ws/notice`);
    this.webSocket.onmessage = message => {
      const data = JSON.parse(message.data);
      if (data.event === 'HEARTBEAT') {
        this.reset();
      } else {
        this.store.commit(SOCKET_ONMESSAGE, data);
      }
    };
    this.webSocket.onopen = ev => {
      this.start();
      this.store.commit(SOCKET_ONOPEN, ev);
      this.webSocket.send(store.state.user.siteId ? store.state.user.siteId : 0);
    };
    this.webSocket.onerror = ev => { this.reconnect(); this.store.commit(SOCKET_ONERROR, ev); };
    this.webSocket.onclose = ev => { this.reconnect(); this.store.commit(SOCKET_ONCLOSE, ev) };
  }

  reconnect() {
    if (this.lockReconnect) return;
    this.lockReconnect = true;
    this.timeoutNum && clearTimeout(this.timeoutNum);
    this.timeoutNum = setTimeout(() => {
      this.connection().then(() => { this.lockReconnect = false });
    }, 5000);
  }

  reset() {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    this.start();
  }

  start() {
    this.timeoutObj && clearTimeout(this.timeoutObj);
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
    this.timeoutObj = setTimeout(() => {
      if (this.webSocket && this.webSocket.readyState === 1) {
        this.webSocket.send("999"); // heartbeat
      } else {
        this.reconnect();
      }
      this.serverTimeoutObj = setTimeout(() => {
        this.webSocket.close();
      }, this.timeout);
    }, this.timeout);
  }
}
