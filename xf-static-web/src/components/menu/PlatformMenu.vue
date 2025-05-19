<template>
  <div class="platform-menu-container" :id="`platform-menu-${props.platformType}`">
    <!-- <template v-for="(item, index) in filteredPlatforms" :key="index"> -->
    <el-carousel :arrow="arrowStatus" :autoplay="false">
      <el-carousel-item v-for="(platformsListDisplay, index) in platformsListDisplayByChunk" :key="index">
        <div class="platform-items">
          <template v-for="(item, index) in platformsListDisplay" :key="index">
            <!--      <router-link :to="`${props.platformName}?plat=${item.code}`">-->
            <div
              class="platform-menu-item"
              @click="gotoGame(item, platformType)"
              :class="item.underMaintenance === true ? 'maintenance' : ''"
            >
              <div class="maintenance-box" v-if="item.underMaintenance === true">
                <p>维护中</p>
                <p v-if="item.maintenanceStartTime && item.maintenanceEndTime" class="small-size">
                  维护时间：
                  <br />
                  {{ moment(item.maintenanceStartTime).format("YYYY/MM/DD HH:mm") }}
                  <br />
                  -
                  {{ moment(item.maintenanceEndTime).format("YYYY/MM/DD HH:mm") }}
                </p>
                <p class="small-size">请先前往其他场馆娱乐</p>
              </div>
              <div class="platform-top">
                <div class="platform-logo">
                  <img
                    :src="
                      require('@/components/pages/img/' +
                        props.platformType +
                        '/' +
                        props.platformType +
                        '-logo-' +
                        item.code.toLowerCase() +
                        '.png')
                    "
                  />
                </div>
                <div>
                  <div v-if="props.platformType !== 'slot'" class="platform-menu-title">
                    {{ getAliasName(item, platformType) }}
                  </div>
                  <div v-if="props.platformType !== 'slot'" class="platform-menu-caption" v-html="item.caption" />

                  <div
                    v-if="props.platformType === 'slot'"
                    class="platform-menu-title"
                    >
                    {{ getAliasName(item, platformType) }}
                  </div>
                  <!-- <div
                    v-else-if="props.platformType === 'slot'"
                    class="platform-menu-title"
                    v-html="item.code + '电子'"
                  /> -->

                  <div
                    v-if="props.platformType === 'slot'"
                    class="platform-menu-caption"
                    v-html="'崭新玩法，感受精彩'"
                  />
                </div>
              </div>
              <div class="platform-menu-img" :class="props.platformType === 'slot' && 'slot-img'">
                <img
                  :src="
                    require('@/components/pages/img/' +
                      props.platformType +
                      '/' +
                      props.platformType +
                      '-item-' +
                      item.code.toLowerCase() +
                      '.png')
                  "
                />
              </div>
            </div>
            <!--      </router-link>-->
          </template>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getPlatformListDisplay, getLoggedInPlatformList } from "@/api/platform/platform";
import { userStore } from "@/store";
import { useRouter } from "vue-router";
import moment from "moment";
import { platformsDetails } from "@/components/pages/platforms.js";

const props = defineProps({
  platformName: String,
  platformType: String,
  platformGameType: String
});
const emits = defineEmits(["load-game"]);
const store = userStore();
const platformsList = ref([]);
const numberToShow = ref(5);
const platformsListDisplay = ref([]);

const getChunk = (list, size) =>
  [...Array(Math.ceil(list.length / size))].map((_, i) => list.slice(i * size, i * size + size));

const platformsListDisplayByChunk = computed(() => {
  if (props.platformType === "slot") {
    numberToShow.value = 6;
  }
  if (platformsListDisplay.value.length > 0) {
    // console.log("here", numberToShow.value, getChunk(platformsListDisplay.value, numberToShow.value));
    return getChunk(platformsListDisplay.value, numberToShow.value);
  }

  return [];
});

const arrowStatus = computed(() => {
  if (props.platformType === "slot") {
    return "always";
  } else {
    return "never";
  }
});

