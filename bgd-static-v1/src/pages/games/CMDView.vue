<template>

<q-scroll-area
  ref="scrollPageRef"
  style="height: calc(100% - 60px); margin-bottom: env(safe-area-inset-bottom, 40px); padding-bottom: env(safe-area-inset-top, 40px);"
>
  <div class="c" style="position: relative; height: 100%;">
    <iframe
          @load="loadGame()"
          :src="src"
          frameborder="0"
          scrolling="yes"
          style="width: 100%; height: 90%;"
        ></iframe>
  </div>
</q-scroll-area>
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
  $q.loading.show({ message: "正加载页面" });

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
          location.href = response.data;
        } else {
        }
        $q.loading.hide();
      });
  }
  //  else {
  //   launchGame("UG", { isMobile: isMobile() }).then((ret) => {
  //     src.value = ret.data;
  //   });
  // }
  // else {
  //   router.push({ name: "login", query: { redirect: route.path } });
  // }
});
</script>

<style scoped lang="scss">
// .sport-container {
//   background: linear-gradient(to bottom, #23263c, #190f25);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   .sports-iframe {
//     width: 100%;
//     min-height: calc(100vh - 40px); padding-bottom: env(safe-area-inset-bottom, 40px);
//     overflow: auto !important;
//   }
// }
// .sport-container {
//   // background-image: url("../../assets/images/index/index_bg.png");
//   // background-size: cover;
//   // background-repeat: no-repeat;
//   background: linear-gradient(to bottom, #23263c, #190f25);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   height: 90vh;

//   .sports-iframe {
//     width: 100%;
//     height: 100%;
//     min-height: 980px;
//     margin: 0 auto;
//     display: block;
//   }
// }
//
</style>
<style scoped lang="scss">
// @media (max-width: 768px) {
//   .sport-container {
//     width: 100%;
//     padding: 0;
//     margin: 0;

//     .sports-iframe {
//       width: 100%;
//     }
//   }
// }
//
// .iFrameFull {
//   height: calc(100vh - (59px + env(safe-area-inset-top, 44px) + env(safe-area-inset-bottom, 44px)));
//   // margin-bottom: 59px + env(safe-area-inset-top, 44px);
// }
// $top: 46px;
.container {
  height: 100%; /* Fallback */
  height: -moz-available;
  height: stretch; /* Latest specification */
}
#sportsForm {
  // width: 100%;
  // height: 100%;
  // margin-bottom: env(safe-area-inset-bottom, 44px);
  // overflow: hidden;
  // overflow: hidden;
  // width: 100%;
  // position: absolute;
  // bottom: 0 + env(safe-area-inset-bottom, 44px);
  // top: $top + env(safe-area-inset-top, 44px);
  // right: 0;
  // height: calc(100vh - (46px + env(safe-area-inset-bottom, 44px) + env(safe-area-inset-top)));
  // left: 0;
  // .content {
  //   height: 100%;
  //   overflow-y: auto;
  // }
}
</style>
