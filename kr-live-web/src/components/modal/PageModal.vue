<template>
  <q-dialog @hide="closeDialog" v-model="visible" class="page-dialog" no-route-dismiss persistent>
    <q-card style="max-width: none; background: transparent; box-shadow: none">

      <div style="text-align: right;">
        <img class="header-close-btn" src="../../assets/images/index/modal-close-btn.svg" @click="closeDialog()" />
      </div>

      <div class="page-dialog-main">

        <div class="page-dialog-main-container">
          <q-toolbar class="page-dialog-main-header text-white">
            <p class="header-info-description">{{ headerInfo.description }}</p>
            <p class="header-title">
              <span>{{ headerInfo.title }}</span>
              <!-- <br /> -->
              <!-- <span>{{ headerInfo.subTitle }}</span> -->
            </p>
            <p>
              <!-- <img
                class="header-close-btn"
                src="../../assets/images/index/modal-close-btn.svg"
                @click="closeDialog()"
                style="padding-right:10px"
              /> -->
            </p>
          </q-toolbar>
          <div class="page-dialog-links" v-if="!isMinimalMode">
            <p class="header-info-description">{{ headerInfo.description }}</p>
          </div>
          <div class="page-dialog-tabs" :style="isMinimalMode ? '' : 'min-height:600px;'">
            <template v-if="!isMinimalMode">
              <q-tabs style="padding:5px 0px;" v-model="page" align="justify" inline-label>
                <template v-for="item in formattedPagesInfo" :key="item.page">
                  <template v-if="item.page === 'customer/service'">
                    <q-route-tab :href="item?.href" target="_blank" :label="item.info" class="page-dialog-tab"
                      v-if="item.tabIndex === tabIndex">
                      <img style="padding-right: 5px" :src="page === item.page ? item.iconActiveUrl : item.iconUrl"
                        :alt="item.info" />
                    </q-route-tab>
                  </template>
                  <template v-else>
                    <q-tab @click="tabClick(item.page)" :name="item.page" :label="item.info" class="page-dialog-tab"
                      v-if="item.tabIndex === tabIndex">
                      <img style="padding-right: 5px" :src="page === item.page ? item.iconActiveUrl : item.iconUrl"
                        :alt="item.info" />
                    </q-tab>
                  </template>
                </template>
              </q-tabs>
            </template>

            <q-tab-panels v-model="page" animated :style="isMinimalMode ? '' : 'min-height:600px;'">
              <template v-for="item in formattedPagesInfo" :key="item.page">
                <q-tab-panel :name="item.page">
                  <component :is="item.component" @closeModal="closeDialog"></component>
                </q-tab-panel>
              </template>
            </q-tab-panels>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script setup id="PageModal">
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import { ref, defineExpose, reactive, computed, watch, nextTick, onMounted } from "vue";
import { useI18n } from 'vue-i18n';
import FinanceDeposit from "components/pageModalContent/FinanceDeposit";
import FinanceWithdraw from "components/pageModalContent/FinanceWithdraw";
import AnnouncementComponent from "components/pageModalContent/AnnouncementComponent";
import CustomerService from "components/pageModalContent/CustomerService";
import RegisterComponent from "components/pageModalContent/RegisterComponent";
import LoginComponent from "components/pageModalContent/LoginComponent";
import MyPersonalInfo from "components/pageModalContent/MyPersonalInfo.vue";
import MyMessages from "components/pageModalContent/MyMessages.vue";
import PromoComponent from "components/pageModalContent/PromoComponent.vue";
import TransitRecord from "src/pages/account/TransitRecordView.vue";
import MyTransfer from "components/pageModalContent/MyTransfer.vue";
import MyPasswordChange from "components/pageModalContent/MyPasswordChange.vue";
import DepositRecord from "components/pageModalContent/DepositRecord.vue";
import WithdrawRecord from "components/pageModalContent/WithdrawRecord.vue";
import AddWithdrawBankCard from "components/pageModalContent/AddWithdrawBankCard.vue";
import WithdrawBankView from "src/pages/account/WithdrawBankView.vue";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const visible = ref(false);
const store = userStore();
const page = ref("");
const tabIndex = ref("log");

