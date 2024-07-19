<template>
  <q-dialog @hide="closeDialog" v-model="visible" class="page-dialog" no-route-dismiss persistent>
    <div class="page-modal-container" :class="isMinimalMode ? 'minimal' : ''">
      <div class="header">
        <div style="text-align: right;">
          <img class="header-close-btn" src="../../assets/images/index/modal-close-btn.svg" @click="closeDialog()" />
        </div>
        <div class="page-dialog-main-header">
          <span class="header-info-description">{{ headerInfo.description ? $t(headerInfo.description) : '' }}</span>
          <span class="header-title">{{ headerInfo.title ? $t(headerInfo.title) : '' }}</span>
          <span></span>
        </div>
        <q-separator color="grey" />
      </div>
      <div class="page-dialog-tabs" v-if="!isMinimalMode">
        <q-tabs v-model="page" align="justify" inline-label dense style="background-color: #212632;">
          <template v-for="item in formattedPagesInfo" :key="item.page">
            <q-tab @click="tabClick(item.page)" :name="item.page" :label="item.info ? $t(item.info) : ''"
              class="page-dialog-tab" v-if="item.tabIndex === tabIndex && item.page !== 'bankcardlist'">
              <img :src="item.iconActiveUrl" :alt="item.info" :style="page === item.page ? '' : 'filter:contrast(0)'" />
            </q-tab>
          </template>
        </q-tabs>
      </div>
      <div class=content>
        <q-tab-panels v-model="page" animated swipeable infinite>
          <template v-for="item in formattedPagesInfo" :key="item.page">
            <q-tab-panel :name="item.page" style="padding:0;">
              <component :is="item.component" @closeModal="closeDialog"></component>
            </q-tab-panel>
          </template>
        </q-tab-panels>
      </div>
    </div>
  </q-dialog>
</template>
<script setup id="PageModal">
import { useRoute, useRouter } from "vue-router";
import { ref, reactive, computed, watch, nextTick, onMounted, defineAsyncComponent, markRaw } from "vue";


const route = useRoute();
const router = useRouter();
const visible = ref(false);
const page = ref("");
const tabIndex = ref("");

// minimal mode hides left side links and top section tabs
const isMinimalMode = computed(() => {
  const minimalModeRoutes = ["register", "login"];
  return minimalModeRoutes.includes(route.query.page);
});

watch(
  () => route.query,
  () => {
    if (route.query && route.query.page) {
      nextTick(() => {
        page.value = route.query.page;
        if (!visible.value) visible.value = false;

        // determine the extact pageInfoItem based on route info
        const pageInfoItem = [...pagesInfo, ...minimalModePagesInfo].find(({ page }) => page === route.query.page);
        // determine which left side tab to land on
        if (pageInfoItem) {
          tabIndex.value = pageInfoItem?.tabIndex;
          visible.value = true;
        } else {
          router.push('/');
        }
      });
    } else {
      visible.value = false;
    }
  },
  { immediate: true }
);

const tabClick = (targetPage) => {
  router.replace({
    query: { page: targetPage },
    silent: true
  });
};

const headerInfo = computed(() => {
  return formattedPagesInfo.value.find((item) => item.page === page.value)?.headerInfo || {};
});

const MyPersonalInfo = markRaw(defineAsyncComponent(() =>
  import('components/pageModalContent/MyPersonalInfo.vue')
))
const FinanceDeposit = markRaw(defineAsyncComponent(() =>
  import('components/pageModalContent/FinanceDeposit.vue')
))
const FinanceWithdraw = markRaw(defineAsyncComponent(() =>
  import('components/pageModalContent/FinanceWithdraw.vue')
))
const AnnouncementComponent = markRaw(defineAsyncComponent(() =>
  import('components/pageModalContent/AnnouncementComponent.vue')
))
const AddWithdrawBankCard = markRaw(defineAsyncComponent(() =>
  import('components/pageModalContent/AddWithdrawBankCard.vue')
))
const FeedbackPage = markRaw(defineAsyncComponent(() =>
  import('src/components/pageModalContent/MaintenancePage.vue')
))
const MessagesPage = markRaw(defineAsyncComponent(() =>
  import('components/pageModalContent/message/MessagesPage.vue')
))
const RegisterComponent = markRaw(defineAsyncComponent(() =>
  import('components/pageModalContent/RegisterComponent.vue')
))
const LoginComponent = markRaw(defineAsyncComponent(() =>
  import('components/pageModalContent/LoginComponent.vue')
))
const TransitRecord = markRaw(defineAsyncComponent(() =>
  import('src/pages/account/TransitRecordView.vue')
))
const MyPasswordChange = markRaw(defineAsyncComponent(() =>
  import('components/pageModalContent/MyPasswordChange.vue')
))

