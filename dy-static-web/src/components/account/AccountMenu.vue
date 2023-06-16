<template>
  <div class="account-menu-container">
    <div class="account-info-wrapper">
        <!-- <img
          class="account-avatar"
          :src="require(`../../assets/images/vip/badge/v1.png`)"
          alt=""
        /> -->
        <img class="account-avatar" src="../../assets/images/account/avatar.png">
      <div class="account-name">欢迎您 {{ loginName }}<el-tag type="warning" class="account-vip">{{ vip }}</el-tag></div>

    </div>
    <div class="web-menu" :class="{ 'menu-active': 'personalMenuVisible' }">
      <div class="menu-box">
      <div class="account-menu-title">财务中心</div>
      <hr>
      <div class="account-menu-list">
        <router-link
          to="/center/deposit"
          class="account-menu-item"
        >
          <RiWallet3Fill class="pink" />
          充值中心
        </router-link>
        <router-link
          to="/center/withdraw"
          class="account-menu-item"
        >
          <RiBankCardFill class="blue" />
          快速提款
        </router-link>
        <router-link
          to="/center/transfer"
          class="account-menu-item"
        >
          <RiExchangeDollarFill class="grey" />
          快速转账
        </router-link>
        <router-link
          to="/center/transit-record"
          class="account-menu-item"
        >
          <RiShieldFlashFill class="green" />
          交易记录
        </router-link>
      </div>
    </div>
    <div class="menu-box">
      <div class="account-menu-title">个人中心</div>
      <hr>
      <div class="account-menu-list last">
        <router-link
          to="/center/personal"
          class="account-menu-item"
        >
          <RiAccountBoxFill class="orange" />
         个人资料
        </router-link>
        <router-link
          to="/center/withdrawbank"
          class="account-menu-item"
        >
          <RiBankFill class="pink" />
          银行卡管理
        </router-link>
        <router-link
          to="/center/mailbox"
          class="account-menu-item"
        >
          <RiMailFill class="blue" />
          收发信息
        </router-link>
<!--        <router-link-->
<!--          to="/center/voucher-code"-->
<!--          class="account-menu-item"-->
<!--        >-->
<!--          <RiCoupon3Line />-->
<!--          分享好友-->
<!--        </router-link>-->
        <router-link
          to="/center/share"
          class="account-menu-item"
        >
          <RiShareBoxFill class="green" />
          分享好友
        </router-link>
      </div></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { userStore } from "@/store";
import {
  RiWallet3Fill,
  RiBankCardFill,
  RiMailFill,
  RiExchangeDollarFill,
  RiShieldFlashFill,
  RiCoupon3Line,
  RiShareBoxFill,
  RiFileShieldLine,
  RiMenuLine,
  RiBankFill,
RiAccountBoxFill,
} from "vue-remix-icons";

{
  RiWallet3Fill,
    RiBankCardFill,
    RiMailFill,
    RiExchangeDollarFill,
    RiShieldFlashFill,
    RiCoupon3Line,
    RiShareBoxFill,
    RiFileShieldLine,
    RiMenuLine,
    RiBankFill;
}
const store = userStore();
const loginName = computed(() => {
  return store.nickName;
});

const vipLevel = computed(() => {
  if (store.vip.toUpperCase() === 'NORMAL') {
    return 1
  }
  return store.vip;
});
const vip = computed(() => {
  return vipLevel.value
});

</script>
<style lang="scss">
.account-container {
  background-size: cover;
  background-position: center center;
  .account-container-wrap {
    .account-avatar {
      width: 98px;
    }
  .account-name {
display: flex;
gap: 5px;
    margin: 10px 0 14px;
    .name {
      color: #2d3f61
    }
  }
  .account-vip {
        // color: #436aa0;
  }
  }
}


</style>
