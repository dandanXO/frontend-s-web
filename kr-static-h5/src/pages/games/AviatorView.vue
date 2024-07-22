<template>
  <q-page>
    <div class="loading-div" v-if="isLoading">
      <q-spinner-hourglass :color="ui.themeColor" size="8em" />
    </div>
    <div class="pageitem">
      <div class="topbar">
        <div class="search">
          <q-form @submit="searchList">
            <q-input
              class="search-input"
              bg-color="white"
              filled
              standout
              v-model="gamePage.searchKey"
              :label="$t('lang.slot_search')"
              @update:model-value="searchList"
            >
              <template v-slot:append>
                <q-btn class="search-btn" type="submit" push size="md" round>
                  <img src="../../assets/images/common/search-btn.svg" />
                </q-btn>
              </template>
            </q-input>
          </q-form>
        </div>
      </div>
      <q-scroll-area ref="scrollSlotRef" style="height: calc(100% - 110px)" v-if="!isLoading">
        <div class="grid" style="padding-bottom: 20px">
          <div
            class="grid-item"
            v-for="(game, index) in gamePage.gameList"
            :key="index"
            :data-id="index"
            v-intersection="onIntersection"
            @click="openGame(game.name, game.code, selectedCat.status)"
          >
            <transition name="in-view">
              <q-list class="q-col-gutter-none">
                <q-img
                  loading="lazy"
                  :src="game.icon"
                  :placeholder-src="game.default"
                  fit="cover"
                  spinner-color="white"
                  position="50% 20%"
                  style="border-radius: 10px; overflow: hidden"
                  :imgClass="selectedCat.code === 'PG' ? 'zoomin' : ''"
                >
                  <template v-slot:loading>
                    <img :src="game.default" style="" />
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

<script lang="js">
import {defineComponent, onMounted, reactive, ref, computed, toRefs, watch} from "vue";
import GameModal from "components/modal/GameModal";
import {useRoute} from 'vue-router';
import {useQuasar, Platform} from "quasar";
import {api} from "boot/axios";
import {cached} from "boot/cache";
import {useUI} from "stores/ui";
import BacktoTop from "components/backtotop.vue"
import {scroll, SessionStorage} from 'quasar'
import {userStore} from "src/stores";
import { useLocalStorage } from "@vueuse/core";

