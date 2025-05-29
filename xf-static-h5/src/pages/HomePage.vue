<template>
  <div class="q-pa-md">
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
            <q-btn
              size="md"
              :href="`${downloadUrl}`"
              target="_blank"
              label="立即下载"
              color="brightbtn"
              class="top-btn"
              rounded
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="home-all-slider" v-scroll="onHomeScroll">
    <div class="q-px-md home-top-summary">
      <template v-if="bannerLoading">
        <q-skeleton style="height: 200px" />
      </template>
      <template v-else>
        <q-carousel
          class="home"
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
      </template>

      <div class="web-link-container">
        <span>
          易记网址
          <br />
          xfxf98.com
        </span>
      </div>
      <div class="midd">
        <div class="station-notice-wrapper">
          <div class="volume">
            <img src="../assets/images/index/icon-sound-fill.svg" />
          </div>
          <marquee-text :repeat="5" :duration="announcementList.length * 120">
            <div v-if="announcementList">
              <span v-for="(a, i) in announcementList" :key="i" @click="openPopup(a)">
                {{ a.content }}
              </span>
            </div>
          </marquee-text>
        </div>
      </div>

      <div class="welcome-bar">
        <div class="logo"><img src="../assets/logo.png" /></div>
        <div class="welcome-liner">欢迎您， {{ store.token ? store.nickName : "亲爱的用户" }}</div>
        <q-btn v-if="!store.token" to="/login" dense class="auth-btn btn-blue" rounded>登录</q-btn>
        <q-btn v-if="!store.token" to="/login?register" dense class="auth-btn btn-orange" rounded>注册</q-btn>

        <router-link v-if="store.token" to="/account" class="login">
          <div class="user-status">
            <q-avatar size="40px">
              <img src="../assets/images/account/profile-img.png" />
            </q-avatar>
            <div class="user-vip">{{ store.vip }}</div>
          </div>
        </router-link>
      </div>

      <div class="details-bar">
        <div class="message" @click="refreshBalance">
          <template v-if="store.token">
            <span>主钱包：</span>
            <div class="money-font">{{ !isLoadingBalance ? "¥" + mainWallet.toFixed(2) : "加载中..." }}</div>
          </template>
          <template v-else>
            <span>登录/注册后查看</span>
            {{ greetingMessage }}，您还未登录
          </template>
        </div>

        <div class="menulist">
          <router-link to="/finance/deposit?redirect=/" class="men">
            <img src="../assets/images/index/icon-deposit.png" />
            <div class="">存款</div>
          </router-link>
          <router-link to="/finance/withdraw?redirect=/" class="men">
            <img src="../assets/images/index/icon-withdraw.png" />
            <div class="">取款</div>
          </router-link>
          <router-link to="/account/transfer?redirect=/" class="men">
            <img src="../assets/images/index/icon-transfer.png" />
            <div class="">转账</div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- home header -->
    <div class="home-header-section" id="id-sticky-header">
      <GameTypeSwiper
        scroll-to-center
        :list="tabs"
        v-model="selectedTab"
        @swiper="setSecondSwiper"
        @select-swiper="setSelectedSwiper"
      />
    </div>

    <div class="q-px-md">
      <div ref="swiperContainerRef" class="swiper-container">
        <div class="index-platform-container">
          <!-- Main Swiper -> pass thumbs swiper instance -->
          <template v-if="platListLoading">
            <div class="home-game-boards">
              <div class="game-list-div">
                <div v-for="index in 9" :key="index">
                  <q-skeleton style="height: 170px" />
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="secondSwiper" id="btm-second-swiper">
              <div id="id-slot-slide" class="slot-slides home-swiper-slide">
                <div class="home-game-boards">
                  <h2>电子游戏</h2>
                  <div class="game-list-div">
                    <GameBoard
                      v-for="(item, i) in slot"
                      :key="i"
                      :title="item.title"
                      :name="item.name"
                      :code="item.code"
                      :icon="item.icon"
                      :underMaintenance="item.underMaintenance"
                      :maintenanceStartTime="item.maintenanceStartTime"
                      :maintenanceEndTime="item.maintenanceEndTime"
                      :link="`slot?platform=${item.code}`"
                    />
                  </div>
                </div>
              </div>

              <div id="id-live-slide" class="live-slides home-swiper-slide">
                <div class="home-game-boards">
                  <h2>真人娱乐</h2>
                  <div class="game-list-div">
                    <GameBoard
                      v-for="(item, i) in livecasino"
                      :key="i"
                      :title="item.title"
                      :name="item.name"
                      :code="item.code"
                      :icon="item.icon"
                      :underMaintenance="item.underMaintenance"
                      :maintenanceStartTime="item.maintenanceStartTime"
                      :maintenanceEndTime="item.maintenanceEndTime"
                      :link="''"
                      :onClick="
                        item.code === 'BBINDY' && item.name === 'BBIN'
                          ? () => playGame(item.name, item.code, 'bblive_lobby_app')
                          : () => playGame(item.name, item.code, item.gameCode)
                      "
                    />
                  </div>
                </div>
              </div>

              <div id="id-sport-slide" class="sport-slides home-swiper-slide">
                <div class="home-game-boards">
                  <h2>体育赛事</h2>
                  <div class="game-list-div">
                    <GameBoard
                      v-for="(item, i) in sport"
                      :key="i"
                      :title="item.title"
                      :name="item.name"
                      :code="item.code"
                      :icon="item.icon"
                      :underMaintenance="item.underMaintenance"
                      :maintenanceStartTime="item.maintenanceStartTime"
                      :maintenanceEndTime="item.maintenanceEndTime"
                      :link="''"
                      :onClick="() => playGame(item.name, item.code, item.gameCode)"
                    />
                  </div>
                </div>
              </div>
              <div id="id-poker-slide" class="poker-slides home-swiper-slide">
                <div class="home-game-boards">
                  <h2>棋牌游戏</h2>
                  <div class="game-list-div">
                    <GameBoard
                      v-for="(item, i) in poker"
                      :key="i"
                      :title="item.title"
                      :name="item.name"
                      :code="item.code"
                      :icon="item.icon"
                      :underMaintenance="item.underMaintenance"
                      :maintenanceStartTime="item.maintenanceStartTime"
                      :maintenanceEndTime="item.maintenanceEndTime"
                      :link="''"
                      :onclick="() => playGame(item.name, item.code, item.gameCode)"
                    />
                  </div>
                </div>
              </div>
              <div id="id-esport-slide" class="esport-slides home-swiper-slide">
                <div class="home-game-boards">
                  <h2>电竞赛事</h2>
                  <div class="game-list-div">
                    <GameBoard
                      v-for="(item, i) in esport"
                      :key="i"
                      :title="item.title"
                      :name="item.name"
                      :code="item.code"
                      :icon="item.icon"
                      :underMaintenance="item.underMaintenance"
                      :maintenanceStartTime="item.maintenanceStartTime"
                      :maintenanceEndTime="item.maintenanceEndTime"
                      :link="''"
                      :onClick="() => playGame(item.name, 'platformType', item.code)"
                    />
                  </div>
                </div>
              </div>
              <div id="id-casual-slide" class="casual-slides home-swiper-slide">
                <div class="home-game-boards">
                  <h2>小游戏</h2>
                  <div class="game-list-div">
                    <GameBoard
                      v-for="(item, i) in casuals"
                      :key="i"
                      :title="item.title"
                      :name="item.name"
                      :code="item.code"
                      :icon="item.icon"
                      :underMaintenance="item.underMaintenance"
                      :maintenanceStartTime="item.maintenanceStartTime"
                      :maintenanceEndTime="item.maintenanceEndTime"
                      :link="''"
                      :onClick="() => playGame(item.name, item.code, item.gameCode)"
                    />
                  </div>
                </div>
              </div>
              <div id="id-fish-slide" class="fish-slides home-swiper-slide">
                <div class="home-game-boards">
                  <h2>捕鱼游戏</h2>
                  <div class="game-list-div">
                    <GameBoard
                      v-for="(item, i) in fishing"
                      :key="i"
                      :title="item.title"
                      :name="item.name"
                      :code="item.code"
                      :icon="item.icon"
                      :underMaintenance="item.underMaintenance"
                      :maintenanceStartTime="item.maintenanceStartTime"
                      :maintenanceEndTime="item.maintenanceEndTime"
                      :link="''"
                      :onclick="
                        item.code === 'GPS' && item.name === 'GPS'
                          ? () => playGame(item.name, item.code, '7202')
                          : item.code === 'GAGFPS' && item.name === 'AGF'
                          ? () => playGame(item.name, item.code, '6')
                          : item.code === 'SG' && item.name === 'SG'
                          ? () => playGame(item.name, item.code, 'F-SF01')
                          : () => playGame(item.name, item.code, item.code)
                      "
                    />
                  </div>
                </div>
              </div>
              <div id="id-lottery-slide" class="lottery-slides home-swiper-slide">
                <div class="home-game-boards">
                  <h2>彩票游戏</h2>
                  <div class="game-list-div">
                    <GameBoard
                      v-for="(item, i) in lottery"
                      :key="i"
                      :title="item.title"
                      :name="item.name"
                      :code="item.code"
                      :icon="item.icon"
                      :underMaintenance="item.underMaintenance"
                      :maintenanceStartTime="item.maintenanceStartTime"
                      :maintenanceEndTime="item.maintenanceEndTime"
                      :link="''"
                      :onClick="() => playGame(item.name, item.code, item.gameCode)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
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
    :persistent="isOutdatedApp"
  >
    <div class="update-container">
      <div class="update-content">
        <span>发现新版本，请立即更新。</span>
        <span>若更新出现异常，请卸载后从下载 地址重新安装。</span>
        <div class="q-mt-lg">
          <span class="download-txt">下载地址:http://lh8888.app</span>
          <span class="download-txt q-ml-sm">点击下载</span>
        </div>
      </div>
      <div class="btn-group" :class="{ half: isOutdatedApp }">
        <q-btn v-if="!isOutdatedApp" size="md" label="取消" color="blueborderbtn" @click="cancelUpdate" />
        <q-btn size="md" label="立即下载" color="brightbtn" @click="openDownloadPage" />
      </div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="isStationNotice">
    <div style="width: 90%; min-height: 400px" class="bg-darkbox">
      <AnnouncementView />
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="isImportantAnnouncementModal" @update:model-value="setExpiryBanner()">
    <q-card flat style="width: 70%; max-width: 500px; background-color: transparent; margin: 0 auto" class="text-white">
      <q-card-section style="background-color: transparent">
        <div class="close-alert" @click="setExpiryBanner()">
          <q-icon size="24px" name="close"></q-icon>
        </div>
        <div class="promo-banner-container">
          <div class="promo-banner-content" v-if="homePopupType === 'TEXT'" v-html="homePopupContent"></div>
          <div class="promo-banner-img" @click="clickHomePopupImg(homePopupPath)" v-else>
            <img :src="homePopupImg" class="alert-img" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-page-sticky v-if="showDomain" position="bottom-right" :offset="domainPos" style="z-index: 999">
    <div class="rebates-absolute" :disable="draggingDomainFab" v-touch-pan.prevent.mouse="moveDomainFab">
      <q-btn class="close-btn" icon="close" flat round dense @click="hideDomain()"></q-btn>
      <q-carousel
        class="float"
        :navigation="floatDomain.length > 1 ? true : false"
        v-model="domainSlide"
        swipeable
        transition-next="slide-left"
        transition-prev="slide-right"
        animated
        infinite
        size="xs"
      >
        <q-carousel-slide v-for="(game, i) in floatDomain" :key="i" :name="i" @click="openLink(game.code)">
          <div class="rocket-wrapper">
            <div class="rocket">
              <img loading="lazy" style="width: 100px" :src="`${imgURLFloat}/promo/${game.icon}`" />
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </q-page-sticky>
  <q-page-sticky v-if="showFloatPromo" position="bottom-right" :offset="promoPos" style="z-index: 999">
    <div class="rebates-absolute" :disable="draggingPromoFab" v-touch-pan.prevent.mouse="movePromoFab">
      <q-btn class="close-btn" icon="close" flat round dense @click="hideFloatPromo()"></q-btn>
      <q-carousel
        class="float"
        :navigation="floatPromo.length > 1 ? true : false"
        v-model="promoSlide"
        swipeable
        transition-next="slide-left"
        transition-prev="slide-right"
        animated
        :keep-alive="false"
        autoplay
        :autoplay-interval="3000"
        infinite
        size="xs"
      >
        <q-carousel-slide v-for="(promo, i) in floatPromo" :key="i" :name="i" @click="gotoFloatPromo(promo.code)">
          <div class="rocket-wrapper">
            <div class="rocket">
              <img loading="lazy" style="width: 100px" :src="`${imgURLFloat}/promo/${promo.icon}`" />
              <span v-show="promo.showTime" class="promo-remaining-time">
                {{ floatPromoRemainingTime[i] }}
              </span>
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </q-page-sticky>
</template>

