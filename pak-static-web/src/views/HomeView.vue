<template>
  <div class="main-container">
    <el-dialog v-model="isShowRegSuccessModal" width="75%" align-center style="max-width: 1200px" :show-close="false">
      <template #header="{ close }">
        <el-button class="header-close-btn" @click="close"><RiCloseCircleFill style="width: 40px" /></el-button>
      </template>
      <div class="body-content">
        <div class="bg-img-wrapper">
          <div class="bg-img-wrapper__account-present">
            <div class="bg-img-wrapper__account-congrats">Congratulations</div>
            <div class="bg-img-wrapper__account-success">
              Account has successfully registered!
              <img src="../assets/images/welcome/tick.png" />
            </div>
          </div>
          <div class="bg-content-wrapper">
            <div class="bg-content-wrapper__account-left">
              <img src="../assets/images/welcome/spinwheel-woman.png" />
            </div>
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
              <img src="../assets/images/welcome/firstdeposit.png" />
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <div class="main-wrapper">
      <!-- Hero Slider-->
      <div class="top-container-wrapper">
        <BannerCarousel :banners="banners" />
        <!-- <div class="top-container">
          <div class="banner-slider">
            <a-carousel ref="refCarousel" autoplay :slides-to-show="1">
              <div v-for="(banner, i) in banners" :key="i" class="banner-container">
                <router-link :to="`/promotion${banner.redirectUrl}`">
                  <div
                    class="promo-bg isDesktop"
                    :style="'background-image: url(' + imgURL + banner.desktopImageUrl + ')'"
                  />
                  <div
                    class="promo-bg isMobile"
                    :style="'background-image: url(' + imgURL + banner.mobileImageUrl + ')'"
                  />
                </router-link>
              </div>
            </a-carousel>
            <el-button icon="el-icon-next" class="banner-btn btn-prev" @click="prev">
              <img src="../assets/images/index/arrow-back.svg" />
            </el-button>
            <el-button class="banner-btn btn-next" @click="next">
              <img src="../assets/images/index/arrow-forward.svg" />
            </el-button>
          </div>
        </div> -->
      </div>
      <!-- Tabs / Links -->
      <!--      <div class="container">-->
      <!--        <div class="og-tabs">-->
      <!--          <template v-for="tab in platformTabs" :key="`og-tabs-${tab.code}`">-->
      <!--            &lt;!&ndash; Tabs to be excluded from showing &ndash;&gt;-->
      <!--            <div v-if="['Poker'].includes(tab.code)" style="display: none" />-->
      <!--            <router-link class="game-tab" v-else-if="tab.isLink" :to="tab.path">-->
      <!--              <span>{{ tab.name }}</span>-->
      <!--              <img :src="require(`../assets/images/common/tab-${tab.code.toLowerCase()}-icon.png`)" />-->
      <!--            </router-link>-->
      <!--            <div class="game-tab" v-else type="button" @click="showPlatform(tab)">-->
      <!--              <span>{{ tab.name }}</span>-->
      <!--              <img :src="require(`../assets/images/common/tab-${tab.code.toLowerCase()}-icon.png`)" />-->
      <!--            </div>-->
      <!--          </template>-->
      <!--        </div>-->
      <!--      </div>-->

      <!-- <div class="grid-wrapper">
        <div class="items-center grid">
          <template v-for="tab in platformTabs" :key="`og-tabs-${tab.code}`">
            <div
              class="game-board-item"
              :class="platform.code == tab.code ? 'active-board' : ''"
              @click="showPlatform(tab)"
            >
              <img :src="require(`../assets/images/common/${tab.code}-mid-icon.png`)" />
              <span>{{ tab.name }}</span>
            </div>
          </template>
        </div>
      </div> -->
      <div class="station-notice-wrapper container">
        <div class="station-notice-container">
          <img src="@/assets/images/common/volume-up.svg" />
          <div class="station-notice-box">
            <div class="station-notice">
              <marquee-text :repeat="announcementList.length" :duration="announcementList.length * 10">
                <div v-if="announcementList">
                  <span v-for="(a, i) in announcementList" :key="i" @click="openPopup(a)">
                    {{ a.content }}
                  </span>
                </div>
              </marquee-text>
            </div>
          </div>
        </div>
      </div>

      <div class="center-content">
        <SectionWrapper title="🔥HOT" to="/hot" class="section-wrapper">
          <div class="section-wrapper-content">
            <a v-for="(game, index) in hotGames" :key="index" @click="openGame(game, game.platform, game.code)">
              <img :src="loadGameIcon(`${game.code.toLowerCase()}.png`, 'hot')" />
            </a>
          </div>
        </SectionWrapper>
        <SectionWrapper title="Live Casino" to="/live-casino" class="section-wrapper">
          <div class="section-wrapper-content wide">
            <a v-for="(game, index) in liveGames" :key="index" @click="openGame(game, game.code, game.name)">
              <img style="max-height: 228px" :src="loadGameIcon(`${game.code.toLowerCase()}.png`, 'live')" />
            </a>
          </div>
        </SectionWrapper>
        <SectionWrapper title="SLOT" to="/slot" class="section-wrapper">
          <div class="section-wrapper-content">
            <router-link v-for="(game, index) in slotGames" :key="index" :to="`/slot?plat=${game.code}`">
              <img :src="loadGameIcon(`${game.code.toLowerCase()}.png`, 'slot')" />
            </router-link>
          </div>
        </SectionWrapper>
        <SectionWrapper title="Fish" to="/aviator" class="section-wrapper">
          <div class="section-wrapper-content">
            <a v-for="(game, index) in fishingGames" :key="index" @click="openGame(game, game.platformName, game.code)">
              <img :src="`${imgGamesURL}${game.icon}`" />
            </a>
          </div>
        </SectionWrapper>
        <SectionWrapper title="Sport" to="/sport" class="section-wrapper">
          <div class="section-wrapper-content wide">
            <a v-for="(game, index) in sportGames" :key="index" @click="openGame(game, game.code, game.name)">
              <img :src="loadGameIcon(`${game.code.toLowerCase()}.png`, 'sport')" />
            </a>
          </div>
        </SectionWrapper>

        <!--Jackpot-->
        <!-- <div class="jackpot container">
          <div class="numbers">{{'125,980.00'}}</div>
        </div> -->

        <!-- Content -->
        <!-- <div class="og-tab-content container" v-if="['casino', 'Poker'].indexOf(platform.code) === -1"> -->
        <!-- Content Header -->
        <!-- <h2 class="hot-game-header">
            <img src="../assets/images/common/submenu/menu-icons/hot-icon.png" />
            <span>Hot game</span>
          </h2> -->

        <!-- <div class="hot-games-section">
            <img
              @click="openGame(hot, hot.platformCode, hot.code)"
              v-for="(hot, index) in hotGames"
              :key="index"
              :src="imgGamesURL + hot.gameType.toLowerCase() + '/' + hot.platformCode + '/' + hot.icon + '.png'"
            />
          </div>

          <div class="og-tab-content-header" style="display: none">
            <div class="og-tab-content-header-sub">
              <template v-for="item in platformSection.submenu" v-bind:key="`og-tab-content-${item.code}`">
                <router-link v-if="platformSection.isLink" :to="item.to">
                  {{ item.code }}
                </router-link>

                <button
                  v-else
                  @click="setPlatformFilter(item.code)"
                  class="og-btn"
                  :class="{ 'og-btn-active': platformFilter === item.code }"
                >
                  <img :src="require(`../assets/images/common/logo/${item.code}.png`)" />
                </button>
              </template>
            </div>
          </div> -->

        <!-- Content Body -->
        <!-- <div v-if="isGameLoading" style="display: flex; justify-content: center; align-items: center; display: none">
            <a-spin />
          </div>
          <div
            style="display: none"
            v-else
            class="og-tab-content-body"
            ref="ogTabContentBodyRef"
            data-aos="fade-in"
            data-aos-easing="ease-out"
            data-aos-duration="1000"
            data-aos-anchor="#parent"
          >
            <div
              v-for="game in platformSection.games.slice(0, 10)"
              v-bind:key="`og-block-${platformSection.code}-${game.id}`"
              @click="openGame(game, platformSection.code, platformSection.status)"
            >
              <div class="og-content-thumb">
                <img v-image="game.icon" :src="game.default" />
              </div>
            </div>
          </div> -->

        <!-- End -->
        <!-- </div> -->
        <!-- <div class="og-tab-content container" v-else>
          <LiveCasinoView v-if="platform.code == 'casino'" no-banner />
          <PokerView v-if="platform.code == 'Poker'" no-banner />
        </div> -->
        <!-- <div class="ribbonbar container">
          <div
            v-for="(win, wini) in topWinners.slice(0, 4)"
            class="rib"
            :key="wini"
            @click="openGame(win, win.platformCode)"
          >
            <div class="rib-left">
              <img :src="imgGamesURL + win.gameType.toLowerCase() + '/' + win.platformCode + '/' + win.icon + '.png'" />
            </div>
            <div class="rib-center">
              <span class="rib-number">
                {{ win.loginName }}
              </span>
              <span class="rib-title">{{ win.gameName }}</span>
            </div>
            <div class="rib-right">
              <div class="rib-tag">BET WIN</div>
              <div class="rib-plus">+{{ win.amount }}</div>
            </div>
          </div>
        </div> -->

        <!-- Download Apps -->
        <!-- <DownloadApp /> -->
        <!-- Services Advantages -->
        <!-- <ServicesAdvantages /> -->
      </div>
    </div>

    <GameModal ref="slotsGame" />
    <a-modal
      v-model:visible="isStationNotice"
      class="notice-modal"
      wrap-class-name="noticeModal"
      width="100%"
      :mask-closable="true"
      :footer="null"
      centered
      title="Announcements"
      :style="{ padding: 0 }"
    >
      <a-tabs v-model:activeKey="announcementActive" class="announcementTabs" @change="announcementTabChange">
        <a-tab-pane v-for="tab in announcementTypes" :key="tab.id" :tab="tab.name">
          <a-collapse v-model:activeKey="typeActive" :expand-icon-position="'right'">
            <template v-for="(ann, idx) in announcementList" :key="idx">
              <template v-if="ann.typeId === tab.id">
                <a-collapse-panel :key="ann.typeId" :header="ann.title">
                  {{ ann.content }}
                </a-collapse-panel>
              </template>
            </template>
          </a-collapse>
        </a-tab-pane>
      </a-tabs>
    </a-modal>

    <el-dialog
      @close="setWithExpiry('isImpt', true, homePopupFrequencyNum)"
      class="imptann-modal"
      v-model="isImportantAnnoucementModal"
      v-if="!isImpt"
    >
      <a :href="homePopupPath" :target="homePopupPath.includes('https://') ? '_blank' : '_self'">
        <img :src="homePopupImg" class="alert-img" />
      </a>
    </el-dialog>

    <AdsPopupList ref="homeadsPopupListRef" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { getTabMatches } from "@/api/games/esports";
