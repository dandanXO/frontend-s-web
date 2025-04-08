<template>
  <ProfileSummary :homeProfile="true" @activateSlide="handleActivateSlide" />

  <q-carousel
    v-model="slide"
    id="home"
    class="home"
    data-aos-duration="1200"
    data-aos-once="true"
    data-aos="fade-in"
    transition-next="slide-left"
    transition-prev="slide-right"
    animated
    autoplay
    infinite
    navigation
    swipeable
  >
    <q-carousel-slide
      v-for="(banner, i) in banners"
      :key="i"
      :name="i"
      class="column no-wrap flex-center"
      :img-src="returnBannerUrl(banner)"
      @click="gotoPromo(banner)"
    ></q-carousel-slide>

    <!-- :img-src="require(`../assets/images/index/${banner.mobileImageUrl}`)" -->

    <template v-slot:navigation-icon="{ active, onClick }">
      <q-btn
        v-if="active"
        size="xs"
        @click="onClick"
        style="
          border-radius: 8px;
          margin: 6px 3px;
          height: 3px;
          min-height: 3px;
          width: 33px;
          padding: 0;
          background-color: #4e97fa;
        "
      />
      <q-btn
        v-else
        size="xs"
        @click="onClick"
        style="
          border-radius: 8px;
          margin: 6px 3px;
          height: 3px;
          min-height: 3px;
          width: 33px;
          padding: 0;
          background-color: rgba(255, 255, 255, 0.2);
        "
      />
    </template>
  </q-carousel>

  <div class="home-wrapper" :class="detectAndroidVersion()">
    <q-page-sticky position="bottom-right" :offset="csDragPos" class="floating-btn">
      <div v-touch-pan.prevent.mouse="moveCsIcon" ref="csTabRef" @click="toggleCSTab">
        <div class="cs-icon-wrapper" :class="{ active: isCsTabVisible }">
          <a class="cs-icon youtube" :href="ui.youtubeUrl" target="_blank">
            <img src="../assets/images/index/youtube-icon.png" />
          </a>
          <a class="cs-icon instagram" :href="ui.instagramUrl" target="_blank">
            <img src="../assets/images/index/insta-icon.png" />
          </a>
          <!--          <a class="cs-icon tiktok" href="https://www.tiktok.com/@b9game" target="_blank">-->
          <!--            <img src="../assets/images/index/cs-tiktok.png" />-->
          <!--          </a>-->
          <a class="cs-icon whatsapp" :href="ui.whatsappUrl" target="_blank">
            <img src="../assets/images/index/cs-whatsapp.png" />
          </a>
          <a class="cs-icon cs" :href="ui.CSAUrl" target="_blank">
            <img src="../assets/images/index/cs-cs.png" />
          </a>
        </div>
      </div>
    </q-page-sticky>

    <q-page-sticky position="bottom-right" :offset="liveDragPos" class="floating-btn" v-if="isLiveUrlShow">
      <div v-touch-pan.prevent.mouse="moveLiveIcon" @click="openLiveInNewTab(ui.LiveUrl)">
        <div class="live-icon-wrapper"></div>
      </div>
    </q-page-sticky>

    <q-page-sticky position="bottom-left" :offset="hbDragPos" class="floating-btn" v-if="isHbShow">
      <div>
        <div class="hb-close">
          <q-btn dense rounded icon="close" class="bg-grey text-black" size="sm" @click="isHbShow = false" />
        </div>
        <div>
          <q-carousel
            class="hb-float"
            :navigation="hbPromo.length > 1 ? true : false"
            v-model="hbSlide"
            swipeable
            transition-next="slide-left"
            transition-prev="slide-right"
            animated
            infinite
            :autoplay="3000"
          >
            <q-carousel-slide
              v-for="(promo, i) in hbPromo"
              :key="i"
              :name="i"
              @click="gotoFloatPromo(promo)"
              :img-src="`${imgURL}/promo/${promo.icon}`"
            >
              <!-- <img style="width: 100px" :src="`${imgURL}/promo/${promo.icon}`" /> -->
            </q-carousel-slide>
          </q-carousel>
        </div>
      </div>
    </q-page-sticky>

    <PushNotification
      :pushNotificationData="pushNotificationData"
      v-if="Platform.is.android && Platform.is.capacitor"
    />
    <InfoCenter
      class="midd"
      :announcement-list="announcementList"
      @open-popup="openPopup"
      :download-heart="downloadHeart"
    />

    <GameList
      :hot-game-list="hotGameList"
      :live-game-list="livecasino"
      :slot-game-list="slot"
      :poker-game-list="poker"
      :fish-game-list="fishing"
      :sport-game-list="sport"
      @play-game="playGame"
      @open-game="openGame"
    />
  </div>

  <GameModal
    v-if="route.path !== '/account/profile'"
    ref="allGames"
    :closeFullGameDialog="closeFullGameDialog"
  ></GameModal>

  <q-dialog
    width="100%"
    class="modal-update-div"
    v-model="isAppUpdateModal"
    show-cancel-button
    :showCancelButton="false"
    :showConfirmButton="false"
    :persistent="isOutdatedApp"
  >
    <q-card style="width: 100%">
      <div class="modalcontent">
        <div class="headers">
          <div class="titles backgroundColor">{{ $t("appUpdate.updateHeader") }}</div>
        </div>
        <div class="contents">
          <template v-if="isOutdatedApp">
            {{ $t("appUpdate.isOutdatedAppContent_01") }}
            <br />
            {{ $t("appUpdate.isOutdatedAppContent_02") }}
          </template>
          <template v-else>{{ $t("appUpdate.newAppVersionContent_01") }}</template>
        </div>
        <div class="btnsreas">
          <div class="cacnels borderColor fontColor" @click="cancelUpdate" v-if="!isOutdatedApp">
            {{ $t("appUpdate.cancel") }}
          </div>
          <div class="confirmsbtns btncolor" @click="openDownloadPage">{{ $t("appUpdate.updateNow") }}</div>
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" class="announcement-dialog" v-model="isStationNotice">
    <div class="popout-dialog" style="padding-top: 16px">
      <q-btn dense rounded icon="close" class="bg-white text-black announcement-close" v-close-popup />
      <q-card style="width: calc(100% - 0px); margin: auto; padding-left: 10px" class="announcement-card">
        <q-card-section class="q-mb-md">
          <q-tabs v-model="activeKey" dense class="text-white" align="justify">
            <q-tab v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id" :label="tab.name" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeKey" animated>
            <q-tab-panel v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id">
              <q-list style="min-height: auto">
                <div v-for="(ann, idx) in announcementList" :key="idx">
                  <span v-if="ann.typeId === tab.id">
                    <q-expansion-item
                      style="max-height: 75vh; overflow: auto"
                      group="somegroup"
                      icon="volume_up"
                      :label="ann.title"
                    >
                      <q-card>
                        <q-card-section>
                          <div v-html="processedContent(ann.content)" />
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
    </div>
  </q-dialog>

  <!-- <q-dialog width="100%" v-model="isImportantAnnoucementModal">
    <q-card style="width: 90%; max-width: 500px; margin: 0 auto" class="text-white">
      <q-card-section>
        <div class="close-alert" @click="setExpiryBanner()">
          <q-icon size="24px" name="close"></q-icon>
        </div>
        <div class="promo-banner-container">
          <div class="promo-banner-content" v-if="homePopupType === 'TEXT'" v-html="homePopupContent"></div>
          <div class="promo-banner-img" v-else>
            <img :src="homePopupImg" class="alert-img" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog> -->

  <q-dialog
    v-model="fullGameDialog"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    class="fullgame-dialog"
  >
    <q-card class="fullgame-card" id="fullgame">
      <ProfileSummary @closeslot="closeSlotModal" :homeProfile="true" />
      <q-card-section>
        <div class="home-wrapper fullgame-wrapper">
          <div class="fullgame-header">
            <div class="q-mt-sm q-mb-md">
              <q-btn dense rounded icon="chevron_left" class="back-btn" size="16px" v-close-popup />
            </div>
            <div>
              <div class="game-logo-img">
                <div
                  class="game-logo"
                  :style="{
                    backgroundImage: (() => {
                      try {
                        return `url(${require(`../assets/images/index/logo/logo-${subGameCode.toLowerCase()}.png`)})`;
                      } catch (e) {
                        return '';
                      }
                    })()
                  }"
                >
                  &nbsp;
                </div>
              </div>
            </div>

            <div class="fullgame-search">
              <q-input standout v-model="searchText" :label="$t('btn.search')" clearable clear-icon="close">
                <template v-slot:prepend>
                  <q-icon name="search" size="20px" />
                </template>
              </q-input>
            </div>
          </div>

          <template v-if="isGameLoading">
            <div class="loader-container">
              <div>
                <q-spinner color="green" size="10em" :thickness="10" />
              </div>
              <div>{{ $t("btn.loading_plsWait") }}</div>
            </div>
          </template>

          <template v-else>
            <div class="games-selection-wrapper">
              <div class="game-platform-wrapper">
                <template v-if="hotGameOn">
                  <template v-for="(item, index) in filteredHotGameList" :key="index">
                    <template v-if="index < showValue">
                      <div
                        class="game-platform-item"
                        @click="
                          playGame(
                            item.name,
                            item.platformCode,
                            item.code,
                            item.status,
                            item.gameType,
                            item.id,
                            item.demo
                          )
                        "
                        data-aos="zoom-in"
                        data-aos-duration="1200"
                        data-aos-once="true"
                        data-aos-anchor="#fullgame"
                      >
                        <div class="game-platform-img">
                          <div
                            class="game--bg"
                            :style="{
                              backgroundImage: `url(${imgURLGame}${item.icon})`
                            }"
                          ></div>
                        </div>
                        <div class="game-platform-title">{{ truncateText(item.name, 18) }}</div>

                        <div
                          class="game-platform-label game-platform-label--hot"
                          v-if="item.gameLabel && item.gameLabel.includes('HOT')"
                        >
                          <img src="../assets/images/index/platform-label-hot.png" alt="" />
                        </div>
                        <div
                          class="game-platform-label game-platform-label--new"
                          v-if="item.gameLabel && item.gameLabel.includes('NEW')"
                        >
                          <img src="../assets/images/index/platform-label-new.png" alt="" />
                        </div>
                      </div>
                    </template>
                  </template>
                </template>

                <template v-else>
                  <template v-for="(item, index) in filteredSubGameList" :key="index">
                    <template v-if="index < showValue">
                      <div
                        class="game-platform-item"
                        @click="
                          playGame(item.name, subGameCode, item.code, item.status, item.gameType, item.id, item.demo)
                        "
                        data-aos="zoom-in"
                        data-aos-duration="1200"
                        data-aos-once="true"
                        data-aos-anchor="#fullgame"
                      >
                        <div class="game-platform-img" :class="'game-' + item.gameType.toLowerCase()">
                          <div
                            class="game--bg"
                            :style="{
                              backgroundImage: `url(${imgURLGame}${item.icon})`
                            }"
                          ></div>
                        </div>
                        <div class="game-platform-title">{{ truncateText(item.name, 18) }}</div>

                        <div
                          class="game-platform-label game-platform-label--hot"
                          v-if="
                            (item.gameLabel && item.gameLabel.includes('LIST')) ||
                            (item.gameLabel && item.gameLabel.includes('HOT'))
                          "
                        >
                          <img src="../assets/images/index/platform-label-hot.png" alt="" />
                        </div>
                        <div
                          class="game-platform-label game-platform-label--new"
                          v-if="item.gameLabel && item.gameLabel.includes('NEW')"
                        >
                          <img src="../assets/images/index/platform-label-new.png" alt="" />
                        </div>
                      </div>
                    </template>
                  </template>
                </template>
              </div>

              <q-btn class="btn-more-games btn-effect" @click="scrollDownFullGames" v-if="!isShowAllFullGames">
                {{ $t("btn.moreGames") }}
              </q-btn>
            </div>
          </template>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- <q-dialog width="100%" v-model="withdrawalDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="bg-yellow text-black popout-close" v-close-popup />
      <div class="popout-dialog-container popout-dialog-container--yel">
        <div class="popout-main-title">
          <div class="txt-title">Withdrawal</div>
        </div>
        <WithdrawalComponent @close-withdraw="closeWithDrawModal"></WithdrawalComponent>
      </div>
    </div>
  </q-dialog> -->
  <WithdrawalModal ref="withdrawalModalRef"></WithdrawalModal>

  <!-- <q-dialog width="100%" v-model="depositDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="bg-yellow text-black popout-close" @click="closeDepositDialog" />
      <div class="popout-dialog-container popout-dialog-container--yel">
        <div class="popout-main-title">
          <div class="txt-title">Deposit</div>
        </div>
        <DepositComponent />
      </div>
    </div>
  </q-dialog> -->

  <!-- <q-dialog width="100%" v-model="guestKYCDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" v-close-popup />
      <KYCGuestForm @closeGuestKYCDialog="closeGuestKYCDialog" />
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="userKYCDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" v-close-popup />
      <KYCUserForm @closeUserKYCDialog="closeUserKYCDialog" />
    </div>
  </q-dialog> -->

  <q-dialog width="100%" class="modal-home-popup" v-model="isImportantAnnoucementModal">
    <q-card style="width: 90%; max-width: 500px; margin: 0 auto" class="text-white">
      <q-card-section>
        <div class="close-alert" @click="setExpiryBanner()">
          <q-icon size="24px" name="close"></q-icon>
        </div>
        <router-link class="promo-banner-container" :to="homePopupLink" :target="homePopupLinkOut ? '_blank' : '_self'">
          <div class="promo-banner-content" v-if="homePopupType === 'TEXT'" v-html="homePopupContent"></div>
          <div class="promo-banner-img" v-else>
            <img :src="homePopupImg" class="alert-img" />
          </div>
        </router-link>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="isLuckyDrawModal">
    <div class="luckyspin-wrapper">
      <div class="luckyspin-header">
        <img src="../assets/images/index/modal/luckyspin-title.png" />
      </div>
      <div class="luckyspin-container">
        <div class="luckyspin-title">
          <img src="../assets/images/index/modal/luckyspin-welcome.png" />
        </div>

        <LuckySpinWheel />
      </div>
      <div class="q-mt-md">
        <q-icon name="highlight_off" size="md" v-close-popup />
      </div>
    </div>
  </q-dialog>

  <q-dialog v-model="isCongratsModal">
    <CongratsModal />
  </q-dialog>

  <q-dialog v-model="isShowPrizeModal">
    <div class="congrats-container">
      <q-btn icon="close" round dense v-close-popup class="congrats-close" />
      <div class="congrats-header"><img src="../assets/images/index/modal/congrats-header.png" /></div>
      <div class="congrats-coupons"><img src="../assets/images/index/modal/congrats-coupons.png" /></div>
      <div class="congrats-title">You get a coupon，Recharge $300 Get</div>
      <div class="congrats-highlight">Rs28</div>

      <div class="congrats-button">
        <q-btn no-caps unelevated class="btn-primary" :loading="false" @click="router.push('/deposit?from=/home')">
          {{ $t("btn.recharge") }}
        </q-btn>
      </div>
    </div>
  </q-dialog>

  <q-dialog v-model="isMoneyRainModal">
    <MoneyRainModal />
    <q-btn icon="close" round dense v-close-popup class="money-rain-close" />
  </q-dialog>

  <q-dialog v-model="isMediaSettingsModal">
    <MediaSettingsComponent :media="mediaCode" />
    <q-btn icon="close" round dense v-close-popup class="money-rain-close" />
  </q-dialog>
  <a ref="downloadAppRef" :href="ui.downloadAppUrl" download style="display: none" />