const qs = require("qs");
export default defineComponent({
  components: {
    GameModal,
    BacktoTop
  },
  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const store = userStore();
    const ui = useUI();
    const slotsGame = ref(null);
    const platforms = ref([]);
    const selectedCatId = ref(1);
    const selectedCat = ref('');
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
    const switchPlat = (plat) => {
      isLoading.value = true;
      scrollSlotRef.value.setScrollPosition('vertical', 0)
      selectedPlat.value = plat;
      selectedPlatId.value = plat.id;
      loadGameList();
      gamePage.searchKey = ""
    };
    // const switchCategory = (category) => {
    //   isLoading.value= true;
    //   scrollSlotRef.value.setScrollPosition('vertical', 0)
    //   selectedCat.value = category
    //   selectedCatId.value = category.id;
    //   // loadGameList();
    //   gamePage.searchKey = ""
    // };
    const selectedPlat = ref(route.query.platform)
    watch(
      () => route.query,
      async () => {
        getPlatList();
      }
    );

    const getPlatList = () => {
      var platformApiUrl = (store.hasToken()) ? '/session/loggedInPlatform' : "/platform";
      var platformKey = (store.hasToken()) ? 'LOGGEDINPLATFORMS' : "PLATFORMS";
      cached.get(platformKey, () => api.get(platformApiUrl).then((res) => {
        return res
      })).then((data) => {
        // platforms.value = data
        platforms.value = data.filter(element => element.gameType.includes("FISH"));
        platforms.value.forEach((e, i) => {
          if (e.code === 'AWS') {
            platforms.value.splice(i, 1)
          }
        });
        if (!route.query.platform) {
          switchPlat(platforms.value[0]);
        } else {
          platforms.value.forEach(element => {
            if (route.query.platform === element.code) {
              switchPlat(element)
            }
          });
        }
      }).catch((err) => {
        isLoading.value = false;
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: "Loading failed",
        //   icon: "report_problem"
        // });
      })

    };
    const searchList = () => {
      if (gamePage.searchKey) {
        gamePage.gameList = gameListData.value.filter((game) => {
          return (((game.name).toLowerCase()).includes((gamePage.searchKey).toLowerCase()));
        });
      } else {
        changePage(1, gamePage.pageSize);
      }
    };
    const loadGameList = () => {

      const imgURL= useLocalStorage("IMAGE_CDN" ,process.env.IMAGE_CDN).value;
      const regDevice = Platform.is.mobile ? "MOBILE" : "WEB"
      const code = selectedPlatId.value;
      const gameType = "FISH";
      const key = `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;
      var way = store.getDeviceType();

      isLoading.value = true;
      cached.get(key, () => api.get("/platformGames", {
        params: {platformId: code, gameType: gameType, device: regDevice, way: way},
      }).then((res) => {
        if (res.code === 0) {
          isLoading.value = false;
          return res
        }
      }).catch((err) => {
        isLoading.value = false;
      })).then((res) => {
        res.forEach(element => {
          element.default = require("../../assets/images/games/aviator/default.png");
          element.icon = `${imgURL}/game/${element.icon}`;
        });
        gameListData.value = res;
        isLoading.value = false;
        gamePage.total = res.length;
        changePage(1, gamePage.pageSize);
      })
    };
    const changePage = (page, pageSize) => {
      gamePage.gameList = gameListData.value

    };
    const onShowSizeChange = (current, size) => {
      current = 1;
      gamePage.currentPage = 1;
      changePage(current, size);
    };

    const openGame = (gameName, gameCode, gameStatus) => {
      slotsGame.value.open(gameName, selectedPlat.value.code, gameCode, gameStatus);
    };
    const isShowBtt = ref(false)
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

    const {getScrollTarget, getVerticalScrollPosition, setVerticalScrollPosition} = scroll
    const scrollPosition = ref(0)
    const scrolling = (e) => {
      scrollPosition.value = e.position
      if (e.position.top > 400) {
        isShowBtt.value = true
      }
    }
    const scrollSlotRef = ref();
    const position = ref(0);
    const scrollToTop = (el) => {
      scrollSlotRef.value.setScrollPosition('vertical', position)
      isShowBtt.value = false
      // const target = getScrollTarget(el[0])
      // const duration = 1000
      // console.log(target)
    }
    const onIntersection = (entry) => {
      // if (entry.isIntersecting === true) {
      //   add(entry.target.dataset.id)
      // }
      // else {
      //   remove(entry.target.dataset.id)
      // }
    }


    // function add (i) {
    //   remove(i)
    //   console.log(i)
    //   gamePage.gameList.findIndex(obj => {
    //     obj.hello = i
    //   })
    // }

    // function remove (i) {
    //   // let index
    //   // while ((index = inView.value.indexOf(i)) > -1) {
    //   //   splice(index, 1)
    //   // }
    //   // gamePage.gameList.findIndex(obj => {
    //   //   if (obj.hello === i) {
    //   //     gamePage.gameList.splice(obj, 1)
    //   //   }
    //   // })
    // }
    onMounted(() => {
      // getCategoryList();
      getPlatList();
    });
    return {
      platforms,
      selectedCatId,
      selectedCat,
      // switchCategory,
      gamePage,
      openGame,
      loadGameList,
      changePage,
      searchList,
      gameListData,
      onShowSizeChange,
      slotsGame,
      scrolling,
      isShowBtt,
      scrollSlotRef,
      scrollToTop,
      scroll,
      scrollPosition,
      isLoading,
      scrollInfo,
      onIntersection,
      ui,
      onScroll(info) {

        scrollInfo.value = (info.position.left) / (platforms.value.length) + 8
        // scrollInfo.value = (info.position.left / 100) * 50
        // scrollInfo.value = 50 / 100 * info.position.left / 10
      },
      // categoryList,
      selectedPlat,
      selectedPlatId
    };
  }
});
</script>
<style scoped lang="scss">
.pageitem {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;

  .topbar {
    // position: sticky;
    z-index: 99;
    padding-bottom: 10px;
    top: 0;

    .bookmarks {
      cursor: pointer;
      gap: 14px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      width: $box-width;
      padding: 1rem 0.9rem 1rem;
      margin: 10px auto;
      background: $white;
      box-shadow: $shadow-bg;
      border-radius: 10px;

      .plat-item {
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url("../../assets/images/download/inactive-tab-bg.png");
        background-size: 100% 100%;
        background-color: $secondary;
        padding: 10px;
        text-align: center;
        border-radius: 10px;

        span {
          color: $font-1;
          font-size: 1rem;
        }

        &:active {
          filter: brightness(0.9);
          transform: translate(0px, 1px);
        }

        &.is-active {
          background-image: url("../../assets/images/download/active-tab-bg.png");
          background-size: 100% 100%;
          background-color: $primary;

          span {
            color: #ffffff;
            font-weight: bold;
          }
        }
      }
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 0.7rem;
    row-gap: 0.7rem;
    width: $box-width;
    margin: 0 auto 30px;

    :deep(.zoomin) {
      transform: scale(1.3);
    }

    .slot-name {
      text-align: center;
      word-break: break-all;
      font-size: 0.95rem;
      line-height: 1rem;
      padding-top: 6px;
      padding-bottom: 6px;
      color: $font-1;
    }

    .q-list {
      aspect-ratio: 50/62;
      background: $white;
      border-radius: 12px;
      box-shadow: $shadow-bg;
      padding: 4px;

      .q-img {
        aspect-ratio: 1/1;
      }

      img {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
      }
    }
  }

  .search-btn {
    &:before {
      box-shadow: none;
      border-bottom: 0px;
    }

    img {
      width: 1.8rem;
      height: 1.8rem;
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
    color: #063c50;
    width: 48px;
  }
}
</style>
<style lang="scss">
.search-input {
  width: $box-width;
  margin: 14px auto;

  .q-field__label {
    font-size: 1rem;
  }

  .q-field__control {
    border-radius: 12px;
    box-shadow: $shadow-bg;
  }
}
</style>
