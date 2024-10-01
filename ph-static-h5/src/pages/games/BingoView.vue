<template>
  <q-page>
    <div class="loading-div" v-if="isLoading">
      <q-spinner-hourglass color="light-blue-4" size="8em" />
    </div>
    <div class="pageitem">
      <div class="topbar">
        <q-scroll-area style="height: 80px">
          <div class="bookmarks">
            <div
              class="plat-item"
              v-for="p in platforms"
              :class="{ active: p.id === selectedPlatId }"
              :key="p"
              @click="switchPlat(p)"
            >
              <img :src="require('../../assets/logo/' + p.code + '.png')" />
            </div>
          </div>
          <q-scroll-observer axis="horizontal" @scroll="onScroll" />
        </q-scroll-area>
        <div
          class="slideProgress"
          style="
            width: 30px;
            height: 3px;
            border-radius: 30px;
            position: relative;
            background: #000422;
            margin: 0 auto 10px;
            overflow: hidden;
            position: relative;
          "
        >
          <div
            class="position"
            :style="'width: 8px; position: absolute; height: 100%; background: #ffffff; left: ' + scrollInfo + '%;'"
          ></div>
        </div>
      </div>
      <q-scroll-area ref="scrollSlotRef" style="height: calc(100% - 0px)">
        <div class="grid" style="padding-bottom: 20px">
          <div
            v-for="(game, index) in gamePage.gameList"
            :key="index"
            :data-id="index"
            v-intersection="onIntersection"
            @click="openGame(game.name, game.code, selectedPlat.status)"
            style="height: 120px"
          >
            <transition name="in-view">
              <q-list class="q-col-gutter-none">
                <q-img
                  loading="lazy"
                  :src="game.icon"
                  :placeholder-src="game.default"
                  fit="fill"
                  height="120px"
                  spinner-color="white"
                  style="border-radius: 4px; overflow: hidden"
                  :imgClass="selectedPlat.code === 'PG' ? 'zoomin' : ''"
                >
                  <div class="slot-name">{{ game.name }}</div>
                  <template v-slot:loading>
                    <img
                      :src="game.default"
                      style="width: 100%; height: 120px; border-radius: 4px; overflow: hidden"
                    />
                  </template>
                  <template v-slot:error>
                    <img
                      :src="game.default"
                      style="width: 100%; height: 120px; border-radius: 4px; overflow: hidden"
                    />
                  </template>
                </q-img>
              </q-list>
            </transition>
            <!-- <q-img
                  loading="lazy"
                  :src="game.icon"
                  :placeholder-src="defaultImg"
                  fit="cover"
                  height="120px"
                  no-spinner
              >
                <template v-slot:loading>
                  <img :src="game.default" style="height: 140px; max-width: 200px; border-radius: 15px; overflow:hidden;">
                </template>
              </q-img> -->
            <!-- <img :loading="'lazy'" :class="selectedPlat.code === 'PG' ? 'zoomin' : ''" :src="game.icon" v-bind:alt="game.default" > -->
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
import { getPlatformList } from "src/api/platform/platform";

