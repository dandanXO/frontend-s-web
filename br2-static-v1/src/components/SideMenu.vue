<template>
  <!-- <ProfileSummary :homeProfile="true" /> -->
  <div class="left-side-menu" :class="{ fullHeight: !topDownload }" @click.stop>
    <div class="side-menu-header row items-center justify-between">
      <q-btn class="close-btn" flat dense @click="emits('closeMenu')">
        <q-icon name="close" />
      </q-btn>
      <img src="../assets/logo.svg" />
    </div>

    <div class="side-menu-account-info row items-center justify-between divider">
      <template v-if="store.token">
        <div class="side-menu-account-info__balance-wrapper">
          <img src="../assets/images/sideMenu/icon-balance.png" />
          <div class="side-menu-account-info__balance-inner" @click="refreshBalance()">
            <span class="side-menu-account-info__balance-amount">
              {{
                isLoadingBalance ? "Loading..." : store.currency.value + " " + convertToCommaAmount(store.balance, true)
              }}
            </span>
            <span class="side-menu-account-info__balance-desc">
              {{ $t("sideNav.balance") }}
            </span>
          </div>
        </div>
        <router-link :to="`/deposit?from=${$route.path}`">
          <q-btn class="deposit-btn" no-caps>
            {{ $t("btn.deposit") }}
          </q-btn>
        </router-link>
      </template>
      <template v-else>
        <q-btn class="btn-style-butter col-grow" no-caps @click="ui.loginView = 'login'">
          {{ $t("header.login") }}
        </q-btn>
        <!-- <q-btn class="btn-style-pear" no-caps @click="router.push('/register')">{{ $t("header.register") }}</q-btn> -->
        <q-btn class="btn-style-pear col-grow reg-bonus-flag-btn" no-caps @click="ui.loginView = 'register'">
          {{ $t("header.register") }}
        </q-btn>
      </template>
    </div>

    <div class="side-menu-plat-link-wrapper divider">
      <div
        v-for="(link, index) in categoryList"
        :key="index"
        class="side-menu-plat-link"
        @click="emits('gameClick', link.code)"
      >
        <img :src="require(`../assets/images/index/category/cat-${link.icon}.png`)" />
        <span>{{ link.name }}</span>
      </div>
    </div>

    <div class="side-menu-promo-wrapper divider">
      <router-link to="">
        <div class="jackpot-container">
          <img src="../assets/images/sideMenu/jackpot-icon-1.png" alt="jackpot icon" class="jackpot-icon" />
          <div class="jackpot-text">
            <div class="jackpot-amount">{{ store.currency.value }} {{ convertToCommaAmount(ui.jackpotAmt) }}</div>
            <div class="jackpot-label">JACKPOT</div>
          </div>
        </div>
        <!--        <img class="jackpot-promo" src="../assets/images/sideMenu/jackpot-promo.png" />-->
      </router-link>
      <div class="side-menu-promo-hot-game" @click="emits('gameClick')">
        <div class="side-menu-promo-hot-game__title">
          <img src="../assets/images/index/category/cat-hot.png" />
          <span>{{ $t("home.menu_hot") }}</span>
        </div>
        <div class="side-menu-promo-hot-game__desc">
          {{ $t("sideNav.showing16Of100Games") }}
        </div>
        <div class="side-menu-promo-hot-game__game-list">
          <img
            v-for="index in 4"
            :key="index"
            :src="require(`../assets/images/sideMenu/games/hot-game-${index}.png`)"
          />
        </div>
      </div>

      <!-- TODO:: HIDE it 1st-->
      <!--      <div class="side-menu-promo-download-wrapper">-->
      <!--        <q-btn class="side-menu-promo-download-item" no-caps flat>-->
      <!--          <img src="../assets/images/sideMenu/icon-android.png" />-->
      <!--          <span>android</span>-->
      <!--        </q-btn>-->
      <!--      </div>-->
    </div>

    <!--    <div class="side-menu-social-media-wrapper">-->
    <!--      <a-->
    <!--        v-for="(link, index) in socialMediaLinks"-->
    <!--        :key="index"-->
    <!--        class="side-menu-social-media-item"-->
    <!--        @click="goToLink(link.url)"-->
    <!--        target="_blank"-->
    <!--      >-->
    <!--        <img :src="require(`../assets/images/sideMenu/socialMedia/icon-${link.icon}.png`)" />-->
    <!--      </a>-->
    <!--    </div>-->
  </div>
</template>
<script setup>
import { defineEmits, inject, ref } from "vue";
import { convertToCommaAmount, isAndroid } from "boot/utils";
import { useRouter } from "vue-router";
import ProfileSummary from "../components/ProfileSummary.vue";
import { useUI } from "stores/ui";
import { userStore } from "src/stores";

const emits = defineEmits(["closeMenu", "goLogin", "gameClick"]);

const router = useRouter();
const ui = useUI();
const store = userStore();
const topDownload = inject("topDownload");

const categoryList = [
  { icon: "hot", name: "HOT", url: "" },
  { icon: "pg", name: "PG", url: "", code: "PGF" },
  { icon: "wcots", name: "One Touch", url: "", code: "WCOTS" },
  { icon: "tfgaming", name: "TFGaming", url: "", code: "TFGaming" },
  { icon: "jdb", name: "JDB", url: "", code: "JDB" },
  { icon: "wcrt", name: "Red tiger", url: "", code: "WCRT" }
];