// minimal mode hides left side links and top section tabs
const isMinimalMode = computed(() => {
  const minimalModeRoutes = ["register", "login"];
  return minimalModeRoutes.includes(route.query.page);
});

watch(
  () => route.query,
  (_, __) => {
    console.log(route.query);
    if (route.query && route.query.page) {
      nextTick(() => {
        page.value = route.query.page;
        if (!visible.value) visible.value = false;

        // determine the extact pageInfoItem based on route info
        const pageInfoItem = pagesInfo.find(({ page }) => page === route.query.page);
        // determine which left side tab to land on
        if (pageInfoItem?.tabIndex) {
          tabIndex.value = pageInfoItem.tabIndex;
        } else {
          // default to first tab if unable to proceed with the above
          tabIndex.value = "log";
        }

        open(route.query.page);
      });
    } else {
      // router.push("/");
      visible.value = false;
    }
  },
  { immediate: true }
);

const tabClick = (targetPage) => {
  page.value = targetPage;
  // TODO
  router.replace({
    query: { page: targetPage },
    silent: true
  });
};

const headerInfo = computed(() => {
  return formattedPagesInfo.value.find((item) => item.page === page.value)?.headerInfo || {};
});

const isLinkActive = (key) => {
  switch (key) {
    case "log":
      return ["finance/deposit", "finance/withdraw", "notify", "customer/service"].includes(route.query.page);
    case "my":
      return ["test"].includes(route.query.page);
    case "finance":
      // TODO
      return false;
    default:
      return false;
  }
};

