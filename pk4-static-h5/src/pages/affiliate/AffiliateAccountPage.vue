<template>
  <q-page>
    <div class="affiliate-setting-section">
      <div class="top-profile">
        <div class="user">
          <img src="../../assets/images/affiliate/user.png">
          <span>{{ $t('affiliate.main.goodMorning') }} {{ store.nickName }}</span>
        </div>
        <div class="cs"><img src="../../assets/images/affiliate/cs.png"></div>
      </div>
      <div class="total-section">
        <div class="total-txt">{{ $t('affiliate.main.total') }}</div>
        <q-spinner v-if="isLoading" class="total-amt"/>
        <div v-else class="total-amt"> {{ stats.total }}</div>
      </div>
    </div>
      
    <div class="deposit-withdraw-section">
        <router-link to="/withdraw" class="wdw-btn">
          <div class="acct-nav-label">{{ $t("settings.withdraw") }}</div>
          <img src="../../assets/images/affiliate/btn-wdw.png" />
        </router-link>
        <router-link to="/deposit" class="dep-btn">
          <div class="acct-nav-label">{{ $t("settings.deposit") }}</div>
          <img src="../../assets/images/affiliate/btn-dep.png" />
        </router-link>
    </div>
    <div class="data-section" @click="initData">
      <div class="row-section" >
        <q-spinner v-if="isLoading" class="data-number"/>
        <span class="data-number" v-else @click="initData">{{ stats.logins }}</span>
        <span class="data-name" >{{ $t('affiliate.main.logins') }}</span>
      </div>
      <div class="row-section">
        <q-spinner v-if="isLoading" class="data-number"/>
        <span class="data-number" v-else>{{ stats.noOfPlayers }}</span>
        <span class="data-name">{{ $t('affiliate.main.noOfPlayers') }}</span>
      </div>
      <div class="row-section">
        <q-spinner v-if="isLoading" class="data-number"/>
        <span class="data-number" v-else>{{ stats.registers }}</span>
        <span class="data-name">{{ $t('affiliate.main.registers') }}</span>
      </div>
    </div>

      <div class="bottom-affiliate-setting-section">
        <router-link to="/affiliate/overview">
          <div class="acct-nav-item">
            <img src="../../assets/images/affiliate/menu/overview.png" />
          </div>
          <div class="acct-nav-label">{{ $t("affiliateSettings.overview") }}</div>
        </router-link>
        
        <router-link to="/affiliate/account-record">
          <div class="acct-nav-item">
            <img src="../../assets/images/affiliate/menu/account-record.png" />
          </div>
          <div class="acct-nav-label">{{ $t("affiliateSettings.accountRecord") }}</div>
        </router-link>
        
        
        <router-link to="/affiliate/team-management">
          <div class="acct-nav-item">
            <img src="../../assets/images/affiliate/menu/team-management.png" />
          </div>
          <div class="acct-nav-label">{{ $t("affiliateSettings.teamManagement") }}</div>
        </router-link>
        
        
        <router-link to="/affiliate/team-pnl">
          <div class="acct-nav-item">
            <img src="../../assets/images/affiliate/menu/team-pnl.png" />
          </div>
          <div class="acct-nav-label">{{ $t("affiliateSettings.teamPnl") }}</div>
        </router-link>
        
        
        <router-link to="/affiliate/team-betting">
          <div class="acct-nav-item">
            <img src="../../assets/images/affiliate/menu/team-betting.png" />
          </div>
          <div class="acct-nav-label">{{ $t("affiliateSettings.teamBetting") }}</div>
        </router-link>
        
        
        <!-- <router-link to="/affiliate/edit-rebate">
          <div class="acct-nav-item">
            <img src="../../assets/images/affiliate/menu/edit-rebate.png" />
          </div>
          <div class="acct-nav-label">{{ $t("affiliateSettings.editRebate") }}</div>
        </router-link> -->
        
        
        <!-- <router-link to="/affiliate/security-center">
          <div class="acct-nav-item">
            <img src="../../assets/images/affiliate/menu/security-center.png" />
          </div>
          <div class="acct-nav-label">{{ $t("affiliateSettings.securityCenter") }}</div>
        </router-link> -->

        
        
        <router-link to="/affiliate/internal-message">
          <div class="acct-nav-item">
            <img src="../../assets/images/affiliate/menu/internal-message.png" />
          </div>
          <div class="acct-nav-label">{{ $t("affiliateSettings.internalMessage") }}</div>
        </router-link>

        
        
        <a :href="CSAUrl" target="_blank">
          <div class="acct-nav-item">
            <img src="../../assets/images/affiliate/menu/customer-service.png" />
          </div>
          <div class="acct-nav-label">{{ $t("affiliateSettings.customerService") }}</div>
        </a>
      </div>
  </q-page>

  <q-dialog  width="100%" v-model="confirmSignOutDialog" persistent>
    <div class="popout-dialog">
      <q-btn dense rounded icon="close" class="text-white popout-close" v-close-popup />
      <div class="popout-dialog-container">
        <div class="txt-title">{{ $t("btn.signOut") }}</div>

        <div class="txt-content q-mt-md text-center">{{ $t("notify.signOutMessage") }}</div>

        <div style="width: 100%;" class="q-mt-lg q-pl-lg q-pr-lg y-n-container">
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
import { onActivated, onMounted, ref } from "vue";
import { userStore } from "src/stores";
import { useRoute } from "vue-router";
import ExchangeModal from "src/components/account/ExchangeModal.vue";
import TransferModal from "src/components/account/TransferModal.vue";
import { api } from "boot/axios";
import { useUI } from "stores/ui";
import { storeToRefs } from "pinia";

