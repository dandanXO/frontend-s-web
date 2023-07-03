<template>
  <div v-if="isH5" class="download-top-container">
    <div class="download-top-box">
      <q-icon name="close" @click="isH5 = false"/>
      <img class="headicon" src="../assets/images/index/head_logo.png">
      <div class="download-txt-container">
        <span class="download-title text-bold">兴發 APP</span>
        <span>覆盖全部游戏,体验更流畅,更安全,更快捷</span>
      </div>
      <div class="buttons">
        <q-btn size="sm" href="/wap/login.html?way=reg" label="注册" color="brightbtn"/>
        <q-btn size="sm" href="https://xfapp1.com?url=m.xf882.com&amp;agentCode=" target="_blank" label="APP 下载"
               color="brightbtn"/>
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
          style="border:1px solid #ffffff; border-radius: 50%; margin: 6px 8px;"
      />
      <q-btn
          padding="3px"
          v-else
          size="xs"
          color="transparent"
          @click="onClick"
          style="border:1px solid #aaaaaa; border-radius: 50%; margin: 6px 8px;"
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
      <div class="volume">
        <RiVolumeUpLine style="fill: #2fbdd5"/>
      </div>
      <marquee-text :repeat="5" :duration="announcementList.length * 120">
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
  <div class="welcome-bar">
    <div class="logo"><img src="../assets/logo.png"/></div>
    <div class="welcome-liner">欢迎您， {{ store.token ? store.nickName : '亲爱的用户' }}</div>
    <div v-if="store.token">
      <q-badge color="orange" text-color="black" :label="store.vip" />
      <span class="q-ml-sm">￥{{ store.balance }}</span>
    </div>
    <router-link
        v-if="!store.token"
        to="/login?register"
        class="login with-register"
    >
      <span class="log">注册</span>
    </router-link>
    <router-link v-if="!store.token" to="/login" class="login"><span class="log">请登录</span><span class="user"><q-icon
        name="person" style="color: #2dbfd4; font-size: 14px;"/></span></router-link>
    <router-link v-else to="/account" class="login"><span class="log">已登录</span><span class="user"><q-icon
        name="person" style="color: #2dbfd4; font-size: 14px;"/></span></router-link>
  </div>
  <div class="details-bar">
    <div class="message">{{ store.token ? '¥' + mainWallet.toFixed(2) : '早上好~' }}</div>
    <div class="menulist">
      <router-link to="/finance/deposit" class="men deposit-menu">
        <img src="../assets/images/index/deposit_icon.png">
        <div class="">存款</div>
      </router-link>
      <router-link to="/finance/withdraw" class="men withdraw-menu">
        <img src="../assets/images/index/withdrawal_icon.png">
        <div class="">取款</div>
      </router-link>
      <router-link to="/account/transfer" class="men transfer-menu">
        <img src="../assets/images/index/transfer_icon.png">
        <div class="">转账</div>
      </router-link>
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
        watch-slides-progress
        @swiper="setSecondSwiper"
        :controller="{ control: firstSwiper }"
        class="firstSwiper"
    >
      <swiper-slide :class="tab.name && {tbact: selectedTab === tab.name}" @click="setSelectedSwiper(tab)"
                    v-for="(tab, i) in tabs" :key="i" style="width: calc(100vw / 7);"
      >{{ selectedTab !== tab.name ? tab.label : tab.labelact }}
      </swiper-slide
      >
    </swiper>
    <div class="index-platform-container" style="overflow: hidden;">
      <!-- Main Swiper -> pass thumbs swiper instance -->
      <swiper
          :modules="[Thumbs, Controller]"
          :thumbs="{ swiper: thumbsSwiper }"
          :direction="'vertical'"
          slides-per-view="auto"
          :scrollbar="{ draggable: true }"
          @slide-change-transition-end="onSlideChange"
          :mousewheel="true"
          @swiper="setFirstSwiper"
          :controller="{ control: secondSwiper }"
          class="secondSwiper"
      >
        <swiper-slide v-for="(slot, i) in slots" :key="i" :class="'slot-' + i">
          <router-link :to="`slot?platform=${slot.code}`">
            <!-- <div :style="`width: 100%; height: 100%; background: #eb8707;`">{{ i }}</div> -->
            <img :src="require(`../assets/images/index/slot/p_slot_${slot.icon}.png`)"/>
          </router-link>
        </swiper-slide>

        <swiper-slide class="esport">
          <router-link :to="`/e-sport`">
            <img :src="require(`../assets/images/index/esport/p_esport_xf.png`)"/>
          </router-link>
        </swiper-slide>
        <swiper-slide class="sport-0">
          <router-link to="/sport">
            <img :src="require(`../assets/images/index/sport/p_sport_im.png`)"/>
          </router-link>
        </swiper-slide>
        <swiper-slide class="sport-1">
          <router-link to="/sport">
            <img :src="require(`../assets/images/index/sport/p_sport_cr.png`)"/>
          </router-link>
        </swiper-slide>
        <swiper-slide v-for="(live, i) in livecasino" :key="i" :class="'live-' + i">
          <img @click="playGame(live.id, live.code)" :src="require(`../assets/images/index/live/${live.icon}.png`)"/>

        </swiper-slide>
        <swiper-slide v-for="(poker, i) in pokerList" :key="i" :class="'poker-' + i">
          <img @click="playGame(poker.id, poker.code)"
               :src="require(`../assets/images/index/poker/p_poker_${poker.icon}.png`)"/>

        </swiper-slide>
        <swiper-slide v-for="(fish, i) in fishing" :key="i" :class="'fishing-' + i">
          <img @click="playGame(fishing.id, fishing.code)"
               :src="require(`../assets/images/index/fish/p_fish_${fish.icon}.png`)"/>

        </swiper-slide>
        <swiper-slide v-for="(mini, i) in minigame" :key="i" :class="'minigame-' + i">
          <img @click="playGame(minigame.id, minigame.code)"
               :src="require(`../assets/images/index/minigame/p_mini_${mini.icon}.png`)"/>
        </swiper-slide>
      </swiper>
    </div>
  </div>
  <GameModal ref="allGames"></GameModal>

  <q-dialog
      width="100%"
      class="modal-update-div"
      v-model="isAppUpdateModal"
      show-cancel-button
      :showCancelButton="false"
      :showConfirmButton="false"
  >
    <q-card style="width: 100%" class="bg-bright text-black">
      <div class="modalcontent">
        <div class="headers">
          <div class="titles backgroundColor">更新公告</div>
        </div>
        <div class="contents">检测到新版本，你是否要更新？</div>
        <div class="btnsreas">
          <div class="cacnels borderColor fontColor" @click="cancelUpdate">
            取消
          </div>
          <div class="confirmsbtns btncolor" @click="openDownloadPage">
            立即更新
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="isStationNotice">
    <q-card style="width: 100%;" class="bg-primary text-white">
      <q-card-section class="q-mb-md">
        <q-tabs
            v-model="activeKey"
            dense
            class="text-grey"
            active-color="bright"
            indicator-color="bright"
            align="justify"
        >
          <q-tab v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id" :label="tab.name"/>
        </q-tabs>

        <q-separator/>

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
import {defineComponent, onMounted, ref, reactive, computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import {api} from "boot/axios";
import {cached} from "boot/cache";
import {useQuasar, Platform} from "quasar";
import {userStore} from "stores/index";
import GameModal from "components/modal/GameModal";
import MarqueeText from 'vue-marquee-text-component';
import {RiVolumeUpLine} from "vue-remix-icons";

import {useUI} from "stores/ui";
import {Scrollbar} from 'swiper';
// Import Swiper Vue.js components
import SwiperCore, {
  Keyboard,
  Mousewheel,
  HashNavigation,
  A11y,
} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/vue';
import {Thumbs, Controller} from 'swiper';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/scrollbar';

SwiperCore.use([Keyboard, Mousewheel, A11y, HashNavigation]);
export default defineComponent({
  name: "IndexPage",
  components: {
    Swiper,
    SwiperSlide,
    GameModal,
    MarqueeText,
    RiVolumeUpLine
  },
  setup() {
    const isFirstView = ref(false);
    const closeAlert = () => {
      localStorage.setItem("indexImgTop", new Date().getTime());
      isFirstView.value = false;
    };

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
      firstSwiper.value = swiper
    };
    const setSecondSwiper = (swiper) => {
      secondSwiper.value = swiper
    };
    const setSelectedSwiper = (tab) => {
      selectedTab.value = tab.name
      if (tab.name === 'slot') {
        firstSwiper.value?.slideTo(0, 500)
      }
      if (tab.name === 'esport') {
        firstSwiper.value?.slideTo(12, 500)
      }
      if (tab.name === 'sport') {
        firstSwiper.value?.slideTo(13, 500)
      }
      if (tab.name === 'live') {
        firstSwiper.value?.slideTo(15, 500)
      }
      if (tab.name === 'poker') {
        firstSwiper.value?.slideTo(20, 500)
      }
      if (tab.name === 'fishing') {
        firstSwiper.value?.slideTo(22, 500)
      }
      if (tab.name === 'minigame') {
        firstSwiper.value?.slideTo(25, 500)
      }
    }
    const onSlideChange = (swiper) => {
      // Get the active slide index
      const activeIndex = swiper.activeIndex;

      // Get the active slide element
      const activeSlide = swiper.slides[activeIndex];

      // Get the class name of the active slide
      const activeSlideClassName = activeSlide.className;
      // Check if the class name contains "sport," "slot," or "esport"
      // Array of keywords to check
      const keywords = ['sport', 'slot', 'esport', 'fishing', 'live', 'poker', 'minigame'];

      // Iterate over each keyword
      for (const keyword of keywords) {
        // Check if the class name contains the current keyword
        if (activeSlideClassName.includes(keyword)) {
          selectedTab.value = keyword
        }
      }
    };
    const selectedTab = ref('slot');
    const tabs = ref([
      {
        name: 'slot',
        icon: 'slot',
        label: '电子',
        labelact: '电子'
      },
      {
        name: 'esport',
        icon: 'esport',
        label: '电竞',
        labelact: '电竞赛事'
      },
      {
        name: 'sport',
        icon: 'sport',
        label: '体育',
        labelact: '体育赛事'
      },
      {
        name: 'live',
        icon: 'live',
        label: '真人',
        labelact: '真人娱乐'
      },
      {
        name: 'poker',
        icon: 'poker',
        label: '棋牌',
        labelact: '棋牌游戏'
      },
      {
        name: 'fishing',
        icon: 'fishing',
        label: '捕鱼',
        labelact: '捕鱼'
      },
      {
        name: 'minigame',
        icon: 'minigame',
        label: '小游戏',
        labelact: '小游戏'
      },
    ]);
    const slots = ref([
      {
        id: '20',
        code: 'PT',
        icon: 'pt',
      },
      {
        id: '37',
        code: 'SW',
        icon: 'sw',
      },
      {
        id: '46',
        code: 'PP',
        icon: 'pp',
      },
      {
        id: '38',
        code: 'PG',
        icon: 'pg',
      },
      {
        id: '54',
        code: 'MG_PLUS',
        icon: 'mg',
      },
      {
        id: '42',
        code: 'CQ',
        icon: 'cq',
      },
      {
        id: '28',
        code: 'SG',
        icon: 'sg',
      },
      {
        id: '27',
        code: 'TTG',
        icon: 'ttg',
      },
      {
        id: '39',
        code: 'PNG',
        icon: 'png',
      },
      {
        id: '45',
        code: 'AE',
        icon: 'ae',
      },
      {
        id: '52',
        code: 'BBIN',
        icon: 'bbin',
      },
      {
        id: '64',
        code: 'JDB',
        icon: 'jdb',
      },
    ]);
    const livecasino = [{
      id: 'zhenren',
      code: 'AG',
      icon: 'ag',
    },
      {
        id: 'zhenren',
        code: 'AG',
        icon: 'ebet',
      },
      {
        id: 'zhenren',
        code: 'bbin',
        icon: 'bbin',
      }, {
        id: 'zhenren',
        code: 'allbet',
        icon: 'all',
      }, {
        id: 'zhenren',
        code: '',
        icon: 'jqqd',
      }]
    const pokerList = [{
      id: 'poker',
      code: 'DT',
      icon: 'dt',
    },
      {
        id: 'poker',
        code: 'KY',
        icon: 'ky',
      }]
    const fishing = [{
      id: 'fish',
      code: 'AT',
      icon: 'at',
    },
      {
        id: 'fish',
        code: 'AG',
        icon: 'ag',
      },
      {
        id: 'fish',
        code: 'SG',
        icon: 'sg',
      }]
    const minigame = [{
      id: 'mini',
      code: 'GPS',
      icon: 'gps'
    }]
    const ui = useUI();
    const scrollPageRef = ref(null);
    const isH5 = ref(false);
    const checkPlatform = () => {
      //Is iOS Webclip App || Is Android Apk
      if (
          (Platform.is.ios &&
              "standalone" in window.navigator &&
              window.navigator.standalone) ||
          (Platform.is.android && Platform.is.capacitor)
      ) {
        isH5.value = false;
      } else {
        isH5.value = true;
      }
    };

    ui.$onAction(({name, args}) => {
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
    const announcementList = ref([])
    const announcementTypes = ref([])
    const loadAnnouncement = () => {
      api.get("/announcement").then((res) => {
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
      const redirectU = '/promo?id=' + banner.redirectUrl
      router.push(`${redirectU}`)
    }

    const download_url = ref("");
    const isAppUpdateModal = ref(false);
    const getVersionNo = async () => {
      // console.log(Platform);
      // alert("Capacitor" + Platform.is.capacitor);
      if (Platform.is.android && Platform.is.capacitor) {
        const info = await App.getInfo();
        // const info = {
        //   version: "1.0.1"
        // };
        console.log("App Info");
        console.log(info);
        // alert(info.version);
        var current_version = parseInt(
            info.version.replaceAll(".", "") + info.build
        );
        console.log(current_version);
        // info.version && info.build
        const appType = "ALL";
        const device = Platform.is.android ? "ANDROID" : "IOS";
        const res = await api.get(
            `/config/appVersionAndUrl?type=${appType}&device=${device}`
        );
        // console.log(res);
        if (res.code === 0) {
          var version_info = res.data.version;
          var latest_ver_no = parseInt(version_info.replaceAll(".", ""));
          download_url.value = res.data.url;

          console.log(latest_ver_no);
          // alert(latest_ver_no);
          // console.log(download_url.value);
          if (latest_ver_no > current_version) {
            console.log("Need to Updat");
            isAppUpdateModal.value = true;
          }
        }
      }
    };

    const openDownloadPage = () => {
      console.log("open Page");
      window.open(download_url.value, "_system");
      isAppUpdateModal.value = false;
    };
    const cancelUpdate = () => {
      isAppUpdateModal.value = false;
    };

    const isiOS = () => {
      return (
          [
            "iPad Simulator",
            "iPhone Simulator",
            "iPod Simulator",
            "iPad",
            "iPhone",
            "iPod"
          ].includes(navigator.platform) ||
          // iPad on iOS 13 detection
          (navigator.userAgent.includes("Mac") && "ontouchend" in document)
      );
    };


    onMounted(() => {
      getPlatList();
      loadData();
      loadAnnouncement();
      checkPlatform();
      getVersionNo();
    });
    const imageLoading = ref(false);
    const selectedLiveTab = ref();
    // const openGame = (gameName, gameCode) => {
    //   casinoGame.value.open(gameName, selectedPlat.value.code, gameCode);
    // };
    return {
      imageLoading,
      slide: ref(0),
      tab: ref("slots"),
      gamesTab: ref(platforms.value[0]),
      splitterModel: ref(27),
      imgURL: process.env.IMAGE_CDN + "/",
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
      slots,
      livecasino,
      pokerList,
      fishing,
      minigame,
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
      setSelectedSwiper,
      isFirstView,
      closeAlert,
      isAppUpdateModal,
      cancelUpdate,
      openDownloadPage
    };
  }
});
</script>
<style scoped lang="scss">
.secondSwiper {
  height: calc(100vh - 410px);
  padding-bottom: 0px;
  padding-top: 25px;
}

:deep(.secondSwiper .swiper-wrapper) {
  .swiper-slide {
    // height: 120px;
    // width: 95%;
    // margin: 0 auto;
    // overflow: hidden;
    height: calc(45vh / 5);
    width: 95%;
    margin: 0 auto;
    overflow: hidden;
    min-height: 120px;
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

  .firstSwiper {
    margin-bottom: -30px;
    padding-bottom: 10px;
    z-index: 999;
    text-align: center;

    .swiper-slide {
      background: #23263c;
      padding: 8px 5px 2px;
      max-width: 60px;
      cursor: pointer;

      &.tbact {
        background: url('../assets/images/index/game_tab_active.png') no-repeat center center;
        background-size: cover;
        white-space: nowrap;
        padding: 8px 20px 2px
      }
    }
  }
}

.modal-update-div {
  .modalcontent {
    background: #fff;
    height: 232px;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0px 0px 16px;

    .headers {
      width: 100%;
      box-sizing: border-box;
      height: 37px;
      line-height: 37px;
      background: #1976d2;
      color: #fff;
      text-align: center;
      font-size: 15px;
      font-weight: bold;
      letter-spacing: 1px;
    }

    .contents {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 12px;
      text-align: center;

      .contentfonts {
        text-align: center;
        color: #333;
        font-size: 16px;
        margin: 37px 0 20.5px 0;
      }

      .inputs {
        width: 292px;
        height: 36px;
        border-radius: 4px 4px;
        border: 1px solid #666;
        box-sizing: border-box;
        margin: 0 auto;
        padding-left: 20px;

        .van-field__control {
          height: 100%;
          width: 100%;
        }
      }
    }

    .btnsreas {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      margin-top: 23.5px;

      .cacnels {
        flex: 1;
        background: #f7fcfd;
        box-sizing: border-box;
        color: #1976d2;
        border: 1px solid #1976d2;
        border-radius: 6px;
        line-height: 40px;
        height: 40px;
        text-align: center;
        letter-spacing: 1px;
        font-size: 14px;
        margin-right: 8px;
      }

      .confirmsbtns {
        flex: 1;
        box-sizing: border-box;
        border-radius: 6px;
        line-height: 40px;
        height: 40px;
        text-align: center;
        color: #fff;
        background: #1976d2;
        letter-spacing: 1px;
        font-size: 14px;
      }
    }
  }
}

@import url("https://fonts.googleapis.com/css2?family=Bungee&display=swap");
.download-top-container {
  padding: 10px;

  .download-top-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;

    .q-icon {
      font-size: 24px;
      color: #bacef1;
    }

    .headicon {
      flex: 1;
      width: 5%;
    }

    .download-txt-container {
      flex: 5;
      font-size: .7rem;
      line-height: .8rem;
      display: flex;
      flex-direction: column;
      color: #bacef1;

      .download-title {
        font-size: .8rem;
      }
    }

    .buttons {
      display: flex;
      gap: 5px;
    }

  }
}

.midd {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // gap: 10px;
  // margin: 10px;
  margin-top: -29px;
  height: 30px;
  position: relative;
  border-radius: 15px 15px 0 0;
  overflow: hidden;

  .station-notice-wrapper {
    display: flex;
    background: rgba(44, 44, 44, .7);
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
      color: #bacef1;
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

.welcome-bar {
  display: flex;
  padding: 10px;
  gap: 20px;
  background-color: #212534;
  height: 35px;
  justify-content: space-evenly;
  align-items: center;
  color: #bacef1;
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
    gap: 30px;
    text-decoration: none;
    color: #bacef1;

    .user {
      background: #43465e;
      padding: 0px 2px;
      border-radius: 50%;
    }
  }
}

.details-bar {
  gap: 10px;
  background-color: #1a1c28;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .message {
    flex: 1;
    padding: 10px;
    border-right: 1px solid #45475f;
    color: #bacef1;
    font-size: 16px;

  }

  .menulist {
    flex: 4;
    display: flex;
    justify-content: space-between;
    gap: 10px;

    .men {
      text-decoration: none;
      color: #ffffff;
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
      background-image: linear-gradient(0deg, #1a1c28 0, #212534 100%), linear-gradient(#2d879c, #2d879c);
      border-radius: 6px;
      color: #bacef1;
      display: flex;
      align-items: center;
      padding: 3px 0;

      &--active {
        background-image: linear-gradient(0deg, #07404b 0, #058096 100%), linear-gradient(#2d879c, #2d879c);
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
      background-image: linear-gradient(0deg, #1a1c28 0, #212534 100%), linear-gradient(#2d879c, #2d879c);
      color: #bacef1;
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

@media (max-width: 480px) {
  .secondSwiper .swiper-wrapper .swiper-slide {
    height: calc(45vh / 4);
    min-height: 25vw;
    max-height: unset;
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
