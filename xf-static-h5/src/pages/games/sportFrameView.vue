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
  $q.loading.show({ message: "正在加载页面" });

  if (store.hasToken()) {
    const isMobile = Platform.is.mobile;
    if (isMobile) {
      var way = null
      if (Platform.is.android) {
        way = "ANDROID"
      } else if (Platform.is.ios) {
        way="IOS"
      }
    }
    api
        .get(`/session/launch?_time=${new Date().getTime()}`, {
          params: { platform: "SABA", isMobile: isMobile, way: way }
        })
        .then((response) => {
          if (response.code === 0) {
            src.value = response.data;
          } else {
          }
          $q.loading.hide();
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
