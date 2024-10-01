<template>
  <q-dialog v-model="isShowRegSuccessModal">
    <q-card class="reg-success-dialog">
      <q-card-section class="row items-center">
        <div class="header-text">
          <div class="title-wrapper">
            <img src="../assets/images/promotion/register/green_tick.png" />
            <div class="title">Congratulations!</div>
          </div>
          <div class="desc">Account has successfully registered!</div>
        </div>
        <q-btn class="header-close-btn" icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>

      <div class="body-content">
        <div class="bg-img-wrapper">
          <div class="bg-content-wrapper">
            <div class="account-deposit">
              <div class="account-deposit__account-details">
                <div class="account-details__account-name">
                  Account Name:
                  <br />
                  {{ store.nickName }}
                </div>
                <div class="account-details__remember-account">Please remember your account name</div>
              </div>
              <div class="account-deposit__account-buttons">
                <div @click="redirectToPromo()" class="btn deposit-btn">Go Deposit</div>
                <div class="btn back-to-p4w-btn" @click="isShowRegSuccessModal = false">Back to Play4Win</div>
              </div>
            </div>
            <div class="first-deposit">
              <img src="../assets/images/promotion/register/firstdeposit.png" />
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>

  <div>
    <div v-if="isH5 && isShowDownload" class="download-top-container" style="display: none">
      <div class="download-top-box">
        <q-icon name="close" @click="closeTopBox" />
        <img class="headicon" width="50" src="../assets/logo.png" />
        <div class="download-txt-container">
          <span class="download-title text-bold">Play4Win APP</span>
        </div>
        <div class="buttons">
          <q-btn
            rounded
            size="12px"
            :href="`${downloadUrl}`"
            target="_blank"
            label="Download"
            color="primary"
            class="top-btn no-shadow"
          />
        </div>
      </div>
    </div>

    <Carousel v-if="banners.length > 0" class="q-ma-sm" :items-to-show="1.15" :wrap-around="true">
      <Slide v-for="(banner, i) in banners" :key="i">
        <div @click="gotoPromo(banner)" class="carousel__item">
          <img
            style="border-radius: 15px; height: 118px; object-fit: fill"
            class="full-width"
            :src="imgURL + banner.mobileImageUrl"
          />
          <!-- <img style="border-radius: 15px" class="full-width" src="../assets/images/index/sample-banner.png" /> -->
        </div>
      </Slide>
      <template #addons>
        <Pagination />
      </template>
    </Carousel>
  </div>

  <PushNotification :pushNotificationData="pushNotificationData" v-if="Platform.is.android && Platform.is.capacitor" />

  <div class="midd" v-if="announcementList.length">
    <div class="station-notice-wrapper">
      <div class="volume">
        <RiVolumeUpLine />
      </div>
      <MarqueeText :repeat="announcementList.length" :duration="announcementList.length * 20">
        <div v-if="announcementList">
          <span v-for="(a, i) in announcementList" :key="i" @click="openPopup(a)">
            {{ a.content }}
          </span>
        </div>
      </MarqueeText>
    </div>
  </div>

  <div class="menu-tabs">
    <!--    <router-link to="/slot" class="tab slots">-->
    <!--      <div class="imggtext">SLOT</div>-->
    <!--      <img src="../assets/images/common/tab-slot-icon.png" />-->
    <!--    </router-link>-->
    <!--    <div @click="selectTab('sports')" class="tab sports">-->
    <!--      <div class="imggtext">SPORTS</div>-->
    <!--      <img src="../assets/images/common/tab-sport-icon.png" />-->
    <!--    </div>-->
    <!--    <div @click="selectTab('live')" class="tab live">-->
    <!--      <div class="imggtext">LIVE CASINO</div>-->
    <!--      <img src="../assets/images/common/tab-live-icon.png" />-->
    <!--    </div>-->
    <!--    <div @click="selectTab('esports')" class="tab esports">-->
    <!--      <div class="imggtext" style="">ESPORTS</div>-->
    <!--      <img src="../assets/images/common/tab-esport-icon.png" />-->
    <!--    </div>-->
    <!--    <div @click="selectTab('cockfight')" class="tab cockfight">-->
    <!--      <div class="imggtext">COCK FIGHT</div>-->
    <!--      <img src="../assets/images/common/tab-cock-icon.png" />-->
    <!--    </div>-->
    <!--    <router-link to="/aviator" class="tab fishing">-->
    <!--      <div class="imggtext">FISHING</div>-->
    <!--      <img src="../assets/images/common/tab-fish-icon.png" />-->
    <!--    </router-link>-->

    <q-splitter v-model="splitterModel" disable>
      <template v-slot:before>
        <q-tabs v-if="activeSubTab" v-model="activeSubTab" inline-label vertical>
          <q-tab @click="activeSubTab = ''" style="background: linear-gradient(to right, #0560e0, #5703df)">
            <div class="return-btn" style="color: #d7d5f9">
              <q-icon name="arrow_back_ios" @click="closeTopBox" />
              <span>Return</span>
            </div>
          </q-tab>
          <q-tab :name="p.code" v-for="p in currentGamePlatforms" :key="p.code" class="sub-game-tab-wrapper">
            <div class="sub-game-tab">
              <template v-if="$q.dark.isActive && p.code === 'PP'">
                <img :src="require('../assets/logo/dark/' + p.code + '.png')" />
              </template>
              <template v-else>
                <img :src="require('../assets/logo/' + p.code + '.png')" />
              </template>
            </div>
          </q-tab>
        </q-tabs>
        <q-tabs v-else ref="refGameTabs" v-model="activeTab" @update:model-value="updateTabEvent" inline-label vertical>
          <q-tab name="home" class="game-tab-wrapper">
            <div class="game-tab">
              <img src="../assets/images/index/game-tab/hot-icon.png" />
              <span>Hot</span>
            </div>
          </q-tab>
          <q-tab name="jackpot" class="game-tab-wrapper">
            <div class="game-tab">
              <img src="../assets/images/index/game-tab/jackpot-svg.svg" />
              <span>Jackpot</span>
            </div>
          </q-tab>
          <q-tab name="minigame" class="game-tab-wrapper">
            <div class="game-tab">
              <img src="../assets/images/index/game-tab/minigame-icon.png" />
              <span>
                Hash
                <br />
                Games
              </span>
            </div>
          </q-tab>
          <q-tab name="slot" class="game-tab-wrapper">
            <div class="game-tab" @click="openSubTabs('slot')">
              <img src="../assets/images/index/game-tab/slot-icon.png" />
              <span>Slots</span>
            </div>
          </q-tab>
          <q-tab name="sports" class="game-tab-wrapper">
            <div class="game-tab">
              <img src="../assets/images/index/game-tab/sports-icon.png" />
              <span>Sports</span>
            </div>
          </q-tab>
          <q-tab name="live" class="game-tab-wrapper">
            <div class="game-tab">
              <img src="../assets/images/index/game-tab/live-icon.png" />
              <span>Live Casino</span>
            </div>
          </q-tab>
          <q-tab name="bingo" class="game-tab-wrapper">
            <div class="game-tab" @click="openSubTabs('bingo')">
              <img src="../assets/images/index/game-tab/bingo-icon.png" />
              <span>Bingo</span>
            </div>
          </q-tab>
          <q-tab name="cockfight" class="game-tab-wrapper">
            <div class="game-tab">
              <img src="../assets/images/index/game-tab/cockfight-icon.png" />
              <span>Cock Fight</span>
            </div>
          </q-tab>
          <q-tab name="esports" class="game-tab-wrapper">
            <div class="game-tab">
              <img src="../assets/images/index/game-tab/esports-icon.png" />
              <span>Esports</span>
            </div>
          </q-tab>
          <q-tab name="fishing" class="game-tab-wrapper">
            <div class="game-tab">
              <img src="../assets/images/index/game-tab/fishing-icon.png" />
              <span>Fishing</span>
            </div>
          </q-tab>
          <q-tab name="poker" class="game-tab-wrapper">
            <div class="game-tab">
              <img src="../assets/images/index/game-tab/poker-icon.png" />
              <span>Poker</span>
            </div>
          </q-tab>
          <q-route-tab name="app-tutorial" class="game-tab-wrapper" to="/app-tutorial">
            <div class="game-tab">
              <img src="../assets/images/index/game-tab/app-tutorial-icon.png" />
              <span>App tutorial</span>
            </div>
          </q-route-tab>
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels v-model="activeTab" animated vertical transition-prev="jump-up" transition-next="jump-up">
          <q-tab-panel name="home">
            <div class="menupages">
              <!-- <div class="menu-title">Home</div> -->
              <div class="home-wrapper">
                <JackpotBanner />

                <div class="grid">
                  <div
                    style="height: 110px; position: relative"
                    v-for="(topGame, index) in topGames"
                    :key="index"
                    @click="playGame(topGame.name, topGame.platformCode, topGame.code)"
                  >
                    <transition name="in-view">
                      <q-list class="q-col-gutter-none">
                        <q-img
                          loading="lazy"
                          :src="topGame.iconImageUrl"
                          fit="fill"
                          height="110px"
                          spinner-color="white"
                          position="50% 20%"
                          style="border-radius: 10px; overflow: hidden"
                        >
                          <div class="slot-name">{{ topGame.name }}</div>
                        </q-img>
                        <img
                          style="position: absolute; left: 6px; top: 6px; width: 30px"
                          class="badge-img"
                          src="../assets/images/index/top-badge.svg"
                        />
                      </q-list>
                    </transition>
                  </div>
                </div>

                <div class="big-win">
                  <img class="big-win-banner" src="../assets/images/index/home-big-win-banner.png" />
                  <div class="big-win-list-wrapper">
                    <div class="big-win-list">
                      <div class="big-win-list-item" v-for="(topWinner, index) in topWinners" :key="index">
                        <div class="game-icon">
                          <img class="game-icon-img" :src="topWinner.iconImageUrl" />
                        </div>
                        <div class="winning-details">
                          <div class="username">{{ topWinner.loginName }}</div>
                          <div class="winning-prize">
                            <span class="win">Win</span>
                            {{ topWinner.amount }}
                          </div>
                        </div>
                        <div class="play-btn" @click="playGame(topWinner.name, topWinner.platformCode, topWinner.code)">
                          Play
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid">
                  <div
                    style="height: 110px; position: relative"
                    v-for="(hotGame, index) in hotGames"
                    :key="index"
                    @click="playGame(hotGame.name, hotGame.platformCode, hotGame.code)"
                  >
                    <transition name="in-view">
                      <q-list class="q-col-gutter-none">
                        <q-img
                          loading="lazy"
                          :src="hotGame.iconImageUrl"
                          fit="fill"
                          height="110px"
                          spinner-color="white"
                          position="50% 20%"
                          style="border-radius: 10px; overflow: hidden"
                        >
                          <div class="slot-name">{{ hotGame.name }}</div>
                        </q-img>
                        <img
                          style="position: absolute; left: 6px; top: 6px; width: 30px"
                          class="badge-img"
                          src="../assets/images/index/hot-badge.svg"
                        />
                      </q-list>
                    </transition>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="jackpot">
            <div class="menupages">
              <!-- <div class="menu-title">Home</div> -->
              <div class="home-wrapper">
                <!-- Temporary placeholder for hot games -->
                <div class="grid">
                  <div
                    style="height: 110px; position: relative"
                    v-for="(jackpot, index) in jackpotGames"
                    :key="index"
                    @click="playGame(jackpot.name, jackpot.platformCode, jackpot.code)"
                  >
                    <transition name="in-view">
                      <q-list class="q-col-gutter-none">
                        <q-img
                          loading="lazy"
                          :src="jackpot.iconImageUrl"
                          fit="fill"
                          height="110px"
                          spinner-color="white"
                          position="50% 20%"
                          style="border-radius: 10px; overflow: hidden"
                        >
                          <div class="slot-name">{{ jackpot.name }}</div>
                        </q-img>
                        <img
                          style="position: absolute; left: 6px; top: 6px; width: 30px"
                          class="badge-img"
                          src="../assets/images/index/hot-badge.svg"
                        />
                      </q-list>
                    </transition>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="esports">
            <div class="menupages">
              <!-- <div class="menu-title">Esports</div> -->
              <div class="">
                <!-- <router-link to="/e-sport">
                <img src="../assets/home/e-sport/esport-icon.png" />
              </router-link> -->
                <img src="../assets/home/e-sport/esport-icon.png" @click="playGame(null, 'TFGaming')" />
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="cockfight">
            <div class="menupages">
              <!-- <div class="menu-title">Cock Fight</div> -->
              <div>
                <!-- <router-link to="/cockfight">
                  <img src="../assets/home/cockfight/cockfight-icon.png" />
                </router-link> -->
                <img src="../assets/home/cockfight/cockfight-icon.png" @click="playGame(null, 'DS88')" />
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="live">
            <div class="menupages">
              <!-- <div class="menu-title">Live Casino</div> -->
              <div v-if="hotTrendingGames.length" style="display: flex; flex-direction: column; gap: 5px">
                <div
                  v-for="(p, index) in hotTrendingGames"
                  :key="index"
                  class="set aos-init aos-animate"
                  data-aos="fade-up"
                >
                  <div class="items" @click="playGame(p.name, p.code, p.gameCode)">
                    <div class="bgimg">
                      <div class="theme">
                        <img :src="p.bg" alt="" />
                        <!-- <img
                          class="logo"
                          :style="p.name === 'KM' ? 'max-height: 5%; bottom: 15%; left: -5%;' : ''"
                          :src="p.logo"
                        /> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="sports">
            <div class="menupages">
              <!-- <div class="menu-title">Sport</div> -->
              <div class="sportflex">
                <div id="ibc-p">
                  <img src="../assets/home/sport/sport-ug.png" @click="playGame('UG', 'UG')" />
                </div>

                <div id="ibc-p">
                  <img src="../assets/home/sport/sport-pinnacle.png" @click="playGame('Pinnacle', 'pinnacle')" />
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="fishing">
            <AviatorView :activeSubTab="activeSubTab" @platformUpdate="platformUpdate" />
            <!-- <div class="menupages">
              <div class="menu-title">Fishing</div>
                <div class="gridtwo">
                <router-link to="/aviator">
                  <div id="sp-fish">
                    <img src="../assets/home/index/fish-JILI.png" />
                    Simple Play Fishing
                  </div>
                </router-link>
                <router-link to="/aviator">
                  <div id="jili-fish">
                    <img src="../assets/home/index/fish-SP.png" />
                    JILI Fishing
                  </div>
                </router-link>
                <router-link to="/aviator">
                  <div id="yesb-fish">
                    <img style="height: 219px; width: auto" src="../assets/home/index/fish-YESB.png" />
                    YESBINGO Fishing
                  </div>
                </router-link>
              </div>
            </div> -->
          </q-tab-panel>

          <q-tab-panel name="slot">
            <!-- SlotView component also uses cached platforms data, only render after cached exist to avoid double api call -->
            <div v-if="hasPlatforms" class="menupages">
              <SlotView :activeSubTab="activeSubTab" @platformUpdate="platformUpdate" />
            </div>
          </q-tab-panel>

          <q-tab-panel name="bingo">
            <div v-if="hasPlatforms" class="menupages">
              <BingoView :activeSubTab="activeSubTab" @platformUpdate="platformUpdate" />
            </div>
          </q-tab-panel>

          <q-tab-panel name="poker">
            <div class="menupages">
              <!-- <div class="menu-title">Poker</div> -->
              <div v-if="pokerGames.length" style="display: flex; flex-direction: column; gap: 5px">
                <div v-for="(p, index) in pokerGames" :key="index" class="set aos-init aos-animate" data-aos="fade-up">
                  <div class="items" @click="playGame(p.name, p.code, p.gameCode)">
                    <div class="bgimg">
                      <div class="theme">
                        <img :src="p.bg" alt="" />
                        <!-- <img
                          class="logo"
                          :style="p.name === 'Evolution' ? 'max-height:10px; bottom: 15%;' : ''"
                          :src="p.logo"
                        /> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="minigame">
            <div v-if="hasPlatforms" class="menupages">
              <MinigameView :activeSubTab="activeSubTab" @platformUpdate="platformUpdate" />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>

  <GameModal ref="casinoGame"></GameModal>

  <SpinWheelPromo ref="spinWheelPromoRef" :isModal="true" @spinWheelOnClose="spinWheelOnCloseHandler" />
  <!--<DailyLoginCashBonusPromoPopup ref="dailyLoginPromoPopup" />-->
  <AdsPopupList ref="adsPopupListRef" />

  <q-dialog width="100%" v-model="isStationNotice">
    <q-card style="width: 100%" class="station-notice-dialog-wrapper">
      <q-card-section>
        <div class="station-notice-header">
          <div class="station-notice-header-text">Announcement</div>
          <q-btn class="station-notice-close-btn" flat round dense icon="close" v-close-popup />
        </div>

        <q-tabs
          v-model="activeKey"
          dense
          class="text-grey station-notice-tabs"
          indicator-color="black"
          align="justify"
          narrow-indicator
        >
          <q-tab v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id">
            <div class="notice-tab">{{ tab.name }}</div>
          </q-tab>
        </q-tabs>

        <!-- <q-separator /> -->

        <q-tab-panels v-model="activeKey" animated>
          <q-tab-panel v-for="(tab, i) in announcementTypes" :key="i" :name="tab.id">
            <q-list style="min-height: 65vh">
              <div v-for="(ann, idx) in announcementList" :key="idx">
                <span v-if="ann.typeId === tab.id">
                  <q-expansion-item style="max-height: 65vh; overflow: auto" group="somegroup" :label="ann.title">
                    <q-card class="station-notice-content">
                      <div class="content-separator"></div>
                      <q-card-section>
                        {{ ann.content }}
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>

                  <!-- <q-separator></q-separator> -->
                </span>
              </div>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog width="300px" v-model="is21Modal">
    <q-card style="width: 100%" class="">
      <q-card-section class="q-mb-md" style="padding: 40px 20px">
        <div class="pagcor">
          <div class="tagline">KEEP IT FUN GAME RESPONSIBLY</div>

          <div class="character-logo">
            <div class="character">
              <img class="banner-bubble" src="../assets/images/common/pacgor-character.png" />
            </div>
            <div class="pagcor-logo">
              <img class="banner-bubble" src="../assets/images/common/pacgor-logo.png" />
            </div>
          </div>
          <!--
            <div class="banner-board">
            <div class="banner-left"></div>
            <img class="banner-bubble" src="../assets/images/index/banner-bubble.png" />
            <img class="banner-logo" src="../assets/images/common/banner-logo.png" />

            <div class="banner-info">
              <div class="banner-info-top">
                <img class="banner-pagcor" src="../assets/images/common/banner-pagcor.png" />
                <div class="banner-info-tr">
                  <div class="banner-line1">Gaming for</div>
                  <div class="banner-line2">
                    <strong>21</strong>
                    years only！
                  </div>
                  <div class="banner-line3">AND ABOVE ONLY</div>
                </div>
              </div>

              <div class="mid-line">&nbsp;</div>

              <div class="banner-line4">KEEP IT FUN</div>
              <div class="banner-line5">GAME RESPONSIBLY</div>
            </div>
          </div>
          <img class="banner-top" src="../assets/images/common/banner-top.png" />
          <div class="images">
            <img src="../assets/images/index/pagcor-details.webp" />
          </div>
          -->
          <q-btn color="brand" style="border-radius: 10px" @click="confirm21Close">I'm 21+ years old.</q-btn>
          <q-btn color="#837E9E" style="border-radius: 10px" outline @click="confirm21Close">Exit</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

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
          <div class="titles backgroundColor">Update App</div>
        </div>
        <div class="contents">New Update Available. Do you wish to download it now?</div>
        <div class="btnsreas">
          <div class="cacnels borderColor fontColor" @click="cancelUpdate">Cancel</div>
          <div class="confirmsbtns btncolor" @click="openDownloadPage">Update Now</div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref, reactive, computed, onActivated, watch } from "vue";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Pagination, Slide } from "vue3-carousel";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
