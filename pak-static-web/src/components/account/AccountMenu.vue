<template>
  <div class="account-menu-container">
    <div class="account-info-wrapper">
      <div class="vip-badge">
        <!-- <img v-if="vip === 'VIP0'" src="../../assets/images/vip/badge/badge.png" /> -->
        <div class="vip-text">
          {{ vip }}
        </div>
      </div>
      <div class="account-name">
        {{ loginName }}
      </div>
    </div>
    <div class="web-menu" :class="{ 'menu-active': personalMenuVisible }">
      <div class="account-menu-wrapper">
        <router-link to="/center/top-up" class="flex-box flex-align-center account-menu-item">
          <div class="icon icon-deposit"></div>
          Deposit
        </router-link>
        <router-link to="/center/withdraw" class="flex-box flex-align-center account-menu-item">
          <div class="icon icon-withdraw"></div>
          Quick Withdraw
        </router-link>
        <!-- <router-link
          to="/center/transfer"
          class="flex-box flex-align-center account-menu-item"
        >
          <RiExchangeDollarLine />
          Quick Transfer
        </router-link> -->
        <router-link to="/center/transit-record" class="flex-box flex-align-center account-menu-item">
          <div class="icon icon-transac"></div>
          Transaction Record
        </router-link>
      </div>
      <div class="account-menu-separator"></div>
      <div class="account-menu-wrapper last">
        <router-link to="/center/personal" class="flex-box flex-align-center account-menu-item">
          <div class="icon icon-personal"></div>
          Personal Information
        </router-link>
        <router-link to="/center/withdrawbank" class="flex-box flex-align-center account-menu-item">
          <div class="icon icon-bank"></div>
          Withdraw Bank Card
        </router-link>

        <router-link to="/center/mailbox" class="flex-box flex-align-center account-menu-item">
          <div class="icon icon-mail"></div>
          Mailbox
        </router-link>
        <!-- <router-link
          to="/center/voucher-code"
          class="flex-box flex-align-center account-menu-item"
        >
          <RiCoupon3Line />
          Voucher Code
        </router-link> -->
        <router-link to="/center/share" class="flex-box flex-align-center account-menu-item">
          <div class="icon icon-share"></div>
          Share
        </router-link>
      </div>
    </div>
    <div class="txt-center mobile-menu">
      <div @click="showPersonalMenu">
        <RiMenuLine />
      </div>
      <!-- <div>
        <router-link
          to="/personal"
          class="flex-box flex-align-center account-menu-item"
        >
          <UserOutlined />
          Personal Information
        </router-link>
        <router-link
          to="/mailbox"
          class="flex-box flex-align-center account-menu-item"
        >
          <MailOutlined />
          Mailbox
        </router-link>
      </div>-->
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { userStore } from "@/store";
import {
  RiWallet3Line,
  RiUser5Line,
  RiBankCardLine,
  RiMailLine,
  RiExchangeDollarLine,
  RiShieldFlashLine,
  RiShareBoxLine,
  RiFileShieldLine,
  RiMenuLine,
  RiBankLine
} from "vue-remix-icons";

{
  RiWallet3Line,
    RiUser5Line,
    RiBankCardLine,
    RiMailLine,
    RiExchangeDollarLine,
    RiShieldFlashLine,
    RiShareBoxLine,
    RiFileShieldLine,
    RiBankLine,
    RiMenuLine;
}
const store = userStore();
const personalMenuVisible = ref(false);
const showPersonalMenu = () => {
  personalMenuVisible.value = !personalMenuVisible.value;
};
const loginName = computed(() => {
  return store.nickName;
});

const vip = computed(() => {
  return store.vip;
});

const route = useRoute();
watch(
  () => route.name,
  () => {
    personalMenuVisible.value = false;
  }
);
</script>