const socialMediaLinks = [
  { icon: "telegram", url: "" },
  { icon: "tiktok", url: "" },
  { icon: "messenger", url: "" },
  { icon: "whatsapp", url: "" },
  { icon: "facebook", url: "" },
  { icon: "line", url: "" },
  { icon: "instagram", url: "" },
  { icon: "viber", url: "" },
  { icon: "youtube", url: "" },
  { icon: "x", url: "" }
];

const isLoadingBalance = ref(false);
const refreshBalance = () => {
  if (store.token) {
    isLoadingBalance.value = true;
    store.getBalance().then((res) => {
      isLoadingBalance.value = false;
    });
  }
};

const activateSlide = (item) => {
  emits("closeMenu");
  router.push(`/home#${item}`);
  console.log(item);
};
const openCSInNewTab = (url) => {
  const absoluteUrl = url;
  window.open(absoluteUrl, "_blank");
};
const goToLink = (url) => {
  //TODO: NO PUT 1st
  // window.open(url, "_blank");
};
</script>
<style lang="scss" scoped>
.menu-open {
  @supports (height: 100dvh) {
    .left-side-menu {
      height: calc(100dvh - 70px); /* modern browsers */

      &.fullHeight {
        height: 100dvh; /* modern browsers */
      }
    }
  }

  .left-side-menu {
    width: 100%;
    padding-top: 18px;
    height: calc(100vh - 70px);
    background: #131313;
    display: flex;
    flex-direction: column;
    padding-left: 16px;
    padding-right: 16px;
    transition: 0.3s all;
    overflow-y: auto;
    max-width: 500px;
    margin: 0 auto;

    &.fullHeight {
      height: 100vh;
    }

    // gap: 12px;
    // :not(:last-child) {
    //   margin-bottom: 12px;
    // }

    .side-menu-header {
      margin-bottom: 25px;

      .close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #2e3732;
        border-radius: 6px;
      }
    }

    .side-menu-account-info {
      gap: 18px;
      margin-bottom: 12px;

      > button {
        flex: 1;
      }

      .side-menu-account-info__balance-wrapper {
        display: flex;
        align-items: center;

        img {
          margin-right: 8px;
          width: 100%;
          max-width: 46px;
        }

        .side-menu-account-info__balance-inner {
          display: flex;
          flex-direction: column;
          text-shadow: 0px 0px 7.22px #90e56b;

          .side-menu-account-info__balance-amount {
            font-size: 16px;
            font-weight: 700;
            color: #fff;
          }

          .side-menu-account-info__balance-desc {
            background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
            background-clip: text;
            font-size: 10px;
            color: transparent;
          }
        }
      }

      .deposit-btn {
        border-radius: 4px;
        background: linear-gradient(90deg, #4fffa5 0%, #10d16f 100%);
        padding: 6px 9px;
        font-size: 12px;
        font-weight: 700;
        color: #2d2d2d;
      }
    }

    .divider {
      &::after {
        content: "";
        display: block;
        height: 1px;
        width: 100%;
        background-color: #414141;
      }
    }

    .side-menu-plat-link-wrapper {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;

      .side-menu-plat-link {
        display: flex;
        padding: 10px;
        border-radius: 6px;
        margin-bottom: 5px;
        font-size: 14px;
        color: #ffffffb2;
        text-decoration: none;
        transition: background 0.3s ease;

        &:active {
          background: #ffffff33;
        }

        :first-child {
          margin-right: 14px;
        }

        img {
          max-width: 20px;
        }
      }
    }

    .side-menu-promo-wrapper {
      a {
        text-decoration: none;
      }
      .jackpot-container {
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: #0d0d0d; /* 背景可选 */
        padding: 0px 10px 10px;
        margin-bottom: 8px;
      }

      .jackpot-icon {
        width: 40px;
        height: 40px;
      }

      .jackpot-text {
        display: flex;
        flex-direction: column;
        color: #ccffcc;
        font-family: Arial, sans-serif;
      }

      .jackpot-amount {
        font-size: 20px;
        font-weight: bold;
        color: #c0ffb7;
        text-shadow: 0 0 3px #9fff9f, 0 0 2px #9fff9f;
      }

      .jackpot-label {
        font-size: 12px;
        color: #66ff99;
        margin-top: 2px;
        text-transform: uppercase;
      }

      .side-menu-promo-hot-game {
        background-color: #1f2420;
        border: 1px solid #ffffff33;
        border-radius: 8px;
        padding: 8px 10px;
        margin-bottom: 18px;

        .side-menu-promo-hot-game__title {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          font-size: 14px;
          font-weight: 500;

          img {
            width: 20px;
          }
        }
        .side-menu-promo-hot-game__desc {
          margin-bottom: 18px;
          font-size: 12px;
          font-weight: 300;
          color: #827e75;
        }

        .side-menu-promo-hot-game__game-list {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          img {
            max-width: 100%;
            border-radius: 5px;
          }
        }
      }

      .side-menu-promo-download-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-bottom: 20px;
        gap: 23px;

        .side-menu-promo-download-item {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          padding: 7px 0;
          max-width: 98px;
          background: linear-gradient(#404040, #404040) padding-box,
            linear-gradient(360deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 100%) border-box;
          border: 0.5px solid transparent;
          border-radius: 6px;

          img {
            margin-right: 8px;
            max-width: 17px;
          }
        }
      }
    }

    .side-menu-social-media-wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
      flex-wrap: wrap;
      margin: 20px 0;

      .side-menu-social-media-item {
        display: flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 1;
        background: #4b49434d;
        border-radius: 50%;
        padding: 8px;

        &:active {
          filter: brightness(1.2);
          transform: translate(0px, 1px);
        }

        img {
          max-width: 24px;
        }
      }
    }
  }
}
</style>
