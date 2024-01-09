<template>
  <div>
    <div class="platform-menu sports">
      <div
        v-for="nav in filteredNavigations"
        :key="nav.code"
        @click="$emit('loadModal', nav.label, 'onlyPlatform', nav.code)"
      >
        <div class="platform-box" :class="nav.underMaintenance === true ? 'maintenance' : ''">
          <div class="maintenance-box" v-if="nav.underMaintenance === true">
            <p>维护中</p>
            <p v-if="nav.maintenanceStartTime && nav.maintenanceEndTime" class="small-size">
              维护时间: {{ moment(nav.maintenanceStartTime).format("YYYY/MM/DD HH:mm:ss A") }}-
              {{ moment(nav.maintenanceEndTime).format("YYYY/MM/DD HH:mm:ss A") }}
            </p>
          </div>

          <div class="imgbox" :style="`background-position-x: ${nav.percentage}`"></div>
          <div class="contents">
            <p class="platform-title">{{ nav.label }}体育</p>
            <p class="platform-slogan">{{ nav.slogan }}</p>
            <div class="platform">SPORTS GAME</div>
          </div>
        </div>
      </div>
      <div class="header-fs-box">
        <p class="fs-title">体育博彩</p>
        <p class="fs-name">
          SPORTS
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
import { getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
import moment from "moment";

export default defineComponent({
  setup() {
    const navigations = [
      {
        code: "IM",
        icon: "im",
        label: "IM",
        slogan: "赛事最多 玩法新颖",
        percentage: "5px;"
      },
      {
        code: "PM",
        icon: "db",
        label: "熊猫",
        slogan: "最强滚球 超高水位",
        percentage: "-960px;"
      },
      { code: "SABA", icon: "saba", label: "沙巴", slogan: "最佳水位 最强赛事", percentage: "-270px;" }
      // { code: "CR", icon: "xf", label: "CR", slogan: "崭新玩法 感受精彩", percentage: "-560px;" },
    ];

    const store = userStore();
    const platformsList = ref([]);
    const platformsListDisplay = ref([]);
    const getPlatList = () => {
      if (store.token) {
        getLoggedInPlatformList().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("SPORT"));
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("SPORT"));
        });
      }
    };
    const filteredNavigations = computed(() => {
      return navigations
        .filter((nav) => platformsListDisplay.value.some((platform) => platform.code === nav.code))
        .map((nav) => ({
          ...nav,
          ...platformsListDisplay.value.find((platform) => platform.code === nav.code)
        }));
    });

    onMounted(() => {
      getPlatList();
    });

    return {
      filteredNavigations,
      getPlatList,
      moment
    };
  }
});
</script>
