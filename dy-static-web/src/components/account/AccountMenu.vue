<template>
  <div class="account-menu-container">
    <div class="account-info-wrapper">
      <img class="account-avatar" src="../../assets/images/account/avatar.png" />
      <div class="account-name">
        欢迎您 {{ loginName }}
        <el-tag type="warning" class="account-vip">{{ vip }}</el-tag>
      </div>
    </div>
    <div class="web-menu" :class="{ 'menu-active': 'personalMenuVisible' }">
      <div class="menu-box">
        <div class="account-menu-title">财务中心</div>
        <hr />
        <div class="account-menu-list">
          <router-link to="/center/deposit" class="account-menu-item">
            <div class="deposit-icon" />
            充值中心
          </router-link>
          <router-link to="/center/withdraw" class="account-menu-item">
            <div class="withdraw-icon" />
            快速提款
          </router-link>
          <router-link to="/center/transfer" class="account-menu-item">
            <div class="transfer-icon" />
            快速转账
          </router-link>
          <router-link to="/center/transit-record" class="account-menu-item">
            <div class="transaction-icon" />
            交易记录
          </router-link>
        </div>
      </div>
      <div class="menu-box">
        <div class="account-menu-title">个人中心</div>
        <hr />
        <div class="account-menu-list last">
          <router-link to="/center/personal" class="account-menu-item">
            <div class="personal-info-icon" />
            个人资料
          </router-link>
          <router-link to="/center/withdrawbank" class="account-menu-item">
            <div class="bank-icon" />
            银行卡管理
          </router-link>
          <router-link to="/center/mailbox" class="account-menu-item">
            <div class="mail-icon" />
            消息中心
          </router-link>

          <router-link to="/vip" class="account-menu-item">
            <div class="vip-icon" />
            VIP专属
          </router-link>
          <!--        <router-link-->
          <!--          to="/center/voucher-code"-->
          <!--          class="account-menu-item"-->
          <!--        >-->
          <!--          <RiCoupon3Line />-->
          <!--          分享好友-->
          <!--        </router-link>-->
          <router-link to="/center/share" class="account-menu-item">
            <div class="share-icon" />
            推广赚钱
          </router-link>
          <router-link to="/center/feedback" class="account-menu-item">
            <div class="feedback-icon" />
            反馈奖励
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { userStore } from "@/store";
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
        color: #2d3f61;
      }
    }
    .account-vip {
      // color: #436aa0;
    }
  }
}
</style>
<style lang="scss" scoped>
.deposit-icon, .withdraw-icon, .transfer-icon, .transaction-icon, .personal-info-icon, .bank-icon, .mail-icon, .vip-icon, .share-icon, .feedback-icon{
  background: url("../../assets/images/account/account-menu-icons.png") no-repeat center center;
  background-size: auto 100%;
  width: 28px;
  height: 28px;
}

.deposit-icon {
  background-position: 0% 0%;
}

.withdraw-icon {
  background-position: 11% 0%;
}

.transfer-icon {
  background-position: 22% 0%;
}

.transaction-icon {
  background-position: 33% 0%;
}

.personal-info-icon {
  background-position: 44.5% 0%;
}

.bank-icon {
  background-position: 54.5% 0%;
}

.mail-icon {
  background-position: 66.5% 0%;
}

.vip-icon {
  background-position: 78% 0%;
}

.share-icon {
  background-position: 88.5% 0%;
}

.feedback-icon {
  background-position: 99.5% 0%;
}
</style>