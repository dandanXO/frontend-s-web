<template>
  <div class="navigations">
    <template v-for="nav in navigations" :key="nav.name">
      <template v-if="!nav.hasicon">
        <div class="header-menu-item">
          <a @mouseover="showSubMenu(nav)" @mouseup="selectedMenu = ''" @click="goPath(nav.path, $event)">
            <template v-if="route.name === nav.code || route.name === nav.enName.toLowerCase()">
              <img class="menu-icon" :src="nav.iconActive" :alt="nav.code" />
              <h2 class="nav-title active">{{ nav.name }}</h2>
            </template>
            <template v-else>
              <img class="menu-icon" :src="nav.icon" :alt="nav.code" />
              <h2 class="nav-title">{{ nav.name }}</h2>
            </template>
          </a>
        </div>
      </template>
    </template>
  </div>

  <div class="navigations second-nav" @mouseleave="selectedMenu = ''">
    <template v-for="nav in navigations" :key="nav.name">
      <template v-if="nav.hasicon">
        <div class="header-menu-item">
          <router-link @mouseover="showSubMenu(nav)" @mouseup="selectedMenu = ''" :to="nav.path">
            <span>
              <img
                class="hover-icon"
                src="../../../assets/images/home/header-promo-icon.svg"
                alt="promotion"
                v-if="nav.code === 'Promotion'"
              />
              <img
                class="hover-icon"
                src="../../../assets/images/home/header-affiliate-icon.svg"
                alt="affiliate"
                v-if="nav.code === 'Agent'"
              />
              <img
                class="hover-icon"
                src="../../../assets/images/home/header-download-icon.svg"
                alt="download TF88 app"
                v-if="nav.code === 'App'"
              />
              <img
                class="hover-icon"
                src="../../../assets/images/home/header-vip-icon.svg"
                alt="vip"
                v-if="nav.code === 'VIP'"
              />
            </span>
            <span>{{ nav.name }}</span>
          </router-link>
        </div>
      </template>
    </template>

    <div @mousetouch="selectedMenu = ''" class="sub-menu" :style="'height:' + height + 'px;'">
      <GameMenu ref="el" v-if="selectedMenu === 'slot'" @load-modal="openGame" />
      <LiveCasinoMenu ref="el" v-if="selectedMenu === 'live'" @load-modal="openGame" />
      <EsportsMenu ref="el" v-if="selectedMenu === 'esports'" @load-modal="openGame" />
      <SportsMenu ref="el" v-if="selectedMenu === 'sports'" @load-modal="openGame" />
      <LotteryMenu ref="el" v-if="selectedMenu === 'lottery'" @load-modal="openGame" />
      <PokerMenu ref="el" v-if="selectedMenu === 'poker'" @load-modal="openGame" />
      <FishingMenu ref="el" v-if="selectedMenu === 'others'" @load-modal="openGame" />
      <CockfightMenu ref="el" v-if="selectedMenu === 'cockfight'" @load-modal="openGame" />
      <MinigameMenu ref="el" v-if="selectedMenu === 'minigame'" @load-modal="openGame" />
      <PromotionMenu ref="el" v-if="selectedMenu === 'Promotion'" />
      <AppMenu ref="el" v-if="selectedMenu === 'App'" />
    </div>
  </div>

  <GameModal ref="modalGame"></GameModal>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from "vue";
import { useI18n } from "vue-i18n";
import { userStore } from "@/store/index";
import { EDITION } from "@/constant/edition";
import { uiStore } from "@/store/ui";
import { useRoute, useRouter } from "vue-router";
import { useElementSize } from "@vueuse/core";

const GameModal = defineAsyncComponent(() => import("@/components/modal/GameModal"));
const GameMenu = defineAsyncComponent(() => import("@/components/menu/GameMenu.vue"));
const EsportsMenu = defineAsyncComponent(() => import("@/components/menu/EsportsMenu.vue"));
const SportsMenu = defineAsyncComponent(() => import("@/components/menu/SportsMenu.vue"));
const LiveCasinoMenu = defineAsyncComponent(() => import("@/components/menu/LiveCasinoMenu.vue"));
const LotteryMenu = defineAsyncComponent(() => import("@/components/menu/LotteryMenu.vue"));
const PokerMenu = defineAsyncComponent(() => import("@/components/menu/PokerMenu.vue"));
const FishingMenu = defineAsyncComponent(() => import("@/components/menu/FishingMenu.vue"));
const CockfightMenu = defineAsyncComponent(() => import("@/components/menu/CockfightMenu.vue"));
const MinigameMenu = defineAsyncComponent(() => import("@/components/menu/MinigameMenu.vue"));
const PromotionMenu = defineAsyncComponent(() => import("@/components/menu/PromotionMenu.vue"));
const AppMenu = defineAsyncComponent(() => import("@/components/menu/AppMenu.vue"));