import { cached } from "boot/cache";
import { useQuasar, Platform, SessionStorage } from "quasar";
import { userStore } from "stores/index";
import GameModal from "components/modal/GameModal";
import { RiBasketballLine, RiVolumeUpLine, RiBilliardsLine } from "vue-remix-icons";
import MarqueeText from "vue-marquee-text-component";
import { useUI } from "stores/ui";
import SlotView from "pages/games/SlotView.vue";
import AviatorView from "pages/games/AviatorView.vue";
import BingoView from "pages/games/BingoView.vue";
import MinigameView from "pages/games/MinigameView.vue";
import { App } from "@capacitor/app";
import OneSignal from "onesignal-cordova-plugin";
import PushNotification from "./../components/modal/PushNotification.vue";
import {
  getPlatformList,
  getHotPlatformGames,
  getTopPlatformGames,
  getTopWinners,
  getJackpotGames
} from "src/api/platform/platform";
import { kycAPI } from "src/api/index/promo";
import SpinWheelPromo from "src/components/hotpromo/p4w-roulette-toto/SpinWheel.vue";
import DailyLoginCashBonusPromoPopup from "src/components/hotpromo/DAILY-LOGIN-CASH-BONUS/DailyLoginCashBonusPromoPopup.vue";
import JackpotBanner from "src/components/JackpotBanner.vue";
import AdsPopupList from "src/components/hotpromo/adsPopupList.vue";