const pagesInfo = reactive([
  {
    tabIndex: "log",
    page: "finance/deposit",
    info: t('lang.page_modal_deposit'),
    iconUrl: require("../../assets/icon/deposit.svg"),
    iconActiveUrl: require("../../assets/icon/pageModal/wallet-icon.svg"),
    component: FinanceDeposit,
    headerInfo: {
      title: t('lang.page_modal_deposit'),
      subTitle: "DEPOSIT",
      description: "입금시 꼭 계좌문의를 하세요!"
    }
  },
  {
    tabIndex: "log",
    page: "finance/withdraw",
    info: t('lang.page_modal_withdraw'),
    iconUrl: require("../../assets/icon/withdrawMoney.svg"),
    iconActiveUrl: require("../../assets/icon/pageModal/card-icon.svg"),
    component: FinanceWithdraw,
    headerInfo: {
      title: t('lang.page_modal_withdraw'),
      subTitle: "WITHDRAW",
      description: "입금시 꼭 계좌문의를 하세요!"
    }
  },
  {
    tabIndex: "log",
    page: "personal/messages",
    info: t('lang.page_modal_message'),
    iconUrl: require("../../assets/icon/messages.svg"),
    iconActiveUrl: require("../../assets/icon/pageModal/paper-plane-icon.svg"),
    component: CustomerService,
    headerInfo: {
      title: t('lang.page_modal_message'),
      subTitle: "MESSAGES",
      description: "입금시 꼭 계좌문의를 하세요!"
    }
  },
  {
    tabIndex: "log",
    page: "promo/all",
    info: t('lang.page_modal_promo'),
    iconUrl: require("../../assets/icon/promo.svg"),
    iconActiveUrl: require("../../assets/icon/pageModal/gift-icon.svg"),
    component: PromoComponent,
    headerInfo: {
      title: t('lang.page_modal_promo'),
      subTitle: "EVENT",
      description: ""
    }
  },
  {
    tabIndex: "log",
    href: "https://csweb01.amv4xjcbd.com/?partnerId=12&lang=kr",
    page: "customer/service",
    info: t('lang.page_modal_customer_service'),
    iconUrl: require("../../assets/icon/customerService.svg"),
    iconActiveUrl: require("../../assets/icon/pageModal/speech-icon.svg"),
    component: CustomerService,
    headerInfo: {
      title: t('lang.page_modal_customer_service'),
      subTitle: "Q&A",
      description: "입금시 꼭 계좌문의를 하세요!"
    }
  },
  {
    tabIndex: "my",
    page: "personal/info",
    info: t('lang.page_modal_personal_info'),
    iconUrl: require("../../assets/icon/personal-info.svg"),
    iconActiveUrl: require("../../assets/icon/pageModal/user-icon.svg"),
    component: MyPersonalInfo,
    headerInfo: {
      title: "개인정보",
      subTitle: "PERSONAL INFO",
      description: "입금시 꼭 계좌문의를 하세요!"
    }
  },
  {
    tabIndex: "my",
    page: "announcement",
    info: t('lang.page_modal_announcement'),
    iconUrl: require("../../assets/icon/notify.svg"),
    iconActiveUrl: require("../../assets/icon/pageModal/bell-icon.svg"),
    component: AnnouncementComponent,
    headerInfo: {
      title: t('lang.page_modal_announcement'),
      subTitle: "NOTICE",
      description: "입금시 꼭 계좌문의를 하세요!"
    }
  },
  {
    tabIndex: "my",
    page: "withdrawcard",
    info: t('lang.page_modal_add_bank_card'),
    iconUrl: require("../../assets/icon/withdrawMoney.svg"),
    iconActiveUrl: require("../../assets/icon/pageModal/card-icon.svg"),
    component: AddWithdrawBankCard,
    headerInfo: {
      title: t('lang.page_modal_add_bank_card'),
      subTitle: "ADD BANK CARD",
      description: "출금 계좌에 새 은행 카드 추가"
    }
  },
  // {
  //   tabIndex: "my",
  //   page: "bankcardlist",
  //   info: t('lang.page_modal_bank_card_list'),
  //   iconUrl: require("../../assets/icon/withdrawMoney.svg"),
  //   iconActiveUrl: require("../../assets/icon/pageModal/card-icon.svg"),
  //   component: WithdrawBankView,
  //   headerInfo: {
  //     title: t('lang.page_modal_bank_card_list'),
  //     subTitle: "BANK CARD LIST",
  //     description: ""
  //   }
  // },
  {
    tabIndex: "my",
    page: "transaction/records",
    info: t('lang.page_modal_transaction_record'),
    iconUrl: require("../../assets/icon/transaction-record.svg"),
    iconActiveUrl: require("../../assets/icon/pageModal/paper-icon.svg"),
    component: TransitRecord,
    headerInfo: {
      title: t('lang.page_modal_transaction_record'),
      subTitle: "TRANSACTIONS",
      description: "입금시 꼭 계좌문의를 하세요!"
    }
  },
  // {
  //   tabIndex: "my",
  //   page: "transaction/transfer",
  //   info: "포인트전환",
  //   iconUrl: require("../../assets/icon/transfer.svg"),
  //   iconActiveUrl: require("../../assets/icon/transfer-active.svg"),
  //   component: MyTransfer,
  //   headerInfo: {
  //     title: "포인트전환",
  //     subTitle: "TRANSFER",
  //     description: "입금시 꼭 계좌문의를 하세요!",
  //   }
  // },
  {
    tabIndex: "my",
    page: "personal/updatePwd",
    info: t('lang.page_modal_change_password'),
    iconUrl: require("../../assets/icon/password-update.svg"),
    iconActiveUrl: require("../../assets/icon/pageModal/key-icon.svg"),
    component: MyPasswordChange,
    headerInfo: {
      title: t('lang.page_modal_change_password'),
      subTitle: "PASSWORD CHANGE",
      description: "입금시 꼭 계좌문의를 하세요!"
    }
  },
  // {
  //   tabIndex: "finance",
  //   page: "finance/depositRecord",
  //   info: "입금",
  //   iconUrl: require("../../assets/icon/deposit.svg"),
  //   iconActiveUrl: require("../../assets/icon/deposit-active.svg"),
  //   component: DepositRecord,
  //   headerInfo: {
  //     title: "입금",
  //     subTitle: "DEPOSIT RECORD",
  //     description: "입금시 꼭 계좌문의를 하세요!",
  //   }
  // },
  {
    tabIndex: "finance",
    page: "finance/withdrawRecord",
    info: "출금",
    iconUrl: require("../../assets/icon/withdrawMoney.svg"),
    iconActiveUrl: require("../../assets/icon/withdrawMoney-active.svg"),
    component: WithdrawRecord,
    headerInfo: {
      title: "출금",
      subTitle: "WITHDRAW RECORD",
      description: "입금시 꼭 계좌문의를 하세요!"
    }
  }
]);

