<template>
  <!-- <ProfileSummary :homeProfile="true" /> -->

  <q-page>
    <div class="top-setting-section">
      <div class="top-profile">
        <div class="profile">
          <div class="profile-pic">
            <q-avatar size="50px">
              <img :src="profileImagePath" />
            </q-avatar>
            <div class="profile-pic-frame" v-if="!homeProfile"></div>

            <div class="vip-details">
              <img class="bg" src="../assets/images/index/vip-row1.png" alt="" />
              <div class="vip-level">
                <img src="../assets/images/index/viptext.png" alt="" />
                {{ store.vip.replace('VIP', '') }}
              </div>
            </div>
          </div>
          <div class="top-name">

            <div class="top-name-details">
              <!-- <img src="../assets/images/account/login-name-icon.png" /> -->
              <div>{{ store.realName }}</div>
            </div>
            <div class="top-copy-id">
              <!-- <img src="../assets/images/account/login-name-icon.png" /> -->
              <div>ID: {{ store.nickName }}</div>
              <img class="copy-icon" src="../assets/images/account/copy-icon.png" @click="handleCopyClick" />
            </div>
          </div>
        </div>
        <RouterLink to="/account/profile" class="right">
          <img src="../assets/images/account/rgtarrow.svg">
        </RouterLink>
      </div>
      <RouterLink to="/vip" class="top-vip">
        <VIPCarousel :onlyShowCurrentLevel="true" :vipCarouselIndex="vipCarouselIndex" style="pointer-events: none;" />
      </RouterLink>
      <div class="top-total-score">
        <div class="score-txt">
          <img src="../assets/images/account/total-score.png" />
          {{ $t("settings.totalScore") }}</div>
        <div class="score-amount">{{ store.balance.toFixed(2) }}</div>
      </div>
      <!-- <div class="top-section-inner">
      </div> -->
    </div>
    
    <div class="mid-setting-section">
      <div class="acct-nav">
        <!-- <h2>{{ $t("settings.otherServices") }}</h2> -->
          <div class="top-section">
        <router-link to="/deposit">
          <div class="acct-nav-item">
            <img src="../assets/images/account/deposit-svg.svg" />
          </div>
          <div class="acct-nav-label">{{ $t("settings.deposit") }}</div>
        </router-link>
            <router-link to="/withdraw">
          <div class="acct-nav-item">
            <img src="../assets/images/account/withdraw-svg.svg" />
          </div>
          <div class="acct-nav-label">{{ $t("settings.withdraw") }}</div>
        </router-link>
          </div>
        <div class="acct-menu" id="id-acct-menu">
        <router-link to="/promo">
          <div class="acct-nav-item">
            <img src="../assets/images/account/promo-svg.svg" />
          </div>
          <div class="acct-nav-label">{{ $t("settings.promo") }}</div>
        </router-link>
          <router-link to="/account/profile">
            <div class="acct-nav-item">
              <img src="../assets/images/account/personal-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.personalCenter") }}</div>
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
          
          <router-link to="/vip">
            <div class="acct-nav-item">
              <img src="../assets/images/account/vip-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.vip") }}</div>
          </router-link>
          <a :href="ui.charityUrl" target="_blank">
            <div class="acct-nav-item">
              <img src="../assets/images/account/charitable-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.charity") }}</div>
          </a>
          
        </div>
      </div>
      <div class="bottom-setting-section">
        <router-link to="/account/message">
            <div class="acct-nav-item">
              <img src="../assets/images/account/message-svg.png" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.message") }}</div>
          </router-link>
          <router-link to="/account/feedback">
            <div class="acct-nav-item">
              <img src="../assets/images/account/feedback-svg.png" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.feedback") }}</div>
          </router-link>
          <a v-if="ui.promo_exchange === '1'" target="_blank" @click="handleExchangeClick">
            <div class="acct-nav-item">
              <img src="../assets/images/account/exchange-svg.png" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.exchange") }}</div>
          </a>

          <a v-if="canTransfer" target="_blank" @click="handleTransferClick">
            <div class="acct-nav-item">
              <img src="../assets/images/account/transfer-svg.svg" />
            </div>
            <div class="acct-nav-label">{{ $t("settings.transfer") }}</div>
          </a>
      </div>
      <div class="bottom-setting-section invite-friends-section">
        <div class="left-icon">
          <img src="../assets/images/earn-money/invite-gift.png"/>
        </div>
        <div class="right-contents">
          <div class="invite-title">{{ $t("earnMoney.reward.inviteFriendsViaLink") }}</div>
          <div class="invite-share-link">
            <div class="link-href">{{ selfTgurl }}</div>
            <div class="link-copy" @click="copyHrefLink">{{ $t("earnMoney.reward.copyLink") }}</div>
          </div>
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
              :img-src="imgURL + banner.mobileImageUrl"
              @click="router.push('/earn-money')"
            ></q-carousel-slide>
          </q-carousel>
        </q-card-section>
      </q-card>

      <a @click="openConfirmSignOutDialog">
        <div class="acct-logout">
          <img src="../assets/images/index/menu/logout.png">
          <div class="acct-nav-label">{{ $t("settings.logout") }}</div>
        </div>
      </a>
    </div>
  </q-page>

  <q-dialog class="flex-end" width="100%" v-model="confirmSignOutDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
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
  <ExchangeModal v-model="showExchangeModal" />
  <TransferModal v-model="showTransferModal" :uplineId="uplineId" :uplineName="uplineName" :upline="true" />
