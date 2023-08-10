<template>
    <div>
        
        <div class="platform-menu sports">
            
          <div
              v-for="nav in filteredNavigations"
              :key="nav.code"
              @click="$emit('loadModal', nav.label, 'onlyPlatform', nav.code)"
            >
                    <div class="platform-box">
                    <img :src="require('../../assets/sports/sport_logo_'+ nav.icon + '.png')">
                    <div class="contents">
                    <p class="platform-title">{{ nav.label }} 体育</p>
                    <p class="platform-slogan">{{ nav.slogan }}</p>
                    <div class="platform">SPORT GAME</div>
                    </div>
                    </div>
          </div>
          <div class="header-fs-box">
            <p class="fs-title">体育娱乐</p>
            <p class="fs-name">SPORT<br>GAME</p>
            <p class="fs-desc">返水最高可达</p>
            <div class="fs-percentage"></div>
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
        { code: "IM", icon: "im", label: "IM", slogan: "赛事最多 玩法新颖" },
        { code: "PM", icon: "pm", label: "PM", slogan: "最强滚球 超高水位" },
        { code: "CR", icon: "xf", label: "CR", slogan: "崭新玩法 感受精彩" },
    ];

    const store = userStore();
    const platformsList = ref([]);
    const platformsListDisplay = ref([]);
    const getPlatList = () => {
      if (store.memberType === "TEST") {
        getLoggedInPlatformList().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) =>
            element.gameType.includes("SPORT")
          );
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) =>
            element.gameType.includes("SPORT")
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
