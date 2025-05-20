<template>
  <div>
    <div class="platform-menu lottery">
      <div
        class="platform-box"
        v-for="nav in filteredNavigations"
        :key="nav.code"
        @click="nav.path ? router.push(nav.path) : $emit('loadModal', nav.label, nav.code, nav.gameCode)"
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

        <img class="plat-icon" :src="require('../../assets/lottery/logo_' + nav.icon + '.png')" />

        <!-- <p class="platform-title">{{ nav.label }}</p> -->
        <p class="platform-title">{{ getAliasName(nav, 'LOTTERY') }}</p>
        <div class="platform-img" :class="'lottery-' + nav.icon"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
import { useRouter } from "vue-router";
import moment from "moment";
import { getAliasName } from '@/utils/utils';

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
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("LOTTERY"));
        });
      } else {
        getPlatformListDisplay().then((res) => {
          platformsList.value = res;
          platformsListDisplay.value = platformsList.value.filter((element) => element.gameType.includes("LOTTERY"));
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
      router,
      moment,
      getAliasName
    };
  }
});
</script>