const modalGame = ref(null);
const el = ref(null);
const { height } = useElementSize(el);
const router = useRouter();
const route = useRoute();
const selectedMenu = ref(false);
const { t } = useI18n();
const store = userStore();
const ui = uiStore();
const navigations = computed(() => {
  let index = -1;
  const fixedNavigationList = [
    {
      code: "home",
      name: t("menu.home"),
      enName: "Home",
      path: "/home",
      role: "NORMAL",
      order: "home",
      iconActive: require("../../../assets/images/home/menu/home-icon-active.png"),
      icon: require("../../../assets/images/home/menu/home-icon.png")
    }
  ];
  const baseNavigationList = [
    {
      code: "sports",
      name: t("menu.sports"),
      enName: "Sports",
      path: "/sports",
      submenu: true,
      role: "NORMAL",
      order: 1,
      iconActive: require("../../../assets/images/home/menu/sports-icon-active.png"),
      icon: require("../../../assets/images/home/menu/sports-icon.png")
    },
    {
      code: "live",
      name: t("menu.liveCasino"),
      enName: "Live",
      path: "/live-casino",
      submenu: true,
      role: "NORMAL",
      order: 2,
      iconActive: require("../../../assets/images/home/menu/live-icon-active.png"),
      icon: require("../../../assets/images/home/menu/live-icon.png")
    },
    {
      code: "slot",
      name: t("menu.slot"),
      enName: "Slots",
      path: "/slot",
      submenu: true,
      role: "NORMAL",
      order: 3,
      iconActive: require("../../../assets/images/home/menu/slot-icon-active.png"),
      icon: require("../../../assets/images/home/menu/slot-icon.png")
    },
    {
      code: "poker",
      name: t("menu.poker"),
      enName: "Poker",
      path: "/poker",
      submenu: true,
      role: "NORMAL",
      order: 4,
      iconActive: require("../../../assets/images/home/menu/poker-icon-active.png"),
      icon: require("../../../assets/images/home/menu/poker-icon.png")
    },
    {
      code: "esports",
      name: t("menu.esports"),
      enName: "Esports",
      path: "/esports",
      submenu: true,
      role: "NORMAL",
      order: 5,
      iconActive: require("../../../assets/images/home/menu/esports-icon-active.png"),
      icon: require("../../../assets/images/home/menu/esports-icon.png")
    },
    {
      code: "lottery",
      name: t("menu.lottery"),
      enName: "Lottery",
      path: "/lottery",
      submenu: true,
      role: "NORMAL",
      order: 6,
      iconActive: require("../../../assets/images/home/menu/lottery-icon-active.png"),
      icon: require("../../../assets/images/home/menu/lottery-icon.png")
    },
    // { code: "cockfight", name: t('menu.cockfight'), enName: "Cock Fight", path: "/cockfight", submenu: true , role: 'NORMAL',order: 7},
    {
      code: "minigame",
      name: t("menu.hashgame"),
      enName: "Hash Game",
      path: "/minigame",
      submenu: true,
      role: "NORMAL",
      order: 8,
      iconActive: require("../../../assets/images/home/menu/minigame-icon-active.png"),
      icon: require("../../../assets/images/home/menu/minigame-icon.png")
    },
    {
      code: "others",
      name: t("menu.others"),
      enName: "Others",
      path: "/others",
      submenu: true,
      role: "NORMAL",
      order: 9,
      iconActive: require("../../../assets/images/home/menu/others-icon-active.png"),
      icon: require("../../../assets/images/home/menu/others-icon.png")
    },
    {
      code: "Promotion",
      name: t("menu.promotion"),
      enName: "Promotion",
      path: "/promotion",
      submenu: false,
      hasicon: true,
      role: "NORMAL",
      order: 10
    },
    {
      code: "Agent",
      name: t("menu.agent"),
      enName: "Agent",
      path: "/affiliate",
      hasicon: true,
      role: "NORMAL",
      order: 11
    },
    {
      code: "App",
      name: t("menu.app"),
      enName: "App",
      path: "/app",
      submenu: false,
      hasicon: true,
      role: "NORMAL",
      order: 12
    },
    { code: "VIP", name: t("menu.vip"), enName: "VIP", path: "/vip", hasicon: true, role: "NORMAL", order: 13 }
  ];
  const filteredNavigationList = baseNavigationList.filter((navigation) => {
    if (store && store.token && store.memberType === "TEST") {
      return true;
    } else {
      if (navigation.role === "TEST") {
        return false;
      } else {
        return true;
      }
    }
  });

  switch (ui.edition) {
    case EDITION.NORMAL:
      break;
    case EDITION.SLOT:
      index = filteredNavigationList.findIndex((navigation) => navigation.code === "slot");
      break;
  }
  if (index > -1) {
    fixedNavigationList.push(filteredNavigationList[index]);
    filteredNavigationList.splice(index, 1);
  }

  return [...fixedNavigationList, ...filteredNavigationList];
});

