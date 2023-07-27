<template>
  <div v-if="isH5" class="download-top-container">
    <div class="download-top-box">
      <q-icon name="close" @click="closeTopBox" />
      <img class="headicon" src="../assets/images/index/head_logo.png" />
      <div class="download-txt-container">
        <span class="download-title text-bold">兴發 APP</span>
        <span>覆盖全部游戏,体验更流畅,更安全,更快捷</span>
      </div>
      <div class="buttons">
        <div class="buttons">
          <!-- <q-btn
            size="sm"
            href="/wap/login.html?way=reg"
            label="注册"
            color="dyblue"
          />
            href="https://xfapp1.com?url=m.xf882.com&amp;agentCode="-->
          <q-btn
            size="md"
            :href="`${downloadUrl}`"
            target="_blank"
            label="立即下载"
            color="brightbtn"
            class="top-btn"
          />
        </div>
      </div>
    </div>
  </div>
  <q-carousel
    class="home"
    autoplay
    navigation
    v-model="slide"
    swipeable
    transition-next="slide-left"
    transition-prev="slide-right"
    animated
    infinite
  >
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
    ></q-carousel-slide>
  </q-carousel>
  <div class="midd">
    <div class="station-notice-wrapper">
      <div class="volume">
        <RiVolumeUpLine style="fill: #2fbdd5" />
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
  <div class="welcome-bar">
    <div class="logo"><img src="../assets/logo.png" /></div>
    <div class="welcome-liner">
      欢迎您， {{ store.token ? store.nickName : "亲爱的用户" }}
    </div>
    <div v-if="store.token">
      <q-badge color="orange" text-color="black" :label="store.vip" />
      <!--      <span class="q-ml-sm">￥{{ store.balance }}</span>-->
    </div>
    <router-link
      v-if="!store.token"
      to="/login?register"
      class="login with-register"
    >
      <span class="log">注册</span>
    </router-link>
    <router-link v-if="!store.token" to="/login" class="login with-register">
      <span class="log" style="white-space: nowrap">请登录</span>
      <span class="user">
        <q-icon name="person" style="color: #2dbfd4; font-size: 14px" />
      </span>
    </router-link>
    <router-link v-else to="/account" class="login">
      <!--      <span class="log" style="white-space: nowrap">已登录</span>-->
      <span class="user">
        <q-icon name="person" style="color: #2dbfd4; font-size: 14px" />
      </span>
    </router-link>
  </div>
  <div class="details-bar">
    <div class="message" @click="refreshBalance">
      {{
        store.token
          ? !isLoadingBalance
            ? "¥" + mainWallet.toFixed(2)
            : "加载中..."
          : "早上好~"
      }}
    </div>
    <div class="menulist">
      <router-link to="/finance/deposit?redirect=/" class="men deposit-menu">
        <img src="../assets/images/index/deposit_icon.png" />
        <div class="">存款</div>
      </router-link>
      <router-link to="/finance/withdraw?redirect=/" class="men withdraw-menu">
        <img src="../assets/images/index/withdrawal_icon.png" />
        <div class="">取款</div>
      </router-link>
      <router-link to="/account/transfer?redirect=/" class="men transfer-menu">
        <img src="../assets/images/index/transfer_icon.png" />
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
      >
        {{ selectedTab !== tab.name ? tab.label : tab.labelact }}
      </swiper-slide>
    </swiper>
    <div class="index-platform-container" style="overflow: hidden">
      <!-- Main Swiper -> pass thumbs swiper instance -->
      <swiper
        :modules="[Thumbs, Controller]"
        :thumbs="{ swiper: thumbsSwiper }"
        :direction="'vertical'"
        slides-per-view="auto"
        :rewind="true"
        :scrollbar="{ draggable: true }"
        @slide-change-transition-end="onSlideChange"
        @swiper="setFirstSwiper"
        :controller="{ control: secondSwiper }"
        class="secondSwiper"
        id="btm-second-swiper"
      >
        <swiper-slide
          v-for="(live, i) in livecasino"
          :key="i"
          :class="'live-' + i"
        >
          <template v-if="live.code === 'BBINDY' && live.name === 'BBIN'">
            <PlatformBlock
              @click="playGame(live.name, live.code, 'bblive_lobby_app')"
              dataType="live"
              :data="live"
            />
          </template>
          <template v-else>
            <PlatformBlock
              @click="playGame(live.name, live.code, live.gameCode)"
              dataType="live"
              :data="live"
            />
          </template>
        </swiper-slide>
        <swiper-slide v-for="(sp, i) in sport" :key="i" :class="'sport-' + i">
          <PlatformBlock
            @click="playGame(sp.name, sp.code, sp.gameCode)"
            dataType="sport"
            :data="sp"
          />
        </swiper-slide>
        <swiper-slide v-for="(es, i) in esport" :key="i" :class="'esport-' + i">
          <PlatformBlock
            @click="playGame(es.name, 'platformType', es.code)"
            dataType="esport"
            :data="es"
          />
        </swiper-slide>

        <swiper-slide v-for="(slt, i) in slot" :key="i" :class="'slot-' + i">
          <PlatformBlock dataType="slot" :data="slt" />
        </swiper-slide>

        <swiper-slide
          v-for="(fish, i) in fishing"
          :key="i"
          :class="'fishing-' + i"
        >
          <template v-if="fish.code === 'GPS' && fish.name === 'GPS'">
            <PlatformBlock
              @click="playGame(fish.name, fish.code, '7202')"
              dataType="fish"
              :data="fish"
            />
          </template>

          <template v-if="fish.code === 'AG' && fish.name === 'AG'">
            <PlatformBlock
              @click="playGame(fish.name, fish.code, '6')"
              dataType="fish"
              :data="fish"
            />
          </template>
          <PlatformBlock
            @click="playGame(fish.name, fish.code, fish.code)"
            dataType="fish"
            :data="fish"
          />
        </swiper-slide>

        <swiper-slide v-for="(poke, i) in poker" :key="i" :class="'poker-' + i">
          <template v-if="poke.code === 'KYDY' && poke.name === 'KY'">
            <PlatformBlock
              @click="playGame(poke.name, poke.code, 'ky_lobby')"
              dataType="poker"
              :data="poke"
            />
          </template>
          <PlatformBlock
            @click="playGame(poke.name, poke.code, poke.gameCode)"
            dataType="poker"
            :data="poke"
          />
        </swiper-slide>
        <swiper-slide
          v-for="(lotter, i) in lottery"
          :key="i"
          :class="'lottery-' + i"
        >
          <template v-if="lotter.code === 'SGWin' && lotter.name === 'SGWin'">
            <PlatformBlock
              @click="playGame(lotter.name, lotter.code, 'imlotto30000')"
              dataType="lottery"
              :data="lotter"
            />
          </template>
          <template
            v-else-if="lotter.code === 'BBINDY' && lotter.name === 'BBIN'"
          >
            <!--            <PlatformBlock-->
            <!--                @click="playGame(lotter.name, lotter.code, 'bbkeno_lobby_app')"-->
            <!--                dataType="lottery"-->
            <!--                :data="lotter"-->
            <!--            />-->
          </template>
          <template v-else>
            <PlatformBlock
              @click="playGame(lotter.name, lotter.code, lotter.gameCode)"
              dataType="lottery"
              :data="lotter"
            />
          </template>
        </swiper-slide>
        <swiper-slide style="opacity: 0"></swiper-slide>
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

  <q-dialog width="100%" v-model="isImportantAnnoucementModal">
    <q-card
      style="width: 90%; max-width: 500px; margin: 0 auto"
      class="text-white"
    >
      <q-card-section class="q-mb-md">
        <div class="close-alert" @click="setExpiryBanner()">
          <q-icon color="white" size="24px" name="close"></q-icon>
        </div>
        <div class="promo-banner-container">
          <div
            class="promo-banner-content"
            v-if="homePopupType === 'TEXT'"
            v-html="homePopupContent"
          ></div>
          <div class="promo-banner-img" v-else>
            <img :src="homePopupImg" class="alert-img" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, onMounted, ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
