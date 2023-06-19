<template>
  <div v-if="isH5" class="download-top-container">
    <div class="download-top-box">
      <q-icon name="close" @click="isH5 = false" />
      <img
        class="headicon"
        src="../assets/images/index/head_logo.png"
        width="41"
      />
      <div class="download-txt-container">
        <span class="download-title text-bold">东赢 APP</span>
        <span>覆盖全部游戏，体验更流畅，更安全，更快捷</span>
      </div>
      <div class="buttons">
        <!-- <q-btn
          size="sm"
          href="/wap/login.html?way=reg"
          label="注册"
          color="dyblue"
        /> -->
        <q-btn
          size="sm"
          href="https://xfapp1.com?url=m.xf882.com&amp;agentCode="
          target="_blank"
          label="立即下载"
          color="dyblue"
          class="top-btn"
        />
      </div>
    </div>
  </div>
  <q-carousel class="home" autoplay navigation v-model="slide" swipeable>
    <template v-slot:navigation-icon="{ active, onClick }">
      <q-btn
        padding="3px"
        v-if="active"
        size="xs"
        color="white"
        @click="onClick"
        style="border: 1px solid #ffffff; border-radius: 50%; margin: 6px 8px"
      />
      <q-btn
        padding="3px"
        v-else
        size="xs"
        color="transparent"
        @click="onClick"
        style="border: 1px solid #aaaaaa; border-radius: 50%; margin: 6px 8px"
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
      <div class="notice">
        <img src="../assets/images/index/notice.png" />
      </div>
      <marquee-text :repeat="5" :duration="announcementList.length * 120">
        <div v-if="announcementList">
          <span
            v-for="(a, i) in announcementList"
            :key="i"
            @click="openPopup(a)"
          >
            {{ a.content }}
          </span>
        </div>
      </marquee-text>
    </div>
    <!-- <div class="share" @click="router.push('/promo?id=35')">
      <RiUserShared2Line />
    </div> -->
  </div>
  <div class="details-container">
    <div class="welcome-bar">
      <div class="welcome-liner">
        欢迎您， {{ store.token ? store.nickName : "亲爱的用户" }}
      </div>
      <!-- <router-link v-if="!store.token" to="/register" class="login">
        <span class="log">注册</span>
      </router-link> -->
      <router-link v-if="!store.token" to="/login" class="login">
        <span class="log">请先登录</span>
        <span class="user">
          <q-icon name="double_arrow" style="color: #536ee0; font-size: 14px" />
        </span>
      </router-link>
      <router-link v-else to="/account" class="login"
        ><span class="log">已登录</span
        ><span class="user"
          ><q-icon
            name="double_arrow"
            style="color: #536ee0; font-size: 14px" /></span
      ></router-link>
    </div>
    <div class="details-bar">
      <!-- <div class="message">
        {{ store.token ? "¥" + mainWallet.toFixed(2) : "早上好~" }}
      </div> -->
      <div class="menulist">
        <router-link to="/finance/deposit" class="men deposit-menu">
          <img src="../assets/images/index/deposit_icon.png" />
          <div class="">存款</div>
        </router-link>
        <router-link to="/finance/withdraw" class="men withdraw-menu">
          <img src="../assets/images/index/withdrawal_icon.png" />
          <div class="">取款</div>
        </router-link>
        <router-link to="/account/transfer" class="men transfer-menu">
          <img src="../assets/images/index/transfer_icon.png" />
          <div class="">转账</div>
        </router-link>
        <router-link to="/account/vip" class="men transfer-menu">
          <img src="../assets/images/index/vip_icon.png" />
          <div class="">VIP 详情</div>
        </router-link>
      </div>
    </div>
  </div>

  <div class="swiper-container">
    <!-- Thumbs Swiper -> store swiper instance -->
    <!-- It is also required to set watchSlidesProgress prop -->
    <swiper
      :modules="[Thumbs, Controller]"
      slides-per-view="auto"
      :freeMode="true"
      :set-wrapper-size="true"
      :scrollbar="{ draggable: true }"
      :mousewheel="true"
      watch-slides-progress
      @swiper="setSecondSwiper"
      :controller="{ control: firstSwiper }"
      class="firstSwiper"
    >
      <swiper-slide
        :class="tab.name && { tbact: selectedTab === tab.name }"
        @click="setSelectedSwiper(tab)"
        v-for="(tab, i) in tabs"
        :key="i"
        style="width: calc(100vw / 6)"
        >{{ selectedTab !== tab.name ? tab.label : tab.labelact }}</swiper-slide
      >
    </swiper>
    <div class="index-platform-container" style="overflow: hidden">
      <!-- Main Swiper -> pass thumbs swiper instance -->
      <swiper
        :modules="[Thumbs, Controller]"
        :thumbs="{ swiper: thumbsSwiper }"
        :direction="'vertical'"
        slides-per-view="auto"
        :scrollbar="{ draggable: true }"
        @slide-change-transition-end="onSlideChange"
        @swiper="setFirstSwiper"
        :controller="{ control: secondSwiper }"
        class="secondSwiper"
      >
        <swiper-slide
          v-for="(esport, i) in esport"
          :key="i"
          :class="'esport-' + i"
        >
          <img
            @click="playGame(esport.id, esport.code)"
            :src="
              require(`../assets/images/index/esport/esport_bg_${esport.icon}.png`)
            "
          />
          <div class="game_content">
            <div class="game_title">{{ esport.title }}</div>
            <div class="game_subtitle">
              <span class="game_num">{{ esport.subcount }}</span>
              {{ esport.subtitle }}
            </div>
          </div>
        </swiper-slide>
        <swiper-slide
          v-for="(sport, i) in sport"
          :key="i"
          :class="'sport-' + i"
        >
          <img
            @click="playGame(sport.id, sport.code)"
            :src="
              require(`../assets/images/index/sport/sport_bg_${sport.icon}.png`)
            "
          />
          <div class="game_content">
            <div class="game_title">{{ sport.title }}</div>
            <div class="game_subtitle">
              <span class="game_num">{{ sport.subcount }}</span>
              {{ sport.subtitle }}
            </div>
          </div>
        </swiper-slide>
        <swiper-slide
          v-for="(live, i) in livecasino"
          :key="i"
          :class="'live-' + i"
        >
          <img
            @click="playGame(live.id, live.code, live.gameCode)"
            :src="
              require(`../assets/images/index/live/live_bg_${live.icon}.png`)
            "
          />
          <div class="game_content">
            <div class="game_title">{{ live.title }}</div>
            <div class="game_subtitle">
              <span class="game_num">{{ live.subcount }}</span>
              {{ live.subtitle }}
            </div>
          </div>
        </swiper-slide>
        <swiper-slide
          v-for="(poker, i) in poker"
          :key="i"
          :class="'poker-' + i"
        >
          <img
            @click="playGame(poker.id, poker.code, poker.gameCode)"
            :src="
              require(`../assets/images/index/poker/poker_bg_${poker.icon}.png`)
            "
          />
          <div class="game_content">
            <div class="game_title">{{ poker.title }}</div>
            <div class="game_subtitle">
              <span class="game_num">{{ poker.subcount }}</span>
              {{ poker.subtitle }}
            </div>
          </div>
        </swiper-slide>
        <swiper-slide
          v-for="(lottery, i) in lottery"
          :key="i"
          :class="'lottery-' + i"
        >
          <img
            @click="playGame(lottery.id, lottery.code, lottery.gameCode)"
            :src="
              require(`../assets/images/index/lottery/lottery_bg_${lottery.icon}.png`)
            "
          />
          <div class="game_content">
            <div class="game_title">{{ lottery.title }}</div>
            <div class="game_subtitle">
              <span class="game_num">{{ lottery.subcount }}</span>
              {{ lottery.subtitle }}
            </div>
          </div>
        </swiper-slide>
        <swiper-slide v-for="(slot, i) in slot" :key="i" :class="'slot-' + i">
          <img
            @click="playGame(slot.id, slot.code)"
            :src="
              require(`../assets/images/index/slot/slot_bg_${slot.icon}.png`)
            "
          />
          <div class="game_content">
            <div class="game_title">{{ slot.title }}</div>
            <div class="game_subtitle">
              <span class="game_num">{{ slot.subcount }}</span>
              {{ slot.subtitle }}
            </div>
          </div>
        </swiper-slide>

        <swiper-slide
          v-for="(fish, i) in fishing"
          :key="i"
          :class="'fish-' + i"
        >
          <img
            @click="playGame(fish.id, fish.code)"
            :src="
              require(`../assets/images/index/fish/fish_bg_${fish.icon}.png`)
            "
          />
          <div class="game_content">
            <div class="game_title">{{ fish.title }}</div>
            <div class="game_subtitle">
              <span class="game_num">{{ fish.subcount }}</span>
              {{ fish.subtitle }}
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
  <GameModal ref="allGames"></GameModal>

  <q-dialog width="100%" v-model="isStationNotice">
    <q-card style="width: 100%" class="bg-primary text-white">
      <q-card-section class="q-mb-md">
        <q-tabs
          v-model="activeKey"
          dense
          class="text-grey"
          active-color="bright"
          indicator-color="bright"
          align="justify"
        >
          <q-tab
            v-for="(tab, i) in announcementTypes"
            :key="i"
            :name="tab.id"
            :label="tab.name"
          />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeKey" animated>
          <q-tab-panel
            v-for="(tab, i) in announcementTypes"
            :key="i"
            :name="tab.id"
          >
            <q-list style="min-height: 65vh">
              <div v-for="(ann, idx) in announcementList" :key="idx">
                <span v-if="ann.typeId === tab.id">
                  <q-expansion-item
                    style="max-height: 65vh; overflow: auto"
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
      </q-card-section>
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
import MarqueeText from "vue-marquee-text-component";
import { RiVolumeUpLine } from "vue-remix-icons";

