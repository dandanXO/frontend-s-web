<template>
  <div class="home-wrapper">
    <q-page-sticky position="bottom-right" :offset="[18, 18]" class="floating-btn">
      <q-btn fab class="bg-yellow" @click="router.push('/liveChat')">
        <img src="../assets/images/index/icon-customer-service.png" alt="" />
      </q-btn>
    </q-page-sticky>

    <ProfileSummary :homeProfile="true" />

    <div class="home-divider"></div>

    <div class="midd">
      <div class="station-notice-wrapper">
        <div class="volume">
          <RiVolumeUpFill style="fill: #ffffff" />
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

    <div class="top-action">
      <div class="action-btn action-btn--withdrawal" @click="withdrawalDialog = true">Withdrawal</div>
      <div class="action-btn action-btn--deposit" @click="depositDialog = true">Deposit</div>
    </div>

    <div class="games-selection-wrapper">
      <div class="hot-games-pattern-top"></div>
      <div class="hot-games-container">
        <img src="../assets/images/index/hot-elephant-left.png" alt="" />
        <div class="title-hot-games">
          <span class="txt-style">HOT GAMES</span>
        </div>
        <img src="../assets/images/index/hot-elephant-right.png" alt="" />
      </div>
      <div class="game-platform-wrapper">
        <div class="game-platform-item">
          <!-- <div
            class="game-platform-img"
            :style="{ backgroundImage: `url(${require(`../assets/images/index/hot-games-bg.png`)})` }"
          ></div> -->
          <div class="game-platform-img">
            <div
              class="game--bg"
              :style="{ backgroundImage: `url(${require(`../assets/images/index/hot-games-bg.png`)})` }"
            ></div>
          </div>
          <div class="game-platform-title">Foutune Tiger</div>
        </div>
        <div class="game-platform-item">
          <div class="game-platform-img"></div>
          <div class="game-platform-title">Foutune Mouse</div>
        </div>
        <div class="game-platform-item">
          <div class="game-platform-img"></div>
          <div class="game-platform-title">Foutune Ox</div>
        </div>
        <div class="game-platform-item">
          <div class="game-platform-img"></div>
          <div class="game-platform-title">Rocket Crash</div>
        </div>

        <div class="game-platform-item">
          <div class="game-platform-img"></div>
          <div class="game-platform-title">Rocket Game</div>
        </div>
        <div class="game-platform-item">
          <div class="game-platform-img"></div>
          <div class="game-platform-title">Game Bonanza</div>
        </div>
        <div class="game-platform-item">
          <div class="game-platform-img"></div>
          <div class="game-platform-title">Crazy777</div>
        </div>
        <div class="game-platform-item">
          <div class="game-platform-img"></div>
          <div class="game-platform-title">Foutune Rabbit</div>
        </div>
      </div>
      <div class="hot-games-pattern-bottom"></div>
      <div class="btn-load-more">Load More</div>
    </div>

    <div class="games-selection-wrapper">
      <div class="title-game">
        <img class="title-game-icon" src="../assets/images/index/title-icon-slotgames.png" alt="" />
        <span class="txt-style">Slot Games</span>
      </div>

      <div class="game-platform-container">
        <template v-for="(item, index) in slot" :key="index">
          <div class="game-platform-item" @click="openGame(item.name, item.code, '', item.status, 'SLOT', item.id)">
            <img :src="require(`../assets/images/index/slot/item-game-${item.code.toLowerCase()}.png`)" />
          </div>
        </template>
        <!-- coming soon placeholder // start -->
        <div class="game-platform-item">
          <img src="../assets/images/index/slot/item-game-comingsoon.png" alt="" />
        </div>
        <!-- coming soon placeholder // end -->
      </div>
    </div>

    <div class="games-selection-wrapper">
      <div class="title-game">
        <img class="title-game-icon" src="../assets/images/index/title-icon-livecasino.png" alt="" />
        <span class="txt-style">Live Casino</span>
      </div>
      <div class="game-platform-container">
        <template v-for="(item, index) in livecasino" :key="index">
          <div
            class="game-platform-item"
            @click="playGame(item.name, item.code, '', item.status, item.gameType, item.id)"
          >
            <img :src="require(`../assets/images/index/live/item-game-${item.code.toLowerCase()}.png`)" />
          </div>
        </template>
        <!-- coming soon placeholder // start -->
        <div class="game-platform-item">
          <img src="../assets/images/index/live/item-game-comingsoon.png" alt="" />
        </div>
        <!-- coming soon placeholder // end -->
      </div>
    </div>

    <!-- <div class="games-selection-wrapper">
      <div class="title-game">
        <img class="title-game-icon" src="../assets/images/index/title-icon-gamepoker.png" alt="" />
        <span class="txt-style">Game &amp; Poker</span>
      </div>
      <div class="game-platform-container">
        <div class="game-platform-item">
          <img src="../assets/images/index/poker/item-game-gpipoker.png" alt="" />
          <div class="game-platform-title">GPI-POKER</div>
        </div>
        <div class="game-platform-item">
          <img src="../assets/images/index/poker/item-game-comingsoon.png" alt="" />
          <div class="game-platform-title">COMING SOON</div>
        </div>
        <div class="game-platform-item">
          <img src="../assets/images/index/poker/item-game-comingsoon.png" alt="" />
          <div class="game-platform-title">COMING SOON</div>
        </div>
        <div class="game-platform-item">
          <img src="../assets/images/index/poker/item-game-comingsoon.png" alt="" />
          <div class="game-platform-title">COMING SOON</div>
        </div>
        <div class="game-platform-item">
          <img src="../assets/images/index/poker/item-game-comingsoon.png" alt="" />
          <div class="game-platform-title">COMING SOON</div>
        </div>
        <div class="game-platform-item">
          <img src="../assets/images/index/poker/item-game-comingsoon.png" alt="" />
          <div class="game-platform-title">COMING SOON</div>
        </div>
      </div>
    </div> -->

    <div class="games-selection-wrapper">
      <div class="title-game">
        <img class="title-game-icon" src="../assets/images/index/title-icon-fishing.png" alt="" />
        <span class="txt-style">Fishing</span>
      </div>

      <div class="game-platform-container">
        <template v-for="(item, index) in fishing" :key="index">
          <!-- <div
            class="game-platform-item"
            @click="playGame(item.name, item.code)"
            v-if="item.code === 'JILI' || item.code === 'JDB'"
          > -->
          <!-- @click="playGame(item.name, item.code, item.code, item.status, item.gameType, item.id)" -->
          <div class="game-platform-item" @click="openGame(item.name, item.code, '', item.status, 'FISH', item.id)">
            <img :src="require(`../assets/images/index/fish/item-game-${item.code.toLowerCase()}.png`)" />
          </div>
        </template>
        <!-- coming soon placeholder // start -->
        <!-- <div class="game-platform-item">
          <img src="../assets/images/index/live/item-game-comingsoon.png" alt="" />
        </div> -->
        <!-- coming soon placeholder // end -->
      </div>
    </div>

    <div class="games-selection-wrapper">
      <div class="title-game">
        <img class="title-game-icon" src="../assets/images/index/title-icon-sports.png" alt="" />
        <span class="txt-style">Sports</span>
      </div>
      <div class="game-platform-container sport-platform">
        <template v-for="(item, index) in sport" :key="index">
          <div
            class="game-platform-item"
            @click="playGame(item.name, item.code, '', item.status, item.gameType, item.id)"
          >
            <img :src="require(`../assets/images/index/sport/item-game-${item.code.toLowerCase()}.png`)" />
          </div>
        </template>
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
  >
    <q-card style="width: 100%" class="bg-bright text-black">
      <div class="modalcontent">
        <div class="headers">
          <div class="titles backgroundColor">Update Announcement</div>
        </div>
        <div class="contents">New Version Detected, Do You Want To Update?</div>
        <div class="btnsreas">
          <div class="cacnels borderColor fontColor" @click="cancelUpdate">Cancel</div>
          <div class="confirmsbtns btncolor" @click="openDownloadPage">Update Now</div>
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

  <q-dialog v-model="fullGameDialog" persistent maximized transition-show="slide-up" transition-hide="slide-down">
    <q-card class="fullgame-card">
      <q-card-section>
        <div class="home-wrapper fullgame-wrapper">
          <div class="fullgame-header">
            <q-btn dense rounded icon="reply" class="bg-yellow text-black q-mt-lg" v-close-popup />

            <div class="fullgame-search">
              <q-input dense standout v-model="searchText" label="Search" clearable clear-icon="close">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>

          <div class="games-selection-wrapper">
            <div class="game-platform-wrapper">
              <template v-for="(item, index) in filteredSubGameList" :key="index">
                <div
                  class="game-platform-item"
                  @click="playGame(item.name, subGameCode, item.code, item.status, item.gameType, item.id)"
                >
                  <!-- <div
                    class="game-platform-img"
                    :style="{
                      backgroundImage: `url(${imgURLGame}${subGameCode.toLowerCase()}/${item.icon}.png)`
                    }"
                  ></div> -->
                  <div class="game-platform-img">
                    <div
                      class="game--bg"
                      :style="{
                        backgroundImage: `url(${imgURLGame}${subGameCode.toLowerCase()}/${item.icon}.png)`
                      }"
                    ></div>
                  </div>
                  <div class="game-platform-title">{{ item.name }}</div>
                </div>
              </template>
            </div>
            <!-- <div class="btn-load-more">Load More</div> -->
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog width="100%" v-model="withdrawalDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="bg-yellow text-black popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="popout-main-title">
          <div class="txt-title">Withdrawal</div>
        </div>

        <q-tabs
          v-model="withdrawalDialogTab"
          dense
          no-caps
          class="withdrawal-tab"
          indicator-color="transparent"
          align="justify"
        >
          <q-tab name="backcard" label="Backcard" />
          <q-tab name="upi" label="UPI" />
        </q-tabs>

        <q-tab-panels
          class="withdrawal-tab-panel"
          v-model="withdrawalDialogTab"
          animated
          transition-prev="fade"
          transition-next="fade"
        >
          <q-tab-panel name="backcard">
            <div class="withdrawal-table">
              <div class="w-tbl-row">
                <div class="w-tbl-col">Cash Balance:</div>
                <div class="w-tbl-col"><span class="w-txt-red">1731.5</span></div>
              </div>
              <div class="w-tbl-row">
                <div class="w-tbl-col">Withdrawable:</div>
                <div class="w-tbl-col">0</div>
              </div>
              <div class="w-tbl-row">
                <div class="w-tbl-col">Remaining Wager:</div>
                <div class="w-tbl-col">30822.5</div>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="upi">
            <div class="withdrawal-table">
              <div class="w-tbl-row">
                <div class="w-tbl-col">Cash Balance:</div>
                <div class="w-tbl-col"><span class="w-txt-red">1731.5</span></div>
              </div>
              <div class="w-tbl-row">
                <div class="w-tbl-col">Withdrawable:</div>
                <div class="w-tbl-col">0</div>
              </div>
              <div class="w-tbl-row">
                <div class="w-tbl-col">Remaining Wager:</div>
                <div class="w-tbl-col">30822.5</div>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>

        <div class="withdrawal-form" v-if="withdrawalDialogTab === 'backcard'">
          <div class="w-form-item w-form-item--bankcard">
            <div class="w-form-label">Withdraw Amount</div>
            <div class="w-form-input">
              <q-input filled dense clearable placeholder="Enter Withdraw Amount"></q-input>
            </div>
          </div>
          <div class="w-form-item w-form-item--bankcard">
            <div class="w-form-label">Account Holder Name</div>
            <div class="w-form-input">
              <q-input filled dense clearable placeholder="Enter Account Holder Name"></q-input>
            </div>
          </div>
          <div class="w-form-item w-form-item--bankcard">
            <div class="w-form-label">Account Number</div>
            <div class="w-form-input">
              <q-input filled dense clearable placeholder="Enter Account Number"></q-input>
            </div>
          </div>
          <div class="w-form-item w-form-item--bankcard">
            <div class="w-form-label">Bank IFSC Code</div>
            <div class="w-form-input">
              <q-input filled dense clearable placeholder="Enter Bank IFSC Code"></q-input>
            </div>
          </div>
        </div>

        <div class="withdrawal-form" v-if="withdrawalDialogTab === 'upi'">
          <div class="w-form-item w-form-item--upi">
            <div class="w-form-label">Withdraw Amount</div>
            <div class="w-form-input">
              <q-input filled dense clearable placeholder="Enter Withdraw Amount"></q-input>
            </div>
          </div>
          <div class="w-form-item w-form-item--upi">
            <div class="w-form-label">VPA</div>
            <div class="w-form-input">
              <q-input filled dense clearable placeholder="Enter VPA"></q-input>
            </div>
          </div>
        </div>

        <div class="btn-go">Go</div>

        <div class="bottom-tnc">3%+6Rs of the withdrawal amount would be deducted as bank commission</div>
      </div>
    </div>
  </q-dialog>

  <q-dialog width="100%" v-model="depositDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="bg-yellow text-black popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="popout-main-title">
          <div class="txt-title">Deposit</div>
        </div>
        <div class="deposit-item-container">
          <template v-for="(item, index) in depositItems" :key="index">
            <div @click="handleDepositItemClick(index)" :class="['deposit-item', item.isActive && 'active']">
              <div class="deposit-icon">
                <img
                  :src="require(`../assets/images/index/popout/deposit-coin-${item.amount}.png`)"
                  :alt="item.amount + ' Coin'"
                />
                <div class="deposit-hot-label" v-if="isUpi2Active">+₹{{ item.hotLabel }}</div>
              </div>
              <div class="deposit-amt">{{ item.amount }}</div>
            </div>
          </template>
        </div>
        <div class="deposit-enter-amt">
          <div>Amount</div>
          <q-input class="deposit-input" filled v-model="depositAmountInput" dense clearable></q-input>
        </div>
        <div class="deposit-options">
          <q-btn
            flat
            class="deposit-option-btn"
            :class="{ active: isUpi1Active }"
            label="UPI1"
            @click="handleDepositUpiClick(1)"
          />
          <q-btn
            flat
            class="deposit-option-btn label-on-discount"
            :class="{ active: isUpi2Active }"
            label="UPI2"
            @click="handleDepositUpiClick(2)"
          />

          <!-- <q-btn flat class="deposit-option-btn active" label="UPI1" />
          <q-btn flat class="deposit-option-btn label-on-discount" label="UPI2" /> -->
        </div>
        <div class="btn-go">Go</div>
      </div>
    </div>
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
import { RiVolumeUpFill } from "vue-remix-icons";
import { App } from "@capacitor/app";

