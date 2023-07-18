<template>
  <div>
    <div class="platform-menu poker">
      <div
        class="platform-box"
        v-for="nav in filteredNavigations"
        :key="nav.code"
        @click="$emit('loadModal', nav.label, nav.code, nav.gameCode)"
      >
        <div
          class="imgbox"
          :style="`background-position-x: ${nav.percentage}`"
        ></div>
        <div class="contents">
          <p class="platform-title">{{ nav.label }}棋牌</p>
          <p class="platform-slogan">{{ nav.slogan }}</p>
          <div class="platform">CHESS GAME</div>
        </div>
      </div>
      <div class="header-fs-box">
        <p class="fs-title">棋牌游戏</p>
        <p class="fs-name">
          CHESS
          <br />
          GAME
        </p>
        <p class="fs-desc">返水最高可达</p>
        <div class="fs-percentage p120"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import {
  getPlatformListDisplay,
  getLoggedInPlatformList
} from "@/api/platform/platform";
import { userStore } from "@/store";

export default defineComponent({
  setup() {
    const navigations = [
      {
        code: "DT",
        image: "tx",
        label: "大唐",
        slogan: "玩出运气 赢得喜气",
        gameCode: "",
        percentage: "0"
      },
      {
        code: "KYDY",
        image: "ky",
        label: "开元",
        slogan: "崭新玩法 感受精彩",
        gameCode: "ky_lobby",
        percentage: "-232px"
      }
    ];

    const store = userStore();
    const platformsList = ref([]);
    const platformsListDisplay = ref([]);
    const getPlatList = () => {
      if (store.memberType === "TEST") {
        getLoggedInPlatformList().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) =>
            element.gameType.includes("POKER")
          );
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) =>
            element.gameType.includes("POKER")
          );
        });
      }
    };
    const filteredNavigations = computed(() => {
      return navigations.filter((nav) =>
        platformsListDisplay.value.some(
          (platform) => platform.code === nav.code
        )
      );
    });

    onMounted(() => {
      getPlatList();
    });

    return {
      filteredNavigations,
      getPlatList
    };
  }
});
</script>