const showSubMenu = (nav) => {
  if (nav.submenu === true) {
    selectedMenu.value = nav.code;
  } else {
    selectedMenu.value = "";
  }
};

const goPath = (path, element) => {
  const parentElement = element.target.parentNode;
  setTimeout(() => {
    const mouseUpEvent = new MouseEvent("mouseup", {
      bubbles: true,
      cancelable: true,
      view: window
    });
    parentElement.dispatchEvent(mouseUpEvent);
  }, 50);

  router.push(path);
};

const openGame = (gameName, code, gameCode) => {
  modalGame.value.open(gameName, code, gameCode);
};
</script>

<style lang="scss" scoped>
.navigations {
  display: flex;
  justify-content: center;
  align-items: center;
  // width: 750px;
  // padding: 0px 16px;
  gap: 8px;
  text-align: center;
  padding: 0px 5px;
  font-family: "Be Vietnam Pro";

  &.second-nav {
    margin-left: auto;
    margin-right: auto;
    gap: 24px;
  }

  a {
    // padding-top: 10px;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    gap: 2px;
    color: #444444;

    &.icon {
      gap: 0;
    }

    &:hover {
      filter: brightness(0.85);
    }

    .menu-icon {
      width: 68px;
      height: 71px;
    }

    span:first-child {
      color: #000000;
      font-size: 1rem;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    span:last-child {
      text-transform: uppercase;
      font-size: 0.55rem;
      display: flex;
      flex-direction: column;
      white-space: nowrap;
    }

    &:hover,
    &.router-link-active {
      span:first-child {
        color: $link-active;
      }

      span:last-child {
        color: $link-active;
      }

      img.hover-icon {
        filter: brightness(0) invert(41%) sepia(53%) saturate(2002%) hue-rotate(205deg) brightness(107%) contrast(102%);
      }
    }
  }

  .sub-menu {
    transition: all 0.5s ease-in-out;
    background: rgba(239, 242, 245, 0.95);
    box-shadow: 0px -8px 8px 0px #c3d4e6 inset, 0px 4px 0px 0px #a7c2dd;
    backdrop-filter: blur(24.5px);
    overflow: hidden;
    height: 0px;
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    padding-bottom: 10px;

    > div {
      max-width: $maxwidth;
      margin: 0 auto;
      width: 100%;
      flex-wrap: wrap;
    }
  }
}

.header-menu-item {
  position: relative;
  cursor: pointer;

  // display: flex;
  a {
    position: relative;
  }

  .nav-title {
    position: absolute;
    margin: 0px;
    bottom: 17px;
    font-size: 11px;
    line-height: 10px;
    width: 100%;
    padding: 0 6px 0 8px;
    z-index: 2;
    color: #444444;
    letter-spacing: 1px;
    text-align: center;
    font-weight: bold;

    &.active {
      //font-weight: 500;
      color: #fff;
    }
  }
}
</style>
