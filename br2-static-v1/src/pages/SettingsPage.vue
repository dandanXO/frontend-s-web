<template>
  <q-page>
    <div class="top-setting-section">
      <div class="top-profile">
        <div class="profile">
          <div class="profile-pic">
            <q-avatar size="56px">
              <img :src="profileImagePath" />
            </q-avatar>
          </div>
          <div class="top-name">
            <div class="top-name-details">
              <div>{{ store.realName }}</div>
            </div>
            <div class="top-copy-id">
              <p>
                {{ $t("settings.balance") }}:
                <span class="top-balance-amount">
                  {{ store.balance.toFixed(2) }}
                </span>
              </p>
            </div>
          </div>
        </div>
        <RouterLink to="/account/profile" class="right">
          <q-icon name="chevron_right" color="white" />
        </RouterLink>
      </div>
      <!-- <div class="top-section-inner">
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
      </div> -->
    </div>

    <div class="mid-setting-section">
      <q-item-section class="acct-nav">
        <div class="acct-menu-finance">
          <router-link to="/withdraw">
            <img src="../assets/images/account/withdraw-bg.png" />
            <span class="acct-menu-finance-text">{{ $t("settings.withdraw") }}</span>
          </router-link>
          <router-link to="/deposit">
            <img src="../assets/images/account/deposit-bg.png" />
            <span class="acct-menu-finance-text">{{ $t("settings.deposit") }}</span>
          </router-link>
        </div>
        <!-- <h2>{{ $t("settings.otherServices") }}</h2> -->
        <div class="acct-menu" id="id-acct-menu">
          <router-link to="/account/profile">
            <div class="acct-nav-item">
              <img src="../assets/images/account/personal-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.personalCentre") }}</div>
            <q-icon name="chevron_right" />
          </router-link>
          <router-link to="/account/discount">
            <div class="acct-nav-item">
              <img src="../assets/images/account/discount-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.discount") }}</div>
            <q-icon name="chevron_right" />
          </router-link>
          <router-link to="/account/record">
            <div class="acct-nav-item">
              <img src="../assets/images/account/record-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.record") }}</div>
            <q-icon name="chevron_right" />
          </router-link>
          <router-link to="/account/order">
            <div class="acct-nav-item">
              <img src="../assets/images/account/order-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.order") }}</div>
            <q-icon name="chevron_right" />
          </router-link>
          <router-link to="/account/bank">
            <div class="acct-nav-item">
              <img src="../assets/images/account/bank-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.bank") }}</div>
            <q-icon name="chevron_right" />
          </router-link>
          <router-link to="/account/message">
            <div class="acct-nav-item">
              <img src="../assets/images/account/message-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.message") }}</div>
            <q-icon name="chevron_right" />
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

      <div class="super-promo">
        <img class="super-promo-img" src="../assets/images/account/super-promo.png" />
        <router-link class="super-promo-chevron" to="">
          <q-icon name="chevron_right" color="white" />
        </router-link>
      </div>
      <a @click="openConfirmSignOutDialog">
        <div class="acct-logout">
          <img src="../assets/images/account/logout-svg.svg" />
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
import { computed, onActivated, onMounted, ref } from "vue";
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
    mobileImageUrl: require("../assets/images/promotion/tempo/promo-2.png")
  }
]);

const loadingLogout = ref(false);

const confirmSignOutDialog = ref(false);

const randomProfileImg = computed(() => {
  const storedImg = sessionStorage.getItem("PROFILE_IMG");
  if (storedImg) {
    return storedImg;
  } else {
    const randomProfile = profileImg[0];
    const randomIndex = Math.floor(Math.random() * randomProfile.imgPath.length);
    const imgPath = randomProfile.imgPath[randomIndex];
    sessionStorage.setItem("PROFILE_IMG", imgPath);
    return imgPath;
  }
});

const profileImagePath = computed(() => {
  return require(`../assets/images/account/${randomProfileImg.value}.png`);
});

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
      // btm_banners.value = response.data;
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
  background: url(../assets/images/account/setting-bg.png) no-repeat center center;
  padding-top: 60px;
  background-size: cover;
  position: relative;
  margin-bottom: 22px;

  .top-profile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    margin: 0 auto;
    .profile {
      display: flex;
      width: 90%;
      :not(:last-child) {
        margin-right: 10px;
      }
      margin: 10px auto 0;
      justify-content: flex-start;
      align-items: center;
      .top-name {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        .top-name-details {
          font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-weight: 700;
          font-size: 16px;
          line-height: 120%;
          letter-spacing: 0px;
          color: #ffffff;
        }
      }
      .top-copy-id {
        display: flex;
        align-items: center;
        font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-weight: 700;
        font-size: 12.17px;
        line-height: 120%;
        letter-spacing: 0px;
        color: #b3bec0;
        img {
          width: 30px;
          height: 30px;
          margin-right: 8px;
        }
        p {
          margin-bottom: unset;
          font-size: 14px;
          .top-balance-amount {
            color: #00fd7c;
          }
        }
      }
      .profile-pic {
        position: relative;
        .vip-details {
          position: relative;
          margin-left: 20px;
          margin-bottom: 5px;
          margin-top: -15px;

          img.bg {
            display: block;
            width: 55px;
            position: absolute;
            top: -2px;
            left: -25px;
          }
        }
      }
    }
  }
}

.mid-setting-section {
  background-color: #1f241f;
  width: 100%;
  position: relative;
  border-radius: 20px 20px 0px 0px;
  box-shadow: 0px -2px 0px 0px #00fd7c, 0px 0px 109px 0px #00fd7c80;

  padding: 29px 20px 48px;

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
  margin-bottom: 24px;

  a {
    padding: 5px;
    display: block;
  }

  .acct-menu-finance {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;

    a {
      position: relative;
      padding: 0;

      .acct-menu-finance-text {
        position: absolute;
        top: 7px;
        left: 11px;
        color: #fff;
        font-size: 16px;
        font-weight: 700;
      }

      img {
        width: 100%;
      }
    }
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
    display: flex;
    flex-direction: column;
    gap: 17px;
    width: 100%;

    &.shorter-menu {
      grid-template-rows: repeat(2, 1fr);
    }

    a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #fff;
      font-size: 14px;
      text-decoration: none;

      &:active {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
      }

      .acct-nav-label {
        flex: 1;
        font-size: 14px;
        font-weight: bold;
        white-space: normal;
      }

      .acct-nav-item {
        margin-right: 17.63px;
        img {
          display: block;
        }
      }
    }
  }
}

.card-account-banner {
  margin: 0px auto 13px;
  border-radius: 4;
  border-color: transparent;
  box-shadow: none;

  .account-banner-img {
    width: 100%;
    border-radius: 10px 10px 0px 0px;
  }
}

.acct-logout {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7px;

  .acct-nav-label {
    color: #00fd7c;
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
  background: linear-gradient(180deg, #00b9a1 0%, #0097b9 100%);
  font-weight: 700;
  width: 140px;
  height: 42px;
  color: #ffffff;
  border-radius: 8px;
}

.super-promo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #085a3e;
  border-radius: 4px;
  margin-bottom: 24px;

  .super-promo-img {
    height: 11vw;
    max-height: 40px;
  }
  .super-promo-chevron {
    display: flex;
    align-items: center;
    max-height: 30px;
    margin: 5px 9px;
    padding: 8px;
    background: #ffffff1c;
    border-radius: 6px;
    text-decoration: none;
  }
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
