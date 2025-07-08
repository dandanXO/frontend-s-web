<template>
  <q-page>
    <div class="loading-div" v-if="isLoading">
      <q-spinner-hourglass color="blue-6" size="8em" />
    </div>
    <div class="pageitem">
      <div class="category-list">
        <q-btn
          v-for="(category, index) in ['baccarat', 'roulette', 'lucky-lace']"
          class="category-item"
          flat
          :key="index"
          :class="{
            activated: currentCategory === category
          }"
          @click="handleCategoryClick(category)"
        >
          <img
            :src="
              require(`../../assets/images/games/baccarat/category-icon-${category}${
                currentCategory === category ? '-active' : ''
              }.svg`)
            "
          />
          <span>百家乐</span>
        </q-btn>
      </div>
      <q-scroll-area ref="scrollSlotRef" style="height: calc(100% - 16px)" v-if="!isLoading">
        <div class="grid" style="padding-bottom: 20px">
          <div
            v-for="(game, index) in currentGameList"
            :key="index"
            :data-id="index"
            @click="openGame(game.name, game.code, selectedCat.status)"
            style="height: 140px"
          >
            <transition name="in-view">
              <q-list class="q-col-gutter-none">
                <q-img
                  loading="lazy"
                  :src="game.icon"
                  :placeholder-src="game.default"
                  fit="cover"
                  height="100px"
                  spinner-color="white"
                  position="50% 20%"
                  style="border-radius: 10px; overflow: hidden"
                  :imgClass="selectedCat.code === 'PG' ? 'zoomin' : ''"
                >
                  <template v-slot:loading>
                    <img
                      :src="game.default"
                      style="width: 100%; height: 100px; border-radius: 15px; overflow: hidden"
                    />
                  </template>
                </q-img>
                <div class="slot-name">{{ game.name }}</div>
              </q-list>
            </transition>
          </div>
        </div>
        <BacktoTop v-if="scrollPosition.top > 400" @click="scrollToTop" />
        <q-scroll-observer @scroll="scrolling" />
      </q-scroll-area>
    </div>
    <GameModal ref="slotsGame"></GameModal>
  </q-page>
</template>

<script setup>
import { defineComponent, onMounted, onBeforeUnmount, reactive, ref, computed, toRefs, watch } from "vue";
import GameModal from "components/modal/GameModal";
import { useRoute } from "vue-router";
import { useQuasar, Platform } from "quasar";
import { api } from "boot/axios";
import { cached } from "boot/cache";
import { useUI } from "stores/ui";
import BacktoTop from "components/backtotop.vue";
import { scroll, SessionStorage } from "quasar";
import { isAndroid } from "boot/utils";
import { userStore } from "src/stores";
import { useLocalStorage } from "@vueuse/core";

const qs = require("qs");

const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value;
const $q = useQuasar();
const route = useRoute();
const store = userStore();
const slotsGame = ref(null);
const platforms = ref([]);
const selectedCatId = ref(1);
const selectedCat = ref("");
const selectedPlatId = ref(null);
const gamePage = reactive({
  gameList: [],
  currentPage: 1,
  pageSize: 40,
  searchType: "",
  searchKey: "",
  total: 0
});
const gameListData = ref([]);
const isLoading = ref(false);
const scrollInfo = ref({});

const baccarat = ref([]);
const roulette = ref([]);
const luckyLace = ref([]);
const currentCategory = ref("baccarat");

const currentGameList = computed(() => {
  if (currentCategory.value === "baccarat") {
    return baccarat.value;
  } else if (currentCategory.value === "roulette") {
    return roulette.value;
  } else if (currentCategory.value === "lucky-lace") {
    return luckyLace.value;
  }
  return [];
});

const switchPlat = (plat) => {
  isLoading.value = true;
  scrollSlotRef.value.setScrollPosition("vertical", 0);
  selectedPlat.value = plat;
  selectedPlatId.value = plat.id;
  loadGameList();
  gamePage.searchKey = "";
};

const selectedPlat = ref(route.query.platform);
watch(
  () => route.query,
  async () => {
    getPlatList();
  }
);

