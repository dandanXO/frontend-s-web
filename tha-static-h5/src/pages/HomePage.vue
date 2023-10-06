<template>
  <div class="main-section">
    <q-carousel
      :class="!$q.screen.gt.sm ? 'home-banner-h5' : 'home-banner-web'"
      autoplay
      navigation
      v-model="slide"
      swipeable
      infinite
    >
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
        :img-src="
          !$q.screen.gt.sm
            ? imgURL + banner.mobileImageUrl
            : imgURL + banner.desktopImageUrl
        "
        @click="gotoPromo(banner)"
      >
      </q-carousel-slide>
    </q-carousel>

    <div class="midd">
      <div class="station-notice-wrapper">
        <div class="volume">
          <img src="../assets/images/menu/announce-icon.png" />
        </div>
        <marquee-text
          :repeat="announcementList.length"
          :duration="announcementList.length * 20"
        >
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
    </div>
    <div class="items-center grid">
      <div
        class="game-board-item"
        :class="currentSelectedMenu == 'slots' ? 'active-board' : ''"
        @click="switchMenu('slots')"
      >
        <img src="../assets/images/index/home-slot.png" />
        <span>{{ $t("lang.slot_header") }}</span>
      </div>
      <div
        class="game-board-item"
        :class="currentSelectedMenu == 'sport' ? 'active-board' : ''"
        @click="switchMenu('sport')"
      >
        <img src="../assets/images/index/home-sport.png" />
        <span>{{ $t("lang.sport_header") }}</span>
      </div>

      <div
        class="game-board-item"
        :class="currentSelectedMenu == 'live' ? 'active-board' : ''"
        @click="switchMenu('live')"
      >
        <img src="../assets/images/index/home-live.png" />
        <span>{{ $t("lang.live_header") }}</span>
      </div>

      <div
        class="game-board-item"
        :class="currentSelectedMenu == 'fish' ? 'active-board' : ''"
        @click="switchMenu('fish')"
      >
        <img src="../assets/images/index/home-fish.png" />
        <span>{{ $t("lang.fish_header") }}</span>
      </div>

      <div
        class="game-board-item"
        :class="currentSelectedMenu == 'cf' ? 'active-board' : ''"
        @click="switchMenu('cf')"
      >
        <img src="../assets/images/index/home-cf.png" />
        <span>{{ $t("lang.fish2_list") }}</span>
      </div>

      <div
        class="game-board-item"
        :class="currentSelectedMenu == 'casual' ? 'active-board' : ''"
        @click="switchMenu('casual')"
      >
        <img src="../assets/images/index/home-esport.png" />
        <span>E-Sport</span>
      </div>

      <div
        class="game-board-item"
        :class="currentSelectedMenu == 'lottery' ? 'active-board' : ''"
        @click="switchMenu('lottery')"
      >
        <img src="../assets/images/index/home-lottery.png" />
        <span>{{ $t("lang.lottery_list") }}</span>
      </div>

      <!--      <div class="game-board-item"-->
      <!--           :class="(currentSelectedMenu=='fish2') ? 'active-board' : ''"-->
      <!--           @click="switchMenu('fish2')"-->
      <!--      >-->
      <!--        <img src="../assets/images/index/home-fish2.png"/>-->
      <!--        <span>เกมส์เล็ก ๆ</span>-->
      <!--      </div>-->
    </div>

    <Transition>
      <div
        class="game-grid-lists"
        id="id-sport-board"
        v-if="currentSelectedMenu === 'sport'"
      >
        <div
          class="game-item btn-pointer mid-grid-column"
          v-for="(sport, index) in sportsGame"
          :key="`sports-${index}`"
          @click="playGame(sport.name, sport.code, sport.gameCode)"
        >
          <img
            :src="require(`../assets/images/games/sport/${sport.gameName}.png`)"
          />
        </div>
      </div>
    </Transition>

    <Transition>
      <div
        class="game-grid-lists"
        id="id-live-board"
        v-if="currentSelectedMenu === 'live'"
      >
        <div
          class="game-item btn-pointer"
          v-for="(p, index) in liveCasinoGames"
          :key="`live-${index}`"
          @click="playGame(p.name, p.code, p.gameCode)"
        >
          <img :src="require(`../assets/images/games/live/${p.code}.png`)" />
        </div>
      </div>
    </Transition>

    <Transition>
      <div
        class="game-grid-lists"
        id="id-lottery-board"
        v-if="currentSelectedMenu === 'lottery'"
      >
        <div class="coming-soon-div">
          <img src="../assets/home/coming-soon-img.png" />
          <span>{{ $t('lang.coming_soon') }}</span>
        </div>
      </div>
    </Transition>
    <Transition>
      <div
        class="game-grid-lists"
        id="id-cf-board"
        v-if="currentSelectedMenu === 'cf'"
      >
        <div class="coming-soon-div">
          <img src="../assets/home/coming-soon-img.png" />
          <span>{{ $t('lang.coming_soon') }}</span>
        </div>
      </div>
    </Transition>
    <Transition>
      <div
        class="game-grid-lists"
        id="id-fish2-board"
        v-if="currentSelectedMenu === 'fish2'"
      >
        <div class="coming-soon-div">
          <img src="../assets/home/coming-soon-img.png" />
          <span>{{ $t('lang.coming_soon') }}</span>
        </div>
      </div>
    </Transition>

    <Transition>
      <div
        class="game-grid-lists"
        id="id-slot-board"
        v-if="currentSelectedMenu === 'slots' && !isShow"
      >
        <div
          v-if="store.hasToken()"
          class="game-item btn-pointer btn-slot-game"
          @click="showFavourite()"
        >
          <img :src="require('../assets/home/slot/slot-favourite-board.png')" />
        </div>

        <template v-for="p in platforms" :key="p">
          <div
            class="game-item btn-pointer btn-slot-game"
            @click="selectSlotPlat(p)"
          >
            <img :src="require('../assets/home/slot/' + p.code + '.png')" />
          </div>
        </template>

        <div class="game-item">
          <img :src="require('../assets/home/slot/' + 'StayTuned' + '.png')" />
        </div>
      </div>
    </Transition>

    <Transition>
      <div
        class="game-scroll-lists"
        id="id-slot-board"
        v-if="currentSelectedMenu === 'slots' && isShow"
      >
        <q-scroll-area
          style="height: 500px"
          :style="
            !$q.screen.gt.sm
              ? 'width: 80px; max-width: 80px'
              : 'width: 120px; max-width: 120px'
          "
        >
          <div class="bookmarks">
            <div
              v-if="store.hasToken()"
              class="plat-item"
              :class="{ active: selectedPlatId === -99 }"
              @click="showFavourite()"
            >
              <img :src="require('../assets/home/slot/favourite-icon.png')" />
            </div>

            <div
              class="plat-item"
              v-for="p in platforms"
              :class="{ active: p.id === selectedPlatId }"
              :key="p"
              @click="switchPlat(p, 'slots')"
            >
              <img :src="require('../assets/logo/' + p.code + '.png')" />
            </div>
          </div>
          <q-scroll-observer axis="vertical" />
        </q-scroll-area>

        <div class="loading-div" v-if="isLoading">
          <q-spinner-hourglass :color="ui.themeColor" size="8em" />
        </div>

        <q-scroll-area
          v-if="!isLoading && selectedPlatId === -99"
          style="height: 500px"
          :style="
            !$q.screen.gt.sm
              ? 'width: calc(100% - 80px)'
              : 'width: calc(100% - 120px)'
          "
        >
          <!-- FAVOURITE -->
          <div class="slot-grid" style="padding-bottom: 20px" v-if="sortedFavGamesList.length > 0">
            <div
              v-for="(game, index) in sortedFavGamesList"
              :key="index"
              :data-id="index"
              v-intersection="onIntersection"
              @click="openFavGame(game.name, game.code, selectedPlat.status, game)"
              style="height: auto"
              class="btn-pointer btn-slot-game inner-slot-game"
            >
