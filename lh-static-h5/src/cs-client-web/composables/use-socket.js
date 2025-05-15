/* eslint-disable */
import { getCurrentInstance } from "vue";
import strEncrypt from "src/cs-client-web/utils/str-encrypt";
import strDecrypt from "src/cs-client-web/utils/str-decrypt";
import { strToJSON } from "src/cs-client-web/utils/string";

const ENCRYPT_ENABLE = process.env.ENCRYPT_ENABLE;
const IS_PROD = process.env.NODE_ENV === "production";
// const IS_PROD= true;

export default function useSocket() {
  const { proxy, appContext } = getCurrentInstance();

  return {
    proxy,
    wsConnect(url) {
      // console.log("CONNECT SOCKET YAH");
      // console.log(url);
      appContext.config.globalProperties.$connect(url);
    },
    wsDisconnect() {
      // console.log("DISCONNECT YEAH");
      appContext.config.globalProperties.$disconnect();
    },
    socketOnMessage(fn) {
      proxy.$socket.onmessage = (res) => {
        // console.log("Receive Msg");
        let payload = res.data;
        // console.log(payload);

        //接收解密
        if (ENCRYPT_ENABLE) {
          // console.log("RECEIVE: ");

          payload = strDecrypt(payload);
          console.log(payload);
        }

        fn(strToJSON(payload));
      };
    },
    socketSendObj(obj) {
      // console.log("Send MSg");
      // console.log(obj);

      //发送加密
      if (ENCRYPT_ENABLE) {
        // console.log("Encrypt");
        // console.log(obj);

        let str = JSON.stringify(obj);
        let encryptedStr = strEncrypt(str);

        proxy.$socket.send(encryptedStr);
        return;
      }

      proxy.$socket.sendObj(obj);
    }
  };
}
