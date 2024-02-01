<template>
  <div v-if="isH5" class="download-top-container">
    <div class="download-top-box">
      <q-icon name="close" @click="closeTopBox" />
      <img class="headicon" src="../assets/images/home/download-logo.png" />
      <div class="download-txt-container">
        <span class="download-title">雷火电竞app下载</span>
        <span>亚洲第一实时滚球</span>
      </div>
      <div class="buttons">
        <div class="buttons">
          <q-btn :href="`${downloadUrl}`" target="_blank" label="立即下载" color="brightbtn" class="top-btn" />
        </div>
      </div>
    </div>
  </div>

  <div class="home-header">
    <div class="header-left">
      <img alt="logo" src="../assets/images/home/home-logo.png" />
    </div>
    <div class="header-right">
      <img class="btn-pointer" src="../assets/images/home/home-chat-icon.png" />
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
      :img-src="banner.mobileImageUrl"
      @click="gotoPromo(banner)"
    ></q-carousel-slide>
    <!--    :img-src="imgURL + banner.mobileImageUrl"-->
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

    <div class="hot-match-div">
      <img src="../assets/images/home/hot-icon.png" />
      <span>热门赛事</span>
    </div>
  </div>

  <div class="details-bar">
    <div class="message" @click="refreshBalance">
      <span class="main-balance">
        {{ store.token ? (!isLoadingBalance ? "¥" + mainWallet.toFixed(2) : "加载中...") : "早上好~" }}
      </span>
      <span>中心钱包</span>
    </div>
    <div class="menulist">
      <router-link to="/finance/deposit?redirect=/" class="men btn-pointer">
        <img src="../assets/images/home/deposit-mid.png" />
        <div class="">存款</div>
      </router-link>
      <router-link to="/finance/withdraw?redirect=/" class="men btn-pointer">
        <img src="../assets/images/home/withdraw-mid.png" />
        <div class="">取款</div>
      </router-link>
      <router-link to="/account/transfer?redirect=/" class="men btn-pointer">
        <img src="../assets/images/home/transfer-mid.png" />
        <div class="">转账</div>
      </router-link>
      <router-link to="/vip" class="men btn-pointer">
        <img src="../assets/images/home/vip-mid.png" />
        <div class="">VIP</div>
      </router-link>
    </div>
  </div>

  <div class="home-game-section">
    <div class="game-left-list">
      <div @click="selectTab('esport')" class="game-platform btn-pointer" id="esport-platform">
        <template v-if="tab === 'esport'">
          <img src="../assets/images/home/games/esport-icon-active.png" />
        </template>
        <template v-else>
          <img src="../assets/images/home/games/esport-icon.png" />
        </template>
      </div>
      <div @click="selectTab('sport')" class="game-platform btn-pointer" id="sport-platform">
        <template v-if="tab === 'sport'">
          <img src="../assets/images/home/games/sport-icon-active.png" />
        </template>
        <template v-else>
          <img src="../assets/images/home/games/sport-icon.png" />
        </template>
      </div>
      <div @click="selectTab('live')" class="game-platform btn-pointer" id="live-platform">
        <template v-if="tab === 'live'">
          <img src="../assets/images/home/games/live-icon-active.png" />
        </template>
        <template v-else>
          <img src="../assets/images/home/games/live-icon.png" />
        </template>
      </div>
      <div @click="selectTab('poker')" class="game-platform btn-pointer" id="poker-platform">
        <template v-if="tab === 'poker'">
          <img src="../assets/images/home/games/poker-icon-active.png" />
        </template>
        <template v-else>
          <img src="../assets/images/home/games/poker-icon.png" />
        </template>
      </div>
      <div @click="selectTab('lottery')" class="game-platform btn-pointer" id="lottery-platform">
        <template v-if="tab === 'lottery'">
          <img src="../assets/images/home/games/lottery-icon-active.png" />
        </template>
        <template v-else>
          <img src="../assets/images/home/games/lottery-icon.png" />
        </template>
      </div>
      <div @click="selectTab('slot')" class="game-platform btn-pointer" id="slot-platform">
        <template v-if="tab === 'slot'">
          <img src="../assets/images/home/games/slot-icon-active.png" />
        </template>
        <template v-else>
          <img src="../assets/images/home/games/slot-icon.png" />
        </template>
      </div>
      <div @click="selectTab('fishing')" class="game-platform btn-pointer" id="fishing-platform">
        <template v-if="tab === 'fishing'">
          <img src="../assets/images/home/games/fish-icon-active.png" />
        </template>
        <template v-else>
          <img src="../assets/images/home/games/fish-icon.png" />
        </template>
      </div>
    </div>

    <div class="game-right-platform">
      <div class="game-lists" v-if="tab === 'esport'" id="esport-lists">
        <template v-for="(item, index) in esport" :key="index">
          <div class="platform-block" @click="playGame(item.gameName, item.code, item.gameCode)">
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

      <div class="game-lists" v-if="tab === 'sport'" id="sport-lists">
        <template v-for="(item, index) in sport" :key="index">
          <div class="platform-block" @click="playGame(item.gameName, item.code, item.gameCode)">
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

      <div class="game-lists" v-if="tab === 'live'" id="live-lists">
        <template v-for="(item, index) in livecasino" :key="index">
          <div class="platform-block" @click="playGame(item.gameName, item.code, item.gameCode)">
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

      <div class="game-lists" v-if="tab === 'poker'" id="poker-lists">
        <template v-for="(item, index) in poker" :key="index">
          <div class="platform-block" @click="playGame(item.gameName, item.code, item.gameCode)">
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

      <div class="game-lists" v-if="tab === 'lottery'" id="lottery-lists">
        <!-- <div class="platform-block">
          <img src="../assets/images/home/lottery/lottery-1.png" />
        </div> -->

        <div class="platform-block" @click="playGame(item.gameName, item.code, item.gameCode)">
          <div
            class="platform-img-frame"
            :style="`background-image:url(${require(`../assets/images/home/lottery/platform-item-lottery.png`)})`"
          >
            <div class="platform-label"></div>
            <div class="platform-content">
              <div class="platform-logo">
                <img :src="require(`../assets/images/home/lottery/logo-lottery.png`)" />
              </div>
              <div class="platform-title">彩票</div>
              <div class="platform-subtitle">Lottery</div>
              <div class="platform-rebate">
                最高返水
                <span>8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="game-lists" v-if="tab === 'slot'" id="slot-lists">
        <template v-for="(item, index) in slot" :key="index">
          <div class="platform-block" @click="router.push('/slot')">
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
      <div class="game-lists" v-if="tab === 'fishing'" id="fishing-lists">
        <template v-for="(item, index) in fishing" :key="index">
          <div class="platform-block" @click="playGame(item.gameName, item.code, item.gameCode)">
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
    </div>
  </div>

  <!--  <div class="swiper-container">-->
  <!--    &lt;!&ndash; Thumbs Swiper -> store swiper instance &ndash;&gt;-->
  <!--    &lt;!&ndash; It is also required to set watchSlidesProgress prop &ndash;&gt;-->
  <!--    <swiper-->
  <!--      :modules="[Thumbs, Controller]"-->
  <!--      slides-per-view="auto"-->
  <!--      :freeMode="true"-->
  <!--      :set-wrapper-size="true"-->
  <!--      :scrollbar="{ draggable: true }"-->
  <!--      :mousewheel="true"-->
  <!--      watch-slides-progress-->
  <!--      @swiper="setSecondSwiper"-->
  <!--      :controller="{ control: firstSwiper }"-->
  <!--      class="firstSwiper"-->
  <!--    >-->
  <!--      <swiper-slide-->
  <!--        :class="tab.name && { tbact: selectedTab === tab.name }"-->
  <!--        @click="setSelectedSwiper(tab)"-->
  <!--        v-for="(tab, i) in tabs"-->
  <!--        :key="i"-->
  <!--        style="width: calc(100vw / 6)"-->
  <!--      >-->
  <!--        {{ selectedTab !== tab.name ? tab.label : tab.labelact }}-->
  <!--      </swiper-slide>-->
  <!--    </swiper>-->
  <!--    <div class="index-platform-container" style="overflow: hidden">-->
  <!--      &lt;!&ndash; Main Swiper -> pass thumbs swiper instance &ndash;&gt;-->
  <!--      <swiper-->
  <!--        :modules="[Thumbs, Controller]"-->
  <!--        :thumbs="{ swiper: thumbsSwiper }"-->
  <!--        :direction="'vertical'"-->
  <!--        slides-per-view="auto"-->
  <!--        :rewind="true"-->
  <!--        :scrollbar="{ draggable: true }"-->
  <!--        @slide-change-transition-end="onSlideChange"-->
  <!--        @swiper="setFirstSwiper"-->
  <!--        :controller="{ control: secondSwiper }"-->
  <!--        class="secondSwiper"-->
  <!--        id="btm-second-swiper"-->
  <!--      >-->
  <!--        <swiper-slide v-for="(slt, i) in slot" :key="i" :class="'slot-' + i">-->
  <!--          <PlatformBlock dataType="slot" :data="slt" />-->
  <!--        </swiper-slide>-->

  <!--        <swiper-slide v-for="(live, i) in livecasino" :key="i" :class="'live-' + i">-->
  <!--          <template v-if="live.code === 'BBINDY' && live.name === 'BBIN'">-->
  <!--            <PlatformBlock @click="playGame(live.name, live.code, 'bblive_lobby_app')" dataType="live" :data="live" />-->
  <!--          </template>-->
  <!--          <template v-else>-->
  <!--            <PlatformBlock @click="playGame(live.name, live.code, live.gameCode)" dataType="live" :data="live" />-->
  <!--          </template>-->
  <!--        </swiper-slide>-->
  <!--        <swiper-slide v-for="(sp, i) in sport" :key="i" :class="'sport-' + i">-->
  <!--          <PlatformBlock @click="playGame(sp.name, sp.code, sp.gameCode)" dataType="sport" :data="sp" />-->
  <!--        </swiper-slide>-->
  <!--        <swiper-slide v-for="(es, i) in esport" :key="i" :class="'esport-' + i">-->
  <!--          <PlatformBlock @click="playGame(es.name, 'platformType', es.code)" dataType="esport" :data="es" />-->
  <!--        </swiper-slide>-->

  <!--        <swiper-slide v-for="(fish, i) in fishing" :key="i" :class="'fishing-' + i">-->
  <!--          <template v-if="fish.code === 'GPS' && fish.name === 'GPS'">-->
  <!--            <PlatformBlock @click="playGame(fish.name, fish.code, '7202')" dataType="fish" :data="fish" />-->
  <!--          </template>-->

  <!--          <template v-if="fish.code === 'AG' && fish.name === 'AG'">-->
  <!--            <PlatformBlock @click="playGame(fish.name, fish.code, '6')" dataType="fish" :data="fish" />-->
  <!--          </template>-->
  <!--          <PlatformBlock @click="playGame(fish.name, fish.code, fish.code)" dataType="fish" :data="fish" />-->
  <!--        </swiper-slide>-->

  <!--        <swiper-slide v-for="(poke, i) in poker" :key="i" :class="'poker-' + i">-->
  <!--          <template v-if="poke.code === 'KYDY' && poke.name === 'KY'">-->
  <!--            <PlatformBlock @click="playGame(poke.name, poke.code, 'ky_lobby')" dataType="poker" :data="poke" />-->
  <!--          </template>-->
  <!--          <PlatformBlock @click="playGame(poke.name, poke.code, poke.gameCode)" dataType="poker" :data="poke" />-->
  <!--        </swiper-slide>-->
  <!--        <swiper-slide v-for="(lotter, i) in lottery" :key="i" :class="'lottery-' + i">-->
  <!--          <template v-if="lotter.code === 'SGWin' && lotter.name === 'SGWin'">-->
  <!--            <PlatformBlock-->
  <!--              @click="playGame(lotter.name, lotter.code, 'imlotto30000')"-->
  <!--              dataType="lottery"-->
  <!--              :data="lotter"-->
  <!--            />-->
  <!--          </template>-->
  <!--          <template v-else-if="lotter.code === 'BBINDY' && lotter.name === 'BBIN'">-->
  <!--            &lt;!&ndash;            <PlatformBlock&ndash;&gt;-->
  <!--            &lt;!&ndash;                @click="playGame(lotter.name, lotter.code, 'bbkeno_lobby_app')"&ndash;&gt;-->
  <!--            &lt;!&ndash;                dataType="lottery"&ndash;&gt;-->
  <!--            &lt;!&ndash;                :data="lotter"&ndash;&gt;-->
  <!--            &lt;!&ndash;            />&ndash;&gt;-->
  <!--          </template>-->
  <!--          <template v-else>-->
  <!--            <PlatformBlock-->
  <!--              @click="playGame(lotter.name, lotter.code, lotter.gameCode)"-->
  <!--              dataType="lottery"-->
  <!--              :data="lotter"-->
  <!--            />-->
  <!--          </template>-->
  <!--        </swiper-slide>-->

  <!--        <swiper-slide v-for="(casual, i) in casuals" :key="i" :class="'casual-' + i">-->
  <!--          <PlatformBlock-->
  <!--            @click="playGame(casual.name, casual.code, casual.gameCode)"-->
  <!--            dataType="casual"-->
  <!--            :data="casual"-->
  <!--          />-->
  <!--        </swiper-slide>-->

  <!--        <swiper-slide style="opacity: 0"></swiper-slide>-->
  <!--      </swiper>-->
  <!--    </div>-->
  <!--  </div>-->

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
          <div class="cacnels common-md-white-btn" @click="cancelUpdate">取消</div>
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
          indicator-color="white"
          align="justify"
        >
          <q-tab v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id" :label="tab.name" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeKey" animated>
          <q-tab-panel v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id">
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
import { defineComponent, onMounted, ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
import { cached, TIME_EXPIRED } from "boot/cache";
import { useQuasar, Platform } from "quasar";
import { userStore } from "stores/index";
import GameModal from "components/modal/GameModal";
import MarqueeText from "vue-marquee-text-component";
// import {RiVolumeUpLine} from "vue-remix-icons";
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
    // Swiper,
    // SwiperSlide,
    GameModal,
    MarqueeText
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
      if (tab.name === "slot") {
        slideIndex = 0;
        firstSwiper.value?.slideTo(slideIndex, 500);
      }

      if (tab.name === "live") {
        slideIndex = slot.value.length;
        firstSwiper.value?.slideTo(slideIndex, 500);
      }
      if (tab.name === "sport") {
        slideIndex = livecasino.value.length + slot.value.length;

        firstSwiper.value?.slideTo(slideIndex, 500);
      }
      if (tab.name === "esport") {
        slideIndex = livecasino.value.length + sport.value.length + slot.value.length;

        firstSwiper.value?.slideTo(slideIndex, 500);
      }

      if (tab.name === "fishing") {
        slideIndex = livecasino.value.length + sport.value.length + esport.value.length + slot.value.length;

        firstSwiper.value?.slideTo(slideIndex, 500);
      }
      if (tab.name === "poker") {
        slideIndex =
          livecasino.value.length + sport.value.length + esport.value.length + slot.value.length + fishing.value.length;

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
      if (tab.name === "casual") {
        slideIndex =
          livecasino.value.length +
          sport.value.length +
          esport.value.length +
          slot.value.length +
          fishing.value.length +
          poker.value.length +
          lottery.value.length;

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
      const keywords = ["slot", "live", "sport", "esport", "fishing", "poker", "lottery", "casual"];

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
      },
      {
        name: "lottery",
        icon: "lottery",
        label: "彩票",
        labelact: "彩票游戏"
      },
      {
        name: "casual",
        icon: "casual",
        label: "小游戏",
        labelact: "小游戏"
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

    function loadData() {
      //TODO:: HARDCODED.
      banners.value = [
        {
          category: "HOME",
          desktopImageUrl: "home-banner1.png",
          mobileImageUrl: require("../assets/images/home/home-banner1.png"),
          promoPageId: null,
          redirectUrl: "XingFa-red-packet-rain"
        },
        {
          category: "HOME",
          desktopImageUrl: "home-banner2.png",
          mobileImageUrl: require("../assets/images/home/home-banner2.png"),
          promoPageId: null,
          redirectUrl: "XingFa-red-packet-rain"
        }
      ];

      return;
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
          pf.forEach((element) => {
            const platTypes = element.gameType.split(",");
            // console.log(platTypes);
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

              //Add 1 More Casual minigame.
              // if (platTypes.indexOf("CASUAL") > -1) {
              var casualObj = Object.assign({}, element);
              casualObj.gameCode = "casual";
              casualObj.title = casualObj.name + " 小游戏";
              casualObj.icon = "casual";
              casualObj.subtitle = "小游戏";
              casuals.value.push(casualObj);
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
                spObj.title = spObj.code + "体育";
              }
              spObj.icon = "sport";
              spObj.subtitle = "体育赛事";
              sport.value.push(spObj);
            }
            if (platTypes.indexOf("LIVE") > -1) {
              var liveObj = Object.assign({}, element);
              if (liveObj.code === "PMLIVE") {
                liveObj.title = "DB 真人";
              } else if (liveObj.code === "EBET") {
                liveObj.title = "WE 真人";
              } else {
                liveObj.title = liveObj.name + " 真人";
              }
              liveObj.icon = "live";
              liveObj.subtitle = "真人娱乐";
              livecasino.value.push(liveObj);
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
            if (platTypes.indexOf("FISH") > -1 && element.code !== "AGF") {
              var fishObj = Object.assign({}, element);
              fishObj.title = fishObj.name + " 捕鱼";
              fishObj.icon = "fish";
              fishObj.subtitle = "捕鱼游戏";
              fishing.value.push(fishObj);
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
              //HArdCode hid BBIN
              if (lottObj.code !== "BBINDY") {
                lottery.value.push(lottObj);
              }
            }
          });
        })
        .catch((err) => {});
    };

    const tab = ref("esport");
    const selectTab = (item) => {
      tab.value = item;
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
        var current_version = parseInt(info.version.replaceAll(".", "") + info.build);
        // info.version && info.build
        const appType = "ALL";
        const device = Platform.is.android ? "ANDROID" : "IOS";
        const res = await api.get(`/config/appVersionAndUrl?type=${appType}&device=${device}`);
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

    const getImgPlatformLogo = (platform, code) => {
      try {
        return `${require(`../assets/images/home/${platform}/logo-${code.toLowerCase()}.png`)}`;
      } catch (e) {
        return `${require(`../assets/images/home/logo-empty.png`)}`;
      }
    };

    const getImgPlatformBg = (platform, code) => {
      try {
        return `url(${require(`../assets/images/home/${platform}/platform-item-${code.toLowerCase()}.png`)})`;
      } catch (e) {
        return `url(${require(`../assets/images/home/${platform}/platform-item-empty.png`)})`;
      }
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
      getImgPlatformBg
    };
  }
});
</script>
<style scoped lang="scss">
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

    img {
      height: 100%;
      width: auto;
    }
  }

  .header-right {
    height: 25px;

    img {
      height: 100%;
      width: auto;
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
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .message {
    flex: 3;
    padding: 0px 8px 0px 0px;
    border-right: 1px dashed $font-1;
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
  }

  .menulist {
    flex: 4;
    padding-left: 8px;
    display: flex;
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
        width: 2rem;
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
  margin: 0px auto 30px;
  gap: 8px;

  .game-left-list {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;

    > div {
      width: 100%;
    }

    img {
      width: 100%;
    }
  }

  .game-right-platform {
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
          margin-top: auto;
          height: 1.25rem;
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
          display: flex;
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
