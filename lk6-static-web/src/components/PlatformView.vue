<template>
  <div class="platform-section" >
    <div v-if="isLoading" class="loading">
      <img class="loading-img" src="@/assets/lucky-6-logo.png" />
    </div>
    <div v-else-if="!(platformType === 'bacarrat' && props.hideBanner)" class="platform-container" :class="{fullpage: props.fullpage,  ['slot-container']: platformType === 'bacarrat'}">
        <template v-if="platformType === 'bacarrat'">
          <img v-if="languageVal === 'en'" src="../assets/slot/slot-top-bg-en.png" style="width: 100%;height: auto;aspect-ratio: 3840 / 800;" />
          <img  v-else src="../assets/slot/slot-top-bg.png" style="width: 100%;height: auto;aspect-ratio: 3840 / 800;" />
        </template>
        <div class="platform-container-slot" v-if="platformType === 'bacarrat'">
        </div>
      <div class="platform-container-inner" v-if="platformType !== 'bacarrat'">
        <!-- <template v-for="(item, index) in filteredPlatforms" :key="index"> -->
        <template v-for="(item, index) in platformsListDisplay" :key="index">
          <template v-if="selectedPlat === item.code">
            <div class="platform-item platform-item--img" data-aos="fade-right" data-aos-duration="1000">
              <img
                :src="
                  require('../assets/' +
                    platformType +
                    '/' +
                    platformType +
                    '-item-' +
                    item.code.toLowerCase() +
                    '.png')
                "
              />
            </div>

            <div class="platform-item">
              <div class="platform-title-wrap" data-aos="fade-left" data-aos-delay="100">
                <!-- <img src="../assets/lucky-6-logo.png" width="176px" height="86px" /> -->
                <!-- <div class="platform-title">{{  languageVal === 'en' ? (item.name ?? item.enname) : item.cnname }}</div> -->
                <img :src="require('../assets/' +
                      platformType +
                      '/' +
                      platformType +
                      '-logo-' +
                      item.code.toLowerCase() +
                      '.svg')
                  "
                />
                <div class="platform-subtitle">{{ platformName }}</div>
              </div>
              
              <div class="platform-txt-box" data-aos="fade-left" data-aos-delay="200">{{ languageVal === 'en' ? item.enMessage : item.message }}</div>

              <div class="platform-pattern-row" data-aos="fade-left" data-aos-delay="300" v-if="platformPattern">
                <img :src="require('../assets/' + platformType + '/' + platformType + '-pattern.svg')" />
              </div>

              <div class="platform-list-box">
                <!-- <span
                  class="platform-list-item"
                  v-for="(plat, platIndex) in filteredPlatforms"
                  :key="platIndex"
                  @click="clickPlat(plat)"
                  :class="{ active: selectedPlat === plat.code }"
                > -->
                <span
                  class="platform-list-item"
                  v-for="(plat, platIndex) in filteredPlatforms"
                  :key="platIndex"
                  @click="clickPlat(plat)"
                  :class="{ active: selectedPlat === plat.code }"
                >
                  <div class="list-item-btn" :id="`id-list-item-${plat.code}`">
                    <span>
                      <img
                        v-if="plat.code === 'PMLOTTERY'"
                        :src="
                          require('../assets/' +
                            platformType +
                            '/' +
                            platformType +
                            '-logo-' +
                            plat.code.toLowerCase() +
                            (selectedPlat === plat.code ? '-active' : '') +
                            '.png')
                        "
                      />
                      <img
                        v-else
                        :src="
                          require('../assets/' +
                            platformType +
                            '/' +
                            platformType +
                            '-logo-' +
                            plat.code.toLowerCase() +
                            '.png')
                        "
                      />
                    </span>
                  </div>
                  <div class="list-item-txt">{{ getAliasName(plat, platformType) }}</div>
                </span>
              </div>

              <!--            data-aos="fade-in"-->
              <!--            data-aos-delay="300"-->
              <!--            data-aos-duration="500"-->
              <div class="platform-play-btn" v-if="platformType !== 'slot'">
                <div
                  v-if="props.showPlayBtn"
                  class="btn-blue"
                  @click="openGame(getAliasName(item, platformType), item.code, item.gameCode)"
                  :class="item.underMaintenance === true ? 'btn-maintenance' : ''"
                >
                  <span class="maintenance-state" v-if="item.underMaintenance === true">
                    <img src="../assets/svg/maintenance-icon.svg" />
                    维护中
                  </span>
                  <span v-else>{{ $t('btn.enterGame') }}</span>
                </div>

                <p
                  v-if="item.underMaintenance === true && item.maintenanceStartTime && item.maintenanceEndTime"
                  class="maintenance-p"
                >
                  维护时间:
                  <em>
                    {{ moment(item.maintenanceStartTime).format("YYYY/MM/DD hh:mm A") }} -
                    {{ moment(item.maintenanceEndTime).format("YYYY/MM/DD hh:mm A") }}
                  </em>
                </p>
                <p v-else>&nbsp;</p>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>

    <div class="margin-center game-container" v-if="platformExpandable">
      <div class="all-game-container">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;align-items:center;">
          <div style="visibility: hidden;"></div>
          <div class="plat-options-wrapper">
            <div class="plat-options-container">
              <template v-for="(item, index) in fixedBacarratPlatforms" :key="index">
                <!-- <div class="plat-option" @click="switchPlat(item)" :class="{ active: selectedPlat === item.code }"> -->
                  <div
                class="plat-option"
                @click="onChangeFixedPokerPlatforms(item)"
                :class="{ active: selectedFixedBacarratPlatforms?.prefix === item.prefix }"
                >
                <div class="text">
                  <span>{{ item.label }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
        
        <div class="search-container">
          <el-input
          class="search-input"
          v-model="gamePage.searchKey"
          @input="searchList()"
          placeholder="输入查找游戏名"
          clearable
          @clear="searchList()"
          >
          <template #suffix>
            <el-icon :width="15" @click="searchList()">
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>
    </div>
      
        <div class="plat-options-wrapper" style="display: none;">
          <div class="plat-options-container">
            <template v-for="(item, index) in platformsListDisplay" :key="index">
              <!-- <div class="plat-option" @click="switchPlat(item)" :class="{ active: selectedPlat === item.code }"> -->
              <div
                class="plat-option"
                @click="clickPlat(item)"
                :class="{ active: selectedPlat === item.code, long: item.code === 'PPFP' }"
              >
                <div class="text">
                  <span>{{ item.code }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="plat-games-container">
          <div class="game-list-wrapper">
            <div
              class="game-slot animate__animated animate__fadeInRight"
              v-for="game in gamePage.gameList"
              :key="game.id"
            >
              <a @click="openGame(getAliasName(game, platformType), selectedPlat, game.code)">
                <div class="slot-img">
                  <div class="slot-tag">
                    <img v-if="game.gameLabel === 'HOT'" src="../assets/images/games/hot-tag.png" />
                    <img v-if="game.gameLabel === 'NEW'" src="../assets/images/games/new-tag.png" />
                  </div>
                  <el-image :src="game.icon" lazy>
                    <template #placeholder>
                      <img :src="game.default" />
                    </template>
                    <template #error>
                      <div class="image-slot" style="width:100%;height:100%;">
                        <img :src="game.default" />
                      </div>
                    </template>
                  </el-image>
                </div>

                <div class="slot-details">
                  <div class="slot-type">
                    {{ selectedFixedBacarratPlatforms?.type }}
                  </div>
                  <div class="slot-name">
                    {{ game.name }}
                  </div>
                </div>

                <!-- <div class="slot-name">
                  <img src="../assets/images/games/play-icon.png" />
                  {{ game.name }}

                  <div class="slot-fav">
                    <el-icon :width="30">
                      <RiHeartLine />
                      <RiHeartFill />
                    </el-icon>
                  </div>
                </div> -->
              </a>
            </div>
          </div>
          <div class="pagination-wrapper">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="gamePage.total"
              @current-change="changePage(gamePage.currentPage, gamePage.pageSize)"
              v-model:current-page="gamePage.currentPage"
              v-model:pageSize="gamePage.pageSize"
              default-page-size="30"
            />
          </div>
        </div>
      </div>
    </div>

    <GameModal ref="platformGame"></GameModal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getPlatformListDisplay,
  getLoggedInPlatformList,
  getPlatformGames,
  getPlatformList
} from "@/api/platform/platform";
import { userStore } from "@/store";
import { Search } from "@element-plus/icons-vue";
import GameModal from "@/components/modal/GameModal";
import moment from "moment/moment";
import { useDark, useLocalStorage } from "@vueuse/core";
import { storeToRefs } from 'pinia'
import { i18nStore } from '@/store/language'

const i18nStoreLanguage = i18nStore()
const { languageVal } = storeToRefs(i18nStoreLanguage)
const platformGame = ref(null);
const route = useRoute();
const router = useRouter();
const store = userStore();
const isLoading = ref(false);

const props = defineProps({
  platforms: Array,
  platformType: String,
  platformGameType: String,
  platformName: String,
  platformPattern: Boolean,
  platformExpandable: Boolean,
  showPlayBtn: Boolean,
  hideBanner: Boolean,
  fullpage: Boolean
});

const filteredPlatforms = ref([]);
const platformsList = ref([]);
const platformsListDisplay = ref([]);
const fixedBacarratPlatforms = ref([
  {
    prefix: 101,
    label: '百家乐',
    type: 'BACARRAT'
  },
  {
    prefix: 112,
    label: '幸运轮盘',
    type: 'ROULETTE'
  },
  {
    prefix: 103,
    label: '幸运蕾丝',
    type: 'LUCKY LACE'
  },
])

const getPlatList = () => {
  isLoading.value = true;
  
  const getFn = store.token ? getLoggedInPlatformList : getPlatformListDisplay;
  getFn().then((res) => {
    platformsList.value = res;
    platformsListDisplay.value = platformsList.value.filter((element) =>
      element.gameType.split(",").some((type) => type.trim().toUpperCase() === props.platformGameType.toUpperCase())
    );

    platformsListDisplay.value = platformsListDisplay.value.map((item1) => {
      const matchingItem = props.platforms.find((item2) => item1.code === item2.code);
      return { ...matchingItem, ...item1 };
    });

    setFilteredPlatforms();
  }).catch(() => {
    isLoading.value = false;
  }).finally(() => {
    isLoading.value = false;
  });
};

const setFilteredPlatforms = () => {
  filteredPlatforms.value = props.platforms.filter((displayPlatform) =>
    platformsListDisplay.value.some((platform) => platform.code === displayPlatform.code)
  );

  filteredPlatforms.value = platformsListDisplay.value.map((item1) => {
    const matchingItem = props.platforms.find((item2) => item1.code === item2.code);
    return { ...matchingItem, ...item1 };
  });

  filteredPlatforms.value.sort((a, b) => a.sequence - b.sequence);
  // console.log("Atend plat");
  // console.log(filteredPlatforms.value);

  if (!route.query.plat) {
    setSelectedPlat();
  } else {
    filteredPlatforms.value.forEach((element) => {
      if (element.code === route.query.plat) {
        clickPlat(element);
      }
    });
  }
};

const selectedPlat = ref(null);
const selectedFixedBacarratPlatforms = ref({});
const setSelectedPlat = () => {
  selectedPlat.value = filteredPlatforms.value.length > 0 ? filteredPlatforms.value[0].code : null;
};

const onChangeFixedPokerPlatforms = (item) => {
  selectedFixedBacarratPlatforms.value = item;
  changePage(gamePage.currentPage, gamePage.pageSize);
}

const clickPlat = (plat) => {
  router.push({ path: route.path, scrollBehavior(to, from, savedPosition) {
    // Return false to prevent scrolling
    return false
  } });
  selectedPlat.value = plat.code;
};

const openGame = (platName, platformCode, gameCode) => {
  platformGame.value.open(platName, platformCode, gameCode);
};

const activePlat = ref("");

const gamePage = reactive({
  gameList: [],
  currentPage: 1,
  pageSize: 15,
  searchType: "",
  searchKey: "",
  total: 0
});
const gameListData = ref([]);

const switchPlat = (plat) => {
  router.push({ path: route.path });
  activePlat.value = plat;
  // selectedPlat.value = plat.code;
  gamePage.currentPage = 1;
  loadGameList();
  clickPlat(plat);
};

const getPlatGameList = () => {
  if (props.platformGameType === "BACARRAT") {
    const getFn = store.token ? getLoggedInPlatformList : getPlatformList;
    isLoading.value = true;

    getFn()
      .then((data) => {
        platformsListDisplay.value = data.filter((element) => element.gameType.includes('LIVE'));
        platformsListDisplay.value = platformsListDisplay.value.map((item1) => {
          const matchingItem = props.platforms.find((item2) => item1.code === item2.code);
          return { ...matchingItem, ...item1 };
        });

        if (!route.query.plat) {
          switchPlat(platformsListDisplay.value[0]);
        } else {
          platformsListDisplay.value.forEach((element) => {
            if (route.query.plat === element.code) {
              switchPlat(element);
            }
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
        isLoading.value = false;
      }).finally(() => {
        isLoading.value = false;
      });
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
    return languageVal, languageVal.value === 'en' ? (plat.enname ?? plat.name) : plat.cnname;
  }
};

const searchList = () => {
  // if (gamePage.searchKey) {
  gamePage.gameList = gameListData.value.filter((game) => {
    return game.name.toLowerCase().includes(gamePage.searchKey.toLowerCase());
  });
  // }
};
const loadGameList = () => {
  if (props.platformGameType === "BACARRAT") {
    isLoading.value = true;
    getPlatformGames(activePlat.value.id, 'LIVE')
      .then((data) => {
        data.forEach((element) => {
          element.default = require("../assets/images/games/aviator/default-poker.png");
          var imageUrl = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value;
          element.icon = `${imageUrl}/game/${element.icon}`;
        });
        gameListData.value = data;
        gamePage.total = data.length;
        changePage(1, gamePage.pageSize);
      })
      .catch((err) => {
        console.log(err.message);
        isLoading.value = false;
      }).finally(() => {
        isLoading.value = false;
      });
  }
};

const changePage = (page, pageSize) => {
  // console.log(page);
  // console.log(pageSize);
  gamePage.gameList = gameListData.value.filter(gameItem => gameItem.code.startsWith(selectedFixedBacarratPlatforms.value.prefix)).slice((page - 1) * pageSize, page * pageSize);
};

const gameCat = ref("allGame");

onMounted(() => {
  if(route.name === 'roulette') {
    onChangeFixedPokerPlatforms(fixedBacarratPlatforms.value[1]);
  } else if(route.name === 'lucky-lace') {
    onChangeFixedPokerPlatforms(fixedBacarratPlatforms.value[2]);
  } else {
    onChangeFixedPokerPlatforms(fixedBacarratPlatforms.value[0]);
  }
  getPlatList();
  getPlatGameList();
});

watch(
  () => route.query.plat,
  () => {
    if (route.path === route.path) {
      platformsListDisplay.value.forEach((element) => {
        if (element.code === route.query.plat) {
          clickPlat(element);
          getPlatGameList();
          loadGameList();
        }
      });
    }
  }
);

watch(() => route.name, () => {
  if(route.name === 'roulette') {
    onChangeFixedPokerPlatforms(fixedBacarratPlatforms.value[1]);
  } else if(route.name === 'lucky-lace') {
    onChangeFixedPokerPlatforms(fixedBacarratPlatforms.value[2]);
  } else {
    onChangeFixedPokerPlatforms(fixedBacarratPlatforms.value[0]);
  }
})
</script>

<style scoped lang="scss" src="../scss/pages/platform.scss" />

<style lang="scss" scoped>
.loading {
  width: 100%;
  height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;

  .loading-img {
    animation-name: fade-in-out;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    width: 100px;
  }
}

@keyframes fade-in-out {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.search-input {
  :deep(.el-input__wrapper) {
    padding: 8px 15px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    position: relative;
    width: 100%;
    border-radius: 30px;
    font-size: 14px;
    background: linear-gradient(180deg, #FFFFFF 0%, #E3EFFF 100%);
    box-shadow: 0px 2px 2px 0px rgba(255, 255, 255, 0.8) inset, 0px 2px 0px 0px #C6D9FF;
  }
}

.slot-container {
  height: 291px;
}
</style>