</template>

<script setup>
import { onActivated, onMounted, ref, computed } from "vue";
import { userStore } from "src/stores";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import VIPCarousel from "components/VIPCarousel.vue";
import ProfileSummary from "../components/ProfileSummary.vue";
import ExchangeModal from "../components/account/ExchangeModal.vue";
import TransferModal from "../components/account/TransferModal.vue";
import { api } from "boot/axios";
import { useUI } from "stores/ui";
import { Platform } from "quasar";
import { t } from "src/boot/lang";


const selfTgurl = ref("");
const copyHrefLink = () => {
  navigator.clipboard
    .writeText(selfTgurl.value)
    .then(() => {
      $q.notify({
        message: "Link copied to clipboard",
        color: "positive",
        position: "top",
        timeout: 2000
      });
    })
    .catch(() => {
      $q.notify({
        message: "Failed to copy link",
        color: "negative",
        position: "top",
        timeout: 2000
      });
    });
};
const profileImg = [
  {
    imgPath: ["profile-pic"]
  }
];
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
const store = userStore();
const router = useRouter();
const route = useRoute();
const qs = require("qs");
const $q = useQuasar();
const ui = useUI();

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
const showExchangeModal = ref(false);
const showTransferModal = ref(false);

const confirmSignOutDialog = ref(false);
const openConfirmSignOutDialog = () => {
  confirmSignOutDialog.value = !confirmSignOutDialog.value;
};

const handleExchangeClick = () => (showExchangeModal.value = true);

const handleTransferClick = () => {
  getUplineDetails();
  showTransferModal.value = true;
};
onActivated(() => {
  store.getUnreadTotal();
  getPromoImage();
  getUplineDetails();

  if (route.query.openCodeModal) {
    showExchangeModal.value = true;
  }
});
onMounted(() => {
  let tgDomain = window.location.origin + "/";
  if (store.isApp()) {
    tgDomain = store.evip ? "https://" + store.evip + "/" : store.h5Url;
  }

  api.get("/session/member/referralCode").then((res) => {
    if (res.code === 0) {
      selfTgurl.value = tgDomain + "refer/" + res.data;
    }
  });
})
const vipCarouselIndex = ref();

