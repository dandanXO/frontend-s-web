<template>
  <q-carousel class="home" autoplay navigation v-model="slide" swipeable>
    <template v-slot:navigation-icon="{ active, onClick }">
      <q-btn
        padding="3px 10px"
        v-if="active"
        size="xs"
        color="brand"
        @click="onClick"
      />
      <q-btn
        padding="3px 10px"
        v-else
        size="xs"
        color="white"
        @click="onClick"
      />
    </template>

    <q-carousel-slide
      v-for="(banner, i) in banners"
      :key="i"
      :name="i"
      class="column no-wrap flex-center"
      :img-src="imgURL + banner.mobileImageUrl"
      @click="gotoPromo(banner)"
    >
    </q-carousel-slide>
  </q-carousel>
  <div class="midd">
  <div class="station-notice-wrapper">
    <div class="volume"><RiVolumeUpLine /></div>
    <marquee-text :repeat="announcementList.length" :duration="announcementList.length * 20">
      <div v-if="announcementList">
      <span v-for="(a, i) in announcementList" :key="i" @click="openPopup(a)">
        {{ a.content }}
      </span>
      </div>
    </marquee-text>
  </div>
  <!-- <div class="share" @click="router.push('/promo?id=35')">
    <RiUserShared2Line />
  </div> -->
  </div>
  <div class="items-center grid">
    <q-card>
      <router-link to="/e-sport">
        <q-card-section>
          <div class="text"><RiBilliardsLine />E-sports</div>
          <img src="../assets/images/common/menu/e-sports.png" />
        </q-card-section>
      </router-link>
    </q-card>
    <q-card>
      <router-link to="/sport">
        <q-card-section>
          <div class="text"><RiBasketballLine />Sport</div>
          <img src="../assets/images/common/menu/sports.png" /> </q-card-section
      ></router-link>
    </q-card>
    <q-card>
      <router-link to="/slot">
        <q-card-section>
          <div class="text">
            <div class="slot-icon hvr-icon">
              <span></span><span></span>
              <span></span>
            </div>
            Slots
          </div>
          <img src="../assets/images/common/menu/slots.png" />
        </q-card-section>
      </router-link>
    </q-card>
<!--    <q-card>-->
<!--      <router-link to="/live-casino">-->
<!--        <q-card-section>-->
<!--          <div class="text">-->
<!--            <div class="livecasino-icon hvr-icon">-->
<!--              <span>$</span>-->
<!--            </div>-->
<!--            Live Casino-->
<!--          </div>-->
<!--          <img src="../assets/images/common/menu/livecasino.png" />-->
<!--        </q-card-section>-->
<!--      </router-link>-->
<!--    </q-card>-->
    <q-card>
      <router-link to="/aviator">
        <q-card-section>
          <div class="text">
            <div class="fish-icon hvr-icon"></div>
            Fishing
          </div>
          <img src="../assets/images/common/menu/fishing.png" />
        </q-card-section>
      </router-link>
    </q-card>
    <!-- <q-card>
      <router-link to="/poker">
        <q-card-section>
          <div class="text">
            <div class="poker-icon">
              <div class="pokercards">
                <div class="pokercard one">A</div>
                <div class="pokercard two">A</div>
                <div class="pokercard five">A</div>
              </div>
            </div>
            Poker
          </div>
          <img src="../assets/images/common/menu/poker.png" />
        </q-card-section>
      </router-link>
    </q-card>
    -->

  </div>

  <GameModal ref="casinoGame"></GameModal>

  <q-dialog width="100%" v-model="isStationNotice">
    <q-card style="width: 100%;" class="bg-primary text-white">
      <q-card-section class="q-mb-md">
        <div class="menu-title">Announcement</div>

          <q-tabs
            v-model="activeKey"
            dense
            class="text-grey"
            active-color="brand"
            indicator-color="black"
            align="justify"
            narrow-indicator
          >
            <q-tab v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id" :label="tab.name" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeKey" animated>
            <q-tab-panel v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id">
                   <q-list style="min-height: 65vh">
                      <div v-for="(ann,idx) in announcementList" :key="idx">
                          <span v-if="ann.typeId === tab.id">
                                <q-expansion-item
                                 style="max-height: 65vh; overflow: auto;"
                                  group="somegroup"
                                  icon="volume_up"
                                  :label="ann.title"
                                >
                                  <q-card>
                                    <q-card-section>
                                      {{ ann.content }}
                                    </q-card-section>
                                  </q-card>
                                </q-expansion-item>

                                <q-separator></q-separator>
                          </span>
                      </div>
                   </q-list>
            </q-tab-panel>


          </q-tab-panels>

        </q-card-section
      >
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, onMounted, ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
import { cached } from "boot/cache";
import { useQuasar, Platform } from "quasar";
import { userStore } from "stores/index";
import GameModal from "components/modal/GameModal";
import { RiBasketballLine, RiVolumeUpLine, RiBilliardsLine } from "vue-remix-icons";
import MarqueeText from 'vue-marquee-text-component';

