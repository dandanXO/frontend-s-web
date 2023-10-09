<template>

  <div class="vipcard">
    <q-card-section class="vip-name">{{ store.displayName ? store.displayName : store.nickName }}</q-card-section>
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

      <q-card-section class="acct-section">
        <div class="label">{{ $t('lang.main_account') }}</div>
        <div class="amt">{{ mainWallet }}</div>
      </q-card-section>
      <q-separator vertical/>
    </q-card-section>

    <q-select
        class="lang-container"
        placeholder=""
        style="min-height: 30px;height:30px;width: 120px;margin-left:auto;margin-right:8px;"
        v-model="languageVal"
        :options="langOptions"
        option-label="label"
        option-value="value"
        emit-value
        map-options
    >
    </q-select>
  </div>
  <q-item-section class="acct-nav">
    <router-link to="/account/personal">
      <q-card class="acct-nav-item"
              :class="route.path === '/account/personal' ? 'active-class' : '' "
      >
        <RiUser5Line/>
        <div class="acct-nav-label">{{ $t("lang.personal_information") }}</div>
      </q-card>
    </router-link>
    <router-link to="/account/transit">
      <q-card class="acct-nav-item"
              :class="route.path === '/account/transit' ? 'active-class' : '' "
      >
        <RiShieldFlashLine/>
        <div class="acct-nav-label">{{ $t('lang.transaction_records') }}</div>
      </q-card>
    </router-link>
    <router-link to="/promo">
      <q-card class="acct-nav-item"
              :class="route.path === '/promo' ? 'active-class' : '' "
      >
        <RiCoinsLine/>
        <div class="acct-nav-label">{{ $t('lang.promo_page') }}</div>
      </q-card>
    </router-link>

    <router-link to="/account/withdraw">
      <q-card class="acct-nav-item"
              :class="route.path === '/account/withdraw' ? 'active-class' : '' "
      >
        <RiBankLine/>
        <div class="acct-nav-label">{{ $t('lang.withdraw_bank_account') }}</div>
      </q-card>
    </router-link>

    <router-link to="/account/mail">
      <q-card class="acct-nav-item"
              :class="route.path === '/account/mail' ? 'active-class' : '' "
      >
        <RiMailLine/>
        <div class="acct-nav-label mailnav">
          <span>{{ $t('lang.mail_header') }}</span>
          <q-chip style="margin: 0;" color="red">{{ unreadNumber }}</q-chip>
        </div>
      </q-card>
    </router-link>

    <router-link to="/affiliate">
      <q-card class="acct-nav-item"
              :class="route.path === '/affiliate' ? 'active-class' : '' "
      >
        <RiTeamLine/>
        <div class="acct-nav-label">{{ $t('lang.affiliate_page') }}</div>
      </q-card>
    </router-link>
    <router-link v-if="!isH5()" to="/getapp">
      <q-card class="acct-nav-item"
              :class="route.path === '/getapp' ? 'active-class' : '' "
      >
        <RiTabletLine/>
        <div class="acct-nav-label">{{ $t('lang.app') }}</div>
      </q-card>
    </router-link>
    <!--      <router-link to="/vip">-->
    <!--        <q-card class="acct-nav-item">-->
    <!--          <RiVipCrown2Line />-->
    <!--          <div class="acct-nav-label">VIP</div>-->
    <!--        </q-card>-->
    <!--      </router-link>-->
    <router-link to="/share">
      <q-card class="acct-nav-item"
              :class="route.path === '/share' ? 'active-class' : '' "
      >
        <RiShareBoxLine/>
        <div class="acct-nav-label">{{ $t('lang.share_page') }}</div>
      </q-card>
    </router-link>
    <a @click="logout">
      <q-card class="acct-nav-item logout-btn">
        <RiLogoutBoxLine/>
        <div class="acct-nav-label">{{ $t('lang.logout') }}</div>
      </q-card>
    </a>
  </q-item-section>

</template>

