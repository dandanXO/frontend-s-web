<template>
  <q-dialog @hide="closeDialog" v-model="visible" class="page-dialog" no-route-dismiss persistent>
    <q-card style="max-width: 860px; background: transparent; box-shadow: none;"
      :style="isMinimalMode ? '' : 'width: 100%;'">
      <div style="text-align: right;">
        <img class="header-close-btn" src="../../assets/images/index/modal-close-btn.svg" @click="closeDialog()" />
      </div>

      <q-card-section>
        <div class="page-dialog-main-header">
          <span class="header-info-description">{{ headerInfo.description }}</span>
          <span class="header-title">{{ headerInfo.title ? $t(headerInfo.title) : '' }}</span>
          <span></span>
        </div>
      </q-card-section>

      <q-separator color="grey" />

      <q-card-section>
        <div class="page-dialog-main">

          <div class="page-dialog-main-container">
            <div class="page-dialog-links" v-if="!isMinimalMode">
              <p class="header-info-description">{{ headerInfo.description }}</p>
            </div>
            <div class="page-dialog-tabs">
              <template v-if="!isMinimalMode">
                <q-tabs v-model="page" align="justify" inline-label dense>
                  <template v-for="item in formattedPagesInfo" :key="item.page">
                    <q-tab @click="tabClick(item.page)" :name="item.page" :label="item.info ? $t(item.info) : ''"
                      class="page-dialog-tab" v-if="item.tabIndex === tabIndex && item.page !== 'bankcardlist'">
                      <img :src="item.iconActiveUrl" :alt="item.info"
                        :style="page === item.page ? '' : 'filter:contrast(0)'" />
                    </q-tab>
                  </template>
                </q-tabs>
              </template>

              <q-tab-panels v-model="page" animated :style="isMinimalMode ? '' : 'min-height:600px;max-height:70vh'">
                <template v-for="item in formattedPagesInfo" :key="item.page">
                  <q-tab-panel :name="item.page">
                    <component :is="item.component" @closeModal="closeDialog"></component>
                  </q-tab-panel>
                </template>
              </q-tab-panels>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup id="PageModal">
import { useRoute, useRouter } from "vue-router";
import { ref, reactive, computed, watch, nextTick, onMounted } from "vue";
import { useI18n } from 'vue-i18n';
import FinanceDeposit from "components/pageModalContent/FinanceDeposit";
import FinanceWithdraw from "components/pageModalContent/FinanceWithdraw";
import AnnouncementComponent from "components/pageModalContent/AnnouncementComponent";
import AddWithdrawBankCard from "components/pageModalContent/AddWithdrawBankCard";
import FeedbackPage from "components/pageModalContent/FeedbackPage";
import MessagesPage from "components/pageModalContent/MessagesPage";
import RegisterComponent from "components/pageModalContent/RegisterComponent";
import LoginComponent from "components/pageModalContent/LoginComponent";
import MyPersonalInfo from "components/pageModalContent/MyPersonalInfo.vue";
import PromoComponent from "components/pageModalContent/PromoComponent.vue";
import TransitRecord from "src/pages/account/TransitRecordView.vue";
import MyPasswordChange from "components/pageModalContent/MyPasswordChange.vue";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const visible = ref(false);
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

