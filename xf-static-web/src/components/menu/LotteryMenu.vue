<template>
  <div>
    <div class="platform-menu lottery">
      <div
        class="platform-box"
        v-for="nav in filteredNavigations"
        :key="nav.code"
        @click="$emit('loadModal', nav.label, nav.code, nav.gameCode)"
      >
        <img
          :src="
            require('../../assets/lottery/lottery_logo_' + nav.icon + '.png')
          "
          style="width: 200px"
        />
        <p class="platform-title">{{ nav.label }} 彩票</p>
        <p class="platform-slogan">{{ nav.slogan }}</p>
      </div>
      <!-- <div class="header-fs-box">
            <p class="fs-title">真人娱乐</p>
            <p class="fs-name">LIVE<br>EVENTS</p>
            <p class="fs-desc">返水最高可达</p>
            <div class="fs-percentage"></div>
        </div> -->
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
        code: "TCG",
        icon: "tcg",
        label: "TCG",
        gameCode: "",
        slogan: "无时无刻 尽情游玩"
      },
      {
        code: "VR",
        icon: "vr",
        label: "VR",
        gameCode: "",
        slogan: "最新创意 最好服务"
      },
      {
        code: "LBkeno",
        icon: "lb",
        label: "LB",
        gameCode: "",
        slogan: "足够新颖 极易操作"
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
            element.gameType.includes("LOTTERY")
          );
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) =>
            element.gameType.includes("LOTTERY")
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
