<template>
  <div v-if="isH5 && topBoxVisible" class="download-top-container">
    <div class="download-top-box">
      <q-icon name="close" @click="closeTopBox" />
      <img class="headicon" src="../assets/logo-1.png" alt="download-logo" />
      <div class="download-txt-container">
        <span class="download-title">雷火电竞 app 下载</span>
        <span>亚洲第一实时滚球</span>
      </div>
      <div class="buttons">
        <div class="buttons">
          <q-btn @click="openDownloadAppLink" label="立即下载" color="brightbtn" class="top-btn" />
        </div>
      </div>
    </div>
  </div>

  <div class="home-header">
    <div class="header-left">
      <img alt="logo" src="../assets/logo-1.png" />
    </div>
    <div class="header-right" @click="() => (hasDrawer = !hasDrawer)">
      <img
        class="btn-pointer"
        :src="
          $q.dark.isActive
            ? require('../assets/images/home/home-hamburger-menu-dark.png')
            : require('../assets/images/home/home-hamburge-menu2.png')
        "
      />
      <div class="red-dot" v-if="unreadInboxMail > 0" />
    </div>
  </div>

  <q-drawer side="left" :width="300" :breakpoint="500" overlay v-model="hasDrawer">
    <div class="home-drawer">
      <user-profile />
      <div class="home-drawer__divider" />
      <link-group />
      <div class="home-drawer__divider" />
      <system-config />
    </div>
  </q-drawer>

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

    <!--    <div class="hot-match-div">-->
    <!--      <img src="../assets/images/home/hot-icon.png" />-->
    <!--      <span>热门赛事</span>-->
    <!--    </div>-->
  </div>

  <div class="details-bar">
    <div class="message" @click="refreshBalance">
      <span class="main-balance" :class="!store.token ? 'main-nologin' : ''">
        {{ store.token ? (!isLoadingBalance ? "¥" + floor(mainWallet, 2) : "加载中...") : "您还未登录" }}
      </span>
      <span>{{ store.token ? "中心钱包" : "登录/注册后查看" }}</span>
    </div>
    <div class="menulist">
      <router-link to="/finance/deposit?redirect=home" class="men btn-pointer">
        <img v-if="$q.dark.isActive" src="../assets/images/home/deposit-btnicon-dark.png"/>
        <img v-else src="../assets/images/home/deposit-btnicon.png" />
        <div class="">存款</div>
      </router-link>
      <router-link to="/finance/withdraw?redirect=home" class="men btn-pointer">
        <img v-if="$q.dark.isActive" src="../assets/images/home/withdraw-btnicon-dark.png"/>
        <img v-else src="../assets/images/home/withdraw-btnicon.png" />
        <div class="">取款</div>
      </router-link>
      <router-link to="/account/transfer?redirect=home" class="men btn-pointer">
        <img v-if="$q.dark.isActive" src="../assets/images/home/transfer-btnicon-dark.png"/>
        <img v-else src="../assets/images/home/transfer-btnicon.png" />
        <div class="">转账</div>
      </router-link>
      <router-link to="/account/vip?redirect=home" class="men btn-pointer">
        <img v-if="$q.dark.isActive" src="../assets/images/home/vip-btnicon-dark.png"/>
        <img v-else src="../assets/images/home/vip-btnicon.png" />
        <div class="">VIP</div>
      </router-link>
    </div>
  </div>

  <div class="home-game-section">
    <div class="game-left-list">
      <div @click="selectTab('esport')" class="game-platform btn-pointer" id="esport-platform">
        <template v-if="tab === 'esport'">
          <img v-if="$q.dark.isActive" src="../assets/images/home/games/esport-icon-active-dark.png" />
          <img v-else src="../assets/images/home/games/esport-icon-active.png" />
        </template>
        <template v-else>
          <img v-if="$q.dark.isActive" src="../assets/images/home/games/esport-icon-dark.png" />
          <img v-else src="../assets/images/home/games/esport-icon.png" />
        </template>
      </div>
      <div @click="selectTab('sport')" class="game-platform btn-pointer" id="sport-platform">
        <template v-if="tab === 'sport'">
          <img v-if="$q.dark.isActive" src="../assets/images/home/games/sport-icon-active-dark.png" />
          <img v-else src="../assets/images/home/games/sport-icon-active.png" />
        </template>
        <template v-else>
          <img v-if="$q.dark.isActive" src="../assets/images/home/games/sport-icon-dark.png" />
          <img v-else src="../assets/images/home/games/sport-icon.png" />
        </template>
      </div>
      <div @click="selectTab('live')" class="game-platform btn-pointer" id="live-platform">
        <template v-if="tab === 'live'">
          <img v-if="$q.dark.isActive" src="../assets/images/home/games/live-icon-active-dark.png" />
          <img v-else src="../assets/images/home/games/live-icon-active.png" />
        </template>
        <template v-else>
          <img v-if="$q.dark.isActive" src="../assets/images/home/games/live-icon-dark.png" />
          <img v-else src="../assets/images/home/games/live-icon.png" />
        </template>
      </div>

      <div @click="selectTab('poker')" class="game-platform btn-pointer" id="poker-platform">
        <template v-if="tab === 'poker'">
          <img v-if="$q.dark.isActive" src="../assets/images/home/games/poker-icon-active-dark.png" />
          <img v-else src="../assets/images/home/games/poker-icon-active.png" />
        </template>
        <template v-else>
          <img v-if="$q.dark.isActive" src="../assets/images/home/games/poker-icon-dark.png" />
          <img v-else src="../assets/images/home/games/poker-icon.png" />
        </template>
      </div>
      <div @click="selectTab('slot')" class="game-platform btn-pointer" id="slot-platform">
        <template v-if="tab === 'slot'">
          <img v-if="$q.dark.isActive" src="../assets/images/home/games/slot-icon-active-dark.png" />
          <img v-else src="../assets/images/home/games/slot-icon-active.png" />
        </template>
        <template v-else>
          <img v-if="$q.dark.isActive" src="../assets/images/home/games/slot-icon-dark.png" />
          <img v-else src="../assets/images/home/games/slot-icon.png" />
        </template>
      </div>

      <div @click="selectTab('casual')" class="game-platform btn-pointer" id="casual-platform">
        <template v-if="tab === 'casual'">
          <img v-if="$q.dark.isActive" src="../assets/images/home/games/casual-icon-active-dark.png" />
          <img v-else src="../assets/images/home/games/casual-icon-active.png" />
        </template>
        <template v-else>
          <img v-if="$q.dark.isActive" src="../assets/images/home/games/casual-icon-dark.png" />
          <img v-else src="../assets/images/home/games/casual-icon.png" />
        </template>
      </div>

      <!--
      <div @click="selectTab('others')" class="game-platform btn-pointer" id="others-platform">
        <template v-if="tab === 'others'">
          <img src="../assets/images/home/games/others-icon-active.png" />
        </template>
        <template v-else>
          <img src="../assets/images/home/games/others-icon.png" />
        </template>
      </div>
      -->
      <div @click="selectTab('lottery')" class="game-platform btn-pointer" id="lottery-platform">
        <template v-if="tab === 'lottery'">
          <img v-if="$q.dark.isActive" src="../assets/images/home/games/lottery-icon-active-dark.png" />
          <img v-else src="../assets/images/home/games/lottery-icon-active.png" />
        </template>
        <template v-else>
          <img v-if="$q.dark.isActive" src="../assets/images/home/games/lottery-icon-dark.png" />
          <img v-else src="../assets/images/home/games/lottery-icon.png" />
        </template>
      </div>
      <div @click="selectTab('fishing')" class="game-platform btn-pointer" id="fishing-platform">
        <template v-if="tab === 'fishing'">
          <img v-if="$q.dark.isActive" src="../assets/images/home/games/fish-icon-active-dark.png" />
          <img v-else src="../assets/images/home/games/fish-icon-active.png" />
        </template>
        <template v-else>
          <img v-if="$q.dark.isActive" src="../assets/images/home/games/fish-icon-dark.png" />
          <img v-else src="../assets/images/home/games/fish-icon.png" />
        </template>
      </div>
    </div>

    <div class="game-right-platform" v-scroll="onHomeScroll" id="id-right-platform" ref="rightPlatformContainer">
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
              <div class="platform-label"></div>
              <div class="platform-content">
                <div class="platform-logo">
                  <img :src="getImgPlatformLogo(item.icon, item.name, item.alias)" />
                </div>
                <div class="platform-title">{{ item.title }}</div>
                <div class="platform-subtitle">{{ item.subtitle }}</div>
                <div class="platform-rebate">
                  最高返水
                  <span>8%</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

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
              <div class="platform-label"></div>
              <div class="platform-content">
                <div class="platform-logo">
                  <img :src="getImgPlatformLogo(item.icon, item.name, item.alias)" />
                </div>
                <div class="platform-title">{{ item.title }}</div>
                <div class="platform-subtitle">{{ item.subtitle }}</div>
                <div class="platform-rebate">
                  最高返水
                  <span>8%</span>
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
              <div class="platform-label"></div>
              <div class="platform-content">
                <div class="platform-logo">
                  <img :src="getImgPlatformLogo(item.icon, item.name)" />
                </div>
                <div class="platform-title">{{ item.title }}</div>
                <div class="platform-subtitle">{{ item.subtitle }}</div>
                <div class="platform-rebate">
                  最高返水
                  <span>8%</span>
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
              <div class="platform-label"></div>
              <div class="platform-content">
                <div class="platform-logo">
                  <img :src="getImgPlatformLogo(item.icon, item.name, item.alias)" />
                </div>
                <div class="platform-title">{{ item.title }}</div>
                <div class="platform-subtitle">{{ item.subtitle }}</div>
                <div class="platform-rebate">
                  最高返水
                  <span>8%</span>
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
              <div class="platform-label"></div>
              <div class="platform-content">
                <div class="platform-logo">
                  <img :src="getImgPlatformLogo(item.icon, item.name, item.alias)" />
                </div>
                <div class="platform-title">{{ item.title }}</div>
                <div class="platform-subtitle">{{ item.subtitle }}</div>
                <div class="platform-rebate">
                  最高返水
                  <span>8%</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="game-lists" id="casual-lists">
        <template v-for="(item, index) in casuals" :key="index">
          <div
            class="platform-block"
            @click="playGame(item.gameName, item.code, 0, item.gameCode)"
            :class="item.underMaintenance === true ? 'maintenance' : ''"
          >
            <MaintenanceBox :item="item" />

            <div
              class="platform-img-frame"
              :style="{
                'background-image': getImgPlatformBg(item.icon, item.name, item.alias)
              }"
            >
              <div class="platform-label"></div>
              <div class="platform-content">
                <div class="platform-logo">
                  <img :src="getImgPlatformLogo(item.icon, item.name, item.alias)" />
                </div>
                <div class="platform-title">{{ item.title }}</div>
                <div class="platform-subtitle">{{ item.subtitle }}</div>
                <div class="platform-rebate">
                  最高返水
                  <span>8%</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="game-lists" id="lottery-lists">
        <template v-for="(item, index) in lottery" :key="index">
          <div
            class="platform-block"
            @click="playGame(item.gameName, item.code, item.gameCode)"
            :class="item.underMaintenance === true ? 'maintenance' : ''"
          >
            <MaintenanceBox :item="item" :moment="moment(item.maintenanceStartTime)" />

            <div
              class="platform-img-frame"
              :style="{
                'background-image': getImgPlatformBg(item.icon, item.name, item.alias)
              }"
            >
              <div class="platform-label"></div>
              <div class="platform-content">
                <div class="platform-logo">
                  <img :src="getImgPlatformLogo(item.icon, item.name, item.alias)" />
                </div>
                <div class="platform-title">{{ item.title }}</div>
                <div class="platform-subtitle">{{ item.subtitle }}</div>
                <div class="platform-rebate">
                  最高返水
                  <span>8%</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="game-lists" id="fishing-lists">
        <template v-for="(item, index) in fishing" :key="index">
          <div
            class="platform-block"
            @click="playGame(item.gameName, item.code, item.gameCode)"
            :class="item.underMaintenance === true ? 'maintenance' : ''"
          >
            <MaintenanceBox :item="item" :moment="moment(item.maintenanceStartTime)" />

            <div
              class="platform-img-frame"
              :style="{
                'background-image': getImgPlatformBg(item.icon, item.name, item.alias)
              }"
            >
              <div class="platform-label"></div>
              <div class="platform-content">
                <div class="platform-logo">
                  <img :src="getImgPlatformLogo(item.icon, item.name, item.alias)" />
                </div>
                <div class="platform-title">{{ item.title }}</div>
                <div class="platform-subtitle">{{ item.subtitle }}</div>
                <div class="platform-rebate">
                  最高返水
                  <span>8%</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>

  <GameModal ref="allGames"></GameModal>

  <q-page-sticky v-if="showRocket" position="bottom-right" :offset="fabPos" style="z-index: 999">
    <div class="rebates-absolute" :disable="draggingRocketFab" v-touch-pan.prevent.mouse="moveRocketFab">
      <q-btn class="close-btn" icon="close" flat round dense @click="hideRocket()"></q-btn>
      <q-carousel
        class="float"
        :navigation="gamePromo.length > 1 ? true : false"
        v-model="rocketSlide"
        swipeable
        transition-next="slide-left"
        transition-prev="slide-right"
        animated
        infinite
        size="xs"
      >
        <q-carousel-slide
          v-for="(game, i) in gamePromo"
          :key="i"
          :name="i"
          @click="playGame(game.platform, game.platform, game.code)"
        >
          <div class="rocket-wrapper">
            <div class="rocket"><img style="width: 100px" :src="`${imgURLFloat}/game/${game.icon}`" /></div>
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
        infinite
        size="xs"
      >
        <q-carousel-slide v-for="(promo, i) in floatPromo" :key="i" :name="i" @click="gotoFloatPromo(promo.code)">
          <div class="rocket-wrapper">
            <div class="rocket"><img style="width: 100px" :src="`${imgURLFloat}/promo/${currentPromo.icon}`" /></div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </q-page-sticky>

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
          <div class="cacnels common-md-white-btn" @click="cancelUpdate">取消</div>
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

  <q-dialog width="100%" v-model="isImportantAnnoucementModal" @update:model-value="offPopupModal()">
    <q-card flat style="width: 70%; max-width: 500px;background-color: transparent; margin: 0 auto;" class="text-white">
      <q-card-section style="background-color: transparent;">
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
</template>