</template>

<script setup>
import { onMounted, ref, reactive, computed, watch, onActivated } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
import { cached, TIME_EXPIRED } from "boot/cache";
import { useQuasar, Platform } from "quasar";
import { userStore } from "stores/index";
import GameModal from "components/modal/GameModal";
import MarqueeText from "vue-marquee-text-component";
import { App } from "@capacitor/app";
import OneSignal from "onesignal-cordova-plugin";
import PushNotification from "../components/modal/PushNotification.vue";
import { useUI } from "stores/ui";
import ProfileSummary from "../components/ProfileSummary.vue";
import WithdrawalModal from "../components/modal/WithdrawalModal.vue";
import DepositComponent from "../components/depositComponent.vue";
import KYCGuestForm from "../components/KYCGuestForm.vue";
import KYCUserForm from "../components/KYCUserForm.vue";
import CongratsModal from "../components/modal/CongratsModal.vue";
import LuckySpinWheel from "../components/hotpromo/newPlayerWheel/LuckySpinWheel.vue";
import MoneyRainModal from "../components/modal/MoneyRainModal.vue";
import MediaSettingsComponent from "../components/MediaSettingsComponent.vue";
import AOS from "aos";
import "aos/dist/aos.css";
import { isAndroid } from "boot/utils";
import { useI18n } from "vue-i18n";
import { eventapi } from "src/boot/axios";

import { Swiper, SwiperSlide } from "swiper/vue";
// import { ref, onMounted, onUnmounted } from 'vue';
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
// Import Swiper modules
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper/core";
import { onClickOutside, useEventListener } from "@vueuse/core";
import InfoCenter from "src/components/home/v2/InfoCenter.vue";
import GameList from "src/components/home/v2/GameList.vue";
// import SwiperCore, { Scrollbar, Navigation, Pagination, EffectCoverflow } from "swiper";
// Use ref to hold the modules
const modules = ref([Scrollbar, Pagination]);
const gameModules = ref([Scrollbar, Navigation, Pagination]);

const { t } = useI18n();

const isLuckyDrawModal = ref(false);
const isCongratsModal = ref(false);
const isShowPrizeModal = ref(false);
const isMoneyRainModal = ref(false);
const isMediaSettingsModal = ref(false);

const categoriesList = ref([
  { title: "Lobby", label: t("home.menu_lobby"), icon: "lobby", active: true },
  { title: "Hot", label: t("home.menu_hot"), icon: "hot", active: false },
  { title: "Slot", label: t("home.menu_slot"), icon: "slot", active: false },
  { title: "Live", label: t("home.menu_live"), icon: "live", active: false },
  { title: "Sport", label: t("home.menu_sport"), icon: "sport", active: false },
  { title: "Poker", label: t("home.menu_poker"), icon: "poker", active: false },
  { title: "Fish", label: t("home.menu_fish"), icon: "fish", active: false }
]);

const isCsTabVisible = ref(false);
const csTabRef = ref();

const isLiveTabVisible = ref(false);
const liveTabRef = ref();

const translatedCategoriesList = computed(() => {
  return categoriesList.value.map((category) => ({
    ...category,
    label: t(`home.menu_${category.title.toLowerCase()}`)
  }));
});

const activeCategoryLabel = computed(() => {
  const activeCategory = translatedCategoriesList.value.find((category) => category.active);
  return activeCategory ? activeCategory.label : "";
});

// const activateSlide = (clickedItem) => {
//   categoriesList.value.forEach((item) => {
//     item.active = item === clickedItem;
//   });
// };

// const activateSlide = (item) => {
//   translatedCategoriesList.value.forEach((category) => (category.active = false));
//   item.active = true;
// };

const activateSlide = (item) => {
  categoriesList.value.forEach((category) => (category.active = false));
  const category = categoriesList.value.find((cat) => cat.title === item.title);
  if (category) {
    category.active = true;
  }
};

const handleActivateSlide = (slot) => {
  const item = translatedCategoriesList.value.find((cat) => cat.title === slot);
  if (item) {
    activateSlide(item);
  }
};

const checkHash = () => {
  const hash = route.hash.replace("#", "");
  if (hash) {
    handleActivateSlide(hash);
  } else {
    handleActivateSlide("Lobby");
  }
};