const store = userStore();
const route = useRoute();
const ui = useUI();
const { CSAUrl } = storeToRefs(ui);
const showExchangeModal = ref(false);
const showTransferModal = ref(false);
const isLoading = ref(false);
const stats = ref({
  total: '-',
  logins: '-',
  noOfPlayers: '-',
  registers: '-',
  onlineUsers: '-'
});

onActivated(() => {
  store.getUnreadTotal();

  if (route.query.openCodeModal) {
    showExchangeModal.value = true;
  }

  initData();
});

const initData = () => {
  isLoading.value = true;

  api.get('/session/affiliate/home-page').then((res) => {
    const data = res.data;
    stats.value.total = data.balance;
    stats.value.logins = data.todayLogin;
    stats.value.noOfPlayers = data.todayActive;
    stats.value.registers = data.todayRegister;
  }).finally(() => {
    isLoading.value = false;
  })
}

onMounted(() => {
  initData();

  if(!ui.CSAUrl) {
    ui.loadCustomerAddress();
  }
});

</script>

<style scoped lang="scss">
.affiliate-setting-section {
  .top-profile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    margin: 0 auto;
    
    .user {
      display: flex;
      img {
        margin-right: 10px;
        width: 18px;
      }
      font-weight: 400;
      font-size: 12.94px;
      color: #ffffff;
    }
    .cs {
      img {
        width: 18px;
      }
    }
  }
  background: url(src/assets/images/affiliate/setting-bg.png) no-repeat center center;
  // padding-top: 175px;
  padding-top: 10px;
  background-size: cover;
  position: relative;
  
}

.total-section {
  display: flex;
  width: 100px;
  height: 140px;
  padding-bottom: 45px;
  margin: 0 auto;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
  .total-txt {
    font-size: 16px;
  }
  .total-amt {
    font-size: 26px;
    font-weight: bold;
  }
}

.deposit-withdraw-section {
    width: 90%;
    margin: 0 auto;
    display: flex;
    // gap: 10px;
    :not(:last-child) {
      margin-right: 10px;
    }
    a {
      display: flex;
      width: 100%;
      text-decoration: none;
      justify-content: center;
      align-items: center;
      padding: 5px;
      gap: 5px;
      img {
        width: 50px;
        display: block;
      }
      &:nth-child(1) {
        border-radius: 10px;
        color: #ffffff;
        font-weight: bold;
        background: linear-gradient(90deg, #FF676B 0%, #F9D697 100%);
      }
      &:nth-child(2) {
        border-radius: 10px;
        color: #ffffff;
        font-weight: bold;
        background: linear-gradient(90deg, #FEB94A 0%, #FFA54D 100%);
        background-size: contain;
      }
    }
  }
  .data-section {
    display: flex;
    justify-content: space-between;
    width: 95%;
    margin: 20px auto;
    .row-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .data-number {
        font-weight: bold;
        color: #ffffff;
        font-size: 26px;
      }
      .data-name {
        color: #B3BEC1;
        font-size: 14px;
        letter-spacing: -1px;
      }
    }
  }
.bottom-affiliate-setting-section {
  margin: 5px 20px 20px;

  border-radius: 10px;
  background: linear-gradient(90deg, #1C273D 0%, #12192B 100%);
  padding: 10px;
  display: flex;
  flex-direction: column;
  .acct-nav-item {
    width: 25px;
    img{ 
      width: 100%;
    }
  }
  a {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #ffffff;
    padding: 10px;
    // gap: 10px;
    :not(:last-child) {
      margin-right: 10px;
    }
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
      background: url(../../assets/images/common/goright.png) no-repeat center center;
      background-size: cover;
      width: 20px;
      height: 20px;
    }
  }
}

.acct-nav {
  margin: 5px 20px 20px;
    background: linear-gradient(90deg, #1C273D 0%, #12192B 100%);
  border-radius: 10px;

  padding: 20px 0 0;
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
      > div {
        margin-bottom: 10px;
      }
      width: 100%;
      text-align: center;
      align-items: center;
      justify-content: flex-start;
      margin: 0 auto;

      .acct-nav-label {
        color: #fff;
        font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-weight: 700;
        font-size: 12px;
        line-height: 120%;
        letter-spacing: 0px;
        text-align: center;
        vertical-align: middle;
      }

      .acct-nav-item {
        border-radius: 50%;
        height: 22px;
        width: 22px;
        cursor: pointer;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        color: #000;
        filter: brightness(100);
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
  width: calc(95% - 20px);
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  :not(:last-child) {
    margin-right: 5px;
  }
  img {
    width: 30px;
  }
  .acct-nav-label {
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
  }

  &:active {
    filter: brightness(1.2);
    transform: translate(0px, 1px);
  }
}

</style>

<style lang="scss">

$colors: (
  #6D98FC,
  #CD9321,
  #D46ECC,
  #F43F40,
  #4CB759,
  #6487EC,
  #F130A1,
  #728BAD,
  #A43FFF,
  #9769EA,
  #5370E0,
  #806888,
  #1090ED
);
@for $i from 1 through length($colors) {
  $color: nth($colors, $i);
  .vipitem#{$i - 1} .q-avatar {
    border: 2px solid $color;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
  }
}
.q-page {
  min-height: 0 !important;
}
</style>
