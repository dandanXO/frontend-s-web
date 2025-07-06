<template>
<q-page>
<!-- <iframe
    :src="'https://csweb01.amv4xjcbd.com/?partnerId=5&lang=th&way=' + regDevice + '&token=' + store.token"
    title="description"
  ></iframe> -->
<!--    <iframe-->
<!--    :src="'https://csweb01.c8nhwrqx4.com/?partnerCode=DYCS&lang=zh-CN&way=' + regDevice + '&token=' + store.token"-->
<!--    title="description"-->
<!--  ></iframe>-->
  <!-- <div class="iFrameFull">
  </div> -->
</q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar, Platform } from "quasar"
import { userStore } from "stores/index"

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const store = userStore();
    const regDevice = Platform.is.mobile ? "H5" : "WEB"
    return {
      regDevice,
      store
    }
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