<script>
import {defineComponent, ref, computed, onMounted, watch} from "vue";
import {userStore} from "stores/index";
import {
  RiWalletLine,
  RiBankCardLine,
  RiShieldFlashLine,
  RiUser5Line,
  RiBankLine,
  RiMailLine,
  RiVipCrown2Line,
  RiCoinsLine,
  RiShareBoxLine,
  RiTeamLine,
  RiLogoutBoxLine,
  RiTabletLine
} from "vue-remix-icons";
import {useRoute, useRouter} from "vue-router";
import {useUI} from "stores/ui";
import {useI18n} from "vue-i18n";
import {storeToRefs} from "pinia";
import {i18nStore} from "src/router/language";
import {isH5} from "../boot/utils"

export default defineComponent({
  name: "AccountPage",
  components: {
    // RiWalletLine,
    // RiBankCardLine,
    RiShieldFlashLine,
    RiUser5Line,
    RiBankLine,
    RiCoinsLine,
    RiTabletLine,
    RiMailLine,
    // RiVipCrown2Line,
    RiShareBoxLine,
    RiTeamLine,
    RiLogoutBoxLine
  },
  setup() {
    const ui = useUI();
    const route = useRoute();
    const router = useRouter();
    const store = userStore();
    const logout = () => {
      store.memberLogout().then(() => {
        ui.leftDrawerOpen = false;
        router.push('/')
      });
    };


    // console.log(route);

    const unreadNumber = computed(() => {
      return store.unreadCount
    });
    const vip = computed(() => {
      return store.vip;
    });

    const mainWallet = computed(() => {
      const balanceWithTwoDecimalPlaces = parseFloat(store.balance).toFixed(2);
      return store.currency.value + ' ' + balanceWithTwoDecimalPlaces;
    });

    onMounted(() => {
      getBalance()
      // store.getBalance()
      store.getUnreadTotal()
    });

    const openDeposit = () => {
      // to="finance/deposit"
      localStorage.setItem("isOpenFromAccount", JSON.stringify(true));
      router.push('finance/deposit');
    }

    const {t} = useI18n()
    const {languageVal} = storeToRefs(i18nStore());
    const {setLanguage} = i18nStore()
    watch(languageVal, (newVal) => {
      setLanguage(languageVal.value);

      checkRefresh();
    });

    const refreshPages = ['/vip'];
    const checkRefresh = () => {
      // console.log(route.path);
      if (refreshPages.indexOf(route.path) > -1) {
        location.reload()
      }
    }

    const langOptions = [
      {
        label: 'ไทย',
        value: 'th',
      },
      {
        label: 'English',
        value: 'en',
      }
    ]

    const getBalance = () => {
      setInterval(function () {
        if (store.hasToken()) {
          store.getBalance()
        }
      }, 20000);
    }
    return {
      logout,
      mainWallet,
      getBalance,
      vip,
      store,
      route,
      openDeposit,
      unreadNumber,
      languageVal,
      langOptions,
      isH5
    };
  }
});
</script>
<style lang="scss">
.vipcard {
  border-radius: 20px;
  padding: 10px 0;
  margin: 20px 10px 10px;
  border-left: 5px solid $border-color;
  border-right: 5px solid $border-color;

  .q-card__section--vert {
    padding: 0;

    > div {
      flex: 1;
    }
  }

  .q-card__actions .q-btn {
    min-width: 60px;
  }

  .vip-name {
    font-weight: bold;
    text-align: right;
    padding-right: 10px;
    padding-left: 80px;
    color: $header-color;
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

    .acct-nav-label {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &.mailnav {
        width: 100%;
      }
    }

    svg {
      width: 30px;
      fill: white;
      padding: 0;
    }


    &.active-class {
      background: $linear-bg-2;
    }

    &.logout-btn:active {
      background: $linear-bg-2;
    }
  }
}

.vip-badge {
  position: absolute;
  left: 10px;
  top: -40px;
}
</style>
