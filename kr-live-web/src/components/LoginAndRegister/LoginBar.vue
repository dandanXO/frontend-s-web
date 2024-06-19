<template>
  <div class="container">
    <div class="top-header">
      <div @click="toggleNav()" class="hamburger-wrapper">
        <img class="hamburger-img" src="../../assets/home/menu-icon.svg" />
        <img class="logo-img" src="../../assets/images/index/kr-logo.png" />
      </div>
      <div class="right-content-sidebar">
        <LoggedIn v-if="store.hasToken()" :isH5TopBar="true" />
        <NotLoggedIn v-else-if="!store.hasToken()" />
      </div>
    </div>

    <div class="content">
      <div class="left-content" :class="navActive && 'active'" @click="navActive = false">
        <div class="left-content-items">
          <div class="sidebar-section-wrapper">
            <div class="sidebar-section-title">
              <span v-if="store.token">{{ store.nickName }}<br />님 환영합니다 </span>
              <span v-else>로그인</span>
              <div class="balance-info">
                <img class="balance-info-icon" :src="require('../../assets/icon/sidebar-icon-balance.svg')" alt="" />
                <div class="info-text">{{ store.balance }} <span style="color: #00FFFF">원</span></div>
              </div>
            </div>
            <div class="sidebar-section top">
              <router-link class="sidebar-section-item" to="/?page=personal/info">
                <img :src="require('../../assets/icon/sidebar-icon-transaction-record.svg')" alt="" />
                <div class="info-text">마이페이지</div>
              </router-link>
            </div>
            <div class="sidebar-section middle">
              <router-link class="sidebar-section-item" to="/?page=finance/deposit">
                <img :src="require('../../assets/icon/sidebar-icon-deposit.svg')" alt="" />
                <div class="info-text">입금</div>
              </router-link>
              <router-link class="sidebar-section-item" to="/?page=finance/withdraw">
                <img :src="require('../../assets/icon/sidebar-icon-withdraw.svg')" alt="" />
                <div class="info-text">출금</div>
              </router-link>
              <!-- <div
                class="sidebar-section-item"
              >
                <img :src="require('../../assets/icon/sidebar-icon-1.svg')" alt="" />
                <div class="info-text">포인트전환</div>
              </div>
              <div
                class="sidebar-section-item"
              >
                <img :src="require('../../assets/icon/sidebar-icon-2.svg')" alt="" />
                <div class="info-text">알전환</div>
              </div> -->
            </div>
            <div class="separator" />
            <div class="icon-section-label">메뉴</div>
          </div>
          <div v-for="(item, index) in iconInfo" :key="index"
            @click="store.token || item?.requireLogin === false ? item.goPage() : showNotify()"
            class="credit-info cursor-pointer">
            <img :src="item.iconUrl" alt="" />
            <div class="info-text">{{ $t(item.info) }}</div>
          </div>
          <div class="sidebar-logout-button" v-if="store.token">
            <div class="primary-button red" @click.stop="logout">
              {{ $t('lang.logout') }}
            </div>
          </div>
        </div>
      </div>
      <div class="right-content">
        <LoggedIn v-if="store.hasToken()" />
        <NotLoggedIn v-else-if="!store.hasToken()" :isH5Banner="true" />
      </div>
    </div>
  </div>
</template>

<script setup>
import LoggedIn from "./LoggedIn.vue";
import NotLoggedIn from "./NotLoggedIn.vue";
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

const store = userStore();
const $q = useQuasar();
const { t } = useI18n();

const router = useRouter();

const navActive = ref(false);
const toggleNav = () => {
  navActive.value = !navActive.value;
};

const showNotify = () => {
  $q.notify({
    color: "negative",
    position: "top",
    message: "로그인 해주세요",
    icon: "report_problem"
  });

  router.push('/?page=login')
};

const logout = () => {
  store.memberLogout();
}

const iconInfo = reactive([
  // {
  //   info: "송금신청",
  //   iconUrl: require("../../assets/icon/deposit.svg"),
  //   goPage: () => {
  //     router.push(`/?page=finance/deposit`);
  //   }
  // },
  {
    info: 'lang.menu_announcement',
    iconUrl: require("../../assets/icon/pageModal/bell-icon.svg"),
    goPage: () => {
      router.push(`/?page=announcement`);
    }
  },
  // {
  //   info: "이벤트",
  //   iconUrl: require("../../assets/icon/icon-promo.svg"),
  //   goPage: () => {
  //     router.push(`/?page=promo/all`);
  //   }
  // },
  {
    info: "lang.menu_deposit",
    iconUrl: require("../../assets/icon/pageModal/wallet-icon.svg"),
    goPage: () => {
      router.push(`/?page=finance/deposit`);
    }
  },
  {
    info: "lang.menu_withdraw",
    iconUrl: require("../../assets/icon/pageModal/card-icon.svg"),
    goPage: () => {
      router.push(`/?page=finance/withdraw`);
    }
  },
  {
    info: "lang.menu_transaction_record",
    iconUrl: require("../../assets/icon/icon-betting.svg"),
    goPage: () => {
      router.push(`/?page=transaction/records`);
    }
  },
  {
    info: "lang.menu_rebates",
    iconUrl: require("../../assets/icon/icon-betting.svg"),
    goPage: () => {
      router.push(`/?page=transaction/records&tab=rebates`);
    }
  },
  {
    info: "lang.menu_message",
    iconUrl: require("../../assets/icon/pageModal/mail-icon.svg"),
    goPage: () => {
      router.push(`/?page=personal/messages`);
    }
  },
  {
    info: "lang.menu_customer_service",
    iconUrl: require("../../assets/icon/pageModal/speech-icon.svg"),
    goPage: () => {
      window.open(`https://csweb01.amv4xjcbd.com/?partnerId=12&lang=kr`);
    },
    requireLogin: false
  },
]);
</script>

