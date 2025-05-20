/* eslint-disable */
import { defineStore, acceptHMRUpdate } from "pinia";
import { Notify } from "quasar";
import { t } from "src/boot/i18n";
import strEncrypt from "src/cs-client-web/utils/str-encrypt";
import LocalStorage from "src/cs-client-web/utils/local-storage";
import moment from "moment";

const ENCRYPT_ENABLE = process.env.ENCRYPT_ENABLE;
const IS_PROD = process.env.NODE_ENV === "production";
// const IS_PROD= true;

export const useSocketStore = defineStore("socket", {
  state: () => ({
    url: "",
    appConfig: null,
    // 连接状态
    isConnected: false,
    isInternet: false,
    // 消息内容
    message: "",
    // 重新连接错误
    reconnectError: false,
    duplicateTabError: false,
    // 心跳消息发送时间
    heartBeatInterval: 30000,
    // 心跳定时器
    heartBeatTimer: 0
  }),
  actions: {
    // 连接打开
    SOCKET_ONOPEN(event) {
      console.log("接口连接成功");
      this.appConfig.globalProperties.$socket = event.currentTarget;
      this.isConnected = true;
      this.isInternet = true;
      // 连接成功时启动定时发送心跳消息，避免被服务器断开连接
      this.heartBeatTimer = window.setInterval(() => {
        console.log("心跳消息");
        if (this.isConnected) {
          let obj = {
            cmd: 0
          };

          if (ENCRYPT_ENABLE) {
            let str = JSON.stringify(obj);
            let encryptedStr = strEncrypt(str);
            this.appConfig.globalProperties.$socket.send(encryptedStr);
          } else {
            this.appConfig.globalProperties.$socket.sendObj(obj);
          }
        }
      }, this.heartBeatInterval);
    },
    // 连接关闭
    SOCKET_ONCLOSE(event) {
      this.isConnected = false;
      // 连接关闭时停掉心跳消息
      window.clearInterval(this.heartBeatTimer);
      this.heartBeatTimer = 0;
      console.log("连接已断开: " + new Date());
      // console.log(event);
      LocalStorage.set("dc_time", moment().unix());
    },
    // 发生错误
    SOCKET_ONERROR(event) {
      console.log("发生错误");
      console.error(event);
      this.duplicateTabError = true;
    },
    // 收到服务端发送的消息
    SOCKET_ONMESSAGE(message) {
      // console.log('sa', message);
      this.message = message;
    },
    // 自动重连
    SOCKET_RECONNECT(count) {
      console.info("消息系统重连中...", count);
      Notify.create({
        message: t("socket.reconnecting")
      });
    },
    // 重连错误
    SOCKET_RECONNECT_ERROR() {
      this.reconnectError = true;
    }
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSocketStore, import.meta.hot));
}