const qs = require("qs");
export default defineComponent({
  components: {
    GameModal,
    BacktoTop
  },
  emits: ['platformUpdate'],
  props: ['activeSubTab'],
  setup(props, { emit }) {
    const $q = useQuasar();
    const route = useRoute()
    const slotsGame = ref(null);
    const jpNumber = "123,456,789.88";
    const platforms = ref([]);
    const selectedPlatId = ref();
    const selectedPlat = ref(platforms.value[0]);
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
      selectedPlat.value = plat
      selectedPlatId.value = plat.id;
      loadGameList();
      gamePage.searchKey = ""
    };
    const getPlatList = () => {
		getPlatformList().then((data) => {
        platforms.value = data.filter(element => element.gameType.includes("BINGO"));
        platforms.value.forEach((e, i) => {
          if (e.code === 'AWS') {
            platforms.value.splice(i, 1)
          }
        });
        if (!route.query.plat) {
          switchPlat(platforms.value[0]);
        } else {
          platforms.value.forEach(element => {
            if (parseInt(route.query.plat) === element.id) {
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
      }).finally(() => {
        emit('platformUpdate', platforms.value)
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
      const regDevice = Platform.is.mobile ? "MOBILE" : "WEB"
      const code = selectedPlatId.value;
      const gameType = "BINGO";
      const key = `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;
      var way = null
      if (Platform.is.android) {
        way = "ANDROID"
      } else if (Platform.is.ios) {
        way = "IOS"
      }
      cached.get(key, () => api.get("/platformGames", {
        params: {platformId: code, gameType: gameType, device: regDevice, way: way},
      }).then((res) => {

        if (res.code === 0) {
          isLoading.value = false;
          return res
        }
      }).catch((err) => {
        // $q.notify({
        //   color: "negative",
        //   position: "top",
        //   message: "Loading failed",
        //   icon: "report_problem"
        // });
      })).then((res) => {
        res.forEach(element => {
          element.default = require("../../assets/images/games/aviator/default.png");
          element.icon = `${process.env.IMAGE_CDN}/games/bingo/${selectedPlat.value.code}/${element.icon}.png`;
        });
        gameListData.value = res;
        isLoading.value = false;
        // res.forEach(element => {
        //   console.log(gameListData.value[0].)
        //   if (!gameListData.value[0] || !gameListData.value[0].icon) {
        //   }
        // });
        gamePage.total = res.length;
        changePage(1, gamePage.pageSize);
      })
    };
    const changePage = (page, pageSize) => {
      gamePage.gameList = gameListData.value

      // gamePage.gameList = gameListData.value.slice((page - 1) * pageSize, page * pageSize);

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

    watch(() => props.activeSubTab, () => {
      const plat = platforms.value.find(({ code }) => code === props.activeSubTab);

      if(plat) {
        switchPlat(plat);
      }
    })

    onMounted(() => {
      getPlatList();
    });
    return {
      jpNumber,
      platforms,
      selectedPlatId,
      selectedPlat,
      switchPlat,
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
      onScroll(info) {

        scrollInfo.value = (info.position.left) / (platforms.value.length) + 8
        // scrollInfo.value = (info.position.left / 100) * 50
        // scrollInfo.value = 50 / 100 * info.position.left / 10
      }
    };
  }
});
</script>
<style scoped lang="scss">
.pageitem {
  // border: 1px solid #ffffff;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;

  .topbar {
    display: none;
    position: sticky;
    z-index: 99;
    padding-bottom: 10px;
    top: 0;

    .q-scrollarea {
      //background: lightblue;
    }

    .bookmarks {
      cursor: pointer;
      display: flex;
      grid-gap: 20px;
      max-width: 1400px;
      width: 100%;
      min-height: 70px;
      margin: 10px auto 0;
      // overflow: auto;
      padding: 5px 20px 10px;
      justify-content: flex-start;
      // flex-wrap: wrap;
      .plat-item {
        min-width: 130px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.24);

        img {
          max-height: 25px;
          filter: grayscale(1);
        }

        span {
          color: rgba(200, 200, 200, 0.5);
          font-size: 20px;
          font-weight: bold;
        }

        &.active {
          background: $primary;
          border: 1px solid hsla(0, 0%, 78%, 0.5);
          box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.24);

          img {
            filter: grayscale(0);
          }

          span {
            color: #ffffff;
          }
        }
      }

      div {
        padding: 10px;
        text-align: center;
        //background: #2b2b4b;
        border-radius: 10px;
        //box-shadow: rgb(0 0 0 / 24%) 0px 6px 12px 0px;

        &:hover {
          // transform: scale(1.01274) translate(0px, -4px);
        }
      }
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    width: 100%;
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
      background: linear-gradient(0deg, #1f2035cf 20%, transparent);
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 10px;
      text-align: center;
    }
  }
}

.loading-div {
  z-index: 99;
  position: absolute;
  top: 0;
  background: rgba(255, 255, 255, 0.1);
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: #1e88e5;
    width: 48px;
  }
}
</style>