const csDragPos = ref([10, 0]);
const isDraggingCsIcon = ref(false);

const liveDragPos = ref([16, 0]);
const isDraggingLiveIcon = ref(false);
const isLiveUrlShow = ref(false);

const hbDragPos = ref([10, 0]);
const isDraggingHbIcon = ref(false);
const isHbShow = ref(true);
const hbSlide = ref(0);

const slide = ref(0);

const isFirstView = ref(false);
const closeAlert = () => {
  // Create a new date object in GMT+5.5
  const currentTimeInGMT55 = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

  localStorage.setItem("indexImgTop", currentTimeInGMT55.getTime());
  isFirstView.value = false;
};

const fullGameDialog = ref(false);
const searchText = ref("");

const withdrawalModalRef = ref();
const onWithdrawalClick = () => {
  // withdrawalDialog.value = true;
  if (!store.realName & !store.guest) {
    userKYCDialog.value = true;
  } else if (!store.realName & store.guest) {
    guestKYCDialog.value = true;
  } else {
    withdrawalModalRef.value.open();
  }
};

const userKYCDialog = ref(false);
const guestKYCDialog = ref(false);
const depositDialog = ref(false);
const openDepositDialog = () => {
  if (!store.realName & !store.guest) {
    userKYCDialog.value = true;
  } else if (!store.realName & store.guest) {
    guestKYCDialog.value = true;
  } else {
    depositDialog.value = true;
  }
};

const closeGuestKYCDialog = () => {
  guestKYCDialog.value = false;
  store.getMemberInfo();
  loadData();
};
const closeUserKYCDialog = () => {
  userKYCDialog.value = false;
  store.getMemberInfo();
  loadData();
};

const depositItems = reactive([
  { amount: 300, hotLabel: 15, isActive: false },
  { amount: 500, hotLabel: 25, isActive: false },
  { amount: 800, hotLabel: 40, isActive: false },
  { amount: 1000, hotLabel: 50, isActive: false },
  { amount: 3000, hotLabel: 150, isActive: false },
  { amount: 5000, hotLabel: 250, isActive: false },
  { amount: 10000, hotLabel: 500, isActive: false },
  { amount: 30000, hotLabel: 1500, isActive: false },
  { amount: 50000, hotLabel: 2500, isActive: false }
]);

const esport = ref([]);
const sport = ref([
  {
    id: 133,
    name: "LuckySport",
    code: "LuckySport",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SPORT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 999
  },
  {
    id: 95,
    name: "BTI",
    code: "BTI",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SPORT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 999
  },
  {
    id: 50,
    name: "SABA",
    code: "SABA",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SPORT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 999
  }
]);
const livecasino = ref([
  {
    id: 123,
    name: "Evo",
    code: "WCEvo",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "LIVE",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "Evolution",
    sequence: 1
  },
  {
    id: 4,
    name: "Awc",
    code: "AWC",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "LIVE",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "Sexy",
    sequence: 999
  },
  {
    id: 5,
    name: "Ezugi",
    code: "EZUGI",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "LIVE",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 999
  },
  {
    id: 100,
    name: "WCOT",
    code: "WCOT",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "LIVE",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "One Touch",
    sequence: 999
  },
  {
    id: 143,
    name: "WCPP",
    code: "WCPP",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "LIVE",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "Evolution",
    sequence: 999
  }
]);
const poker = ref([]);
const lottery = ref([]);
const slot = ref([
  {
    id: 8,
    name: "JiliGames",
    code: "JILI",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT,FISH",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "JiliGames",
    sequence: 1
  },
  {
    id: 124,
    name: "Turbo",
    code: "Turbo",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 2
  },
  {
    id: 21,
    name: "PG",
    code: "PG",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "Relax Gaming",
    sequence: 3
  },
  {
    id: 51,
    name: "JOKER",
    code: "JOKER",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT,FISH",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "JOKER",
    sequence: 4
  },
  {
    id: 31,
    name: "JDB",
    code: "JDB",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT,FISH",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 5
  },
  {
    id: 107,
    name: "Big time Gaming",
    code: "WCBTG",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "Big Time",
    sequence: 6
  },
  {
    id: 111,
    name: "Relax",
    code: "WCRelax",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "Relax Gaming",
    sequence: 7
  },
  {
    id: 16,
    name: "TFGaming",
    code: "TFGaming",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "CASUAL",
    followType: "NEW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: null,
    sequence: 999
  },
  {
    id: 106,
    name: "No limit city",
    code: "WCNLC",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "No Limit City",
    sequence: 999
  },
  {
    id: 108,
    name: "Wazdan",
    code: "WCWazdan",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "Wazdan",
    sequence: 999
  },
  {
    id: 104,
    name: "Netent",
    code: "WCNetent",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "Netent",
    sequence: 999
  },
  {
    id: 105,
    name: "Red tiger",
    code: "WCRT",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "Red Tiger",
    sequence: 999
  },
  {
    id: 109,
    name: "One touch",
    code: "WCOTS",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "One Touch Slot",
    sequence: 999
  },
  {
    id: 120,
    name: "World Match",
    code: "WCWM",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "World Match",
    sequence: 999
  },
  {
    id: 113,
    name: "PNG",
    code: "WCPNG",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "PNG",
    sequence: 999
  },
  {
    id: 116,
    name: "Habanero",
    code: "WCHB",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "Habanero",
    sequence: 999
  },
  {
    id: 121,
    name: "Spinix",
    code: "WCSpinix",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "Spinix",
    sequence: 999
  },
  {
    id: 142,
    name: "FiveG",
    code: "FiveG",
    status: "OPEN",
    walletType: "SEAMLESS",
    gameType: "SLOT",
    followType: "FOLLOW",
    underMaintenance: false,
    maintenanceStartTime: null,
    maintenanceEndTime: null,
    alias: "5G",
    sequence: 999
  }
]);
const fishing = ref([]);
const casuals = ref([]);

const ui = useUI();
const scrollPageRef = ref(null);
const isH5 = ref(false);
const checkPlatform = () => {
  //Is iOS Webclip App || Is Android Apk
  if (
    (Platform.is.ios && "standalone" in window.navigator && window.navigator.standalone) ||
    (Platform.is.android && Platform.is.capacitor)
  ) {
    downloadHeart.value = false;
    isH5.value = false;
    setTimeout(() => {
      getVersionNo();
    }, 1000);
  } else {
    downloadHeart.value = true;
    isH5.value = true;
    setTimeout(() => {
      getVersionNo();
    });
  }
};

// ui.$onAction(({ name, args }) => {
//   switch (name) {
//     case "setScrollPosition":
//       scrollPageRef.value.setScrollPosition(args[0], args[1], args[2]);
//   }
// });
const qs = require("qs");
const $q = useQuasar();
const banners = ref([
  {
    mobileImageUrl: "empty-banner.png"
  }
]);

const returnBannerUrl = (banner) => {
  const displayImgUrl = banner.mobileImageUrlDark ?? banner.mobileImageUrl;
  try {
    var bannerImg = "";
    const bannerSplit = displayImgUrl.split("/");
    // console.log(bannerSplit);
    if (bannerSplit.length > 1) {
      bannerImg = bannerSplit[1];
    } else {
      bannerImg = bannerSplit[0];
    }
    return require(`../assets/images/banners/${bannerImg}`);
  } catch (e) {
    return imgURLPromo + displayImgUrl;
  }
};

const route = useRoute();
const router = useRouter();
const store = userStore();

const allGames = ref(null);
const playGame = (gameName, platformCode, gameCode, gameStatus, gameType, gameId, demo) => {
  allGames.value.open(gameName, platformCode, gameCode, gameType, demo);
};

const isGameLoading = ref(true);
const openGame = (gameName, platformCode, gameCode, gameStatus, gameType, gameId) => {
  isShowAllFullGames.value = false;
  isGameLoading.value = true;
  subGameCode.value = platformCode;
  loadGameList(gameType, gameId);
  fullGameDialog.value = true;
  hotGameOn.value = false;
};

const closeSlotModal = () => {
  fullGameDialog.value = false;
};

const closeFullGameDialog = () => {
  fullGameDialog.value = false;

  if (store.guest && !store.realName) {
    guestKYCDialog.value = true;
  } else if (!store.guest && !store.realName) {
    userKYCDialog.value = true;
  }
};

const hotGameOn = ref(false);
const subGameList = ref([]);
const filteredSubGameList = computed(() => {
  if (searchText.value) {
    return subGameList.value.filter((item) => item.name.toLowerCase().includes(searchText.value.toLowerCase()));
  } else {
    return subGameList.value;
  }
});

const subGameCode = ref("");

const openHotGame = (hotGameList) => {
  subGameList.value = hotGameList;
  fullGameDialog.value = true;
  hotGameOn.value = true;
};

