<template>
  <div class="esport-container">
    <TFLoading v-show="logoShow"></TFLoading>
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
</template>

<script setup>
import { onMounted, ref } from "vue";
import { launchGame, launchSessionGame } from "@/api/platform/platform";
import { userStore } from "@/store";
import TFLoading from "@/components/loading/TFLoading";

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
    launchSessionGame("TFGaming").then((ret) => {
      src.value = ret.data;
    });
  } else {
    launchGame("TFGaming").then((ret) => {
      src.value = ret.data;
    });
  }
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
  width: 100%;
  height: 930px;

  .esports-iframe {
    width: 1280px;
    height: 930px;
    overflow: hidden !important;
    margin: 0 auto;
    display: block;
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 768px) {
  .esport-container {
    height: 100%;
    height: calc(100vh - 100px);
    width: 100%;
    padding: 0;
    margin: 0;
    min-height: 600px;
    .esports-iframe {
      width: 100%;
    }
  }
}
</style>
