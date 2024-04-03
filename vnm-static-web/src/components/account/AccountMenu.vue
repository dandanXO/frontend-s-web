<template>
  <div class="account-menu-container">
    <div class="account-info-wrapper">
      <div class="account-info-bg">
        <img class="account-avatar" src="../../assets/images/home/profile-pic.png" />
        <div class="account-name">{{$t('account.welcome')}} {{ loginName }}</div>
        <span class="account-vip-label">{{ vip }}</span>
        <div @click="refreshBalance" class="account-details-balance">
          <span>{{$t('account.mainWallet')}}:</span>
          <span class="amount">
            <span v-if="isLoadingBalance">{{$t('common.loading')}}...</span>
            <span v-if="!isLoadingBalance">{{ store.currency.value }} {{ displayBalance(store.balance) }}</span>
          </span>
          <el-icon>
            <RiRefreshLine color="#468CFF" />
          </el-icon>
        </div>
        <div class="profile-actions">
          <router-link to="/center/deposit" class="action-btn">
            <div class="icon-rounded">
              <img src="../../assets/images/home/profile-action-deposit.png" />
            </div>
            {{ $t('menu.deposit') }}
          </router-link>
          <router-link to="/center/withdraw" class="action-btn">
            <div class="icon-rounded">
              <img src="../../assets/images/home/profile-action-withdraw.png" />
            </div>
            {{ $t('menu.withdraw') }}
          </router-link>
          <!-- <router-link to="/center/transfer" class="action-btn">
            <div class="icon-rounded">
              <img src="../../assets/images/home/profile-action-transfer.png" />
            </div>
            {{ $t('menu.transfer') }}
          </router-link> -->
        </div>
      </div>
    </div>
    <div class="web-menu" :class="{ 'menu-active': 'personalMenuVisible' }">
      <div class="menu-box">
        <div class="account-menu-list">
          <router-link v-for="item in menuItems" :key="item.route" :to="item.route" class="account-menu-item">
            <img class="account-avatar" :src="require(`../../assets/images/account/menu-icon-${item.icon}.png`)" />
            {{ item.label }}

            <div v-if="item.icon==='inbox' && store.unreadTotal > 0" class="unread-total"><span>{{store.unreadTotal}}</span></div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { userStore } from "@/store";
import {
  RiRefreshLine,
} from 'vue-remix-icons';
import { useI18n } from "vue-i18n";
import { i18nStore } from '@/store/language'
import { storeToRefs } from 'pinia'
import { displayBalance } from "@/utils/utils";
const i18nStoreLanguage = i18nStore()
const { languageVal } = storeToRefs(i18nStoreLanguage)
const { t } = useI18n();
const store = userStore();
const isLoadingBalance = ref(false);
const refreshBalance = () => {
  isLoadingBalance.value = true;
  store.getBalance().then(() => {
    isLoadingBalance.value = false;
  });
};

const loginName = computed(() => {
  return store.nickName;
});

const vip = computed(() => {
  if (store.vip.toUpperCase() === "NORMAL") {
    return 1;
  }
  return store.vip;
});

  watch(languageVal, (newValue, oldValue) => {
    
    menuItems.value = [
        { route: "/center/share", label: t('menu.referFriend'), icon: "share" },
        { route: "/center/transit-record", label: t('menu.transactionRecord'), icon: "transitrecord" },
        { route: "/center/personal", label: t('menu.personalInfo'), icon: "personal" },
        { route: "/center/mailbox", label: t('menu.mailbox'), icon: "inbox" },
      ]
  });
  
const menuItems = ref([
  { route: "/center/share", label: t('menu.referFriend'), icon: "share" },
  // { route: "/center/deposit", label: "充值中心", icon: "transitrecord" },
  // { route: "/center/withdraw", label: "快速提款", icon: "transitrecord" },
  // { route: "/center/transfer", label: "快速转账", icon: "transitrecord" },
  { route: "/center/transit-record", label: t('menu.transactionRecord'), icon: "transitrecord" },
  // { route: "/center/transit-record?type=6", label: "投注记录", icon: "betrecord" },
  { route: "/center/personal", label: t('menu.personalInfo'), icon: "personal" },
  // { route: "/center/withdrawbank", label: "银行卡管理", icon: "transitrecord" },
  { route: "/center/mailbox", label: t('menu.mailbox'), icon: "inbox" },
  // { route: "/vip", label: "VIP特权", icon: "vip" },
  // // { route: "/center/promo", label: "优惠领取", icon: "promo" },
  // { route: "/center/feedback", label: "会员建议", icon: "feedback" },
]);
</script>

<style lang="scss">
.account-container {
  background-size: cover;
  background-position: center center;
  .account-container-wrap {
    .account-avatar {
      width: 75px;
    }
    .account-name {
      display: flex;
      gap: 5px;
      margin: 10px 0 14px;
      color: $color-white;
    }
    .account-vip-label {
      background-image: url(../../assets/images/account/vip-label.png);
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 63px 17px;
      width: 100%;
      height: 17px;
      font-size: 0.675rem;
      color: $color-white;
      padding-left: 21px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .account-details-balance {
      margin-top: 10px;
      color: $color-white;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;
      svg {
        color: #ffffff;
      }
      .amount {
        font-family: 'Roboto';
      }
    }

    .profile-actions {
      display: flex;
      justify-content: space-evenly;
      margin-top: 15px;
      width: 100%;

      .action-btn {
        gap: 5px;
        width: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 0.75rem;
        color: $color-white;
        cursor: pointer;

        &:hover {
          .icon-rounded {
            box-shadow: 0px 2px 5px 0px #498bd1 inset;
          }
        }

        .icon-rounded {
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: $color-white;
          box-shadow: 0px 2px 5px 0px #bbdcff inset;
        }

        img {
          display: block;
          width: 16px;
        }
      }
    }
  }

  .unread-total{
    width: 45px;
    height: 25px;
    border-radius: 25px;
    text-align: center;
    color:#fff;
    background: red;
    font-size: 16px;
    line-height: 25px;
  }
}
</style>