const imgURL = process.env.IMAGE_CDN + "/promo/";

const topSelectedMenuItem = ref("lobby");
const is21Modal = ref(false);
const ui = useUI();
const scrollPageRef = ref(null);
const splitterModel = ref(20);
const pushNotificationData = ref();

const populatePushNotificationData = (data) => {
  pushNotificationData.value = data;
};

ui.$onAction(({ name, args }) => {
  switch (name) {
    case "setScrollPosition":
      scrollPageRef.value.setScrollPosition(args[0], args[1], args[2]);
  }
});

const $q = useQuasar();
const banners = ref([]);
const route = useRoute();
const router = useRouter();
const store = userStore();

const isH5 = ref(false);
const isShowDownload = ref(true);

const spinWheelPromoRef = ref();
const dailyLoginPromoPopup = ref();
const adsPopupListRef = ref();

const hotGames = ref([]);
const topGames = ref([]);
const jackpotGames = ref([]);
const topWinners = ref([]);

const casinoGame = ref(null);
const playGame = (gameName, platformCode, gameCode, gameStatus) => {
  casinoGame.value.open(gameName, platformCode, gameCode, gameStatus);
};
const pokerGames = [
  {
    code: "JILI",
    name: "Jili Games",
    status: "NORMAL",
    gameName: "Jili",
    gameCode: "64",
    bg: require("../assets/images/games/poker/home-poker-jili-banner.png"),
    logo: require("../assets/images/common/logo/jl.png")
  },
  {
    code: "RICH88",
    name: "Rich88",
    status: "NORMAL",
    gameName: "Rich88",
    bg: require("../assets/images/games/poker/home-poker-rich88-banner.png"),
    logo: require("../assets/images/common/logo/RICH88.png")
  },
  {
    code: "KM",
    name: "KM",
    status: "NORMAL",
    gameName: "KM",
    bg: require("../assets/images/games/poker/home-poker-kingmaker-banner.png"),
    logo: require("../assets/images/common/logo/km.png")
  }
];
const hotTrendingGames = [
  {
    code: "EvoAce",
    name: "Evolution",
    status: "NORMAL",
    gameName: "EVO",
    bg: require("../assets/images/games/liveCasino/home-live-evo-banner.png"),
    logo: require("../assets/images/common/logo/evo.png"),
    text: "In the Evolution live casino, there are the world's first 6-card start, VIP tables, badge baccarat, intelligent control baccarat waiting for you to enjoy non-stop."
  },
  {
    code: "AWC",
    name: "AG Sexy",
    status: "NORMAL",
    gameName: "AE Sexy",
    gameCode: "MX-LIVE-001",
    bg: require("../assets/images/games/liveCasino/home-live-ae-banner.png"),
    logo: require("../assets/images/common/logo/ae_2.png"),
    text: "AE Casino, Asia's most potential live-action video. The interface is simple and easy to operate, cross-platform, download-free, and fun anytime, anywhere!"
  },
  {
    code: "EZUGI",
    name: "Ezugi",
    status: "NORMAL",
    gameName: "Ezugi",
    bg: require("../assets/images/games/liveCasino/home-live-ezugi-banner.png"),
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
    // main: require("../assets/home/sport/cmd.png"),
    logo: require("../assets/logo/CMD.png")
  }
];