const minimalModePagesInfo = reactive([
  {
    page: "register",
    info: "회원가입",
    iconUrl: require("../../assets/icon/customerService.svg"),
    iconActiveUrl: require("../../assets/icon/customerService-active.svg"),
    component: RegisterComponent,
    headerInfo: {
      title: "회원가입",
      subTitle: "REGISTER",
      description: ""
    }
  },
  {
    page: "login",
    info: "로그인",
    iconUrl: require("../../assets/icon/customerService.svg"),
    iconActiveUrl: require("../../assets/icon/customerService-active.svg"),
    component: LoginComponent,
    headerInfo: {
      title: "로그인",
      subTitle: "LOGIN",
      description: ""
    }
  }
]);

// const minimalLoginModePagesInfo = reactive([

// ]);

const formattedPagesInfo = computed(() => {
  if (isMinimalMode.value) {
    return minimalModePagesInfo.filter(({ page }) => page === route.query.page);
  }

  return pagesInfo;
});

const leftLinks = reactive([
  {
    key: "log",
    info: "로그인",
    clickHandler: () => {
      tabIndex.value = "log";
      goToFirstTab("log");
    }
  },
  {
    key: "my",
    info: "마이페이지",
    clickHandler: () => {
      tabIndex.value = "my";
      goToFirstTab("my");
    }
  },
  {
    key: "finance",
    info: "입출금내역",
    clickHandler: () => {
      tabIndex.value = "finance";
      goToFirstTab("finance");
    }
  }
]);

const goToFirstTab = (tabIndex) => {
  const item = pagesInfo.find((page) => page.tabIndex === tabIndex);
  router.push(`/?page=${item?.page}`);
};

const closeDialog = () => {
  visible.value = false;
  page.value = "";
  router.push({ path: route.pathname });
};
const open = (pageName) => {
  console.log(pageName);
  // if (store.hasToken()) {
  //   if (!visible.value) {
  visible.value = true;
  // }
  // } else {
  //   router.push({ path: "/login", query: { redirect: route.path } });
  // }
};

onMounted(() => {
  console.log(router.currentRoute.value.fullPath);
});
</script>
<style scoped lang="scss">
// reset app.scss

.q-panel>div {
  height: unset;
}

.page-dialog {
  .q-dialog__inner--minimized>div {
    // max-height: unset;
  }
}

// ---

.page-dialog {
  width: 980px;
  height: 692px;
  //background: #23263cbc;
  display: flex;
  //outline: 1px solid red;
}

.page-dialog-links {
  position: absolute;
  left: 0;
  top: 8px;
}

.page-dialog-main {
  --main-bg-color: #212632;
  // top: 80px;
  // position: absolute;
  // padding: 0 0 0 140px;
  box-sizing: content-box;
  // width: 860px;
  width: 100%;
  max-width: 860px;
  max-height: 100%;

  :deep(.q-panel) {}

  &,
  .q-tab-panel {
    //min-height: 624px;
  }

  .q-tabs__content {}

  .q-tab {
    color: #767676;
  }
}

