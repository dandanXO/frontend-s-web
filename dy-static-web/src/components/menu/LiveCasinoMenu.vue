<template>
  <div>
    <div class="platform-menu live">
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

        <img class="plat-icon" :src="require('../../assets/live/live_logo_' + nav.icon + '.png')" />
        <p class="platform-title">{{ getAliasName(nav, "LIVE") }}</p>
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
import { getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
import { getAliasName } from "@/utils/utils";
import moment from "moment";

export default defineComponent({
  setup() {
    const navigations = [
      {
        code: "PMLIVE",
        icon: "pm",
        label: "DB",
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
        code: "AG",
        icon: "ag",
        label: "PA",
        slogan: "全球顶尖, 尊享娱乐",
        gameCode: ""
      },
      {
        code: "SEXY",
        icon: "sexy",
        label: "Sexy",
        slogan: "全球顶尖, 尊享娱乐",
        gameCode: ""
      },
      {
        code: "AR",
        icon: "ar",
        label: "AR",
        slogan: "全球顶尖, 尊享娱乐",
        gameCode: ""
      },
      {
        code: "EEAI",
        icon: "eeai",
        label: "EEAI",
        slogan: "全球顶尖, 尊享娱乐",
        gameCode: ""
      }
    ];

    const store = userStore();
    const platformsList = ref([]);
    const platformsListDisplay = ref([]);
    const getPlatList = () => {
      if (store.token) {
        getLoggedInPlatformList().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value
            .filter((element) => element.gameType.includes("LIVE"))
            .sort((a, b) => a.sequence - b.sequence);
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value
            .filter((element) => element.gameType.includes("LIVE"))
            .sort((a, b) => a.sequence - b.sequence);
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
