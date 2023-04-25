<template>
  <div class="page-header">
    <div class="page">{{ header }}</div>
  </div>
  <q-page>
    <div class="vipcard">
      <q-card-section style="font-weight: bold; color: #fb7e42; text-align: right; padding-right: 10px;
    padding-left: 80px;">{{ store.displayName ? store.displayName : store.nickName }}</q-card-section>
      <q-card-section class="top-section">
      <div class="vip-badge">
        <img
          v-if="vip === 'VIP0'"
          src="../assets/vip/badge/badge-0.png"
        />
        <img
          v-if="vip === 'VIP1'"
          src="../assets/vip/badge/badge-1.png"
        />
        <img
          v-if="vip === 'VIP2'"
          src="../assets/vip/badge/badge-2.png"
        />
        <img
          v-if="vip === 'VIP3'"
          src="../assets/vip/badge/badge-3.png"
        />
        <img
          v-if="vip === 'VIP4'"
          src="../assets/vip/badge/badge-4.png"
        />
        <img
          v-if="vip === 'VIP5'"
          src="../assets/vip/badge/badge-5.png"
        />
        <img
          v-if="vip === 'VIP6'"
          src="../assets/vip/badge/badge-6.png"
        />
        <img
          v-if="vip === 'VIP7'"
          src="../assets/vip/badge/badge-7.png"
        />
      </div>
        <!-- <div class="name">{{ header }}</div> -->
        <q-card-section class="acct-section">
          <div class="label">Main account:</div>
          <div class="amt">{{ mainWallet }}</div>
        </q-card-section>
        <q-separator vertical />
      </q-card-section>
      </div>
    <q-card-actions style="display:flex;">
      <q-btn color="positive" class="q-pa-lg" style="flex:1; border-radius: 10px;" @click="openDeposit" no-caps
        ><RiWalletLine style="margin-right: 10px;" /> Deposit</q-btn
      >
      <q-btn color="negative" class="q-pa-lg" to="finance/withdraw" style="flex:1; border-radius: 10px;" no-caps
        ><RiBankCardLine style="margin-right: 10px;" />  Withdraw</q-btn
      >
    </q-card-actions>
    <q-item-section class="acct-nav">
      <router-link to="/account/transit">
        <q-card class="acct-nav-item">
          <RiShieldFlashLine />
          <div class="acct-nav-label">Transit Record</div>
        </q-card>
      </router-link>
      <router-link to="/account/personal">
        <q-card class="acct-nav-item">
          <RiUser5Line />
          <div class="acct-nav-label">Personal Information</div>
        </q-card>
      </router-link>
      <router-link to="/account/withdraw">
        <q-card class="acct-nav-item">
          <RiBankLine />
          <div class="acct-nav-label">Withdrawal Bank Card</div>
        </q-card>
      </router-link>
      <router-link to="/account/mail">
        <q-card class="acct-nav-item">
          <RiMailLine />
          <div class="acct-nav-label">Mailbox</div>
        </q-card>
      </router-link>
      <router-link to="/affiliate">
        <q-card class="acct-nav-item">
          <RiTeamLine />
          <div class="acct-nav-label">Affiliate</div>
        </q-card>
      </router-link>
      <router-link to="/vip">
        <q-card class="acct-nav-item">
          <RiVipCrown2Line />
          <div class="acct-nav-label">VIP</div>
        </q-card>
      </router-link>
      <router-link to="/share">
        <q-card class="acct-nav-item">
          <RiShareBoxLine />
          <div class="acct-nav-label">Share</div>
        </q-card>
      </router-link>
      <a @click="logout">
        <q-card class="acct-nav-item">
          <RiLogoutBoxLine />
          <div class="acct-nav-label">Logout</div>
        </q-card>
      </a>
    </q-item-section>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { userStore } from "stores/index";
import {
  RiWalletLine,
  RiBankCardLine,
  RiShieldFlashLine,
  RiUser5Line,
  RiBankLine,
  RiMailLine,
  RiVipCrown2Line,
  RiShareBoxLine,
  RiTeamLine,
  RiLogoutBoxLine
} from "vue-remix-icons";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "AccountPage",
  components: {
    RiWalletLine,
    RiBankCardLine,
    RiShieldFlashLine,
    RiUser5Line,
    RiBankLine,
    RiMailLine,
    RiVipCrown2Line,
    RiShareBoxLine,
    RiTeamLine,
    RiLogoutBoxLine,
  },
  setup() {
    const router= useRouter();
    const store = userStore();
    const logout = () => {
      store.memberLogout().then(() => {
        // location.reload();
        router.push('/')
      });
    };

    const vip = computed(() => {
      return store.vip;
    });

    const mainWallet = computed(() => {
      return store.currency.value + ' ' + store.balance.toFixed(2);
    });
    onMounted(() => {
      getBalance()
      store.getBalance()
    });

    const openDeposit = () => {
      // to="finance/deposit"
      localStorage.setItem("isOpenFromAccount", JSON.stringify(true));
      router.push('finance/deposit');
    }

    const getBalance = () => {
        setInterval(function(){ if (store.hasToken()) { store.getBalance() } }, 20000);
    }
    return {
      header: "Account",
      logout,
      mainWallet,
      getBalance,
      vip,
      store,
      openDeposit
    };
  }
});
</script>
<style lang="scss">
.vipcard {
  border-radius: 20px;
  padding: 10px 0;
  margin: 0 10px 10px;
  border-left: 5px solid #db7e42;
  border-right: 5px solid #db7e42;
  .q-card__section--vert {
    padding: 0;
    > div {
      flex: 1;
    }
  }
  .q-card__actions .q-btn {
    min-width: 60px;
  }

  .top-section {
    display: flex;
    // flex-direction: column;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    img {
      // max-width: 80px;
    max-width: 55px;
      margin: 0 auto;
      display: block;
    }
  }

  .acct-section {
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: space-evenly;
    width: 100%;
    .q-seperator--dark {
      border-right: 1px solid #ffffff;
    }
    .label {
      font-size: 15px;
    }
    .amt {
      font-size: 40px;
    }
  }
  .bot-section {
    background: #23263c;
    display: flex;
    justify-content: space-around;
    .acct-section {
      display: flex;
      flex-direction: column;
      text-align: center;
      justify-content: space-evenly;
      .q-seperator--dark {
        border-right: 1px solid #ffffff;
      }
      .label {
        font-size: 12px;
      }
      .amt {
        font-size: 50px;
      }
    }
    .q-btn__content {
      font-size: 12px;
      display: flex;
      flex-direction: column;
      svg {
        fill: #ffffff;
        width: 25px;
        display: block;
        padding: 0;
      }
    }
  }
}
.acct-nav {
  gap: 10px;
  margin-bottom: 20px;
  .acct-nav-item {
    cursor: pointer;
    display: flex;
    padding: 20px;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    border-radius: 10px;
    margin: 0 10px;

    svg {
      width: 30px;
      fill: white;
      padding: 0;
    }
  }
}
.vip-badge {
    position: absolute;
    left: 10px;
    top: -40px;
}
</style>
