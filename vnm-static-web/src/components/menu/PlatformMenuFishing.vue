<template>
  <div class="platform-menu-container special" :style="checkPlatLength()">
    <div class="platform-menu-item">
      <!-- <h4>{{ $t('menu.fishing') }}</h4> -->
      <div class="platform-menu">
        <template v-for="(item, index) in platformsListDisplay" :key="index">
          <div
            class="platform-menu-item"
            @click="gotoGame(item, platformType)"
            :class="item.underMaintenance === true ? 'maintenance' : ''"
          >
            <div class="maintenance-box" v-if="item.underMaintenance === true">
              <p>{{ $t("maintenance.currentlyMaintaining") }}</p>
              <p v-if="item.maintenanceStartTime && item.maintenanceEndTime" class="small-size">
                {{ $t("common.maintenanceTime") }}:
                <br />
                {{ toGMT7(item.maintenanceStartTime, "DD/MM/YYYY HH:mm") }}
                <br />
                -
                {{ toGMT7(item.maintenanceEndTime, "DD/MM/YYYY HH:mm") }}
              </p>
            </div>

            <div class="platform-menu-img">
              <img
                :src="
                  require('../../assets/' +
                    props.platformType +
                    '/' +
                    props.platformType +
                    '-item-' +
                    item.code.toLowerCase() +
                    '.png')
                "
              />
            </div>
            <div class="platform-menu-btn">
              <a>{{ $t("common.playnow") }}</a>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="platform-menu-item">
      <!-- <h4>{{ $t('menu.cockfight') }}</h4> -->
      <div class="platform-menu-extra">
        <template v-for="(item, index) in platformsListDisplay2" :key="index">
          <div
            class="platform-menu-item"
            @click="gotoGame(item, 'COCKFIGHT')"
            :class="item.underMaintenance === true ? 'maintenance' : ''"
          >
            <div class="maintenance-box" v-if="item.underMaintenance === true">
              <p>{{ $t("maintenance.currentlyMaintaining") }}</p>
              <p v-if="item.maintenanceStartTime && item.maintenanceEndTime" class="small-size">
                {{ $t("common.maintenanceTime") }}:
                <br />
                {{ moment(item.maintenanceStartTime).format("DD/MM/YYYY HH:mm") }}
                <br />
                -
                {{ moment(item.maintenanceEndTime).format("DD/MM/YYYY HH:mm") }}
              </p>
            </div>

            <div class="platform-menu-img">
              <img
                :src="
                  require('../../assets/' +
                    props.platformType +
                    '/' +
                    props.platformType +
                    '-item-' +
                    item.code.toLowerCase() +
                    '.png')
                "
              />
            </div>
            <div class="platform-menu-btn">
              <a>{{ $t("common.playnow") }}</a>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
import { useRouter } from "vue-router";
import moment from "moment";
import { toGMT7 } from "@/utils/utils";

const props = defineProps({
  platforms: Array,
  platform2: Array,
  platformName: String,
  platformType: String,
  platformGameType: String
});
const emits = defineEmits(["load-game"]);
const store = userStore();
const platformsList = ref([]);
const numberToShow = ref(5);
const platformsListDisplay = ref([]);

const platformsListDisplay2 = ref([]);

const getPlatformList = () => {
  const fetchFunction = store.token ? getLoggedInPlatformList : getPlatformListDisplay;

  fetchFunction().then((res) => {
    platformsList.value = res;
    platformsListDisplay.value = platformsList.value.filter((element) =>
      element.gameType.split(",").some((type) => type.trim().toUpperCase() === props.platformGameType.toUpperCase())
    );

    platformsListDisplay.value = platformsListDisplay.value.map((item1) => {
      const matchingItem = props.platforms.find((item2) => item1.code === item2.code);
      return { ...matchingItem, ...item1 };
    });

    platformsListDisplay2.value = platformsList.value.filter((element) =>
      element.gameType.split(",").some((type) => type.trim().toUpperCase() === "COCKFIGHT")
    );

    platformsListDisplay2.value = platformsListDisplay2.value.map((item1) => {
      const matchingItem = props.platform2.find((item2) => item1.code === item2.code);
      return { ...matchingItem, ...item1 };
    });

    console.log("LOST 2");
    console.log(platformsListDisplay2.value);
  });
};

const checkPlatLength = () => {
  if (props.platformType === "slot") {
    if (platformsListDisplay.value.length === 8) {
      return "max-width: 1200px";
    } else if (platformsListDisplay.value.length > 8) {
      return "max-width: 1400px";
    }
  } else {
    return "";
  }
};
const router = useRouter();
const gotoGame = (item, platformType) => {
  // debugger;
  // console.log(platformType);
  if (platformType === "slot") {
    router.push(`/slot?plat=${item.code}`);
  } else if (platformType === "COCKFIGHT") {
    router.push(`/others?type=cockfight&plat=${item.code}`);
  } else if (platformType === "fishing") {
    router.push(`/others?plat=${item.code}`);
  } else if (platformType === "casual") {
    router.push(`/minigame?plat=${item.code}`);
  } else {
    const platName = item.alias ?? item.name;
    emits("load-game", platName, item.code, item.gameCode);
    // emits("load-game", item);
  }
};
const checkWindowSize = () => {
  // console.log('resize');
  // Access and modify the ref here
  if (window.innerWidth < 1700) {
    numberToShow.value = 5;
  }
  if (window.innerWidth > 1700) {
    numberToShow.value = 6;
  }
  if (window.innerWidth > 1900) {
    numberToShow.value = 7;
  }
  if (window.innerWidth > 2000) {
    numberToShow.value = 10;
  }
};

onMounted(() => {
  getPlatformList();
  checkWindowSize();
});
</script>

<style scoped lang="scss" src="../../scss/pages/submenu.scss" />