<!--               <template v-if="game.gameClicked > 1"> -->
                <transition name="in-view">
                  <q-list class="q-col-gutter-none">
                    <q-img
                      loading="lazy"
                      :src="game.icon"
                      :placeholder-src="game.default"
                      fit="fill"
                      height="auto"
                      spinner-color="white"
                      position="50% 20%"
                      style="border-radius: 20px; overflow: hidden"
                      :imgClass="selectedPlat.code === 'PG' ? 'zoomin' : ''"
                    >
                      <div class="slot-name">
                        {{ game.name }}
                        <!-- --- {{ game.gameClicked }} -->
                      </div>
                      <template v-slot:loading>
                        <img
                          :src="game.default"
                          style="
                            width: 100%;
                            height: 100%;
                            border-radius: 15px;
                            overflow: hidden;
                          "
                        />
                      </template>
                    </q-img>
                  </q-list>
                </transition>
<!--               </template>-->
            </div>
          </div>

          <div class="coming-soon-div" v-else>
            <img src="../assets/home/coming-soon-img.png" />
            <span>{{ $t('lang.no_fav_game_yet') }}</span>
          </div>
        </q-scroll-area>

        <q-scroll-area
          v-if="!isLoading && selectedPlatId !== -99"
          ref="scrollSlotRef"
          style="height: 500px"
          :style="
            !$q.screen.gt.sm
              ? 'width: calc(100% - 80px)'
              : 'width: calc(100% - 120px)'
          "
        >
          <div class="search-list">
            <q-form @submit="searchList">
              <q-input
                color="white"
                bg-color="primary"
                filled
                class="search-input"
                v-model="gamePage.searchKey"
                :label="$t('lang.keyin_keyword')"
              >
                <template v-slot:prepend>
                  <q-icon
                    color="white"
                    name="search"
                    @click="gamePage.searchKey = ''"
                    class="cursor-pointer"
                  />
                </template>
                <template v-slot:append>
                  <q-icon
                    style="margin-right: 5px"
                    @click="clearSearchInput"
                    class="clear-input-icon btn-pointer"
                    name="close"
                  ></q-icon>

                  <q-icon
                    color="brightbtn"
                    name="search"
                    style=""
                    @click="searchList"
                    class="clear-input-icon btn-pointer"
                  ></q-icon>

                  <!-- <q-btn type="submit" @click="searchList" :label="$t('lang.search')" color="brightbtn"/> -->
                </template>
              </q-input>
            </q-form>
          </div>
          <div class="slot-grid" style="padding-bottom: 20px">
            <div
              v-for="(game, index) in gamePage.gameList"
              :key="index"
              :data-id="index"
              v-intersection="onIntersection"
              @click="openGame(game.name, game.code, selectedPlat.status, game)"
              style="height: auto"
              class="btn-pointer btn-slot-game inner-slot-game"
            >
              <transition name="in-view">
                <q-list class="q-col-gutter-none">
                  <q-img
                    loading="lazy"
                    :src="game.icon"
                    :placeholder-src="game.default"
                    fit="fill"
                    height="auto"
                    spinner-color="white"
                    position="50% 20%"
                    style="border-radius: 20px; overflow: hidden"
                    :imgClass="selectedPlat.code === 'PG' ? 'zoomin' : ''"
                  >
                    <div class="slot-name">{{ game.name }}</div>
                    <template v-slot:loading>
                      <img
                        :src="game.default"
                        style="
                          width: 100%;
                          height: 100%;
                          border-radius: 15px;
                          overflow: hidden;
                        "
                      />
                    </template>
                  </q-img>
                </q-list>
              </transition>
              <!-- <q-img
                  loading="lazy"
                  :src="game.icon"
                  :placeholder-src="defaultImg"
                  fit="cover"
                  height="120px"
                  no-spinner
              >
                <template v-slot:loading>
                  <img :src="game.default" style="height: 140px; max-width: 200px; border-radius: 15px; overflow:hidden;">
                </template>
              </q-img> -->
              <!-- <img :loading="'lazy'" :class="selectedPlat.code === 'PG' ? 'zoomin' : ''" :src="game.icon" v-bind:alt="game.default" > -->
            </div>
          </div>
          <BacktoTop v-if="scrollPosition.top > 400" @click="scrollToTop" />
          <q-scroll-observer @scroll="scrolling" />
        </q-scroll-area>
      </div>
    </Transition>

    <Transition>
      <div
        class="game-grid-lists"
        id="id-fish-board"
        v-if="currentSelectedMenu === 'fish' && !isShow"
      >
        <template v-for="p in fishPlatforms" :key="p">
          <div
            class="game-item btn-pointer btn-slot-game"
            @click="selectFishPlat(p)"
          >
            <img :src="require('../assets/home/fish/' + p.code + '.png')" />
          </div>
        </template>
      </div>
    </Transition>
    <Transition>
      <div
        class="game-scroll-lists"
        id="id-fish-board"
        v-if="currentSelectedMenu === 'fish' && isShow"
      >
        <q-scroll-area
          style="height: 500px"
          :style="
            !$q.screen.gt.sm
              ? 'width: 80px; max-width: 80px'
              : 'width: 120px; max-width: 120px'
          "
        >
          <div class="bookmarks">
            <div
              class="plat-item"
              v-for="p in fishPlatforms"
              :class="{ active: p.id === selectedPlatId }"
              :key="p"
              @click="switchPlat(p, 'fish')"
            >
              <img :src="require('../assets/logo/' + p.code + '.png')" />
            </div>
          </div>
          <q-scroll-observer axis="vertical" />
        </q-scroll-area>

        <div class="loading-div" v-if="isLoading">
          <q-spinner-hourglass :color="ui.themeColor" size="8em" />
        </div>
        <q-scroll-area
          v-if="!isLoading"
          ref="scrollPageRef"
          style="height: 500px"
          :style="
            !$q.screen.gt.sm
              ? 'width: calc(100% - 80px)'
              : 'width: calc(100% - 120px)'
          "
        >
          <div class="search-list">
            <q-form @submit="searchList">
              <q-input
                color="white"
                bg-color="primary"
                filled
                class="search-input"
                v-model="gamePage.searchKey"
                :label="$t('lang.keyin_keyword')"
              >
                <template v-slot:prepend>
                  <q-icon
                    color="white"
                    name="search"
                    @click="gamePage.searchKey = ''"
                    class="cursor-pointer"
                  />
                </template>
                <template v-slot:append>
                  <q-icon
                    style="margin-right: 5px"
                    @click="clearSearchInput"
                    class="clear-input-icon btn-pointer"
                    name="close"
                  ></q-icon>

                  <q-icon
                    color="brightbtn"
                    name="search"
                    style=""
                    @click="searchList"
                    class="clear-input-icon btn-pointer"
                  ></q-icon>

                  <!--                  <q-btn type="submit" @click="searchList" :label="$t('lang.search')" color="brightbtn"/>-->
                </template>
              </q-input>
            </q-form>
          </div>
          <div class="slot-grid" style="padding-bottom: 20px">
            <div
              v-for="(game, index) in gamePage.gameList"
              :key="index"
              :data-id="index"
              v-intersection="onIntersection"
              @click="openGame(game.name, game.code, selectedPlat.status)"
              style="height: auto"
              class="btn-pointer btn-slot-game inner-slot-game"
            >
              <transition name="in-view">
                <q-list class="q-col-gutter-none">
                  <q-img
                    loading="lazy"
                    :src="game.icon"
                    :placeholder-src="game.default"
                    fit="fill"
                    height="auto"
                    spinner-color="white"
                    position="50% 20%"
                    style="border-radius: 20px; overflow: hidden"
                    :imgClass="selectedPlat.code === 'PG' ? 'zoomin' : ''"
                  >
                    <div class="slot-name">{{ game.name }}</div>
                    <template v-slot:loading>
                      <img
                        :src="game.default"
                        style="
                          width: 100%;
                          height: 100%;
                          border-radius: 15px;
                          overflow: hidden;
                        "
                      />
                    </template>
                  </q-img>
                </q-list>
              </transition>
              <!-- <q-img
                  loading="lazy"
                  :src="game.icon"
                  :placeholder-src="defaultImg"
                  fit="cover"
                  height="120px"
                  no-spinner
              >
                <template v-slot:loading>
                  <img :src="game.default" style="height: 140px; max-width: 200px; border-radius: 15px; overflow:hidden;">
                </template>
              </q-img> -->
              <!-- <img :loading="'lazy'" :class="selectedPlat.code === 'PG' ? 'zoomin' : ''" :src="game.icon" v-bind:alt="game.default" > -->
            </div>
          </div>
          <BacktoTop v-if="scrollPosition.top > 400" @click="scrollToTop" />
          <q-scroll-observer @scroll="scrolling" />
        </q-scroll-area>
      </div>
    </Transition>

    <Transition>
      <div
        class="game-grid-lists"
        id="id-casual-board"
        v-if="currentSelectedMenu === 'casual' && !isShow"
      >
        <template v-for="miniplat in platformMinigame" :key="miniplat.id">
          <div
            class="game-item btn-pointer mid-grid-column"
            @click="selectCasualPlat(miniplat)"
          >
            <img src="../assets/images/games/casual/TFGaming.png" />
          </div>
        </template>
      </div>
    </Transition>

    <Transition>
      <div
        class="game-grid-lists"
        id="id-casual-board"
        v-if="currentSelectedMenu === 'casual' && isShow"
      >
        <div class="loading-div" v-if="isLoading">
          <q-spinner-hourglass :color="ui.themeColor" size="8em" />
        </div>
        <template v-if="!isLoading">
          <div
            class="game-item btn-pointer btn-slot-game"
            v-for="(game, index) in miniGames"
            :key="index"
            @click="playGame(game.name, 'TFGaming', 'casual_' + game.code)"
          >
            <img
              :src="require('../assets/home/casual/' + game.code + '.png')"
            />
          </div>

          <div
            class="game-item minigame-select-div"
            v-for="(game, index) in miniGamesMore"
            :key="index"
            @click="showTypeH5(game.id)"
            @mouseover="showTypeWeb(game.id)"
            @mouseleave="showTypeWeb(0)"
          >
            <img :src="game.logo" />

            <transition appear>
              <div class="select-type-div" v-if="showMiniType == game.id">
                <div
                  class="game-type btn-pointer"
                  id="copper-type"
                  @click="
                    playGame(game.name, 'TFGaming', 'casual_' + game.copper)
                  "
                >
                  10 - 3,000
                </div>
                <div
                  class="game-type btn-pointer"
                  id="silver-type"
                  @click="
                    playGame(game.id, 'TFGaming', 'casual_' + game.silver)
                  "
                >
                  500 - 100K
                </div>
                <div
                  class="game-type btn-pointer"
                  id="gold-type"
                  @click="playGame(game.id, 'TFGaming', 'casual_' + game.gold)"
                >
                  1,000 - 20K
                </div>
              </div>
            </transition>
          </div>
        </template>
      </div>
    </Transition>
  </div>

  <div class="home-bottom-section">
    <div class="marquee">
      <Vue3Marquee pause-on-hover pause-on-click>
        <img src="../assets/logo/AE.png" height="30" />
        <img src="../assets/logo/AMBSLOT.png" height="30" />
        <img src="../assets/logo/ATA.png" height="30" />
        <img src="../assets/logo/CQ9.png" height="30" />
        <img src="../assets/logo/JILI.png" height="30" />
        <img src="../assets/logo/JOKER.png" height="30" />
        <img src="../assets/logo/KA.png" height="30" />
        <img src="../assets/logo/LIVE22.png" height="30" />
        <img src="../assets/logo/MANNAPLAY.png" height="30" />
        <img src="../assets/logo/PG.png" height="30" />
        <img src="../assets/logo/PNG.png" height="30" />
        <img src="../assets/logo/PP.png" height="30" />
        <img src="../assets/logo/SA.png" height="30" />
        <img src="../assets/logo/SLOTXO.png" height="30" />
        <img src="../assets/logo/TF88.png" height="30" />
        <img src="../assets/logo/WM.png" height="30" />
        <img src="../assets/logo/YGG.png" height="30" />
      </Vue3Marquee>
    </div>

    <div class="bottom-footer">
      <img class="footer-logo" src="../assets/logo.png" />
      <p>{{ $t("lang.footer_tnc") }}</p>

      <span>{{ $t("lang.footer_all_rights") }}</span>
    </div>
  </div>

  <GameModal ref="gameModalRef"></GameModal>

  <q-dialog width="100%" v-model="isStationNotice">
    <q-card style="width: 100%" class="bg-primary text-white">
      <q-card-section class="q-mb-md">
        <div class="menu-title flex justify-between items-center">
          <div style="margin-right: auto">&nbsp;</div>
          <div>{{ $t("lang.announcement") }}</div>
          <q-btn
            style="margin-left: auto"
            icon="close"
            flat
            round
            dense
            v-close-popup
          />
        </div>

        <q-tabs
          v-model="activeKey"
          dense
          class="text-grey"
          active-color="brand"
          indicator-color="black"
          align="justify"
          narrow-indicator
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
</template>

