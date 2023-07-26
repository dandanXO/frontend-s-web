<template>
  <q-scroll-area style="height: 90vh">
    <div class="esport-container">
      <iframe
        @load="loadGame()"
        v-show="!logoShow"
        :src="src"
        id="esportsForm"
        allowfullscreen="true"
        scrolling="no"
        frameborder="0"
        class="esports-iframe animate__animated animate__fadeIn"
      ></iframe>
    </div>
  </q-scroll-area>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { userStore } from "stores/index";
import { useQuasar, Platform } from "quasar";
import { api } from "boot/axios";

const $q = useQuasar();
let src = ref("");
const store = userStore();
const logoShow = ref(true);

const loadGame = () => {
  if (src.value !== "") {
    logoShow.value = false;
  }
};

onMounted(() => {
  $q.loading.show({ message: "正在加载页面" });
  if (store.token) {
    const isMobile = Platform.is.mobile;
    // launchSessionGame("TFGaming").then((ret) => {
    //   src.value = ret.data;
    // });
    api
      .get(`/session/launch?_time=${new Date().getTime()}`, {
        params: { platform: "TFGaming", gameCode: null, isMobile: isMobile }
      })
      .then((response) => {
        if (response.code === 0) {
          src.value = response.data;
        } else {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: res.message,
          //   icon: "report_problem"
          // });
        }
        $q.loading.hide();
      });
  } else {
    api
      .get(`/session/launch`, {
        params: { platform: "TFGaming", gameCode: null, isMobile: isMobile }
      })
      .then((response) => {
        src.value = response.data;
      });
  }
  //  else {
  //   launchGame("TFGaming").then((ret) => {
  //     src.value = ret.data;
  //   });
  // }
});
</script>

<style scoped lang="scss">
.esport-container {
  // background-image: url("../../assets/images/index/index_bg.png");
  // background-size: cover;
  // background-repeat: no-repeat;
  background: linear-gradient(to bottom, #23263c, #190f25);

  display: flex;
  align-items: center;
  justify-content: center;
  .esports-iframe {
    width: 100%;
    min-height: 100%;
    overflow: auto !important;
  }
}
</style>
//
<style scoped lang="scss">
// @media (max-width: 768px) {
//   .esport-container {
//     height: 100%;
//     height: calc(100vh - 100px);
//     width: 100%;
//     padding: 0;
//     margin: 0;
//     // min-height: 600px;
//     .esports-iframe {
//       width: 100%;
//     }
//   }
// }
//
</style>