const pagesInfo = reactive([
  {
    tabIndex: "finance",
    page: "finance/deposit",
    info: 'lang.page_modal_deposit',
    iconActiveUrl: require("../../assets/icon/pageModal/wallet-icon.svg"),
    component: FinanceDeposit,
    headerInfo: {
      title: 'lang.page_modal_deposit',
      description: "lang.page_modal_desc_text"
    }
  },
  {
    tabIndex: "finance",
    page: "finance/withdraw",
    info: 'lang.page_modal_withdraw',
    iconActiveUrl: require("../../assets/icon/pageModal/card-icon.svg"),
    component: FinanceWithdraw,
    headerInfo: {
      title: 'lang.page_modal_withdraw',
      description: "lang.page_modal_desc_text"
    }
  },
  {
    tabIndex: "message",
    page: "announcement",
    info: 'lang.page_modal_announcement',
    iconActiveUrl: require("../../assets/icon/pageModal/bell-icon.svg"),
    component: AnnouncementComponent,
    headerInfo: {
      title: 'lang.page_modal_announcement',
      description: "lang.page_modal_desc_text"
    }
  },
  {
    tabIndex: "message",
    page: "personal/inquiry",
    info: 'lang.menu_inquiry',
    iconActiveUrl: require("../../assets/icon/pageModal/paper-plane-icon.svg"),
    component: FeedbackPage,
    headerInfo: {
      title: 'lang.message_type_all',
      description: "lang.page_modal_desc_text"
    }
  },
  {
    tabIndex: "message",
    page: "personal/message",
    info: 'lang.menu_message',
    iconActiveUrl: require("../../assets/icon/pageModal/paper-plane-icon.svg"),
    component: MessagesPage,
    headerInfo: {
      title: 'lang.menu_message',
      description: "lang.page_modal_desc_text"
    }
  },
  // {
  //   tabIndex: "message",
  //   page: "personal/messages/create",
  //   info: 'lang.page_modal_message_compose',
  //   iconActiveUrl: require("../../assets/icon/pageModal/pencil-icon.svg"),
  //   component: MessageCompose,
  //   headerInfo: {
  //     title: 'lang.page_modal_message_compose',
  //     description: "lang.page_modal_desc_text"
  //   }
  // },
  {
    tabIndex: "personal",
    page: "personal/info",
    info: 'lang.page_modal_personal_info',
    iconActiveUrl: require("../../assets/icon/pageModal/user-icon.svg"),
    component: MyPersonalInfo,
    headerInfo: {
      title: "lang.page_modal_personal_info",
      description: "lang.page_modal_desc_text"
    }
  },
  {
    tabIndex: "finance",
    page: "bankcardlist",
    info: 'lang.page_modal_bank_card_list',
    iconActiveUrl: require("../../assets/icon/pageModal/card-icon.svg"),
    component: AddWithdrawBankCard,
    headerInfo: {
      title: 'lang.page_modal_bank_card_list',
      description: ""
    }
  },

  {
    tabIndex: "personal",
    page: "transaction/records",
    info: 'lang.page_modal_transaction_record',
    iconActiveUrl: require("../../assets/icon/pageModal/paper-icon.svg"),
    component: TransitRecord,
    headerInfo: {
      title: 'lang.page_modal_transaction_record',
      description: "lang.page_modal_desc_text"
    }
  },
  {
    tabIndex: "personal",
    page: "personal/updatePwd",
    info: 'lang.page_modal_change_password',
    iconActiveUrl: require("../../assets/icon/pageModal/key-icon.svg"),
    component: MyPasswordChange,
    headerInfo: {
      title: 'lang.page_modal_change_password',
      description: "lang.page_modal_desc_text"
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

const closeDialog = () => {
  visible.value = false;
  page.value = "";
  router.push({ path: route.pathname });
};

onMounted(() => {
});
</script>
<style scoped lang="scss">
.page-dialog {
  width: 980px;
  height: 692px;
  display: flex;
}

.page-dialog-links {
  position: absolute;
  left: 0;
  top: 8px;
  padding: 5px 0;
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
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  justify-content: space-between;


  .header-info-description {
    color: #000;
    text-align: left;
    margin-left: 10px;
    max-height: 100%;
    overflow-y: auto;
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
  .q-tab-panels {
    height: 100%;
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

    .left-group {
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 10px;
      padding: 0px 10px;
    }
  }

  .page-dialog-main-header {

    .header-title {
      font-size: 15px;
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
}

.page-modal-container {
  display: grid;
  grid-template-rows: 89px auto 1fr;
  width: 100%;
  height: 100%;
  min-width: 30vw;
  max-width: 50vw;
  max-height: 75vh;

  &.minimal {
    grid-template-rows: 89px fit-content;
    height: fit-content;
    width: fit-content;
    min-width: fit-content;
  }

  @media (max-width: 1400px) {
    min-width: 60vw;
    max-width: 85vw;
  }

  @media (max-width: 768px) {
    min-width: 70vw;
    max-width: 95vw;
  }


  .content {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    overflow: auto;
    background-color: #212632;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
}
</style>