import { useUI } from "stores/ui";
export default defineComponent({
  name: "IndexPage",
  components: {
    GameModal,
    MarqueeText,
    RiVolumeUpLine,
    RiBilliardsLine,
    RiBasketballLine
  },
  setup() {
    const ui = useUI();
    const scrollPageRef = ref(null);
    ui.$onAction(({ name, args }) => {
      switch (name) {
        case "setScrollPosition":
          scrollPageRef.value.setScrollPosition(args[0], args[1], args[2]);
      }
    });
    const $q = useQuasar();
    const banners = ref(null);
    const route = useRoute();
    const router = useRouter();
    const store = userStore();
    const mainWallet = computed(() => {
      return store.balance;
    });
    const casinoGame = ref(null);
    const playGame = (gameName, platformCode, gameCode, gameStatus) => {
      casinoGame.value.open(gameName, platformCode, gameCode, gameStatus);
    };
    const pokerGames = [
      {
        code: "JILI",
        name: "Jili Games",
        gameName: "Jili",
        gameCode: "64",
        bg: require("../assets/images/games/poker/poker_1.jpg"),
        main: require("../assets/images/games/poker/poker1_1.png"),
        logo: require("../assets/images/common/logo/jl.png")
      },
      {
        code: "RICH88",
        name: "Rich88",
        gameName: "Rich88",
        bg: require("../assets/images/games/poker/poker_2.jpg"),
        main: require("../assets/images/games/poker/poker2_01.png"),
        logo: require("../assets/images/common/logo/RICH88.png")
      },
      {
        code: "KM",
        name: "KM",
        gameName: "KM",
        bg: require("../assets/images/games/poker/poker_3.jpg"),
        main: require("../assets/images/games/poker/poker3_01.png"),
        logo: require("../assets/images/common/logo/km.png")
      }
    ];
    const hotTrendingGames = [
      // {
      //   code: "Evo",
      //   name: "Evolution",
      //   gameName: "EVO",
      //   bg: require("../assets/images/games/liveCasino/live_1.jpg"),
      //   main: require("../assets/images/games/liveCasino/live1_1.png"),
      //   logo: require("../assets/images/common/logo/evo.png"),
      //   text: "In the Evolution live casino, there are the world's first 6-card start, VIP tables, badge baccarat, intelligent control baccarat waiting for you to enjoy non-stop.",
      // },
      {
        code: "AWC",
        name: "AG Sexy",
        gameName: "AE Sexy",
        gameCode: "MX-LIVE-001",
        bg: require("../assets/images/games/liveCasino/live_2.jpg"),
        main: require("../assets/images/games/liveCasino/live2_01.png"),
        logo: require("../assets/images/common/logo/ae_2.png"),
        text: "AE Casino, Asia's most potential live-action video. The interface is simple and easy to operate, cross-platform, download-free, and fun anytime, anywhere!"
      },
      {
        code: "EZUGI",
        name: "Ezugi",
        gameName: "Ezugi",
        bg: require("../assets/images/games/liveCasino/live_3.jpg"),
        main: require("../assets/images/games/liveCasino/live3_01.png"),
        logo: require("../assets/images/common/logo/ezugi.png"),
        text: "The EZUGI entertainment platform with hundreds of well-trained professional dealers, bring you just like real casino experience."
      }
    ];
    const esportsGame = [
      {
        code: "TFGaming",
        name: "TF Gaming",
        gameName: "AE Sexy",
        gameCode: "MX-LIVE-001",
        bg: require("../assets/home/e-sport/shadebg.png"),
        main: require("../assets/home/e-sport/tf88.png"),
        logo: require("../assets/logo/TF88.png")
      }
    ];
    const sportsGame = [
      {
        code: "TFGaming",
        name: "TF Gaming",
        gameName: "AE Sexy",
        gameCode: "MX-LIVE-001",
        bg: require("../assets/home/e-sport/shadebg.png"),
        main: require("../assets/home/sport/cmd.png"),
        logo: require("../assets/logo/CMD.png")
      }
    ];
    function loadData() {
      api
        .get("/promo/banner?category=HOME")
        .then((res) => {
          if (res.data.code === 0) {
            banners.value = res.data.data;
          } else {
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: res.data.message,
            //   icon: "report_problem"
            // });
          }
          // banners.value = response.data;
        })
        .catch(() => {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: "Loading failed",
          //   icon: "report_problem"
          // });
        });
    }
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
    const fishPlatforms = ref([]);
    // const getPlatList = () => {
    //   api
    //     .get("/platform")
    //     .then((res) => {
    //       const ret = res.data;
    //       platforms.value = ret.data.filter((element) =>
    //         element.gameType.includes("SLOT")
    //       );
    //       fishPlatforms.value = ret.data.filter((element) =>
    //         element.gameType.includes("FISH")
    //       );
    //     })
    //     .catch((err) => {});
    // };
    const currentSelectedMenu = ref("slots");
    const switchMenu = (menu) => {
      currentSelectedMenu.value = menu;
      if (menu === "slots") {
        switchPlat(platforms.value[0], menu);
      } else if (menu === "livecasino") {
        switchPlat(hotTrendingGames[0], menu);
      } else if (menu === "fish") {
        switchPlat(fishPlatforms.value[0], menu);
      } else if (menu === "poker") {
        switchPlat(pokerGames[0], menu);
      } else if (menu === "esports") {
        switchPlat(esportsGame[0], menu);
      } else if (menu === "sport") {
        switchPlat(sportsGame[0], menu);
      }
    };
    const liveTabs = ref("");
    const switchPlat = (plat, menuType) => {
      if (menuType === "slots") {
        selectedPlat.value = plat;
        selectedPlatId.value = plat.id;
        loadGameList("SLOT");
        gamePage.searchKey = "";
      } else if (menuType === "livecasino") {
        selectedLiveTab.value = plat.name;
        liveTabs.value = plat.name;
      } else if (menuType === "fish") {
        selectedPlat.value = plat;
        selectedPlatId.value = plat.id;
        loadGameList("FISH");
      } else if (menuType === "poker") {
        selectedLiveTab.value = plat.name;
        liveTabs.value = plat.name;
      } else if (menuType === "esports") {
        selectedLiveTab.value = plat.name;
        liveTabs.value = plat.name;
      } else if (menuType === "sport") {
        selectedLiveTab.value = plat.name;
        liveTabs.value = plat.name;
      }
    };
    const searchList = () => {
      if (gamePage.searchKey) {
        gamePage.gameList = gameListData.value.filter((game) => {
          return game.name
            .toLowerCase()
            .includes(gamePage.searchKey.toLowerCase());
        });
      } else {
        changePage(1, gamePage.pageSize);
      }
    };
    const loadGameList = (type) => {
      const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
      const code = selectedPlatId.value;
      const gameType = type;
      const key = `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;

      cached
        .get(key, () =>
          api
            .get("/platformGames", {
              params: {
                platformId: code,
                gameType: gameType,
                device: regDevice
              }
            })
            .then((ret) => {
              const res = ret.data;
              if (res.code === 0) {
                return res;
              }
            })
            .catch((err) => {
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: "Loading failed",
              //   icon: "report_problem"
              // });
            })
        )
        .then((res) => {
          res.forEach((element) => {
            element.default = require("../assets/images/games/aviator/default.png");
            element.icon = `${process.env.IMAGE_CDN}/slot/${selectedPlat.value.code}/${element.icon}.png`;
          });
          gameListData.value = res;
          gamePage.total = res.length;
          changePage(1, gamePage.pageSize);
        });
    };
    const changePage = (page, pageSize) => {
      gamePage.gameList = gameListData.value;
      // gamePage.gameList = gameListData.value.slice((page - 1) * pageSize, page * pageSize);
    };
    const getPlatList = () => {
      cached
        .get("PLATFORMS", () =>
          api.get("/platform").then((res) => {
            const response = res.data;
            return response;
          })
        )
        .then((data) => {
          fishPlatforms.value = data.filter((element) =>
            element.gameType.includes("FISH")
          );
          platforms.value = data.filter((element) =>
            element.gameType.includes("SLOT")
          );
          if (currentSelectedMenu.value === "slots") {
            switchPlat(platforms.value[0], "slots");
            platforms.value.forEach((e, i) => {
              if (e.code === "AWS") {
                platforms.value.splice(i, 1);
              }
            });
          } else if (currentSelectedMenu.value === "fish") {
            switchPlat(fishPlatforms.value[0], "fish");
          }
          // if (!route.query.plat) {
          //   switchPlat(platforms.value[0], "slot");
          //   switchPlat(fishPlatforms.value[0], "fish");
          // } else {
          //   platforms.value.forEach((element) => {
          //     if (parseInt(route.query.plat) === element.id) {
          //       switchPlat(element, "slot");
          //     }
          //   });
          // }
        })
        .catch((err) => {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: "Loading failed",
          //   icon: "report_problem"
          // });
        });
    };
    const getLength = (tab ,ann) => {
      var categoryLength = announcementList.value.filter((item) => item.id == ann.typeId);
      return categoryLength.length;
    }
    const announcementList = ref([])
    const announcementTypes = ref([])
    const loadAnnouncement = () => {
      api.get("/announcement").then((ret) => {
        const res = ret.data
        if (res.code === 0) {
          if (res.data.announcements) {
            const d = res.data.announcements
            announcementList.value = d
          }
          if (res.data.type) {
            announcementTypes.value = res.data.type
            activeKey.value = res.data.type[0].id
          }
          // announcementList.value = d.announcements
          // announcementList.value = res.data.announcements
        }
      })
    }
    const isStationNotice = ref(false)
    const noticeTitle = ref('')
    const activeKey = ref(null)
    const openPopup = (noticeType) => {
      if (noticeType) {
        noticeTitle.value = "Announcement"
        isStationNotice.value = true
      }
    }
    const gotoPromo = (banner) => {
      const redirectU = '/promo' + banner.redirectUrl
      router.push(`${redirectU}`)
    }
    onMounted(() => {
      getPlatList();
      loadData();
      loadAnnouncement();
    });
    const imageLoading = ref(false);
    const selectedLiveTab = ref();
    const openGame = (gameName, gameCode) => {
      casinoGame.value.open(gameName, selectedPlat.value.code, gameCode);
    };
    return {
      imageLoading,
      slide: ref(0),
      tab: ref("slots"),
      gamesTab: ref(platforms.value[0]),
      splitterModel: ref(30),
      imgURL: process.env.IMAGE_CDN + "/",
      banners,
      store,
      platforms,
      fishPlatforms,
      hotTrendingGames,
      mainWallet,
      playGame,
      casinoGame,
      pokerGames,
      switchPlat,
      switchMenu,
      gamePage,
      selectedPlatId,
      searchList,
      liveTabs,
      selectedLiveTab,
      currentSelectedMenu,
      esportsGame,
      sportsGame,
      openGame,
      scrollPageRef,
      announcementList,
      isStationNotice,
      openPopup,
      noticeTitle,
      announcementTypes,
      activeKey,
      getLength,
      gotoPromo,
      router
    };
  }
});
</script>
<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Bungee&display=swap");
.midd {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 10px;
.station-notice-wrapper {
  display: flex;
  background: #2b2b4b;
  border-radius: 10px;
  // margin: 10px;
  gap: 10px;
  padding: 5px 10px;
  justify-content: center;
  align-items: center;
  width: 85%;
  flex: 1;
  .volume { padding-top: 5px;}
  span { margin-right: 10px; cursor: pointer; }
}
.share {
  background-image: linear-gradient(to right, #de4545, #db7e42);
  padding: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  flex: 1;
}

}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  margin: 10px auto;
  align-items: flex-start;
  gap: 10px;
  width: 95%;
  .q-card {
    margin: 0;
    background: #2b2b4b;
    // padding: 0px 50px;
    a {
      color: #ffffff;
    }
    .q-card__section {
      display: flex;
      align-items: center;
      // padding: 10px 0 0 10px;
      justify-content: flex-end;
      // height: calc(60vh / 3);
      overflow: hidden;
      svg {
        fill: #db7e42;
      }
      .livecasino-icon {
        transition: all 0.5s ease-in;
        border: 1px solid #ffffff;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        border: 3px dotted #ffffff;
        font-size: 11px;
        text-align: center;
        line-height: 18px;
        margin: 0 auto;
      }
      .poker-icon {
        padding-left: 10px;
        .pokercards {
          // Outer wrapper for all cards
          position: relative; // Get control of the positioning
          // height: 18px; // height of each card
          // width: 15px; //width of each card
          // font-size: 10px; //size of number
          // line-height: 5px; //affects vert position of number
          height: 23px;
          width: 20px;
          font-size: 10px;
          line-height: 21px;
          font-weight: bold; //font weight
          .pokercard {
            transition: all 0.5s ease-in;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff;
            // Common styles for all cards
            position: absolute; //Position all cards on top of each other
            width: 100%; //Expand to fill the parent's width
            height: 100%; //Expand to fill the parent's height
            border: 1px solid #ffffff; //card border width and color
            background: #23263c;
            border-radius: 3px; //corner radius
            box-shadow: -2px 2px 3px rgba(0, 0, 0, 0.3); //Drop shadow position, size and color

            &.one {
              transform: translate(-5px, 0px) rotate(-10deg);
            }
            &.two {
            }
            &.five {
              transform: translate(-2px, 0px) rotate(10deg);
            }
          }
        }
      }
      .fish-icon {
        transition: all 0.5s ease-in;
        display: flex;
        align-items: center;
        height: 25px;
        &:before {
          content: "";
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-left: 6px solid white;
          display: inline-block;
        }
        &:after {
          content: "";
          display: inline-block;
          border-radius: 50%;
          width: 16px;
          height: 12px;
          background: #ffffff;
        }
      }
      .slot-icon {
        transition: all 0.2s ease-in;
        font-size: 8px;
        line-height: 10px;
        font-weight: bold;
        position: relative;
        border: 0.5px solid #ffffff;
        padding: 2px;
        width: 30px;
        margin: 0 auto;

        span {
          border: 0.2px solid #ffffff;
          width: 8px;
          text-align: center;
          display: inline-block;
          &:before {
            content: "7";
          }
          &:first-child {
            border-right: 0;
          }
          &:last-child {
            border-left: 0;
          }
        }
      }
      svg {
        width: 25px;
        padding: 0;
        fill: #ffffff;
      }

      .text {
        position: absolute;
        left: 5px;
        text-align: center;
        justify-content: center;
        display: flex;
        flex-direction: column;
        align-items: center;
         width: 68px;
        // transform: scale(2);
      }
      img {
        width: 100%;
        // padding: 10px;
      }
    }
  }
}
@media (max-width: 400px) {
  .grid {
  .q-card {
    .q-card__section {
      .text {
        transform: scale(1.2);
      }
    }
  }
  }
}
</style>
