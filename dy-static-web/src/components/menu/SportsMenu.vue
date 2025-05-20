<template>
  <div style="max-width: 1600px">
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
            <!-- <p class="platform-title">{{ nav.label }}</p> -->
            <p class="platform-title">{{ getAliasName(nav, 'SPORT') }}</p>
            <p class="platform-slogan">{{ nav.slogan }}</p>
            <div class="platform">SPORTS GAME</div>
          </div>
        </div>
      </div>
      <!--      <div class="header-fs-box">-->
      <!--        <p class="fs-title">体育博彩</p>-->
      <!--        <p class="fs-name">-->
      <!--          SPORTS-->
      <!--          <br />-->
      <!--          EVENTS-->
      <!--        </p>-->
      <!--        <p class="fs-desc">返水最高可达</p>-->
      <!--        <div class="fs-percentage"></div>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
import { getAliasName } from '@/utils/utils';
import moment from "moment";

export default defineComponent({
  setup() {
    const navigations = [
      {
        code: "FB",
        icon: "fb",
        label: "FB体育",
        slogan: "极速结算 高水体验",
        percentage: "-485px;"
      },
      { code: "SABA", icon: "saba", label: "沙巴体育", slogan: "赛事丰富 创新玩法", percentage: "-235px;" },
      {
        code: "IM",
        icon: "im",
        label: "IM体育",
        slogan: "高赔稳定 滚球首选",
        percentage: "5px;"
      },
      {
        code: "PM",
        icon: "db",
        label: "熊猫体育",
        slogan: "玩法刺激 即刻结算",
        percentage: "-745px;"
      }
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
        }))
        .sort((a, b) => a.sequence - b.sequence);
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
