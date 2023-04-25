<template>
  <div>
    <div class="sport-container">
      <TFLoading v-show="logoShow"></TFLoading>
      <iframe
        @load="loadGame()"
        v-show="!logoShow"
        :src="src"
        id="sportsForm"
        frameborder="0"
        class="sports-iframe animate__animated animate__fadeIn"
      ></iframe>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { launchSessionGame } from "@/api/platform/platform";
import { userStore } from "@/store";
import { isMobile } from "@/utils/utils";
import TFLoading from "@/components/loading/TFLoading";

const router = useRouter();
const route = useRoute();
let src = ref("");
const store = userStore();

const logoShow = ref(true);

const loadGame = () => {
  if (src.value !== "") {
    logoShow.value = false;
  }
};

onMounted(() => {
  if (store.token) {
    // const form = {
    //   namme: "SABA",
    //   isMobile: isMobile()
    // }
    //   const newWin = window.open(`/sports`, "sportDetail");
    //   newWin.localStorage.setItem("sportsSession", JSON.stringify(form));
    // launchSessionGame("SABA", { isMobile: isMobile() }).then((ret) => {
    //   src.value = ret.data;
    // });
    launchSessionGame("UG", { isMobile: isMobile() }).then((ret) => {
      src.value = ret.data;
    });
  }
  //  else {
  //   launchGame("UG", { isMobile: isMobile() }).then((ret) => {
  //     src.value = ret.data;
  //   });
  // }
  else {
    router.push({ name: "login", query: { redirect: route.path } });
  }
});
</script>

<style scoped lang="scss">
// #page_container {
//     max-height: 100%;
//     max-width: 100%;
//     background: #ffd800;
//     padding:0;
//     position: relative;

// }

// #iframe_container {
//     height: 100vh;
//     width: 100%;
//     overflow: scroll;
//     -webkit-overflow-scrolling:touch;
//     position: absolute;
// }

// #iframe {
//     height: 100%;
//     width: 100%;
// }

.sport-container {
  // background-image: url("../../assets/images/index/index_bg.png");
  // background-size: cover;
  // background-repeat: no-repeat;
  background: linear-gradient(to bottom, #23263c, #190f25);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 100px);

  .sports-iframe {
    width: 100%;
    max-width: 1600px;
    height: calc(100vh - 100px);
    overflow: hidden !important;
    margin: 0 auto;
    display: block;
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .sport-container {
    height: 100%;
    height: calc(100vh - 100px);
    width: 100%;
    padding: 0;
    margin: 0;
    min-height: 600px;

    .sports-iframe {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
