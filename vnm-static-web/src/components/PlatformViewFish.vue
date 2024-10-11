<template>
  <div class="platform-section" :style="{
    'background-size': 'cover',
    'background-image':
      platformType !== 'slot' && platformType !== 'fishing' && platformType !== 'casual'
        ? 'url(' + require('../assets/' + platformType + '/' + platformType + '-bg.png') + ')'
        : 'none'
  }">
    <div v-if="platformsListDisplay.length > 0" class="platform-container" :class="platformType === 'slot' || platformType === 'fishing' || platformType === 'casual'
      ? `${platformType}-container`
      : ''
      ">
      <div class="platform-container-slot" :class="platformType"
        v-if="platformType === 'slot' || platformType === 'fishing' || platformType === 'casual'">
        <img :src="require(`../assets/slot/${platformType}-top-bg-${languageVal}.png`)" />
      </div>
      <div class="platform-container-inner"
        v-if="platformType !== 'slot' && platformType !== 'fishing' && platformType !== 'casual'">
        <!-- <template v-for="(item, index) in filteredPlatforms" :key="index"> -->
        <template v-for="(item, index) in platformsListDisplay" :key="index">
          <template v-if="selectedPlat === item.code">
            <div class="platform-item platform-item--img" data-aos="fade-right" data-aos-duration="1000">
              <img :src="require('../assets/' +
                platformType +
                '/' +
                platformType +
                '-itempg-' +
                item.code.toLowerCase() +
                '.png')
                " />
            </div>

            <div class="platform-item">
              <div class="platform-title">
                <img style="height: 60px" :src="require('../assets/' +
                  platformType +
                  '/' +
                  platformType +
                  '-biglogo-' +
                  item.code.toLowerCase() +
                  '.png')
                  " />
              </div>
              <div class="platform-title-wrap" data-aos="fade-left" data-aos-delay="100">
                <div class="platform-subtitle">{{ $t(`menu.${platformName}`) }}</div>
              </div>

              <div v-if="languageVal === 'en'" class="platform-txt-box" data-aos="fade-left" data-aos-delay="200"
                v-html="item.message"></div>
              <div v-if="languageVal === 'vi'" class="platform-txt-box" data-aos="fade-left" data-aos-delay="200"
                v-html="item.vimessage"></div>

              <div class="platform-pattern-row" data-aos="fade-left" data-aos-delay="300" v-if="platformPattern">
                <img :src="require('../assets/' + platformType + '/' + platformType + '-pattern.png')" />
              </div>

              <div class="platform-list-box">
                <span class="platform-list-item" v-for="(plat, platIndex) in filteredPlatforms" :key="platIndex"
                  @click="clickPlat(plat)" :class="{ active: selectedPlat === plat.code }">
                  <div class="list-item-btn">
                    <span>
                      <img :src="require('../assets/' +
                        platformType +
                        '/' +
                        platformType +
                        '-logo-' +
                        plat.code.toLowerCase() +
                        '.png')
                        " />
                    </span>
                  </div>
                  <div class="list-item-txt">{{ plat.alias ?? plat.name }}</div>
                </span>
              </div>

              <!--            data-aos="fade-in"-->
              <!--            data-aos-delay="300"-->
              <!--            data-aos-duration="500"-->
              <div class="platform-play-btn" v-if="platformType !== 'slot' || platformType !== 'fishing'">
                <div class="btn-blue" @click="openGame(item, item.code, item.gameCode)"
                  :class="item.underMaintenance === true ? 'btn-maintenance' : ''">
                  <span class="maintenance-state" v-if="item.underMaintenance === true">
                    <img src="../assets/svg/maintenance-icon.svg" />
                    {{ $t("common.maintenance") }}
                  </span>
                  <span v-else>{{ $t("common.playnow") }}</span>
                </div>

                <p v-if="item.underMaintenance === true && item.maintenanceStartTime && item.maintenanceEndTime"
                  class="maintenance-p">
                  {{ $t("common.maintenanceTime") }}:
                  <em>{{ toGMT7(item.maintenanceStartTime) }} - {{ toGMT7(item.maintenanceEndTime) }}</em>
                </p>
                <p v-else>&nbsp;</p>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
    <div v-else class="empty-container">
      <img src="../assets/logo.svg" />
      {{ $t("common.comingSoon") }}
    </div>

    <div class="margin-center game-container" v-if="platformExpandable">
      <div class="all-game-menus">
        <div class="all-game-tabs">
          <div class="all-game-tab" @click="selectTab('fishing')" :class="selectedTab === 'fishing' ? 'active' : ''">
            {{ $t("menu.fishing") }}
          </div>
          <div class="all-game-tab" @click="selectTab('cockfight')"
            :class="selectedTab === 'cockfight' ? 'active' : ''">
            {{ $t("menu.cockfight") }}
          </div>
        </div>
      </div>

      <div class="all-game-container">
        <div class="plat-options-wrapper">
          <div class="plat-options-container" v-if="selectedTab === 'fishing'">
            <template v-for="(item, index) in platformsListDisplay" :key="index">
              <div class="plat-option" @click="clickPlat(item)" :class="{ active: selectedPlat === item.code }">
                <div class="text">
                  <span v-if="item.code === 'AG'">XIN</span>
                  <span v-else>{{ item.code }}</span>
                </div>
              </div>
            </template>
          </div>
          <!-- <div class="plat-options-container" v-if="selectedTab==='cockfight'">
            <template v-for="(item, index) in platformsListDisplay2" :key="index">
              <div class="plat-option" @click="clickPlat(item)" :class="{ active: selectedPlat === item.code }">
                <div class="text">
                  <span v-if="item.code === 'WS'">{{ item.alias }}</span>
                  <span v-else>{{ item.code }}</span>
                </div>
              </div>
            </template>
          </div> -->
        </div>

        <div class="plat-games-container" v-if="selectedTab === 'fishing'">
          <div class="grid-items flex-box flex-align-center search-container web-only-box">
            <el-input class="search-input" v-model="gamePage.searchKey" @input="searchList()"
              :placeholder="$t('common.search')" clearable @clear="searchList()">
              <template #suffix>
                <el-icon :width="15" @click="searchList()">
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </div>

          <div class="game-list-wrapper">
            <div class="game-slot animate__animated animate__fadeInRight" v-for="game in gamePage.gameList"
              :key="game.id">
              <a @click="openGame(game, selectedPlat, game.code)">
                <div class="slot-img">
                  <el-image :src="game.icon" lazy>
                    <template #placeholder>
                      <img :src="game.default" />
                    </template>
                    <template #error>
                      <div class="image-slot">
                        <img :src="game.default" />
                      </div>
                    </template>
                  </el-image>
                </div>

                <div class="slot-details">
                  <div class="slot-name">
                    {{ game.name }}
                  </div>

                  <div class="slot-fav"></div>
                </div>
              </a>

              <div @click="openGame(game, selectedPlat, game.code)" class="play-btn">
                {{ $t("common.playnow") }}
              </div>
            </div>
          </div>
          <div class="pagination-wrapper">
            <el-pagination background layout="prev, pager, next" :total="gamePage.total"
              @current-change="changePage(gamePage.currentPage, gamePage.pageSize)"
              v-model:current-page="gamePage.currentPage" v-model:pageSize="gamePage.pageSize" default-page-size="30" />
          </div>
        </div>

        <div class="plat-games-container" v-if="selectedTab === 'cockfight'">
          <div class="game-list-wrapper cockfight-special">
            <div class="game-slot animate__animated animate__fadeInRight" v-for="game in platformsListDisplay2"
              :key="game.id">
              <a @click="openGame(game, game.code, game.gameCode)">
                <div class="cockfight-img">
                  <div class="platform-menu-img">
                    <img :src="require('../assets/' +
                      game.gameType.toLowerCase() +
                      '/' +
                      game.gameType.toLowerCase() +
                      '-item-' +
                      game.code.toLowerCase() +
                      '.png')
                      " />
                  </div>
                </div>

                <div class="slot-details">
                  <div class="slot-name">
                    {{ game.alias }}
                  </div>

                  <div class="slot-fav"></div>
                </div>
                <div class="play-btn">
                  {{ $t("common.playnow") }}
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <GameModal ref="platformGame"></GameModal>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getLoggedInPlatformList, getPlatformGames, getPlatformListDisplay } from "@/api/platform/platform";
import { userStore } from "@/store";
import { Search } from "@element-plus/icons-vue";

