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
    // fixed: Each time the selectedSiteId is switched, a new connection is created by triggering the reload() function but do not close old connection.
    if (this.webSocket && this.webSocket.readyState === 1 && new URL(this.webSocket.url).pathname === '/ws/notice') {
      this.webSocket.close(); // trigger onclose event
      console.log('Closed the existing WebSocket connection.');
      return
    }
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
      this.webSocket.send(JSON.stringify({
        type: "CACHE_SYSTEM_USER_INFO",
        content: {
          systemUserId: store.state.user.id,
          systemUserPermissions: store.state.user.permissions,
          systemUserType: store.state.user.userType,
          systemUserSiteId: store.state.user.siteId,
        }
      }));
    };
    this.webSocket.onerror = ev => { this.reconnect(); this.store.commit(SOCKET_ONERROR, ev); };
    this.webSocket.onclose = ev => { this.reconnect(); this.store.commit(SOCKET_ONCLOSE, ev) };
  }

  sendWSMessage(jsonStr) {
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.send(jsonStr);
    } else {
      console.error("WebSocket is not open.");
    }
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
