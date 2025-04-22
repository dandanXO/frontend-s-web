<template>
  <q-page>
    <div class="loading-div" v-if="isLoading">
      <q-spinner-hourglass
          color="deep-orange"
          size="8em"
      />
    </div>
    <div class="pageitem">
      <div class="topbar">
        <div class="bookmarks q-pa-sm">
          <!-- <q-btn rounded
            v-for="cate in categoryList"
            :color="cate.id === selectedCatId ? 'brightbtn' : 'darkbtn'"
            :class="{ active: cate.id === selectedCatId }"
            :key="cate"
            @click="switchCategory(cate)"
          >
            <!- <img :src="require('../../assets/logo/' + p.code + '.png')"> ->
            {{ cate.label }}
          </q-btn> -->
        </div>
        <div class="search">
          <q-form @submit="searchList">
            <q-input color="white" bg-color="brand" filled class="q-ma-md" standout v-model="gamePage.searchKey"
                     label="请输入关键字">
              <template v-slot:prepend>
                <q-icon color="white" name="search" @click="gamePage.searchKey = ''" class="cursor-pointer"/>
              </template>
              <template v-slot:append>
                <q-btn type="submit" @click="searchList" label="搜索" color="brightbtn"/>
              </template>
            </q-input>
          </q-form>
        </div>
      </div>
      <q-scroll-area ref="scrollSlotRef" style="height: calc(100% - 110px);" v-if="!isLoading">
        <div class="grid" style="padding-bottom: 20px;">
          <div
              v-for="(game, index) in gamePage.gameList"
              :key="index"
              :data-id="index"
              v-intersection="onIntersection"
              @click="openGame(game.name, game.code, selectedCat.status)"
              style="height: 140px;"
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
                    style=" border-radius: 10px; overflow: hidden"
                    :imgClass="selectedCat.code === 'PG' ? 'zoomin' : ''"
                >
                  <template v-slot:loading>
                    <img :src="game.default" style="width: 100%; height: 100px; border-radius: 15px; overflow:hidden;">
                  </template>
                </q-img>
                <div class="slot-name"> {{ game.name }}</div>
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
        <BacktoTop v-if="scrollPosition.top > 400" @click="scrollToTop"/>
        <q-scroll-observer @scroll="scrolling"/>
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

const qs = require("qs");
export default defineComponent({
  components: {
    GameModal,
    BacktoTop
  },
  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const store= userStore();
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
      var platformKey= (store.hasToken()) ? 'LOGGEDINPLATFORMS' : "PLATFORMS";
      cached.get(platformKey, () => api.get(platformApiUrl).then((res) => {
        return res
      })).then((data) => {
        // platforms.value = data
        platforms.value = data.filter(element => element.gameType.includes("SLOT"));
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

    var platformGamesApiUrl = store.hasToken() ? "/session/loggedInPlatformGames" : "/platformGames";
    var platformGamesApiKey = store.hasToken() ? "LOGGEDPLATFORMGAMES" : "PLATFORMGAMES";

    const loadGameList = () => {

      const regDevice = Platform.is.mobile ? "MOBILE" : "WEB"
      const code = selectedPlatId.value;
      const gameType = "SLOT";
      const key = `${platformGamesApiKey}_GAMES_${code}_${gameType}_${regDevice}`;
      var way = store.getDeviceType();

      isLoading.value = true;
      cached.get(key, () => api.get(platformGamesApiUrl, {
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
          element.icon = `${process.env.IMAGE_CDN}/game/${selectedPlat.value.code.toLowerCase()}/slot/${element.icon}.png`;
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
  // border: 1px solid #ffffff;
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
      // display: flex;
      // flex-wrap: wrap;
      // grid-gap: 20px;
      // max-width: 1400px;
      // width: 100%;
      gap: 5px;
      // overflow: auto;
      // padding: 10px 20px 20px;
      // justify-content: flex-start;
      // flex-wrap: wrap;
      display: grid;
      grid-template-columns: repeat(3, 1fr);

      .q-btn {
        font-size: .7rem;
      }

      .plat-item {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #212534;

        img {
          max-height: 15px;
          filter: grayscale(1);
        }

        span {
          color: rgba(200, 200, 200, 0.5);
          font-size: 20px;
          font-weight: bold;
        }

        &.active {
          background: #2b2b4b;
          box-shadow: inset 0 0 5px #ffffff;

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
        background: #2b2b4b;
        border-radius: 10px;
        box-shadow: rgb(0 0 0 / 24%) 0px 6px 12px 0px;

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
      // background: linear-gradient(0deg, #1f2035cf 20%, transparent);
      // position: absolute;
      // bottom: 0;
      // left: 0;
      // right: 0;
      // padding: 10px;
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
    color: #063c50;
    width: 48px;
  }
}
</style>
