<template>
  <!-- <ProfileSummary :homeProfile="true" /> -->

  <q-page>
    <div class="affiliate-setting-section">
      <div class="top-profile">
        <div class="user">
          <img src="../../assets/images/affiliate/user.png">
          <span>Good morning {{ store.nickName }}</span>
        </div>
        <div class="cs"><img src="../../assets/images/affiliate/cs.png"></div>
      </div>
      <div class="total-section">
        <div class="total-txt">Total</div>
        <div class="total-amt">{{ total }}</div>
      </div>
      <!-- <div class="top-section-inner">
      </div> -->
    </div>
      
    <div class="deposit-withdraw-section">
        <router-link to="/withdraw" class="wdw-btn">
          <!-- <div class="acct-nav-item">
          </div> -->
          <div class="acct-nav-label">{{ $t("settings.withdraw") }}</div>
          <img src="../../assets/images/affiliate/btn-wdw.png" />
        </router-link>
        <router-link to="/deposit" class="dep-btn">
          <!-- <div class="acct-nav-item">
          </div> -->
          <div class="acct-nav-label">{{ $t("settings.deposit") }}</div>
          <img src="../../assets/images/affiliate/btn-dep.png" />
        </router-link>
    </div>
    <div class="data-section">
      <div class="row-section" v-for="(item, i) in dataList" :key="i">
        <span class="data-number">{{ item.number }}</span>
        <span class="data-name">{{ item.name }}</span>
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
        
        
        <router-link to="/affiliate/edit-rebate">
          <div class="acct-nav-item">
            <img src="../../assets/images/affiliate/menu/edit-rebate.png" />
          </div>
          <div class="acct-nav-label">{{ $t("affiliateSettings.editRebate") }}</div>
        </router-link>
        
        
        <router-link to="/affiliate/security-center">
          <div class="acct-nav-item">
            <img src="../../assets/images/affiliate/menu/security-center.png" />
          </div>
          <div class="acct-nav-label">{{ $t("affiliateSettings.securityCenter") }}</div>
        </router-link>

        
        
        <router-link to="/affiliate/internal-message">
          <div class="acct-nav-item">
            <img src="../../assets/images/affiliate/menu/internal-message.png" />
          </div>
          <div class="acct-nav-label">{{ $t("affiliateSettings.internalMessage") }}</div>
        </router-link>

        
        
        <router-link to="/affiliate/customer-service">
          <div class="acct-nav-item">
            <img src="../../assets/images/affiliate/menu/customer-service.png" />
          </div>
          <div class="acct-nav-label">{{ $t("affiliateSettings.customerService") }}</div>
        </router-link>


<!--        <a v-if="canTransfer" target="_blank" @click="handleTransferClick">-->
<!--          <div class="acct-nav-item">-->
<!--            <img src="src/assets/images/account/transfer-svg.svg" />-->
<!--          </div>-->
<!--          <div class="acct-nav-label">{{ $t("settings.transfer") }}</div>-->
<!--        </a>-->
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
import { onActivated, onMounted, ref, computed } from "vue";
import { userStore } from "src/stores";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import ExchangeModal from "src/components/account/ExchangeModal.vue";
import TransferModal from "src/components/account/TransferModal.vue";
import { api } from "boot/axios";
import { useUI } from "stores/ui";
import { Platform } from "quasar";
import { t } from "src/boot/lang";

const selfTgurl = ref("");
const store = userStore();
const router = useRouter();
const route = useRoute();
const qs = require("qs");
const $q = useQuasar();
const ui = useUI();
const showExchangeModal = ref(false);
const showTransferModal = ref(false);
const total = ref(0);

const dataList = ref([
  { key: 'logins', name: 'Logins', number: "-" },
  { key: 'noOfPlayer', name: 'No of player', number: "-" },
  { key: 'registers', name: 'Registers', number: "-" },
  { key: 'onlineUsers', name: 'Online users', number: "-" }
])
onActivated(() => {
  store.getUnreadTotal();

  if (route.query.openCodeModal) {
    showExchangeModal.value = true;
  }
});

const initData = () => {
  api.get('/session/affiliate').then((res) => {
    const data = res.data;
    total.value = data.commission;

    dataList.value.map((item) => {
      if(item.key === 'noOfPlayer') item.number = data.downlineMember
      if(item.key === 'registers') item.number = data.downlineAffiliate
    })
  })
}

onMounted(() => {
  initData();
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

.total-section {
  display: flex;
  width: 100px;
  height: 200px;
  padding-bottom: 50px;
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
        // background: linear-gradient(90deg, #2ced88 0%, #9ee871 100%);
        // box-shadow: 0px 2.07px 0px 0px #1cca6a;

        // img {
        //   filter: grayscale(1) brightness(0);
        // }
      }
      &:nth-child(2) {
        border-radius: 10px;
        color: #ffffff;
        font-weight: bold;
        background: linear-gradient(90deg, #FEB94A 0%, #FFA54D 100%);
        background-size: contain;
        // background: #455152;
        // box-shadow: 0px 2.07px 0px 0px #2a3637;
        // img {
        //   filter: grayscale(1) brightness(100);
        // }
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

.invite-friends-section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: unset;
  // gap: 10px;
  :not(:last-child) {
    margin-right: 10px;
  }
  .left-icon {
    width: 60px;
    img {
      width: 100%;
    }
  }
  .right-contents {
    font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
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
  // background-color: #292d2e;
  background: #252C46;
  padding: 4px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  min-height: 40px;
  border: 1px solid #ffffff14;

  .link-href {
    padding: 10px 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 11px;
  }
  .link-copy {
    color: #ffffff;
    background: #ffffff0f;

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

      // &:active {
      //   background-color: rgba(255, 255, 255, 0.1);
      //   border-radius: 8px;
      // }

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
  // height: 60px;
  // background: #2e30344f;
  // background-image: url("src/assets/images/account/logout-btn.png");
  // background-repeat: no-repeat;
  width: calc(95% - 20px);
  margin: 20px auto;
  // aspect-ratio: 335/40;
  // background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  // gap: 5px;
  :not(:last-child) {
    margin-right: 5px;
  }
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

// .btn-cancel {
//   // background: radial-gradient(68.92% 68.92% at 50% 50%, #1d341d 0%, #466a45 100%);
//   // border: 1px solid #5d8956;
//   // font-weight: 700;
//   // color: #fff;
//   // border: 1px solid #ffffff80;
//   // border-radius: 12px;
//   // width: 140px;
//   // height: 42px;
//   font-weight: 700;
//   width: 100%;
//   padding: 10px 10px;
//   font-size: 16px;
//   background: #455152;
//   color: #ffffff;

//   box-shadow: 0px 2px 0px 0px #2a3637;
// }
// .btn-confirm {
//   // background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
//   // border: 1px solid #5d8956;
//   // font-weight: 700;
//   // width: 140px;
//   // height: 42px;
//   // color: #fff;
//   // border-radius: 12px;

//   font-weight: 700;
//   width: 100%;
//   padding: 10px 10px;
//   font-size: 16px;
//   background: linear-gradient(90deg, #2ced88 0%, #9ee871 100%);
//   color: #000000;
//   box-shadow: 0px 2px 0px 0px #1cca6a;
//   border-radius: 4px;
//   height: unset;
// }
</style>

<style lang="scss">
// .q-page-container {
//   padding-bottom: 20px !important;
// }

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
