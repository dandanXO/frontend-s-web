<template>
  <div>
    <div class="platform-menu live">
      <div
        class="platform-box"
        v-for="nav in filteredNavigations"
        :key="nav.code"
        @click="$emit('loadModal', nav.label, nav.code, nav.gameCode)"
      >
        <img
          class="plat-icon"
          :src="require('../../assets/live/live_logo_' + nav.icon + '.png')"
        />
        <p class="platform-title">{{ nav.label }} 真人</p>
        <div class="platform-img" :class="'live-' + nav.icon"></div>
      </div>
      <div class="header-fs-box">
        <p class="fs-title">真人娱乐</p>
        <p class="fs-name">
          LIVE
          <br />
          EVENTS
        </p>
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
      {
        code: "AG",
        icon: "ag",
        label: "AG",
        slogan: "全球顶尖, 尊享娱乐",
        gameCode: ""
      },
      {
        code: "ALLBET",
        icon: "allbet",
        label: "ALLBET",
        slogan: "全球顶尖, 尊享娱乐",
        gameCode: ""
      },
      {
        code: "BBINDY",
        icon: "bbin",
        label: "BBIN",
        slogan: "全球顶尖, 尊享娱乐",
        gameCode: "bblive_lobby_pc"
      },
      {
        code: "PMLIVE",
        icon: "pm",
        label: "PM",
        slogan: "全球顶尖, 尊享娱乐",
        gameCode: ""
      },
      {
        code: "BG",
        icon: "bg",
        label: "BG",
        slogan: "全球顶尖, 尊享娱乐",
        gameCode: ""
      },
      {
        code: "SEXY",
        icon: "sexy",
        label: "Sexy",
        slogan: "全球顶尖, 尊享娱乐",
        gameCode: ""
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
            element.gameType.includes("LIVE")
          );
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) =>
            element.gameType.includes("LIVE")
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