const hotGameList = ref([
  {
    id: 23,
    name: "Aviator",
    code: "27",
    status: "OPEN",
    icon: "5/Spribe/4457f1e2-d1ea-4b53-a111-95a225bef685.png",
    sequence: 1,
    siteName: null,
    platformId: 16,
    platformName: "TFGaming",
    platformCode: "TFGaming",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "TFGaming"
  },
  {
    id: 61,
    name: "Pirate Flip",
    code: "32",
    status: "OPEN",
    icon: "8/TFGaming/32.png",
    sequence: 2,
    siteName: null,
    platformId: 16,
    platformName: "TFGaming",
    platformCode: "TFGaming",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "TFGaming"
  },
  {
    id: 64,
    name: "Mines",
    code: "229",
    status: "OPEN",
    icon: "11/JILI/c77236e7-a298-488a-975d-c1fd7f8e30f2.jpg",
    sequence: 3,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 65,
    name: "7up7down",
    code: "124",
    status: "OPEN",
    icon: "11/JILI/9d163d59-27cc-4df7-8709-d2a2ecc0e65e.png",
    sequence: 4,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 62,
    name: "Dragon & Tiger",
    code: "123",
    status: "OPEN",
    icon: "11/JILI/d3ec422a-bb04-4d7a-b9a9-e54fbdcae042.png",
    sequence: 5,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 63,
    name: "Color Game",
    code: "197",
    status: "OPEN",
    icon: "11/JILI/86ae93d2-1e8d-4eb8-8b67-ce9db4e74ea6.png",
    sequence: 6,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  { code: "WCEvo", platform: "WCEvo", type: "platform", name: "" },
  {
    id: 46,
    name: "Sic Bo",
    code: "125",
    status: "OPEN",
    icon: "11/JILI/e69c37b0-5925-43e1-b02a-3c63ac25add0.png",
    sequence: 8,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 47,
    name: "Money Coming",
    code: "51",
    status: "OPEN",
    icon: "11/JILI/51.png",
    sequence: 9,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 48,
    name: "Andar Bahar",
    code: "79",
    status: "OPEN",
    icon: "11/JILI/5d214dcd-08fb-4c54-b808-12c55ac19473.png",
    sequence: 10,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "POKER",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 49,
    name: "Dinosaur Tycoon",
    code: "42",
    status: "OPEN",
    icon: "11/JILI/42.png",
    sequence: 11,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "FISH",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 50,
    name: "Ludo Quick",
    code: "163",
    status: "OPEN",
    icon: "11/JILI/acd9b0fd-625d-4fb2-ae19-5e69b34e6700.png",
    sequence: 12,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "POKER",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 51,
    name: "Fortune Gems 2",
    code: "223",
    status: "OPEN",
    icon: "11/JILI/109.png",
    sequence: 13,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 53,
    name: "Bombing Fishing",
    code: "20",
    status: "OPEN",
    icon: "11/JILI/20.png",
    sequence: 14,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "FISH",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 54,
    name: "Happy Fishing",
    code: "82",
    status: "OPEN",
    icon: "11/JILI/82.png",
    sequence: 15,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "FISH",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 55,
    name: "Plinko",
    code: "242",
    status: "OPEN",
    icon: "11/JILI/c936c03d-316d-4fb8-804a-9e9ca837aa90.png",
    sequence: 16,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "SLOT",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 56,
    name: "Jackpot Fishing",
    code: "32",
    status: "OPEN",
    icon: "11/JILI/32.png",
    sequence: 17,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "FISH",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 57,
    name: "Baccarat",
    code: "152",
    status: "OPEN",
    icon: "11/JILI/ba81c2f8-dcaa-4de0-982c-7e198fa3c8fe.png",
    sequence: 18,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "POKER",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 26,
    name: "TeenPatti 20-20",
    code: "161",
    status: "OPEN",
    icon: "11/JILI/c3a5ab4f-19f8-4299-b046-1fc4ea38ef4c.png",
    sequence: 19,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "POKER",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 25,
    name: "All-star Fishing",
    code: "119",
    status: "OPEN",
    icon: "11/JILI/119.png",
    sequence: 20,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "FISH",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  },
  {
    id: 4,
    name: "Teen Patti",
    code: "72",
    status: "OPEN",
    icon: "11/JILI/097df233-0329-427c-a596-9af968062624.png",
    sequence: 21,
    siteName: null,
    platformId: 8,
    platformName: "JiliGames",
    platformCode: "JILI",
    gameType: "POKER",
    device: null,
    gameLabel: "HOT",
    updateBy: null,
    updateTime: null,
    type: "game",
    platform: "JILI"
  }
]);

const filteredHotGameList = computed(() => {
  if (searchText.value) {
    return hotGameList.value.filter((item) => item.name.toLowerCase().includes(searchText.value.toLowerCase()));
  } else {
    return hotGameList.value;
  }
});

const loadHotGameList = () => {
  const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
  const key = `PLATFORM_HOT_GAMES_${regDevice}`;
  const key2 = `MEMBER_HOT_${regDevice}`;

  var gameLists = [];
  var hotlists = [];

  cached
    .get(key2, () =>
      api
        .get("/sitePlatformAndGamesByLabel", {
          // .get("/member/hot", {
          params: {
            gameLabel: "HOT",
            device: regDevice
          }
        })
        .then((ret) => {
          const res = ret;
          if (res.code === 0) {
            return res;
          }
        })
        .catch((err) => {})
    )
    .then((res) => {
      hotGameList.value = [];
      hotlists = res;

      // cached
      cached
        .get(
          key,
          () =>
            api
              .get("/platformGamesByLabelV1", {
                params: {
                  gameLabel: "HOT",
                  device: regDevice
                }
              })
              .then((ret) => {
                const res = ret;
                if (res.code === 0) {
                  return res;
                }
              })
              .catch((err) => {
                // Handle the error appropriately
              }),
          { expired_value: 300 }
        )
        .then((res) => {
          gameLists = res;

          // console.log("HERE");
          // console.log(gameLists);
          // console.log(hotlists);

          hotlists = hotlists.map((item1) => {
            const matchingItem = gameLists.find(
              (item2) => item1.type === "game" && item1.code === item2.code && item2.platformCode === item1.platform
            );
            return { ...matchingItem, ...item1 };
          });

          hotlists = hotlists.map((item3) => {
            const matchingItem = livecasino.value.find(
              (item4) => item3.type === "platform" && item3.code === item4.name
            );
            return { ...item3, ...matchingItem };
          });

          hotGameList.value = hotlists.map((item5) => {
            const matchingItem = sport.value.find((item6) => item5.type === "sport" && item5.code === item6.name);
            return { ...item5, ...matchingItem };
          });

          console.log("End");
          // console.log(hotGameList.value);
          // console.log(livecasino.value);
        });
    });
};

const fishGameJILIList = ref([
  {
    id: 25309,
    name: "Bombing Fishing",
    code: "20",
    status: "OPEN",
    icon: "11/JILI/20.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25310,
    name: "Dinosaur Tycoon",
    code: "42",
    status: "OPEN",
    icon: "11/JILI/42.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25311,
    name: "Jackpot Fishing",
    code: "32",
    status: "OPEN",
    icon: "11/JILI/32.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25312,
    name: "Dragon Fortune",
    code: "60",
    status: "OPEN",
    icon: "11/JILI/60.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xf-martin",
    updateTime: "6/7/24, 10:14 AM"
  },
  {
    id: 25313,
    name: "Mega Fishing",
    code: "74",
    status: "OPEN",
    icon: "11/JILI/74.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25314,
    name: "Boom Legend",
    code: "71",
    status: "OPEN",
    icon: "11/JILI/71.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25315,
    name: "Happy Fishing",
    code: "82",
    status: "OPEN",
    icon: "11/JILI/82.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25316,
    name: "All-star Fishing",
    code: "119",
    status: "OPEN",
    icon: "11/JILI/119.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25368,
    name: "Royal Fishing",
    code: "1",
    status: "OPEN",
    icon: "11/JILI/1.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25372,
    name: "Dinosaur Tycoon II",
    code: "212",
    status: "OPEN",
    icon: "11/JILI/212.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  }
]);
const pokerGameJILIList = ref([
  {
    id: 25379,
    name: "Teen Patti",
    code: "72",
    status: "OPEN",
    icon: "11/JILI/097df233-0329-427c-a596-9af968062624.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "POKER",
    device: "ALL",
    gameLabel: "HOT",
    updateBy: "xf-martin",
    updateTime: "5/31/24, 8:31 AM"
  },
  {
    id: 25380,
    name: "Teen Patti Joker",
    code: "159",
    status: "OPEN",
    icon: "11/JILI/cbde9c3f-325f-4b11-9cda-7e8a8a3d147d.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "POKER",
    device: "ALL",
    gameLabel: "HOT",
    updateBy: "xf-martin",
    updateTime: "5/31/24, 8:31 AM"
  },
  {
    id: 25382,
    name: "Ludo Quick",
    code: "163",
    status: "OPEN",
    icon: "11/JILI/acd9b0fd-625d-4fb2-ae19-5e69b34e6700.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "POKER",
    device: "ALL",
    gameLabel: "HOT",
    updateBy: "xf-martin",
    updateTime: "5/31/24, 8:31 AM"
  },
  {
    id: 25383,
    name: "Andar Bahar",
    code: "79",
    status: "OPEN",
    icon: "11/JILI/5d214dcd-08fb-4c54-b808-12c55ac19473.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "POKER",
    device: "ALL",
    gameLabel: "HOT",
    updateBy: "xf-martin",
    updateTime: "5/31/24, 8:31 AM"
  },
  {
    id: 25384,
    name: "TeenPatti 20-20",
    code: "161",
    status: "OPEN",
    icon: "11/JILI/c3a5ab4f-19f8-4299-b046-1fc4ea38ef4c.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "POKER",
    device: "ALL",
    gameLabel: "HOT",
    updateBy: "xf-martin",
    updateTime: "5/31/24, 8:31 AM"
  },
  {
    id: 25387,
    name: "Baccarat",
    code: "152",
    status: "OPEN",
    icon: "11/JILI/ba81c2f8-dcaa-4de0-982c-7e198fa3c8fe.png",
    sequence: 1000,
    siteName: null,
    platformId: 8,
    platformName: null,
    platformCode: null,
    gameType: "POKER",
    device: "ALL",
    gameLabel: "HOT",
    updateBy: "xf-martin",
    updateTime: "5/31/24, 8:32 AM"
  }
]);

const loadJILIFishGameList = () => {
  const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
  const key = `${platformGamesApiKey}_JILI_FISH_GAMES_${regDevice}`;

  cached
    .get(key, () =>
      api
        .get(platformGamesApiUrl, {
          params: {
            platformId: 8,
            gameType: "FISH",
            device: regDevice
          }
        })
        .then((ret) => {
          const res = ret;
          if (res.code === 0) {
            return res;
          }
        })
        .catch((err) => {})
    )
    .then((res) => {
      fishGameJILIList.value = [];
      fishGameJILIList.value = res;
    });
};

const loadJILIPokerhGameList = () => {
  const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
  const key = `${platformGamesApiKey}_JILI_POKER_GAMES_${regDevice}`;

  cached
    .get(key, () =>
      api
        .get(platformGamesApiUrl, {
          params: {
            platformId: 8,
            gameType: "POKER",
            device: regDevice
          }
        })
        .then((ret) => {
          const res = ret;
          if (res.code === 0) {
            return res;
          }
        })
        .catch((err) => {})
    )
    .then((res) => {
      pokerGameJILIList.value = [];
      pokerGameJILIList.value = res;
    });
};

const fishGameJDBList = ref([
  {
    id: 25188,
    name: "Cai Shen Fishing",
    code: "7003",
    status: "OPEN",
    icon: "11/JDB/7003.png",
    sequence: 1123,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25189,
    name: "Shade Dragons Fishing",
    code: "7004",
    status: "OPEN",
    icon: "11/JDB/7004.png",
    sequence: 1124,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25190,
    name: "Fishing YiLuFa",
    code: "7005",
    status: "OPEN",
    icon: "11/JDB/7005.png",
    sequence: 1125,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  },
  {
    id: 25191,
    name: "Dragon Master",
    code: "7006",
    status: "OPEN",
    icon: "11/JDB/7006.png",
    sequence: 1126,
    siteName: null,
    platformId: 31,
    platformName: null,
    platformCode: null,
    gameType: "FISH",
    device: "ALL",
    gameLabel: null,
    updateBy: "xiaozhu",
    updateTime: "5/28/24, 3:02 PM"
  }
]);

const loadJDBFishGameList = () => {
  const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
  const key = `${platformGamesApiKey}_JDB_FISH_GAMES_${regDevice}`;

  cached
    .get(key, () =>
      api
        .get(platformGamesApiUrl, {
          params: {
            platformId: 31,
            gameType: "FISH",
            device: regDevice
          }
        })
        .then((ret) => {
          const res = ret;
          if (res.code === 0) {
            return res;
          }
        })
        .catch((err) => {})
    )
    .then((res) => {
      fishGameJDBList.value = [];
      fishGameJDBList.value = res;
    });
};

const isShowAllHotGames = ref(false);
const scrollDownHotGames = () => {
  isShowAllHotGames.value = true;
};

const isShowAllFullGames = ref(false);
const scrollDownFullGames = () => {
  isShowAllFullGames.value = true;
};

const showValue = computed(() => {
  if (!isShowAllFullGames.value) {
    return 12;
  } else {
    return 600;
  }
});

const loadGameList = (type, id) => {
  const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
  const code = id;
  const gameType = type;
  const key = `${platformGamesApiKey}_GAMES_${code}_${gameType}_${regDevice}`;

  // cached
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
          const res = ret;
          if (res.code === 0) {
            return res;
          }
          isGameLoading.value = false;
        })
        .catch((err) => {})
    )
    .then((res) => {
      subGameList.value = res;
      isGameLoading.value = false;
    });
};

