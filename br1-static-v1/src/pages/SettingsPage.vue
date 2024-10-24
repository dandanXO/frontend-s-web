<template>
  <ProfileSummary :homeProfile="true" />

  <q-page>
    <div class="top-setting-section">
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
      </div>
    </div>

    <div class="mid-setting-section">
      <q-item-section class="acct-nav">
        <h2>{{ $t("settings.otherServices") }}</h2>
        <div class="acct-menu" id="id-acct-menu">
          <router-link to="/account/profile">
            <div class="acct-nav-item">
              <img src="../assets/images/account/personal-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.personalCentre") }}</div>
          </router-link>
          <router-link to="/account/discount">
            <div class="acct-nav-item">
              <img src="../assets/images/account/discount-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.discount") }}</div>
          </router-link>
          <router-link to="/account/record">
            <div class="acct-nav-item">
              <img src="../assets/images/account/record-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.record") }}</div>
          </router-link>
          <router-link to="/account/order">
            <div class="acct-nav-item">
              <img src="../assets/images/account/order-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.order") }}</div>
          </router-link>
          <router-link to="/account/bank">
            <div class="acct-nav-item">
              <img src="../assets/images/account/bank-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.bank") }}</div>
          </router-link>
          <router-link to="/account/message">
            <div class="acct-nav-item">
              <img src="../assets/images/account/message-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.message") }}</div>
          </router-link>
        </div>
      </q-item-section>

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
              :img-src="banner.mobileImageUrl"
              @click="goToPage(banner)"
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
      <q-btn dense rounded icon="close" class="bg-grey-1 text-black popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("btn.signOut") }}</div>

        <div class="txt-content q-mt-md text-center">{{ $t("notify.signOutMessage") }}</div>

        <div class="q-mt-lg q-pl-lg q-pr-lg y-n-container">
          <q-btn :label="$t('btn.cancel')" no-caps class="btn-cancel" v-close-popup />
          <q-btn :label="$t('btn.confirm')" no-caps class="btn-confirm" @click="logout" />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { onActivated, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { userStore } from "src/stores";
import ProfileSummary from "../components/ProfileSummary.vue";

const store = userStore();
const router = useRouter();
const qs = require("qs");
const $q = useQuasar();

const slide = ref(0);
const imgURL = process.env.IMAGE_CDN + "/promo/";
const btm_banners = ref([
  {
    mobileImageUrl: require("../assets/images/account/account-banner-2.png")
  }
]);

const loadingLogout = ref(false);

const confirmSignOutDialog = ref(false);
const openConfirmSignOutDialog = () => {
  confirmSignOutDialog.value = !confirmSignOutDialog.value;
};

onActivated(() => {
  store.getUnreadTotal();
});

onMounted(() => {
  loadBanner();
});

const goToPage = (promo) => {
  if (promo.redirectUrl && promo.redirectUrl !== "0") {
    router.push(promo.redirectUrl);
  }
};

const loadBanner = () => {
  api.get("/opt-session/promo/banner?category=CENTERPROMO").then((response) => {
    if (response.code === 0) {
      response.data.forEach((item) => {
        item.mobileImageUrl = imgURL + item.mobileImageUrl;
      });
      btm_banners.value = response.data;
    }
  });
};

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
  width: 100%;
  position: relative;
  background: linear-gradient(180deg, #8b36f8 0%, #334ad6 100%);
  border-radius: 20px 20px 0px 0px;
  padding: 25px 0px 40px;
  margin-bottom: -30px;

  .top-section-inner {
    width: 95%;
    margin: 0px auto;
    padding: 0px 5px;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(1, 1fr);
    grid-gap: 30px;
    gap: 10px;
    row-gap: 20px;
    height: auto;
    margin-bottom: 10px;

    a {
      text-decoration: none;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      text-align: center;
      width: 100px;
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
      }

      .acct-nav-item {
        border-radius: 50%;
        aspect-ratio: 1/1;
        padding: 12px;
        height: 50px;
        width: 80px;
        cursor: pointer;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        color: #000;
        text-decoration: none;

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
  background-color: #303954;
  width: 100%;
  position: relative;
  border-radius: 20px 20px 0px 0px;
  padding: 20px 0px;

  h2 {
    line-height: 26px;
    color: #fff;
    font-size: 20px;
    margin: 0px 0px 10px 28px;
    // width: calc(330px + 100px);
    text-transform: uppercase;
  }
}

.acct-nav {
  width: 95%;
  margin: 10px auto;
  padding: 5px;
  gap: 10px;

  a {
    padding: 5px;
    display: block;
  }

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
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 30px;
    gap: 10px;
    row-gap: 10px;
    height: auto;
    width: 100%;
    margin-bottom: 0px;

    &.shorter-menu {
      grid-template-rows: repeat(2, 1fr);
    }

    a {
      text-decoration: none;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 8px 3px;
      width: 100px;
      text-align: center;
      align-items: center;
      justify-content: flex-start;
      margin: 0 auto;

      &:active {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
      }

      .acct-nav-label {
        padding-top: 6px;
        color: #ffffff90;
        font-size: 14px;
        white-space: normal;
      }

      .acct-nav-item {
        background-color: #b9c8ff26;
        border-radius: 50%;
        aspect-ratio: 1/1;
        padding: 12px;
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
  background-image: url("../assets/images/account/logout-btn.png");
  background-repeat: no-repeat;
  width: calc(95% - 20px);
  margin: 20px auto;
  aspect-ratio: 335/40;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .acct-nav-label {
    color: rgba(206, 206, 206, 0.8);
    font-size: 16px;
  }

  &:active {
    filter: brightness(1.2);
    transform: translate(0px, 1px);
  }
}

.btn-cancel {
  background: #ffffff20;
  font-weight: 700;
  color: #dcdcdc;
  border: 1px solid #ffffff80;
  border-radius: 8px;
  width: 140px;
  height: 42px;
}
.btn-confirm {
  background: linear-gradient(187.94deg, rgba(255, 255, 255, 0.8) 5.77%, #8eb5ff 93.57%);
  font-weight: 700;
  width: 140px;
  height: 42px;
  color: #5c46e7;
  border-radius: 8px;
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