import { cached, TIME_EXPIRED } from "boot/cache";
import { useQuasar, Platform } from "quasar";
import { userStore } from "stores/index";
import GameModal from "components/modal/GameModal";
import MarqueeText from "vue-marquee-text-component";
import { RiVolumeUpLine } from "vue-remix-icons";
import { App } from "@capacitor/app";

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

import PlatformBlock from "components/platform/PlatformBlock.vue";
import { translateRecord } from "src/directives/translate";

export default defineComponent({
  name: "IndexPage",
  components: {
    Swiper,
    SwiperSlide,
    GameModal,
    MarqueeText,
    RiVolumeUpLine,
    PlatformBlock
  },
  setup() {
    const isFirstView = ref(false);
    const closeAlert = () => {
      localStorage.setItem("indexImgTop", new Date().getTime());
      isFirstView.value = false;
    };
    const thumbsSwiper = ref(null);
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
      // console.log(tab.name);
      var slideIndex = 0;
      if (tab.name === "live") {
        slideIndex = 0;
        firstSwiper.value?.slideTo(slideIndex, 500);
      }
      if (tab.name === "sport") {
        slideIndex = livecasino.value.length;

        firstSwiper.value?.slideTo(slideIndex, 500);
      }
      if (tab.name === "esport") {
        slideIndex = livecasino.value.length + sport.value.length;

        firstSwiper.value?.slideTo(slideIndex, 500);
      }
      if (tab.name === "slot") {
        slideIndex =
          livecasino.value.length + sport.value.length + esport.value.length;

        firstSwiper.value?.slideTo(slideIndex, 500);
      }
      if (tab.name === "fishing") {
        slideIndex =
          livecasino.value.length +
          sport.value.length +
          esport.value.length +
          slot.value.length;

        firstSwiper.value?.slideTo(slideIndex, 500);
      }
      if (tab.name === "poker") {
        slideIndex =
          livecasino.value.length +
          sport.value.length +
          esport.value.length +
          slot.value.length +
          fishing.value.length;

        firstSwiper.value?.slideTo(slideIndex, 500);
      }
      if (tab.name === "lottery") {
        slideIndex =
          livecasino.value.length +
          sport.value.length +
          esport.value.length +
          slot.value.length +
          fishing.value.length +
          poker.value.length;

        firstSwiper.value?.slideTo(slideIndex, 500);
      }
    };
    const onSlideChange = (swiper) => {
      // console.log("Swiping hEre")
      // Get the active slide index
      const activeIndex = swiper.activeIndex;

      // Get the active slide element
      const activeSlide = swiper.slides[activeIndex];

      // Get the class name of the active slide
      const activeSlideClassName = activeSlide.className;
      // Check if the class name contains "sport," "slot," or "esport"
      // Array of keywords to check
      const keywords = [
        "live",
        "sport",
        "esport",
        "slot",
        "fishing",
        "poker",
        "lottery"
      ];

      // Iterate over each keyword
      for (const keyword of keywords) {
        // Check if the class name contains the current keyword
        if (activeSlideClassName.includes(keyword)) {
          // console.log("select: "+ keyword);
          selectedTab.value = keyword;
        }
      }
    };
    const selectedTab = ref("live");
    const tabs = ref([
      {
        name: "live",
        icon: "live",
        label: "真人",
        labelact: "真人娱乐"
      },
      {
        name: "sport",
        icon: "sport",
        label: "体育",
        labelact: "体育赛事"
      },
      {
        name: "esport",
        icon: "esport",
        label: "电竞",
        labelact: "电竞赛事"
      },
      {
        name: "slot",
        icon: "slot",
        label: "电子",
        labelact: "电子"
      },
      {
        name: "fishing",
        icon: "fishing",
        label: "捕鱼",
        labelact: "捕鱼"
      },
      {
        name: "poker",
        icon: "poker",
        label: "棋牌",
        labelact: "棋牌游戏"
      }
    ]);
    // {
    //   name: "lottery",
    //       icon: "lottery",
    //     label: "彩票",
    //     labelact: "彩票游戏"
    // }
    const esport = ref([]);
    const sport = ref([]);
    const livecasino = ref([]);
    const poker = ref([]);
    const lottery = ref([]);
    const slot = ref([]);
    const fishing = ref([]);

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
      allGames.value.open(gameName, platformCode, gameCode, gameStatus);
    };

    const imgURL = process.env.IMAGE_CDN + "/promo/";

    // Pop out ads banner
    const isImportantAnnoucementModal = ref(false);
    const homePopupImg = ref("");
    const homePopupContent = ref("");
    const homePopupType = ref("");
    const homePopupId = ref(0);
    const homePopupFrequency = ref(0);
    const homePopupFrequencyNum = ref(0);

    const setExpiryBanner = () => {
      if (homePopupFrequencyNum.value !== 0) {
        setWithExpiry("isImpt", true, homePopupFrequencyNum.value);
      }
      isImportantAnnoucementModal.value = false;
    };

    const setWithExpiry = (key, value, interval) => {
      const now = new Date();
      const item = {
        value: value,
        expiry: now.getTime() + interval,
        id: homePopupId.value,
        frequency: homePopupFrequency.value
      };
      sessionStorage.setItem(key, JSON.stringify(item));
    };

    const getWithExpiry = (key) => {
      const itemStr = sessionStorage.getItem(key);
      if (!itemStr) {
        return null;
      }
      const item = JSON.parse(itemStr);
      const now = new Date();
      api
        .get("/member/ads-popout")
        .then((res) => {
          if (
            now.getTime() > item.expiry ||
            item.id !== res.data["id"] ||
            item.frequency !== res.data["frequency"]
          ) {
            sessionStorage.removeItem(key);
            isImportantAnnoucementModal.value = true;
            return null;
          }
        })
        .catch(() => {});
      return item.value;
    };

    const isImpt = getWithExpiry("isImpt");

    const checkShowImgTop = () => {
      const lastTime = sessionStorage.getItem("indexImgTop");
      if (lastTime) {
        const diff = new Date().getTime() - Number(lastTime);
        if (diff > 1000 * 60 * 60 * 12) {
          isFirstView.value = true;
        }
      } else {
        api
          .get("/member/ads-popout")
          .then((res) => {
            if (res.code === 0) {
              // if (res.data[id] !== null) {
                if (isImpt === null) {
                  switch (res.data["frequency"]) {
                    case "EVERYTIME":
                      homePopupFrequencyNum.value = 0;
                      break;
                    case "EVERYDAY":
                      homePopupFrequencyNum.value = 86400000; // 24hrs
                      break;
                    case "SESSION":
                      homePopupFrequencyNum.value = 7866432000; // 3months
                      break;
                    default:
                      homePopupFrequencyNum.value = 10000;
                      break;
                  }
                  isImportantAnnoucementModal.value = true;
                  homePopupImg.value = process.env.IMAGE_CDN + "/adspopout/" + res.data["mobileImgUrl"];
                  homePopupContent.value = res.data["content"];
                  homePopupType.value = res.data["type"];
                  homePopupId.value = res.data["id"];
                  homePopupFrequency.value = res.data["frequency"];
                  // if (homePopupImg.value) {
                  isFirstView.value = true;
                  // }
                }
              // } else {
                // isImportantAnnoucementModal.value = false;
              // }
            }
          })
          .catch(() => {});
      }
    };

    // const homePopupImg = ref("");
    // const checkShowImgTop = () => {
    //   const lastTime = localStorage.getItem("indexImgTop");
    //   if (lastTime) {
    //     const diff = new Date().getTime() - Number(lastTime);
    //     if (diff > 1000 * 60 * 60 * 12) {
    //       localStorage.removeItem("indexImgTop");
    //     }
    //   } else {
    //     api
    //       .get("/promo/banner?category=HOMEPOP")
    //       .then((res) => {
    //         if (res.code === 0) {
    //           homePopupImg.value =
    //             res.data.length > 0
    //               ? imgURL + res.data[0]["mobileImageUrl"]
    //               : "";
    //           if (homePopupImg.value) {
    //             isFirstView.value = true;
    //           }
    //         }
    //       })
    //       .catch(() => {});
    //   }
    // };

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

    var platformApiUrl = store.hasToken()
      ? "/session/loggedInPlatform"
      : "/platform";
    var platformApiKey = store.hasToken() ? "LOGGEDPLATFORMS" : "PLATFORMS";
    const getPlatList = () => {
      cached
        .get(platformApiKey, () =>
          api.get(platformApiUrl).then((res) => {
            return res;
          })
        )
        .then((data) => {
          var pf = data;
          ui.slotLists = [];
          pf.forEach((element) => {
            const platTypes = element.gameType.split(",");
            if (platTypes.indexOf("ESPORT") > -1) {
              var espObj = Object.assign({}, element);
              // console.log(espObj);

              if (espObj.code === "TFGaming") {
                espObj.title = "兴發电竞";
              }
              if (espObj.code === "IA") {
                espObj.title = "小艾电竞";
              }
              if (espObj.code === "IMES") {
                espObj.title = "IM电竞";
              }
              if (!espObj.title) {
                espObj.title = espObj.code + "电竞";
              }
              espObj.icon = "esport";
              espObj.subtitle = "电竞赛事";
              esport.value.push(espObj);
            }
            if (platTypes.indexOf("SPORT") > -1) {
              var spObj = Object.assign({}, element);
              if (spObj.code === "IM") {
                spObj.title = "IM体育";
              }
              if (spObj.code === "IA") {
                spObj.title = "小艾体育";
              }
              if (spObj.code === "PM") {
                spObj.title = "PM体育";
              }
              if (spObj.code === "CR") {
                spObj.title = "CR体育";
              }
              if (spObj.code === "SABA") {
                spObj.title = spObj.code + "体育";
              }
              spObj.icon = "sport";
              spObj.subtitle = "体育赛事";
              sport.value.push(spObj);
            }
            if (platTypes.indexOf("LIVE") > -1) {
              var liveObj = Object.assign({}, element);
              if (liveObj.code === "PMLIVE") {
                liveObj.title = "PM 真人";
              } else if (liveObj.code === "EBET") {
                liveObj.title = "WE 真人";
              } else {
                liveObj.title = liveObj.name + " 真人";
              }
              liveObj.icon = "live";
              liveObj.subtitle = "真人娱乐";
              livecasino.value.push(liveObj);
            }
            if (platTypes.indexOf("POKER") > -1) {
              var pokerObj = Object.assign({}, element);
              pokerObj.title = translateRecord(pokerObj.name);
              pokerObj.icon = "poker";
              pokerObj.subtitle = "棋牌娱乐";
              poker.value.push(pokerObj);
            }
            if (platTypes.indexOf("LOTTERY") > -1) {
              var lottObj = Object.assign({}, element);
              lottObj.title = lottObj.name + " 彩票";
              lottObj.icon = "lottery";
              lottObj.subtitle = "彩票游戏";
              lottery.value.push(lottObj);
            }
            if (platTypes.indexOf("SLOT") > -1) {
              // console.log(element)
              var slotObj = Object.assign({}, element);
              slotObj.title = translateRecord(slotObj.name) + " 电子";
              slotObj.icon = "slot";
              slotObj.subtitle = "电子游戏";
              // console.log(slotObj);
              if (slotObj.code === "AG") {
              } else {
                let slotItem = {
                  id: slotObj.id,
                  code: slotObj.code,
                  icon: slotObj.name
                };
                // console.log(slotItem);
                ui.slotLists.push(slotItem);
                slot.value.push(slotObj);
              }
            }
            if (platTypes.indexOf("FISH") > -1) {
              var fishObj = Object.assign({}, element);
              fishObj.title = fishObj.name + " 捕鱼";
              fishObj.icon = "fish";
              fishObj.subtitle = "捕鱼游戏";
              fishing.value.push(fishObj);
            }
          });
        })
        .catch((err) => {});
    };

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

    const changePage = (page, pageSize) => {
      gamePage.gameList = gameListData.value;
      // gamePage.gameList = gameListData.value.slice((page - 1) * pageSize, page * pageSize);
    };

    const isLoadingBalance = ref(false);
    const refreshBalance = () => {
      if (store.token) {
        isLoadingBalance.value = true;
        store.getBalance().then((res) => {
          isLoadingBalance.value = false;
        });
      }
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
        // alert(info.version);
        var current_version = parseInt(
          info.version.replaceAll(".", "") + info.build
        );
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

          // alert(latest_ver_no);
          // console.log(download_url.value);
          if (latest_ver_no > current_version) {
            isAppUpdateModal.value = true;
          }
        }
      }
    };

    const openDownloadPage = () => {
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

    const closeTopBox = () => {
      isH5.value = false;
      var btmSwiper = document.getElementById("btm-second-swiper");
      btmSwiper.classList.add("longer-swiper");
    };

    const downloadUrl = ref("");

    const getAppDownloadUrl = () => {
      api
        .get("/config/appDownloadUrl")
        .then((res) => {
          // console.log(res);
          downloadUrl.value = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    };

    onMounted(() => {
      getPlatList();
      loadData();
      loadAnnouncement();
      checkPlatform();
      getVersionNo();
      checkShowImgTop();
      getAppDownloadUrl();
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
      imgURL,
      banners,
      store,
      platforms,
      mainWallet,
      playGame,
      allGames,
      gamePage,
      selectedPlatId,
      searchList,
      liveTabs,
      selectedLiveTab,
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
      setSelectedSwiper,
      isFirstView,
      closeAlert,
      isAppUpdateModal,
      cancelUpdate,
      openDownloadPage,
      homePopupImg,
      refreshBalance,
      isLoadingBalance,
      closeTopBox,
      getAppDownloadUrl,
      downloadUrl,
      getWithExpiry,
      setWithExpiry,
      setExpiryBanner,
      homePopupContent,
      homePopupType,
      homePopupId,
      homePopupFrequency,
      homePopupFrequencyNum,
      isImpt,
      isImportantAnnoucementModal
    };
  }
});
</script>
<style scoped lang="scss">
.q-page-container {
  min-height: 100vh;
}

.secondSwiper {
  height: calc(100vh - 380px);
  padding-bottom: 0px;
  padding-top: 25px;
}

.longer-swiper {
  height: calc(100vh - 380px);
}

:deep(.q-mb-md) {
  margin-bottom: 0;
}

:deep(.secondSwiper .swiper-wrapper) {
  .swiper-slide {
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

:deep(.firstSwiper .swiper-wrapper) {
  background: #23263c;
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
        background: url("../assets/images/index/game_tab_active.png") no-repeat
          center center;
        background-size: cover;
        white-space: nowrap;
        padding: 8px 20px 2px;
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
  padding: 4px 10px;

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
      font-size: 0.7rem;
      line-height: 0.8rem;
      display: flex;
      flex-direction: column;
      color: #bacef1;

      .download-title {
        font-size: 0.8rem;
      }
    }

    .buttons {
      display: flex;
      gap: 5px;
    }

    .q-btn {
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
    white-space: nowrap;
  }

  .login {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 30px;
    text-decoration: none;
    color: #bacef1;

    .log {
      white-space: normal;
      word-break: keep-all;
    }

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
      background-image: linear-gradient(0deg, #1a1c28 0, #212534 100%),
        linear-gradient(#2d879c, #2d879c);
      border-radius: 6px;
      color: #bacef1;
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

.alert-image {
  width: 100%;
  margin: auto;
}

.close-alert {
  display: block;
  position: absolute;
  top: 6px;
  right: 10px;
  width: 28px;
  padding: 2px;
  height: 28px;
  z-index: 2;
  background: transparent;
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

.login.with-register {
  font-size: 14px;
  font-weight: bold;
}
</style>

<style lang="scss">
.q-card__section {
  background: rgba(0, 0, 0, 0.1);
}
.promo-banner-container {
  color: #ffffff;
  // background: salmon;
  .promo-banner-content {
    padding: 15px 15px;
    h3 {
      font-size: 20px;
      line-height: 0;
      padding: 20px 0 5px;
    }
  }
  .promo-banner-img {
    img {
      width: 100%;
      display: block;
    }
  }
}
</style>