const getPlatformList = () => {
  const fetchFunction = store.token ? getLoggedInPlatformList : getPlatformListDisplay;

  fetchFunction().then((res) => {
    platformsList.value = res;
    platformsListDisplay.value = platformsList.value.filter((element) =>
      element.gameType.split(",").some((type) => type.trim().toUpperCase() === props.platformGameType.toUpperCase())
    );

    platformsListDisplay.value = platformsListDisplay.value.map((item1) => {
      const matchingItem = platformsDetails.find((item2) => item1.code === item2.code);
      return { ...matchingItem, ...item1 };
    });
    if (props.platformType === "esport") {
      platformsListDisplay.value = platformsDetails.filter(
        (item) => item.code === "TFGAMING" && item.type === "ESPORT"
      );
    }
    if (props.platformType === "casual") {
      platformsListDisplay.value = platformsDetails.filter(
        (item) => item.code === "TFGAMING" && item.type === "CASUAL"
      );
    }
  });
};

// const filteredPlatforms = computed(() => {
//   return props.platforms.filter((nav) => platformsListDisplay.value.some((platform) => platform.code === nav.code));
// });

const router = useRouter();
const gotoGame = (item, platformType) => {
  // debugger;
  console.log(platformType);
  if (platformType === "slot") {
    router.push(`/game?plat=${item.code}`);
  } else if (platformType === "esport") {
    router.push(`/esports`);
  } else {
    const platName = getAliasName(item, platformType);
    emits("load-game", platName, item.code, item.gameCode);
    // emits("load-game", item);
  }
};

const getAliasName = (plat, platformType) => {
  if (plat.alias) {
    // console.log(plat);
    if (plat.alias.includes("、")) {
      const aliass = plat.alias.split("、");
      const gameTypes = plat.gameType.split(",");
      const itemIndex = gameTypes.indexOf(platformType.toUpperCase());
      return itemIndex && aliass[itemIndex] ? aliass[itemIndex] : aliass[0];
    }
    return plat.alias;
  } else {
    return plat.cnname;
  }
};

const checkWindowSize = () => {
  // console.log('resize');
  // Access and modify the ref here
  // if (window.innerWidth < 1700) {
  //   numberToShow.value = 3;
  // }
  // if (window.innerWidth > 1700) {
  //   numberToShow.value = 4;
  // }
  // if (window.innerWidth > 1900) {
  //   numberToShow.value = 5;
  // }
  // if (window.innerWidth > 2000) {
  //   numberToShow.value = 8;
  // }
};

onMounted(() => {
  getPlatformList();
  checkWindowSize();
});
</script>

<!-- <style scoped lang="scss" src="../../scss/pages/submenu/submenu.scss" /> -->

<style lang="scss" scoped>
:deep(.el-carousel) {
  width: 100%;
}

// :deep(.el-carousel__arrow) {
//   background-image: url("../../assets/home/arrow-bg.png");
// }

:deep(.el-carousel__arrow--left) {
  left: 0px;
}
:deep(.el-carousel__arrow--right) {
  right: 0px;
}

:deep(.el-carousel__arrow--left),
:deep(.el-carousel__arrow--right) {
  border-radius: 50%;
  background-size: contain;
  width: 55px;
  height: 55px;

  .el-icon {
    color: #4e93ff;
  }

  &:hover {
    background-image: none;
    background-color: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);

    .el-icon {
      color: #fff;
    }
  }
  &:active,
  &:focus {
    background-image: none;
  }
}

:deep(.el-carousel__container) {
  height: 400px;
  width: 100%;
}

.platform-menu-container {
  //background: url("@/assets/home/plat-items-bg.png") no-repeat center center;
  background-size: 100% 100%;
}

:deep(.el-carousel__indicators) {
  display: none;
}
#platform-menu-slot {
  :deep(.el-carousel__indicators) {
    display: initial;
  }
}
.platform-items {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.platform-menu-item {
  padding: 20px;
  gap: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 4px solid transparent;
  height: calc(100% - 45px);
  cursor: pointer;
  &:hover {
    background: linear-gradient(180deg, rgba(50, 206, 237, 0) 35.39%, rgba(50, 206, 237, 0.3) 100%);
    border-bottom: 4px solid #32ceed;
  }
}
.platform-top {
  display: flex;
  gap: 20px;
  .platform-logo {
    border: 1px solid #5b5b5b;
    background: #2d2d2e;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
    }
  }
  .platform-menu-title {
    font-family: PingFang SC;
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    text-align: left;
    color: #ffffff;
  }
  .platform-menu-caption {
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 600;
    line-height: 32px;
    text-align: left;
    color: #b8b8b8;
  }
}
.platform-menu-img {
  width: 280px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: -30px 0 -50px;

  &.slot-img {
    width: 220px;
  }

  img {
    width: 100%;
  }
}
</style>