const pagesInfo = reactive([
  {
    tabIndex: "log",
    page: "finance/deposit",
    info: 'lang.page_modal_deposit',
    iconActiveUrl: require("../../assets/icon/pageModal/wallet-icon.svg"),
    component: FinanceDeposit,
    headerInfo: {
      title: 'lang.page_modal_deposit',
      description: "입금시 꼭 계좌문의를 하세요!"
    }
  },
  {
    tabIndex: "log",
    page: "finance/withdraw",
    info: 'lang.page_modal_withdraw',
    iconActiveUrl: require("../../assets/icon/pageModal/card-icon.svg"),
    component: FinanceWithdraw,
    headerInfo: {
      title: 'lang.page_modal_withdraw',
      description: "입금시 꼭 계좌문의를 하세요!"
    }
  },
  // {
  //   tabIndex: "log",
  //   page: "personal/messages",
  //   info: 'lang.page_modal_message',
  //   iconActiveUrl: require("../../assets/icon/pageModal/paper-plane-icon.svg"),
  //   component: FeedbackPage,
  //   headerInfo: {
  //     title: 'lang.page_modal_message',
  //     description: "입금시 꼭 계좌문의를 하세요!"
  //   }
  // },
  {
    tabIndex: "log",
    page: "personal/messages",
    info: 'lang.page_modal_message',
    iconActiveUrl: require("../../assets/icon/pageModal/paper-plane-icon.svg"),
    component: MessagesPage,
    headerInfo: {
      title: 'lang.page_modal_message',
      description: "입금시 꼭 계좌문의를 하세요!"
    }
  },
  {
    tabIndex: "log",
    page: "promo/all",
    info: 'lang.page_modal_promo',
    iconActiveUrl: require("../../assets/icon/pageModal/gift-icon.svg"),
    component: PromoComponent,
    headerInfo: {
      title: 'lang.page_modal_promo',
      description: ""
    }
  },
  // {
  //   tabIndex: "log",
  //   href: "https://csweb01.amv4xjcbd.com/?partnerId=12&lang=kr",
  //   page: "customer/service",
  //   info: 'lang.page_modal_customer_service',
  //   iconActiveUrl: require("../../assets/icon/pageModal/speech-icon.svg"),
  //   component: FeedbackPage,
  //   headerInfo: {
  //     title: 'lang.page_modal_customer_service',
  //     description: "입금시 꼭 계좌문의를 하세요!"
  //   }
  // },
  {
    tabIndex: "my",
    page: "personal/info",
    info: 'lang.page_modal_personal_info',
    iconActiveUrl: require("../../assets/icon/pageModal/user-icon.svg"),
    component: MyPersonalInfo,
    headerInfo: {
      title: "개인정보",
      description: "입금시 꼭 계좌문의를 하세요!"
    }
  },
  {
    tabIndex: "my",
    page: "announcement",
    info: 'lang.page_modal_announcement',
    iconActiveUrl: require("../../assets/icon/pageModal/bell-icon.svg"),
    component: AnnouncementComponent,
    headerInfo: {
      title: 'lang.page_modal_announcement',
      description: "입금시 꼭 계좌문의를 하세요!"
    }
  },
  {
    tabIndex: "my",
    page: "bankcardlist",
    info: 'lang.page_modal_bank_card_list',
    iconActiveUrl: require("../../assets/icon/pageModal/card-icon.svg"),
    component: AddWithdrawBankCard,
    headerInfo: {
      title: 'lang.page_modal_bank_card_list',
      subTitle: "BANK CARD LIST",
      description: ""
    }
  },

  {
    tabIndex: "my",
    page: "transaction/records",
    info: 'lang.page_modal_transaction_record',
    iconActiveUrl: require("../../assets/icon/pageModal/paper-icon.svg"),
    component: TransitRecord,
    headerInfo: {
      title: 'lang.page_modal_transaction_record',
      description: "입금시 꼭 계좌문의를 하세요!"
    }
  },
  {
    tabIndex: "my",
    page: "personal/updatePwd",
    info: 'lang.page_modal_change_password',
    iconActiveUrl: require("../../assets/icon/pageModal/key-icon.svg"),
    component: MyPasswordChange,
    headerInfo: {
      title: 'lang.page_modal_change_password',
      description: "입금시 꼭 계좌문의를 하세요!"
    }
  },
]);

const minimalModePagesInfo = reactive([
  {
    page: "register",
    info: "lang.login_register",
    iconActiveUrl: require("../../assets/icon/pageModal/user-icon.svg"),
    component: RegisterComponent,
    headerInfo: {
      title: "lang.login_register",
      description: ""
    }
  },
  {
    page: "login",
    info: "lang.login",
    iconActiveUrl: require("../../assets/icon/pageModal/user-icon.svg"),
    component: LoginComponent,
    headerInfo: {
      title: "lang.login",
      description: ""
    }
  }
]);

const formattedPagesInfo = computed(() => {
  if (isMinimalMode.value) {
    return minimalModePagesInfo.filter(({ page }) => page === route.query.page);
  }

  return pagesInfo;
});

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
  visible.value = true;
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
  width: 980px;
  height: 692px;
  display: flex;
}

.page-dialog-links {
  position: absolute;
  left: 0;
  top: 8px;
}

.page-dialog-main {
  --main-bg-color: #212632;
  box-sizing: content-box;
  width: 100%;
  max-width: 860px;
  max-height: 100%;

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
}

.page-dialog-tab {
  :deep(.q-tab__content) {
    flex-direction: row-reverse;
    gap: 5px;
  }
}

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
  width: 40px;
  cursor: pointer;

  &:hover {
    filter: brightness(0.8);
  }
}

.page-dialog-main-header {
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
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-content: space-between;


  .header-info-description {
    color: #000;
    text-align: left;
    margin-left: 10px;
  }

  .header-title {
    text-align: center;
    white-space: nowrap;
    color: #161822;
    font-weight: bold;
    font-size: 1.3rem;
  }
}

.page-dialog-tabs {
  background: var(--main-bg-color);

  .q-tab-panels {
    overflow-y: auto;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
  }
}

.q-panel {
  .q-tab-panel {
    box-sizing: border-box;
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

  .page-dialog-links {
    background-color: var(--main-bg-color);
    position: relative;
    top: 0px;

    .header-info-description {
      display: block;
      margin: unset;
      text-align: center;
      font-size: 10px;
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
    height: 40px;

    .header-title {
      font-size: 15px;
    }

    .header-info-description {
      visibility: hidden;
      overflow: hidden;
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
        gap: 0px;

        .q-tab__label {
          margin-left: unset;
          margin-top: 0px;
          font-size: 12px;
        }
      }
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
