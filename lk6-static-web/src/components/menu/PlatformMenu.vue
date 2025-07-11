<template>
  <div class="platform-menu-container" :id="`platform-menu-${props.platformType}`">
    <!-- <template v-for="(item, index) in filteredPlatforms" :key="index"> -->
    <el-carousel :arrow="arrowStatus" :autoplay="false">
      <el-carousel-item v-for="(platformsListDisplay, index) in platformsListDisplayByChunk" :key="index">
        <div style="display: flex; justify-content: center">
          <template v-for="(item, index) in platformsListDisplay" :key="index">
            <!--      <router-link :to="`${props.platformName}?plat=${item.code}`">-->
            <div class="platform-menu-item" @click="gotoGame(item, platformType)"
              :class="item.underMaintenance === true ? 'maintenance' : ''">
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
              
              <div class="platform-menu-title">
                {{ getAliasName(item, platformType) }}
              </div>
              <template v-if="item.caption">
                <div v-if="languageVal === 'en'" class="platform-menu-caption" v-html="item?.enCaption" />
                <div v-else class="platform-menu-caption" v-html="item.caption" />
              </template>
              <div class="platform-menu-img">
                <img :src="renderPlatformMenuImg(item)" />
              </div>

              <div class="standard-button btn-color-blue platform-menu-btn"><a>{{ $t('btn.enterDojo') }}</a></div>
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
import { i18nStore } from '@/store/language'
import { storeToRefs } from 'pinia'

const props = defineProps({
  platforms: Array,
  platformName: String,
  platformType: String,
  platformGameType: String,
  isBacarrat: Boolean
});
const emits = defineEmits(["load-game"]);
const store = userStore();
const platformsList = ref([]);
const numberToShow = ref(5);
const platformsListDisplay = ref([]);
const i18nStoreLanguage = i18nStore()
const { languageVal } = storeToRefs(i18nStoreLanguage)
const getChunk = (list, size) =>
  [...Array(Math.ceil(list.length / size))].map((_, i) => list.slice(i * size, i * size + size));

const platformsListDisplayByChunk = computed(() => {
  if (platformsListDisplay.value.length > 0) {
    // console.log("here", numberToShow.value, getChunk(platformsListDisplay.value, numberToShow.value));
    return getChunk(platformsListDisplay.value, numberToShow.value);
  }

  return [];
});

const renderPlatformMenuImg = (item) => {
  try {
    return require('../../assets/' +
      props.platformType +
      '/' +
      props.platformType +
      '-item-' +
      item.code.toLowerCase() +
      '.png')

  } catch (error) {
    return require('../../assets/lucky-6-logo.png');
  }
}

const arrowStatus = computed(() => {
  if (
    (props.platformType === "esports" && props.platforms.length - 2 > 5) ||
    (props.platformType !== "esports" && props.platforms.length > 5)
  ) {
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
      const matchingItem = props.platforms.find((item2) => item1.code === item2.code);
      return { ...matchingItem, ...item1 };
    });


    if (props.isBacarrat) {
      const bacarratPlatforms = [{
        enname: "Bacarrat",
        cnname: "百家乐",
        code: "bacarrat",
      }, {
        enname: "Roulette",
        cnname: "轮盘",
        code: "roulette",
      }, {
        enname: "Lucky Lace",
        cnname: "幸运蕾丝",
        code: "lucky-lace",
      }];

      platformsListDisplay.value = bacarratPlatforms
    }
  });
};

// const filteredPlatforms = computed(() => {
//   return props.platforms.filter((nav) => platformsListDisplay.value.some((platform) => platform.code === nav.code));
// });

const router = useRouter();
const gotoGame = (item, platformType) => {
  // debugger;
  // console.log(platformType);
  if (['bacarrat', 'roulette', 'lucky-lace'].includes(item.code)) {
    router.push(`/${item.code}`);
    return;
  }

  if (platformType === "slot") {
    router.push(`/slot?plat=${item.code}`);
  } else {
    const platName = getAliasName(item, platformType);
    emits("load-game", platName, item.code, item.gameCode);
    // emits("load-game", item);
  }
};

const getAliasName = (plat, platformType) => {
  if (plat.alias) {
    if (plat.alias.includes("、")) {
      const aliass = plat.alias.split("、");
      const gameTypes = plat.gameType.split(",");
      const itemIndex = gameTypes.indexOf(platformType.toUpperCase());
      return itemIndex && aliass[itemIndex] ? aliass[itemIndex] : aliass[0];
    }
    return plat.alias.includes('|') ? plat.alias.split('|')[languageVal.value === 'en' ? 1 : 0] : plat.alias;
  } else {
    return languageVal.value === 'en' ? (plat?.enname ?? plat?.name) : (plat?.cnname || '');
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

<style scoped lang="scss" src="../../scss/pages/submenu/submenu.scss" />

<style lang="scss" scoped>
:deep(.el-carousel) {
  width: 100%;
}

:deep(.el-carousel__arrow) {
  background-image: url("../../assets/home/arrow-bg.png");
}

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

#platform-menu-live {
  :deep(.el-carousel__indicators) {
    display: initial;
  }
}
</style>
