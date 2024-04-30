<template>
  <div>
    <el-tabs v-model="tabPosition" class="msi-tabs">
      <el-tab-pane name="play-in" label="活动一">
        <play-in-stage>
          <match-info-swiper :match-list="matchList" />
        </play-in-stage>
      </el-tab-pane>
      <el-tab-pane name="bracket" label="活动二">
        <bracket-stage>
          <match-info-swiper :match-list="matchList" />
        </bracket-stage>
      </el-tab-pane>
      <el-tab-pane name="final" label="活动三">
        <final-stage>
          <match-info-swiper :match-list="matchList" />
        </final-stage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { getLOLMsiMatchRecord } from "@/api/index/promo.js";

import PlayInStage from "./components/PlayInStage.vue";
import BracketStage from "./components/BracketStage.vue";
import FinalStage from "./components/FinalStage.vue";
import MatchInfoSwiper from "./components/MatchInfoSwiper.vue";

const imgURL = process.env.VUE_APP_IMAGE_CDN + "/promo/";

const tabPosition = ref("play-in");
const matchList = ref([]);

onMounted(async () => {
  const apiRes = await getLOLMsiMatchRecord();
  matchList.value = apiRes.data.map((res) => ({
    ...res,
    teamOneIcon: imgURL + res.teamOneIcon,
    teamTwoIcon: imgURL + res.teamTwoIcon
  }));
});
</script>
<style scoped lang="scss">
.msi-tabs {
  max-width: 1560px;
  margin: auto;

  :deep(.el-tabs__nav) {
    float: none;
    justify-content: center;
    gap: 128px;
    margin-bottom: 76px;
  }

  :deep(.el-tabs__nav-wrap:after) {
    display: none;
  }

  :deep(.el-tabs__active-bar) {
    display: none;
  }

  :deep(.el-tabs__item) {
    background: url(@/components/hotpromo/LOL-msi-2024/images/img-inactive.png) no-repeat center center;
    width: 338px;
    height: 90px;
    background-size: contain;
    color: #fff;
    font-family: Microsoft YaHei UI;
    font-size: 24px;
    font-weight: 700;
    line-height: 68px;
    text-align: center;
    padding: 0;
    padding-top: 12px;

    &.is-active {
      background: url(@/components/hotpromo/LOL-msi-2024/images/img-active.png) no-repeat center center;
      color: #ff8080;
    }
  }
}
</style>