import moment from "moment";
import GameModal from "@/components/modal/GameModal";
import { RiVolumeUpLine, RiCloseCircleFill } from "vue-remix-icons";
import { useRoute, useRouter } from "vue-router";
import { getAnnouncement } from "@/api/personal/personal";
import { getPlatformGames, getPlatformList, hotGame, topWin } from "@/api/platform/platform";
import { loadHomePopup, loadPromoBanner } from "@/api/index/promo";
import { globalStore } from "@/store";
import MarqueeText from "vue-marquee-text-component";
import TFLoading from "@/components/loading/TFLoading.vue";
import NavPlatforms from "@/constant/platforms";
import DownloadApp from "@/components/DownloadApp";
import ServicesAdvantages from "@/components/ServicesAdvantages";
import LiveCasinoView from "@/views/games/LiveCasinoView.vue";
import PokerView from "@/views/games/PokerView.vue";
import { userStore } from "@/store";
import AdsPopupList from "@/components/hotpromo/adsPopupList.vue";
import BannerCarousel from "@/components/home/BannerCarousel.vue";
import SectionWrapper from "@/components/home/SectionWrapper.vue";
import { getDevice } from "@/utils/utils";
const store = userStore();
const winners = [
  {
    img: "lightning",
    acc: "8787****1203",
    gametitle: "Lightning Bomb",
    tag: "Bet win",
    points: "1,041"
  },
  {
    img: "lightning",
    acc: "8787****1203",
    gametitle: "Lightning Bomb",
    tag: "Bet win",
    points: "1,041"
  },
  {
    img: "lightning",
    acc: "8787****1203",
    gametitle: "Lightning Bomb",
    tag: "Bet win",
    points: "1,041"
  },
  {
    img: "lightning",
    acc: "8787****1203",
    gametitle: "Lightning Bomb",
    tag: "Bet win",
    points: "1,041"
  }
];
// CONSTANTS
const PLATFORM_CODE = {
  SLOT: "SLOT",
  FISH: "FISH"
};

// Legacy
const imgURL = process.env.VUE_APP_IMAGE_CDN + "/promo/";
const imgGamesURL = process.env.VUE_APP_IMAGE_CDN + "/game/";
const banners = ref([]);
const route = useRoute();
const router = useRouter();

const homeadsPopupListRef = ref();

const slotsGame = ref(null);

const ogTabContentBodyRef = ref();

const homeState = reactive({
  tabMatchs: [],
  sportMatchs: [],
  hotMatchs: [],
  trendingGames: [],
  jiliGamesList: [],
  sgGamesList: [],
  esGamesList: []
});

const platformTabs = NavPlatforms.sort((a, b) => a.tabOrder - b.tabOrder);

const platforms = ref([]);
const lives = ref([]);