const imgURL = process.env.IMAGE_CDN;
const imgURLGame = imgURL + "/game/";
const imgURLPromo = imgURL + "/promo/";

// Pop out ads banner
// const isImportantAnnoucementModal = ref(false);
// const homePopupImg = ref("");
// const homePopupContent = ref("");
// const homePopupType = ref("");
// const homePopupId = ref(0);
// const homePopupFrequency = ref(0);
// const homePopupFrequencyNum = ref(0);

// const setExpiryBanner = () => {
//   if (homePopupFrequencyNum.value !== 0) {
//     setWithExpiry("isImpt", true, homePopupFrequencyNum.value);
//   }
//   isImportantAnnoucementModal.value = false;
// };

// const setWithExpiry = (key, value, interval) => {
//   // Create a new date object in GMT+5.5
//   const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

//   const item = {
//     value: value,
//     expiry: now.getTime() + interval,
//     id: homePopupId.value,
//     frequency: homePopupFrequency.value
//   };
//   sessionStorage.setItem(key, JSON.stringify(item));
// };

function loadData() {
  api
    .get("/opt-session/promo/banner?category=HOME")
    .then((res) => {
      if (res.code === 0) {
        banners.value = [];
        banners.value = res.data;
        // banners.value = [
        //   {
        //     promoPageId: null,
        //     mobileImageUrl: "home-banner-01.jpg",
        //     redirectUrl: "",
        //     category: "HOME"
        //   }
        // ];
      } else {
      }
    })
    .catch(() => {});
}

// var platformApiUrl = store.hasToken() ? "/session/loggedInPlatform" : "/platform";
// var platformApiKey = store.hasToken() ? "LOGGEDPLATFORMS" : "PLATFORMS";

var platformGamesApiUrl = store.hasToken() ? "/session/loggedInPlatformGames" : "/platformGames";
var platformGamesApiKey = store.hasToken() ? "LOGGEDPLATFORMGAMES" : "PLATFORMGAMES";

const getPlatList = () => {
  const platformApiUrl = store.hasToken() ? "/session/loggedInPlatform" : "/platform";
  const platformApiKey = store.hasToken() ? "LOGGEDPLATFORMS" : "PLATFORMS";
  cached
    .get(platformApiKey, () =>
      api.get(platformApiUrl).then((res) => {
        return res;
      })
    )
    .then((data) => {
      var pf = data;
      ui.slotLists = [];
      livecasino.value = [];
      slot.value = [];
      sport.value = [];
      fishing.value = [];
      // console.log(pf);

      pf.forEach((element) => {
        const { status } = element;
        if (status === "TEST" && store.memberType !== "TEST") return;

        const platTypes = element.gameType.split(",");
        if (platTypes.indexOf("ESPORT") > -1) {
          var espObj = Object.assign({}, element);
          esport.value.push(espObj);
          //Add 1 More Casual minigame.
          var casualObj = Object.assign({}, element);
          casuals.value.push(casualObj);
        }
        if (platTypes.indexOf("SPORT") > -1) {
          var spObj = Object.assign({}, element);
          sport.value.push(spObj);
        }
        if (platTypes.indexOf("LIVE") > -1) {
          var liveObj = Object.assign({}, element);
          livecasino.value.push(liveObj);
        }
        if (platTypes.indexOf("SLOT") > -1 || (platTypes.indexOf("CASUAL") > -1 && element.code !== "Spribe")) {
          var slotObj = Object.assign({}, element);
          let slotItem = {
            id: slotObj.id,
            code: slotObj.code,
            icon: slotObj.name
          };
          ui.slotLists.push(slotItem);
          slot.value.push(slotObj);
        }
        if (platTypes.indexOf("FISH") > -1 && element.code !== "AGF") {
          var fishObj = Object.assign({}, element);
          fishing.value.push(fishObj);
        }
        if (platTypes.indexOf("POKER") > -1) {
          var pokerObj = Object.assign({}, element);
          poker.value.push(pokerObj);
        }
        if (platTypes.indexOf("LOTTERY") > -1) {
          var lottObj = Object.assign({}, element);
          lottery.value.push(lottObj);
        }
      });

      // console.log("Before");
      // console.log(sport.value);
      livecasino.value.sort((a, b) => a.sequence - b.sequence);
      sport.value.sort((a, b) => a.sequence - b.sequence);
      esport.value.sort((a, b) => a.sequence - b.sequence);
      poker.value.sort((a, b) => a.sequence - b.sequence);
      slot.value.sort((a, b) => a.sequence - b.sequence);
      lottery.value.sort((a, b) => a.sequence - b.sequence);

      // console.log("After");
      // console.log(JSON.stringify(slot.value));
      loadHotGameList();
    })
    .catch((err) => {});
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
  const urlSplit = banner.redirectUrl.split("|");
  const gameSplit = urlSplit.map((part) => part.split("/"));

  if (urlSplit.length >= 2) {
    const type = urlSplit[0];
    if (type === "open") {
      if (gameSplit[1][1] === "LuckySport") {
        playGame(
          gameSplit[1][0],
          gameSplit[1][1],
          "#/special/uefaeuro",
          gameSplit[1][3],
          gameSplit[1][4],
          gameSplit[1][5]
        );
      } else {
        playGame(gameSplit[1][0], gameSplit[1][1], gameSplit[1][2], gameSplit[1][3], gameSplit[1][4], gameSplit[1][5]);
      }
    } else if (type === "page") {
      router.push(`/${urlSplit[1]}`);
    } else {
      router.push(`/promo?name=${banner.redirectUrl}`);
    }
  } else {
    if (banner.redirectUrl.includes("https://")) {
      window.open(banner.redirectUrl, "_blank");
    } else if (banner.redirectUrl === "app_login") {
      if (isH5.value && downloadAppRef.value) downloadAppRef.value.click();
    } else {
      if (banner.redirectUrl === "redpacketrain") {
        isMoneyRainModal.value = true;
      } else {
        router.push(`/promo?name=${banner.redirectUrl}`);
      }
    }
  }
};

const gotoSignIn = () => {
  router.push("/login");
};

const gotoSignUp = () => {
  router.push("/register");
};

