<template>
  <div class="esport-container">
    <TFLoading v-show="logoShow" />
    <iframe
      v-show="!logoShow"
      id="esportsForm"
      :src="src"
      allowfullscreen="true"
      scrolling="no"
      frameborder="0"
      class="esports-iframe animate__animated animate__fadeIn"
      @load="loadGame()"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { launchSessionGame } from "@/api/platform/platform";
import { userStore } from "@/store";
import TFLoading from "@/components/loading/TFLoading";

let src = ref("");

const router = useRouter();
const route = useRoute();

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
    router.push({ name: "login", query: { redirect: route.path } });
  }
});
</script>

<style scoped lang="scss">
.dark-theme {
  .esport-container {
    background: linear-gradient(to bottom, #23263c, #190f25);
  }
}
.esport-container {
  background-image: url(../../assets/images/index/centerbg.png);

  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 930px;
  height: 100%;

  .esports-iframe {
    width: 100%;
    // max-width: 1440px;
    // height: 930px;
    height: 100vh;
    overflow: hidden !important;
    margin: 0 auto;
    display: block;
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 767px) {
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
