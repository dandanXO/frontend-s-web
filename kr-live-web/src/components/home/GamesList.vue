<template>
  <div class="main-section">
    <q-ajax-bar ref="ajaxBarRef" position="top" size="5px" skip-hijack
      style="background:linear-gradient(320.55deg, #0286FF 0.35%, #00FF85 99.65%)" />

    <GameCategory :onClickGameCategory="(categoryName, categoryIndex) => switchMenu(categoryName, categoryIndex)"
      :selectedCategory="currentSelectedMenu" data-aos="zoom-in-up" />

    <q-carousel v-model="currentSelectedMenu" transition-prev="slide-right" transition-next="slide-left" animated
      control-color="primary" class="rounded-borders" style="background: transparent; height: 100%;">
      <q-carousel-slide name="live" class="column no-wrap flex-center">
        <div class="game-list-wrapper">
          <div class=" game-list">
            <GameItems :games="liveCasinoGames" :gameType="currentSelectedMenu" :onClickGameItem="openGame" />
          </div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="slots" class="column no-wrap flex-center">
        <div class="game-list-wrapper">
          <!-- slot start -->
          <div class="game-list" v-if="!isShow">
            <GameItems :games="platforms" :gameType="currentSelectedMenu" :onClickGameItem="selectSlotPlat" />
          </div>

          <div class="game-scroll-lists" id="id-slot-board" v-if="isShow" :gameType="currentSelectedMenu">
            <q-scroll-area style="height: 500px"
              :style="!$q.screen.gt.sm ? 'width: 80px; max-width: 80px' : 'width: 120px; max-width: 120px'">
              <div class="bookmarks">
                <div class="plat-item" v-for="p in platforms" :class="{ active: p.id === selectedPlatId }" :key="p"
                  @click="switchPlat(p, 'slots')">
                  <div class="platform-img" :title="p.code" :style="{
                    backgroundImage: (() => {
                      try {
                        return `url(${require(`../../assets/home/games/logo/game-logo-${p.code.toLowerCase()}.png`)})`;
                      } catch (e) {
                        return `url(${comingSoonImg})`;
                      }
                    })()
                  }"></div>
                </div>
              </div>
            </q-scroll-area>

            <div class="loading-div" v-if="isLoading">
              <q-spinner-orbit :color="'primary'" size="8em" />
            </div>

            <q-scroll-area v-if="!isLoading && selectedPlatId !== -99" ref="scrollSlotRef" style="height: 500px"
              :style="!$q.screen.gt.sm ? 'width: calc(100% - 80px)' : 'width: calc(100% - 120px)'">
              <div class="search-list">
                <q-form @submit="searchList">
                  <q-input dense outlined class="search-input" v-model="gamePage.searchKey"
                    :label="$t('lang.keyin_keyword')">
                    <template v-slot:append>
                      <q-icon style="margin-right: 5px" @click="clearSearchInput" class="clear-input-icon btn-pointer"
                        name="close"></q-icon>

                      <q-icon color="brightbtn" name="search" style="" @click="searchList"
                        class="clear-input-icon btn-pointer"></q-icon>
                    </template>
                  </q-input>
                </q-form>
              </div>
              <SlotGrid :gameList="gamePage.gameList" :openSlotGame="openSlotGame" :selectedPlat="selectedPlat" />
              <BacktoTop v-if="scrollPosition.top > 400" @click="scrollToTop" />
              <q-scroll-observer @scroll="scrolling" />
            </q-scroll-area>
          </div>
          <!-- slot end -->
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="sport" class="column no-wrap flex-center">
        <div class="game-list-wrapper">
          <div class="game-list">
            <GameItems :games="esportPlatform" :gameType="'esport'" :onClickGameItem="openGame" />
            <GameItems :games="sportPlatform" :gameType="currentSelectedMenu" :onClickGameItem="openGame" />
          </div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="casual" class="column no-wrap flex-center">
        <div class="game-list" v-if="!isShow">
          <GameItems :games="platformMinigame" :gameType="currentSelectedMenu" :onClickGameItem="selectCasualPlat" />
        </div>
        <!-- cq9 start -->
        <div class="game-scroll-lists" id="id-slot-board" v-if="isShow && selectedPlat.code === 'CQ9'"
          :gameType="currentSelectedMenu">
          <q-scroll-area style="height: 500px"
            :style="!$q.screen.gt.sm ? 'width: 80px; max-width: 80px' : 'width: 120px; max-width: 120px'">
            <div class="bookmarks">
              <div class="plat-item" v-for="p in fishPlatforms" :class="{ active: p.id === selectedPlatId }" :key="p"
                @click="switchPlat(p, 'slots')">
                <div class="platform-img" :style="{
                  backgroundImage: (() => {
                    try {
                      return `url(${require(`../../assets/home/games/logo/game-logo-${p.code.toLowerCase()}.png`)})`;
                    } catch (e) {
                      return `url(${comingSoonImg})`;
                    }
                  })()
                }"></div>
              </div>
            </div>
            <q-scroll-observer axis="vertical" />
          </q-scroll-area>

          <div class="loading-div" v-if="isLoading">
            <q-spinner-orbit :color="'primary'" size="8em" />
          </div>

          <q-scroll-area v-if="!isLoading && selectedPlatId !== -99" ref="scrollSlotRef" style="height: 500px"
            :style="!$q.screen.gt.sm ? 'width: calc(100% - 80px)' : 'width: calc(100% - 120px)'">
            <div class="search-list">
              <q-form @submit="searchList">
                <q-input color="white" filled class="search-input" v-model="gamePage.searchKey"
                  :label="$t('lang.keyin_keyword')">
                  <template v-slot:append>
                    <q-icon style="margin-right: 5px" @click="clearSearchInput" class="clear-input-icon btn-pointer"
                      name="close"></q-icon>

                    <q-icon color="brightbtn" name="search" style="" @click="searchList"
                      class="clear-input-icon btn-pointer"></q-icon>
                  </template>
                </q-input>
              </q-form>
            </div>
            <SlotGrid :gameList="gamePage.gameList" :openSlotGame="openSlotGame" :selectedPlat="selectedPlat" />
            <BacktoTop v-if="scrollPosition.top > 400" @click="scrollToTop" />
            <q-scroll-observer @scroll="scrolling" />
          </q-scroll-area>
        </div>
        <!-- cq9 end -->


        <MinigamesGrid v-if="selectedPlat.code === 'TFGaming' && isShow" :minigames="miniGames"
          :minigamesMore="miniGamesMore" :playGame="playGame" :showTypeWeb="showTypeWeb" :showTypeH5="showTypeH5"
          :showMiniType="showMiniType" :isLoading="isLoading" />
      </q-carousel-slide>
    </q-carousel>
  </div>

  <GameModal ref="gameModalRef"></GameModal>
