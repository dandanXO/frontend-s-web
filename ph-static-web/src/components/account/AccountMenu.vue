<template>
  <div class="account-menu-container">
    <div class="account-info-wrapper">
      <div class="vip-badge">
        <img
          v-if="vip === 'VIP0'"
          src="../../assets/images/vip/badge/badge-0.png"
        />
        <img
          v-if="vip === 'VIP1'"
          src="../../assets/images/vip/badge/badge-1.png"
        />
        <img
          v-if="vip === 'VIP2'"
          src="../../assets/images/vip/badge/badge-2.png"
        />
        <img
          v-if="vip === 'VIP3'"
          src="../../assets/images/vip/badge/badge-3.png"
        />
        <img
          v-if="vip === 'VIP4'"
          src="../../assets/images/vip/badge/badge-4.png"
        />
        <img
          v-if="vip === 'VIP5'"
          src="../../assets/images/vip/badge/badge-5.png"
        />
        <img
          v-if="vip === 'VIP6'"
          src="../../assets/images/vip/badge/badge-6.png"
        />
        <img
          v-if="vip === 'VIP7'"
          src="../../assets/images/vip/badge/badge-7.png"
        />
      </div>
      <div class="account-name">{{ loginName }}</div>
    </div>
    <div class="web-menu" :class="{ 'menu-active': personalMenuVisible }">
      <div class="account-menu-wrapper">
        <router-link
          to="/center/top-up"
          class="flex-box flex-align-center account-menu-item"
        >
          <RiWallet3Line />
          Deposit
        </router-link>
        <router-link
          to="/center/withdraw"
          class="flex-box flex-align-center account-menu-item"
        >
          <RiBankCardLine />
          Quick Withdraw
        </router-link>
        <!-- <router-link
          to="/center/transfer"
          class="flex-box flex-align-center account-menu-item"
        >
          <RiExchangeDollarLine />
          Quick Transfer
        </router-link> -->
        <router-link
          to="/center/transit-record"
          class="flex-box flex-align-center account-menu-item"
        >
          <RiShieldFlashLine />
          Transit Record
        </router-link>
      </div>
      <div class="account-menu-wrapper last">
        <router-link
          to="/center/personal"
          class="flex-box flex-align-center account-menu-item"
        >
          <RiUser5Line />
          Personal Infomation
        </router-link>
        <router-link
          to="/center/withdrawbank"
          class="flex-box flex-align-center account-menu-item"
        >
          <RiBankLine />
          Withdraw Bank Card
        </router-link>

        <router-link
          to="/center/mailbox"
          class="flex-box flex-align-center account-menu-item"
        >
          <RiMailLine />
          Mailbox
        </router-link>
        <!-- <router-link
          to="/center/voucher-code"
          class="flex-box flex-align-center account-menu-item"
        >
          <RiCoupon3Line />
          Voucher Code
        </router-link> -->
        <router-link
          to="/center/share"
          class="flex-box flex-align-center account-menu-item"
        >
          <RiShareBoxLine />
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
          Personal Infomation
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
  RiBankLine,
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
  .web-menu {
  }

  .account-info-wrapper {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 2px;
    gap: 10px;
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
      color: #ffffff;
      font-size: 20px;
      // flex: 2;
    }
    .vip-badge {
      // flex: 1;
      width: 100px;
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

  .account-menu-wrapper {
    padding: 30px 20px;
    border-bottom: 2px solid #2b2b4b;

    &.last {
      border: 0;
    }

    .account-menu-item {
      color: #ffffff;
      width: 100%;
      font-size: 16px;
      padding: 10px 20px;
      font-weight: bold;

      .remixicon {
        fill: #ffffff;
        width: 30px;
        margin-right: 15px;
      }
    }
  }

  .mobile-menu {
    display: none;
    color: #ffffff;

    svg {
      fill: #ffffff;
      width: 50px;
      margin-bottom: -5px;
      display: block;
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
  &.account-menu-item {
    color: #ffffff;
    background: #2b2b4b;

    border-radius: 20px;
  }

  .remixicon {
    fill: #ffffff;
  }

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
@media (max-width: 768px) {
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
        background: #23263c;
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
@media (max-width: 768px) {
  .mobile-menu :deep(.anticon) {
    font-size: 28px;
  }
  :deep(.ant-dropdown) {
    border: solid 1px #ffffff;
  }
  :deep(.ant-dropdown-menu) {
    background-color: #1b232d;
  }
  :deep(.ant-dropdown-menu-item-divider, .ant-dropdown-menu-submenu-title-divider) {
    background-color: #ffffff;
  }
}
</style>
