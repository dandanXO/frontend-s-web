<template>
  <div>
    <div class="platform-menu poker">
      <div
        class="platform-box"
        v-for="nav in filteredNavigations"
        :key="nav.code"
        @click="$emit('loadModal', nav.label, nav.code, nav.gameCode)"
        :class="nav.underMaintenance === true ? 'maintenance' : ''"
      >
        <div class="maintenance-box" v-if="nav.underMaintenance === true">
          <p>维护中</p>
          <p v-if="nav.maintenanceStartTime && nav.maintenanceEndTime" class="small-size">
            维护时间:
            <span>
              {{ moment(nav.maintenanceStartTime).format("YYYY/MM/DD HH:mm:ss A") }}
              <br />
              ~
              <br />
              {{ moment(nav.maintenanceEndTime).format("YYYY/MM/DD HH:mm:ss A") }}
            </span>
          </p>
        </div>

        <div class="imgbox" :style="`background-position-x: ${nav.percentage}`"></div>
        <div class="contents">
          <!-- <p class="platform-title">{{ nav.label }}棋牌</p> -->
          <p class="platform-title">{{ getAliasName(nav, 'POKER') }}</p>
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
import { getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
import moment from "moment";
import { getAliasName } from '@/utils/utils';

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
        code: "KY",
        image: "ky",
        label: "开元",
        slogan: "崭新玩法 感受精彩",
        gameCode: "",
        percentage: "-232px"
      },
      {
        code: "LEG",
        image: "leg",
        label: "乐游",
        slogan: "非同凡响 极致体验",
        gameCode: "",
        percentage: "-464px"
      }
    ];

    const store = userStore();
    const platformsList = ref([]);
    const platformsListDisplay = ref([]);
    const getPlatList = () => {
      if (store.token) {
        getLoggedInPlatformList().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("POKER"));
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("POKER"));
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
      moment,
      getAliasName
    };
  }
});
</script>
