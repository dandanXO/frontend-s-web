<template>
  <div>
    <div class="platform-menu lottery">
      <div
        class="platform-box"
        v-for="nav in filteredNavigations"
        :key="nav.code"
        @click="nav.path ? router.push(nav.path) : $emit('loadModal', nav.label, nav.code, nav.gameCode)"
      >
        <img
          class="plat-icon"
          :src="require('../../assets/lottery/logo_' + nav.icon + '.png')"
        />

        <p class="platform-title">{{ nav.label }}</p>

        <div class="platform-img" :class="'lottery-' + nav.icon"></div>
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
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const navigations = [
      {
        code: "TCG",
        icon: "tcg",
        label: "TCG彩票",
        slogan: "TCG",
        gameCode: "",
        path: ""
      },
      {
        code: "BBINDY",
        icon: "bbin",
        label: "BBIN彩票",
        slogan: "BBIN",
        gameCode: "bbkeno_lobby_pc",
        path: ""
      },
      {
        code: "SGWin",
        icon: "sgwin",
        label: "双赢彩票",
        slogan: "SGWin ",
        gameCode: "imlotto30000",
        path: "/lottery/SGWin"
      }
    ];

    const router = useRouter();
    const store = userStore();
    const platformsList = ref([]);
    const platformsListDisplay = ref([]);
    const getPlatList = () => {
      if (store.token) {
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
      getPlatList,
      router
    };
  }
});
</script>