<script>
import { App } from "@capacitor/app";
import { useLocalStorage } from "@vueuse/core";
import { api } from "boot/axios";
import { cached } from "boot/cache";
import GameBoard from "components/home/GameBoard.vue";
import GameTypeSwiper from "components/home/GameTypeSwiper.vue";
import GameModal from "components/modal/GameModal";
import moment from "moment";
import AnnouncementView from "pages/account/AnnouncementView.vue";
import { Platform, useQuasar } from "quasar";
import { translateRecord } from "src/directives/translate";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";
import SwiperCore, { A11y, Controller, HashNavigation, Keyboard, Mousewheel, Scrollbar, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import MarqueeText from "vue-marquee-text-component";
import { useRoute, useRouter } from "vue-router";

SwiperCore.use([Keyboard, Mousewheel, A11y, HashNavigation]);

export default defineComponent({
  name: "IndexPage",
  components: {
    GameBoard,
    GameModal,
    MarqueeText,
    GameTypeSwiper,
    AnnouncementView
  },
  setup() {
    const isFirstView = ref(false);
    const thumbsSwiper = ref(null);
    const firstSwiper = ref(null);
    const secondSwiper = ref(null);
    const slotSwiper = ref(null);
    const slotSwiper2 = ref(null);

    const isShowBackTop = ref(false);
    const isShowDownload = ref(false);
    const isStickyGameType = ref(false);
    const scrollPosition = ref(0);
    const isZeroScrollPos = ref(true);
    const scrollSlotRef = ref();
    const scrollToTop = (el) => {
      window.scrollTo(0, 0, "smooth");
    };

    const isScrolling = ref(false);
    const swiperContainerRef = ref(null);
    const scrollToSlide = (slide_id) => {
      isScrolling.value = true;
      var slideItem = document.getElementById(slide_id);
      if (slideItem) {
        const positionY = slideItem.offsetTop;
        const topHeight = document.getElementById("id-sticky-header").offsetHeight;
        const parentOffset = swiperContainerRef.value.offsetTop ?? 0;
        let offset = isStickyGameType.value ? 0 : 60;
        const y_axis = positionY + parentOffset - topHeight - offset;

        window.scroll({
          top: y_axis,
          left: 0,
          behavior: "smooth"
        });
        setTimeout(() => {
          isScrolling.value = false;
        }, 1500);
      }
    };
    const onHomeScroll = (position) => {
      if (route.path === "/") {
        scrollPosition.value = position;
        if (position === 0) {
          isZeroScrollPos.value = true;
        } else {
          isZeroScrollPos.value = false;
        }

        if (position > 55) {
          isShowDownload.value = false;
        } else {
          isShowDownload.value = true;
        }

        if (position > 430) {
          isStickyGameType.value = true;
        } else {
          isStickyGameType.value = false;
        }

        if (position > 450) {
          isShowBackTop.value = true;
        } else {
          isShowBackTop.value = false;
        }

        const minScrollTop = swiperContainerRef.value.offsetTop;
        if (!isScrolling.value && position > minScrollTop) {
          const stickyHeight = document.getElementById("id-sticky-header").offsetHeight;

          const slotSlide = document.getElementById("id-slot-slide");
          const liveSlide = document.getElementById("id-live-slide");
          const sportSlide = document.getElementById("id-sport-slide");
          const esportSlide = document.getElementById("id-esport-slide");
          const fishSlide = document.getElementById("id-fish-slide");
          const pokerSlide = document.getElementById("id-poker-slide");
          const lotterySlide = document.getElementById("id-lottery-slide");
          const casualSlide = document.getElementById("id-casual-slide");

          const slotTop = slotSlide.getBoundingClientRect().top;
          const liveTop = liveSlide.getBoundingClientRect().top;
          const sportTop = sportSlide.getBoundingClientRect().top;
          const esportTop = esportSlide.getBoundingClientRect().top;
          const fishTop = fishSlide.getBoundingClientRect().top;
          const pokerTop = pokerSlide.getBoundingClientRect().top;
          const lotteryTop = lotterySlide.getBoundingClientRect().top;
          const casualTop = casualSlide.getBoundingClientRect().top;

          if (lotteryTop <= stickyHeight) {
            selectedTab.value = "lottery";
          } else if (fishTop <= stickyHeight) {
            selectedTab.value = "fishing";
          } else if (casualTop <= stickyHeight) {
            selectedTab.value = "casual";
          } else if (esportTop <= stickyHeight) {
            selectedTab.value = "esport";
          } else if (pokerTop <= stickyHeight) {
            selectedTab.value = "poker";
          } else if (sportTop <= stickyHeight) {
            selectedTab.value = "sport";
          } else if (liveTop <= stickyHeight) {
            selectedTab.value = "live";
          } else if (slotTop <= stickyHeight) {
            selectedTab.value = "slot";
          }
        }
      }
    };

    const setFirstSwiper = (swiper) => {
      firstSwiper.value = swiper;
    };
    const setSecondSwiper = (swiper) => {
      secondSwiper.value = swiper;
    };
    const setSlotSwiper = (swiper) => {
      slotSwiper.value = swiper;
    };
    const setSlotSwiper2 = (swiper) => {
      slotSwiper2.value = swiper;
    };
    const setSelectedSwiper = (tab) => {
      var slideIndex = 0;
      if (tab.name === "slot") {
        scrollToSlide("id-slot-slide");
      }

      if (tab.name === "live") {
        scrollToSlide("id-live-slide");
      }
      if (tab.name === "sport") {
        scrollToSlide("id-sport-slide");
      }
      if (tab.name === "esport") {
        scrollToSlide("id-esport-slide");
      }

      if (tab.name === "fishing") {
        scrollToSlide("id-fish-slide");
      }
      if (tab.name === "poker") {
        scrollToSlide("id-poker-slide");
      }
      if (tab.name === "casual") {
        scrollToSlide("id-casual-slide");
      }
      if (tab.name === "lottery") {
        scrollToSlide("id-lottery-slide");
        // window.scrollTo(0, 0);
      }
    };

    const onSlideChange = (swiper) => {
      const activeIndex = swiper.activeIndex;
      const activeSlide = swiper.slides[activeIndex];
      const activeSlideClassName = activeSlide.className;
      const keywords = ["slot", "live", "sport", "esport", "fishing", "poker", "lottery", "casual"];
      for (const keyword of keywords) {
        if (activeSlideClassName.includes(keyword)) {
          selectedTab.value = keyword;
        }
      }
    };
    const selectedTab = ref("slot");
    const tabs = ref([
      {
        name: "slot",
        icon: "slot",
        label: "电子",
        labelact: "电子"
      },
      {
        name: "live",
        icon: "live",
        label: "真人",
        labelact: "真人"
      },
      {
        name: "sport",
        icon: "sport",
        label: "体育",
        labelact: "体育"
      },
      {
        name: "poker",
        icon: "poker",
        label: "棋牌",
        labelact: "棋牌"
      },
      {
        name: "esport",
        icon: "esport",
        label: "电竞",
        labelact: "电竞"
      },
      {
        name: "casual",
        icon: "casual",
        label: "小游戏",
        labelact: "小游戏"
      },
      {
        name: "fishing",
        icon: "fishing",
        label: "捕鱼",
        labelact: "捕鱼"
      },
      {
        name: "lottery",
        icon: "lottery",
        label: "彩票",
        labelact: "彩票"
      }
    ]);

    const esport = ref([]);
    const sport = ref([]);
    const livecasino = ref([]);
    const poker = ref([]);
    const lottery = ref([]);
    const slot = ref([]);
    const fishing = ref([]);
    const casuals = ref([]);

    const slot_odds = computed(() => {
      var filtered = slot.value.filter(function (element, index, array) {
        return index % 2 === 0;
      });
      return filtered;
    });
    const slot_evens = computed(() => {
      var filtered = slot.value.filter(function (element, index, array) {
        return index % 2 === 1;
      });
      return filtered;
    });

    const ui = useUI();
    const scrollPageRef = ref(null);
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
      // console.log(gameName);
      // console.log(platformCode);
      // console.log(gameCode);
      // console.log(gameStatus);

      allGames.value.open(gameName, platformCode, gameCode, gameStatus);
    };

    const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";

    // Pop out ads banner
    const isImportantAnnouncementModal = ref(false);
    const homePopupImg = ref("");
    const homePopupContent = ref("");
    const homePopupType = ref("");
    const homePopupPath = ref("");
    const homePopupId = ref(0);
    const homePopupFrequency = ref(0);
    const homePopupFrequencyNum = ref(0);

    const setExpiryBanner = () => {
      if (homePopupFrequencyNum.value !== 0) {
        setWithExpiry("isImpt", true, homePopupFrequencyNum.value);
      }
      isImportantAnnouncementModal.value = false;
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
      if (now.getTime() > item.expiry) {
        sessionStorage.removeItem(key);
        return null;
      }
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
                isImportantAnnouncementModal.value = true;
                homePopupImg.value =
                  useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/" + res.data["mobileImgUrl"];
                homePopupContent.value = res.data["content"];
                homePopupType.value = res.data["type"];
                homePopupPath.value = res.data["path"];
                homePopupId.value = res.data["id"];
                homePopupFrequency.value = res.data["frequency"];
                // if (homePopupImg.value) {
                isFirstView.value = true;
                // }
              }
              // } else {
              // isImportantAnnouncementModal.value = false;
              // }
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    };

    const clickHomePopupImg = (urlString) => {
      // debugger;
      const openPattern = /^\/open\/(.*)/;
      if (urlString.match(openPattern)) {
        const extractedUrl = urlString.match(openPattern)[1];
        const [gameName, platformCode, gameCode] = extractedUrl.split("/");
        // /open/FB体育/FB/XXXX-123/OPEN

        allGames.value.open(gameName, platformCode, gameCode, "OPEN");
        return;
      }

      let regexUrl = new RegExp(/^(https:\/\/)/g);
      if (regexUrl.test(urlString)) {
        // 跳轉
        location.href = urlString;
        return;
      }
      let regexName = new RegExp(/^(name|\?name)/g);
      if (regexName.test(urlString)) {
        //去優惠
        router.push(`/promo${urlString}`);
        return;
      }

      router.push(`/promo?name=${urlString}`);
    };

    const bannerLoading = ref(false);

    function loadData() {
      bannerLoading.value = true;
      api
        .get("/opt-session/promo/banner?category=HOME")
        .then((res) => {
          if (res.code === 0) {
            // banners.value = res.data;
            banners.value = res.data.filter(item => {
              if (isH5.value) return item.showH5;
              if (!isH5.value) return item.showApp;
              return item.showH5; // For WEB or fallback
            });
            setTimeout(() => {
              bannerLoading.value = false;
            }, 500);
          }
        })
        .finally(() => {
          setTimeout(() => {
            bannerLoading.value = false;
          }, 500);
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

    var platformApiUrl = store.hasToken() ? "/session/loggedInPlatform" : "/platform";
    var platformApiKey = store.hasToken() ? "LOGGEDPLATFORMS" : "PLATFORMS";

    const platListLoading = ref(false);

    const getPlatList = () => {
      platListLoading.value = true;

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
              if (espObj.code === "TFGaming") {
                espObj.title = "兴發电竞";
              }
              if (espObj.code === "IA") {
                espObj.title = "小艾电竞";
              } else {
                espObj.title = getAliasName(element, "ESPORT");
              }
              // if (espObj.code === "IMES") {
              //   espObj.title = "IM电竞";
              // }
              // if (!espObj.title) {
              //   espObj.title = espObj.code + "电竞";
              // }
              espObj.icon = "esport";
              espObj.subtitle = "电竞赛事";
              esport.value.push(espObj);

              //Add 1 More Casual minigame.
              var casualObj = Object.assign({}, element);
              casualObj.gameCode = "casual";
              if (casualObj.code === "TFGaming") {
                casualObj.title = casualObj.alias.split("、")[1];
              } else {
                // casualObj.title = casualObj.name + " 小游戏";
                casualObj.title = getAliasName(element, "CASUAL");
              }
              casualObj.icon = "casual";
              casualObj.subtitle = "小游戏";
              casuals.value.push(casualObj);
            }
            if (platTypes.indexOf("SPORT") > -1) {
              var spObj = Object.assign({}, element);
              // if (spObj.code === "IM") {
              //   spObj.title = "IM体育";
              // }
              // if (spObj.code === "IA") {
              //   spObj.title = "小艾体育";
              // }
              // if (spObj.code === "PM") {
              //   spObj.title = "熊猫体育";
              // }
              // if (spObj.code === "CR") {
              //   spObj.title = "CR体育";
              // }
              // if (spObj.code === "SABA") {
              //   spObj.title = spObj.code + "体育";
              // }
              spObj.title = getAliasName(element, "SPORT");
              spObj.icon = "sport";
              spObj.subtitle = "体育赛事";
              sport.value.push(spObj);
            }
            if (platTypes.indexOf("LIVE") > -1) {
              var liveObj = Object.assign({}, element);
              // if (liveObj.code === "PMLIVE") {
              //   liveObj.title = "DB 真人";
              // } else if (liveObj.code === "EBET") {
              //   liveObj.title = "WE 真人";
              // } else if (liveObj.code === "AG") {
              //   liveObj.alias = "PA 真人";
              //   liveObj.title = "PA 真人";
              // } else {
              //   liveObj.title = liveObj.name + " 真人";
              // }
              liveObj.title = getAliasName(element, "LIVE");
              liveObj.icon = "live";
              liveObj.subtitle = "真人娱乐";
              livecasino.value.push(liveObj);
            }
            if (platTypes.indexOf("SLOT") > -1) {
              // console.log(element)
              var slotObj = Object.assign({}, element);
              // slotObj.title = translateRecord(slotObj.name) + " 电子";
              slotObj.title = getAliasName(element, "SLOT");
              slotObj.icon = "slot";
              slotObj.subtitle = "电子游戏";
              // console.log(slotObj);
              if (slotObj.code === "AG") {
                // slotObj.title = "PA 电子";
                // slotObj.alias = "PA电子";
                slotObj.name = "xin";
                let slotItem = {
                  id: slotObj.id,
                  code: slotObj.code,
                  icon: slotObj.name
                };
                // console.log(slotItem);
                ui.slotLists.push(slotItem);
                slot.value.push(slotObj);
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
              // fishObj.title = fishObj.name + " 捕鱼";
              fishObj.title = getAliasName(element, "FISH");
              fishObj.icon = "fish";
              fishObj.subtitle = "捕鱼游戏";
              // if (fishObj.code === "AGF") {
              //   fishObj.alias = "PA 捕鱼";
              //   fishObj.title = "PA 捕鱼";
              // }
              fishing.value.push(fishObj);
              // console.log(fishObj);
            }
            if (platTypes.indexOf("POKER") > -1) {
              var pokerObj = Object.assign({}, element);
              // pokerObj.title = translateRecord(pokerObj.name);

              pokerObj.title = getAliasName(element, "POKER");
              pokerObj.icon = "poker";
              pokerObj.subtitle = "棋牌娱乐";
              poker.value.push(pokerObj);
            }
            if (platTypes.indexOf("LOTTERY") > -1) {
              var lottObj = Object.assign({}, element);
              // lottObj.title = lottObj.name + " 彩票";
              lottObj.title = getAliasName(element, "LOTTERY");
              lottObj.icon = "lottery";
              lottObj.subtitle = "彩票游戏";
              //HArdCode hid BBIN
              if (lottObj.code !== "BBINDY") {
                lottery.value.push(lottObj);
              }
            }
          });
        })
        .catch((err) => {})
        .finally(() => {
          setTimeout(() => {
            platListLoading.value = false;
          }, 500);
        });
    };

    const getAliasName = (plat, platformType) => {
      if (plat.alias?.includes("、")) {
        const aliass = plat.alias.split("、");
        const gameTypes = plat.gameType.split(",");
        const itemIndex = gameTypes.indexOf(platformType);

        return itemIndex && aliass[itemIndex] ? aliass[itemIndex] : aliass[0];
      }
      return plat.alias;
    };

    const liveTabs = ref("");
    const searchList = () => {
      if (gamePage.searchKey) {
        gamePage.gameList = gameListData.value.filter((game) => {
          return game.name.toLowerCase().includes(gamePage.searchKey.toLowerCase());
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
      if (banner.redirectUrl == "app://deposit") {
        router.push("/finance/deposit");
      } else {
        const redirectU = "/promo?name=" + banner.redirectUrl;
        router.push(`${redirectU}`);
      }
    };

    const download_url = ref("");
    const isAppUpdateModal = ref(false);
    const isOutdatedApp = ref(false);
    const getVersionNo = async () => {
      if (Platform.is.android && Platform.is.capacitor) {
        const info = await App.getInfo();
        var current_version = parseInt(info.version.replaceAll(".", ""));
        const appType = "ALL";
        const device = Platform.is.android ? "ANDROID" : "IOS";
        const res = await api.get(`/config/appVersionAndUrl?type=${appType}&device=${device}`);
        var min_version = res.data.minVersion;
        // console.log(res);
        if (res.code === 0) {
          var version_info = res.data.version;
          var latest_ver_no = parseInt(version_info.replaceAll(".", ""));
          download_url.value = res.data.url;
          if (latest_ver_no > current_version) {
            isAppUpdateModal.value = true;
          }
          if (min_version) {
            var min_ver_no = parseInt(min_version.replaceAll(".", ""));
            if (min_ver_no > current_version) {
              isOutdatedApp.value = true;
            }
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
          downloadUrl.value = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const greetingMessage = computed(() => {
      const now = new Date();
      const hours = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Shanghai" })).getHours();
      return hours >= 12 ? "下午好" : "早上好";
    });




    const floatPromoRemainingTime = ref([]);
    const showFloatPromo = ref(false);
    const showDomain = ref(false);
    const floatPromo = ref([]);
    const gamePromo = ref([]);
    const domainPos = ref([18, 258]);
    const promoPos = ref([18, 128]);
    const floatDomain = ref([]);
    const currentPromo = ref(null);
    const currentPromoIndex = ref(0);
    const draggingDomainFab = ref(false);
    const draggingPromoFab = ref(false);
    const imgURLFloat = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value;

    const moveDomainFab = (ev) => {
      // console.log(ev);
      const maxX = window.innerWidth - 70;
      const maxY = window.innerHeight - 70;
      draggingDomainFab.value = ev.isFirst !== true && ev.isFinal !== true;
      let newX = domainPos.value[0] - ev.delta.x;
      let newY = domainPos.value[1] - ev.delta.y;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      domainPos.value = [newX, newY];
    };
    const movePromoFab = (ev) => {
      const maxX = window.innerWidth - 70;
      const maxY = window.innerHeight - 70;
      draggingPromoFab.value = ev.isFirst !== true && ev.isFinal !== true;
      let newX = promoPos.value[0] - ev.delta.x;
      let newY = promoPos.value[1] - ev.delta.y;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      promoPos.value = [newX, newY];
    };

    const hideDomain = () => {
      showDomain.value = false;
      promoPos.value = [18, 18];
    };

    const hideFloatPromo = () => {
      showFloatPromo.value = false;

      domainPos.value = [18, 18];
    };

    const checkFloatPromo = () => {
      // if (store.memberType === "TEST" || store.memberType === "PROMO_TEST") {
      //   showFloatPromo.value = true;
      // }
      if (gamePromo.value.length === 0) {
        promoPos.value = [18, 18];
      }
    };

    const updatePromo = () => {
      currentPromo.value = floatPromo.value[currentPromoIndex.value];
      currentPromoIndex.value = ((currentPromoIndex.value + 1) % floatPromo.value.length) + 1 - 1;
    };

    const initFloating = () => {
      floatPromo.value = [];
      gamePromo.value = [];
      floatDomain.value = [];
      const apiUrl = store.hasToken() ? "/session/loggedInRedirect" : "/redirect";
      api
        .get(apiUrl)
        .then((res) => {
          if (res.code === 0) {
            res.data.forEach((element) => {
              if (element.type === "PROMO") {
                floatPromo.value.push(element);
                showFloatPromo.value = true;
              }
              if (element.type === "GAME") {
                gamePromo.value.push(element);
              }
              if (element.type === "DOMAIN") {
                floatDomain.value.push(element);
                showDomain.value = true;
              }
            });
            checkFloatPromo();
            updatePromo();
            updatePromoRemainingTime();
            setInterval(updatePromoRemainingTime, 1000);
          } else {
            ElMessage.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const updatePromoRemainingTime = () => {
      floatPromoRemainingTime.value = floatPromo.value.map((promo) => {
        let result = "00:00:00";

        if (promo?.showTime) {
          const now = moment(Date.now());
          const endTime = moment(promo?.endTime);
          const totalSeconds = endTime.diff(now, "seconds");
          if (totalSeconds > 0) {
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            result = `${`${hours}`.padStart(2, 0)}:${`${minutes}`.padStart(2, 0)}:${`${seconds}`.padStart(2, 0)}`;
          }
        }
        return result;
      });
    };

    const gotoFloatPromo = (code) => {
      router.push(`/promo?name=${code}`);
    };

    onMounted(() => {
      getPlatList();
      loadAnnouncement();
      checkPlatform();
      loadData();
      getVersionNo();
      if (store.token && store.memberType === "TEST") {
        checkShowImgTop();
      }

      if (sessionStorage.getItem("regSuccessGuideVisible")) {
        store.regSuccessGuideVisible = true;
        sessionStorage.removeItem("regSuccessGuideVisible");
      }

      getAppDownloadUrl();

      setTimeout(() => {
        initFloating();
      }, 750);
    });
    const imageLoading = ref(false);
    const selectedLiveTab = ref();

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
      casuals,
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
      setSlotSwiper,
      setSlotSwiper2,
      setSelectedSwiper,
      isFirstView,
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
      homePopupPath,
      isImpt,
      isImportantAnnouncementModal,
      clickHomePopupImg,
      slot_odds,
      slot_evens,
      isStickyGameType,
      isShowBackTop,
      isShowDownload,
      slotSwiper,
      slotSwiper2,
      moment,
      onHomeScroll,
      scrollPosition,
      isZeroScrollPos,
      scrollSlotRef,
      scrollToTop,
      isScrolling,
      swiperContainerRef,
      scrollToSlide,
      isOutdatedApp,
      platListLoading,
      bannerLoading,
      greetingMessage,
      floatPromoRemainingTime,
      showFloatPromo,
      showDomain,
      floatPromo,
      gamePromo,
      domainPos,
      promoPos,
      floatDomain,
      currentPromo,
      currentPromoIndex,
      draggingDomainFab,
      draggingPromoFab,
      domainSlide: ref(0),
      promoSlide: ref(0),
      imgURLFloat,
      hideDomain,
      hideFloatPromo,
      movePromoFab,
      moveDomainFab,
      gotoFloatPromo
    };
  }
});
</script>

<style scoped lang="scss">
.q-page-container {
  min-height: 100vh;
}

.secondSwiper {
  padding-bottom: 50px;
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
        background: url("../assets/images/index/game_tab_active.png") no-repeat center center;
        background-size: cover;
        white-space: nowrap;
        padding: 8px 20px 2px;
      }
    }
  }
}

.modal-update-div {
  .update-container {
    position: relative;
    background: url("../assets/images/index/update-bg.png") no-repeat center center;
    overflow: hidden;
    width: 80%;
    max-width: 360px;
    min-width: 290px;
    background-size: 100% 100%;
    aspect-ratio: 4/5;
    display: flex;
    flex-direction: column;
    padding: 0 24px 24px 24px;
    align-items: center;
    .update-content {
      font-family: PingFang SC;
      font-weight: 600;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-top: calc(50% + 24px);
      > span {
        font-size: 16px;
      }
      .download-txt {
        color: #01bfd8;
        font-size: 12px;
      }
    }
    .btn-group {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      width: 100%;
      > button {
        flex: 1;
      }
      &.half {
        width: 50%;
      }
    }
  }
}

.download-top-container {
  padding: 4px 0px;

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
  }
}

.home-top-summary {
  position: relative;
}

.web-link-container {
  border-radius: 4px;
  box-shadow: 0px 0px 4px 0px #ffffff inset, 0px 4px 3.5px 0px #00000094;
  background: linear-gradient(180deg, #00c7c0 0%, #0996c7 100%);
  color: #160850;
  width: fit-content;
  padding: 4px 10px;
  font-weight: 600;
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  position: absolute;
  right: 30px;
  top: 48vw;
  transform: translateY(-50%);
  @media (min-width: 480px) {
    top: 230px;
  }
}

.midd {
  position: relative;
  border-radius: 15px 15px 0 0;
  overflow: hidden;
  margin-top: 10px;

  .station-notice-wrapper {
    display: flex;
    gap: 10px;
    padding: 8px 0px;
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
      color: #a1a8cb;
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
  padding: 10px 12px;
  gap: 12px;
  background-color: #2a395a;
  // height: 35px;
  border-radius: 8px;
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
    font-size: 14px;
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
  gap: 16px;
  // background-color: #1a1c28;
  // padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0 0;
  // height: 75px;

  .message {
    flex: 1;
    color: #ffffff;
    font-size: 14px;
    white-space: nowrap;

    span {
      display: block;
      color: #a1a8cb;
    }

    .money-font {
      font-size: 18px;
      line-height: 1;
      font-weight: 600;
      margin-top: 4px;
    }
  }

  .menulist {
    flex: 4;
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .men {
      text-decoration: none;
      color: #00bfd7;
      gap: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      white-space: nowrap;

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
    background: transparent;
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

.alert-image {
  width: 100%;
  margin: auto;
}

.close-alert {
  display: block;
  position: absolute;
  top: 7px;
  right: 7px;
  width: 28px;
  padding: 2px;
  height: 28px;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  color: #222a34 !important;
  // background: transparent;
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

  .promo-banner-content {
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

.auth-btn {
  padding-left: 12px;
  padding-right: 12px;
  // border-radius: 6px;
  box-shadow: 0px 2px 4px 0px #ffffff inset;
  color: #ffffff;
  white-space: nowrap;

  &:after {
    content: "";
    background: radial-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2), transparent);
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40%;
    height: 3px;
    position: absolute;
  }

  &.btn-blue {
    background: linear-gradient(180deg, #00c7c0 0%, #0996c7 100%);
  }

  &.btn-orange {
    background: linear-gradient(180deg, #ff9d34 0%, #c76700 100%);
  }
}

.home-game-boards {
  // padding-top: 16px;
  h2 {
    //margin-top: 15px;
    //margin-bottom: 15px;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: 1px;
    font-size: 14px;
  }

  .game-list-div {
    display: grid;
    column-gap: 16px;
    row-gap: 10px;
    grid-template-columns: repeat(3, 1fr);

    .game-item-div {
      &.maintenance-on {
        pointer-events: none;

        .game-platform-img img,
        .game-btn {
          filter: grayscale(100%);
        }
      }

      &.slot-item {
        width: 100%;
      }

      .game-board {
        position: relative;
        width: 100%;
        display: flex;

        .game-img {
          img {
            width: 100%;
            display: block;
          }
        }

        .game-platform-img {
          img {
            width: 120%;
            display: block;
            position: absolute;
            top: -10%;
            left: -10%;
          }
        }

        .game-title {
          position: absolute;
          bottom: 8px;
          backdrop-filter: blur(20px);
          background: rgba(0, 0, 0, 0.2);
          width: calc(100% - 16px);
          border-radius: 8px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 8px 4px;

          h3 {
            font-size: 14px;
            color: #fff;
            text-align: center;
            font-weight: 500;
            letter-spacing: 1px;
            line-height: 1;
            margin: 0;
            padding: 0;
            white-space: nowrap;

            &.small-size {
              font-size: 70%;
            }
          }

          .game-title-logo {
            padding-top: 6px;
            margin: 4px 0;
            img {
              display: block;
              width: auto;
              height: 100%;
              max-height: 16px;
            }
          }

          .game-btn {
            background: linear-gradient(180deg, #00bfd7 0%, #0184ba 100%);
            // border-radius: 6px;
            color: #ffffff;
            padding: 2px 4px;
            line-height: 1;
            width: calc(100% - 12px);
            // max-width: 86px;
            margin: 2px 6px 0px;
            font-size: 12px;
          }
        }

        .maintenance-box {
          position: absolute;
          top: 0;
          padding-top: 15px;
          padding-bottom: 15px;
          color: #ffffff;
          font-size: 22px;
          font-weight: bold;
          z-index: 33;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
          width: 100%;
          height: 100%;
          border-radius: 3vw;
          background: rgba(2, 9, 73, 0.4);
          text-align: center;

          p {
            margin-top: 0px;
            margin-bottom: 0px;
          }

          .small-size {
            font-size: 12px;
          }
        }

        // .game-bg {
        //   background-size: contain;
        //   aspect-ratio: 573/709;
        //   background-repeat: no-repeat;
        // }

        span {
          font-size: 12px;
          font-weight: 300;
          color: #fff;
          text-align: center;
          // margin-bottom: 5px;
          width: 100%;
          letter-spacing: 1px;
        }

        &:hover {
          filter: brightness(1.05);
        }

        &:active {
          filter: brightness(1.15);
          transform: translate(1px, 1px);
        }
      }
    }
  }
}

.home-header-section {
  position: sticky;
  top: 0;
  z-index: 99;
  padding: 16px;
  background: #1a2338;

  &.fixed-header {
    position: fixed;
    top: 0;
    width: 100%;
    margin: 0 auto;
    left: 0;
    z-index: 99;
  }
}

.user-status {
  display: flex;
  align-items: center;

  .user-vip {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 12px 4px 20px;
    background: linear-gradient(180deg, #00c7c0 0%, #0996c7 100%);
    box-shadow: 0px 0px 4px 0px #ffffff inset;
    color: #ffffff;
    border-radius: 16px;
    font-size: 12px;
    margin-left: -16px;
  }
}

// rocket animation
.rebates-absolute {
  display: flex;
  justify-content: center;
  align-items: center;

  .q-carousel {
    height: unset !important;
    background-color: transparent !important;
  }
}

.close-btn {
  width: 14px;
  min-width: 14px;
  height: 14px;
  min-height: 14px;
  border-radius: 50%;
  border: 1px solid #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  font-size: 6px;
  font-weight: bold;
  margin-left: 24px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 400;
}

.rocket-wrapper {
  position: relative;
  transition: all 0.3s;
  // cursor: pointer;

  img {
    width: 105px;
    pointer-events: none;
  }

  &:hover {
    filter: brightness(0.9);
  }
  .promo-remaining-time {
    position: absolute;
    bottom: 17px;
    left: 50%;
    transform: translateX(-50%);
    font-weight: bold;
    font-family: Arial;
    color: #444;
    // text-shadow: 2px 2px 0px #00000040;
    font-size: 14px;
  }
}
</style>
