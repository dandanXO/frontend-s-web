<template>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    "
  >
    <a-spin />
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useQuasar, Platform } from "quasar";
import { api } from "boot/axios";
const $q = useQuasar();
// import { launchSessionGame } from "@/api/platform/platform";

onMounted(() => {
  $q.loading.show({ message: "正加载页面" });
  const params = localStorage.getItem("sportsSession");
  var sport = params ? JSON.parse(params) : "";

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
      params: { platform: sport.name, isMobile: sport.isMobile, way: way }
    })
    .then((response) => {
      if (response.code === 0) {
        location.href = response.data;
      } else {
      }
      $q.loading.hide();
    });
  // launchSessionGame(sport.name, { isMobile: sport.isMobile })
  //   .then((d) => {
  //     if (d.code == 0) {
  //       location.href = d.data;
  //       // newWin.location.href = d.data;
  //       // newWin.location.href = resp
  //       // const copy = { ...form };
  //       // const data = {};
  //       // Object.entries(copy).forEach(([key, value]) => {
  //       //   if (value) {
  //       //     data[key] = value;
  //       //   }
  //       // });
  //       // data.bankCardId = 0;
  //       // pDepo(data);
  //     }
  //   })
    // .catch((error) => {
    //   window.opener.postMessage({ pmsg: error.message }, "*");
    //   window.close();
    // });
});
</script>