import { i18nStore } from "@/store/language";
import { storeToRefs } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { toGMT7 } from "@/utils/utils";

const GameModal = defineAsyncComponent(() => import('@/components/modal/GameModal.vue'));
const i18nStoreLanguage = i18nStore();
const { languageVal } = storeToRefs(i18nStoreLanguage);
const platformGame = ref(null);
const route = useRoute();
const router = useRouter();
const store = userStore();

const props = defineProps({
  platforms: Array,
  platforms2: Array,
  platformType: String,
  platformGameType: String,
  platformName: String,
  platformPattern: Boolean,
  platformExpandable: Boolean
});

const filteredPlatforms = ref([]);
const filteredPlatforms2 = ref([]);
const platformsList = ref([]);
const platformsListDisplay = ref([]);
const platformsListDisplay2 = ref([]);

const selectedTab = ref("fishing");

const selectTab = (type) => {
  selectedTab.value = type;
  if (selectedTab.value === "cockfight") {
    setSelectedPlat();
  } else {
    setSelectedPlat();
  }
};

const getPlatList = () => {
  const getFn = store.token ? getLoggedInPlatformList : getPlatformListDisplay;
  getFn().then((res) => {
    // console.log(res,'dan')
    platformsList.value = res;

    // console.log(platformsList.value);
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
      const matchingItem = props.platforms2.find((item2) => item1.code === item2.code);
      return { ...matchingItem, ...item1 };
    });

    // console.log("polat2")
    // console.log(platformsListDisplay2.value)

    setFilteredPlatforms();
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

  filteredPlatforms2.value = props.platforms2.filter((displayPlatform) =>
    platformsListDisplay2.value.some((platform) => platform.code === displayPlatform.code)
  );

  filteredPlatforms2.value = platformsListDisplay2.value.map((item1) => {
    const matchingItem = props.platforms2.find((item2) => item1.code === item2.code);
    return { ...matchingItem, ...item1 };
  });

  console.log("Filter plat");
  console.log(filteredPlatforms2.value);
  // console.log(platformsListDisplay.value);

  // debugger;
  if (route.query.type) {
    selectedTab.value = route.query.type;
  }

  if (!route.query.plat) {
    selectedTab.value = "fishing";
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
const setSelectedPlat = () => {
  if (selectedTab.value === "cockfight") {
    selectedPlat.value = filteredPlatforms2.value.length > 0 ? filteredPlatforms2.value[0].code : null;
  } else {
    selectedPlat.value = filteredPlatforms.value.length > 0 ? filteredPlatforms.value[0].code : null;
  }
};

const clickPlat = (plat) => {
  if (plat.gameType === "COCKFIGHT") {
    router.push("/others?type=COCKFIGHT");
    return;
  }

  router.push({ path: route.path, query: { plat: plat.code } });
  selectedPlat.value = plat.code;
};

const openGame = (item, platformCode, gameCode) => {
  const platName = item.alias ?? item.name ?? item.name;
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
  router.push({ path: route.path, query: { plat: plat.code } });
  activePlat.value = plat;
  // selectedPlat.value = plat.code;
  gamePage.currentPage = 1;
  loadGameList();
  clickPlat(plat);
};

const getPlatGameList = () => {
  if (props.platformGameType === "SLOT" || props.platformGameType === "FISH" || props.platformGameType === "CASUAL") {
    const getFn = store.token ? getLoggedInPlatformList : getPlatformListDisplay;
    getFn()
      .then((data) => {
        platformsListDisplay.value = data.filter((element) => element.gameType.includes(props.platformGameType));
        platformsListDisplay.value = platformsListDisplay.value.map((item1) => {
          const matchingItem = props.platforms.find((item2) => item1.code === item2.code);
          return { ...matchingItem, ...item1 };
        });

        platformsListDisplay2.value = data.filter((element) => element.gameType.includes("COCKFIGHT"));
        platformsListDisplay2.value = platformsListDisplay2.value.map((item1) => {
          const matchingItem = props.platforms2.find((item2) => item1.code === item2.code);
          return { ...matchingItem, ...item1 };
        });

        if (!route.query.plat) {
          switchPlat(platformsListDisplay.value.find((obj) => obj.gameType !== "COCKFIGHT"));
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
      });
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
  if (props.platformGameType === "SLOT" || props.platformGameType === "FISH" || props.platformGameType === "CASUAL") {
    getPlatformGames(activePlat.value.id, props.platformGameType)
      .then((data) => {
        data.forEach((element) => {
          element.default = require("../assets/images/games/aviator/default.png");
          var imageUrl = useLocalStorage("IMAGE_CDN", process.env.VUE_APP_IMAGE_CDN).value;
          element.icon = `${imageUrl}/game/${element.icon}`;
        });
        gameListData.value = data;
        gamePage.total = data.length;
        changePage(1, gamePage.pageSize);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
};

const changePage = (page, pageSize) => {
  // console.log(page);
  // console.log(pageSize);
  gamePage.gameList = gameListData.value.slice((page - 1) * pageSize, page * pageSize);
};

const gameCat = ref("allGame");

onMounted(() => {
  getPlatList();
  getPlatGameList();
});

watch(
  () => route.query.plat,
  () => {
    if (route.path === route.path) {
      selectedTab.value = route.query.type ?? "fishing";
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

watch(
  () => route.query.type,
  () => {
    if (route.path === route.path) {
      if (route.query.type === "cockfight") {
        selectedTab.value = "cockfight";
        setSelectedPlat();
      } else {
        selectedTab.value = "fishing";
        platformsListDisplay.value.forEach((element) => {
          if (element.code === route.query.plat) {
            clickPlat(element);
            getPlatGameList();
            loadGameList();
          }
        });
      }
    }
  }
);
</script>

<style scoped lang="scss" src="../scss/pages/platform.scss" />