const confirm21Close = () => {
  is21Modal.value = false;

  adsPopupListRef.value.initGetAdsList();
};

const closeTopBox = () => {
  isH5.value = false;
  store.hasClosedDL = true;
  sessionStorage.setItem("DOWNLOAD_POPUP", "1");
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
      downloadUrl.value = "https://p4w.app/";
    });
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
    var current_version = parseInt(info.version.replaceAll(".", "") + info.build);
    ui.setVersion(info.version + " " + info.build);

    // info.version && info.build
    const appType = "ALL";
    const device = Platform.is.android ? "ANDROID" : "IOS";
    const res = await api.get(`/config/appVersionAndUrl?type=${appType}&device=${device}`);
    console.log(res, ">>res");
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
  } else if (Platform.is.ios && "standalone" in window.navigator && window.navigator.standalone) {
    ui.appVersion = "iOS App";
  }
};

const openDownloadPage = () => {
  window.open(download_url.value, "_system");
  isAppUpdateModal.value = false;
};
const cancelUpdate = () => {
  isAppUpdateModal.value = false;
};

const platforms = ref([]);
const currentGamePlatforms = ref([]);

const gamePage = reactive({
  hotGamesList: [
    {
      id: 20,
      name: "Rocket Crash",
      code: "rocketCrash",
      icon: "rocket-crash"
    },
    {
      id: 17,
      name: "Ancient Defense",
      code: "ancientDefense",
      icon: "ancient-defense"
    },
    {
      id: 15,
      name: "Soccer Shoot Out",
      code: "soccerShootOut",
      icon: "soccer-shoot-out"
    }
  ],
  slotList: [],
  fishList: [],
  currentPage: 1,
  pageSize: 40,
  searchType: "",
  searchKey: "",
  total: 0
});
const gameListData = ref([]);
const fishPlatforms = ref([]);
const selectedPlatSlot = ref(null);
const selectedPlatFish = ref(null);
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
const loadGameList = (type) => {
  const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
  var code = null;
  if (type === "FISH") {
    code = selectedPlatFish.value.id;
  }
  if (type === "SLOT") {
    code = selectedPlatSlot.value.id;
  }

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
        .then((res) => {
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
      if (type === "FISH") {
        res.forEach((element) => {
          element.default = require("../assets/images/games/aviator/default.png");
          element.icon = `${process.env.IMAGE_CDN}/games/fish/${selectedPlatFish.value.code}/${element.icon}.png`;
        });
        gamePage.total = res.length;
        changePage(1, gamePage.pageSize, type, res);
      }
      if (type === "SLOT") {
        res.forEach((element) => {
          element.default = require("../assets/images/games/aviator/default.png");
          element.icon = `${process.env.IMAGE_CDN}/games/slot/${selectedPlatSlot.value.code}/${element.icon}.png`;
        });
        gamePage.total = res.length;
        changePage(1, gamePage.pageSize, type, res);
      }
    });
};
const hasPlatforms = computed(() => platforms.value.length > 0);
const changePage = (page, pageSize, type, response) => {
  if (type === "FISH") {
    gamePage.fishList = response;
  }
  if (type === "SLOT") {
    gamePage.slotList = response;
  }
  // gamePage.gameList = gameListData.value.slice((page - 1) * pageSize, page * pageSize);
};
const getPlatList = () => {
  getPlatformList().then((data) => {
    if (!data) return;

    data.forEach((d) => {
      d.gameType.includes("SLOT") && platforms.value.push(d);
      d.gameType.includes("FISH") && fishPlatforms.value.push(d);
    });

    selectedPlatSlot.value = platforms.value.length ? platforms.value[0] : null;
    selectedPlatFish.value = fishPlatforms.value.length ? fishPlatforms.value[0] : null;

    loadGameList("SLOT");
    loadGameList("FISH");
  });
};

const getTopPlatList = () => {
  getTopPlatformGames().then((res) => {
    if (res.code === 0) {
      const topGamesList = res.data.map((game) => {
        const { icon, platformCode, gameType } = game;
        return {
          ...game,
          iconImageUrl: `${process.env.IMAGE_CDN}/games/${gameType.toLowerCase()}/${platformCode}/${icon}.png`
        };
      });
      topGames.value = topGamesList.splice(0, 3);
    }
  });
};

const getHotPlatList = () => {
  getHotPlatformGames().then((res) => {
    if (res.code === 0) {
      const hotGamesList = res.data.map((game) => {
        const { icon, platformCode, gameType } = game;
        return {
          ...game,
          iconImageUrl: `${process.env.IMAGE_CDN}/games/${gameType.toLowerCase()}/${platformCode}/${icon}.png`
        };
      });
      hotGames.value = hotGamesList;
    }
  });
};