<script>
import { computed, defineComponent, onActivated, onUnmounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
import { cached } from "boot/cache";
import { Platform, useQuasar } from "quasar";
import { userStore } from "stores/index";
import GameModal from "components/modal/GameModal";
import MarqueeText from "vue-marquee-text-component";
import { useLocalStorage } from "@vueuse/core";
import floor from 'lodash/floor';

import { useUI } from "stores/ui";
// Import Swiper Vue.js components
import SwiperCore, { A11y, Controller, HashNavigation, Keyboard, Mousewheel, Scrollbar, Thumbs } from "swiper";
import moment from "moment";
// Import Swiper styles
import "swiper/css";
import "swiper/css/scrollbar";
import { translateRecord } from "src/directives/translate";
import MaintenanceBox from "components/MaintenanceBox.vue";
import UserProfile from "components/home/drawer/UserProfile.vue";
import LinkGroup from "components/home/drawer/LinkGroup.vue";
import SystemConfig from "components/home/drawer/SystemConfig.vue";
import { onMounted } from "vue";

SwiperCore.use([Keyboard, Mousewheel, A11y, HashNavigation]);

export default defineComponent({
  name: "IndexPage",
  components: {
    MaintenanceBox,
    // Swiper,
    // SwiperSlide,
    GameModal,
    MarqueeText,
    UserProfile,
    LinkGroup,
    SystemConfig
    // PlatformBlock
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

    const hasDrawer = ref(false);

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

    const rightPlatformContainer = ref(null);

    const handleScroll = () => {
      if (
        rightPlatformContainer.value.scrollHeight - rightPlatformContainer.value.scrollTop ===
        rightPlatformContainer.value.clientHeight
      ) {
        onHomeScroll();
      }
    };

    const onHomeScroll = (position) => {
      if (isSelecting.value === true) {
        return;
      }
      // console.log("SCROLL");
      if (route.path === "/") {
        // console.log("SCROLL");
        if (!isScrolling.value) {
          const rightPlatform = document.getElementById("id-right-platform");
          const gameLeftList = document.querySelector(".game-left-list");

          const platformBlocks = document.getElementsByClassName("platform-block");
          const blockHeight = platformBlocks ? (platformBlocks[0].offsetHeight / 4) * 3 : 75;
          // rightPlatformContainer.value.addEventListener("scroll", onHomeScroll);
          // console.log("scroll");

          var checkItem1 = document.getElementById("esport-lists");
          var checkItem2 = document.getElementById("sport-lists");
          var checkItem3 = document.getElementById("live-lists");
          var checkItem4 = document.getElementById("poker-lists");
          var checkItem5 = document.getElementById("slot-lists");
          var checkItem55 = document.getElementById("casual-lists");
          var checkItem6 = document.getElementById("lottery-lists");
          var checkItem7 = document.getElementById("fishing-lists");

          var positionTop1 = checkItem1.getBoundingClientRect().top - 335;
          var positionTop2 = checkItem2.getBoundingClientRect().top - 335;
          var positionTop3 = checkItem3.getBoundingClientRect().top - 335;
          var positionTop4 = checkItem4.getBoundingClientRect().top - 335;
          var positionTop5 = checkItem5.getBoundingClientRect().top - 335;
          var positionTop55 = checkItem55.getBoundingClientRect().top - 335;
          var positionTop6 = checkItem6.getBoundingClientRect().top - 335;
          var positionTop7 = checkItem7.getBoundingClientRect().top - 335;

          // console.log(blockHeight);
          // console.log(positionTop6);
          var bodyElement = document.body;
          var bodyOffset = bodyElement.getBoundingClientRect();
          var windowHeight = window.innerHeight;
          // console.log(windowHeight);
          // console.log(bodyOffset.bottom);

          // positionTop7 >= blockHeight
          // positionTop6 >= blockHeight
          // positionTop5 >= blockHeight
          // positionTop4 >= blockHeight
          // positionTop3 >= blockHeight
          // positionTop2 >= blockHeight

          if (0 > positionTop7 - 5) {
            tab.value = "fishing";
          } else if (0 > positionTop6 - 5) {
            tab.value = "lottery";
          } else if (0 > positionTop55 - 5) {
            tab.value = "casual";
          } else if (0 > positionTop5 - 5) {
            tab.value = "slot";
            gameLeftList.scrollTo({
              top: 1000,
              behavior: "smooth"
            });
          } else if (0 > positionTop4 - 5) {
            tab.value = "poker";
          } else if (0 > positionTop3 - 5) {
            tab.value = "live";
          } else if (0 > positionTop2 - 5) {
            tab.value = "sport";
            gameLeftList.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          } else if (0 > positionTop1 - 5) {
            tab.value = "esport";
            gameLeftList.scrollTo({
              top: 0,
              behavior: "smooth"
            });
          }
          // console.log("blockHeight", blockHeight);
          // console.log(tab.value);
        }
      }
    };

    const setSelectedSwiper = (tab) => {
      const gameRightPlatform = document.querySelector(".game-right-platform");
      const gameLeftList = document.querySelector(".game-left-list");
      const scrollItem1 = document.getElementById("esport-lists");
      const scrollItem2 = document.getElementById("sport-lists");
      const scrollItem3 = document.getElementById("live-lists");
      const scrollItem4 = document.getElementById("poker-lists");
      const scrollItem5 = document.getElementById("slot-lists");
      const scrollItem55 = document.getElementById("casual-lists");
      const scrollItem6 = document.getElementById("lottery-lists");
      const scrollItem7 = document.getElementById("fishing-lists");

      // console.log(tab.name);
      // var slideIndex = 0;
      if (tab === "esport") {
        gameRightPlatform.scrollTo({
          top: scrollItem1.offsetTop - gameRightPlatform.offsetTop,
          behavior: "smooth" // Optional: Use smooth scrolling
        });

        gameLeftList.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
      if (tab === "sport") {
        gameRightPlatform.scrollTo({
          top: scrollItem2.offsetTop - gameRightPlatform.offsetTop,
          behavior: "smooth" // Optional: Use smooth scrolling
        });
      }
      if (tab === "live") {
        gameRightPlatform.scrollTo({
          top: scrollItem3.offsetTop - gameRightPlatform.offsetTop,
          behavior: "smooth" // Optional: Use smooth scrolling
        });
      }
      if (tab === "poker") {
        gameRightPlatform.scrollTo({
          top: scrollItem4.offsetTop - gameRightPlatform.offsetTop,
          behavior: "smooth" // Optional: Use smooth scrolling
        });
      }
      if (tab === "slot") {
        gameRightPlatform.scrollTo({
          top: scrollItem5.offsetTop - gameRightPlatform.offsetTop,
          behavior: "smooth" // Optional: Use smooth scrolling
        });

        gameLeftList.scrollTo({
          top: gameLeftList.scrollHeight,
          behavior: "smooth"
        });
      }
      if (tab === "casual") {
        gameRightPlatform.scrollTo({
          top: scrollItem55.offsetTop - gameRightPlatform.offsetTop,
          behavior: "smooth" // Optional: Use smooth scrolling
        });

        gameLeftList.scrollTo({
          top: gameLeftList.scrollHeight,
          behavior: "smooth"
        });
      }
      if (tab === "others") {
      }
      if (tab === "lottery") {
        gameRightPlatform.scrollTo({
          top: scrollItem6.offsetTop - gameRightPlatform.offsetTop,
          behavior: "smooth" // Optional: Use smooth scrolling
        });
      }
      if (tab === "fishing") {
        gameRightPlatform.scrollTo({
          top: scrollItem7.offsetTop - gameRightPlatform.offsetTop,
          behavior: "smooth" // Optional: Use smooth scrolling
        });

        gameLeftList.scrollTo({
          top: 5000,
          behavior: "smooth"
        });
      }
    };
    const onSlideChange = (swiper) => {
      // Get the active slide index
      const activeIndex = swiper.activeIndex;

      // Get the active slide element
      const activeSlide = swiper.slides[activeIndex];

      // console.log(activeSlide);
      // Get the class name of the active slide
      const activeSlideClassName = activeSlide.className;
      // Check if the class name contains "sport," "slot," or "esport"
      // Array of keywords to check
      const keywords = ["slot", "live", "sport", "esport", "casual", "lottery", "fishing"];

      // Iterate over each keyword
      for (const keyword of keywords) {
        // Check if the class name contains the current keyword
        if (activeSlideClassName.includes(keyword)) {
          // console.log("select: "+ keyword);
          selectedTab.value = keyword;
        }
      }
    };
    const imgNotFound = require(`../assets/images/home/img-not-found.png`);

    const selectedTab = ref("");
    const esport = ref([]);
    const sport = ref([]);
    const livecasino = ref([]);
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

    // ui.$onAction(({ name, args }) => {
    //   switch (name) {
    //     case "setScrollPosition":
    //       scrollPageRef.value.setScrollPosition(args[0], args[1], args[2]);
    //   }
    // });
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

    const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";
    const imgURLFloat = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value;
    // Pop out ads banner
    const isImportantAnnoucementModal = ref(false);
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
      isImportantAnnoucementModal.value = false;
    };

    const offPopupModal = () => {
      setExpiryBanner();
    }

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
    const clickHomePopupImg = (urlString)=>{
      // debugger;
      const openPattern = /^\/open\/(.*)/;
      if (urlString.match(openPattern)) {
        const extractedUrl = urlString.match(openPattern)[1];
        const [gameName, platformCode, gameCode] = extractedUrl.split("/");
        // /open/FB体育/FB/XXXX-123/OPEN

        allGames.value.open(gameName, platformCode, gameCode, 'OPEN');
        return;
      }

      let regexUrl = new RegExp(/^(https:\/\/)/g)
      if(regexUrl.test(urlString)){
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
    }
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
            // if (store.memberType === 'TEST' || store.memberType === 'PROMO_TEST')  {
            //   res = apiMockData
            // }
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
              // isImportantAnnoucementModal.value = false;
              // }
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
          } else {
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
              // console.log(espObj);

              if (espObj.code === "TFGaming") {
                espObj.title = "雷火电竞";
                espObj.sequence = -1;
              }
              if (espObj.code === "IA") {
                espObj.title = "小艾电竞";
              }
              if (espObj.code === "IMES") {
                espObj.title = "IM 电竞";
              }
              if (!espObj.title) {
                espObj.title = espObj.code + "电竞";
              }
              espObj.icon = "esport";
              espObj.subtitle = "电竞赛事";
              esport.value.push(espObj);

              //Add 1 More Casual minigame.
              // if (platTypes.indexOf("CASUAL") > -1) {
              // var casualObj = Object.assign({}, element);
              // casualObj.gameCode = "casual";
              // casualObj.title = casualObj.name + " 小游戏";
              // casualObj.icon = "casual";
              // casualObj.subtitle = "小游戏";
              // casuals.value.push(casualObj);
              // }
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
                spObj.title = "熊猫体育";
              }
              if (spObj.code === "CR") {
                spObj.title = "CR体育";
              }
              if (spObj.code === "SABA") {
                spObj.title = "沙巴体育";
              }
              if (spObj.code === "FB") {
                spObj.title = "FB体育";
              }
              if (spObj.code === "PINNACLE") {
                spObj.title = "AP体育";
              }
              spObj.icon = "sport";
              spObj.subtitle = "体育赛事";
              sport.value.push(spObj);
            }
            if (platTypes.indexOf("LIVE") > -1) {
              var liveObj = Object.assign({}, element);

              // if (liveObj.alias) {
              //   liveObj.title = translateRecord(liveObj.alias) + " 真人";
              // } else {
              //   liveObj.title = translateRecord(liveObj.name) + " 真人";
              // }

              if (liveObj.code === "PMLIVE") {
                liveObj.title = "DB真人";
              } else if (liveObj.code === "EBET") {
                liveObj.title = "WE真人";
              } else if (liveObj.code === "BBINDY") {
                liveObj.title = "BBIN真人";
              } else {
                liveObj.title = translateRecord(liveObj.name) + "真人";
              }

              if (liveObj.code === "BBINDY") {
                liveObj.gameCode = "bblive_lobby_pc";
              }

              liveObj.icon = "live";
              liveObj.subtitle = "真人娱乐";
              livecasino.value.push(liveObj);
            }
            if (platTypes.indexOf("SLOT") > -1) {
              // console.log(element)
              var slotObj = Object.assign({}, element);

              if (slotObj.code === "AG") {
                slotObj.title = "XIN电子";
              } else if (slotObj.alias) {
                slotObj.title = translateRecord(slotObj.alias);
              } else {
                slotObj.title = translateRecord(slotObj.name);
              }

              slotObj.icon = "slot";
              slotObj.subtitle = "电子游戏";
              // console.log(slotObj);

              let slotItem = {
                id: slotObj.id,
                code: slotObj.code,
                icon: slotObj.name,
                title: slotObj.title
              };
              // console.log(slotItem);
              ui.slotLists.push(slotItem);
              slot.value.push(slotObj);
            }
            if (platTypes.indexOf("FISH") > -1) {
              var fishObj = Object.assign({}, element);
              fishObj.title = translateRecord(fishObj.name);
              fishObj.icon = "fish";
              fishObj.subtitle = "捕鱼游戏";

              if (fishObj.code === "GPS") {
                fishObj.gameCode = "7202";
              } else if (fishObj.code === "AGF") {
                fishObj.gameCode = "HMPL";
              }

              fishing.value.push(fishObj);
            }
            if (platTypes.indexOf("POKER") > -1) {
              var pokerObj = Object.assign({}, element);
              pokerObj.title = translateRecord(pokerObj.name);
              pokerObj.icon = "poker";
              pokerObj.subtitle = "棋牌娱乐";

              if (pokerObj.code === "GFLC") {
                pokerObj.gameCode = "lobby";
              }

              poker.value.push(pokerObj);
            }
            if (platTypes.indexOf("LOTTERY") > -1) {
              var lottObj = Object.assign({}, element);
              lottObj.title = lottObj.name + "彩票";
              lottObj.icon = "lottery";
              lottObj.subtitle = "彩票游戏";
              //HArdCode hid BBIN
              lottery.value.push(lottObj);
            }
          });

          esport.value = esport.value.sort((a, b) => {
            return a.sequence - b.sequence;
          });
          // if (store.token && store.memberType === 'TEST' || store.memberType === 'PROMO_TEST') {
          var casualObj = {
            id: 99,
            name: "TFGaming",
            code: "TFGaming",
            status: "OPEN",
            walletType: "SEAMLESS",
            gameType: "CASUAL",
            followType: "NEW",
            underMaintenance: false,
            maintenanceStartTime: null,
            maintenanceEndTime: null,
            alias: "小游戏",
            sequence: 200,
            title: "小游戏",
            icon: "casual",
            subtitle: "小游戏"
          };
          casuals.value.push(casualObj);
          // }
        })
        .catch((err) => {});
    };

    const tab = ref("esport");
    const isSelecting = ref(false);
    const timerTimeout = ref(null);
    const selectTab = (item) => {
      if (timerTimeout.value) {
        clearTimeout(timerTimeout.value);
      }
      isSelecting.value = true;
      tab.value = item;
      setSelectedSwiper(item);

      timerTimeout.value = setTimeout(() => {
        isSelecting.value = false;
      }, 750);
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

      const openPattern = /^\/open\/(.*)/;
      if ((banner.redirectUrl).match(openPattern)) {
        const extractedUrl = banner.redirectUrl.match(openPattern)[1];
        const [gameName, platformCode, gameCode] = extractedUrl.split("/");

        allGames.value.open(gameName, platformCode, gameCode, 'OPEN');
        return;
      } else if(banner.redirectUrl=="app://deposit"){
        router.push("/finance/deposit");
      } else {
        const redirectU = "/promo?name=" + banner.redirectUrl;
        router.push(`${redirectU}`);
      }
    };

    const download_url = ref("");
    const isAppUpdateModal = ref(false);
    // const getVersionNo = async () => {
    //   // console.log(Platform);
    //   // alert("Capacitor" + Platform.is.capacitor);
    //   if (Platform.is.android && Platform.is.capacitor) {
    //     const info = await App.getInfo();
    //     // const info = {
    //     //   version: "1.0.1"
    //     // };
    //     // alert(info.version);
    //     var current_version = parseInt(info.version.replace(/\./g, "") + info.build);
    //     // info.version && info.build
    //     const appType = "ALL";
    //     const device = Platform.is.android ? "ANDROID" : "IOS";
    //     const res = await api.get(`/config/appVersionAndUrl?type=${appType}&device=${device}`);
    //     // console.log(res);
    //     if (res.code === 0) {
    //       var version_info = res.data.version;
    //       var latest_ver_no = parseInt(version_info.replace(/\./g, ""));
    //       download_url.value = res.data.url;
    //
    //       // alert(latest_ver_no);
    //       // console.log(download_url.value);
    //       if (latest_ver_no > current_version) {
    //         isAppUpdateModal.value = true;
    //       }
    //     }
    //   }
    // };

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
      // var btmSwiper = document.getElementById("btm-second-swiper");
      // btmSwiper.classList.add("longer-swiper");
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
          // console.log(err);
        });
    };

    const openDownloadAppLink = () => {
      const affiliate = sessionStorage.getItem("AFFILIATE_CODE");
      const theurl = `${downloadUrl.value}?agentCode=${affiliate}`;
      window.open(theurl, "_blank");
    };

    // const getImgPlatformLogo = (platform, code) => {
    //   try {
    //     return `${require(`../assets/images/home/${platform}/logo-${code.toLowerCase()}.png`)}`;
    //   } catch (e) {
    //     return `${require(`../assets/images/home/logo-empty.png`)}`;
    //   }
    // };

    // const getImgPlatformBg = (platform, code) => {
    //   try {
    //     return `url(${require(`../assets/images/home/${platform}/platform-item-${code.toLowerCase()}.png`)})`;
    //   } catch (e) {
    //     return `url(${require(`../assets/images/home/${platform}/platform-item-empty.png`)})`;
    //   }
    // };

    // const getImgPlatformLogo = (platform, code, alias) => {
    //   try {
    //     const effectiveCode = alias || code.toLowerCase();
    //     return `${require(`../assets/images/home/${platform}/logo-${effectiveCode.toLowerCase()}.png`)}`;
    //   } catch (e) {
    //     return `${require(`../assets/images/home/logo-empty.png`)}`;
    //   }
    // };

    // const getImgPlatformBg = (platform, code, alias) => {
    //   try {
    //     const effectiveCode = alias || code.toLowerCase();
    //     return `url(${require(`../assets/images/home/${platform}/platform-item-${effectiveCode.toLowerCase()}.png`)})`;
    //   } catch (e) {
    //     return `url(${require(`../assets/images/home/${platform}/platform-item-empty.png`)})`;
    //   }
    // };

    const getImgPlatformLogo = (platform, code, alias) => {
      try {
        // let effectiveCode;
        // if (code.toLowerCase() === "pm" || code.toLowerCase() === "db") {
        //   effectiveCode = code.toLowerCase();
        // } else {
        //   effectiveCode = alias || code.toLowerCase();
        // }

        return `${require(`../assets/images/home/${platform}/logo-${code.toLowerCase()}.png`)}`;
      } catch (e) {
        return `${require(`../assets/images/home/logo-empty.png`)}`;
      }
    };

    const getImgPlatformBg = (platform, code, alias) => {
      try {
        // let effectiveCode;
        // if (code.toLowerCase() === "pm" || code.toLowerCase() === "db") {
        //   effectiveCode = code.toLowerCase();
        // } else {
        //   effectiveCode = alias || code.toLowerCase();
        // }
        if ($q.dark.isActive) {
          return `url(${require(`../assets/images/home/${platform}/platform-item-${code.toLowerCase()}-dark.png`)})`;
        } else {
          return `url(${require(`../assets/images/home/${platform}/platform-item-${code.toLowerCase()}.png`)})`;
        }
      } catch (e) {
        if ($q.dark.isActive) {
          return `url(${require(`../assets/images/home/${platform}/platform-item-empty-dark.png`)})`;
        } else {
          return `url(${require(`../assets/images/home/${platform}/platform-item-empty.png`)})`;
        }
      }
    };

    const unreadInboxMail = ref(0);
    const getUnreadTotal = () => {
      if (store.token) {
        return api.get("/session/inbox/getUnreadTotal").then((res) => {
          // console.log(res);
          if (res.code === 0) {
            unreadInboxMail.value = res.data;
          }
        });
      }
    };
    const gotoFloatPromo = (code) => {
      router.push(`/promo?name=${code}`);
    };
    const floatPromo = [];
    const gamePromo = [];
    const initFloating = () => {
      floatPromo.value = [];
      gamePromo.value = [];
      api
        .get("/redirect")
        .then((res) => {
          if (res.code === 0) {
            res.data.forEach((element) => {
              if (element.type === "PROMO") {
                floatPromo.push(element);
                showFloatPromo.value = true;
              }
              if (element.type === "GAME") {
                gamePromo.push(element);
                showRocket.value = true;
              }
            });
            checkShowRocket();
            checkFloatPromo();
            updatePromo(); // Initially update the displayed promo
            // Update the displayed promo every 5 seconds
            setInterval(updatePromo, 3000);
            updateRocket(); // Initially update the displayed promo
            // Update the displayed promo every 5 seconds
            setInterval(updateRocket, 3000);
          } else {
            ElMessage.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const currentPromo = ref(null);
    const currentPromoIndex = ref(0);
    const updatePromo = () => {
      currentPromo.value = floatPromo[currentPromoIndex.value];
      currentPromoIndex.value = (currentPromoIndex.value + 1) % floatPromo.length;
    };

    const currentRocket = ref(null);
    const currentRocketIndex = ref(0);
    const updateRocket = () => {
      currentRocket.value = gamePromo[currentRocketIndex.value];
      currentRocketIndex.value = (currentRocketIndex.value + 1) % floatPromo.length;
    };
    const imageLoading = ref(false);
    const selectedLiveTab = ref();

    const showRocket = ref(false);
    const checkShowRocket = () => {
      // if (store.memberType === "TEST" || store.memberType === "PROMO_TEST") {
      //   showRocket.value = true;
      // }
    };

    const hideRocket = () => {
      showRocket.value = false;
      promoPos.value = [18, 18];
    };

    const showFloatPromo = ref(false);
    const checkFloatPromo = () => {
      // if (store.memberType === "TEST" || store.memberType === "PROMO_TEST") {
      //   showFloatPromo.value = true;
      // }
      if (gamePromo.length === 0) {
        promoPos.value = [18, 18];
      }
    };

    const hideFloatPromo = () => {
      showFloatPromo.value = false;
    };
    const fabPos = ref([18, 18]);
    const promoPos = ref([18, 128]);
    const draggingRocketFab = ref(false);
    const draggingPromoFab = ref(false);

    const currentElement = ref(null);
    const moveRocketFab = (ev) => {
      // console.log(ev);
      const maxX = window.innerWidth - 70;
      const maxY = window.innerHeight - 70;
      draggingRocketFab.value = ev.isFirst !== true && ev.isFinal !== true;
      let newX = fabPos.value[0] - ev.delta.x;
      let newY = fabPos.value[1] - ev.delta.y;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      fabPos.value = [newX, newY];
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

    onActivated(() => {
      getPlatList();
      loadData();
      loadAnnouncement();
      checkPlatform();
      // getVersionNo();
      getAppDownloadUrl();
      setTimeout(() => {
        getUnreadTotal();
      },750)

      rightPlatformContainer.value.addEventListener("scroll", onHomeScroll);
    });

    onMounted(() => {
      if ((store.token)) {
        checkShowImgTop();
        setTimeout(() => {
         initFloating();
        },750)
      }
    });
    // Clear interval on unmounted
    onUnmounted(() => {
      // clearInterval(intervalId);
    });

    return {
      floor,
      imageLoading,
      slide: ref(0),
      clickHomePopupImg,
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
      selectedLiveTab,
      scrollPageRef,
      hasDrawer,
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
      openDownloadAppLink,
      getAppDownloadUrl,
      downloadUrl,
      getWithExpiry,
      setWithExpiry,
      setExpiryBanner,
      homePopupContent,
      homePopupType,
      homePopupPath,
      homePopupId,
      homePopupFrequency,
      homePopupFrequencyNum,
      isImpt,
      isImportantAnnoucementModal,
      offPopupModal,
      getImgPlatformLogo,
      getImgPlatformBg,
      moment,
      unreadInboxMail,
      getUnreadTotal,
      topBoxVisible,
      rightPlatformContainer,
      handleScroll,
      showRocket,
      checkShowRocket,
      fabPos,
      draggingRocketFab,
      draggingPromoFab,
      moveRocketFab,
      movePromoFab,
      hideRocket,
      promoPos,
      hideFloatPromo,
      showFloatPromo,
      currentPromo,
      currentPromoIndex,
      gotoFloatPromo,
      floatPromo,
      gamePromo,
      currentElement,
      imgURLFloat,
      updateRocket,
      currentRocket,
      currentRocketIndex,
      rocketSlide: ref(0),
      promoSlide: ref(0)
    };
  }
});
</script>

<style scoped lang="scss">
// rocket animation
.rebates-absolute {
  display: flex;
  justify-content: center;
  align-items: center;
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
  transition: all 0.3s;
  // cursor: pointer;

  img {
    width: 105px;
    pointer-events: none;
  }

  &:hover {
    filter: brightness(0.9);
  }
}

.q-page-container {
  min-height: 100vh;
}

.download-top-container {
  position: absolute;
  top: 0;
  z-index: 2;

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
  margin: 6px auto;
  height: auto;
  border-radius: 16px;
  aspect-ratio: 1000/400;
  min-height: 130px;

  .q-panel > div {
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    min-height: 130px;
  }

  .q-carousel__navigation--bottom {
    bottom: 30px;
  }
}

:deep(.q-carousel.float) {
  height: unset;
  background: transparent;
}
:deep(.q-carousel.float .q-carousel__navigation .q-btn) {
  margin: 0;
  padding: 0;
  font-size: 4px !important;
  color: #3382f4;
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

    img {
      height: 100%;
      width: auto;
    }
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
  margin: 4px auto 4px;
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
  padding: 0px 10px 0px;
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
    padding-left: 8px;
    display: flex;
    justify-content: space-between;
    gap: 4px;

    .men {
      text-decoration: none;
      color: $font-1;
      gap: 2px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 1rem;

      &:active {
        background: $grey-color;
      }

      img {
        width: 2.2rem;
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
      color: $font-2;
      font-size: 1.2rem;

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

      .cacnels {
        flex: 1;
        box-sizing: border-box;
        text-align: center;
        letter-spacing: 1px;
        max-width: 190px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
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
  margin: 0px auto 00px;
  gap: 8px;

  .game-left-list {
    // position: sticky;
    overflow-y: scroll;
    overflow-x: hidden;
    height: calc(100vh - 380px);
    margin-top: 0px;
    top: 0;
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 0px;

    &::-webkit-scrollbar {
      display: none;
    }

    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-color: transparent transparent;

    .game-platform {
      padding: 0;
      margin: 0;
      margin-bottom: 8px;
    }

    > div {
      width: 100%;
    }

    img {
      display: block;
      width: 100%;
    }
  }

  .game-right-platform {
    overflow-y: scroll;
    overflow-x: hidden;
    // padding-right: 2px;
    // margin-right: -4px;
    height: calc(100vh - 380px);
    margin-top: 0px;
    flex: 11;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    &::-webkit-scrollbar {
      display: none;
    }

    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-color: transparent transparent;

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

        .platform-content {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
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
          line-height: 1;
          margin-top: 5%;
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

.home-drawer {
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  gap: 24px;
  &__divider {
    border-bottom: 1px solid #ecedf0;
    margin: 0 20px;
  }
}

.body--dark {
  .download-top-container {
    background: $background-dark-light;
    .download-top-box {
      .q-icon {
        color: $font-3-dark;
      }
      .download-txt-container {
        color: $font-1-dark;
        .download-title {
          color: $font-3-dark;
        }
      }
    }
  }

  .details-bar {
    .main-balance {
      color: $font-3-dark;
    }
    .message {
      color: $font-1-dark;
    }
    .menulist {
      .men {
        color: $font-4-dark;
      }
    }
  }

  .home-game-section {
    .game-right-platform {
      .platform-block {
        .platform-img-frame {
          border-radius: 20px;
          .platform-label {
            background-image: url(../assets/images/home/label-certified-dark.png);
          }
          .platform-subtitle {
            color: $font-1-dark;
          }
        }
      }
    }
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
