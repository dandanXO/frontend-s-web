<template>
  <div>
    <div class="platform-menu esports">
      <div
        v-for="nav in filteredNavigations"
        :key="nav.code"
        @click="$emit('loadModal', nav.label, 'onlyPlatform', nav.code)"
      >
        <div class="platform-box" :class="nav.underMaintenance === true ? 'maintenance' : ''">
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
            <!-- <p class="platform-title">{{ nav.label }}电竞</p> -->
            <p class="platform-title">{{ getAliasName(nav, 'ESPORT') }}</p>
            <p class="platform-slogan">{{ nav.slogan }}</p>
          </div>
        </div>
      </div>
      <div class="header-fs-box">
        <!-- <p class="fs-title">体育娱乐</p> -->
        <p class="fs-name">
          ELECTRONIC
          <br />
          SPORT
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
import { getAliasName } from '@/utils/utils';

export default defineComponent({
  setup() {
    const navigations = [
      {
        code: "TFGaming",
        icon: "dy",
        label: "东赢",
        slogan: "电竞先驱 实时滚球",
        percentage: "32.48%"
      },
      {
        code: "IMES",
        icon: "im",
        label: "IM",
        slogan: "专业电竞 即时结算 ",
        percentage: "66.7%"
      },
      {
        code: "IA",
        icon: "ai",
        label: "小艾",
        slogan: "崭新玩法 输赢即现",
        percentage: "99.4%"
      }
    ];

    const store = userStore();
    const platformsList = ref([]);
    const platformsListDisplay = ref([]);
    const getPlatList = () => {
      if (store.token) {
        getLoggedInPlatformList().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("ESPORT"));
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("ESPORT"));
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
      getAliasName
    };
  }
});
</script>