const getPlatList = () => {
  var platformApiUrl = store.hasToken() ? "/session/loggedInPlatform" : "/platform";
  var platformKey = store.hasToken() ? "LOGGEDPLATFORMS" : "PLATFORMS";
  cached
    .get(platformKey, () =>
      api.get(platformApiUrl).then((res) => {
        return res;
      })
    )
    .then((data) => {
      // platforms.value = data
      platforms.value = data.filter((element) => element.gameType.includes("LIVE"));
      platforms.value.forEach((e, i) => {
        if (e.code === "AWS") {
          platforms.value.splice(i, 1);
        }
      });
      if (!route.query.platform) {
        switchPlat(platforms.value[0]);
      } else {
        platforms.value.forEach((element) => {
          if (route.query.platform === element.code) {
            switchPlat(element);
          }
        });
      }
    })
    .catch((err) => {
      isLoading.value = false;
    });
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
const loadGameList = () => {
  isLoading.value = true;
  const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
  const code = selectedPlatId.value;
  const gameType = "LIVE";
  const key = `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;
  var way = null;
  if (Platform.is.android) {
    way = "ANDROID";
  } else if (Platform.is.ios) {
    way = "IOS";
  }
  const platformApiUrl = store.hasToken() ? "/session/loggedInPlatformGames" : "/platformGames";
  cached
    .get(key, () =>
      api
        .get(platformApiUrl, {
          params: { platformId: code, gameType: gameType, device: regDevice, way: way }
        })
        .then((res) => {
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
      res.forEach((item) => {
        item.icon = `${imgURL}/game/${item.icon}`;
        if (item.code.startsWith("101")) {
          item.default = require("../../assets/index/baccarat/slide-baccarat-img.png");
          baccarat.value.push(item);
        } else if (item.code.startsWith("103")) {
          item.default = require("../../assets/index/baccarat/slide-roulette-img.png");
          roulette.value.push(item);
        } else if (item.code.startsWith("112")) {
          item.default = require("../../assets/index/baccarat/slide-lucky-lace-img.png");
          luckyLace.value.push(item);
        }
      });
      // res.forEach(element => {
      //   element.default = require("../../assets/images/games/aviator/default.png");
      //   element.icon = `${imgURL}/game/${element.icon}`;
      // });
      // gameListData.value = res;
      isLoading.value = false;
      // gamePage.total = res.length;
      // changePage(1, gamePage.pageSize);
    });
};
const changePage = (page, pageSize) => {
  gamePage.gameList = gameListData.value;
};
const onShowSizeChange = (current, size) => {
  current = 1;
  gamePage.currentPage = 1;
  changePage(current, size);
};

const openGame = (gameName, gameCode, gameStatus) => {
  slotsGame.value.open(gameName, selectedPlat.value.code, gameCode, gameStatus);
};
const isShowBtt = ref(false);
// const scrolling = (e) => {
//   const clientHeight = e.verticalContainerSize
//   const scrollHeight = e.verticalSize
//   const scrollTop = e.verticalPosition
//   console.log(e)
//   e.ref.setScrollPosition('y', 50, 300)
//   if (e.verticalPosition > 90) {
//     isShowBtt.value = true
//   } else {
//     isShowBtt.value = false
//   }
//   if (scrollTop + clientHeight >= scrollHeight) {
//     console.log('Yay!')
//   } else {
//     console.log('scrolling?')
//   }

//   }

const { getScrollTarget, getVerticalScrollPosition, setVerticalScrollPosition } = scroll;
const scrollPosition = ref(0);
const scrolling = (e) => {
  scrollPosition.value = e.position;
  if (e.position.top > 400) {
    isShowBtt.value = true;
  }
};
const scrollSlotRef = ref();
const position = ref(0);
const scrollToTop = (el) => {
  scrollSlotRef.value.setScrollPosition("vertical", position);
  isShowBtt.value = false;
  // const target = getScrollTarget(el[0])
  // const duration = 1000
  // console.log(target)
};

const handleCategoryClick = (category) => (currentCategory.value = category);

onBeforeUnmount(() => {
  if (Platform.is.capacitor) {
    window.screen.orientation.lock("portrait");
  }
});

onMounted(() => {
  // getCategoryList();
  getPlatList();
  if (Platform.is.capacitor) {
    window.screen.orientation.unlock();
  }
});
</script>
<style scoped lang="scss">
.pageitem {
  display: flex;
  gap: 16px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 16px;
  right: 16px;
  overflow: auto;

  .category-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;

    .category-item {
      aspect-ratio: 1;
      background: url(../../assets/images/games/baccarat/category-bg.png) no-repeat center;
      background-size: 100% 100%;
      border-radius: 16px;
      padding: 3px 0;
      font-size: 1rem;
      color: #0e365b;

      &.activated {
        background-image: url(../../assets/images/games/baccarat/category-bg-active.png);
        color: #fff;
      }

      :deep(.q-btn__content) {
        display: flex;
        flex-direction: column;
      }

      img {
        margin-bottom: 4px;
        width: 45%;
      }
    }
  }

  .q-scrollarea {
    flex: 4;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    width: 90%;
    margin: 0 auto;

    :deep(.zoomin) {
      transform: scale(1.3);
    }

    .inner-img {
      border-radius: 20px;
      overflow: hidden;
      position: relative;
    }

    .slot-name {
      font-size: 16px;
      font-weight: 600;
      text-align: center;
      word-break: break-all;
    }
  }
}

.loading-div {
  z-index: 99;
  position: absolute;
  top: 0;
  // background: rgba(35,38,60,0.6);
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: #db7e42;
    width: 48px;
  }
}
</style>
