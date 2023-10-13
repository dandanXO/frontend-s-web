<template>
  <router-view/>
</template>

<script>
import {defineComponent, onMounted} from "vue";
import {Platform, useQuasar} from "quasar";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {api} from "boot/axios";
import CsClient from "csweb-client";
// import CsClient from "boot/client";
import {userStore} from "stores/index";
import * as _ from "lodash";
import {useRouter} from "vue-router";
import {cached} from "boot/cache";

export default defineComponent({
  name: "App",
  setup() {
    var qs = require("qs")
    const router = useRouter();
    const $q = useQuasar();
    $q.dark.set(true);
    $q.screen.setSizes({ sm: 500, md: 768, lg: 991, xl: 1280 })

    const checkSID = () => {
      const affiliateItem = sessionStorage.getItem("AFFILIATE_CODE");
      const fpPromise = FingerprintJS.load();
      (async () => {
        const fp = await fpPromise;
        const result = await fp.get();
        const excludes = {value: ["timezone", "timeZoneOffset"]};
        const allComponents = {...result.components};
        excludes.value.forEach((element) => {
          delete allComponents[element];
        });
        const sidParam = FingerprintJS.hashComponents(allComponents);
        const obj = {
          identifier: sidParam,
          affiliateCode: affiliateItem,
        };
        api.post('/memberAccessLog', qs.stringify(obj)).then((res) => {
          if (res.code === 0) {
          }
        })
      })();
    };

    const store = userStore();

    const regDevice = (Platform.is.mobile && Platform.is.capacitor) ? "ANDROID" : Platform.is.mobile ? "H5" : "WEB"

    let csclient;
    const initCsWeb = () => {
      csclient = new CsClient('5', regDevice, 'th', '2', 'prod');

      csclient.set('pageurl', '/liveChat');
      csclient.set("btnid", "cs-web-id");
      csclient.set('notification-type', {
        "type": "breathing",
        "color": "#FB4BFF",
      });

      if (store.token) {
        csclient.set('token', store.token);
      }

      //客服初始化。
      csclient.init();

      csclient.receiveListener("message", function(callback){
        //收到新消息。
        // alert(callback);
      });

      //CsClient Event Listener.
      window.addEventListener('message', function (event) {
        // console.log("Message received from the iframe: " + event.data); // Message received from child
        if (_.isString(event.data)) {
          if (event.data == 'closenotice') {
            router.go(-1);
          }
        }
      });

    }

    // const getCSA = () => {
    //   cached.get("customerAddress", () => api.get("/config/customerAddress").then((res) => {
    //     return res
    //   })).then((data) => {
    //     // console.log("here");
    //     // console.log(data);
    //     const url = new URL(data);
    //     CSAUrl = url.hostname;
    //     initCsWeb();
    //     console.log(CSAUrl)
    //   }).catch((err) => {
    //     console.log(err);
    //     CSAUrl = "csweb01.c8nhwrqx4.com";
    //   });
    // };

    const initStorage = () => {
      localStorage.removeItem("LINE_STICKY_OFF")
    }

    onMounted(() => {
      checkSID()
      initCsWeb();
      initStorage();
      // getCSA();
    })
  }
});
</script>