<script>
import { defineComponent, onMounted, ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";
import { cached } from "boot/cache";
import { useQuasar, Platform } from "quasar";
import { userStore } from "stores/index";
import GameModal from "components/modal/GameModal";
import * as _ from "lodash";
import MarqueeText from "vue-marquee-text-component";
import BacktoTop from "components/backtotop.vue";
import { Vue3Marquee } from "vue3-marquee";
import moment from "moment"

import { useUI } from "stores/ui";
import { isMobile } from "boot/utils";
import { App } from "@capacitor/app";

export default defineComponent({
  name: "IndexPage",
  components: {
    GameModal,
    MarqueeText,
    BacktoTop,
    Vue3Marquee,
    // RiVolumeUpLine,
    // RiBilliardsLine,
    // RiBasketballLine,
    // RiUserShared2Line
  },
  setup() {
    const $q = useQuasar();
    const ui = useUI();
    const siteId = process.env.SITEID;
    ui.$onAction(({ name, args }) => {
      switch (name) {
        case "setScrollPosition":
          scrollPageRef.value.setScrollPosition(args[0], args[1], args[2]);
      }
    });
    const banners = ref([]);
    const route = useRoute();
    const router = useRouter();
    const store = userStore();
    const mainWallet = computed(() => {
      return store.balance;
    });
    const gameModalRef = ref(null);
    const openGame = (gameName, gameCode, gameStatus, gameInfo) => {
      gameModalRef.value.open(
        gameName,
        selectedPlat.code,
        gameCode,
        gameStatus
      );

      // gameInfo && console.log(gameInfo);
      const favGames = JSON.parse(localStorage.getItem("FAV_GAMES")) || {};
      const clickCount = favGames[gameInfo.id]
        ? favGames[gameInfo.id].gameClicked + 1
        : 1;
      const lastPlayedAt= moment().unix();
      const revisedGameInfo = { ...gameInfo, gameClicked: clickCount, gamePlatformCode: selectedPlat.code, lastPlayed:lastPlayedAt  };
      gameInfo.gameClicked = clickCount;

      favGames[gameInfo.id] = revisedGameInfo;
      localStorage.setItem("FAV_GAMES", JSON.stringify(favGames));
      favGamesList.value = favGames;
    };

    const openFavGame = (gameName, gameCode, gameStatus, gameInfo) => {
      gameModalRef.value.open(
        gameName,
        gameInfo.gamePlatformCode,
        gameCode,
        gameStatus
      );

      // gameInfo && console.log(gameInfo);
      const favGames = JSON.parse(localStorage.getItem("FAV_GAMES")) || {};
      const clickCount = favGames[gameInfo.id]
        ? favGames[gameInfo.id].gameClicked + 1
        : 1;
      const lastPlayedAt= moment().unix();
      const revisedGameInfo = { ...gameInfo, gameClicked: clickCount,  lastPlayed:lastPlayedAt };
      gameInfo.gameClicked = clickCount;

      favGames[gameInfo.id] = revisedGameInfo;
      localStorage.setItem("FAV_GAMES", JSON.stringify(favGames));
      favGamesList.value = favGames;
    };

    const favGamesList = ref([]);
    const sortedFavGamesList = computed(() => {
      const gamesArray = Object.values(favGamesList.value);
      return gamesArray.filter((item) => item.gameClicked > 1).sort((a, b) => b.lastPlayed - a.lastPlayed);
    });

    const updateSortedFavGamesList = () => {
      favGamesList.value = Object.fromEntries(
        Object.entries(favGamesList.value).sort(([, a], [, b]) => b.lastPlayed - a.lastPlayed)
      );
    };

    const getFavGameList = () => {
      const favGames = JSON.parse(localStorage.getItem("FAV_GAMES")) || {};
      favGamesList.value = favGames;
      updateSortedFavGamesList();
    };

    const playGame = (gameName, platformCode, gameCode, gameStatus) => {
      gameModalRef.value.open(gameName, platformCode, gameCode, gameStatus);
    };
    const pokerGames = [
      // {
      //   code: "JILI",
      //   name: "Jili Games",
      //   gameName: "Jili",
      //   gameCode: "64",
      //   bg: require("../assets/images/games/poker/poker_1.jpg"),
      //   main: require("../assets/images/games/poker/poker1_1.png"),
      //   logo: require("../assets/images/common/logo/jl.png")
      // },
      // {
      //   code: "RICH88",
      //   name: "Rich88",
      //   gameName: "Rich88",
      //   bg: require("../assets/images/games/poker/poker_2.jpg"),
      //   main: require("../assets/images/games/poker/poker2_01.png"),
      //   logo: require("../assets/images/common/logo/RICH88.png")
      // },
      // {
      //   code: "KM",
      //   name: "KM",
      //   gameName: "KM",
      //   bg: require("../assets/images/games/poker/poker_3.jpg"),
      //   main: require("../assets/images/games/poker/poker3_01.png"),
      //   logo: require("../assets/images/common/logo/km.png")
      // }
    ];
    const liveCasinoGames = [
      {
        code: "Evo",
        name: "Evolution",
        gameName: "EVO",
        logo: require("../assets/images/common/logo/evo.png"),
        text: "In the Evolution live casino, there are the world's first 6-card start, VIP tables, badge baccarat, intelligent control baccarat waiting for you to enjoy non-stop.",
      },
      {
        code: "AWC",
        name: "AE Sexy",
        status: "NORMAL",
        gameName: "AE Sexy",
        gameCode: "MX-LIVE-001",
        logo: require("../assets/images/common/logo/ae_2.png"),
        text: "วิดีโอไลฟ์แอ็กชันที่มีศักยภาพสูงสุดในเอเชียผลิตภัณฑ์เกมคุณภาพสูง และวิดีโอเกมที่หลากหลาย การเชื่อมต่อข้ามแพลตฟอร์มที่ง่ายดาย ทำให้คุณสนุกได้ทุกที่ทุกเวลา!",
      },
      {
        code: "WM",
        name: "WM Casino",
        gameName: "WM",
        status: "NORMAL",
        logo: require("../assets/images/common/logo/WM.png"),
        text: "AE Casino วิดีโอไลฟ์แอ็กชันที่มีศักยภาพมากที่สุดในเอเชีย เชื่อมต่อและใช้งานง่าย ข้ามแพลตฟอร์ม ฟรีดาวน์โหลด และสนุกได้ทุกที่ทุกเวลา!",
      },
      {
        code: "SA",
        name: "SA gaming",
        gameName: "SA",
        status: "NORMAL",
        logo: require("../assets/images/common/logo/SA.png"),
        text: "แพลตฟอร์มความบันเทิง EZUGI ที่มีดีลเลอร์มืออาชีพที่ผ่านการฝึกอบรมมาอย่างดีหลายร้อยคน มอบประสบการณ์คาสิโนที่แท้จริงให้กับคุณ",
      },
    ];
    const esportsGame = [
      {
        code: "TFGaming",
        name: "TF Gaming",
        gameName: "AE Sexy",
        gameCode: "MX-LIVE-001",
        logo: require("../assets/logo/TF88.png"),
      },
    ];
    const sportsGame = [
      {
        code: "SABA",
        name: "SABA Sport",
        gameName: "SABA",
        gameCode: "SABA",
      },
    ];
    const platformMinigame = ref([]);
    const miniGames = ref([]);
    const miniGamesMore = ref([
      {
        name: "KOG Draw",
        logo: require("../assets/home/casual/2.png"),
        copper: "",
        silver: "",
        gold: "",
      },
      {
        name: "DOTA 2 Treasure",
        logo: require("../assets/home/casual/5.png"),
        copper: "",
        silver: "",
        gold: "",
      },
      {
        name: "LOL Draft",
        logo: require("../assets/home/casual/8.png"),
        copper: "",
        silver: "",
        gold: "",
      },
    ]);

    function loadData() {
      api
        .get("/promo/banner?category=HOME")
        .then((res) => {
          if (res.data.code === 0) {
            //
            if (res.data.data.length > 0) {
              banners.value = res.data.data;
            } else {

            }
          } else {
          }
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
    const selectedPlat = reactive({
      code: "",
      status: "",
    });
    const gamePage = reactive({
      gameList: [],
      currentPage: 1,
      pageSize: 40,
      searchType: "",
      searchKey: "",
      total: 0,
    });
    const favGamePage = reactive({
      gameList: [],
      currentPage: 1,
      pageSize: 40,
      searchType: "",
      searchKey: "",
      total: 0,
    });
    const gameListData = ref([]);
    const fishPlatforms = ref([]);

    const currentSelectedMenu = ref("slots");
    const switchMenu = (menu) => {
      currentSelectedMenu.value = menu;
      isShow.value = false;
      if (menu === "slots") {
        switchPlat(platforms.value[0], menu);
      } else if (menu === "livecasino") {
        // switchPlat(liveCasinoGames[0], menu);
      } else if (menu === "fish") {
        switchPlat(fishPlatforms.value[0], menu);
      } else if (menu === "poker") {
        switchPlat(pokerGames[0], menu);
      } else if (menu === "sport") {
        switchPlat(sportsGame[0], menu);
      } else if (menu === "casual") {
        switchPlat(platformMinigame.value[0], menu);
      }
    };
    const liveTabs = ref("");
    const switchPlat = (plat, menuType) => {
      isLoading.value = true;
      if (menuType === "slots") {
        selectedPlat.code = plat.code;
        selectedPlat.status = plat.status;
        selectedPlatId.value = plat.id;
        loadGameList("SLOT");
        if (scrollPageRef.value) {
          scrollSlotRef.value.setScrollPosition("vertical", 0);
        }
        gamePage.searchKey = "";
      } else if (menuType === "livecasino") {
        selectedLiveTab.value = plat.name;
        liveTabs.value = plat.name;
      } else if (menuType === "fish") {
        selectedPlat.code = plat.code;
        selectedPlat.status = plat.status;
        selectedPlatId.value = plat.id;
        loadGameList("FISH");
        if (scrollPageRef.value) {
          scrollPageRef.value.setScrollPosition("vertical", 0);
        }
      } else if (menuType === "poker") {
        selectedLiveTab.value = plat.name;
        liveTabs.value = plat.name;
      } else if (menuType === "casual") {
        selectedLiveTab.value = plat.name;
        liveTabs.value = plat.name;

        selectedPlat.code = plat.code;
        selectedPlat.status = plat.status;

        loadGameList("CASUAL");
      } else if (menuType === "sport") {
        selectedLiveTab.value = plat.name;
        liveTabs.value = plat.name;
      }
    };
    const clearSearchInput = () => {
      gamePage.searchKey = "";
      changePage(1, gamePage.pageSize);
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
    const scrollSlotRef = ref();
    const scrollPageRef = ref();
    const isLoading = ref(false);
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
                device: regDevice,
              },
            })
            .then((ret) => {
              const res = ret.data;
              if (res.code === 0) {
                isLoading.value = false;
                return res;
              }
            })
            .catch((err) => {
              isLoading.value = false;
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: "Loading failed",
              //   icon: "report_problem"
              // });
            })
        )
        .then((res) => {
          isLoading.value = false;

          // debugger;
          if (currentSelectedMenu.value === "casual") {
            miniGames.value = [];
            let minis = _.orderBy(res, "sequence");
            minis.forEach((mini) => {
              mini.lists = [];
            });
            let games = [];
            minis.forEach((mini) => {
              if (
                mini.name.indexOf("(铜)") > -1 ||
                mini.name.indexOf("(银)") > -1 ||
                mini.name.indexOf("(金)") > -1
              ) {
                games.push(mini);
              } else {
                miniGames.value.push(mini);
              }
            });

            // console.log(games);

            games.forEach((game) => {
              let index = _.findIndex(miniGamesMore.value, function (o) {
                return game.name.indexOf(o.name) > -1;
              });
              if (game.name.indexOf("(铜)") > -1) {
                miniGamesMore.value[index]["copper"] = game.code;
              } else if (game.name.indexOf("(银)") > -1) {
                miniGamesMore.value[index]["silver"] = game.code;
              } else if (game.name.indexOf("(金)") > -1) {
                miniGamesMore.value[index]["gold"] = game.code;
              }
            });
            // console.log(miniGamesMore.value);
          } else {
            res.forEach((element) => {
              element.default = require("../assets/images/games/aviator/default.png");
              element.icon = `${
                process.env.IMAGE_CDN
              }/game/${siteId}/${selectedPlat.code.toLowerCase()}/${
                element.icon
              }.png`;
            });
            gameListData.value = res;
            gamePage.total = res.length;
            changePage(1, gamePage.pageSize);
          }
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
          platformMinigame.value = data.filter((element) =>
            element.gameType.includes("ESPORT")
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

          // console.log("After");
          // console.log(platformMinigame.value);
          // alert(platformMinigame.value.length);
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
          // switchPlat(platforms.value[0], 'slots');
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
    const getLength = (tab, ann) => {
      var categoryLength = announcementList.value.filter(
        (item) => item.id == ann.typeId
      );
      return categoryLength.length;
    };
    const announcementList = ref([]);
    const announcementTypes = ref([]);
    const loadAnnouncement = () => {
      api.get("/announcement").then((ret) => {
        const res = ret.data;
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

    const isShowBtt = ref(false);
    const scrollPosition = ref(0);
    const scrolling = (e) => {
      scrollPosition.value = e.position;
      if (e.position.top > 400) {
        isShowBtt.value = true;
      }
    };
    const gotoPromo = (banner) => {
      if(banner.promoPageId){
        router.push({path: '/promo', query: {id: banner.promoPageId}})
      }else if(banner.redirectUrl){
        const redirectPage= '/' + banner.redirectUrl;
        router.push(`${redirectPage}`)
      }
      router.push(`/promo`)
    };

    // isH5 -- platform checker
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
      }
    };

    const openDownloadPage = () => {
      window.open(download_url.value, "_system");
      isAppUpdateModal.value = false;
    };
    const cancelUpdate = () => {
      isAppUpdateModal.value = false;
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

    const onIntersection = (entry) => {
      // if (entry.isIntersecting === true) {
      //   add(entry.target.dataset.id)
      // }
      // else {
      //   remove(entry.target.dataset.id)
      // }
    };
    const position = ref(0);
    const scrollToTop = (el) => {
      scrollSlotRef.value?.setScrollPosition("vertical", position);
      scrollPageRef.value?.setScrollPosition("vertical", position);
      isShowBtt.value = false;
      // const target = getScrollTarget(el[0])
      // const duration = 1000
      // console.log(target)
    };

    onMounted(() => {
      getPlatList();
      loadData();
      loadAnnouncement();
      checkPlatform();
      getVersionNo();
      getAppDownloadUrl();
      getFavGameList();
    });
    const imageLoading = ref(false);
    const selectedLiveTab = ref();

    const isShow = ref(false);
    const selectSlotPlat = (plat) => {
      selectedPlatId.value = plat.id;
      isShow.value = true;
      switchPlat(plat, "slots");
    };
    const selectFishPlat = (plat) => {
      selectedPlatId.value = plat.id;
      isShow.value = true;
      switchPlat(plat, "fish");
    };
    const selectCasualPlat = (plat) => {
      selectedPlatId.value = plat.id;
      isShow.value = true;
      switchPlat(plat, "casual");
    };
    const isGoMiniGame = ref(false);
    const showTypeH5 = (id) => {
      if (isMobile()) {
        showMiniType.value = id;
        setTimeout(() => {
          isGoMiniGame.value = true;
        }, 500);
      }
    };

    const showFavourite = () => {
      isShow.value = true;
      selectedPlatId.value = -99;
    };

    const showMiniType = ref(0);
    const showTypeWeb = (id) => {
      showMiniType.value = id;
      if (id === 0) {
        isGoMiniGame.value = false;
      }
    };

    return {
      imageLoading,
      slide: ref(0),
      imgURL: process.env.IMAGE_CDN + "/promo/",
      banners,
      store,
      ui,
      platforms,
      fishPlatforms,
      liveCasinoGames,
      isShow,
      mainWallet,
      playGame,
      gameModalRef,
      pokerGames,
      switchPlat,
      scrolling,
      scrollToTop,
      switchMenu,
      gamePage,
      onIntersection,
      isLoading,
      selectedPlat,
      scrollPosition,
      isShowBtt,
      scrollSlotRef,
      selectedPlatId,
      searchList,
      clearSearchInput,
      liveTabs,
      selectedLiveTab,
      currentSelectedMenu,
      esportsGame,
      showFavourite,
      selectFishPlat,
      selectSlotPlat,
      selectCasualPlat,
      platformMinigame,
      isGoMiniGame,
      miniGames,
      miniGamesMore,
      sportsGame,
      showTypeH5,
      showTypeWeb,
      showMiniType,
      openGame,
      openFavGame,
      scrollPageRef,
      announcementList,
      isStationNotice,
      openPopup,
      noticeTitle,
      announcementTypes,
      activeKey,
      getLength,
      gotoPromo,
      router,
      isAppUpdateModal,
      isH5,
      openDownloadPage,
      cancelUpdate,
      getAppDownloadUrl,
      favGamesList,
      sortedFavGamesList,
      updateSortedFavGamesList,
      getFavGameList,
    };
  },
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
    border-radius: 8px;
    border: 1px solid $border-color;
    gap: 10px;
    padding: 2px 10px;
    justify-content: center;
    align-items: center;
    width: 85%;
    flex: 1;

    .volume {
      padding-top: 3px;

      img {
        width: 21px;
        height: auto;
      }
    }

    span {
      margin-right: 10px;
      cursor: pointer;
    }
  }

  .share {
    background-image: $linear-bg-red;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    cursor: pointer;
    flex: 1;
  }
}

.slot-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 0px auto 10px;
  align-items: flex-start;
  column-gap: 10px;
  row-gap: 10px;
  width: calc(100% - 20px);

  .q-list {
    .q-img {
      aspect-ratio: 1/1;

      .q-img__image {
        width: 100%;
        height: 100%;
        object-fit: fill !important;
      }
    }
  }

  .slot-name {
    background: linear-gradient(0deg, #1f2035cf 20%, transparent);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    text-align: center;
  }
}

#id-fish-board {
  .q-list {
    aspect-ratio: 155/97;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  margin: 20px auto 10px;
  align-items: flex-start;
  column-gap: 16px;
  row-gap: 14px;
  width: calc(95% - 20px);

  .game-board-item {
    border-radius: 8px;
    width: 100%;
    flex-direction: column;
    height: 100%;
    margin: auto;
    background: $linear-bg-3;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    text-align: center;
    padding: 4px 12px;

    &.active-board {
      background: $linear-bg-4;
    }

    &:active {
      filter: brightness(0.86);
    }

    span {
      font-size: 0.8em;
    }

    img {
      width: 100%;
      max-width: 40px;
    }
  }
}

.game-grid-lists {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: calc(95% - 20px);
  margin: 12px auto 20px;
  padding-bottom: 30px;
  padding-top: 15px;
  column-gap: 15px;
  row-gap: 10px;
  transition: 1s ease-in;

  .game-item {
    border-radius: 8px;

    img {
      width: 100%;
    }
  }
}

.home-bottom-section {
  margin-top: 16px;

  .marquee {
    background: $third-color;
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    max-width: 100%;
    height: 50px;
    padding: 4px 10px;
    overflow-x: hidden;
  }

  .content {
    width: calc(100vw - 20px);
    margin: auto;

    img {
      margin-left: 15px;
      margin-right: 15px;
    }
  }

  .track {
    position: absolute;
    white-space: nowrap;
    will-change: transform;
    animation: marquee 30s linear infinite;
  }

  @keyframes marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-1500px);
    }
  }

  .bottom-footer {
    background: url("../assets/images/index/footer-desc-bg.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 60px 0px;
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 12px;
    padding: 6px 12px 60px;

    .footer-logo {
      text-align: center;
      width: 200px;
      margin: 0 auto;
    }
  }
}

.img-coming-soon {
  //max-width: 300px;
  grid-column: 1 / 4;
}

.v-enter-active {
  transition: opacity 0.5s ease;
}

.v-leave-active {
  transition: none;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.game-scroll-lists {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: calc(100% - 20px);
  margin: 20px auto 10px;
  position: relative;

  .bookmarks {
    width: 70px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    grid-gap: 0px;
    margin: 0px auto 10px 0px;
    padding: 0px 10px 10px;
    justify-content: flex-start;

    .plat-item {
      display: flex;
      width: 100%;
      height: 50px;
      box-sizing: content-box;
      padding: 10px 10px;
      justify-content: center;
      align-items: center;
      background: $third-color;

      img {
        max-width: 50px;
        filter: grayscale(1);
      }

      &:active {
        filter: brightness(0.86);
      }

      &:first-of-type {
        border-radius: 10px 10px 0px 0px;
      }

      &:last-of-type {
        border-radius: 0px 0px 10px 10px;
      }

      span {
        color: rgba(200, 200, 200, 0.5);
        font-size: 20px;
        font-weight: bold;
      }

      &.active {
        background: $linear-bg-2;
        box-shadow: inset 0 0 5px #ffffff;

        img {
          filter: grayscale(0);
        }

        span {
          color: #ffffff;
        }
      }
    }
  }
}

.loading-div {
  z-index: 99;
  position: absolute;
  top: 0;
  text-align: center;
  right: 0px;
  width: calc(100% - 130px);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: $header-color;
    width: 48px;
  }
}

.mid-grid-column {
  grid-column: 2/3;
}

.coming-soon-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  grid-column: 2/3;

  img {
    width: 200px;
    height: auto;
  }
}

.minigame-select-div {
  position: relative;

  &:hover {
  }

  .select-type-div {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 99;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 12px;

    .game-type {
      width: 100%;
      height: 33.3%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      font-weight: bold;
      color: #000;
      text-shadow: 1px 1px 1px $text-gray;

      &#copper-type {
        background: #b87333;
        opacity: 0.85;
        border-radius: 12px 12px 0px 0px;

        &:hover {
          opacity: 1;
        }

        &:active {
          filter: brightness(1.2);
        }
      }

      &#silver-type {
        background: #c0c0c0;
        opacity: 0.85;

        &:hover {
          opacity: 1;
        }

        &:active {
          filter: brightness(1.2);
        }
      }

      &#gold-type {
        background: #ffd700;
        opacity: 0.85;
        border-radius: 0px 0px 12px 12px;

        &:hover {
          opacity: 1;
        }

        &:active {
          filter: brightness(1.2);
        }
      }
    }
  }
}