</template>

<script>
/* eslint-disable */
import { debounce } from 'quasar'
import { defineComponent, onMounted, ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { cached } from "boot/cache";
import { useQuasar, Platform } from "quasar";
import { userStore } from "stores/index";
import GameModal from "components/modal/GameModal";
import GameItems from "components/game/GameItems";
import GameCategory from "components/game/GameCategory";
import orderBy from "lodash/orderBy";
import findIndex from "lodash/findIndex";
import BacktoTop from "components/backtotop.vue";

import { isMobile } from "boot/utils";
import { useI18n } from "vue-i18n";
import MinigamesGrid from 'components/game/MinigamesGrid';
import SlotGrid from 'components/game/SlotGrid';

export default defineComponent({
  name: "IndexPage",
  components: {
    GameModal,
    BacktoTop,
    GameItems,
    GameCategory,
    MinigamesGrid,
    SlotGrid
  },
  setup() {
    const ajaxBarRef = ref(null)
    const $q = useQuasar();
    const { t } = useI18n();
    const siteId = process.env.SITEID;

    const gameBoardRef = ref();
    const gameBoardItemRef = ref();

    const router = useRouter();
    const store = userStore();

    const gameModalRef = ref(null);
    const openSlotGame = (gameName, gameCode, gameStatus, gameInfo) => {
      if (!store.token) {
        $q.notify({
          color: "negative",
          position: "top",
          message: "로그인 해주세요",
          icon: "report_problem"
        });

        router.push('/?page=login');
        return;
      }

      gameModalRef.value.open(gameName, selectedPlat.code, gameCode, gameStatus);
    };

    const openGame = debounce((p) => {
      if (!store.token) {
        $q.notify({
          color: "negative",
          position: "top",
          message: "로그인 해주세요",
          icon: "report_problem"
        });

        router.push('/?page=login');
        return;
      }

      ajaxBarRef.value.start();
      // debugger;
      console.log(p);
      const gameType = p.gameType;
      const gameName = p.name;
      const platformCode = p.code;
      const gameStatus = "OPEN";
      var gameCode = "";
      if (gameType === "SLOT" || gameType === "FISH") {
        gameCode = p.id;
      }

      if (platformCode === "PP") {
        gameCode = 101;
      }


      gameModalRef.value.open(gameName, platformCode, gameCode, gameStatus)?.then(() => {
        ajaxBarRef.value.stop();
      })?.catch(() => {
        ajaxBarRef.value.stop();
      });
    }, 500);

    const openFavGame = (gameName, gameCode, gameStatus, gameInfo) => {
      gameModalRef.value.open(gameName, gameInfo.platformCode, gameCode, gameStatus);
    };

    const favGamesList = ref([]);
    const sortedFavGamesList = computed(() => {
      if (favGamesList.value.length === 0) {
        return [];
      }
      return favGamesList.value.sort((a, b) => a.updateTime - b.updateTime);
    });

    const favLists = computed(() => {
      let lists = [];
      favGamesList.value.forEach((element) => {
        lists.push(element.id);
      });
      return lists;
    });

    const playGame = (gameName, platformCode, gameCode, gameStatus) => {
      gameModalRef.value.open(gameName, platformCode, gameCode, gameStatus);
    };
    const xfjGames = ref([]);
    const liveCasinoGames = ref([]);
    const esportsGame = ref([]);
    const sportsGame = ref([]);
    const platformMinigame = ref([]);
    const miniGames = ref([]);
    const miniGamesMore = ref([
      {
        name: "KOG Draw",
        logo: require("../../assets/home/casual/2.png"),
        copper: "",
        silver: "",
        gold: ""
      },
      {
        name: "DOTA 2 Treasure",
        logo: require("../../assets/home/casual/5.png"),
        copper: "",
        silver: "",
        gold: ""
      },
      {
        name: "LOL Draft",
        logo: require("../../assets/home/casual/8.png"),
        copper: "",
        silver: "",
        gold: ""
      }
    ]);

    const platforms = ref([]);

    const selectedPlatId = ref();
    const selectedPlat = reactive({
      code: "",
      status: ""
    });
    const gamePage = reactive({
      gameList: [],
      currentPage: 1,
      pageSize: 40,
      searchType: "",
      searchKey: "",
      total: 0
    });

    const gameListData = ref([]);
    const fishPlatforms = ref([]);
    const esportPlatform = ref([]);
    const sportPlatform = ref([]);
    const lotteryGames = ref([]);
    const lotteryGamesMore = ref([]);
    const lotteryGamesList = computed(() => {
      if (isShow.value) {
        return lotteryGamesMore.value;
      }

      return lotteryGames.value;
    });
    const gameBoardItemData = [
      { name: "live", label: "라이브카지노", enLabel: "LIVE CASINO" },
      { name: "slots", label: "슬롯게임", enLabel: "SLOT GAME" },
      { name: "esport", label: "E-스포츠", enLabel: "ESPORTS" },
      { name: "sport", label: "스포츠", enLabel: "SPORTS" },
      { name: "casual", label: "미니게임", enLabel: "MINI GAME" }
      // { name: "fish", label: "낚시 게임" }
    ];

    const currentSelectedMenu = ref("slots");
    const switchMenu = (menu, index) => {
      currentSelectedMenu.value = menu;
      selectedPlatId.value = '';
      isShow.value = false;
    };
    const liveTabs = ref("");
    const switchPlat = (plat, menuType) => {
      isLoading.value = true;
      if (menuType === "slots") {
        selectedPlat.code = plat.code;
        selectedPlat.status = plat.status;
        selectedPlatId.value = plat.id;
        loadGameList("SLOT");
        if (scrollPageRef.value) {
          scrollSlotRef.value.setScrollPosition("vertical", 0);
        }
        gamePage.searchKey = "";
      } else if (menuType === "live") {
        selectedLiveTab.value = plat.name;
        liveTabs.value = plat.name;
      } else if (menuType === "fish" || (menuType === "casual" && plat.code === "CQ9")) {
        selectedPlat.code = plat.code;
        selectedPlat.status = plat.status;
        selectedPlatId.value = plat.id;
        loadGameList("FISH");
        if (scrollPageRef.value) {
          scrollFishRef.value.setScrollPosition("vertical", 0);
        }
      } else if (menuType === "poker") {
        selectedLiveTab.value = plat.name;
        liveTabs.value = plat.name;
      } else if (menuType === "casual") {
        // debugger;
        selectedLiveTab.value = plat.name;
        liveTabs.value = plat.name;

        selectedPlat.code = plat.code;
        selectedPlat.status = plat.status;

        loadGameList("CASUAL");
      } else if (menuType === "sport") {
        selectedLiveTab.value = plat.name;
        liveTabs.value = plat.name;
      } else if (menuType === "lottery") {
        selectedPlat.code = plat.code;
        selectedPlat.status = plat.status;

        loadGameList("LOTTERY");
      }
    };
    const clearSearchInput = () => {
      gamePage.searchKey = "";
      changePage(1, gamePage.pageSize);
    };
    const searchList = () => {
      if (gamePage.searchKey) {
        gamePage.gameList = gameListData.value.filter((game) => {
          return game.name.toLowerCase().includes(gamePage.searchKey.toLowerCase());
        });
      } else {
        changePage(1, gamePage.pageSize);
      }
    };
    const scrollSlotRef = ref();
    const scrollFishRef = ref();
    const scrollPageRef = ref();
    const isLoading = ref(false);
    const loadGameList = (type) => {
      const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
      const code = selectedPlatId.value;
      const gameType = type;
      const key = store.hasToken()
        ? `LOGGED_PLATFORM_GAMES_${code}_${gameType}_${regDevice}`
        : `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;

      var platformGamesApiUrl = store.hasToken() ? "/session/loggedInPlatformGames" : "/platformGames";

      cached
        .get(key, () =>
          api
            .get(platformGamesApiUrl, {
              params: {
                platformId: code,
                gameType: gameType,
                device: regDevice
              }
            })
            .then((ret) => {
              const res = ret.data;
              if (res.code === 0) {
                isLoading.value = false;
                return res;
              }
            })
            .catch((err) => {
              isLoading.value = false;
            })
        )
        .then((res) => {
          isLoading.value = false;

          // debugger;
          if (currentSelectedMenu.value === "casual" && selectedPlat.code !== 'CQ9') {
            miniGames.value = [];
            let minis = orderBy(res, "sequence");
            minis.forEach((mini) => {
              mini.lists = [];
            });
            let games = [];
            minis.forEach((mini) => {
              if (mini.icon.startsWith("10/")) {
                mini.icon = `${process.env.IMAGE_CDN}/game/${mini.icon}`;
              } else {
                mini.icon = `${process.env.IMAGE_CDN}/game/${siteId}/${selectedPlat.code.toLowerCase()}/${mini.code
                  }.png`;
              }
              if (mini.name.indexOf("(铜)") > -1 || mini.name.indexOf("(银)") > -1 || mini.name.indexOf("(金)") > -1) {
                games.push(mini);
              } else {
                miniGames.value.push(mini);
              }
            });

            // console.log(miniGames);

            games.forEach((game) => {
              let index = findIndex(miniGamesMore.value, function (o) {
                return game.name.indexOf(o.name) > -1;
              });
              if (game.name.indexOf("(铜)") > -1) {
                miniGamesMore.value[index]["copper"] = game.code;
              } else if (game.name.indexOf("(银)") > -1) {
                miniGamesMore.value[index]["silver"] = game.code;
              } else if (game.name.indexOf("(金)") > -1) {
                miniGamesMore.value[index]["gold"] = game.code;
              }
            });
            // console.log(miniGamesMore.value);
          } else if (currentSelectedMenu.value === "lottery") {
            lotteryGamesMore.value = res;
          } else {
            res.forEach((element) => {
              element.default = require("../../assets/images/games/aviator/default.png");
              element.icon = `${process.env.IMAGE_CDN}/game/${element.icon}`;
            });
            gameListData.value = res;
            gamePage.total = res.length;
            changePage(1, gamePage.pageSize);
          }
        });
    };
    const changePage = (page, pageSize) => {
      gamePage.gameList = gameListData.value;
    };

    var platformApiUrl = store.hasToken() ? "/session/loggedInPlatform" : "/platform";
    var platformApiKey = store.hasToken() ? "LOGGEDPLATFORMS" : "PLATFORMS";

    const getPlatList = async () => {
      cached
        .get(platformApiKey, () =>
          api.get(platformApiUrl).then((res) => {
            const response = res.data;
            return response;
          })
        )
        .then((data) => {
          fishPlatforms.value = data.filter((element) => element.gameType.includes("FISH"));
          platforms.value = data.filter((element) => element.gameType.includes("SLOT"));
          esportPlatform.value = data.filter((element) => element.gameType.includes("ESPORT"));
          liveCasinoGames.value = data.filter((element) => element.gameType.includes("LIVE"));
          sportPlatform.value = data.filter((element) => element.gameType.split(",").indexOf("SPORT") > -1);
          platformMinigame.value = data.filter((element) => element.gameType.includes("CASUAL") || (element.gameType.includes("FISH") && element.code === "CQ9"));
        })
        .catch((err) => { });
    };

    const comingSoonImg = require(`../../assets/home/slot/StayTuned.png`);

    const activeKey = ref(null);

    const isShowBtt = ref(false);
    const scrollPosition = ref(0);
    const scrolling = (e) => {
      scrollPosition.value = e.position;
      if (e.position.top > 400) {
        isShowBtt.value = true;
      }
    };

    // isH5 -- platform checker
    const isH5 = ref(false);
    const checkPlatform = () => {
      //Is iOS Webclip App || Is Android Apk
      if (
        (Platform.is.ios && "standalone" in window.navigator && window.navigator.standalone) ||
        (Platform.is.android && Platform.is.capacitor)
      ) {
        isH5.value = false;
      } else {
        isH5.value = true;
      }
    };

    const position = ref(0);
    const scrollToTop = (el) => {
      scrollSlotRef.value?.setScrollPosition("vertical", position);
      scrollPageRef.value?.setScrollPosition("vertical", position);
      isShowBtt.value = false;
    };

    onMounted(() => {
      checkPlatform();
      loadHomeData();
    });

    const loadHomeData = async () => {
      if (store.hasToken()) {
        await store.getMemberInfo();
      }

      getPlatList();
    };
    const imageLoading = ref(false);
    const selectedLiveTab = ref();

    const isShow = ref(false);
    const selectSlotPlat = (plat) => {
      selectedPlatId.value = plat.id;
      isShow.value = true;
      switchPlat(plat, "slots");
    };
    const selectFishPlat = (plat) => {
      selectedPlatId.value = plat.id;
      isShow.value = true;
      switchPlat(plat, "fish");
    };
    const selectLotteryPlat = (plat) => {
      // debugger;
      selectedPlatId.value = plat.id;
      isShow.value = true;
      switchPlat(plat, "lottery");
    };
    const selectCasualPlat = (plat) => {
      console.log(plat);
      if (plat.code === "Spribe") {
        playGame(plat.name, plat.code, "aviator");
      } else if (plat.code === "CQ9") {
        selectedPlatId.value = plat.id;
        isShow.value = true;
        switchPlat(plat, "fish");
      } else {
        selectedPlatId.value = plat.id;
        isShow.value = true;
        switchPlat(plat, "casual");
      }
    };
    const isGoMiniGame = ref(false);
    const showTypeH5 = (id) => {
      if (isMobile()) {
        showMiniType.value = id;
        setTimeout(() => {
          isGoMiniGame.value = true;
        }, 500);
      }
    };

    const showMiniType = ref(0);
    const showTypeWeb = (id) => {
      showMiniType.value = id;
      if (id === 0) {
        isGoMiniGame.value = false;
      }
    };

    return {
      ajaxBarRef,
      imageLoading,
      imgURL: process.env.IMAGE_CDN + "/promo/",
      gameImgURL: process.env.IMAGE_CDN + "/game/",
      gameBoardRef,
      gameBoardItemRef,
      gameBoardItemData,
      store,
      platforms,
      fishPlatforms,
      comingSoonImg,
      liveCasinoGames,
      xfjGames,
      lotteryGames,
      lotteryGamesMore,
      lotteryGamesList,
      isShow,
      playGame,
      gameModalRef,
      switchPlat,
      scrolling,
      scrollToTop,
      switchMenu,
      gamePage,
      isLoading,
      selectedPlat,
      scrollPosition,
      isShowBtt,
      scrollSlotRef,
      scrollFishRef,
      selectedPlatId,
      searchList,
      clearSearchInput,
      liveTabs,
      selectedLiveTab,
      currentSelectedMenu,
      esportsGame,
      esportPlatform,
      sportPlatform,
      selectFishPlat,
      selectLotteryPlat,
      selectSlotPlat,
      selectCasualPlat,
      platformMinigame,
      isGoMiniGame,
      miniGames,
      miniGamesMore,
      sportsGame,
      showTypeH5,
      showTypeWeb,
      showMiniType,
      openGame,
      openSlotGame,
      scrollPageRef,
      activeKey,
      isH5
    };
  }
});
</script>
<style scoped lang="scss">
.slot-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 0px auto 10px;
  align-items: flex-start;
  column-gap: 10px;
  row-gap: 10px;
  width: calc(100% - 20px);

  .inner-slot-game {
    position: relative;
  }

  .q-list {
    .q-img {
      aspect-ratio: 1/1;

      .q-img__image {
        width: 100%;
        height: 100%;
        object-fit: fill !important;
      }
    }
  }

  .slot-name {
    text-align: center;
    padding: 5px 2px 0px;
    font-size: 10px;
    background: transparent;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 75px;
    margin: auto;

    @media (min-width: 600px) {
      font-size: 12px;
      word-break: normal;
      padding: 10px 2px;
      width: auto;
      white-space: wrap;
    }

    @media (min-width: 769px) {
      font-size: 14px;
    }
  }
}

.game-scroll-lists {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  // width: calc(100% - 20px);
  width: 100%;
  margin: 6px auto 10px;
  position: relative;

  @media (min-width: 769px) {
    margin: 12px auto 20px;
    padding-top: 15px;
  }

  .bookmarks {
    width: 60px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    grid-gap: 0px;
    justify-content: flex-start;

    .plat-item {
      display: flex;
      width: 100%;
      height: 40px;
      box-sizing: content-box;
      padding: 5px;
      justify-content: center;
      align-items: center;
      background: #4f4f4f36;

      .platform-img {
        max-width: 85px;
        filter: grayscale(1);

        width: 100%;
        height: auto;
        aspect-ratio: 200/133;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      img {
        max-width: 50px;
        filter: grayscale(1);
      }

      &:active {
        filter: brightness(0.86);
      }

      span {
        color: rgba(200, 200, 200, 0.5);
        font-size: 20px;
        font-weight: bold;
      }

      &.active {
        background: linear-gradient(312deg, #0286FF 0%, #00FF85 100%);
        box-shadow: inset 0 0 5px #ffffff;

        img {
          filter: grayscale(0);
        }

        .platform-img {
          filter: grayscale(0);
        }

        span {
          color: #ffffff;
        }
      }
    }
  }
}

.loading-div {
  z-index: 99;
  position: absolute;
  top: 0;
  text-align: center;
  right: 0px;
  width: calc(100% - 130px);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: $header-color;
    width: 48px;
  }
}

.minigame-select-div {
  position: relative;

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 672 / 828;
  }

  .select-type-div {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 99;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 12px;

    .game-type {
      width: 100%;
      height: 33.3%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      font-weight: bold;
      color: #000;
      text-shadow: 1px 1px 1px $text-gray;

      &#copper-type {
        background: #b87333;
        opacity: 0.85;
        border-radius: 12px 12px 0px 0px;

        &:hover {
          opacity: 1;
        }

        &:active {
          filter: brightness(1.2);
        }
      }

      &#silver-type {
        background: #c0c0c0;
        opacity: 0.85;

        &:hover {
          opacity: 1;
        }

        &:active {
          filter: brightness(1.2);
        }
      }

      &#gold-type {
        background: #ffd700;
        opacity: 0.85;
        border-radius: 0px 0px 12px 12px;

        &:hover {
          opacity: 1;
        }

        &:active {
          filter: brightness(1.2);
        }
      }
    }
  }
}

.search-list {
  display: flex;
  margin-bottom: 16px;
  margin-right: 10px;
  margin-left: 10px;

  justify-content: flex-end;

  .search-input {
    max-width: 450px;
    margin-left: auto;

    &.q-field--filled .q-field__control {
      border-radius: 12px;
    }
  }

  .clear-input-icon {
    cursor: pointer;
    opacity: 0.8;
  }
}

@media (min-width: 769px) {

  .game-scroll-lists {
    .bookmarks {
      width: 80px;

      .plat-item {
        img {
          max-width: 70px;
        }
      }
    }
  }

  .slot-grid {
    grid-template-columns: repeat(6, 1fr);
    column-gap: 14px;
    row-gap: 14px;
  }
}

@media (min-width: 991px) {
  .grid {
    padding: 0px 12px;
  }

  .main-section {
    background-repeat: repeat-x;
  }

  .slot-grid {
    grid-template-columns: repeat(9, 1fr);
  }
}

.game-list-wrapper {
  display: flex;
  width: 100%;
  min-height: 500px;
}

.game-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  // padding: 20px;
  width: 100%;

  @media (max-width: 769px) {
    padding: 0px 10px;
    gap: 5px;
  }

  @media (min-width: 769px) {
    .game-item {
      max-width: 220px;
    }
  }
}
</style>