const canTransfer = ref(false);
const uplineId = ref();
const uplineName = ref();
const getUplineDetails = () => {
  api.get(`/session/upline/checkTransfer`).then((res) => {
    if (res.code === 0) {
      canTransfer.value = res.data.canTransfer;
      uplineId.value = res.data.referrerId;
      uplineName.value = res.data.referrerName;
    } else {
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

function isHuaweiBrowser() {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("huawei") || userAgent.includes("honor");
}

const handleCopyClick = async () => {
  if (window.location.pathname === "/account") {
    const textToCopy = store.nickName;
    // alert(textToCopy);

    if (isHuaweiBrowser()) {
      writeClipboard(store.nickName);
    } else if (navigator.clipboard && window.isSecureContext && Platform.is.chrome) {
      await navigator.clipboard.writeText(textToCopy);

      setTimeout(() => {
        $q.notify({
          color: "positive",
          position: "top",
          message: t("notify.copiedSuccessfully"),
          icon: "check_circle_outline"
        });
      }, 100);
    } else {
      // Use the 'out of viewport hidden text area' trick
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;

      // Move textarea out of the viewport so it's not visible
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";

      document.body.prepend(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
      } catch (error) {
        console.error(error);
      } finally {
        document.body.removeChild(textArea);
      }

      setTimeout(() => {
        $q.notify({
          color: "positive",
          position: "top",
          message: t("notify.copiedSuccessfully"),
          icon: "check_circle_outline"
        });
      }, 100);
    }
  } else {
    writeClipboard(currentVoxisId.value);
  }
};
</script>

<style scoped lang="scss">
.top-setting-section {
  .top-profile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    margin: 0 auto;
    .profile {
      display: flex;
      width: 90%;
      gap: 10px;
      margin: 10px auto;
      justify-content: flex-start;
      align-items: center;
      .top-name {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
        .top-name-details {
          font-family: Microsoft YaHei UI;
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
        font-family: Microsoft YaHei UI;
        font-weight: 700;
        font-size: 12.17px;
        line-height: 120%;
        letter-spacing: 0px;
        color: #B3BEC0;
        img {
          width: 30px;
          height: 30px;
          margin-right: 8px;
        }
        .copy-icon {
          width: 16px;
          height: 16px;
          margin-left: 8px;
        }
      }
      .profile-pic-frame {
          // background-image: url(../assets/images/common/profile-frame.png);
          width: 70px;
          height: 70px;
          background-size: 100%;
          position: absolute;
          top: -8px;
          left: -4px;
        }
      .profile-pic {
          position: relative;
          padding-bottom: 20px;
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

          .vip-level {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            line-height: 1.1;
            padding-top: 3px;
            padding-bottom: 4px;
            z-index: 3;
            color: #ffffff;
            font-weight: 700;
            font-style: italic;
            img {
              width: 68%;
              margin-left: -7px;
            }
          }
        }
      }
    }
  }
  .top-vip {
    max-width: 400px;
    width: 90%;
    margin: 0 auto;
    display: block;
  }
  background: url(../assets/images/account/setting-bg.png)no-repeat center center;
  padding-top: 175px;
  background-size: cover;
  position: relative;


  .top-total-score {
    margin: 0 20px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .score-txt {
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 700;
      font-size: 14px;
      gap: 5px;
    }
    .score-amount {
      font-weight: bold;
      font-size: 14px;

      &:before {
        content: "RS";
        font-size: 14px;
        margin-right: 4px;
      }
    }
  }

  .top-section-inner {
    background: #2e30344f;
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
    color: #fff;
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
.bottom-setting-section {
  margin: 5px 20px 20px;
  
  border-radius: 10px;
  background: #373C3D;
  padding: 10px;
  display: flex;
  flex-direction: column;
  a {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #FFFFFF;
    padding: 10px;
    gap: 10px;

    text-decoration: none;
    font-weight: bold;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      right: 10px;
      top: 0;
      bottom: 0;
      margin: auto;
      background: url(../assets/images/common/goright.png)no-repeat center center;
      background-size: cover;
      width: 20px;
      height: 20px;
    }
  }
}

.invite-friends-section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: unset;
  gap: 10px;
  .left-icon {
    width: 60px;
    img {
      width: 100%;
    }
  }
  .right-contents {
    font-family: Microsoft YaHei UI;
    font-weight: 700;
    font-size: 14.32px;
    line-height: 120%;
    letter-spacing: 0px;
    max-width: 75%;

    width: 100%;
  }
}

.invite-share-link {
      margin-top: 8px;
      background-color: #292D2E;
      padding: 4px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      min-height: 40px;
      border: 1px solid #FFFFFF14;

      .link-href {
        padding: 10px 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 11px;
      }
      .link-copy {
        color: #ffffff;
        background: #FFFFFF0F;

        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 70px;
        font-weight: bold;
        border-radius: 5px;
        letter-spacing: -1px;
      }
    }

.acct-nav {
  margin: 5px 20px 20px;
  background: #373C3D;
  padding: 10px;
  border-radius: 10px;

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

  .top-section {
      width: 100%;
      display: flex;
      gap: 10px;
      a {
        display: flex;
        width: 100%;
        text-decoration: none;
        justify-content: center;
        align-items: center;
        padding: 10px;
        gap: 5px;
        img {
          width: 16px;
          display: block;
        }
        &:nth-child(1) {
          border-radius: 4px;
          color: #333333;
          font-weight: bold;
          background: linear-gradient(90deg, #2CED88 0%, #9EE871 100%);
          box-shadow: 0px 2.07px 0px 0px #1CCA6A;
          
          img {
            filter: grayscale(1) brightness(0);
          }
        }
        &:nth-child(2) {
          border-radius: 4px;
          color: #ffffff;
          font-weight: bold;
          background: #455152;
          box-shadow: 0px 2.07px 0px 0px #2A3637;
          img {
            filter: grayscale(1) brightness(100);
          }

        }
        
        
      }
    }
  .acct-menu {
    padding: 20px 0 0;
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
      gap: 10px;
      width: 100%;
      text-align: center;
      align-items: center;
      justify-content: flex-start;
      margin: 0 auto;

      // &:active {
      //   background-color: rgba(255, 255, 255, 0.1);
      //   border-radius: 8px;
      // }

      .acct-nav-label {
        color: #fff;
        font-family: Microsoft YaHei UI;
        font-weight: 700;
        font-size: 12px;
        line-height: 120%;
        letter-spacing: 0px;
        text-align: center;
        vertical-align: middle;

      }

      .acct-nav-item {
        // background-color: #b9c8ff26;
        border-radius: 50%;
        // aspect-ratio: 1/1;
        // padding: 5px;
        height: 22px;
        width: 22px;
        cursor: pointer;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        color: #000;
        text-decoration: none;

        img {
          // width: 90%;
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
  // height: 60px;
  // background: #2e30344f;
  // background-image: url("../assets/images/account/logout-btn.png");
  // background-repeat: no-repeat;
  width: calc(95% - 20px);
  margin: 20px auto;
  // aspect-ratio: 335/40;
  // background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  img {
    width: 30px;
  }
  .acct-nav-label {
    // color: rgba(206, 206, 206, 0.8);
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
  }

  &:active {
    filter: brightness(1.2);
    transform: translate(0px, 1px);
  }
}

.btn-cancel {
  // background: radial-gradient(68.92% 68.92% at 50% 50%, #1d341d 0%, #466a45 100%);
  font-weight: 700;
  color: #fff;
  border: 1px solid #1baa99;
  border-radius: 12px;
  width: 140px;
  height: 42px;
  color: #21EF89;
}
.btn-confirm {
  background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
  border: 1px solid #5d8956;
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
