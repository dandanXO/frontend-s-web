<template>
  <div>
    <div class="platform-menu games slots">
      <div
        class="platform-box"
        v-for="nav in filteredNavigations"
        :key="nav.code"
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

        <router-link :to="`/game?plat=${nav.code}`">
          <img class="plat-icon" :src="require('../../assets/game/header_slot_logo_' + nav.icon + '.png')" />
          <p class="platform-title">{{ getGameLabel(nav.code) }}</p>
          <div class="platform-img" :class="'slot-' + nav.icon"></div>
        </router-link>
      </div>
      <div class="header-fs-box">
        <p class="fs-title">电子游艺</p>
        <p class="fs-name">
          SLOT
          <br />
          GAME
        </p>
        <p class="fs-desc">返水最高可达</p>
        <div class="fs-percentage p200"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
import moment from "moment/moment";

export default defineComponent({
  setup() {
    const navigations = [
      { code: "PG", icon: "pg", label: "PG" },
      { code: "SW", icon: "sw", label: "SW" },
      { code: "PT", icon: "pt", label: "PT" },
      { code: "AG", icon: "ag", label: "AG" },
      { code: "BBINDY", icon: "bbin", label: "BBIN" },
      { code: "CQ9", icon: "cq", label: "CQ9" },
      { code: "MGP", icon: "mg", label: "MG" }
      // { code: "AMEBA", icon: "mg", label: "MG" },
    ];

    const getGameLabel = (gameLabel) => {
      if (gameLabel === "BBINDY") {
        return "BBIN 电子";
      } else if (gameLabel === "AMEBA") {
        return "AE 电子";
      } else if (gameLabel === "MGP") {
        return "MG 电子";
      } else if (gameLabel === "AG") {
        return "PA 电子";
      } else {
        return gameLabel + " 电子";
      }
    };

    const store = userStore();
    const platformsList = ref([]);
    const platformsListDisplay = ref([]);
    const getPlatList = () => {
      if (store.token) {
        getLoggedInPlatformList().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("SLOT"));
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("SLOT"));
        });
      }
    };
    const filteredNavigations = computed(() => {
      const sortedNavigations = navigations
        .filter((nav) => platformsListDisplay.value.some((platform) => platform.code === nav.code))
        .map((nav) => ({
          ...nav,
          ...platformsListDisplay.value.find((platform) => platform.code === nav.code)
        }))
        .sort((a, b) => {
          const indexA = platformsListDisplay.value.findIndex((platform) => platform.code === a.code);
          const indexB = platformsListDisplay.value.findIndex((platform) => platform.code === b.code);
          return indexA - indexB;
        });

      return sortedNavigations;
    });

    onMounted(() => {
      getPlatList();
    });

    return {
      filteredNavigations,
      getPlatList,
      getGameLabel,
      moment
    };
  }
});
</script>
