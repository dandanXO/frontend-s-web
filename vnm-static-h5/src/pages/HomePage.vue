<template>
  <div v-if="isH5 && topBoxVisible" class="download-top-container">
    <div class="download-top-box">
      <q-icon name="close" @click="closeTopBox" />
      <img class="headicon" src="../assets/logo-web.svg" alt="download-logo" />
      <div class="download-txt-container">
        <span class="download-title">
          <font class="sm-screen-txt">{{ $t("lang.app_download_title") }}</font>
        </span>
        <span class="sm-screen-txt">{{ $t("lang.app_download_desc") }}</span>
      </div>
      <div class="buttons">
        <div class="buttons">
          <q-btn
            :href="`${downloadUrl}`"
            target="_blank"
            :label="$t('lang.dowload_now')"
            color="brightbtn"
            class="top-btn sm-screen-txt"
            no-caps
          />
        </div>
      </div>
    </div>
  </div>

  <div class="home-header">
    <div class="header-left" @click="router.push('/')">
      <img alt="logo" src="../assets/logo-web.svg" />
    </div>
    <div class="header-middle" v-if="!store.token">
      <q-btn rounded no-caps color="brightbtn" class="sm-screen-txt" @click="router.push('/login')">
        {{ $t("lang.login") }}
      </q-btn>
      <q-btn rounded no-caps color="lightbluebtn" class="sm-screen-txt" @click="router.push('/register')">
        {{ $t("lang.register") }}
      </q-btn>
    </div>
    <div class="header-lang">
      <LangOptions />
    </div>

    <!-- <div class="header-right" @click="router.push('/account/inbox?redirect=home')">
      <img class="btn-pointer" src="../assets/images/home/home-message-box.png" />
      <div class="red-dot" v-if="unreadInboxMail > 0" />
    </div> -->
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
    />
  </q-carousel>

  <div class="mid-announcement-section">
    <div class="midd">
      <div class="station-notice-wrapper">
        <div class="volume">
          <img src="../assets/images/home/announce-icon.png" />
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
  </div>

  <div class="details-bar">
    <div class="message" @click="refreshBalance">
      <span class="main-balance" :class="!store.token ? 'main-nologin' : ''">
        {{
          store.token
            ? !isLoadingBalance
              ? "VNDP " + mainWallet.toFixed(2)
              : $t("lang.loading")
            : $t("lang.not_logged_in")
        }}
      </span>
      <span>{{ store.token ? $t("lang.central_wallet") : $t("lang.login_register_to_view") }}</span>
    </div>
    <div class="menulist">
      <router-link to="/finance/deposit?redirect=home" class="men btn-pointer">
        <img src="../assets/images/home/deposit-mid.png" />
        <div class="">{{ $t("lang.deposit") }}</div>
      </router-link>
      <router-link to="/finance/withdraw?redirect=home" class="men btn-pointer">
        <img src="../assets/images/home/withdraw-mid.png" />
        <div class="">{{ $t("lang.withdraw") }}</div>
      </router-link>
      <!-- <router-link to="/account/transfer?redirect=home" class="men btn-pointer">
        <img src="../assets/images/home/transfer-mid.png" />
        <div class="">{{ $t("lang.transfer") }}</div>
      </router-link> -->
      <router-link to="/account/vip?redirect=home" class="men btn-pointer">
        <img src="../assets/images/home/vip-mid.png" />
        <div class="">{{ $t("lang.vip") }}</div>
      </router-link>
    </div>
  </div>

  <div class="home-game-section">
    <div class="game-left-list">
      <div @click="selectTab('sport')" class="game-platform btn-pointer" id="sport-platform">
        <template v-if="tab === 'sport'">
          <img src="../assets/images/home/games/sport-icon-active.png" />
        </template>
        <template v-else>
          <img src="../assets/images/home/games/sport-icon.png" />
        </template>
        <span :class="tab === 'sport' && 'active'">{{ $t("lang.menu_sports") }}</span>
      </div>

      <div @click="selectTab('live')" class="game-platform btn-pointer" id="live-platform">
        <template v-if="tab === 'live'">
          <img src="../assets/images/home/games/live-icon-active.png" />
        </template>
        <template v-else>
          <img src="../assets/images/home/games/live-icon.png" />
        </template>
        <span :class="tab === 'live' && 'active'">{{ $t("lang.menu_livecasino") }}</span>
      </div>

      <div @click="selectTab('slot')" class="game-platform btn-pointer" id="slot-platform">
        <template v-if="tab === 'slot'">
          <img src="../assets/images/home/games/slot-icon-active.png" />
        </template>
        <template v-else>
          <img src="../assets/images/home/games/slot-icon.png" />
        </template>
        <span :class="tab === 'slot' && 'active'">{{ $t("lang.menu_slots") }}</span>
      </div>

      <div @click="selectTab('poker')" class="game-platform btn-pointer" id="poker-platform">
        <template v-if="tab === 'poker'">
          <img src="../assets/images/home/games/poker-icon-active.png" />
        </template>
        <template v-else>
          <img src="../assets/images/home/games/poker-icon.png" />
        </template>
        <span :class="tab === 'poker' && 'active'">{{ $t("lang.menu_poker") }}</span>
      </div>

      <div @click="selectTab('esport')" class="game-platform btn-pointer" id="esport-platform">
        <template v-if="tab === 'esport'">
          <img src="../assets/images/home/games/esport-icon-active.png" />
        </template>
        <template v-else>
          <img src="../assets/images/home/games/esport-icon.png" />
        </template>
        <span :class="tab === 'esport' && 'active'">{{ $t("lang.menu_esports") }}</span>
      </div>

      <div @click="selectTab('lottery')" class="game-platform btn-pointer" id="lottery-platform">
        <template v-if="tab === 'lottery'">
          <img src="../assets/images/home/games/lottery-icon-active.png" />
        </template>
        <template v-else>
          <img src="../assets/images/home/games/lottery-icon.png" />
        </template>
        <span :class="tab === 'lottery' && 'active'">{{ $t("lang.menu_lottery") }}</span>
      </div>

      <div @click="selectTab('fishing')" class="game-platform btn-pointer" id="fishing-platform">
        <template v-if="tab === 'fishing'">
          <img src="../assets/images/home/games/fish-icon-active.png" />
        </template>
        <template v-else>
          <img src="../assets/images/home/games/fish-icon.png" />
        </template>
        <span :class="tab === 'fishing' && 'active'">{{ $t("lang.menu_fishing") }}</span>
      </div>

      <div @click="selectTab('cockfight')" class="game-platform btn-pointer" id="cockfight-platform">
        <template v-if="tab === 'cockfight'">
          <img src="../assets/images/home/games/cockfight-icon-active.png" />
        </template>
        <template v-else>
          <img src="../assets/images/home/games/cockfight-icon.png" />
        </template>
        <span :class="tab === 'cockfight' && 'active'">{{ $t("lang.menu_cockfighting") }}</span>
      </div>
    </div>

    <div class="game-right-platform" v-scroll="onHomeScroll" id="id-right-platform">
      <!-- <div class="game-lists fade-in-image" id="esport-lists">
        <template v-for="(item, index) in esport" :key="index">
          <div
            class="platform-block"
            @click="playGame(item.gameName, item.code, item.gameCode)"
            :class="item.underMaintenance === true ? 'maintenance' : ''"
          >
            <MaintenanceBox :item="item" />

            <div
              class="platform-img-frame"
              :style="{
                'background-image': getImgPlatformBg(item.icon, item.name, item.alias)
              }"
            >
              <div class="platform-content">
                <div class="platform-title">{{ item.title }}</div>
              </div>
            </div>
          </div>
        </template>
      </div> -->

      <div class="game-lists fade-in-image" id="sport-lists">
        <template v-for="(item, index) in sport" :key="index">
          <div
            class="platform-block"
            @click="playGame(item.gameName, item.code, item.gameCode)"
            :class="item.underMaintenance === true ? 'maintenance' : ''"
          >
            <MaintenanceBox :item="item" />

            <div
              class="platform-img-frame"
              :style="{
                'background-image': getImgPlatformBg(item.icon, item.name, item.alias)
              }"
            >
              <div class="platform-content">
                <div class="platform-title">
                  {{ $t("lang.langVal") === "en" ? item.title_en : item.title_vn }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="game-lists fade-in-image" id="live-lists">
        <template v-for="(item, index) in livecasino" :key="index">
          <div
            class="platform-block"
            @click="playGame(item.gameName, item.code, item.gameCode)"
            :class="item.underMaintenance === true ? 'maintenance' : ''"
          >
            <MaintenanceBox :item="item" />

            <div
              class="platform-img-frame"
              :style="{
                'background-image': getImgPlatformBg(item.icon, item.name)
              }"
            >
              <div class="platform-content">
                <div class="platform-title">
                  {{ $t("lang.langVal") === "en" ? item.title_en : item.title_vn }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="game-lists fade-in-image" id="slot-lists">
        <template v-for="(item, index) in slot" :key="index">
          <div
            class="platform-block"
            @click="router.push({ path: '/slot', query: { platform: item.code } })"
            :class="item.underMaintenance === true ? 'maintenance' : ''"
          >
            <MaintenanceBox :item="item" />

            <div
              class="platform-img-frame"
              :style="{
                'background-image': getImgPlatformBg(item.icon, item.name, item.alias)
              }"
            >
              <div class="platform-content">
                <div class="platform-title">
                  {{ $t("lang.langVal") === "en" ? item.title_en : item.title_vn }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="game-lists fade-in-image" id="poker-lists">
        <template v-for="(item, index) in poker" :key="index">
          <div
            class="platform-block"
            @click="playGame(item.gameName, item.code, item.gameCode)"
            :class="item.underMaintenance === true ? 'maintenance' : ''"
          >
            <MaintenanceBox :item="item" />

            <div
              class="platform-img-frame"
              :style="{
                'background-image': getImgPlatformBg(item.icon, item.name, item.alias)
              }"
            >
              <div class="platform-content">
                <div class="platform-title">
                  {{ $t("lang.langVal") === "en" ? item.title_en : item.title_vn }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="game-lists fade-in-image" id="esport-lists">
        <template v-for="(item, index) in esport" :key="index">
          <div
            class="platform-block"
            @click="playGame(item.gameName, item.code, item.gameCode)"
            :class="item.underMaintenance === true ? 'maintenance' : ''"
          >
            <MaintenanceBox :item="item" />

            <div
              class="platform-img-frame"
              :style="{
                'background-image': getImgPlatformBg(item.icon, item.name, item.alias)
              }"
            >
              <div class="platform-content">
                <div class="platform-title">
                  {{ $t("lang.langVal") === "en" ? item.title_en : item.title_vn }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="game-lists fade-in-image" id="lottery-lists">
        <template v-for="(item, index) in lottery" :key="index">
          <div
            class="platform-block"
            @click="playGame(item.gameName, item.code, item.gameCode)"
            :class="item.underMaintenance === true ? 'maintenance' : ''"
          >
            <MaintenanceBox :item="item" />

            <div
              class="platform-img-frame"
              :style="{
                'background-image': getImgPlatformBg(item.icon, item.name, item.alias)
              }"
            >
              <div class="platform-content">
                <div class="platform-title">
                  {{ $t("lang.langVal") === "en" ? item.title_en : item.title_vn }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="game-lists fade-in-image" id="fishing-lists">
        <template v-for="(item, index) in fishing" :key="index">
          <div
            class="platform-block"
            @click="router.push({ path: '/fishing', query: { platform: item.code } })"
            :class="item.underMaintenance === true ? 'maintenance' : ''"
          >
            <MaintenanceBox :item="item" />

            <div
              class="platform-img-frame"
              :style="{
                'background-image': getImgPlatformBg(item.icon, item.name, item.alias)
              }"
            >
              <div class="platform-content">
                <div class="platform-title">
                  {{ $t("lang.langVal") === "en" ? item.title_en : item.title_vn }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="game-lists fade-in-image" id="cockfight-lists">
        <template v-for="(item, index) in cockfight" :key="index">
          <div
            class="platform-block"
            @click="playGame(item.gameName, item.code, item.gameCode)"
            :class="item.underMaintenance === true ? 'maintenance' : ''"
          >
            <MaintenanceBox :item="item" />

            <div
              class="platform-img-frame"
              :style="{
                'background-image': getImgPlatformBg(item.icon, item.name, item.alias)
              }"
            >
              <div class="platform-content">
                <div class="platform-title">
                  {{ $t("lang.langVal") === "en" ? item.title_en : item.title_vn }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>

  <div class="float-service" @click="toggleMenuFloat">
    <div class="float-btn"><img src="../assets/images/home/floating-btn.png" width="20px" /></div>
    <div class="float-menu" :class="isMenuFloat && 'show-menu'">
      <router-link to="/liveChat" class="menu-item"><img src="../assets/images/home/float-cs-01.png" /></router-link>
      <a href="mailto:vnsupport@tf88.com" class="menu-item"><img src="../assets/images/home/float-cs-02.png" /></a>
      <a href="tel:+84945091999" class="menu-item"><img src="../assets/images/home/float-cs-03.png" /></a>
      <a href="https://t.me/TF88_CS" target="_blank" class="menu-item">
        <img src="../assets/images/home/float-cs-04.png" />
      </a>
      <a href="https://chat.zalo.me/?phone=+639672541561" target="_blank" class="menu-item">
        <img src="../assets/images/home/float-cs-05.png" />
      </a>
      <a href="https://www.facebook.com/TF88vnofficial" target="_blank" class="menu-item">
        <img src="../assets/images/home/float-cs-06.png" />
      </a>
    </div>
  </div>
  <q-page-sticky position="bottom-right" :offset="fabPos">
    <q-fab
      icon="money"
      color="info"
      :disable="draggingFab"
      v-touch-pan.prevent.mouse="moveFab"
      @click="getRebateAmt"
      persistent
    >
      <template v-slot:icon="{ opened }">
        <q-icon :class="{ 'example-fab-animate--hover': opened !== true }" name="money" />
      </template>

      <template v-slot:active-icon="{ opened }">
        <q-icon :class="{ 'example-fab-animate': opened === true }" name="money" />
      </template>
    </q-fab>
  </q-page-sticky>
  <q-dialog
    width="100%"
    class="modal-update-div"
    v-model="isRebateModalVisible"
    show-cancel-button
    :showCancelButton="false"
    :showConfirmButton="false"
  >
    <q-card style="width: 100%" class="bg-bright text-black">
      <div class="modalcontent">
        <div class="headers">
          <div style="width: 16px">&nbsp;</div>
          <div class="titles">{{ $t("lang.menu_rebate") }}</div>
          <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
        </div>
        <div class="contents">{{ rebateAmt }}</div>
        <div class="btnsreas">
          <div class="confirmsbtns common-md-btn" @click="claimRebateAmt">{{ $t("lang.rebate_claim_now") }}</div>
          <div class="cancels common-md-white-btn" @click="isRebateModalVisible = false">{{ $t("lang.cancel") }}</div>
        </div>
      </div>
    </q-card>
  </q-dialog>

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
          <div style="width: 16px">&nbsp;</div>
          <div class="titles">系统提示</div>
          <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
        </div>
        <div class="contents">检测到新版本，您是否要更新？</div>
        <div class="btnsreas">
          <div class="confirmsbtns common-md-btn" @click="openDownloadPage">立即更新</div>
          <div class="cancels common-md-white-btn" @click="cancelUpdate">取消</div>
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    width="100%"
    class="modal-common-div"
    v-model="isLoginModal"
    show-cancel-button
    :showCancelButton="false"
    :showConfirmButton="false"
  >
    <q-card style="width: 100%" class="modalcontent">
      <div class="headers">
        <div class="titles">{{ $t("lang.system_hint") }}</div>
        <q-btn class="color-font-1" flat v-close-popup round dense icon="close" />
      </div>
      <div class="contents">{{ $t("lang.system_please_login") }}</div>
      <div class="btnsreas">
        <div class="confirmsbtns common-md-btn btn-standard-height" @click="router.push('/login')">
          {{ $t("lang.system_loginnow") }}
        </div>
        <div class="cacnels common-md-white-btn btn-standard-height" @click="isLoginModal = false">
          {{ $t("lang.system_cancel") }}
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="isStationNotice">
    <q-card style="width: 100%" class="bg-primary text-black">
      <q-card-section class="q-mb-md">
        <q-tabs
          v-model="activeKey"
          dense
          class="text-white"
          active-color="white"
          indicator-color="white"
          align="justify"
        >
          <q-tab v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id" :label="tab.name" />
        </q-tabs>

        <!-- <q-separator /> -->

        <q-tab-panels v-model="activeKey" animated>
          <q-tab-panel v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id">
            <q-list style="max-height: 65vh">
              <div v-for="(ann, idx) in announcementList" :key="idx">
                <span v-if="ann.typeId === tab.id">
                  <q-expansion-item
                    style="max-height: 65vh; overflow: auto"
                    group="somegroup"
                    icon="volume_up"
                    :label="ann.title"
                  >
                    <q-card>
                      <q-card-section style="background: transparent">
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
  </q-dialog>
</template>

<script>
import { computed, defineComponent, onActivated, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api, eventapi } from "boot/axios";
import { cached } from "boot/cache";
import { Platform, useQuasar } from "quasar";
import { userStore } from "stores/index";
import GameModal from "components/modal/GameModal";
import LangOptions from "components/LangOptions";
import MarqueeText from "vue-marquee-text-component";
import { App } from "@capacitor/app";

import { useUI } from "stores/ui";
// Import Swiper Vue.js components
import SwiperCore, { A11y, Controller, HashNavigation, Keyboard, Mousewheel, Scrollbar, Thumbs } from "swiper";
import moment from "moment";
// Import Swiper styles
import "swiper/css";
import "swiper/css/scrollbar";
import { translateRecord } from "src/directives/translate";
import MaintenanceBox from "components/MaintenanceBox.vue";

SwiperCore.use([Keyboard, Mousewheel, A11y, HashNavigation]);

export default defineComponent({
  name: "IndexPage",
  components: {
    MaintenanceBox,
    GameModal,
    MarqueeText,
    LangOptions
  },
  setup() {
    const fabPos = ref([18, 18]);
    const draggingFab = ref(false);
    const isRebateModalVisible = ref(false);
    const rebateAmt = ref(0);
    const getRebateAmt = () => {
      if (store.hasToken()) {
        eventapi.get("/daily-rebate/available-amount").then((res) => {
          if (res.code === 0) {
            rebateAmt.value = res.data;
            isRebateModalVisible.value = true;
          } else {
          }
        });
      } else {
        isLoginModal.value = true;
      }
    };
    const claimRebateAmt = () => {
      eventapi.put("/bonus/claim/vnm-daily-rebate").then((res) => {
        if (res.code === 0) {
          isRebateModalVisible.value = false;
        } else {
        }
      });
    };
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

    const scrollToTop = (el) => {
      window.scrollTo(0, 0, "smooth");
    };

    const isScrolling = ref(false);
    const scrollToSlide = (slide_id) => {
      // debugger;
      isScrolling.value = true;
      var slideItem = document.getElementById(slide_id);
      var bodyElement = document.body;

      if (slideItem) {
        var divOffset = slideItem.getBoundingClientRect();
        var bodyOffset = bodyElement.getBoundingClientRect();

        var distanceToBodyTop = divOffset.top - bodyOffset.top;
        var y_axis = distanceToBodyTop - 8;

        window.scroll({
          top: y_axis,
          left: 0,
          behavior: "smooth"
        });
      }

      setTimeout(() => {
        isScrolling.value = false;
      }, 2000);
    };

    const onHomeScroll = (position) => {
      if (route.path === "/") {
        if (!isScrolling.value) {
          const rightPlatform = document.getElementById("id-right-platform");
          const platformBlocks = document.getElementsByClassName("platform-block");
          const blockHeight = platformBlocks ? (platformBlocks[0].offsetHeight / 4) * 3 : 75;

          var checkItem1 = document.getElementById("sport-lists");
          var checkItem2 = document.getElementById("live-lists");
          var checkItem3 = document.getElementById("slot-lists");
          var checkItem4 = document.getElementById("poker-lists");
          var checkItem5 = document.getElementById("esport-lists");
          var checkItem6 = document.getElementById("lottery-lists");
          var checkItem7 = document.getElementById("fishing-lists");
          var checkItem8 = document.getElementById("cockfight-lists");

          var positionTop1 = checkItem1.getBoundingClientRect().top;
          var positionTop2 = checkItem2.getBoundingClientRect().top;
          var positionTop3 = checkItem3.getBoundingClientRect().top;
          var positionTop4 = checkItem4.getBoundingClientRect().top;
          var positionTop5 = checkItem5.getBoundingClientRect().top;
          var positionTop6 = checkItem6.getBoundingClientRect().top;
          var positionTop7 = checkItem7.getBoundingClientRect().top;
          var positionTop8 = checkItem8.getBoundingClientRect().top;

          var bodyElement = document.body;
          var bodyOffset = bodyElement.getBoundingClientRect();
          var windowHeight = window.innerHeight;

          if (windowHeight + 15 > bodyOffset.bottom) {
            tab.value = "cockfight";
          } else if (0 > positionTop7 - 5 && positionTop8 >= blockHeight) {
            tab.value = "fishing";
          } else if (0 > positionTop6 - 5 && positionTop7 >= blockHeight) {
            tab.value = "lottery";
          } else if (0 > positionTop5 - 5 && positionTop6 >= blockHeight) {
            tab.value = "esport";
          } else if (0 > positionTop4 - 5 && positionTop5 >= blockHeight) {
            tab.value = "poker";
          } else if (0 > positionTop3 - 5 && positionTop4 >= blockHeight) {
            tab.value = "slot";
          } else if (0 > positionTop2 - 5 && positionTop3 >= blockHeight) {
            tab.value = "live";
          } else if (0 > positionTop1 - 5 && positionTop2 >= blockHeight) {
            tab.value = "sport";
          }
        }
      }
    };

    const setSelectedSwiper = (tab) => {
      if (tab === "sport") {
        // slideIndex = 0;
        scrollToSlide("sport-lists");
      }
      if (tab === "live") {
        scrollToSlide("live-lists");
      }
      if (tab === "poker") {
        scrollToSlide("poker-lists");
      }
      if (tab === "lottery") {
        scrollToSlide("lottery-lists");
      }
      if (tab === "slot") {
        scrollToSlide("slot-lists");
      }
      if (tab === "esport") {
        scrollToSlide("esport-lists");
      }
      if (tab === "fishing") {
        scrollToSlide("fishing-lists");
      }
      if (tab === "cockfight") {
        scrollToSlide("cockfight-lists");
      }
    };

    const onSlideChange = (swiper) => {
      const activeIndex = swiper.activeIndex;
      const activeSlide = swiper.slides[activeIndex];
      const activeSlideClassName = activeSlide.className;
      const keywords = ["slot", "live", "sport", "esport", "slot", "others"];
      for (const keyword of keywords) {
        if (activeSlideClassName.includes(keyword)) {
          selectedTab.value = keyword;
        }
      }
    };

    const imgNotFound = require(`../assets/images/home/img-not-found.png`);

    const selectedTab = ref("");
    const esport = ref([]);
    const sport = ref([]);
    const livecasino = ref([]);
    const cockfight = ref([]);
    const poker = ref([]);
    const lottery = ref([]);
    const slot = ref([]);
    const fishing = ref([]);
    const casuals = ref([]);

    const ui = useUI();
    const scrollPageRef = ref(null);
    const isH5 = ref(false);
    const topBoxVisible = ref(true);
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

      let downloadPopup = sessionStorage.getItem("DOWNLOAD_POPUP");
      if (downloadPopup) {
        topBoxVisible.value = false;
      }
    };

    const $q = useQuasar();
    const banners = ref([]);
    const route = useRoute();
    const router = useRouter();
    const store = userStore();
    const mainWallet = computed(() => {
      return store.balance;
    });
    const allGames = ref(null);
    const playGame = (gameName, platformCode, gameCode, gameStatus) => {
      // console.log(gameName)
      // console.log(platformCode)
      // console.log(gameCode)
      // console.log(gameStatus);
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
          if (now.getTime() > item.expiry || item.id !== res.data["id"] || item.frequency !== res.data["frequency"]) {
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
                homePopupImg.value = process.env.IMAGE_CDN + "/promo/" + res.data["mobileImgUrl"];
                homePopupContent.value = res.data["content"];
                homePopupType.value = res.data["type"];
                homePopupId.value = res.data["id"];
                homePopupFrequency.value = res.data["frequency"];
                isFirstView.value = true;
              }
            }
          })
          .catch(() => {});
      }
    };

    function loadData() {
      api
        .get("/promo/banner?category=HOME")
        .then((res) => {
          if (res.code === 0) {
            banners.value = res.data;
          }
        })
        .catch(() => {});
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
          esport.value = [];
          sport.value = [];
          livecasino.value = [];
          cockfight.value = [];
          poker.value = [];
          lottery.value = [];
          slot.value = [];
          fishing.value = [];
          casuals.value = [];

          pf.forEach((element) => {
            const platTypes = element.gameType.split(",");
            // console.log(platTypes);
            if (platTypes.indexOf("ESPORT") > -1) {
              var espObj = Object.assign({}, element);
              espObj.title_vn = espObj.name + " ESPORTS";
              espObj.title_en = espObj.name + " ESPORTS";
              espObj.icon = "esport";
              esport.value.push(espObj);
            }

            if (platTypes.indexOf("SPORT") > -1) {
              var spObj = Object.assign({}, element);
              if (spObj.name === "GFSBO") {
                spObj.name = "SBO";
              }

              spObj.title_vn = "Thể Thao " + spObj.name;
              spObj.title_en = "Sport " + spObj.name;
              spObj.icon = "sport";
              sport.value.push(spObj);
            }
            if (platTypes.indexOf("LIVE") > -1) {
              var liveObj = Object.assign({}, element);
              if (liveObj.name === "AE") {
                liveObj.name = "Sexy";
              }
              liveObj.title_vn = liveObj.name + " Live Casino";
              liveObj.title_en = liveObj.name + " Live Casino";
              liveObj.icon = "live";
              livecasino.value.push(liveObj);
            }
            if (platTypes.indexOf("COCKFIGHT") > -1) {
              var cockObj = Object.assign({}, element);
              cockObj.title_vn = "ĐÁ GÀ";
              cockObj.title_en = "Cockfighting";
              cockObj.icon = "cockfight";
              cockfight.value.push(cockObj);
            }
            if (platTypes.indexOf("SLOT") > -1) {
              var slotObj = Object.assign({}, element);
              if (slotObj.name === "JiliGames") {
                slotObj.name = "Jili";
              }
              if (slotObj.name === "AG") {
                slotObj.name = "XIN";
              }
              slotObj.title_vn = slotObj.name + " Slots";
              slotObj.title_en = slotObj.name + " Slot";
              slotObj.icon = "slot";

              let slotItem = {
                id: slotObj.id,
                code: slotObj.code,
                icon: slotObj.name,
                title: slotObj.title
              };

              ui.slotLists.push(slotItem);
              slot.value.push(slotObj);
            }

            if (platTypes.indexOf("FISH") > -1 && element.code !== "AGF") {
              var fishObj = Object.assign({}, element);
              if (fishObj.name === "JiliGames") {
                fishObj.name = "Jili";
              }
              fishObj.title_vn = fishObj.name + " Bắn Cá";
              fishObj.title_en = fishObj.name + " Fishing";
              fishObj.icon = "fish";
              fishing.value.push(fishObj);
            }
            if (platTypes.indexOf("POKER") > -1) {
              var pokerObj = Object.assign({}, element);
              pokerObj.title_vn = pokerObj.name + " Poker";
              pokerObj.title_en = pokerObj.name + " Poker";
              pokerObj.icon = "poker";
              if (pokerObj.code === "GPI") {
                pokerObj.gameCode = "";
              }
              poker.value.push(pokerObj);
            }
            if (platTypes.indexOf("LOTTERY") > -1) {
              var lottObj = Object.assign({}, element);
              lottObj.title_vn = "Xổ Số " + lottObj.name;
              lottObj.title_en = "Lottery " + lottObj.name;
              lottObj.icon = "lottery";
              if (lottObj.code === "GPI") {
                lottObj.gameCode = "thailottery";
              }
              lottery.value.push(lottObj);
            }
          });

          esport.value = esport.value.sort((a, b) => {
            return a.sequence - b.sequence;
          });
        })
        .catch((err) => {});
    };

    const tab = ref("sport");
    const selectTab = (item) => {
      tab.value = item;
      setSelectedSwiper(item);
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
    };

    const isLoadingBalance = ref(false);
    const refreshBalance = () => {
      if (store.token) {
        isLoadingBalance.value = true;
        store.getBalance().then((res) => {
          isLoadingBalance.value = false;
        });
      } else {
        router.push("/login");
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
      if (Platform.is.android && Platform.is.capacitor) {
        const info = await App.getInfo();
        var current_version = parseInt(info.version.replace(/\./g, "") + info.build);
        const appType = "ALL";
        const device = Platform.is.android ? "ANDROID" : "IOS";
        const res = await api.get(`/config/appVersionAndUrl?type=${appType}&device=${device}`);
        if (res.code === 0) {
          var version_info = res.data.version;
          var latest_ver_no = parseInt(version_info.replace(/\./g, ""));
          download_url.value = res.data.url;
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

    const closeTopBox = () => {
      isH5.value = false;
      sessionStorage.setItem("DOWNLOAD_POPUP", "1");
    };

    const downloadUrl = ref("");

    const getAppDownloadUrl = () => {
      api
        .get("/app/getAppData?siteCode=lh1&appType=ALL_SITE")
        .then((res) => {
          // console.log(res);
          downloadUrl.value = res.data.downloadPageUrl;
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const getImgPlatformLogo = (platform, code, alias) => {
      try {
        return `${require(`../assets/images/home/${platform}/logo-${code.toLowerCase()}.png`)}`;
      } catch (e) {
        return `${require(`../assets/images/home/logo-empty.png`)}`;
      }
    };

    const getImgPlatformBg = (platform, code, alias) => {
      try {
        return `url(${require(`../assets/images/home/${platform}/platform-item-${code.toLowerCase()}.png`)})`;
      } catch (e) {
        return `url(${require(`../assets/images/home/${platform}/platform-item-empty.png`)})`;
      }
    };

    const unreadInboxMail = ref(0);
    const getUnreadTotal = () => {
      if (store.token) {
        return api.get("/session/inbox/getUnreadTotal").then((res) => {
          if (res.code === 0) {
            unreadInboxMail.value = res.data;
          }
        });
      }
    };

    onActivated(() => {
      getPlatList();
      loadData();
      loadAnnouncement();
      checkPlatform();
      getVersionNo();
      checkShowImgTop();
      getAppDownloadUrl();
      getUnreadTotal();
    });

    const imageLoading = ref(false);

    const isMenuFloat = ref(false);

    const toggleMenuFloat = () => {
      isMenuFloat.value = !isMenuFloat.value;
    };

    const isLoginModal = ref(false);

    return {
      imageLoading,
      slide: ref(0),
      tab,
      selectTab,
      imgNotFound,
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
      scrollPageRef,
      announcementList,
      isStationNotice,
      openPopup,
      noticeTitle,
      announcementTypes,
      activeKey,
      gotoPromo,
      onHomeScroll,
      router,
      sport,
      esport,
      slot,
      livecasino,
      cockfight,
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
      isImportantAnnoucementModal,
      getImgPlatformLogo,
      getImgPlatformBg,
      moment,
      unreadInboxMail,
      getUnreadTotal,
      topBoxVisible,
      isMenuFloat,
      toggleMenuFloat,
      isRebateModalVisible,
      rebateAmt,
      getRebateAmt,
      claimRebateAmt,
      fabPos,
      draggingFab,
      isLoginModal,

      moveFab(ev) {
        draggingFab.value = ev.isFirst !== true && ev.isFinal !== true;
        fabPos.value = [fabPos.value[0] - ev.delta.x, fabPos.value[1] - ev.delta.y];
      }
    };
  }
});
</script>

<style scoped lang="scss">
.float-service {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .float-btn {
    margin-right: -5px;
  }

  .float-menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0px -8px 8px 0px #c3d4e6 inset;
    background: rgba(252, 253, 254, 0.3);
    padding: 12px 6px;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    backdrop-filter: blur(5px);
    margin-right: calc(-100% - 16px);
    transition: 0.3s all;

    &.show-menu {
      margin-right: 0;
    }

    .menu-item {
      padding: 8px;

      img {
        display: block;
        width: 30px;
        // width: 100%;
        // max-width: 30px;
      }
    }
  }
}

.q-page-container {
  min-height: 100vh;
}

.download-top-container {
  padding: 8px 10px;
  background: $white;
  box-shadow: 0px 5px 10px 0px #0000001f;

  .download-top-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;

    .q-icon {
      font-size: 1.5rem;
      color: $font-3;
    }

    .headicon {
      flex: 2;
      width: 15%;
      //width: 120px;
    }

    .download-txt-container {
      flex: 4;
      font-size: 1rem;
      line-height: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: $font-1;

      .download-title {
        font-size: 1.2rem;
        color: $font-3;
        font-weight: 600;
      }
    }

    .buttons {
      display: flex;
      gap: 5px;
    }

    .top-btn {
      font-size: 1rem;
      border-radius: 10px;
      flex: 1;
      width: 15%;
    }
  }
}

.q-carousel.home {
  width: calc(100% - 2rem);
  margin: 10px auto;
  height: auto;
  border-radius: 16px;
  aspect-ratio: 1000/400;

  .q-panel > div {
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }

  .q-carousel__navigation--bottom {
    bottom: 30px;
  }
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: $box-width;
  margin: 0 auto;
  padding: 4px;

  .header-left {
    height: 45px;

    @media (max-width: 400px) {
      height: 35px;
    }

    img {
      height: 100%;
      width: auto;
    }
  }

  .header-middle {
    margin-left: auto;
    margin-right: 12px;
    display: flex;
    gap: 12px;

    :deep(.q-btn) {
      min-height: 12px;
      font-weight: bold;
      @media (max-width: 400px) {
        font-size: 80%;
      }
    }
  }

  .header-lang {
    // .lang-container {
    //   img {
    //     display: block;
    //     width: 30px;
    //     height: 30px;
    //   }

    //   :deep(.q-field__marginal) {
    //     min-height: 40px;
    //     height: 40px;
    //     display: none;
    //   }

    //   :deep(.q-field__native) {
    //     min-height: 30px;
    //     height: 30px;
    //     padding: 0;
    //   }
    // }
  }

  .header-right {
    height: 25px;
    position: relative;

    img {
      height: 100%;
      width: auto;
    }

    .red-dot {
      height: 10px;
      width: 10px;
      background: #db0011;
      border-radius: 50%;
      position: absolute;
      top: -3px;
      right: -3px;
    }
  }
}

.mid-announcement-section {
  width: $box-width;
  margin: 10px auto 10px;
  height: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .hot-match-div {
    background-image: url("../assets/images/home/match-icon.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    height: 36px;
    aspect-ratio: 128/40;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: $white;
    gap: 5px;

    span {
      white-space: nowrap;
    }

    img {
      height: 80%;
      width: auto;
      margin-left: 3px;
      margin-bottom: 3px;
    }
  }

  .midd {
    position: relative;
    overflow: hidden;
  }
}

.details-bar {
  width: $box-width;
  margin: 0 auto;
  gap: 10px;
  padding: 10px 0px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .message {
    flex: 3;
    padding: 0px 8px 0px 0px;
    //border-right: 1px dashed $font-1;
    color: $font-1;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
  }

  .main-balance {
    font-size: 1.6rem;
    color: $dark;

    &.main-nologin {
      font-size: 1rem;
    }
  }

  .menulist {
    flex: 4;
    // padding-left: 8px;
    display: flex;
    // justify-content: space-evenly;
    justify-content: space-between;
    gap: 4px;

    .men {
      text-decoration: none;
      color: $font-4;
      gap: 2px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 1.2rem;

      &:active {
        background: $grey-color;
      }

      img {
        display: block;
        height: 2rem;
      }
    }
  }
}

.modal-update-div {
  .modalcontent {
    background: $white;
    height: 232px;
    border-radius: 10px;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0px 0px 16px;

    .headers {
      width: calc(100% - 16px);
      border-radius: 10px 10px 0px 0px;
      box-sizing: border-box;
      height: 55px;
      line-height: 55px;
      background: $white;
      color: $primary;
      text-align: center;
      font-size: 1.2rem;
      border-bottom: 2px solid #ecedf0;
      font-weight: bold;
      letter-spacing: 1px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .contents {
      width: 100%;
      box-sizing: border-box;
      padding: 20px 12px 15px;
      text-align: center;
      color: #468cff;
      font-size: 2.2rem;

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
      padding: 0 1rem;
      margin-top: 20px;
      gap: 15px;

      .cancels {
        flex: 1;
        box-sizing: border-box;
        text-align: center;
        letter-spacing: 1px;
        max-width: 190px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        padding: 10px !important;
      }

      .confirmsbtns {
        flex: 1;
        box-sizing: border-box;
        text-align: center;
        max-width: 190px;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 1px;
        padding: 10px !important;
      }
    }
  }
}

.q-card__section {
  background: rgba(0, 0, 0, 0.1);
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

.home-game-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: $box-width;
  margin: 0px auto 30px;
  gap: 8px;

  .game-left-list {
    position: sticky;
    padding-top: 10px;
    top: 0;
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    max-width: 58px;

    > div {
      width: 100%;
    }

    img {
      width: 100%;
    }

    .game-platform {
      position: relative;
      span {
        position: absolute;
        text-align: center;
        font-size: 9px;
        top: 35px;
        left: 50%;
        transform: translateX(-50%);
        color: #7a80a1;
        line-height: 1;

        &.active {
          color: #ffffff;
        }
      }
    }
  }

  .game-right-platform {
    padding-top: 10px;
    flex: 11;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .game-lists {
      gap: 8px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 8px;
    }

    > div {
      width: 100%;
    }

    img {
      width: 100%;
    }

    .platform-block {
      cursor: pointer;
      width: 100%;
      position: relative;

      &.maintenance {
        pointer-events: none;

        .platform-img-frame {
          filter: blur(2px);
        }
      }

      &.maintenance:after {
        content: "";
        position: absolute;
        background: #012c6a50;
        top: 0%;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 12px;
        color: #ffffff;
        font-size: 24px;
        font-weight: bold;
      }

      &:hover {
        opacity: 0.9;
      }

      &:active {
        filter: brightness(0.85);
        transform: translate(0px, 1px);
      }

      .platform-img {
        width: 100%;
        max-width: 100%;
        height: auto;
        background-size: contain;
        background-repeat: no-repeat;
        aspect-ratio: 819/295;
      }

      .platform-img-frame {
        border-radius: 12px;
        height: auto;
        width: 100%;
        background-color: #f4f9fe;
        background-size: cover;
        background-position: top center;
        background-repeat: no-repeat;
        aspect-ratio: 819/295;
        position: relative;
        overflow: hidden;
        display: grid;
        grid-template-columns: 50% 50%;
        box-shadow: -1px 5px 11px rgb(0 0 0 / 10%);

        .platform-content {
          width: 100%;
          display: flex;
          flex-direction: column;
          // align-items: center;
          justify-content: center;
          margin-left: 18px;
        }

        // .platform-item-bg {
        // width: 80%;
        // height: 100%;
        // background-repeat: no-repeat;
        // background-size: contain;
        // background-position: bottom center;
        // margin: auto;
        // }

        .platform-logo {
          height: 1.6rem;

          img {
            display: block;
            height: 100%;
            width: auto;
          }
        }

        .platform-title {
          font-weight: 800;
          font-size: 1.175rem;
          line-height: 1.3;
          margin-top: 10%;
          text-align: left;
        }

        .platform-subtitle {
          margin-top: 5%;
          font-size: 0.875rem;
          line-height: 1;
          color: $font-1;
        }

        .platform-rebate {
          margin-bottom: 5%;
          margin-top: auto;
          font-size: 0.875rem;
          line-height: 1;
          color: $font-1;
          padding: 0.35rem 0.75rem;
          border-radius: 1rem;
          border: 1px solid #fff;
          background: linear-gradient(180deg, #fafbff 0%, #e6edfe 100%);
          box-shadow: 0px 4px 4px 0px rgba(154, 176, 255, 0.1);
          display: none;
          align-items: center;

          span {
            font-weight: 800;
            font-size: 120%;
            display: inline-block;
            margin-left: 0.25rem;
          }
        }

        .platform-label {
          position: absolute;
          top: 0;
          left: 0;
          overflow: hidden;
          width: 40%;
          height: 40%;
          background-image: url(../assets/images/home/label-certified.png);
          background-size: contain;
          background-repeat: no-repeat;
        }
      }
    }
  }

  .fade-in-image {
    animation: fadeIn 1.5s;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

//Above is New One (LH)

@media (max-width: 480px) {
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