const download_url = ref("");
const isAppUpdateModal = ref(false);
const isOutdatedApp = ref(false);
const getVersionNo = async () => {
  // alert("run")
  if (Platform.is.android && Platform.is.capacitor) {
    const info = await App.getInfo();
    // console.log("APP Info");
    // console.log(info);
    var current_version = parseInt(info.version.replaceAll(".", ""));
    // alert("Cur:" + current_version);
    // info.version && info.build
    const appType = "ALL";
    const affiliateCode = sessionStorage.getItem("AFFILIATE_CODE");
    // alert(affiliateCode) ;
    const res = await api.get(`/app/india/getAppData?affiliateCode=${affiliateCode}`);
    // console.log(res);
    if (res.code === 0) {
      // alert(JSON.stringify(res.data));
      var version_info = res.data.version;
      var min_version = res.data.minVersion;
      var latest_ver_no = parseInt(version_info.replaceAll(".", ""));
      // alert(latest_ver_no);
      download_url.value = res.data.downloadUrl;
      console.log("H5 Url");
      console.log(res.data.h5Url);

      store.h5Url = res.data.h5Url;
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

// const downloadUrl = ref("");

// const getAppDownloadUrl = () => {
//   api
//     .get("/config/appDownloadUrl")
//     .then((res) => {
//       // console.log(res);
//       downloadUrl.value = res.data;
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

const truncateText = (text, maxLength) => {
  if (text === "JiliGames") {
    text = "JILI";
    // } else if (text.startsWith("WC")) {
    //   return text.substring(2);
  }

  // if (window.innerWidth <= 450) {
  //   return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  // } else {
  //   return text;
  // }
};

const closeDepositDialog = () => {
  depositDialog.value = false;
};

const toggleCSTab = () => (isCsTabVisible.value = !isCsTabVisible.value);
const closeCSTab = () => isCsTabVisible.value && (isCsTabVisible.value = false);
onClickOutside(csTabRef, closeCSTab);
useEventListener(document, "scroll", closeCSTab);

const detectAndroidVersion = () => {
  const ua = navigator.userAgent.toLowerCase();
  const isAndroid = ua.indexOf("android") > -1;

  if (isAndroid) {
    const androidVersion = parseFloat(ua.slice(ua.indexOf("android") + 8));

    if (!isNaN(androidVersion)) {
      if (androidVersion <= 9) {
        return "android-low " + androidVersion;
      } else {
        return "android-high " + androidVersion;
      }
    }
  }

  return "not-android";
};

const moveCsIcon = (ev) => {
  isDraggingCsIcon.value = ev.isFirst !== true && ev.isFinal !== true;

  csDragPos.value = [csDragPos.value[0] - ev.delta.x, csDragPos.value[1] - ev.delta.y];
};

const moveLiveIcon = (ev) => {
  isDraggingLiveIcon.value = ev.isFirst !== true && ev.isFinal !== true;

  liveDragPos.value = [liveDragPos.value[0] - ev.delta.x, liveDragPos.value[1] - ev.delta.y];
};

const moveHbIcon = (ev) => {
  isDraggingHbIcon.value = ev.isFirst !== true && ev.isFinal !== true;

  hbDragPos.value = [hbDragPos.value[0] - ev.delta.x, hbDragPos.value[1] - ev.delta.y];
};

const openLiveInNewTab = (url) => {
  const absoluteUrl = url;
  window.open(absoluteUrl, "_blank");
};

const pushNotificationData = ref();

const populatePushNotificationData = (data) => {
  pushNotificationData.value = data;
};

const initOneSignal = () => {
  OneSignal.initialize("3db3bbd6-0350-4f85-bb26-3c1fcc5cafaa");

  let myClickListener = async function (event) {
    console.log("CLICK PUSH");
    let notificationData = event;
    console.log(notificationData);
    console.log(notificationData.notification.title);
    console.log(notificationData.notification.body);
    console.log(notificationData.notification.additionalData);
    populatePushNotificationData(notificationData.notification);
  };
  OneSignal.Notifications.addEventListener("click", myClickListener);

  // Prompts the user for notification permissions.
  //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
  OneSignal.Notifications.requestPermission(true).then((accepted) => {
    console.log("User accepted notifications: " + accepted);
  });
};

const loadCustomerAddress = () => {
  cached
    .get("customerAddress", () =>
      api.get("/config/customerAddress/v2").then((res) => {
        return res;
      })
    )
    .then((data) => {
      console.log(data);
      var url = data.liveUrl1;
      ui.CSAUrl = url;

      if (data.studioUrl) {
        var lvUrl = data.studioUrl;
        ui.LiveUrl = lvUrl;
        isLiveUrlShow.value = true;

        csDragPos.value = [10, 70];
      }
    });
};

const hbPromo = ref([]);

const checkHbPromo = () => {
  api
    .get("/redirect")
    .then((res) => {
      return res;
    })
    .then((data) => {
      // isHbShow.value = data.data.some((item) => item.code === "pak-redpacketrain");
      hbPromo.value = data.data;
    });
};

// Pop out ads banner
const isImportantAnnoucementModal = ref(false);
const homePopupImg = ref("");
const homePopupContent = ref("");
const homePopupType = ref("");
const homePopupId = ref(0);
const homePopupFrequency = ref(0);
const homePopupFrequencyNum = ref(0);
const homePopupLink = ref("");
const homePopupLinkOut = ref(false);

const setExpiryBanner = () => {
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
  localStorage.setItem(key, JSON.stringify(item));
};

const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

const isImpt = getWithExpiry("isImpt");

const checkShowImgTop = () => {
  const isImpt = getWithExpiry("isImpt");
  api
    .get("/member/site-popout")
    .then((res) => {
      if (res.code === 0) {
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
          homePopupImg.value = imgURLPromo + res.data["mobileImgUrl"];
          homePopupContent.value = res.data["content"];
          homePopupType.value = res.data["type"];
          homePopupId.value = res.data["id"];
          homePopupFrequency.value = res.data["frequency"];

          if (res.data["path"].includes("http")) {
            homePopupLink.value = res.data["path"];
            homePopupLinkOut.value = true;
          } else {
            homePopupLink.value = `/promo?name=${res.data["path"]}`;
          }

          if (homePopupFrequencyNum.value !== 0) {
            setWithExpiry("isImpt", true, homePopupFrequencyNum.value);
          }

          isFirstView.value = true;
        }
      }
    })
    .catch(() => {});
};

const downloadHeart = ref(false);

// const getDownloadHeart = () => {
//   if (
//     ("standalone" in window.navigator && window.navigator.standalone) ||
//     (Platform.is.capacitor && Platform.is.android)
//   ) {
//     downloadHeart.value = false;
//   } else {
//     downloadHeart.value = true;
//   }
// };

const processedContent = (content) => {
  return content.replace(/\n/g, "<br>");
};

const mediaCode = ref("");

const gotoFloatPromo = (val) => {
  if (val.type === "PROMO" && val.code === "pk2-redpacketrain") {
    isMoneyRainModal.value = true;
  }

  if (val.type === "PROMO" && val.code === "pk2-interest-profit") {
    if (store.hasToken()) {
      router.push("/promo?name=pk2-interest-profit");
    } else {
      router.push("/promo");
    }
  }

  if (val.type === "DOMAIN") {
    window.open(val.code, "_blank");
  }
  if (val.type === "VIDEO") {
    isMediaSettingsModal.value = true;
    mediaCode.value = val.code;
  }
};

const downloadAppRef = ref();

onActivated(() => {
  store.getUnreadTotal();
  checkHash();
  checkShowImgTop();

  checkSpinWheel();

  // if (store.hasToken()) {
  checkHbPromo();
  // }

  if (route.query.login === "true") {
    isMoneyRainModal.value = true;
  }

  if (route.query.token) {
    store.autoLogin(route.query.token);
    checkSpinWheel();
  }
});

onMounted(() => {
  getPlatList();
  loadData();
  loadAnnouncement();
  checkPlatform();
  loadCustomerAddress();
  // loadJILIFishGameList();
  // loadJDBFishGameList();
  // loadJILIPokerhGameList();
  ui.shouldFetchDownloadAppUrl = true;

  AOS.init();
  SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

  if (Platform.is.android && Platform.is.capacitor) {
    initOneSignal();
  }
});

watch(
  () => route.hash,
  (newHash) => {
    if (newHash) {
      checkHash();
    }
  }
);

watch(
  () => store.token,
  (newToken, oldToken) => {
    if (!oldToken && newToken) {
      getPlatList();
    }
  }
);

// watch(
//   () => route.query.register,
//   (newValue) => {
//     if (newValue === "true") {
//       if (!isAndroid()) {
//         isCongratsModal.value = true;
//       }
//     }
//   }
// );

const checkSpinWheel = () => {
  if (store.hasToken() && isAndroid()) {
    setTimeout(() => {
      showSpinWheel();
    }, 750);
  } else if (store.hasToken() && !isAndroid()) {
    showCongratsModal();
  }
};

const showSpinWheel = () => {
  eventapi
    .get("/new-user-roulette/init")
    .then((res) => {
      if (res.code == 0) {
        if (res.data.hasUnusedCoupon === "YES") {
          isShowPrizeModal.value = true;
        } else if (res.data.showRoulette === "YES") {
          isLuckyDrawModal.value = true;
        }
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
};

const showCongratsModal = () => {
  eventapi.get("/new-user-roulette/init").then((res) => {
    if (res.code == 0) {
      if (res.data.hasUnusedCoupon === "YES" || res.data.showRoulette === "YES") {
        isCongratsModal.value = true;
      }
    }
  });
};
</script>

<style scoped lang="scss">
.q-page-container {
  min-height: 100vh;
}

.longer-swiper {
  height: calc(100vh - 380px);
}

:deep(.q-mb-md) {
  margin-bottom: 0;
}

.modal-update-div {
  .modalcontent {
    background: #fff;
    height: 180px;
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
      background: $primary;
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
      color: black;

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
      justify-content: center;
      gap: 20px;
      padding: 0 20px;
      margin-top: 0px;

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
        max-width: 200px;
      }

      .confirmsbtns {
        flex: 1;
        box-sizing: border-box;
        border-radius: 6px;
        line-height: 40px;
        height: 40px;
        text-align: center;
        color: #fff;
        background: $primary;
        letter-spacing: 1px;
        font-size: 14px;
        max-width: 200px;
      }
    }
  }
}

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

.notice-outer {
  display: flex;
  margin-right: 0;
  padding-right: 0;
}

.notice-download {
  display: flex;
  align-items: center;
  animation: beat 1.5s infinite;

  img {
    display: block;
    width: 32px;
    height: 32px;
    //filter: brightness(0) invert(50%) sepia(11%) saturate(3258%) hue-rotate(77deg) brightness(122%) contrast(75%);;
  }
}

/* Heart beat animation */
@keyframes beat {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  14% {
    -webkit-transform: scale(1.3);
    transform: scale(1.3);
  }

  28% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  42% {
    -webkit-transform: scale(1.3);
    transform: scale(1.3);
  }
  70% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

.midd {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
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

.announcement-close {
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 3;
}

.announcement-dialog {
  height: calc(100vh - 108px);
}

.announcement-card {
  height: 400px;
  // background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
  border-radius: 10px;
  overflow-y: auto;
  // background: linear-gradient(180deg, rgba(36, 36, 36, 1) 0%, rgba(35, 45, 31, 1) 100%);

  .q-tab__label {
    font-size: 18px;
  }

  .q-card {
    background: transparent;
  }

  .q-tab-panels {
    background: transparent;
    width: calc(100% - 10px);
  }
}

.popout-dialog {
  width: 90%;
  max-width: 500px;
  position: relative;
  padding-top: 90px;
  padding-right: 10px;

  .popout-close {
    position: absolute;
    right: 0px;
    top: 80px;
    background: #cfcfcf;
    color: #787878;
  }

  .popout-dialog-container--yel {
    // background-image: url(../assets/images/index/popout/deposit-bg.png) !important;
    background-position: bottom center;
    background-size: cover;
    background-repeat: no-repeat;
    padding: 30px 20px 20px;
    border-radius: 30px !important;
  }

  .popout-main-title {
    // background-image: url(../assets/images/index/popout/popout-title.png);
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center center;
    width: 100%;
    max-width: 290px;
    height: 120px;
    margin: -110px auto 0;
    // position: absolute;
    // top: 0px;
    position: relative;

    .txt-title {
      background-color: #f3ec78;
      background-image: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
      background-size: 100%;
      -webkit-background-clip: text;
      -moz-background-clip: text;
      -webkit-text-fill-color: transparent;
      -moz-text-fill-color: transparent;
      line-height: 1;
      font-size: 22px;
      font-weight: 800;
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: #a94700;

      position: absolute;
      bottom: 28px;
      left: 52%;
      transform: translate(-50%, 0%);
    }
  }

  .deposit-item-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    row-gap: 12px;
    column-gap: 8x;

    .deposit-item {
      .deposit-icon {
        // background-image: url(../assets/images/index/popout/deposit-item-frame.png);
        background-position: top center;
        background-size: contain;
        background-repeat: no-repeat;
        display: flex;
        height: 80px;
        position: relative;
        align-items: center;
        justify-content: center;
        margin-left: 3px;
        margin-right: 3px;
        transition: all 0.3s;

        img {
          display: block;
          width: 70%;
        }
      }

      &.active > .deposit-icon {
        // background-image: url(../assets/images/index/popout/deposit-item-frame-active.png);
      }

      .deposit-hot-label {
        position: absolute;
        top: 0;
        right: 0;
        // background-image: url(../assets/images/index/popout/hot-label.png);
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center center;
        width: 50px;
        height: 28px;
        font-size: 0.725rem;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        padding-bottom: 3px;
      }

      .deposit-amt {
        // background-image: url(../assets/images/index/popout/deposit-item-frame-amount.png);
        background-position: center center;
        background-size: contain;
        background-repeat: no-repeat;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        padding: 3px;
        width: 100%;
        max-width: 100px;
        margin: auto;
      }
    }
  }

  .deposit-enter-amt {
    display: flex;
    gap: 16px;
    align-items: center;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;

    .deposit-input {
      background-color: rgba(21, 0, 37, 0.5);
      border-radius: 5px;
      width: 100%;
    }
  }

  .deposit-options {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 16px;

    .deposit-option-btn {
      color: #cccccc;
      background-color: rgba(21, 0, 37, 0.5) !important;
      min-width: 100px;
      max-width: 160px;
      width: 100%;
      border-radius: 6px;
      border: 3px solid transparent;

      &.active {
        color: #ffe66b;
        border: 3px solid #ffe66b;
      }

      &.label-on-discount {
        position: relative;

        &:after {
          content: "";
          // background-image: url(../assets/images/index/popout/label-discount.png);
          background-repeat: no-repeat;
          display: block;
          position: absolute;
          top: -4px;
          right: -5px;
          width: 30px;
          height: 30px;
          background-size: 100%;
        }
      }
    }
  }
}

.game-logo-img {
  height: 30px;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);

  .game-logo {
    width: 30vw;
    background-position: center;
    height: 100%;
    background-repeat: no-repeat;
    background-size: contain;
  }

  img {
    display: block;
    height: 100%;
    width: auto;
  }
}
</style>

<style lang="scss">
.q-dialog__inner--maximized > div {
  overflow-x: hidden;
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

.home-wrapper {
  width: calc(100% - 16px);
  margin: auto;
}

.hb-icon-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
  background: url("../assets/images/index/hongbao-icon.gif") no-repeat center center;
  background-size: contain;
  position: relative;
}

.live-icon-wrapper {
  width: 63px;
  height: 70px;
  background: url("../assets/images/index/icon-live.png") no-repeat center center;
  background-size: contain;
  position: relative;
}

.cs-icon-wrapper {
  width: 70px;
  height: 76px;
  background: url("../assets/images/index/icon-cs.png") no-repeat center center;
  background-size: contain;
  position: relative;

  &:active {
    filter: brightness(0.85);
    transform: translate(0px, 1px);
  }

  &.active {
    .cs-icon {
      pointer-events: auto;
    }
  }

  .cs-icon {
    position: absolute;
    width: 48px;
    height: 48px;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    pointer-events: none;

    &.youtube {
      left: -60px;
      top: 65px;
    }

    &.instagram {
      left: -70px;
      top: 13px;
      transition-delay: 0.2s;
    }

    &.whatsapp {
      left: -39px;
      top: -30px;
      transition-delay: 0.4s;
    }

    &.cs {
      top: -72px;
      left: 50%;
      transform: translateX(-50%);
      transition-delay: 0.6s;
    }
  }

  &.active {
    .cs-icon {
      opacity: 1;
    }
  }
}

.home-divider {
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  height: 1px;
  width: 100%;
  // margin: 0 -2.5%;
}

.top-action {
  display: flex;
  justify-content: space-around;
  gap: 16px;
  margin-top: 5px;

  .action-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    line-height: 1;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    font-weight: 600;
    width: 50%;
    height: 55px;
    text-shadow: 2px 2px 2px #882f00;
    transition: 0.3s all;

    &--withdrawal {
      background-image: url(../assets/images/index/action-btn-withdrawal.png);
      color: #ffffff;

      &:before {
        box-shadow: none;
      }
    }

    &--deposit {
      background-image: url(../assets/images/index/action-btn-deposit.png);
      color: #fae576;

      &:before {
        box-shadow: none;
      }
    }

    &:hover {
      filter: opacity(0.8);
    }
  }
}

.games-selection-wrapper {
  &#live {
    margin-bottom: 10px;
  }
  .hot-games-pattern-top {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top center;
    margin-top: 8px;
  }

  .hot-games-pattern-bottom {
    background-size: contain;
    background-repeat: no-repeat;
    height: 50px;
    background-position: center center;

    &--filled {
      height: 15px;
      width: 15px;
      margin: 20px auto 10px;
      border-radius: 50%;
      background-color: #fbe984;
      display: flex;
      justify-content: center;
    }
  }

  .title-game {
    margin-left: -8px;
    margin-right: -8px;
    padding: 0px 12px 0px;
    display: flex;
    gap: 6px;
    align-items: center;
    // background-image: url("../assets/images/index/title-bg.png");
    // background-repeat: no-repeat;
    // background-size: cover;
    // background-position: center center;

    .label-img {
      display: block;
      width: auto;
      height: 20px;
    }

    .txt-style {
      background: linear-gradient(270deg, #3080f4 0%, #70b1ff 100%);
      background-clip: text;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 1px;
      line-height: 1;
      text-transform: uppercase;
      color: transparent;
    }
  }
}

.game-platform-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 6px;
  row-gap: 8px;
  margin-top: 10px;
  padding-bottom: 20px;

  .game-platform-item {
    width: 100%;
    position: relative;

    .game-platform-label {
      position: absolute;
      top: 0;
      width: 45%;

      &--hot {
        left: 0;
      }

      &--new {
        right: 0;
      }

      img {
        display: block;
        width: 100%;
      }
    }

    .game-platform-img {
      // background-color: #cccccc;
      width: 100%;
      // aspect-ratio: 1/1;
      background-size: cover;
      background-position: center center;
      position: relative;
      background-image: url("../assets/images/index/mini-game-bg.png");
      border-radius: 20px;
       min-height: 100px;


      &.game-fish {
        // aspect-ratio: 1/1.2;
        min-height: 100px;

      }

      .game--bg {
        min-height: 100px;
        border-radius: 8px;
        background-size: 100% 100%;
        background-position: top center;
        height: 100%;
        width: 100%;
        background-repeat: no-repeat;
      }
    }

    .game-platform-title {
      // padding: 0px 5px;
      // color: #ffe248;
      margin-top: 6px;
      color: #ffffff;
      font-weight: 600;
      font-size: 12px;
      line-height: 1.3;
      text-align: left;
      height: 30px;
      display: flex;
      word-break: break-all;
      // justify-content: center;
      // background: linear-gradient(270deg, #370f59 -0.1%, #57009d 50.22%, #340c56 97.6%);
    }
  }
}

.platform-game-container {
  display: grid;
  padding-top: 12px;
  // margin-bottom: 12px;
  column-gap: 8px;
  row-gap: 16px;
  padding-bottom: 10px;

  &.live-casino {
    padding-top: 8px;
    margin-bottom: 0px;
  }

  .swiper-scrollbar.swiper-scrollbar-horizontal {
    bottom: 0px;
    background: rgba(43, 55, 74, 0.6);
    padding: 2px;
    height: 10px;
  }

  .swiper-scrollbar-drag {
    background: rgba(255, 255, 255, 0.4);
  }

  &.grid-view {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 8px;
    row-gap: 16px;
  }

  &.sport-platform {
    grid-template-columns: 1fr;
    row-gap: 12px;

    .platform-game-item--img {
      border-radius: 8px;
    }
  }

  .platform-live-item {
    position: relative;

    &--img {
      background-size: cover;
      background-position: center center;
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;

      .platform-live-title {
        position: absolute;
        top: 20px;
        left: 20px;

        img {
          max-height: 22px;
        }
      }
    }
  }

  .platform-game-item {
    position: relative;

    &--img {
      background-size: cover;
      background-position: center center;
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .platform-game-title {
      text-align: left;
      margin-top: 6px;
      color: #ffffff;
      font-weight: bold;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100px;
    }

    img {
      display: block;
      width: 100%;
    }
  }
}

.floating-btn {
  z-index: 2001;

  img {
    width: 100%;
    max-width: 70px;
  }
}

.fullgame-dialog {
  // &.fullscreen {
  // top: 81px !important;
  // bottom: auto !important;
  // height: calc(100vh - 81px) !important;
  // }
}

.fullgame-card {
  margin: 0;
  // background-color: #101114;
  background-image: url(../assets/images/index/dialog-game-bg.png);
  background-position: top center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #1e1f24;
  max-width: 500px !important;
}

.fullgame-wrapper {
  padding: 0;

  .fullgame-header {
    // background-image: url(../assets/images/index/fullgame-banner.jpg);
    position: sticky;
    top: 60px;
    // background: salmon;
    z-index: 99;
    margin: 0 -2.5%;
    // min-height: 200px;
    padding: 12px;
  }

  .fullgame-search {
    margin-top: 10px;
    // background: #1E1F24;
    background: #0b0b0c;
    border-radius: 4px;
  }
}

.burning-hot {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.cat-selection-wrapper {
  margin-bottom: 10px;
  border-radius: 8px;
  padding: 2px;
  margin-bottom: 15px;

  // &:before {
  //   content: "";
  //   position: absolute;
  //   background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
  //   z-index: -1;
  //   top: -1px;
  //   bottom: -1px;
  //   left: -1px;
  //   right: -1px;
  // }

  .swiper-wrapper {
    // padding: 0 36px;
    border-radius: 8px;
  }

  .swiper-slide {
    max-width: 64px;
    border-radius: 8px;
  }

  // .swiper-button-next {
  //   right: 5px;
  //   top: 20px !important;
  //   height: 100% !important;
  //   &:after {
  //     content: "";
  //     background-image: url("../assets/images/index/nav-icon-right.png");
  //     background-size: cover;
  //     height: 12px;
  //     width: 14px;
  //     font-size: 0;
  //     background-repeat: no-repeat;
  //   }
  // }
  // .swiper-button-prev {
  //   left: 5px;
  //   top: 20px !important;
  //   height: 100% !important;
  //   &:after {
  //     content: "";
  //     background-image: url("../assets/images/index/nav-icon-left.png");
  //     background-size: cover;
  //     height: 12px;
  //     width: 14px;
  //     font-size: 0;
  //     background-repeat: no-repeat;
  //   }
  // }

  // .swiper-scrollbar.swiper-scrollbar-horizontal {
  //   // bottom: 0px;
  //   // background: rgba(43, 55, 74, 0.6);
  //   // padding: 2px;
  //   // height: 10px;
  // }

  .swiper-scrollbar-drag {
    // background: rgba(255, 255, 255, 0.4);
    background: transparent;
  }
}

.menu-category-btn {
  // background-image: url("../assets/images/index/category/menu-category-btns.png");
  background-size: 156px 379px;
  background-position: 0px 0px;
  width: 73px;
  height: 55px;
  background-repeat: no-repeat;

  // &.cat-lobby {
  //   background-position: -83px 0px;

  //   &.active {
  //     background-position: 0px 0px;
  //   }
  // }

  // &.cat-hot {
  //   background-position: -83px -65px;

  //   &.active {
  //     background-position: 0px -65px;
  //   }
  // }

  // &.cat-casino {
  //   background-position: -83px -130px;

  //   &.active {
  //     background-position: 0px -130px;
  //   }
  // }

  // &.cat-slot {
  //   background-position: -83px -195px;

  //   &.active {
  //     background-position: 0px -195px;
  //   }
  // }

  // &.cat-fishing {
  //   background-position: -83px -260px;

  //   &.active {
  //     background-position: 0px -260px;
  //   }
  // }

  // &.cat-sport {
  //   background-position: -83px -325px;

  //   &.active {
  //     background-position: 0px -325px;
  //   }
  // }
}

.cat-menu-item {
  img {
    width: 100%;
  }
}

.cat-selection-item {
  padding-top: 4px;
  padding-bottom: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: 0.3s all;
  width: 100%;
  position: relative;
  // background: linear-gradient(180deg, rgba(36, 36, 36, 1) 0%, rgba(35, 45, 31, 1) 100%);

  // &:after {
  //   content: "";
  //   position: absolute;
  //   right: 0;
  //   top: 10%;
  //   height: 80%;
  //   width: 2px;
  //   // background: salmon;
  //   background: linear-gradient(
  //     180deg,
  //     rgba(115, 115, 115, 0) 0%,
  //     rgba(153, 153, 153, 0.4) 48.5%,
  //     rgba(115, 115, 115, 0) 100%
  //   );
  // }

  &.active {
    // background: linear-gradient(180deg, rgba(97, 255, 0, 0) 0%, rgba(97, 255, 0, 0.25) 50.5%, rgba(97, 255, 0, 0) 100%);

    // &:before {
    //   content: "";
    //   position: absolute;
    //   bottom: 0;
    //   left: 0;
    //   height: 3px;
    //   width: 100%;
    //   background: #61ff00;
    //   border-radius: 4px;
    // }

    .cat-title {
      color: #ffffff;
    }
  }

  &:hover {
    filter: brightness(1.2);
  }

  // .cat-icon {
  //   height: 28px;
  //   display: flex;
  //   align-items: center;
  // }
  img {
    display: block;
    width: 100%;
    max-width: 100%;
  }

  .cat-title {
    position: absolute;
    bottom: 18px;
    font-size: 12px;
    font-weight: 400;
    color: #35648f;
    font-family: "Poppins", sans-serif;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
}

.platform-game-img {
  // background-color: #cccccc;
  width: 100%;
  aspect-ratio: 1/1.2;
  background-size: cover;
  background-position: center center;
  position: relative;
  background-image: url("../assets/images/index/mini-game-bg.png");
  background: transparent;
  // background-image: url("../assets/images/index/item-game-maintenance.png");
  border-radius: 8px;

  .game--bg {
    background-size: 100% 100%;
    background-position: center center;
    height: 100%;
    width: 100%;
    border-radius: 8px;
    background-repeat: no-repeat;
    // background-image: url("../assets/images/index/mini-game-bg.png");
  }
}

.loader-container {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
}

.btn-more-games {
  display: flex;
  justify-content: center;
  margin: auto;
  border: 2px solid #5eb673;
  padding: 12px 16px;
  width: 160px;
  border-radius: 8px;
  color: rgba(206, 206, 206, 0.8);
  font-size: 16px;
  margin-top: 20px;
  margin-bottom: 40px;
}

.back-btn {
  background: rgb(255, 255, 255, 0.2);
}

// lower android version
.android-8 {
  .game-platform-img {
    height: 80px;
  }
}

.announcement-card {
  padding-top: 16px;

  font-family: "Manrope", sans-serif;

  .q-tab__label {
    font-size: 16px;
    color: #000;
  }

  .q-tab--active .q-tab__indicator {
    height: 0px;
  }

  // .q-item__label {
  //   color: #fff;
  // }
}

.alert-img {
  // background-color: salmon;
  // width: 70% !important;
  // margin: auto;
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

.modal-home-popup {
  .q-card {
    background: transparent;
  }
}

// congrats container
// .congrats-button {
//   position: absolute;
//   bottom: -60px;
//   left: 50%;
//   transform: translateX(-50%);
// }

.congrats-button {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.congrats-wrapper {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.congrats-container {
  background: linear-gradient(180deg, #ffffff 0%, #d5e6ff 100%);
  max-width: 400px;
  width: 100%;
  padding: 16px;
  position: relative;
  overflow: visible !important; // override quasar default value
  border-radius: 12px;

  &:before {
    content: "";
    background-image: url(../assets/images/index/modal/congrats-container-light.png);
    background-size: 100% 100%;
    background-position: center center;
    background-repeat: no-repeat;
    width: 100%;
    height: 150px;
    position: absolute;
    left: 0;
    top: -150px;
  }

  .congrats-header {
    display: flex;
    justify-content: center;
    margin-top: -18px;
    z-index: 2;

    img {
      display: block;
      width: 100%;
      max-width: 320px;
      height: 60px;
    }
  }

  .congrats-coupons {
    img {
      display: block;
      width: 100%;
      margin: auto;
      max-width: 240px;
    }
  }

  .congrats-title {
    color: #458bff;
    display: flex;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }

  .congrats-highlight {
    color: #fff96f;
    font-size: 26px;
    font-weight: bold;
    text-align: center;
    background-image: url(../assets/images/index/modal/congrats-highlight-bg.png);
    padding: 2px 12px;
    background-repeat: no-repeat;
    background-size: 70% 100%;
    background-position: center;
    margin-top: 16px;
  }
}

.luckyspin-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.luckyspin-header {
  margin: 0 auto -5%;
  width: 90%;
  z-index: 2;
  img {
    display: block;
    width: 100%;
  }
}

.luckyspin-container {
  background-image: url(../assets/images/index/modal/luckyspin-bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  background-color: #113413;
  max-width: 400px;
  width: 100%;
  padding: 16px;
  position: relative;
  // overflow: visible !important;
  border-radius: 12px;
  padding: 16px;

  .luckyspin-title {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
}

.money-rain-close {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.hb-float {
  posiiton: relative;
  height: 100px;
  width: 100px;
  background: transparent;
  overflow: hidden;

  .q-carousel__control {
    display: none;
  }
}

.congrats-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.1);
}
</style>