.search-list {
  display: flex;
  margin-bottom: 16px;
  margin-right: 10px;
  margin-left: 10px;

  justify-content: flex-end;

  .search-input {
    max-width: 450px;
    margin-left: auto;

    &.q-field--filled .q-field__control {
      border-radius: 12px;
    }
  }

  .clear-input-icon {
    cursor: pointer;
    opacity: 0.8;
  }
}

.fav-slot-game {
  img {
    width: 100%;
    display: block;
  }
}

@media (min-width: 600px) {
}

@media (min-width: 769px) {
  .grid {
    column-gap: 16px;
    row-gap: 14px;

    .game-board-item {
      img {
        width: 100%;
        max-width: 55px;
      }
    }
  }

  .game-grid-lists {
    padding-top: 15px;
    column-gap: 25px;
  }

  .game-scroll-lists {
    .bookmarks {
      width: 100px;

      .plat-item {
        img {
          max-width: 70px;
        }
      }
    }
  }

  .slot-grid {
    grid-template-columns: repeat(4, 1fr);
    column-gap: 14px;
    row-gap: 14px;
  }
}

@media (min-width: 991px) {
  .grid .game-board-item {
    cursor: pointer;
    border-radius: 10px;
    max-width: 110px;
    max-height: 125px;
    aspect-ratio: 110/125;

    span {
      font-size: 1em;
    }
  }

  .main-section {
    background-repeat: repeat-x;
  }

  .game-grid-lists {
    grid-template-columns: repeat(6, 1fr);
  }

  .slot-grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .grid {
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(1, 1fr);
  }

  .game-grid-lists {
    grid-template-columns: repeat(8, 1fr);
  }

  #id-live-board {
    grid-template-columns: repeat(4, 1fr);
  }

  .mid-grid-column {
    grid-column: 4/6;
  }

  .coming-soon-div {
    grid-column: 4/6;
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
