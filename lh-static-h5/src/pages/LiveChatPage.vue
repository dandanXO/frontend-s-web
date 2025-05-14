<template>
  <q-page>
    <!--    <iframe-->
    <!--    :src="'https://csweb01.v6kthwlug.com/?partnerCode=XFCS&lang=zh-CN&way=' + regDevice + '&token=' + store.token"-->
    <!--    title="description"-->
    <!--  ></iframe>-->
    <!-- <div class="iFrameFull">
  </div> -->
  </q-page>
</template>

<script>
import { defineComponent, onActivated, onMounted, ref } from "vue";
import { useQuasar, Platform } from "quasar";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const store = userStore();
    const ui = useUI();
    const regDevice = store.getDeviceType();

    onMounted(() => {
      if (isSafari12OrLower()) {
        // alert("TIS")
        const newWin = window.open(`/`, "_self");
        if (newWin) {
          newWin.location.href = `https://${ui.CSAUrl}?partnerCode=LHCS&lang=zh-CN`;
        }
      }
    });

    function isSafari12OrLower() {
      var safariVersion = getSafariVersion();
      return safariVersion > 0 && safariVersion <= 12;
    }

    function getSafariVersion() {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf("safari") !== -1) {
        if (ua.indexOf("version") !== -1) {
          return parseInt(ua.split("version/")[1].split(" ")[0]);
        } else {
          return parseInt(ua.split("safari/")[1].split(" ")[0]);
        }
      }
      return -1; // 非 Safari 浏览器
    }

    return {
      regDevice,
      store
    };
  }
});
</script>
<style scoped>
.iFrameFull {
  /* height: calc(100vh - 120px); */
  /* height: calc(100vh - 59px - env(safe-area-inset-top, 40px) - env(safe-area-inset-bottom, 59px) );
  padding-bottom: env(safe-area-inset-top, 59px); */
  /* height: calc(100vh - (env(safe-area-inset-top, 44px) + env(safe-area-inset-bottom, 59px) + 100px));
  padding-bottom: 44px + env(safe-area-inset-top, 44px); */
}
iframe {
  width: 100%;
  /* height: 100%; */
  /* height: calc(100vh - 111px); */
  /* height: 100%;
  overflow: auto; */
  /* height: calc(100vh - 120px - env(safe-area-inset-top, 40px) - env(safe-area-inset-bottom, 59px) );
  padding-bottom: 120px; */
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
}
</style>
