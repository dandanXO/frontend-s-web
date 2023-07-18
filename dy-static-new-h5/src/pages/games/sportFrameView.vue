<template>
<q-page>
    <iframe
          @load="loadGame()"
          :src="src"
          frameborder="0"
        ></iframe>
</q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import { useQuasar, Platform } from "quasar";
import { api } from "boot/axios";
const $q = useQuasar();
const router = useRouter();
const route = useRoute();
let src = ref("");
const store = userStore();
const loadGame = () => {
  if (src.value !== "") {
    $q.loading.hide();
  }
};
onMounted(() => {
// && !store.isInitEsport
  if (store.hasToken()) {
    $q.loading.show({ message: "正加载页面" });

    const isMobile = Platform.is.mobile;
    var way = null;
    if ("standalone" in window.navigator && window.navigator.standalone) {
      way = "IOS";
    } else {
      way = Platform.is.mobile ? "H5" : "WEB";
      if (Platform.is.capacitor) {
        if (Platform.is.android) {
          way = "ANDROID";
        }
      }
    }

    api
        .get(`/session/launch?_time=${new Date().getTime()}`, {
          params: {
            platform: "TFGaming",
            isMobile: Platform.is.mobile ? true : false,
            way: way
          }
        })
        .then((response) => {
          $q.loading.hide();
          store.isInitEsport = true;
          src.value = response.data;
        });


  }
});
</script>

<style scoped>
  iframe {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
</style>