<style scoped lang="scss">
.top-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  padding: 12px;
  background: #12112199;
  border-bottom: 1px solid #3f3f3f;

  .hamburger-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    .hamburger-img {
      width: 20px;
      height: 20px;
    }

    .logo-img {
      width: 35px;
      height: 35px;
      margin-left: 10px;
    }
  }

  @media (min-width: 769px) {
    display: none;
    position: absolute;
    background: rgba(18, 17, 33, 0.6);
  }
}

.container {
  // background: transparent;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: #121121e6;
  z-index: 1;
  border-width: 2px 0px 2px 0px;
  border-style: solid;
  border-color: #2a306c;

  @media (min-width: 769px) {
    // background: linear-gradient(#292b31, #191b1e);
    background: rgba(18, 17, 33, 0.6);
    backdrop-filter: blur(6px);
  }
}

.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: auto;

  @media (min-width: 769px) {
    width: 1400px;
    flex-direction: row;
    height: 80px;
    display: flex;
  }
}

.left-content {
  display: none;

  .left-content-items {
    width: 70%;
    height: 100%;
    padding: 20px 10px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: #00000080;
    backdrop-filter: blur(10px);
    border-right: 1px solid #454F63;
    overflow-y: auto;
  }

  &.active {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 16px;
    z-index: 9;
    background: #4040406d;

    .credit-info {
      flex-direction: row;

      .info-text {
        font-size: 16px;
      }
    }
  }

  .sidebar-section-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;

    .sidebar-section-title {
      font-size: 28px;
      font-weight: 500;
      line-height: 28px;
      display: flex;
      justify-content: space-between;
    }

    .balance-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      width: 70px;

      img.balance-info-icon {
        background-color: #00FFFF1A;
        padding: 5px;
        border-radius: 4px;
      }
    }

    .sidebar-section {
      width: 100%;
      display: flex;
      justify-content: space-around;
      padding: 10px;

      &.top {
        border-radius: 6px;
        background-color: #1D243D;
        padding: 20px;

        .sidebar-section-item img {
          background-color: #00FFFF1A;
          padding: 5px;
          border-radius: 4px;
        }
      }

      &.middle {
        display: flex;
        white-space: nowrap;
        flex-wrap: wrap;
      }

      .sidebar-section-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        width: 70px;
      }
    }

    .separator {
      border: 0.5px solid #ffffff9e;
      border-image: linear-gradient(to right, #ffffff12, #dfdfdfa1, #ffffff12) 0.8;
      width: 100%;

      &.vertical {
        border: 0.5px solid #ffffff9e;
        border-image: linear-gradient(to bottom, #374b7c32, #374B7CCC, #374b7c32) 0.8;
        width: 1px;
      }
    }

    .icon-section-label {
      color: #7D87A1;
    }
  }

  .sidebar-logout-button {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: auto auto 0;
  }

  // display: none;
  @media (min-width: 769px) {
    display: flex;
    height: 100%;
    border: none;

    &.active {
      position: unset;
      background: none;
      backdrop-filter: none;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      width: 100%;
    }

    .left-content-items {
      display: flex;
      flex-direction: row;
      width: 100%;
      background: none;
      backdrop-filter: none;
      border: none;

      .sidebar-section-wrapper,
      .sidebar-logout-button {
        display: none;
      }
    }
  }
}

.right-content {
  .actions-topbar-controls {
    display: none;
  }

  @media (min-width: 769px) {
    display: flex;
    justify-content: center;
    width: 100%;
    background-color: transparent;
  }
}

.info-text {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  line-height: 28px;
  margin-left: 5px;
  white-space: nowrap;

  @media (min-width: 769px) {
    font-size: 16px;
    line-height: 1;
  }
}

.credit-info {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover .info-text {
    color: #00FFFF;
    font-weight: bold;
  }

  img {
    width: 20px;
  }

  @media (min-width: 769px) {
    flex-direction: row;
    align-items: center;

    img {
      width: 22px;
    }
  }
}
</style>
