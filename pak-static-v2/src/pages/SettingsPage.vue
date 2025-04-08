<template>
  <ProfileSummary :homeProfile="true" />

  <q-page>
    <div class="top-setting-section">
      <div class="top-total-score">
        <div class="score-txt">{{ $t("settings.totalScore") }}</div>
        <div class="score-amount">{{ store.balance.toFixed(2) }}</div>
      </div>
      <div class="top-section-inner">
        <router-link to="/withdraw">
          <div class="acct-nav-item">
            <img src="../assets/images/account/withdraw-svg.svg" />
          </div>
          <div class="acct-nav-label">{{ $t("settings.withdraw") }}</div>
        </router-link>
        <router-link to="/deposit">
          <div class="acct-nav-item">
            <img src="../assets/images/account/deposit-svg.svg" />
          </div>
          <div class="acct-nav-label">{{ $t("settings.deposit") }}</div>
        </router-link>
        <router-link to="/promo">
          <div class="acct-nav-item">
            <img src="../assets/images/account/promo-svg.svg" />
          </div>
          <div class="acct-nav-label">{{ $t("settings.promo") }}</div>
        </router-link>
        <!-- <router-link to="/interest-profit">
          <div class="acct-nav-item">
            <img src="../assets/images/account/interest-svg.svg" />
          </div>
          <div class="acct-nav-label">{{ $t("settings.interestProfit") }}</div>
        </router-link> -->
      </div>
    </div>

    <div class="mid-setting-section">
      <div class="acct-nav">
        <h2>{{ $t("settings.otherServices") }}</h2>
        <div class="acct-menu" id="id-acct-menu">
          <router-link to="/account/profile">
            <div class="acct-nav-item">
              <img src="../assets/images/account/personal-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.personalCentre") }}</div>
          </router-link>
          <router-link to="/account/record">
            <div class="acct-nav-item">
              <img src="../assets/images/account/record-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.record") }}</div>
          </router-link>
          <router-link to="/account/discount">
            <div class="acct-nav-item">
              <img src="../assets/images/account/discount-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.discount") }}</div>
          </router-link>
          <router-link to="/account/bank">
            <div class="acct-nav-item">
              <img src="../assets/images/account/bank-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.bank") }}</div>
          </router-link>
          <router-link to="/account/order">
            <div class="acct-nav-item">
              <img src="../assets/images/account/order-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.order") }}</div>
          </router-link>
          <router-link to="/account/message">
            <div class="acct-nav-item">
              <img src="../assets/images/account/message-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.message") }}</div>
          </router-link>
          <router-link to="/account/feedback">
            <div class="acct-nav-item">
              <img src="../assets/images/account/feedback-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.feedback") }}</div>
          </router-link>
          <router-link to="/vip">
            <div class="acct-nav-item">
              <img src="../assets/images/account/vip-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.vip") }}</div>
          </router-link>
        </div>
      </div>

      <q-card class="card-account-banner" v-if="btm_banners.length > 0">
        <q-card-section>
          <q-carousel
            class="account"
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
              v-for="(banner, i) in btm_banners"
              :key="i"
              :name="i"
              class="column no-wrap flex-center"
              :img-src="imgURL + (banner.mobileImageUrlDark ?? banner.mobileImageUrl)"
              @click="router.push('/earn-money')"
            ></q-carousel-slide>
          </q-carousel>
        </q-card-section>
      </q-card>

      <a @click="openConfirmSignOutDialog">
        <div class="acct-logout">
          <div class="acct-nav-label">{{ $t("settings.logout") }}</div>
        </div>
      </a>
    </div>
  </q-page>

  <q-dialog width="100%" v-model="confirmSignOutDialog" presistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("btn.signOut") }}</div>

        <div class="txt-content q-mt-md text-center">{{ $t("notify.signOutMessage") }}</div>

        <div class="q-mt-lg q-pl-lg q-pr-lg y-n-container">
          <q-btn :label="$t('btn.cancel')" no-caps class="btn-cancel" v-close-popup unelevated />
          <q-btn :label="$t('btn.confirm')" no-caps class="btn-confirm" @click="logout" />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { onActivated, ref } from "vue";
import { userStore } from "src/stores";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import ProfileSummary from "../components/ProfileSummary.vue";
import { api } from "boot/axios";

const store = userStore();
const router = useRouter();
const qs = require("qs");
const $q = useQuasar();

const slide = ref(0);
const imgURL = process.env.IMAGE_CDN + "/promo/";
const btm_banners = ref([]);
const getPromoImage = () => {
  api
    .get("/opt-session/promo/banner?category=CENTERPROMO")
    .then((res) => {
      if (res.code === 0) {
        btm_banners.value = res.data;
        // if (btm_banners.value.length === 1) {
        //   btm_banners.value.push(res.data[0]);
        // }
      }
    })
    .catch(() => {});
};

const loadingLogout = ref(false);

const confirmSignOutDialog = ref(false);
const openConfirmSignOutDialog = () => {
  confirmSignOutDialog.value = !confirmSignOutDialog.value;
};

onActivated(() => {
  store.getUnreadTotal();
  getPromoImage();
});