const platform = ref(NavPlatforms[0]);
const showPlatform = (newPlatform) => {
  const { SLOT, FISH } = PLATFORM_CODE;

  platform.value = newPlatform;

  if (newPlatform.isLink) {
    router.push(newPlatform.path);
  } else if (newPlatform.id === SLOT || newPlatform.id === FISH) {
    loadGameList(0, () => {
      fadeOnClick();
    });
  }
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
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

const isImpt = getWithExpiry("isImpt");

const isFirstView = ref(false);
const homePopupImg = ref("");
const homePopupPath = ref("");
const isImportantAnnoucementModal = ref(false);
const homePopupFrequency = ref(0);
const homePopupFrequencyNum = ref(0);
const homePopupContent = ref("");
const homePopupType = ref("");
const homePopupId = ref(0);

const slotGames = ref([]);
const liveGames = ref([]);
const fishingGames = ref([]);
const sportGames = ref([]);

const checkShowImgTop = () => {
  const lastTime = localStorage.getItem("indexImgTop");
  if (lastTime) {
    const diff = new Date().getTime() - Number(lastTime);
    if (diff > 1000 * 60 * 60 * 12) isFirstView.value = true;
  } else {
    loadHomePopup()
      .then((res) => {
        const { code, data } = res;
        if (code === 0) {
          if (isImpt === null) {
            switch (data["frequency"]) {
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
            if (data["path"].includes("https://")) {
              homePopupPath.value = data["path"];
            } else {
              homePopupPath.value = "/promotion?name=" + data["path"];
            }
            homePopupImg.value = imgURL + data["desktopImgUrl"];
            homePopupContent.value = data["content"];
            homePopupType.value = data["type"];
            homePopupId.value = data["id"];
            homePopupFrequency.value = data["frequency"];
            isFirstView.value = true;
          } else {
            isImportantAnnoucementModal.value = false;
          }
        }
      })
      .catch(() => {});
  }
};

const refCarousel = ref(null);

const next = () => {
  refCarousel.value.next();
};

const prev = () => {
  refCarousel.value.prev();
};

const platformFilter = computed({
  get: () => platform.value.tabFilter,
  set: (newValue) => (platform.value.tabFilter = newValue)
});

const setPlatformFilter = (newValue) => {
  loadGameList(newValue, () => {
    fadeOnClick();
  });
  platformFilter.value = newValue;
};

const fadeOnClick = () => {
  if (ogTabContentBodyRef.value) {
    const ogTabContentBody = ogTabContentBodyRef.value;
    ogTabContentBody.classList.remove("aos-animate");
    ogTabContentBody.style.transition = "none";
    setTimeout(() => {
      ogTabContentBody.style.transition = "1s";
      ogTabContentBody.classList.add("aos-animate");
    }, 100);
  }
};

const platformSection = computed(() => {
  const _platform = structuredClone(platform.value);
  const findPlatformOverApi = platforms.value.find(
    (p) => p.code === platformFilter.value && p.gameType.includes(platform.value.platformType)
  );

  // Copy Game over
  _platform.games =
    findPlatformOverApi && findPlatformOverApi.games
      ? findPlatformOverApi.games.filter((g) => g.gameType === platform.value.platformType)
      : [];

  _platform.code = findPlatformOverApi ? findPlatformOverApi.code : "";
  _platform.status = findPlatformOverApi ? findPlatformOverApi.status : "";
  _platform.platformId = findPlatformOverApi ? findPlatformOverApi.id : null;

  return _platform;
});

const openGame = (game, platformCode, gameCode) => {
  const platName = game.alias ?? game.cnname ?? game.name;
  slotsGame.value.open(platName, platformCode, gameCode);
  // if (game.gameType && (game.gameType === "SLOT" || game.gameType === "FISH" || game.gameType === "BINGO")) {
  //   slotsGame.value.open(game.name, platName, game.code, platStatus);
  // } else {
  //   slotsGame.value.open(game.gameName, game.name, game.code, platStatus);
  // }
};
const hotTrendingGames = [
  {
    code: null,
    name: "Evo",
    gameName: "EVO",
    game: require("../assets/images/index/top-trending-games/platform-evo.png"),
    logo: require("../assets/images/index/top-trending-games/logo-spade.png")
  },
  {
    code: null,
    name: "DreamGaming",
    gameName: "Dream Gaming",
    game: require("../assets/images/index/top-trending-games/platform-dream-gaming.png"),
    logo: require("../assets/images/index/top-trending-games/logo-spade.png")
  },
  {
    code: null,
    name: "Awc",
    gameName: "AE Sexy",
    game: require("../assets/images/index/top-trending-games/platform-ae.png"),
    logo: require("../assets/images/index/top-trending-games/logo-spade.png")
  },
  {
    code: "F-SF01",
    name: "SpadeGaming",
    gameName: "Fishing God",
    game: require("../assets/images/index/top-trending-games/platform-spadegaming.png"),
    logo: require("../assets/images/index/top-trending-games/logo-spade.png")
  },
  {
    code: "61",
    name: "JiliGames",
    gameName: "Dragon & Tiger",
    game: require("../assets/images/index/top-trending-games/platform-jili-tnd.png"),
    logo: require("../assets/images/index/top-trending-games/logo-spade.png")
  },
  {
    code: "sLightnWmn",
    name: "NextSpin",
    gameName: "Lightning Woman",
    game: require("../assets/images/index/top-trending-games/platform-nextspinning.png"),
    logo: require("../assets/images/index/top-trending-games/logo-spade.png")
  },
  {
    code: "71",
    name: "JiliGames",
    gameName: "Jili",
    game: require("../assets/images/index/top-trending-games/platform-jili-1.png"),
    logo: require("../assets/images/index/top-trending-games/logo-spade.png")
  },
  {
    code: "S-PH02",
    name: "SpadeGaming",
    gameName: "King Pharaoh",
    game: require("../assets/images/index/top-trending-games/platform-spadegaming-king-pharaoh.png"),
    logo: require("../assets/images/index/top-trending-games/logo-spade.png")
  }
];
const hotGames = ref([]);
const getHotGames = () => {
  hotGame("HOT").then((res) => {
    hotGames.value = res;
  });
};
const topWinners = ref([]);

const getTopWinners = () => {
  topWin().then((res) => {
    if (res.code === 0) {
      topWinners.value = res.data;
    }
  });
};
const matchTabActive = ref("1");

const tabMatchData = [
  {
    gameLogo: "ALL",
    gameName: "",
    gameId: ""
  },
  {
    // gameLogo: require("../assets/images/index/game_icon_csgo.png"),
    gameName: "CS:GO",
    eventCount: 96,
    gameId: "1"
  },
  {
    // gameLogo: require("../assets/images/index/game_icon_dota2.png"),
    gameName: "DOTA 2",
    eventCount: 30,
    gameId: "2"
  },
  {
    // gameLogo: "https://assets.1kuaisudai.com/media/images/game/lol.png",
    gameName: "League Of Legends",
    eventCount: 30,
    gameId: "3"
  },
  {
    // gameLogo: "https://assets.1kuaisudai.com/media/images/game/val.png",
    gameName: "Valorant",
    eventCount: 35,
    gameId: "24"
  }
];
const sportsMatchData = [
  {
    name: "Popular Match",
    homeName: "Spain",
    // homeImg: require("../assets/images/index/index_team_1.png"),
    awayName: "Portugal"
    // awayImg: require("../assets/images/index/index_team_2.png")
  },
  {
    name: "Match",
    homeName: "Spain",
    // homeImg: require("../assets/images/index/index_team_1.png"),
    awayName: "Portugal"
    // awayImg: require("../assets/images/index/index_team_2.png")
  }
];
const tabsChange = (nk) => {
  homeState.tabMatchs.forEach((element) => {
    if (nk === element.gameId) {
      getMatchData(element);
    }
  });
};

const getMatchData = (e) => {
  e.matchInfo = [];
  getTabMatches(e.gameId, 4).then((data) => {
    data.forEach((tab) => {
      if (tab.gameType === 1) {
        tab.gameName = "CSGO";
        return;
      }
      if (tab.gameType === 2) {
        tab.gameName = "DOTA";
      }
      if (tab.gameType === 3) {
        tab.gameName = "League Of Legends";
      }
      if (tab.gameType === 24) {
        tab.gameName = "VALORANT";
      }
      if (tab.gameType === 4) {
        tab.gameName = "Starcraft II";
      }
      if (tab.gameType === 12) {
        tab.gameName = "Totem Esports";
      }
      if (tab.gameType === 17) {
        tab.gameName = "Basketball";
      }
    });
    e.matchInfo = data;
  });
};

const getPlatList = () => {
  getPlatformList()
    .then((data) => {
      data.forEach((d) => (d.gameType = d.gameType.split(",")));

      platforms.value = data.filter((element) => element.gameType.some((type) => ["SLOT", "FISH"].includes(type)));
      const _platform = [];
      const _slotGames = [];
      const _liveGames = [];
      const _sportGames = [];
      data.forEach((platform) => {
        if (platform.gameType.some((type) => ["SLOT", "FISH"].includes(type))) _platform.push(platform);
        if (platform.gameType.includes("SLOT")) _slotGames.push(platform);
        if (platform.gameType.includes("LIVE")) _liveGames.push(platform);
        if (platform.gameType.includes("SPORT")) _sportGames.push(platform);
      });
      platforms.value = _platform.sort((a, b) => a.sequence - b.sequence);
      liveGames.value = _liveGames.sort((a, b) => a.sequence - b.sequence);
      slotGames.value = _slotGames.sort((a, b) => a.sequence - b.sequence);
      sportGames.value = _sportGames.sort((a, b) => a.sequence - b.sequence);
      platforms.value.sort((a, b) => a.sequence - b.sequence);

      if (platforms.value.length > 0) loadGameList(0);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
const getFishingGameList = async () => {
  const jiliGameList = await getPlatformGames(8, "FISH");
  jiliGameList.forEach((game) => (game.platformName = "JILI"));
  const jdbGameList = await getPlatformGames(31, "FISH");
  jdbGameList.forEach((game) => (game.platformName = "JDB"));
  fishingGames.value = jiliGameList.concat(jdbGameList);
};
const loadBanners = () => {
  loadPromoBanner("HOME").then((res) => {
    if (res.code === 0) {
      banners.value = res.data;
    }
  });
};

const isGameLoading = ref(false);
const loadGameList = async (index, callback) => {
  isGameLoading.value = true;

  if (index !== 0) {
    platforms.value.forEach((e, i) => {
      if (e.code === index) index = i;
    });
  }
  const e = platforms.value[index];
  const { id } = e;
  const data = await getPlatformGames(id, platform.value.id);

  e.games = [];
  e.games = e.games.concat(data);

  data.forEach((element) => {
    element.default = require("../assets/images/games/aviator/default.png");
    element.icon = `${process.env.VUE_APP_IMAGE_CDN}/games/slot/${e.code}/${element.icon}.png`;
  });

  isGameLoading.value = false;

  callback && callback();
};

const announcementActive = ref();
const typeActive = ref();
const announcementList = ref([]);
const announcementTypes = ref([]);
const loadAnnouncement = () => {
  getAnnouncement().then((res) => {
    if (res.code === 0) {
      const d = res.data.announcements ?? [];
      announcementTypes.value = res.data.type;

      if (res.data.type?.length > 0) {
        announcementActive.value = res.data.type[0].id;
      }
      announcementList.value = d;
    }
  });
};
const announcementTabChange = () => {
  // homeState.tabMatchs.forEach(element => {
  //   if (nk === element.gameId) {
  //     getMatchData(element);
  //   }
  // });
};
const isStationNotice = ref(false);
const noticeTitle = ref("");
const openPopup = (noticeType) => {
  if (noticeType) {
    console.log(noticeType);
    noticeTitle.value = noticeType.title;
    isStationNotice.value = true;
  }
};

const isShowRegSuccessModal = ref(false);
const initRegSuccessModal = () => {
  if (route.query && route.query.isFromRegister) isShowRegSuccessModal.value = true;
};

const isRedirectToPromoClicked = ref(false);
const redirectToPromo = () => {
  isRedirectToPromoClicked.value = true;
  router.push("/center/top-up?isFromWelcomePromo=true");
};

const loadGameIcon = (path, type) => {
  try {
    return require(`@/assets/images/platform/${type}/${path}`);
  } catch (e) {
    return require("@/assets/images/platform/slot/default.png");
  }
};

onMounted(async () => {
  loadAnnouncement();
  getPlatList();
  getHotGames();
  // getTopWinners();
  loadBanners();
  checkShowImgTop();
  getFishingGameList();

  const hotMatchData = [];

  await getTabMatches(1000, 4).then(function (data) {
    data.forEach(function (item) {
      let matchDatetime = moment(item.eventDate).format("ddd, DD MMM, HH:mma");
      hotMatchData.push({
        id: item.eventDate,
        name: item.competitionName,
        dateTime: matchDatetime,
        homeName: item.home,
        homeImg: item.homeLogo,
        awayName: item.away,
        awayImg: item.awayLogo
      });
    });
  });

  homeState.tabMatchs.push(...tabMatchData);
  matchTabActive.value = homeState.tabMatchs[0].gameId;
  homeState.sportMatchs.push(...sportsMatchData);
  tabsChange(matchTabActive.value);
  homeState.trendingGames.push(...hotTrendingGames);
  homeState.hotMatchs.push(...hotMatchData);

  initRegSuccessModal();
});
</script>

<style lang="scss">
.noticeModal {
  .notice-modal.ant-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 800px;

    .ant-modal-content {
      width: 95%;
      background-color: #131313;

      .ant-modal-header {
        border: 0;
        border-radius: 20px 20px 0 0;
        background: none;
        // background: linear-gradient(104.75deg, #4183d3 39.58%, #8ec1f7 109.58%);

        .ant-modal-title {
          font-family: "Poppins Bold";
          font-size: 30px;
          text-align: center;
          padding-top: 20px;
          color: #ffffff;
        }
      }

      .ant-modal-body {
        border-radius: 0 0 5px 5px;
        padding: 20px;

        .ant-tabs-top-bar {
          border: 0;
        }

        .announcementTabs {
          .ant-tabs-nav .ant-tabs-tab {
            margin: 0;
            font-family: "Poppins Regular";
            font-size: 18px;
            color: #83a3ca;

            &.ant-tabs-tab-active {
              padding: 2px 5px;
              background: linear-gradient(270deg, #1baa99 0%, #8ac542 100%);
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              text-shadow: none;
              font-family: "Poppins Bold";
              border-bottom: 3px solid $primary-color;
            }
          }

          .ant-tabs-ink-bar {
            background-color: transparent;
          }

          .ant-collapse {
            border: 0;
            background: none;
          }

          .ant-collapse > .ant-collapse-item {
            border: 0;
          }

          .ant-collapse > .ant-collapse-item > .ant-collapse-header {
            border-bottom: 1px solid #83a3ca33;
            color: #ffffff;
            font-family: "Poppins Bold";
            font-size: 18px;
            font-weight: 700;
          }

          .ant-collapse > .ant-collapse-item > .ant-collapse-content {
            border: 0;
            color: #83a3ca;
            font-family: "Poppins Regular";
            font-size: 14px;
            background: transparent;
          }
        }
      }
    }
  }
}
.dark-theme {
  .noticeModal {
    .notice-modal.ant-modal {
      .ant-modal-content {
        .ant-modal-header {
          background: none;

          .ant-modal-title {
            color: #fff;
          }
        }

        .ant-modal-body {
          .announcementTabs {
            .ant-tabs-nav .ant-tabs-tab {
              &.ant-tabs-tab-active {
              }
            }

            .ant-collapse > .ant-collapse-item > .ant-collapse-header {
              color: #fff;
            }
          }
        }
      }
    }
  }
}

.imptann-modal {
  max-width: 760px;
  margin-top: 170px !important;

  background: transparent !important;
  box-shadow: none !important;

  .el-dialog__body {
    padding: 20px !important;
    border-radius: 12px;
  }

  .alert-img {
    display: block;
    width: 100%;
    border-radius: 12px;
  }

  .el-dialog__headerbtn {
    top: 8px !important;
    right: 15px;
    height: 2em !important;
    width: 2em !important;
    border-radius: 50%;
    background: #666;
    text-align: center;
    line-height: 1.7em;
    display: flex;
    align-items: center;
    z-index: 99;
    justify-content: center;
  }
}

//.is21Modal {
//  padding: 50px;
//
//  .ant-modal .ant-modal-content .ant-modal-body {
//    background: #ffffff;
//    padding: 40px;
//
//    .pagcor {
//      display: flex;
//      flex-direction: column;
//      gap: 10px;
//
//      .images {
//        display: flex;
//        flex-direction: column;
//        gap: 20px;
//        margin-bottom: 30px;
//        .banner-line {
//          //          font-size: 30px;
//          text-align: center;
//        }
//      }
//
//      .ant-btn-primary {
//        background-image: linear-gradient(270deg, #5800e8 30%, #0062e8 70%, #5800e8 100%);
//        transition: all 0.5s;
//        background-size: 400% 100%;
//        border-radius: 12px;
//      }
//      .ant-btn-default {
//        border-radius: 12px;
//      }
//
//      .ant-btn:hover,
//      .ant-btn:focus {
//        background-position: 100% 0;
//      }
//
//      // .banner-board {
//      //   position: relative;
//      //   width: 500px;
//      //   height: 320px;
//
//      //   .banner-left {
//      //     position: absolute;
//      //     left: 0px;
//      //     top: 0px;
//      //     background-image: url("../assets/images/common/banner-left.png");
//      //     width: 244px;
//      //     height: 320px;
//      //     background-position: -30px -8px;
//      //     background-repeat: no-repeat;
//      //   }
//
//      //   .banner-bubble {
//      //     position: absolute;
//      //     width: 52px;
//      //     height: 60px;
//      //     top: 70px;
//      //     left: 240px;
//      //   }
//
//      //   .banner-logo {
//      //     position: absolute;
//      //     width: 160px;
//      //     height: auto;
//      //     right: 0px;
//      //     top: 0px;
//      //   }
//
//      //   .banner-info {
//      //     position: absolute;
//      //     right: 0px;
//      //     bottom: 10px;
//      //     width: 265px;
//      //     z-index: 4;
//      //     height: 172px;
//      //     border: 4px solid #5e9be1;
//      //     border-radius: 4px;
//
//      //     display: flex;
//      //     flex-direction: column;
//      //     justify-content: center;
//      //     gap: 3px;
//      //     align-items: flex-start;
//
//      //     .banner-pagcor {
//      //       width: 70px;
//      //       height: auto;
//      //     }
//
//      //     .banner-info-top {
//      //       display: flex;
//      //       justify-content: space-between;
//      //       width: calc(100% - 10px);
//      //       align-items: center;
//      //       margin: 0px auto;
//      //     }
//
//      //     .mid-line {
//      //       height: 1px;
//      //       background: #c7e1ff;
//      //       width: calc(100% - 20px);
//      //       margin: 2px auto 2px;
//      //     }
//
//      //     .banner-line1 {
//      //       color: #5e9be1;
//      //       font-size: 24px;
//      //       line-height: 24px;
//      //       font-weight: bold;
//      //       padding-left: 15px;
//      //       white-space: nowrap;
//      //     }
//
//      //     .banner-line2 {
//      //       color: #5e9be1;
//      //       font-size: 24px;
//      //       line-height: 24px;
//      //       font-weight: bold;
//      //       padding-left: 15px;
//      //       white-space: nowrap;
//      //     }
//
//      //     strong {
//      //       color: #ff0d0d;
//      //     }
//
//      //     .banner-line3 {
//      //       color: #1b1958;
//      //       font-size: 18px;
//      //       line-height: 24px;
//      //       font-weight: 200;
//      //       padding-left: 15px;
//      //       white-space: nowrap;
//      //     }
//
//      //     .banner-line4 {
//      //       color: #5e9be1;
//      //       font-size: 28px;
//      //       line-height: 30px;
//      //       font-weight: bold;
//      //       padding-left: 15px;
//      //     }
//
//      //     .banner-line5 {
//      //       color: #1b1958;
//      //       font-size: 22px;
//      //       line-height: 22px;
//      //       font-weight: 200;
//      //       padding-left: 15px;
//      //     }
//      //   }
//      // }
//    }
//  }
//
//  img {
//    width: 100%;
//  }
//}
</style>

<style scoped lang="scss">
$link-color: #db7e42;
.ant-carousel {
  :deep() {
    .slick-slider {
      overflow: hidden;
    }

    .slick-slide {
      text-align: center;
      max-height: 540px;

      display: flex;
      align-items: center;
      overflow: hidden;

      & > div {
        display: flex;
        width: 100%;
      }
    }

    .slick-dots button {
      background-color: #000;
    }
  }
}

@-webkit-keyframes scale {
  100% {
    -webkit-transform: scale(1, 1);
  }
}

@keyframes scale {
  100% {
    transform: scale(1, 1);
  }
}
.dark-theme {
  .main-container .main-wrapper .station-notice-container {
    background: #ffffff05;

    border: 1px solid;
    border-image-slice: 1;
    border-width: 1px;
    border-radius: 12px;
    border-image-source: linear-gradient(91.02deg, rgba(255, 230, 0, 0.16) 0%, rgba(72, 167, 255, 0.16) 100%);
  }
}
.main-container {
  padding: 0;

  .main-wrapper {
    width: 100%;
    padding: 27px 39px;

    .top-container-wrapper {
      margin-bottom: 24px;
      animation-duration: 0.5s;

      .top-container {
        width: 100%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;

        .banner-slider {
          width: 100%;
          position: relative;

          .banner-btn {
            position: absolute;
            z-index: 999;
            width: 32px;
            height: 32px;
            text-align: center;
            line-height: 32px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.4);

            img {
              filter: brightness(0) invert(1);
              width: 21px;
              height: 21px;
            }

            &.btn-prev {
              top: 50%;
              left: 8px;
              margin-top: -15px;
            }

            &.btn-next {
              top: 50%;
              right: 8px;
              margin-top: -15px;
            }

            &:hover {
              opacity: 0.8;
            }

            &:active {
              filter: brightness(0.8);
            }
          }

          .banner-container {
            .promo-bg {
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center center;

              &.isDesktop {
                display: block;
                height: 22vw;
              }

              &.isMobile {
                display: none;
                height: 220px;
              }
            }
          }
        }
      }
    }

    .station-notice-wrapper {
      color: inherit;
      width: 100%;
      margin-bottom: 28px;
      border-radius: 12px;
      overflow: hidden;
    }

    .station-notice-container {
      width: 100%;
      color: #8c968f;
      margin: 0 auto;
      display: flex;
      justify-content: flex-start;
      background: #ffffff0d;
      padding: 0.45rem 1rem;
      border-radius: 5rem;

      svg {
        fill: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
        aspect-ratio: 1/1;
        height: 1.4rem;
      }

      .station-notice-box {
        position: relative;
        overflow: hidden;
        margin-left: 10px;
        width: 100%;
        padding: 10px 0;
      }

      .station-notice {
        position: absolute;
        top: 0px;
        height: 24px;
        font-size: 17px;
        line-height: 24px;
        white-space: nowrap;
        color: inherit;

        span {
          cursor: pointer;
          margin-right: 40px;
        }
      }
    }

    .esports {
      display: none;

      .esport-wrapper {
        max-width: $container-width;
        margin: 0 auto;
        display: flex;
        justify-content: stretch;
        width: 95%;
      }

      overflow: hidden;
    }

    .sportesports {
      .wrp {
        max-width: $container-width;
        width: 100%;
        margin: 0 auto;
        display: flex;
        align-items: stretch;
        padding: 110px 0;
      }

      // max-width: $container-width;
      // width: 100%;
      // margin: 0 auto;
      // display: flex;
      // align-items: flex-start;
    }

    .bet-box {
      width: 100%;
      // max-width: 495px;
      margin: 0 auto;
      max-width: $container-width;
      border-radius: 5px;
      padding: 0;
      display: flex;
      flex-direction: column;
      padding: 20px;
      border-radius: 20px;
      // background: rgb(26, 23, 28, .7);
      // overflow: hidden;
      // flex-direction: column;
      // justify-content: flex-start;
      font-size: 2rem;

      .matchesTabs.ant-tabs {
        width: 100%;

        svg {
          fill: #434343;
          display: block;
        }

        &.nav-scroll {
          overflow: unset;
        }

        :deep(.ant-tabs-bar) {
          margin-bottom: 0;
        }

        :deep(.ant-tabs-nav-container-scrolling) {
          padding: 0;
        }

        :deep(.ant-tabs-top-content) {
          background: unset;
          border-radius: 5px;
        }

        :deep(.ant-tabs-right-bar) {
          border: 0;

          .ant-tabs-nav-wrap {
            margin: 0;
          }
        }

        :deep(.ant-tabs-right-content) {
          background: unset;
          padding-right: 20px;
          border: 0;
        }

        :deep(.ant-tabs-nav-container) {
          // border-bottom: 1px solid #db7e42;
          border: 0;
        }

        :deep(.ant-tabs-tab) {
          width: 100%;
          text-align: center;
          border: 0;
          border-radius: 100%;
          padding: 16px;
          margin: 19px 0px;
          filter: grayscale(1);

          img {
            width: 30px;
          }

          &:hover {
            &:before {
              box-shadow: inset 2px 1px 3px 0px #ff6700e6;
              transform: rotate(360deg);
            }
          }

          &:before {
            box-shadow: inset 2px 1px 3px 0px #ff6700e6;
            width: 100%;
            height: 100%;
            border-radius: 100%;
            transform: rotate(0deg);
            transition: all 0.3s ease-in;
          }

          &.ant-tabs-tab-active {
            filter: grayscale(0);

            svg {
              fill: #de4646;
            }

            &:before {
              box-shadow: inset 2px 1px 3px 0px #ff6700e6;
              width: 100%;
              height: 100%;
              border-radius: 100%;
              transform: rotate(155deg);
            }
          }
        }

        :deep(.ant-tabs-ink-bar) {
          background: none;
          border: 0;
        }

        .nomatches {
          min-height: 440px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .game-name {
        margin: 10px;
        display: block;
      }

      .inner-content {
        min-height: 440px;
        overflow: auto;
        padding: 0px;
      }

      .bet-more {
        padding: 10px;
        font-size: 14px;
        position: absolute;
        right: 20px;
        top: 25px;
        min-width: 120px;
      }

      ::-webkit-scrollbar {
        width: 0; /* Remove scrollbar space */
        background: transparent; /* Optional: just make scrollbar invisible */
      }

      .matches {
        width: 100%;
        margin-bottom: 20px;
        box-shadow: -10px 0px 15px rgb(0 0 0 / 15%);
        border-radius: 20px;

        .tab-match-info-wrapper {
          .tab-match-info {
            padding: 10px;
            border-bottom: 1px solid #23263c;
          }

          .tab-match-info-game {
            color: #ff6600;
            font-weight: bold;
          }
        }

        .bet-row {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 10px;

          .competitor {
            display: flex;
            justify-content: center;
            padding: 5px;
            width: 50%;
            max-width: 300px;
            border-radius: 3px;
            justify-content: space-between;
            align-items: center;

            &.facing-left {
              clip-path: polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%);
              text-align: left;
              padding-left: 20px;
              justify-content: flex-start;
              flex-direction: column;
            }

            &.facing-right {
              clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
              text-align: right;
              padding-right: 20px;
              justify-content: flex-end;
              flex-direction: column-reverse;
            }

            img {
              height: 40px;
              width: auto;
              display: block;
            }

            .match {
              padding: 0 10px;

              font-weight: bold;
            }
          }
        }

        .vs {
          background-image: linear-gradient(to right, #de4545, #db7e42);
          color: #2b2b4b;
          font-weight: bold;
          font-size: 1.2rem;
          padding: 9px 12px;
          border-radius: 10px;
        }
      }
    }

    .sports {
      min-height: 550px;
      width: 100%;
      margin-left: 50px;
      padding: 20px;

      .bet-more {
        position: absolute;
        right: 20px;
        top: 25px;
      }

      .sports-wrapper {
        .matches {
          width: 100%;
          // border-radius: 5px;
          // margin: 0 auto 30px;
          // box-shadow: 0 -30px 15px -25px #de4645;
          border: 4px solid #2b2b4b;
          border-radius: 20px;
          margin-bottom: 20px;

          .tab-match-info-wrapper {
            border-bottom: 4px solid #2b2b4b;

            .tab-match-info {
              padding: 10px;
            }

            .tab-match-info-game {
              color: #ff6600;
              font-weight: bold;
            }
          }

          .bet-row {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;

            .competitor {
              display: flex;
              justify-content: center;
              padding: 15px;
              width: 50%;
              align-items: center;

              img {
                height: 40px;
                width: auto;
                display: block;
                filter: drop-shadow(-2px 2px 1px #434343);
                border-radius: 50%;
              }

              .match {
                padding: 0 10px;

                font-weight: bold;
              }
            }
          }

          .vs {
            font-weight: bold;
            font-size: 1.2rem;
            padding: 9px 12px;
            border-radius: 10px;
          }
        }
      }
    }

    .centername {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 40px auto;

      .game-title {
        background-image: linear-gradient(to right, #de4545, #db7e42);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .leftname {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .game-title {
        background-image: linear-gradient(to right, #de4545, #db7e42);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .module.parallax {
      height: auto;
      background-position: 50% 0;
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-size: 100%;
      background-position: center right;
    }

    .module.parallax-1 {
      background-image: url("https://media.istockphoto.com/photos/sport-background-green-field-in-soccer-stadium-ready-for-game-in-the-picture-id1320104418?b=1&k=20&m=1320104418&s=170667a&w=0&h=-INWYfpOlMFID5L8LlOCgoZo1AblGc8Ebi49xG6JkIw=");
    }

    .module.parallax-1 .overlay {
      height: 100%;
      text-align: center;
    }

    .module.parallax-1 .overlay .inner {
      margin: auto;
      max-width: 900px;
      padding: 50px;
      width: calc(95% - 90px);
    }

    .module.parallax-1 p {
      color: #fff;
      font-size: 20px;
    }

    .module.parallax-1 {
      color: #fff;
      overflow: hidden;
    }

    .hot-matches {
      display: grid;
      justify-content: center;
      grid-template-columns: 1fr;
      width: 100%;

      .hot-matches-match {
        background-size: 100%;
        color: #555555;
        padding: 50px;
        font-size: 20px;

        .no-matches {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .match-box {
        }
      }
    }

    .hot-slots {
      max-width: $container-width;
      width: 95%;
      margin: 30px auto;

      .plat-item {
        .top-content {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          width: 100%;

          .plat-icon {
            height: 40px;
            margin-bottom: 20px;
          }

          .more-btn {
            font-weight: bold;
            font-size: 20px;
            background-image: linear-gradient(to right, #de4545, #db7e42);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            cursor: pointer;
          }
        }
      }

      .game-container {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 30px;
        margin-bottom: 40px;

        .game-slot {
          box-shadow: rgb(0 0 0 / 24%) 0px 6px 12px 0px;

          border-radius: 20px;
          color: white;
          font-family: sans-serif;
          font-size: 100%;
          font-weight: bold;
          overflow: hidden;
          justify-content: center;
          align-items: center;
          // display: block;
          display: flex;
          height: 150px;

          -webkit-animation: scale 0.5s;
          animation: scale 0.5s;
          -webkit-transform: scale(0, 0);
          transform: scale(0, 0);
          -webkit-animation-fill-mode: forwards;
          animation-fill-mode: forwards;

          img {
            display: block;
            // width: 100%;
            // height: 100%;
            // min-height: 94px;
            transition: all 0.3s ease;
            width: 105%;
            margin-left: -2.5%;
          }

          &:hover {
            img {
              -webkit-transform: scale(1.2, 1.2);
              transform: scale(1.2, 1.2);
            }
          }

          transition: all 0.3s ease-in;
          cursor: pointer;
          position: relative;

          .slot-name {
            position: absolute;
            opacity: 0;
            font-size: 15px;
            line-height: 15px;
            text-align: center;
            bottom: 0;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.3) 10%, transparent);
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            transform: translate(0, 50px);

            .slide {
              padding: 10px;
              word-break: break-word;
              display: block;
            }
          }

          &:before {
            position: absolute;
            top: 0;
            left: -85%;
            z-index: 2;
            display: block;
            content: "";
            width: 50%;
            height: 100%;
            background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%);
            background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%);
            -webkit-transform: skewX(-25deg);
            transform: skewX(-25deg);
          }

          @-webkit-keyframes shine {
            100% {
              left: 125%;
            }
          }
          @keyframes shine {
            100% {
              left: 125%;
            }
          }

          &:hover {
            &:before {
              -webkit-animation: shine 2s;
              animation: shine 2s;
            }

            .slot-name {
              opacity: 1;
              transform: translate(0px, 0px);
            }
          }
        }
      }
    }

    .trending-matches {
      display: grid;
      justify-content: center;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      position: relative;
      overflow: hidden;
      margin: 50px;
      gap: 30px;
      max-width: $container-width;
      width: 95%;
      margin: 50px auto;

      .trending-match {
        border-radius: 20px;

        .overlay {
          background: rgba(20, 20, 20, 0.9);
          width: 100%;
          height: 100%;
          position: absolute;
          opacity: 0;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;

          .play {
            width: unset;
            height: 30%;
            max-height: 70px;
          }

          .gamename {
            font-size: 20px;
            padding-bottom: 10px;
          }

          img {
            display: block;
            text-align: center;
            margin: 0 auto;
            max-width: unset;
            max-height: 30%;
            width: auto;
            transform: none;
          }
        }

        background: #434343;
        overflow: hidden;

        img {
          width: 105%;
          margin: -4%;
          display: block;
          transform: scale(1.2);
          transition: all 0.3s ease-in;
        }

        &:hover {
          .overlay {
            opacity: 1;
          }

          img {
            transform: scale(1);
          }
        }
      }
    }
  }
}

:deep(.el-dialog) {
  border-radius: 15px;
}

:deep(.el-dialog__header) {
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // background: url(../assets/images/promotion/register/header.png);
  // background-size: cover;
  // background-repeat: no-repeat;
  // padding: 10px;
  // margin: 0;
  // position: relative;
  padding: 0;
}

.header-text {
  text-align: center;
  color: #fff;
  font-family: Poppins;
  line-height: normal;

  .title {
    font-size: 1.625rem;
    font-weight: 600;
  }

  .desc-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;

    .desc {
      font-size: 1.25rem;
      font-weight: 500;
    }

    img {
      width: 1rem;
    }
  }
}

.header-close-btn {
  position: absolute;
  right: -15px;
  top: -15px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  background: #bfbfbf;
  color: #283853;
  z-index: 2;
}

:deep(.el-dialog__body) {
  padding: 0;
  position: relative;
}

.body-content {
  position: relative;

  .bg-img-wrapper {
    width: 100%;
    overflow: visible;
    &__account-present {
      background: url(../assets/images/welcome/top-bg.png) no-repeat center center;
      background-size: cover;
      text-align: center;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      flex-direction: column;
      gap: 10px;
      border-radius: 15px 15px 0 0;
    }
    &__account-congrats {
      font-size: 26px;
    }
    &__account-success {
      font-size: 20px;
    }
  }
  .bg-content-wrapper {
    background: url(../assets/images/welcome/bottom-bg.png) no-repeat center center;
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
        background: url(../assets/images/welcome/account-bg.png) no-repeat center center;
        background-size: cover;
        height: 350px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #ffffff;

        padding-right: 70px;
        gap: 30px;
        padding-bottom: 30px;
      }
      &__account-buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 30px;
        margin: 70px auto 0;

        .deposit-btn {
          background: url(../assets/images/welcome/depositbtn.png) no-repeat center center;
          padding: 10px 50px;
          color: #ffffff;
          background-size: cover;
          font-size: 24px;
          cursor: pointer;
        }
        .back-to-p4w-btn {
          background: url(../assets/images/welcome/p4wbtn.png) no-repeat center center;
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
      bottom: 100px;
      left: 50%;
    }
  }
}

.bonus-text-wrapper {
  position: absolute;
  bottom: 50%;
  right: 12%;
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
  position: relative;

  .get-btn {
    background: url(../assets/images/promotion/register/get_btn.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 200px;
    height: 50px;
    border: 0;
    color: #fff;
    text-align: center;
    font-family: Poppins;
    font-size: 1.25rem;
    font-weight: 600;
    position: absolute;
    bottom: 40px;
    right: 12.5%;
    //right: 20%;
    //transform: translate(-50%, 0);

    &.greyscale {
      filter: grayscale(1);
    }
  }

  .get-btn-deco {
    background: url(../assets/images/promotion/register/get_btn_effect.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 50px;
    height: 50px;
    position: absolute;
    bottom: 27.5px;
    right: 12%;
  }
}

@media (max-width: 1050px) {
  .bonus-text-wrapper {
    font-size: 3.4vw;
  }
}

@media (max-width: 767px) {
  .main-container {
    .main-wrapper {
      .centername {
        margin: 20px auto;
      }

      .top-container-wrapper {
        .top-container {
          .banner-slider {
            .banner-container {
              .promo-bg {
                &.isDesktop {
                  display: none;
                }

                &.isMobile {
                  display: block;
                }
              }
            }
          }
        }
      }

      .esports .esport-wrapper {
        flex-direction: column;
      }

      .sports {
        margin: 0;
        min-height: unset;
      }

      .hot-slots {
        .plat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 95%;
          margin: 0 auto;

          .game-container {
            grid-template-columns: repeat(2, 1fr);
            margin: 10px auto 40px;
            gap: 20px;

            .game-slot {
              max-height: 25vw;

              .slot-name {
                opacity: 1;
                transform: translate(0px, 0px);
              }

              img {
                opacity: 0.8;
              }
            }
          }
        }
      }

      .trending-matches {
        grid-template-columns: repeat(2, 1fr);
        margin: 10px auto 40px;
        gap: 10px;
      }
    }
  }
}
</style>

<style scoped lang="scss" data-alt="tabs">
.og-tabs {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  margin-block: 1rem;
  overflow: auto;
  gap: 0.6rem;

  @media (max-width: 767px) {
    gap: 0.3em;
  }

  .game-tab {
    position: relative;
    cursor: pointer;
    transition: 0.3s all;
    aspect-ratio: 166/75;
    border-radius: 15px;
    // background-image: url("../assets/images/common/bghometabs.png");
    background-size: cover;

    img {
      position: absolute;
      right: 0px;
      top: 50%;
      aspect-ratio: 1/1;
      object-fit: contain;
      transform: translate(0%, -50%);
      bottom: 10px;
      max-width: 50%;
    }

    &:hover {
      transform: translate(0px, -3px);
    }

    > span {
      transition: all 0.3s ease-in-out;
      position: absolute;
      font-weight: 500;
      font-size: 18px;
      line-height: 137.19%;
      letter-spacing: 0.06em;
      left: 10px;
      top: 50%;
      margin-top: -15px;
      text-transform: uppercase;
      color: #000;
    }
  }

  & > * {
  }
}
.center-content {
  background-size: cover;
  overflow: hidden;
  .jackpot {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    // background: url(../assets/images/games/jackpot-w.png) no-repeat center center;
    background-size: contain;
    mix-blend-mode: darken;
    width: 90%;
    margin: 0 auto;
    .numbers {
      font-family: "Arial Black";
      font-size: 2.5vw;
      padding-top: 1.5vw;
      padding-left: 1vw;
      font-weight: 900;
      line-height: 52px;
      letter-spacing: 0em;
      text-align: left;
      color: #ffe500;
      height: 20vw;
      min-height: 200px;
      max-height: 400px;
      display: flex;
      justify-content: center;
      align-items: center;

      text-shadow: 3px 3px #845f00;
    }
    img {
      width: 100%;
      mix-blend-mode: plus-lighter;
    }
  }

  .section-wrapper {
    margin-bottom: 20px;

    .section-wrapper-content {
      display: flex;
      align-items: center;
      gap: 16px;
      overflow: auto;
      padding-bottom: 16px;

      img {
        max-width: 230px;
        max-height: 280px;
      }

      &.wide {
        img {
          max-width: 520px;
        }
      }
    }
  }
}
.og-tab-content {
  margin: 1rem auto;
  padding: 25px;
  width: 90%;
  /* background: #434343; */
  box-shadow: 0px 2px 10px 0px #ffffff inset;
  box-shadow: 0px 0px 17.600000381469727px 0px #ffffff inset;
  box-shadow: 0px 4px 10px 0px #0000001a;
  background: linear-gradient(0deg, #ecf5ff, #ecf5ff), linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
  border-radius: 20px;
  border: 1px solid #ffffff;

  .hot-game-header {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 2.4rem;
    line-height: 42px;
    margin: 0;
    padding-bottom: 20px;
  }

  .hot-games-section {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    gap: 30px;

    img {
      width: 192px;
      height: 244.5px;
      border-radius: 10px;
    }
  }
  .og-tab-content-header {
    display: flex;
    align-items: flex-end;
    gap: 2rem;
    padding-bottom: 2em;

    @media (max-width: 767px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
    }
  }

  h2 {
    font-size: 3rem;
    margin: 0;
    line-height: 1;

    @media (max-width: 767px) {
      margin-bottom: 0.3em;
    }
  }

  .og-tab-content-header-sub {
    display: flex;
    gap: 1.25rem;
    overflow: auto;
    flex: 1 1 auto;

    @media (max-width: 767px) {
      width: 100%;
      gap: 1em;
      margin-bottom: 1.25rem;
    }

    & > * {
      padding: 1em;
      border-radius: 4px;
      min-width: 80px;
      background: transparent;
      &.og-btn {
        img {
          max-height: 25px;
        }
      }
    }
  }

  a {
    color: inherit;
    font-size: 1rem;
  }
}

.og-tab-content-body {
  gap: 3rem 1.5rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);

  @media (max-width: 767px) {
    gap: 1.5rem 1rem;
    grid-template-columns: repeat(2, 1fr);
  }

  & > div {
    text-align: center;
    cursor: pointer;
  }

  .og-content-thumb {
    // aspect-ratio: 2/3;
    max-width: 240px;
    margin-inline: auto;
    transform: scale(1);
    border-radius: 4px;

    transition: all 0.3s;
    overflow: hidden;

    img {
      display: block;
      width: 100%;
    }
  }

  & > div:hover {
    .og-content-thumb {
      transform: scale(1.1);
    }
  }
}

.og-btn-active {
  position: relative;
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 39px;
    border-radius: 1px;
    height: 2px;
    background: #3981ff;
  }
}
.ribbonbar {
  background: url(../assets/images/index/ribbon.png) no-repeat center center;
  background-size: cover;
  display: flex;
  gap: 4vw;
  justify-content: center;
  height: 10vw;
  align-items: center;
  margin-bottom: 50px;
  padding-left: 150px;
  width: 100%;
  .rib {
    display: flex;
    gap: 10px;
    padding: 20px 0;
    font-size: 0.8rem;
    justify-content: center;
    align-items: center;
    .rib-left {
      width: 65px;
      height: 65px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
    }
    .rib-center {
      display: flex;
      flex-direction: column;
      color: #ffffff99;
      .rib-number {
        font-family: "Poppins Regular";
      }
      .rib-title {
        font-family: "Poppins Medium";
      }
    }
    .rib-right {
      font-family: "Poppins Bold";
      display: flex;
      flex-direction: column;
      gap: 5px;
      .rib-tag {
        background: #ffa800;
        border-radius: 4px;
        color: #ffffff;
        font-size: 0.6rem;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2px 5px;
      }
      .rib-plus {
        font-size: 0.8rem;
        color: #ffffff;
      }
    }
  }
}
.ant-btn-round {
  height: 48px;
  font-size: 18px;
}

.dark-theme {
  .og-tab-content {
    background: unset;
    border: none;
    box-shadow: none;
    .og-tab-content-header-sub > * {
      background: transparent;
      &.og-btn {
        img {
          max-height: 25px;
        }
      }
      &.og-btn-active {
        background: linear-gradient(90deg, rgba(57, 129, 255, 0.2) 0%, rgba(20, 29, 38, 0.2) 100%);
      }
    }
  }

  .center-content {
    background: url(../assets/images/index/centerbg.png) no-repeat center top;
    background-size: cover;
    overflow: hidden;
    .jackpot {
      mix-blend-mode: exclusion;
      // background-image: url(../assets/images/games/jackpot.png);
      img {
        width: 100%;
        mix-blend-mode: plus-lighter;
      }
    }
  }
}
.grid-wrapper {
  overflow: hidden;
}

.grid {
  display: flex;
  margin: 0px auto 0px;
  align-items: flex-start;
  column-gap: 8px;
  row-gap: 14px;
  width: calc(100% - 40px);
  background: #1976d2;
  padding: 6px 12px 6px;
  border-radius: 12px;
  overflow-x: auto;

  @media (min-width: 769px) {
    margin: 10px auto;
  }

  .game-board-item {
    border-radius: 8px;
    width: auto;
    gap: 5px;
    height: 100%;
    margin: auto;
    display: flex;
    align-items: center;
    text-align: center;
    padding: 4px 16px;
    white-space: nowrap;
    cursor: pointer;

    &.active-board {
      // background: $linear-bg-4;
      color: #fff;
      border-radius: 6px;
      font-weight: bold;
      background: linear-gradient(144.11deg, #4183d3 29.63%, #8ec1f7 96.04%);
    }

    &:hover {
      filter: brightness(0.88);
    }

    &:active {
      opacity: 0.95;
    }

    span {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.85);
      padding: 10px 15px;
      text-transform: capitalize;
    }

    img {
      width: auto;
      max-height: 30px;
    }
  }
}
</style>
