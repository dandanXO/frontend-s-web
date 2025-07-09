<template>
  <div class="lol-msi-wrapper">
    <q-tabs v-model="tabPosition" class="msi-tabs">
      <q-tab name="play-in" label="首局赠礼"></q-tab>
      <q-tab name="bracket" label="盈亏返利"></q-tab>
      <q-tab name="final" label="胜利喝彩"></q-tab>
    </q-tabs>
    <q-tab-panels v-model="tabPosition">
      <q-tab-panel name="play-in">
        <play-in-stage>
          <match-info-swiper :match-list="matchList" />
        </play-in-stage>
      </q-tab-panel>
      <q-tab-panel name="bracket">
        <bracket-stage>
          <match-info-swiper :match-list="matchList" />
        </bracket-stage>
      </q-tab-panel>
      <q-tab-panel name="final">
        <final-stage>
          <match-info-swiper :match-list="matchList" />
        </final-stage>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { getLOLMsiMatchRecord } from "../../../api/index/promo.js";

import PlayInStage from "./components/PlayInStage.vue";
import BracketStage from "./components/BracketStage.vue";
import FinalStage from "./components/FinalStage.vue";
import MatchInfoSwiper from "./components/MatchInfoSwiper.vue";
import { useLocalStorage } from "@vueuse/core";

const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";

const tabPosition = ref("play-in");
const matchList = ref([]);

onMounted(async () => {
  if (!store.token) {
    return;
  }
  const apiRes = await getLOLMsiMatchRecord();
  matchList.value = apiRes.data.map((res) => ({
    ...res,
    teamOneIcon: imgURL + res.teamOneIcon,
    teamTwoIcon: imgURL + res.teamTwoIcon
  }));
});
</script>
<style scoped lang="scss">
.lol-msi-wrapper {
  .q-tabs {
    margin-bottom: 10px;
    height: auto !important;
    background-color: transparent;
  }

  .q-tabs .q-tab {
    background: url(components/hotpromo/LOL-msi-2024/images/img-inactive.png) no-repeat center center;
    background-size: contain;
    color: #fff;
    font-family: Microsoft YaHei UI;
    font-size: 24px;
    font-weight: 700;
    line-height: 31.92px;
    text-align: center;
    padding: 0;
    padding-top: 0.25rem;

    &--active {
      background: url(components/hotpromo/LOL-msi-2024/images/img-active.png) no-repeat center center;
      background-size: contain;
      color: #ff8080;

      :deep(.q-tab__label) {
        color: #ff8080 !important;
        font-weight: bold;
      }
      :deep(.q-tab__indicator) {
        display: none !important;
      }
    }

    .q-ripple {
      display: none;
    }
  }

  .q-tab-panel {
    overflow: hidden;
  }
}
</style>