const getJackpotGamesList = () => {
  getJackpotGames().then((res) => {
    if (res.code === 0) {
      const jackpotGameList = res.data.map((game) => {
        const { icon, platformCode, gameType } = game;
        return {
          ...game,
          iconImageUrl: `${process.env.IMAGE_CDN}/games/${gameType.toLowerCase()}/${platformCode}/${icon}.png`
        };
      });
      jackpotGames.value = jackpotGameList;
    }
  });
};

const getTopWinnersList = () => {
  getTopWinners().then((res) => {
    if (res.code === 0) {
      const topWinnersList = res.data.map((game) => {
        const { icon, platformCode, gameType } = game;
        return {
          ...game,
          iconImageUrl: `${process.env.IMAGE_CDN}/games/${gameType.toLowerCase()}/${platformCode}/${icon}.png`
        };
      });
      topWinners.value = topWinnersList;
    }
  });
};

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
    isShowDownload.value = false;
  }
};

const getLength = (tab, ann) => {
  var categoryLength = announcementList.value.filter((item) => item.id == ann.typeId);
  return categoryLength.length;
};

const loadEsport = (id) => {
  if (store.token) {
    const isMobile = Platform.is.mobile;
    if (isMobile) {
      var way = null;
      if (Platform.is.android) {
        way = "ANDROID";
      } else if (Platform.is.ios) {
        way = "IOS";
      }
    }
    var src = null;
    api
      .get(`/session/launch?_time=${new Date().getTime()}`, {
        params: {
          platform: "TFGaming",
          gameCode: null,
          isMobile: isMobile,
          way: way
        }
      })
      .then((res) => {
        if (res.code === 0) {
          src = `${res.data}&lootbox_game_id=${id}&esports=false`;
          casinoGame.value.open("esports", src);
        } else {
        }
        $q.loading.hide();
      });
  } else {
    router.push({ path: "/login", query: { redirect: route.path } });
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
  const redirectU = "/promo" + banner.redirectUrl;
  router.push(`${redirectU}`);
};
const refGameTabs = ref();
const activeTab = ref("home");
const activeSubTab = ref("");
const selectTab = (tab) => {
  activeTab.value = tab;
};

const platformUpdate = (platforms) => {
  currentGamePlatforms.value = platforms;
  activeSubTab.value = platforms[0].code;
};

const updateTabEvent = () => {
  console.log(refGameTabs.value);
};

const isShowRegSuccessModal = ref(false);
const initRegSuccessModal = () => {
  if (route.query && route.query.isFromRegister) isShowRegSuccessModal.value = true;
};

const isRedirectToPromoClicked = ref(false);
const redirectToPromo = () => {
  isRedirectToPromoClicked.value = true;
  isShowRegSuccessModal.value = false;
  router.push("/finance/deposit?isFromWelcomePromo=true");
};

const initOneSignal = () => {
  OneSignal.initialize("322d9502-6a28-4131-9375-ef2d7f56d787");

  let myClickListener = async function (event) {
    console.log("CLICK PUHS");
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
const openSubTabs = (parentTab) => {
  activeTab.value = parentTab;
  activeSubTab.value = platforms.value[0].code;
};

const openDailyLoginPromo = () => {
  kycAPI().then((res) => {
    if (res.code === 0) {
      if (res.data.hasKYC) {
        dailyLoginPromoPopup.value.open();
      }
    }
  });
};

watch(
  () => store.token,
  () => {
    if (store.token) {
      // openDailyLoginPromo();
    }
  }
);

const showAdsPopupList = () => {
  if (!store.token || sessionStorage.getItem("showAdsPopupList") !== "true") {
    return;
  }

  if (store.currentDeposit === "0.0000" || parseInt(store.currentDeposit) === 0) {
    router.push("/promo");
  }

  adsPopupListRef.value.initAdsPopupList();

  sessionStorage.removeItem("showAdsPopupList");
};

const spinWheelOnCloseHandler = () => {
  showAdsPopupList();
};

const showSpinWheel = () => {
  return new Promise((resolve, reject) => {
    if (!store.token || sessionStorage.getItem("showSpinWheel") !== "true") {
      return resolve();
    }

    api
      .get("/session/loggedInPromoPages")
      .then((res) => {
        if (res.code === 0) {
          const showSpinWheelPromo = res.data.find(
            ({ promoCode, privilegeStatus }) => promoCode === "P4W-ROULETTE-TOTO" && privilegeStatus === "OPEN"
          );

          if (showSpinWheelPromo) {
            spinWheelPromoRef.value
              .getSpinRoulette()
              ?.then((isShowSpinWheelSuccess) => {
                resolve(isShowSpinWheelSuccess);
              })
              .catch((err) => {
                console.log(err);
                return resolve();
              });

            sessionStorage.removeItem("showSpinWheel");
          } else {
            return resolve();
          }
        } else {
          return resolve();
        }
      })
      .catch((err) => {
        console.log(err);
        return resolve();
      });
  });
};

onMounted(() => {
  getPlatList();
  getHotPlatList();
  getTopPlatList();
  getJackpotGamesList();
  getTopWinnersList();

  api.get("/promo/banner?category=HOME").then((res) => {
    if (res.code === 0) {
      banners.value = res.data;
    }
  });

  loadAnnouncement();
  checkPlatform();
  getAppDownloadUrl();
  getVersionNo();
  if (Platform.is.android && Platform.is.capacitor) {
    initOneSignal();
  }

  if (sessionStorage.getItem("is21Modal")) {
    is21Modal.value = false;
  } else {
    is21Modal.value = true;
    sessionStorage.setItem("is21Modal", "true");
  }

  var platformGamesApiUrl = store.hasToken() ? "/session/loggedInPlatformGames" : "/platformGames";
  api
    .get(platformGamesApiUrl, {
      params: {
        platformId: 16,
        gameType: "CASUAL",
        device: "WEB"
      }
    })
    .then((ret) => {
      const res = ret.data;
      console.log(res);
    })
    .catch((err) => {});
});
onActivated(() => {
  // redirect to home tab if click on App Tutorial tab
  if (activeTab.value === "app-tutorial") {
    activeTab.value = "home";
  }

  // console.log("On Activated");
  initRegSuccessModal();

  // show spin wheel otherwise ads popup list
  showSpinWheel()
    .then((isShowSpinWheelSuccess) => {
      !isShowSpinWheelSuccess && showAdsPopupList();
    })
    .catch((err) => {
      console.log(err);
      showAdsPopupList();
    });
});
const imageLoading = ref(false);
const selectedLiveTab = ref();
const openGame = (gameName, gameCode, gameStatus, type) => {
  if (type === "slot") {
    casinoGame.value.open(gameName, selectedPlatSlot.value.code, gameCode, gameStatus);
  }
  if (type === "fish") {
    casinoGame.value.open(gameName, selectedPlatFish.value.code, gameCode, gameStatus);
  }
};
</script>
<style lang="scss" scoped>
.download-top-container {
  .download-top-box {
    display: flex;
    padding: 10px;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
    height: 55px;
    background: #50aef330;

    .q-icon {
      font-size: 24px;
      color: #999;
    }

    .headicon {
      width: 50px;
    }

    .download-txt-container {
      flex: 4;
      font-size: 0.7rem;
      line-height: 0.8rem;
      display: flex;
      flex-direction: column;
      color: #333;

      .download-title {
        font-size: 0.8rem;
        color: #000;
        margin-bottom: 1px;
      }

      .download-content {
        max-width: 11rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .buttons {
      display: flex;
      gap: 5px;
    }

    .top-btn {
      background-image: linear-gradient(180deg, #52acff 0, #3559da 100%), linear-gradient(#52acff, #3559da);
      text-align: center;
      height: 32px;
      color: #fff;
      white-space: nowrap;
      letter-spacing: 0px;
      border-radius: 16px;
    }
  }
}

.q-tabs {
  background: #2b2b4b;
  padding: 5px;
  border-radius: 5px;

  .q-tab {
    padding: 0 20px;
    border-radius: 5px;
    min-height: 32px;

    &--active {
      background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      // background-image: $primary-linear, $primary-linear;
      // background-blend-mode: normal, normal;
      // color: #000;
    }
  }
}

.q-tab-panels {
  background: transparent;
}
.q-tab-panel {
  background: transparent;
  padding: 0;

  .tabgrid {
  }
}

.body--dark {
  .station-notice-dialog-wrapper {
    .station-notice-header {
      .station-notice-header-text {
        color: #fff;
      }
    }

    .station-notice-content {
      color: #a7a7a9;
    }
  }
}
</style>
<style lang="scss">
.station-notice-dialog-wrapper {
  .q-expansion-item {
    background: #fff;
    border-radius: 10px;

    .q-item__section {
      padding-top: 10px 0px;
    }
  }

  .q-item__label {
    color: #2b2b82;
    font-family: "Poppins Bold";
    font-size: 14px;
    font-weight: 700;
  }
}

.body--dark {
  .station-notice-dialog-wrapper {
    .q-expansion-item {
      background: #232228;
    }

    .q-item__label {
      color: #fff;
    }
  }
}

.carousel__item {
  width: 100%;
}

.carousel__slide {
  padding: 0 5px;
}

.carousel__pagination {
  margin: 0;
  padding: 0;
  position: absolute;
  bottom: 10px;
  margin: 0 auto;
  width: 100%;
}

button.carousel__pagination-button {
  display: block;
  background: rgba(255, 255, 255, 0.2);
  width: 0px;
  padding: 3px;

  &--active {
    background: #ffffff;
  }
}

li.carousel__slide.carousel__slide--next,
li.carousel__slide.carousel__slide--prev {
  transform: scaleY(0.9);
  filter: brightness(0.8);
}
</style>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Bungee&display=swap");

$link-color: $primary;
.loadmore {
  margin: 10px auto 30px;
  border: 1px solid $primary;
  border-radius: 5px;
  display: table;
}

.menu-icons,
.commonlabel-icons {
  &.hvr-icon-circle {
    position: relative;

    &:before,
    &:after {
      content: "";
      background: linear-gradient(#000000, transparent);
      position: absolute;
      width: 0;
      height: 10px;
      left: 10px;
      border-radius: 100%;
    }

    &:after {
      transform: rotateZ(44deg);
    }
  }

  @keyframes rotate {
    0% {
      border: 10px solid #23263c;
      border-left: 10px solid transparent;
    }
    30% {
      transform: rotateZ(360deg);
    }
    60% {
      border: 10px solid #23263c;
      border-left: 10px solid transparent;
    }
    70% {
      border-top: 10px solid transparent;
    }
    80% {
      border-right: 10px solid transparent;
    }
    90% {
      border: 10px solid transparent;
    }
    100% {
      transform: rotateZ(720deg);
    }
  }

  .vip-icon {
    &.hov {
      display: none;
    }
  }

  .livecasino-icon {
    transition: all 0.5s ease-in;
    border: 1px solid #ffffff;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    border: 3px dotted #ffffff;
    font-size: 10px;
    text-align: center;
    margin-right: 6px;
    line-height: 13px;
  }

  .poker-icon {
    padding-left: 5px;

    .pokercards {
      // Outer wrapper for all cards
      position: relative; // Get control of the positioning
      height: 18px; // height of each card
      width: 15px; //width of each card
      margin-right: 10px;
      font-size: 10px; //size of number
      line-height: 5px; //affects vert position of number
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

    margin-right: 10px;
    display: flex;
    align-items: center;

    &:before {
      content: "";
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 5px solid white;
      display: inline-block;
    }

    &:after {
      content: "";
      display: inline-block;
      border-radius: 50%;
      width: 15px;
      height: 10px;
      background: #ffffff;
    }
  }

  .slot-icon {
    transition: all 0.2s ease-in;
    font-size: 8px;
    line-height: 10px;
    font-weight: bold;
    margin-right: 8px;
    position: relative;
    border: 0.5px solid #ffffff;
    padding: 2px;

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

  @keyframes offset {
    to {
      stroke-dashoffset: 0;
    }
  }
  @keyframes fill-green {
    to {
      fill: #78be20;
      stroke: transparent;
    }
  }

  svg.home-icon {
    width: 22px;
    height: 22px;
  }

  path {
    stroke-width: 0.5;
    stroke-dasharray: 3212;
    stroke-dashoffset: 3212;
    fill: transparent;
  }

  svg path {
    fill: none;
    stroke: #ffffff;
    stroke-width: 2;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    -webkit-animation: dash 10s linear forwards;
    animation: dash 10s linear forwards;
  }

  @-webkit-keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
  @-webkit-keyframes spin {
    1% {
      content: "1";
    }
    2% {
      content: "2";
    }
    3% {
      content: "3";
    }
    4% {
      content: "4";
    }
    5% {
      content: "5";
    }
    6% {
      content: "6";
    }
    7% {
      content: "7";
    }
  }
  @-webkit-keyframes animateFish {
    0% {
      transform: translateY(-5px) scale(0.4);
    }
    20% {
      transform: translateX(10px) translateY(-6px) scale(0.4);
    }
    30% {
      transform: translateX(10px) translateY(-5px) scale(0.4);
    }
    50% {
      transform: translateX(10px) translateY(-6px) rotateY(180deg) scale(0.6);
    }
    80% {
      transform: translateX(-5px) translateY(-5px) rotateY(180deg) scale(0.4);
    }
    90% {
      transform: translateX(-10px) translateY(0px) scale(1);
    }

    100% {
      transform: translateX(0) rotateY(0deg) scale(1);
    }

    // 50% {
    //   transform: translateY(-3px);
    //   transform: translateX(10px);
    // }
    // 80% {
    //   transform: translateY(-5px);
    // }
    // 100% {
    //   transform: rotateY(180deg);

    //   transform: translateY(-3px);
    // }
  }
  @keyframes shine {
    100% {
      background: #434343;
    }
  }

  &.router-link-active {
    color: $link-color;

    svg {
      fill: $link-color;
    }

    svg path {
      stroke: #ff6600;
    }

    .livecasino-icon {
      transform: rotateY(360deg);
      border-color: $link-color;
    }

    .poker-icon {
      .pokercards {
        .pokercard {
          background: #23263c;
          color: $link-color;
          border-color: $link-color;
        }
      }
    }

    .slot-icon {
      border-color: $link-color;

      span {
        border-color: $link-color;
      }
    }

    .fish-icon {
      &:before,
      &:after {
        border-left-color: $link-color;
      }

      &:after {
        background: $link-color;
      }
    }
  }

  // &::after {
  //   content: "";
  //   position: absolute;
  //   width: 40px;
  //   height: 40px;
  //   top: 0;
  //   right: 0px;
  //   left: 0px;
  //   background: transparent;
  //   margin: auto;
  //   bottom: 0px;
  //   display: inline-block;
  //   transition: all 1s ease-out;
  // }
  // &:hover {
  //   opacity: 1;
  //   &::after {
  //     transform: rotate(500deg);
  //     border: 1px solid #ffffff;
  //     background: transparent;
  //     display: inline-block;
  //   }
  // }
  // &.router-link-active {
  //   opacity: 1;
  //   color: #1bcef1;
  //   &:after {
  //     border: 0;
  //     border: 1px solid #1bcef1;
  //     background: transparent;
  //     color: #1bcef1;
  //     display: inline-block;
  //     transform: rotate(20deg);
  //   }
  // }
}

.menu-icons {
  position: relative;
  display: block;
  color: #ffffff;
  transition: all 0.3s ease-out;
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.commonlabel-icons {
  padding-top: 10px;
  position: relative;
  display: block;
  color: #ffffff;
  transition: all 0.3s ease-out;
  font-size: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;

  .slot-icon {
    border-color: $link-color;

    span {
      border-color: $link-color;
    }
  }

  .fish-icon {
    &:before,
    &:after {
      border-left-color: $link-color;
    }

    &:after {
      background: $link-color;
    }
  }

  .livecasino-icon {
    transform: rotateY(360deg);
    border-color: $link-color;
  }
}

.pagcor {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .tagline {
    font-family: "Poppins Bold";
    font-size: 20px;
    font-weight: 700;
    text-align: center;
  }

  .character-logo {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .images {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 70%;
    margin: 0 auto 20px;
  }

  .banner-top {
    display: none;
  }
}

.midd {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 10px;

  .station-notice-wrapper {
    display: flex;
    background: #fff;
    color: #83a3ca;
    border: 1px solid #fff;
    border-radius: 10px;
    // margin: 10px;
    gap: 10px;
    padding: 5px 10px;
    justify-content: center;
    align-items: center;
    width: 85%;
    flex: 1;

    .volume {
      // padding-top: 5px;
      svg {
        fill: #6ccaff;
        display: block;
        width: 16px;
      }
    }

    span {
      margin-right: 10px;
      cursor: pointer;
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

.common-label {
  .wimg {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;

    img {
      width: 100%;
      max-width: 12px;
      margin-bottom: 3px;
    }
  }
}

.topbonus {
  padding: 10px;

  .gridthree {
    grid-template-rows: 100px;
  }

  // .gridthree {
  //   display: grid;
  //   grid-template-columns: repeat(3, 1fr);
  //   gap: 30px;
  //   grid-template-rows: 85px;
  //   margin: 10px auto;
  //   .gridthree-item {
  //     height: 100%;
  //     border-radius: 20px;
  //     overflow: hidden;
  //     display: flex;
  //     justify-content: center;
  //     align-items: center;
  //     img {
  //       width: 100%;
  //     }
  //   }
  // }
}

.menu-tabs {
  width: calc(100% - 16px);
  max-width: 500px;
  margin: 10px auto;
  overflow-x: auto;

  .q-tabs {
    background: transparent;
    padding: 0px 8px;

    .q-tab {
      width: 100%;
      color: #83a3ca;
      padding: 0px;
      text-transform: capitalize;
      margin-bottom: 10px;
      border-radius: 6px;
      background: transparent;

      &.game-tab-wrapper {
        background: #f1f7ff;
      }

      .game-tab {
        width: 80px;
        height: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        white-space: pre-wrap;

        img {
          height: 35px;
        }
      }

      .sub-game-tab {
        width: 100%;
        height: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        white-space: pre-wrap;
        padding: 2px 5px;

        img {
          width: 100%;
          max-width: 60px;
          max-height: 30px;
        }
      }

      .q-tab__content {
        span {
          line-height: 12px;
          font-weight: 700;
          font-family: "Poppins Regular";
          font-size: 10px;
        }
      }
    }
    .q-tab--active {
      &.game-tab-wrapper {
        span {
          color: white !important;
          font-size: 11px;
          display: block;
          font-family: "Poppins Bold";
          -webkit-text-fill-color: initial;
        }
        font-weight: bold;
        background: #1a2cea;
      }
    }
    .q-tab--active {
      &.sub-game-tab-wrapper {
        border: 2px solid #1a2cea;
        background: transparent;
      }
    }
  }
}

//.menu-tabs {
//  display: grid;
//  grid-template-columns: repeat(3, 1fr);
//  justify-content: space-between;
//  align-items: center;
//  padding-bottom: 8px;
//  overflow-x: scroll;
//  row-gap: 10px;
//  column-gap: 10px;
//
//  .tab {
//    position: relative;
//    border-radius: 15px;
//    min-width: 100px;
//    aspect-ratio: 166/105;
//    background-image: url("../assets/images/common/bghometabs.png");
//    background-size: cover;
//
//    img {
//      position: absolute;
//      right: 0px;
//      top: 50%;
//      aspect-ratio: 1/1;
//      object-fit: contain;
//      transform: translate(0%, -50%);
//      bottom: 10px;
//      max-width: 55%;
//    }
//
//    &:active {
//      background: $primary-light;
//    }
//  }
//
//  .tab .imggtext {
//    position: absolute;
//    font-size: 16px;
//    color: #000;
//    font-weight: bold;
//    //bottom: 60%;
//    top: 50%;
//    transform: translate(0, -50%);
//    left: 8px;
//    width: 45px;
//    height: 36px;
//    line-height: 18px;
//  }
//}

.menupages {
  width: 100%;
  padding: 0px 10px;

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 250px;
    margin: 0 auto;
  }

  img {
    width: 100%;

    &:active {
      filter: brightness(0.9);
      transform: translate(0px, 1px);
    }
  }

  .menu-title {
    font-weight: 700;
    font-size: 24px;
    line-height: 24px;
    padding: 10px 10px 0;
    letter-spacing: 0.01em;
    color: #000;
    background-image: linear-gradient(104.75deg, #4183d3 39.58%, #8ec1f7 109.58%);
    opacity: 0.8;
  }

  .home-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(80px, 1fr));
      gap: 10px;
      width: 100%;
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
        background: linear-gradient(0deg, #1f2035cf 20%, transparent);
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
        text-align: center;
        line-height: 15px;
      }
    }

    .big-win {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .big-win-banner {
        width: 100%;
        max-width: 186px;
        margin-bottom: -20px;
        z-index: 1;
      }

      .big-win-list-wrapper {
        border-radius: 10px;
        overflow: hidden;
        width: 100%;
      }

      .big-win-list {
        width: 100%;
        max-height: 255px;
        overflow-y: auto;

        .big-win-list-item {
          display: grid;
          grid-template-columns: 70px 1fr auto;
          align-items: center;
          padding: 8px 10px;

          &:nth-child(odd) {
            background-color: #1a2be0;
          }

          &:nth-child(even) {
            background-color: #3341e4;
          }

          &:hover {
            background-color: #1a69e0;
          }

          .game-icon {
            width: 55px;
            height: 55px;
            border-radius: 10px;
            overflow: hidden;

            .game-icon-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .winning-details {
            color: #fff;

            .username {
              color: #ffffff99;
            }

            .winning-prize {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              gap: 5px;

              .win {
                text-transform: uppercase;
                background-color: #ffa800;
                font-weight: 700;
                padding: 2px 5px;
                border-radius: 5px;
              }
            }
          }

          .play-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 25px;
            width: 50px;
            background: linear-gradient(270deg, #76b5fa 0%, #ffffff 44.79%, #76b5fa 100%);
            box-shadow: 0px -4px 4px 0px #2b74b0 inset;
            box-shadow: -1px 2px 4px 0px #ffffffcc inset;
            color: #15599a;
            border-radius: 25px;
            font-weight: 700;
          }
        }
      }
    }
  }

  .sportflex {
    display: flex;
    // padding: 0 10px 10px;
    gap: 0px;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    > div {
      position: relative;
    }

    img {
      &:active {
        filter: brightness(0.9);
        transform: translate(0px, 1px);
      }
    }

    .playnowbtn {
      position: absolute;
      width: 127px;
      height: 36px;
      left: 10px;
      bottom: 15px;
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: #fff;
      background: #f77600;
      border-radius: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.station-notice-dialog-wrapper {
  // background: linear-gradient(104.75deg, #4183d3 39.58%, #8ec1f7 109.58%);
  padding: 20px;
  .station-notice-header {
    display: flex;
    align-items: center;
    position: relative;
    padding: 10px 0px;

    .station-notice-header-text {
      font-family: "Poppins Bold";
      color: #000;
      font-size: 22px;
      text-align: left;
    }

    .station-notice-close-btn {
      position: absolute;
      right: 0;
      margin: 0 1rem 0 0;
      color: #b9b9bb;
    }
  }

  .station-notice-tabs {
    background: transparent;
    padding: 10px 0px;
    border-radius: 0;
  }

  .q-tabs .q-tab--active {
    .notice-tab {
      //background: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);
      //background-clip: text;
      //-webkit-background-clip: text;
      //-webkit-text-fill-color: transparent;
      text-shadow: none;
      font-family: "Poppins Bold";
      border-bottom: 3px solid #2b33e9;
    }
  }

  .station-notice-content {
    background: transparent;
    padding: 0 16px;
    color: #83a3ca;
    font-family: "Poppins Regular";
    font-size: 14px;

    .content-separator {
      border-bottom: 1px solid #83a3ca33;
      margin-bottom: 20px;
    }
  }
}

.gridtwo {
  //display: grid;
  //grid-template:
  //gap: 30px;
  //grid-template-rows: 200px;
  margin: 10px auto;
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 450px;
  flex-wrap: wrap;

  > a,
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-weight: bold;
    width: 48%;
    text-align: center;
    font-size: 16px;
  }

  .item-group {
    width: 100%;
    margin: 0 auto;
    // display: grid;
    // grid-gap: 20px;
    // grid-template-columns: repeat(2, 1fr);
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .set {
    margin: auto;
    width: 50%;
  }

  .items {
    position: relative;
    cursor: pointer;
    width: 100%;
    margin: auto;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    flex-direction: column;

    .bgimg {
      position: relative;

      .theme {
        overflow: hidden;

        img {
          width: 100%;
          vertical-align: middle;

          &.logo {
            width: 45%;
            height: auto;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 10%;
            margin: auto;
          }
        }
      }

      .main-object {
        position: absolute;
        bottom: 0;
        right: 0px;
        height: auto;
        overflow: hidden;
        transform: translateY(0px);
        transition: 0.3s;
        display: flex;
        align-items: flex-end;

        img {
          vertical-align: middle;
          // width: 100%;
          width: 75%;
        }
      }
    }

    &:hover .main-object {
      position: absolute;
      transform: translateX(-25px);
    }

    .sub-object {
      display: none;
      position: absolute;
      top: 0;
      left: 10px;
      height: 225px;
      overflow: hidden;
      transform: translateY(0px);
      transition: 0.3s;

      img {
        vertical-align: middle;
        width: 100%;
      }
    }

    .txt {
      padding: 10px 20px;
      background: linear-gradient(transparent, #2b2b4b);
      border-radius: 0 0 20px 20px;
      // position: absolute;
      // bottom: 0px;
      // // background: #2b2b4b;
      // padding: 20px;
      // color: #fff;
      // width: 100%;
      // filter: brightness(0.9);
      // border-radius: 0 0 20px 20px;

      p {
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 16px;
      }

      img {
        max-width: 50%;
        margin: 0 0 10px;
        display: block;
        max-height: 30px;
      }
    }

    &:hover {
      .txt {
        opacity: 1;
        filter: brightness(1);
      }
    }
  }
}

.reg-success-dialog {
  overflow-x: hidden;
  border-radius: 20px;
  max-height: calc(100vh - 68px);
  margin: 0px;

  .q-card__section--vert {
    padding-left: 0px !important;
  }

  .header-text {
    text-align: center;
    color: #fff;
    font-family: Poppins;
    line-height: normal;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: url(../assets/images/promotion/register/header.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 10px;
    margin: 0;
    position: relative;
    width: 100%;

    .title-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;

      .title {
        font-size: 1.625rem;
        font-weight: 600;
      }

      img {
        width: 2rem;
      }
    }

    .desc {
      font-size: 1.25rem;
      font-weight: 500;
    }
  }

  .header-close-btn {
    position: absolute;
    right: 15px;
    top: 15px;
    background: #bfbfbf;
    color: #283853;
  }

  .body-content {
    position: relative;
    right: 1.25%;

    .bg-img-wrapper {
      width: 100%;
      overflow: visible;

      .bg-content-wrapper {
        background: url(../assets/images/promotion/register/background.png) no-repeat center center;
        background-size: cover;
        border-radius: 15px;
        margin-top: -5px;
        display: flex;
        padding: 50px;
        position: relative;
        flex: 1;
        &__account-left {
          flex: 1;
          padding-left: 70px;
        }
        .account-deposit {
          flex: 1;
          &__account-details {
            background-size: cover;
            height: 250px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #ffffff;
            margin-top: 120px;

            gap: 30px;
          }
          &__account-buttons {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 14px;
            margin: 55px auto 0;
            flex-direction: column;

            .deposit-btn {
              background: url(../assets/images/promotion/register/depositbtn.png) no-repeat center center;
              padding: 10px 50px;
              color: #ffffff;
              background-size: cover;
              font-size: 24px;
              cursor: pointer;
            }
            .back-to-p4w-btn {
              background: url(../assets/images/promotion/register/p4wbtn.png) no-repeat center center;
              padding: 10px 20px;
              color: #000000;
              font-size: 20px;
              background-size: cover;
              cursor: pointer;
            }
          }
          .account-details {
            &__account-name {
              font-size: 30px;
              font-weight: 500;
              line-height: 38px;
              text-align: center;
            }
            &__remember-account {
              font-size: 16px;
              width: 58%;
              text-align: center;
              color: #ffffffb2;
            }
          }
        }
        .first-deposit {
          position: absolute;
          bottom: 109px;
          left: -5%;
        }
      }
    }

    .bonus-text-wrapper {
      position: absolute;
      bottom: 42.5%;
      width: 105.5%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      text-align: center;
      font-family: Poppins;
      font-size: 2.25rem;
      font-weight: 600;
    }

    .get-btn-wrapper {
      position: absolute;
      bottom: 13%;
      width: 105.5%;
      height: 10%;
      display: flex;
      align-items: center;
      justify-content: center;

      .get-btn {
        height: 100%;
        width: 50%;
        margin: 0 5px 0 0;
      }
    }
  }
}

@media (max-width: 550px) {
  .pagcor .banner-top {
    display: block;
  }
  .pagcor .banner-board {
    display: none;
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

  .title {
    font-size: 6.5vw !important;
  }

  .desc {
    font-size: 5vw !important;
  }

  .bonus-text-wrapper {
    font-size: 9vw !important;
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
</style>