<style scoped lang="scss">
.account-menu-container {
  background: #ecf5ff;
  color: #83a3ca;

  min-height: 100%;
  .account-info-wrapper {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 2px;
    gap: 20px;
    padding: 30px;
    .vip {
      background: rgba(255, 255, 255, 0.6);
      line-height: 20px;
      font-size: 14px;
      padding: 5px 24px;
      border-radius: 30px;
      font-weight: bold;
    }
    .account-avatar {
    }

    .account-vip {
      color: #2b2b4b;
      font-weight: bold;
      font-size: 50px;
      line-height: 50px;
      font-family: wave;
      letter-spacing: 10px;
    }

    .account-name {
      font-size: 20px;
      color: #000000;
      font-weight: 500;
    }
    .vip-badge {
      width: 40px;
      display: flex;
      align-items: center;
      font-family: Arial Black;
      .vip-text {
        font-size: 20px;
        font-weight: 600;
        line-height: 23px;
        letter-spacing: 0px;
        text-align: left;
        background-image: linear-gradient(270deg, #5800e8 0%, #0062e8 100%);

        /* Set the background size and repeat properties. */
        background-size: 100%;
        background-repeat: repeat;

        /* Use the text as a mask for the background. */
        /* This will show the gradient as a text color rather than element bg. */
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        -moz-background-clip: text;
        -moz-text-fill-color: transparent;
      }

      img {
        width: 100%;
      }
    }

    .account-balance {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .web-menu {
    padding-bottom: 50px;
  }

  .account-menu-wrapper {
    gap: 10px;
    display: flex;
    flex-direction: column;
    &.last {
      border: 0;
    }

    .account-menu-item {
      width: 100%;
      font-size: 16px;
      padding: 10px 20px;
      font-weight: bold;

      .remixicon {
        fill: currentColor;
        width: 30px;
        margin-right: 15px;
      }
      .icon {
        width: 25px;
        height: 25px;
        background-image: url(../../assets/images/account/accmenuicons.svg);
        margin-right: 10px;
        margin-bottom: 5px;
        background-size: cover;
        &.icon-deposit {
          background-position: 0% 0%;
        }
        &.icon-withdraw {
          background-position: 0% 16.5%;
        }
        &.icon-transac {
          background-position: 0% 33%;
        }
        &.icon-personal {
          background-position: 0% 50%;
        }
        &.icon-bank {
          background-position: 0% 66.5%;
        }
        &.icon-mail {
          background-position: 0% 83%;
        }
        &.icon-share {
          background-position: 0% 100%;
        }
      }

      &:hover,
      &.router-link-active {
        background: linear-gradient(270deg, rgba(7, 91, 232, 0.2) 0%, rgba(7, 91, 232, 0) 100%);
        color: #2b2b82;
        &.remixicon {
          fill: #2b2b82;
        }
        .icon {
          background-image: url(../../assets/images/account/accmenuicons-hover.svg);
        }
      }
    }
  }
  .account-menu-separator {
    margin: 30px auto;
    height: 1px;
    width: 80%;
    display: block;
    background: #83a3ca33;
  }

  .mobile-menu {
    display: none;

    svg {
      fill: currentColor;
      width: 50px;
      margin-bottom: -5px;
      display: block;
    }
  }
}
.dark-theme {
  .account-menu-container {
    .account-menu-wrapper .account-menu-item {
      &:hover,
      &.router-link-active {
        .icon {
          filter: brightness(100);
        }
      }
    }
    .account-info-wrapper {
      .account-name {
        color: #ffffff;
      }
    }
  }
}
</style>
<style scoped lang="scss">
.account-menu-wrapper .icon {
  width: 40px;
  margin-right: 26px;

  &.default {
    display: block;
  }

  &.active {
    display: none;
  }
}

.account-menu-container .account-menu-wrapper :deep(.router-link-active) {
  position: relative;

  .icon {
    &.default {
      display: none;
    }

    &.active {
      display: block;
    }
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 767px) {
  .account-menu-container {
    display: flex;
    justify-content: space-between;
    padding-top: 0;
    padding: 20px;
    display: none;

    .web-menu {
      display: none;
      z-index: 99;

      &.menu-active {
        position: absolute;
        width: 95%;
        left: 0;
        display: block;
        top: 190px;
        right: 0;
        margin: auto;
      }

      .menu-title-container {
        display: none;
      }

      .account-menu-wrapper {
        .account-menu-item {
          padding-left: 12px;
          font-size: 14px;

          &.router-link-active {
            padding-left: 8px;
          }

          .anticon {
            font-size: 28px;
            margin-right: 10px;
          }
        }
      }
    }

    .mobile-menu {
      display: block;
      cursor: pointer;

      img {
        margin: -10px;
        width: 50px;
      }
    }

    .account-info-wrapper {
      display: flex;
      align-items: center;
      padding: 0;

      .account-avatar {
        width: 28px;
        height: 28px;
      }

      .account-vip {
        font-size: 18px;
        margin-left: 6px;
      }

      .account-name {
        margin-top: 0;
        margin-left: 6px;
      }

      .account-balance {
        margin-left: 6px;
      }
    }

    .account-menu-wrapper {
      width: 100%;
    }
  }
}
</style>
<style scoped lang="scss">
@media (max-width: 767px) {
  .mobile-menu :deep(.anticon) {
    font-size: 28px;
  }
  :deep(.ant-dropdown) {
    border: solid 1px #ffffff;
  }
  :deep(.ant-dropdown-menu) {
    background-color: #1b232d;
  }
}
</style>