const logout = () => {
  loadingLogout.value = true;

  $q.loading.show({
    message: "Logging out..."
  });

  store.memberLogout().then(() => {
    loadingLogout.value = false;
    router.push("/home");
  });
};
</script>

<style scoped lang="scss">
.top-setting-section {
  position: relative;

  margin: 20px;

  .top-total-score {
    background: linear-gradient(180deg, #3080f4 11.43%, #70b1ff 95.71%);
    padding: 20px 12px 30px;
    margin: 0 20px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;

    .score-txt {
    }
    .score-amount {
      font-weight: bold;
      font-size: 20px;

      &:before {
        content: "RS";
        font-size: 14px;
        margin-right: 4px;
      }
    }
  }

  .top-section-inner {
    // background: #002b8296;
    border-radius: 4px;
    width: 100%;
    margin: -20px auto 0px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(1, 1fr);
    grid-gap: 30px;
    gap: 10px;
    row-gap: 20px;
    height: auto;
    margin-bottom: 10px;
    backdrop-filter: blur(4px);
    background-color: rgb(55 95 172 / 74%);

    a {
      text-decoration: none;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      text-align: center;
      align-items: center;
      justify-content: flex-start;
      margin: 0 auto;
      border-radius: 8px;
      padding: 8px;

      &:active {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
      }

      .acct-nav-label {
        color: #fff;
        font-size: 14px;
        white-space: normal;

        @media (max-width: 400px) {
          font-size: 12px;
        }
      }

      .acct-nav-item {
        border-radius: 50%;
        aspect-ratio: 1/1;
        padding: 8px;
        height: 50px;
        width: 70px;
        cursor: pointer;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        color: #000;
        text-decoration: none;

        @media (max-width: 400px) {
          width: auto;
          padding: 0;
        }

        img {
          width: 70%;
          fill: white;
          padding: 0;
        }
      }
    }
  }
}

.mid-setting-section {
  position: relative;

  h2 {
    line-height: 26px;
    color: #424f72;
    font-size: 20px;
    // width: calc(330px + 100px);
    text-transform: uppercase;

    font-family: "Poppins";
    font-size: 20px;
    font-weight: 700;
    line-height: 16px;
    letter-spacing: -0.0008em;
  }
}

.acct-nav {
  margin: 20px;

  .acct-title {
    display: flex;
    margin-top: 4px;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    color: #000;
    // .acct-header-icon

    .acct-title-1 {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: bold;
      font-size: 16px;
    }
  }

  .acct-menu {
    padding: 10px;
    background: #002b8296;
    border-radius: 4px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 30px;
    gap: 10px;
    row-gap: 10px;
    height: auto;
    width: 100%;

    &.shorter-menu {
      grid-template-rows: repeat(2, 1fr);
    }

    a {
      text-decoration: none;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      gap: 0px;
      width: 100%;
      text-align: center;
      align-items: center;
      justify-content: flex-start;
      margin: 0 auto;

      &:active {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
      }

      .acct-nav-label {
        color: #fff;
        font-size: 14px;
        white-space: normal;
      }

      .acct-nav-item {
        // background-color: #b9c8ff26;
        border-radius: 50%;
        aspect-ratio: 1/1;
        padding: 5px;
        height: 56px;
        width: 56px;
        cursor: pointer;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        color: #000;
        text-decoration: none;

        img {
          width: 90%;
          fill: white;
          padding: 0;
        }
      }
    }
  }
}

.card-account-banner {
  width: calc(95% - 20px);
  margin: 0px auto 10px;
  border-radius: 10px 10px 0px 0px;
  border-color: transparent;
  box-shadow: none;

  .account-banner-img {
    width: 100%;
    border-radius: 10px 10px 0px 0px;
  }
}

.acct-logout {
  height: 60px;
  background: linear-gradient(180deg, rgba(115, 178, 255, 0.1) 0%, rgba(57, 129, 255, 0.1) 100%);
  // background-image: url("../assets/images/account/logout-btn.png");
  // background-repeat: no-repeat;
  width: calc(95% - 20px);
  margin: 20px auto;
  // aspect-ratio: 335/40;
  // background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .acct-nav-label {
    color: #424f72cc;
    font-size: 16px;
  }

  &:active {
    filter: brightness(1.2);
    transform: translate(0px, 1px);
  }
}

.btn-cancel {
  // background: radial-gradient(68.92% 68.92% at 50% 50%, #1d341d 0%, #466a45 100%);
  font-weight: 700;
  // border: 1px solid #1baa99;
  border-radius: 12px;
  width: 140px;
  height: 42px;
  box-shadow: 0px 2px 4.58px 0px #bbdcff inset, 0px -1px 3.66px 0px #a2bff4 inset;
  color: #424f72;
}
.btn-confirm {
  background: $linear-bg;
  // border: 1px solid #5d8956;
  font-weight: 700;
  width: 140px;
  height: 42px;
  color: #fff;
  border-radius: 12px;
}
</style>

<style lang="scss">
// .q-page-container {
//   padding-bottom: 20px !important;
// }

.q-page {
  min-height: 0 !important;
}
</style>
