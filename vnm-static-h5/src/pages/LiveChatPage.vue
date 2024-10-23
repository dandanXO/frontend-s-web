<template>
  <q-page>
  </q-page>
</template>

<script setup>
import { onMounted } from "vue";
import { userStore } from "stores/index";
import { cached } from "boot/cache";
import { api } from "boot/axios";
import CsClient from "csweb-client";

const store = userStore();

let csclient;
let CSAUrl;

const getCSA = () => {
  cached
    .get("customerAddress", () =>
      api.get("/config/customerAddress/v2").then((res) => {
        return res;
      })
    )
    .then((data) => {
      var url;
      const randNum = Math.floor(Math.random() * 2) + 1;
      if (randNum === 1) {
        url = data.liveUrl1;
      } else {
        url = data.liveUrl2;
      }
      const urlData = new URL(url);

      // debugger;
      CSAUrl = urlData.hostname;
      initCsWeb();
      console.log(CSAUrl);
    })
    .catch((err) => {
      console.log(err);
      CSAUrl = "csweb01.c8nhwrqx4.com";
    });
};

const initCsWeb = () => {
  var regDevice = store.getDeviceType();
  csclient = new CsClient("TF88", regDevice, "vn", "2", "prod", `https://${CSAUrl}`);

  csclient.set("bottom", "77");
  csclient.set("pageurl", "/liveChat");
  csclient.set("btnid", "cs-web-id");
  csclient.set("openanimation", false);

  csclient.set("notification-type", {
    type: "none"
  });

  if (store.token) {
    csclient.set("token", store.token);
  }

  //客服初始化。
  csclient.init();

  csclient.receiveListener("message", function (callback) {
    //收到新消息。
    // alert(callback);
  });

  //CsClient Event Listener.
  window.addEventListener("message", function (event) {
    // console.log("HEre Message received from the iframe: " + event.data); // Message received from child
    if (_.isString(event.data)) {
      // if (event.data == 'sess_timeout') {
      //   router.push({ path: "/" });
      // }
    }
  });
};

onMounted(() => {
  getCSA();
});
</script>
<style scoped></style>
