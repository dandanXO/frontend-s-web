<template>
  <div>
    <div class="platform-menu games">
      <div class="platform-box" v-for="nav in filteredNavigations" :key="nav.code">
        <router-link :to="`/game?plat=${nav.code}`">
          <img class="plat-icon" :src="require('../../assets/game/header_slot_logo_' + nav.icon + '.png')" />
          <p class="platform-title">{{ nav.label }} 电子</p>
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

export default defineComponent({
  setup() {
    const navigations = [
      { code: "PGDY", icon: "pg", label: "PG" },
      { code: "SW", icon: "sw", label: "SW" },
      { code: "PTDY", icon: "pt", label: "PT" },
      { code: "AG", icon: "ag", label: "AG" },
      { code: "BBINDY", icon: "bbin", label: "BBIN" },
      { code: "CQ9", icon: "cq", label: "CQ" },
      { code: "MGP", icon: "mg", label: "MG" }
      // { code: "AMEBA", icon: "mg", label: "MG" },
    ];

    const store = userStore();
    const platformsList = ref([]);
    const platformsListDisplay = ref([]);
    const getPlatList = () => {
      if (store.memberType === "TEST") {
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
      getPlatList
    };
  }
});
</script>
