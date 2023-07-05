<template>
  <div class="account-menu-container">
    <div class="account-info-wrapper" style="text-align: center;">
        <img
          class="account-avatar"
          :src="require(`../../assets/images/vip/badge/v${(store.vip.split('VIP')[1])}.png`)"
          alt=""
        />
        
      <div class="account-name">欢迎您 {{ loginName }}</div>
      <div class="account-vip">{{ vip }}</div>
    </div>
    <div class="web-menu" :class="{ 'menu-active': 'personalMenuVisible' }">
      <div class="account-menu-title">财务中心</div>
      <div class="account-menu-list">
        <router-link
          to="/center/deposit"
          class="account-menu-item"
        >
          <RiWallet3Line />
          充值中心
        </router-link>
        <router-link
          to="/center/withdraw"
          class="account-menu-item"
        >
          <RiBankCardLine />
          快速提款
        </router-link>
        <router-link
          to="/center/transfer"
          class="account-menu-item"
        >
          <RiExchangeDollarLine />
          快速转账
        </router-link>
        <router-link
          to="/center/transit-record"
          class="account-menu-item"
        >
          <RiShieldFlashLine />
          交易记录
        </router-link>
      </div>
      <div class="account-menu-title">个人中心</div>
      <div class="account-menu-list last">
        <router-link
          to="/center/personal"
          class="account-menu-item"
        >
          <RiUser5Line />
         个人资料
        </router-link>
        <router-link
          to="/center/withdrawbank"
          class="account-menu-item"
        >
          <RiBankLine />
         银行卡管理
        </router-link>
        <router-link
          to="/center/mailbox"
          class="account-menu-item"
        >
          <RiMailLine />
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
          <RiShareBoxLine />
          邀请好友
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { userStore } from "@/store";
import {
  RiWallet3Line,
  RiUser5Line,
  RiBankCardLine,
  RiMailLine,
  RiExchangeDollarLine,
  RiShieldFlashLine,
  RiCoupon3Line,
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
    RiCoupon3Line,
    RiShareBoxLine,
    RiFileShieldLine,
    RiMenuLine,
    RiBankLine;
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
  .account-container-wrap {

  .account-name {

    margin: 10px 0 14px;
  }
  .account-vip {
        color: #436aa0;
  }
  }
}


</style>
