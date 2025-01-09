<template>
  <div class="account-menu-container">
    <div class="account-info-wrapper" style="text-align: center">
      <!-- <img
        class="account-avatar"
        :src="require(`../../assets/images/vip/badge/v${store.vip.split('VIP')[1]}.png`)"
        alt=""
      /> -->
      <div class="account-avatar">
        <img :src="require(`../../assets/images/vip/avatar-icon.png`)">
      </div>

      <div class="account-name">{{ loginName }}<span class="vipbg"> {{ vip }}</span></div>
      <!-- <div class="account-vip">{{ vip }}</div> -->
    </div>
    <div class="web-menu" :class="{ 'menu-active': 'personalMenuVisible' }">
      <!-- <div class="account-menu-title">财务中心</div> -->
      <div class="account-menu-list">
        <router-link to="/center/deposit" class="account-menu-item">
          <RiWallet3Fill />
          存款
        </router-link>
        <router-link to="/center/withdraw" class="account-menu-item">
          <RiBankCardFill />
          取款
        </router-link>
        <router-link to="/center/transfer" class="account-menu-item">
          <RiExchangeDollarFill />
          转账
        </router-link>
        <router-link to="/center/transit-record" class="account-menu-item">
          <img class="sideicon" src="@/assets/images/account/money.svg" />
          <img class="sideicon hover" src="@/assets/images/account/money_hover.svg" />
          交易记录
        </router-link>
      </div>
      <!-- <div class="account-menu-title">个人中心</div> -->
      <div class="account-menu-last">
        <router-link to="/center/personal" class="account-menu-item">
          <img class="sideicon" src="@/assets/images/account/idcard.svg" />
          <img class="sideicon hover" src="@/assets/images/account/idcard_hover.svg" />
          个人资料
        </router-link>
        <router-link to="/center/withdrawbank" class="account-menu-item">
          <RiBankFill />
          银行卡管理
        </router-link>
        <router-link to="/center/mailbox" class="account-menu-item">
          <RiMailFill />
          反馈奖励
        </router-link>
        <router-link to="/center/message" class="account-menu-item">
          <RiMessageFill />
          <div class="account-menu-item-message">
            <div>
              消息中心
            </div>
            <div v-if="store.unreadTotal > 0" class="unread-total">
              <span>{{ store.unreadTotal }}</span>
            </div>
          </div>
        </router-link>
        <router-link to="/center/share" class="account-menu-item">
          <RiShareBoxFill />
          推广赚钱
        </router-link>
        <!--        <router-link-->
        <!--          to="/center/share"-->
        <!--          class="account-menu-item"-->
        <!--        >-->
        <!--          <RiShareBoxFill />-->
        <!--          邀请好友-->
        <!--        </router-link>-->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { userStore } from "@/store";
import {
  RiWallet3Fill,
  RiHeartFill,
  RiBankCardFill,
  RiMailFill,
  RiExchangeDollarFill,
  RiShieldFlashFill,
  RiCoupon3Fill,
  RiShareBoxFill,
  RiFileShieldFill,
  RiMenuFill,
  RiBankFill,
  RiMessageFill
} from "vue-remix-icons";

{
  RiWallet3Fill,
    RiHeartFill,
    RiBankCardFill,
    RiMailFill,
    RiExchangeDollarFill,
    RiShieldFlashFill,
    RiCoupon3Fill,
    RiShareBoxFill,
    RiFileShieldFill,
    RiMenuFill,
    RiBankFill;
}
const store = userStore();
const loginName = computed(() => {
  return store.nickName;
});

const vipLevel = computed(() => {
  if (store.vip.toUpperCase() === "NORMAL") {
    return 1;
  }
  return store.vip;
});
const vip = computed(() => {
  return vipLevel.value;
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

<style lang="scss" scoped>
.account-menu-item-message {
  position: relative;

  .unread-total {
    position: absolute;
    top: -10px;
    right: -25px;
    Fill-height: normal !important;
    Fill-height: unset;
    padding: 1px 6px;
    background: #db0011;
    border-radius: 25px;
    margin-right: 5px;
    font-size: 10px;
    color: #fff;
  }
}
</style>