import { useUI } from "stores/ui";
import { Scrollbar } from "swiper";
// Import Swiper Vue.js components
import SwiperCore, { Keyboard, Mousewheel, HashNavigation, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Thumbs, Controller } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/scrollbar";
SwiperCore.use([Keyboard, Mousewheel, A11y, HashNavigation]);
export default defineComponent({
  name: "IndexPage",
  components: {
    Swiper,
    SwiperSlide,
    GameModal,
    MarqueeText
    // RiVolumeUpLine,
  },
  setup() {
    const thumbsSwiper = ref(null);
    // const setThumbsSwiper = (swiper) => {
    //   if (swiper.clickedIndex === 0) {
    //     // Go to first Slot Slide
    //     alert('slot')
    //   }
    //   if (swiper.clickedIndex === 1) {
    //     // Go to first Esport Slide
    //     swiper.activeIndex = 11
    //     alert('esport')
    //   }
    //   if (swiper.clickedIndex === 2) {
    //     // Go to first Esport Slide
    //     swiper.activeIndex = 13
    //     alert('sport')
    //   }

    // // for (let i = 0; i < slideElements.length; i++) {
    // //   const slideElement = slideElements[i];

    // //   if (slideElement.classList.contains(targetClass)) {
    // //     const thumbsSwiperInstance = slideElement.swiper;
    // //     this.thumbsSwiper = thumbsSwiperInstance;
    // //     console.log('Set thumbs swiper:', thumbsSwiperInstance);
    // //     return;
    // //   }
    // // }

    // // console.log('No swiper found with the specified class:', targetClass);

    // };

    const firstSwiper = ref(null);
    const secondSwiper = ref(null);

    const setFirstSwiper = (swiper) => {
      firstSwiper.value = swiper;
    };
    const setSecondSwiper = (swiper) => {
      secondSwiper.value = swiper;
    };
    const setSelectedSwiper = (tab) => {
      selectedTab.value = tab.name;
      if (tab.name === "esport") {
        firstSwiper.value?.slideTo(0, 500);
      }
      if (tab.name === "sport") {
        firstSwiper.value?.slideTo(3, 500);
      }
      if (tab.name === "live") {
        firstSwiper.value?.slideTo(6, 500);
      }
      if (tab.name === "poker") {
        firstSwiper.value?.slideTo(9, 500);
      }
      if (tab.name === "lottery") {
        firstSwiper.value?.slideTo(11, 500);
      }
      if (tab.name === "slot") {
        firstSwiper.value?.slideTo(13, 500);
      }
      if (tab.name === "fishing") {
        firstSwiper.value?.slideTo(25, 500);
      }
    };
    const onSlideChange = (swiper) => {
      // Get the active slide index
      const activeIndex = swiper.activeIndex;

      // Get the active slide element
      const activeSlide = swiper.slides[activeIndex];

      // Get the class name of the active slide
      const activeSlideClassName = activeSlide.className;
      // Check if the class name contains "sport," "slot," or "esport"
      // Array of keywords to check
      const keywords = [
        "sport",
        "esport",
        "live",
        "poker",
        "lottery",
        "slot",
        "fishing"
      ];

      // Iterate over each keyword
      for (const keyword of keywords) {
        // Check if the class name contains the current keyword
        if (activeSlideClassName.includes(keyword)) {
          selectedTab.value = keyword;
        }
      }
    };
    const selectedTab = ref("esport");
    const tabs = ref([
      {
        name: "esport",
        icon: "esport",
        label: "电竞",
        labelact: "电竞赛事"
      },
      {
        name: "sport",
        icon: "sport",
        label: "体育",
        labelact: "体育赛事"
      },
      {
        name: "live",
        icon: "live",
        label: "真人",
        labelact: "真人娱乐"
      },
      {
        name: "poker",
        icon: "poker",
        label: "棋牌",
        labelact: "棋牌游戏"
      },
      {
        name: "lottery",
        icon: "lottery",
        label: "彩票",
        labelact: "彩票游戏"
      },
      {
        name: "slot",
        icon: "slot",
        label: "电游",
        labelact: "电子/捕鱼"
      }
    ]);
    const esport = [
      {
        id: "esport",
        code: "MARLIN",
        icon: "marlin",
        title: "东赢电竞",
        subcount: "145",
        subtitle: "电竞赛事"
      },
      {
        id: "esport",
        code: "IM",
        icon: "im",
        title: "IM电竞",
        subcount: "157",
        subtitle: "电竞赛事"
      },
      {
        id: "esport",
        code: "IA",
        icon: "ia",
        title: "小艾电竞",
        subcount: "166",
        subtitle: "电竞赛事"
      }
    ];

    const sport = [
      {
        id: "sport",
        code: "IM",
        icon: "im",
        title: "IM体育",
        subcount: "637",
        subtitle: "体育赛事"
      },
      {
        id: "sport",
        code: "SABA",
        icon: "saba",
        title: "沙巴体育",
        subcount: "",
        subtitle: "体育赛事"
      },
      {
        id: "sport",
        code: "CR",
        icon: "cr",
        title: "CR体育",
        subcount: "204",
        subtitle: "体育赛事"
      }
    ];

    const livecasino = [
      {
        id: "live",
        code: "AG",
        icon: "ag",
        title: "AG真人",
        subcount: "40",
        subtitle: "真人娱乐"
      },
      {
        id: "live",
        code: "BBINDY",
        icon: "bbin",
        title: "BBIN真人",
        subcount: "40",
        subtitle: "真人娱乐",
        gameCode: "bblive_lobby_app"
      },
      {
        id: "live",
        code: "ALLBET",
        icon: "allbet",
        title: "欧博真人",
        subcount: "38",
        subtitle: "真人娱乐"
      }
    ];

    const poker = [
      {
        id: "poker",
        code: "DT",
        icon: "tx",
        title: "大唐棋牌",
        subcount: "18",
        subtitle: "棋牌娱乐"
      },
      {
        id: "poker",
        code: "KYDY",
        icon: "ky",
        title: "开元棋牌",
        subcount: "30",
        subtitle: "棋牌娱乐",
        gameCode: "ky_lobby"
      }
    ];

    const lottery = [
      {
        id: "lottery",
        code: "TCG",
        icon: "tcg",
        title: "TCG彩票",
        subcount: "29",
        subtitle: "彩票游戏"
      },
      {
        id: "lottery",
        code: "BBINDY",
        icon: "bbin",
        title: "BBIN彩票",
        subcount: "48",
        subtitle: "彩票游戏",
        gameCode: "bbkeno_lobby_app",
      }
    ];

    const slot = [
      {
        id: "slot",
        code: "PGDY",
        icon: "pg",
        title: "PG",
        subcount: "89",
        subtitle: "电子游戏"
      },
      {
        id: "slot",
        code: "CQ",
        icon: "cq",
        title: "SW电子",
        subcount: "89",
        subtitle: "电子游戏"
      },
      {
        id: "slot",
        code: "PTDY",
        icon: "pt",
        title: "PT电子",
        subcount: "157",
        subtitle: "电子游戏"
      },
      {
        id: "slot",
        code: "MGPLUS",
        icon: "mgplus",
        title: "MG+电子",
        subcount: "240",
        subtitle: "电子游戏"
      },
      {
        id: "slot",
        code: "CQ",
        icon: "cq",
        title: "CQ电子",
        subcount: "205",
        subtitle: "电子游戏"
      },
      {
        id: "slot",
        code: "BBINDY",
        icon: "bbin",
        title: "BBIN电子",
        subcount: "85",
        subtitle: "电子游戏"
      },
      {
        id: "slot",
        code: "AG",
        icon: "ag",
        title: "AG电子",
        subcount: "44",
        subtitle: "电子游戏"
      }
    ];

    const fishing = [
      {
        id: "fishing",
        code: "AG",
        icon: "ag_new",
        title: "AG捕鱼",
        subcount: "",
        subtitle: "捕鱼游戏"
      },
      {
        id: "fishing",
        code: "SW",
        icon: "sw",
        title: "捕鱼达人",
        subcount: "3",
        subtitle: "捕鱼游戏"
      }
    ];

    const ui = useUI();
    const scrollPageRef = ref(null);
    const isH5 = ref(true);
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
    const allGames = ref(null);
    const playGame = (gameName, platformCode, gameCode, gameStatus) => {
      // console.log("gameName" + ":" + "platformCode" + ":" + "gameCode" + ":" + "gameStatus");
      // console.log(gameName + ":" + platformCode + ":" + gameCode + ":" + gameStatus);
      allGames.value.open(gameName, platformCode, gameCode, gameStatus);
    };
    function loadData() {
      api
        .get("/promo/banner?category=HOME")
        .then((res) => {
          if (res.code === 0) {
            banners.value = res.data;
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
    const liveTabs = ref("");
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
            .then((response) => {
              if (response.code === 0) {
                return response;
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
      // cached
      //   .get("PLATFORMS", () =>
      //     api.get("/platform").then((res) => {
      //       const response = res.data;
      //       return response;
      //     })
      //   )
      //   .then((data) => {
      //     fishPlatforms.value = data.filter((element) =>
      //       element.gameType.includes("FISH")
      //     );
      //     platforms.value = data.filter((element) =>
      //       element.gameType.includes("SLOT")
      //     );
      //     if (currentSelectedMenu.value === "slots") {
      //       switchPlat(platforms.value[0], "slots");
      //       platforms.value.forEach((e, i) => {
      //         if (e.code === "AWS") {
      //           platforms.value.splice(i, 1);
      //         }
      //       });
      //     } else if (currentSelectedMenu.value === "fish") {
      //       switchPlat(fishPlatforms.value[0], "fish");
      //     }
      //     // if (!route.query.plat) {
      //     //   switchPlat(platforms.value[0], "slot");
      //     //   switchPlat(fishPlatforms.value[0], "fish");
      //     // } else {
      //     //   platforms.value.forEach((element) => {
      //     //     if (parseInt(route.query.plat) === element.id) {
      //     //       switchPlat(element, "slot");
      //     //     }
      //     //   });
      //     // }
      //   })
      //   .catch((err) => {
      //     // $q.notify({
      //     //   color: "negative",
      //     //   position: "top",
      //     //   message: "Loading failed",
      //     //   icon: "report_problem"
      //     // });
      //   });
    };
    const announcementList = ref([]);
    const announcementTypes = ref([]);
    const loadAnnouncement = () => {
      api.get("/announcement").then((res) => {
        if (res.code === 0) {
          if (res.data.announcements) {
            const d = res.data.announcements;
            announcementList.value = d;
          }
          if (res.data.type) {
            announcementTypes.value = res.data.type;
            activeKey.value = res.data.type[0].id;
          }
          // announcementList.value = d.announcements
          // announcementList.value = res.data.announcements
        }
      });
    };
    const isStationNotice = ref(false);
    const noticeTitle = ref("");
    const activeKey = ref(null);
    const openPopup = (noticeType) => {
      if (noticeType) {
        noticeTitle.value = "Announcement";
        isStationNotice.value = true;
      }
    };
    const gotoPromo = (banner) => {
      const redirectU = "/promo?name=" + banner.redirectUrl;
      router.push(`${redirectU}`);
    };
    onMounted(() => {
      getPlatList();
      loadData();
      loadAnnouncement();
    });
    const imageLoading = ref(false);
    const selectedLiveTab = ref();
    // const openGame = (gameName, gameCode) => {
    //   casinoGame.value.open(gameName, selectedPlat.value.code, gameCode);
    // };
    return {
      imageLoading,
      slide: ref(0),
      tab: ref("esport"),
      gamesTab: ref(platforms.value[0]),
      splitterModel: ref(27),
      imgURL: process.env.IMAGE_CDN + "/promo/",
      banners,
      store,
      platforms,
      mainWallet,
      playGame,
      allGames,
      // casinoGame,
      gamePage,
      selectedPlatId,
      searchList,
      liveTabs,
      selectedLiveTab,
      // openGame,
      scrollPageRef,
      announcementList,
      isStationNotice,
      openPopup,
      noticeTitle,
      announcementTypes,
      activeKey,
      gotoPromo,
      router,
      tabs,
      selectedTab,
      sport,
      esport,
      // slots,
      slot,
      livecasino,
      poker,
      fishing,
      lottery,
      isH5,
      onSlideChange,
      Thumbs,
      thumbsSwiper,
      modules: [Scrollbar],
      Controller,
      firstSwiper,
      secondSwiper,
      setFirstSwiper,
      setSecondSwiper,
      setSelectedSwiper
    };
  }
});
</script>
<style scoped lang="scss">
.secondSwiper {
  height: calc(100vh - 410px);
  padding-bottom: 100px;
  padding-top: 25px;
}
:deep(.secondSwiper .swiper-wrapper) {
  .swiper-slide {
    // height: 120px;
    // width: 95%;
    // margin: 0 auto;
    // overflow: hidden;
    height: calc(45vh / 4);
    width: 95%;
    margin: 0 auto;
    overflow: hidden;
    // min-height: 25vw;
    min-height: 10vw;
    padding-top: 0;
    margin-bottom: 5px;
    a {
      display: block;
    }
    img {
      width: 100%;
    }
    &:first-child {
      // padding-top: 65px;
      // margin-top: -40px;
      // padding-top: 30px;
    }
    &-active {
      // padding-top: 30px;
    }
  }
}
.swiper-container {
  position: relative;
  background: #d2d2de;
  .firstSwiper {
    margin-bottom: -30px;
    padding-bottom: 10px;
    z-index: 999;
    text-align: center;
    .swiper-slide {
      // background: #23263c;
      background: #ffffff;
      padding: 8px 5px 2px;
      max-width: 60px;
      cursor: pointer;
      &.tbact {
        background: url("../assets/images/index/game_tab_active.png") no-repeat
          center center;
        background-size: cover;
        white-space: nowrap;
        padding: 8px 20px 2px;
        color: #ffffff;
      }
    }
  }

  .game_content {
    position: absolute;
    text-align: center;
    top: 45%;
    left: 55%;
    transform: translate(-50%, -50%);
    .game_title {
      font-size: 1.2rem;
      color: #fff;
      font-weight: 500;
    }
    .game_subtitle {
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .game_num {
      font-size: 1rem;
    }
  }
}
@import url("https://fonts.googleapis.com/css2?family=Bungee&display=swap");
.download-top-container {
  .download-top-box {
    display: flex;
    padding: 10px;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    background: #ffffff;
    .q-icon {
      font-size: 24px;
      color: #999;
    }
    .headicon {
      // flex: 1;
      // width: 5%;
    }
    .download-txt-container {
      flex: 5;
      font-size: 0.7rem;
      line-height: 0.8rem;
      display: flex;
      flex-direction: column;
      color: #999;
      .download-title {
        font-size: 0.8rem;
        color: #666;
        margin-bottom: 4px;
      }
    }
    .buttons {
      display: flex;
      gap: 5px;
    }
    .top-btn {
      background-image: linear-gradient(90deg, #3379f5 0, #77bbfc 100%),
        linear-gradient(#5b80e7, #5b80e7);
      // height: 0.864rem;
      // width: 2.3rem;
      text-align: center;
      line-height: 0.864rem;
      color: #fff;
      border-radius: 0.1rem;
    }
  }
}
.midd {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // gap: 10px;
  // margin: 10px;
  margin-top: -30px;
  height: 30px;
  position: relative;
  border-radius: 15px 15px 0 0;
  overflow: hidden;
  .station-notice-wrapper {
    display: flex;
    background: rgba(44, 44, 44, 0.7);
    // background: #2b2b4b;
    // border-radius: 10px;
    // margin: 10px;
    gap: 10px;
    padding: 5px 10px;
    justify-content: center;
    align-items: center;
    .volume {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    span {
      margin-right: 10px;
      cursor: pointer;
      color: #000;
    }
    .notice {
      img {
        width: 30px;
      }
    }
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

.details-container {
  background: url("../assets/images/index/details_bg.png") no-repeat;
  // height: 2.5rem;
  width: 100%;
  background-size: 100% 132px;
}
.welcome-bar {
  display: flex;
  padding: 10px;
  gap: 20px;
  // background-color: #212534;
  height: 35px;
  justify-content: space-evenly;
  align-items: center;
  color: #000;
  font-size: 12px;
  .logo {
    flex: 1;
    height: 25px;
    img {
      height: 100%;
    }
  }
  .welcome-liner {
    flex: 3;
  }
  .login {
    flex: 2;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: #000;
    .user {
      background: #ffffff;
      padding: 0px 2px;
      border-radius: 50%;
    }
  }
}
.details-bar {
  gap: 10px;
  // background-color: #1a1c28;
  padding: 20px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .message {
    flex: 1;
    padding: 10px;
    border-right: 1px solid #45475f;
    color: #000;
    font-size: 16px;
  }
  .menulist {
    flex: 4;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    .men {
      text-decoration: none;
      color: #000000;
      gap: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 30px;
      }
    }
  }
}
.index-platform-container {
  position: relative;
  :deep(.q-splitter__panel.q-splitter__before) {
    position: absolute;
    top: 0;
    position: absolute;
    top: 0;
    z-index: 99;
  }
  .q-dark {
    background: none;
  }
  .q-tab-panel {
    padding: 0px;
  }

  .q-tabs--vertical {
    margin: 0 5px 0 0;

    .q-tab {
      min-height: 40px;
      border-radius: 10px;
      margin: 0 0 5px;
      background-image: linear-gradient(0deg, #1a1c28 0, #212534 100%),
        linear-gradient(#2d879c, #2d879c);
      border-radius: 6px;
      color: #000;
      display: flex;
      align-items: center;
      padding: 3px 0;
      &--active {
        background-image: linear-gradient(0deg, #07404b 0, #058096 100%),
          linear-gradient(#2d879c, #2d879c);
        color: #fff;
      }
    }
    .q-tab-panel {
      padding: 5px;
    }
  }
  :deep(.q-tab--active .q-tab__indicator) {
    display: none;
  }
  .q-tabs--horizontal {
    margin: 0 5px 0 0;

    .q-tab {
      min-height: unset;
      min-width: 60px;
      margin: 0 0 5px;
      background-image: linear-gradient(0deg, #1a1c28 0, #212534 100%),
        linear-gradient(#2d879c, #2d879c);
      color: #000;
      display: flex;
      align-items: center;
      padding: 3px 0;
      &--active {
        background-image: unset;
        // background-image: linear-gradient(0deg,#07404b 0,#058096 100%),linear-gradient(#2d879c,#2d879c);
        border-radius: 6px;
        color: #fff;
      }
    }
    .q-tab-panel {
      padding: 5px;
    }
  }
}
.q-tab--active .q-tab__indicator {
  background: #ffffff;
  top: 0;
}
.q-tab-panel {
  .tabitems {
    display: grid;
    img {
      width: 100%;
      display: block;
    }
    &.quarter {
      grid-template-columns: repeat(4, 1fr);
      padding-top: 30px;
    }
    &.middle {
      gap: 10px;
    }
    &.five {
      grid-template-columns: repeat(2, 1fr);
      gap: 5px;
      > div:first-child {
        grid-column-end: 3;
        grid-column-start: 1;
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
<style>
.marquee-text-wrap span {
  color: #ffffff !important;
}
</style>