import { useUI } from "stores/ui";

import PlatformBlock from "components/platform/PlatformBlock.vue";
import { translateRecord } from "src/directives/translate";
import ProfileSummary from "../components/ProfileSummary.vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    GameModal,
    MarqueeText,
    RiVolumeUpFill,
    ProfileSummary
  },
  setup() {
    const isFirstView = ref(false);
    const closeAlert = () => {
      localStorage.setItem("indexImgTop", new Date().getTime());
      isFirstView.value = false;
    };

    const fullGameDialog = ref(false);
    const searchText = ref("");

    const depositDialog = ref(false);
    const depositItems = reactive([
      { amount: 100, hotLabel: 5, isActive: false },
      { amount: 300, hotLabel: 15, isActive: false },
      { amount: 500, hotLabel: 25, isActive: false },
      { amount: 1000, hotLabel: 50, isActive: false },
      { amount: 3000, hotLabel: 150, isActive: false },
      { amount: 5000, hotLabel: 250, isActive: false },
      { amount: 10000, hotLabel: 500, isActive: false },
      { amount: 30000, hotLabel: 1500, isActive: false },
      { amount: 50000, hotLabel: 2500, isActive: false }
    ]);

    const handleDepositItemClick = (index) => {
      depositItems.forEach((item, i) => {
        item.isActive = i === index;
        if (i === index) {
          depositAmountInput.value = item.amount;
        }
      });
    };

    const isUpi1Active = ref(true);
    const isUpi2Active = ref(false);

    const handleDepositUpiClick = (option) => {
      if (option === 1) {
        isUpi1Active.value = true;
        isUpi2Active.value = false;
      } else if (option === 2) {
        isUpi1Active.value = false;
        isUpi2Active.value = true;
      }
    };

    const withdrawalDialog = ref(false);
    const withdrawalDialogTab = ref("");
    const depositAmountInput = ref("");

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
    const playGame = (gameName, platformCode, gameCode, gameStatus, gameType, gameId) => {
      // console.log("gameName: ", gameName);
      // console.log("platformCode: ", platformCode);
      // console.log("gameCode: ", gameCode);
      // console.log("gameStatus: ", gameStatus);
      // console.log("gameInfo", gameInfo)

      allGames.value.open(gameName, platformCode, gameCode, gameType);

      // open = (gameName, platformCode, gameCode, gameType)

      // gameModalRef.value.open(gameName, gameInfo.platformCode, gameCode, gameStatus);
    };

    const openGame = (gameName, platformCode, gameCode, gameStatus, gameType, gameId) => {
      // console.log("gameName: ", gameName);
      // console.log("platformCode: ", platformCode);
      // console.log("gameCode: ", gameCode);
      // console.log("gameStatus: ", gameStatus);
      // console.log("gameType: ", gameType);
      // console.log("gameId: ", gameId);

      subGameCode.value = platformCode;
      loadGameList(gameType, gameId);
      fullGameDialog.value = true;
    };

    const subGameList = ref([]);
    // const filteredSubGameList = computed(() => {
    //   return subGameList.value.filter((item) => item.name.toLowerCase().includes(searchText.value.toLowerCase()));
    // });
    const filteredSubGameList = computed(() => {
      if (searchText.value) {
        return subGameList.value.filter((item) => item.name.toLowerCase().includes(searchText.value.toLowerCase()));
      } else {
        return subGameList.value;
      }
    });

    const subGameCode = ref("");

    const loadGameList = (type, id) => {
      const regDevice = Platform.is.mobile ? "MOBILE" : "WEB";
      const code = id;
      const gameType = type;
      const key = `PLATFORM_GAMES_${code}_${gameType}_${regDevice}`;

      // cached
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
            .then((ret) => {
              const res = ret;
              if (res.code === 0) {
                // isLoading.value = false;
                return res;
              }
            })
            .catch((err) => {
              // isLoading.value = false;
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: "Loading failed",
              //   icon: "report_problem"
              // });
            })
        )
        .then((res) => {
          // isLoading.value = false;
          // console.log(res, " ___res");
          subGameList.value = res;

          // debugger;
          // if (currentSelectedMenu.value === "casual") {
          //   miniGames.value = [];
          //   let minis = _.orderBy(res, "sequence");
          //   minis.forEach((mini) => {
          //     mini.lists = [];
          //   });
          //   let games = [];
          //   minis.forEach((mini) => {
          //     if (mini.name.indexOf("(铜)") > -1 || mini.name.indexOf("(银)") > -1 || mini.name.indexOf("(金)") > -1) {
          //       games.push(mini);
          //     } else {
          //       miniGames.value.push(mini);
          //     }
          //   });

          //   // console.log(games);

          //   games.forEach((game) => {
          //     let index = _.findIndex(miniGamesMore.value, function (o) {
          //       return game.name.indexOf(o.name) > -1;
          //     });
          //     if (game.name.indexOf("(铜)") > -1) {
          //       miniGamesMore.value[index]["copper"] = game.code;
          //     } else if (game.name.indexOf("(银)") > -1) {
          //       miniGamesMore.value[index]["silver"] = game.code;
          //     } else if (game.name.indexOf("(金)") > -1) {
          //       miniGamesMore.value[index]["gold"] = game.code;
          //     }
          //   });
          //   // console.log(miniGamesMore.value);
          // } else {
          //   res.forEach((element) => {
          //     element.default = require("../assets/images/games/aviator/default.png");
          //     element.icon = `${process.env.IMAGE_CDN}/game/${siteId}/${selectedPlat.code.toLowerCase()}/${
          //       element.icon
          //     }.png`;
          //   });
          //   gameListData.value = res;
          //   gamePage.total = res.length;
          //   changePage(1, gamePage.pageSize);
          // }
        });
    };

    const imgURLGame = process.env.IMAGE_CDN + "/game/5/";

    const imgURL = process.env.IMAGE_CDN + "/promo/";

    const imgURLLocal = "http://";

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

    const homeBannerData = ref({
      code: 0,
      data: [
        {
          promoPageId: null,
          desktopImageUrl: "265bfc14-9b59-4ac3-9d73-7fedadae2276.jpg",
          mobileImageUrl: "home-banner-01.png",
          redirectUrl: "XingFa-red-packet-rain",
          category: "HOME"
        },
        {
          promoPageId: null,
          desktopImageUrl: "265bfc14-9b59-4ac3-9d73-7fedadae2276.jpg",
          mobileImageUrl: "home-banner-02.png",
          redirectUrl: "XingFa-red-packet-rain",
          category: "HOME"
        },
        {
          promoPageId: null,
          desktopImageUrl: "265bfc14-9b59-4ac3-9d73-7fedadae2276.jpg",
          mobileImageUrl: "home-banner-03.png",
          redirectUrl: "XingFa-red-packet-rain",
          category: "HOME"
        },
        {
          promoPageId: null,
          desktopImageUrl: "265bfc14-9b59-4ac3-9d73-7fedadae2276.jpg",
          mobileImageUrl: "home-banner-04.png",
          redirectUrl: "XingFa-red-packet-rain",
          category: "HOME"
        },
        {
          promoPageId: null,
          desktopImageUrl: "265bfc14-9b59-4ac3-9d73-7fedadae2276.jpg",
          mobileImageUrl: "home-banner-05.png",
          redirectUrl: "XingFa-red-packet-rain",
          category: "HOME"
        },
        {
          promoPageId: null,
          desktopImageUrl: "265bfc14-9b59-4ac3-9d73-7fedadae2276.jpg",
          mobileImageUrl: "home-banner-06.png",
          redirectUrl: "XingFa-red-packet-rain",
          category: "HOME"
        }
      ]
    });

    function loadData() {
      api
        .get("/promo/banner?category=HOME")
        .then((res) => {
          if (res.code === 0) {
            banners.value = res.data;
            // banners.value = homeBannerData.value.data;
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
      // router.push(`${redirectU}`);
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

    onMounted(() => {
      getPlatList();
      loadData();
      loadAnnouncement();
      checkPlatform();
      getVersionNo();
      checkShowImgTop();
      getAppDownloadUrl();

      withdrawalDialogTab.value = "backcard";
    });
    const imageLoading = ref(false);
    const selectedLiveTab = ref();

    return {
      loadGameList,
      imageLoading,
      slide: ref(0),
      tab: ref("esport"),
      gamesTab: ref(platforms.value[0]),
      splitterModel: ref(27),
      imgURL,
      imgURLGame,
      imgURLLocal,
      banners,
      store,
      platforms,
      mainWallet,
      playGame,
      openGame,
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
      sport,
      esport,
      slot,
      livecasino,
      casuals,
      poker,
      fishing,
      lottery,
      isH5,
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
      homeBannerData,
      fullGameDialog,
      searchText,
      depositDialog,
      depositItems,
      handleDepositItemClick,
      isUpi1Active,
      isUpi2Active,
      handleDepositUpiClick,
      depositAmountInput,
      withdrawalDialog,
      withdrawalDialogTab,
      subGameList,
      filteredSubGameList,
      subGameCode
    };
  }
});
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
        background: $primary;
        letter-spacing: 1px;
        font-size: 14px;
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

.midd {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // gap: 10px;
  // margin: 10px;
  // margin-top: -29px;
  // height: 30px;
  margin-top: 10px;
  margin-bottom: 10px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;

  .station-notice-wrapper {
    display: flex;
    // background: rgba(44, 44, 44, 0.7);
    background: rgba(255, 255, 255, 0.24);

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
  }

  .popout-dialog-container {
    background-image: url(../assets/images/index/popout/deposit-bg.png);
    background-position: bottom center;
    background-size: cover;
    background-repeat: no-repeat;
    padding: 30px 20px 20px;
    border-radius: 30px !important;
  }

  .popout-main-title {
    background-image: url(../assets/images/index/popout/popout-title.png);
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
        background-image: url(../assets/images/index/popout/deposit-item-frame.png);
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
        background-image: url(../assets/images/index/popout/deposit-item-frame-active.png);
      }

      .deposit-hot-label {
        position: absolute;
        top: 0;
        right: 0;
        background-image: url(../assets/images/index/popout/hot-label.png);
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
        background-image: url(../assets/images/index/popout/deposit-item-frame-amount.png);
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
          background-image: url(../assets/images/index/popout/label-discount.png);
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

  .withdrawal-tab {
    background-color: #896742;
    border-top-right-radius: 16px;
    border-top-left-radius: 16px;

    .q-tab__label {
      font-weight: 800;
    }

    .q-tab--active {
      color: #000000;
      background: linear-gradient(180deg, #ffcd5c 0%, #fea800 100%);
    }
  }

  .withdrawal-tab-panel {
    background: rgba(21, 0, 37, 0.3);
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;

    .withdrawal-table {
      display: flex;
      gap: 10px;
      flex-direction: column;

      .w-tbl-row {
        display: flex;
        justify-content: space-between;
      }

      .w-tbl-col {
        font-weight: 700;

        &:nth-child(2) {
          font-size: 140%;
        }
      }

      .w-txt-red {
        color: #ff0000;
      }
    }
  }

  .withdrawal-form {
    margin-top: 20px;
    .w-form-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-bottom: 12px;
    }
    .w-form-label {
    }
    .w-form-input {
      background-color: rgba(21, 0, 37, 0.5);
      border-radius: 5px;
    }
  }
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

.home-wrapper {
  width: 95%;
  margin: auto;
}

.home-divider {
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  height: 1px;
  width: 105%;
  margin: 0 -2.5%;
}

.top-action {
  display: flex;
  gap: 16px;
  margin-top: 10px;
  .action-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    line-height: 1;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
    font-weight: 700;
    width: 50%;
    height: 60px;
    transition: 0.3s all;

    &--withdrawal {
      background-image: url(../assets/images/index/action-btn-withdrawal.png);
      color: #ffffff;
    }

    &--deposit {
      background-image: url(../assets/images/index/action-btn-deposit.png);
      color: #fae576;
    }

    &:hover {
      filter: opacity(0.8);
    }
  }
}

.games-selection-wrapper {
  margin-top: 10px;
  margin-bottom: 40px;
  .hot-games-pattern-top {
    background-image: url(../assets/images/index/hot-games-pattern-top.png);
    background-size: contain;
    background-repeat: no-repeat;
    margin-left: -2.5%;
    margin-right: -2.5%;
    height: 140px;
    background-position: center center;
  }

  .hot-games-pattern-bottom {
    background-image: url(../assets/images/index/hot-games-pattern-bottom.png);
    background-size: contain;
    background-repeat: no-repeat;
    height: 50px;
    margin-top: 20px;
    margin-bottom: -40px;
    background-position: center center;
  }

  .hot-games-container {
    // padding-top: 60px;
    margin-top: -30px;
    display: flex;
    justify-content: center;

    img {
      width: 50px;
    }

    .title-hot-games {
      font-family: Arial;
      background-image: url(../assets/images/index/hot-games-title.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 270px;
      margin-left: 10px;
      margin-right: 10px;
      .txt-style {
        background-color: #f3ec78;
        background-image: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
        background-size: 100%;
        -webkit-background-clip: text;
        -moz-background-clip: text;
        -webkit-text-fill-color: transparent;
        -moz-text-fill-color: transparent;
        line-height: 1;
        font-size: 28px;
        font-weight: 800;
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: #db0011;
      }
    }
  }

  .title-game {
    display: flex;
    margin-top: 30px;
    gap: 8px;
    align-items: center;

    .txt-style {
      font-family: Wave;
      background-color: #f3ec78;
      background-image: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
      background-size: 100%;
      -webkit-background-clip: text;
      -moz-background-clip: text;
      -webkit-text-fill-color: transparent;
      -moz-text-fill-color: transparent;
      line-height: 1;
      letter-spacing: 2px;
      font-size: 30px;
      font-weight: 400;
      // font-weight: bold;
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: #a94700;
    }

    img.title-game-icon {
      height: 35px;
    }
  }
}

.game-platform-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 8px;
  row-gap: 12px;
  margin-top: 10px;

  .game-platform-item {
    border: 3px solid #ffc027;
    border-radius: 15px;
    overflow: hidden;

    .game-platform-img {
      background-color: #cccccc;
      width: 100%;
      aspect-ratio: 1/1;
      // height: calc(100% - 30px);
      background-size: cover;
      background-position: center center;
      position: relative;
      background-image: url("../assets/images/index/mini-game-bg.png");

      // &::before {
      //   content: "";
      //   background-image: url("../assets/images/index/mini-game-bg.png");
      //   background-size: cover;
      //   background-position: center center;
      //   position: absolute;
      //   top: 0;
      //   left: 0;
      //   width: 100%;
      //   height: 100%;
      //   z-index: 0;
      // }

      .game--bg {
        background-size: cover;
        background-position: center center;
        height: 100%;
        width: 100%;
      }
    }

    .game-platform-title {
      padding: 0px 5px;
      color: #ffe248;
      font-weight: 700;
      font-size: 10px;
      line-height: 1.1;
      text-align: center;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(270deg, #370f59 -0.1%, #57009d 50.22%, #340c56 97.6%);
    }
  }
}

.game-platform-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 16px;
  row-gap: 24px;
  margin-top: 20px;

  &.sport-platform {
    grid-template-columns: 1fr;
    row-gap: 12px;
  }

  .game-platform-item {
    .game-platform-title {
      text-align: center;
      margin-top: 6px;
      color: #ffe248;
      font-weight: bold;
    }

    img {
      display: block;
      width: 100%;
    }
  }
}

.btn-load-more {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  line-height: 1;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  font-weight: 700;
  width: 180px;
  height: 60px;
  transition: 0.3s all;
  background-image: url(../assets/images/index/btn-load-more.png);
  color: #ffffff;
  margin: auto;
}

.btn-go {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  line-height: 1;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  font-weight: 700;
  width: 180px;
  height: 60px;
  transition: 0.3s all;
  background-image: url(../assets/images/index/popout/btn-go.png);
  color: #ffffff;
  margin: auto;
}

.bottom-tnc {
  font-size: 80%;
  text-align: center;
}

.floating-btn {
  z-index: 5;
  img {
    width: 30px;
  }
}

.fullgame-card {
  margin: 0;
  background-image: url(../assets/images/index/home-bg.png);
  background-position: top center;
  background-repeat: repeat-y;
  background-size: 100%;
  background-color: #280946;
}

.fullgame-wrapper {
  padding: 0;

  .fullgame-header {
    background-image: url(../assets/images/index/fullgame-banner.png);
    background-position: top center;
    background-repeat: no-repeat;
    background-size: cover;
    margin: 0 -2.5%;
    // min-height: 200px;
    padding: 12px;
  }

  .fullgame-search {
    padding-top: 90px;
  }
}

.profile-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 0;

  .profile-details-container {
    display: flex;
    flex-direction: column;
    font-size: 18px;

    .profile-name {
      display: flex;
      align-items: center;
      line-height: 1;
      gap: 10px;

      .vip-details {
        position: relative;
        margin-left: 25px;

        img {
          display: block;
          width: 40px;
          position: absolute;
          top: -6px;
          left: -26px;
        }

        .vip-level {
          background: linear-gradient(93.61deg, #ffd84d 11.24%, #d97d00 91.82%),
            linear-gradient(217.27deg, rgba(255, 255, 255, 0.55) -9.02%, rgba(255, 255, 255, 0) 53.03%);
          border-radius: 0px 2px 5px 0px;
          width: 45px;
          height: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          line-height: 1;
          padding-bottom: 1px;
        }
      }
    }
  }

  .profile-balance {
    position: relative;
    background: rgba(255, 255, 255, 0.24);
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
    padding: 3px 0;
    width: 130px;
    font-size: 14px;

    &:before {
      content: "";
      position: absolute;
      top: -9px;
      left: -3px;
      background: url(../assets/images/index/icon-balance.png) center/40px no-repeat;
      display: block;
      width: 40px;
      height: 40px;
    }

    .balance-amount {
      margin-left: 15px;
    }
  }

  .profile-msg {
    margin-left: auto;
    margin-top: 30px;
  }
}
</style>