.page-dialog-links {
  .header-info-description {
    display: none;
  }
}

.info-text {
  font-size: 20px;
  font-weight: 500;
  color: #a5a6a7;
  line-height: 28px;
  margin-left: 5px;
}

.left-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  width: 40%;
}

.credit-info {
  display: flex;
  align-items: center;
}

.top-actions {
  display: flex;
  //justify-content: flex-end;
}

.page-dialog-tab {
  :deep(.q-tab__content) {
    flex-direction: row-reverse;
  }
}

:deep(.q-tab__label) {}

:deep(.q-tab) {
  border-bottom: 2px solid #32394B;
}

:deep(.q-tab--active) {
  border-bottom: 2px solid #00FFFF;

  .q-tab__label {
    color: #00FFFF;
    font-weight: unset;
    font-size: unset;
  }
}

.left-group {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 10px;
}

.header-close-btn {
  // margin-right: 25px;
  width: 40px;
  cursor: pointer;

  &:hover {
    filter: brightness(0.8);
  }
}

.page-dialog-main-header {
  justify-content: space-between;
  height: 56px;
  width: 100%;
  padding: unset;
  background-image: url("../../assets/images/pages-modal/modal-header.png");
  background-color: var(--main-bg-color);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  .header-title {
    text-align: center;
    white-space: nowrap;
    color: #161822;
    font-weight: bold;
  }

  p {
    flex: 1;
    margin: auto;
    color: #fff;

    &.header-info-description {
      color: #000;
      text-align: left;
      margin-left: 10px;
    }

    &:nth-child(2) {
      text-align: center;

      span:first-child {
        font-weight: bold;
        font-size: 1.2rem;
      }
    }

    &:last-child {
      text-align: right;
    }
  }
}

.page-dialog-tabs {
  // height: 600px;
  // min-height: calc(100vh - 240px);
  background: var(--main-bg-color);

  :deep(.q-tab) {
    // padding-bottom: 10px;
  }

  .q-tab-panels {
    overflow-y: auto;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
  }
}

.q-panel {
  .q-tab-panel {
    // padding: 10px 20px 60px;
    box-sizing: border-box;
    // overflow-y: scroll;
    // max-height: calc(90vh - 200px);
  }
}

.q-tab-panels {
  background: var(--main-bg-color);
  height: 100%;
}

:deep(.modal-body-buttons) {
  background-color: var(--main-bg-color);
}

@media (max-width: 768px) {
  .page-dialog-main {
    width: 100%;
    height: 100%;
    max-height: unset;
    padding: unset;
    min-width: auto;
    max-width: auto;
  }

  .page-dialog-main-container {
    // top: 50%;
    // transform: translate(-50%, -50%);
    // left: 50%;
    // position: relative;
  }

  .page-dialog-links {
    background-color: var(--main-bg-color);
    position: relative;
    top: 0px;

    .header-info-description {
      display: block;
      margin: unset;
      text-align: center;
      padding-top: 12px;
    }

    .left-group {
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 10px;
      padding: 0px 10px;
    }
  }

  .page-dialog-main-header {
    // height: 60px;
    // background-image: url("../../assets/images/pages-modal/modal-header-mobile.png");

    .header-info-description {
      visibility: hidden;
    }

    .q-btn {
      margin-right: 15px;
    }
  }

  .page-dialog-tabs {
    :deep(.q-tab) {
      .q-tab__content {
        display: flex;
        flex-direction: column-reverse;

        .q-tab__label {
          margin-left: unset;
          margin-top: 4px;
          font-size: 15px;
        }
      }
    }
  }

  .q-panel {
    .q-tab-panel {
      // padding: 10px 20px 100px;
      // max-height: calc(95vh - 250px);
    }
  }

  .modal-body-buttons {
    .form-button {
      width: 140px;
      height: 40px;
      max-width: 40vw;
    }
  }
}
</style>
