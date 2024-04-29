<template>
  <q-scroll-area>
    <q-dialog @hide="closeDialog" v-model="visible" class="page-dialog">


      <div class="page-dialog-links" v-if="!isMinimalMode">
          <div class="left-group">
            <div v-for="(item) in leftLinks" :key="item.key" class="page-dialog-links-btn"
                 :class="tabIndex === item.key ? 'active' : ''">
              <div @click="item.clickHandler()"  class="register-text">{{ item.info }}</div>
            </div>
          </div>
      </div>

      <div class="page-dialog-main" >
        <!-- <LangToggle v-if="showLangToggle"/> -->

        <div class="">
          <q-toolbar class="page-dialog-main-header text-white">
            <p>{{headerInfo.description}}
            </p>
            <p class="header-title">
              <span>{{headerInfo.title}}</span><br/>
              <span>{{headerInfo.subTitle}}</span>
            </p>
            <p>
              <q-btn flat @click="closeDialog()" round dense icon="close" />
            </p>
          </q-toolbar>
          <div class="page-dialog-tabs">
              <template v-if="!isMinimalMode">
                <q-tabs
                  v-model="page"
                  align="justify"
                >
                  <template v-for="(item) in formattedPagesInfo" :key="item.page">
  <!--                  <p :data-icon="item.imgUrl">123</p>-->
                    <q-tab @click="tabClick(item.page)" :name="item.page" :label="item.info"
                          class="page-dialog-tab" v-if="item.tabIndex === tabIndex">
                      <img :src="page === item.page ? item.iconActiveUrl : item.iconUrl" alt="item.info" />
                    </q-tab>
                  </template>
                </q-tabs>

                <q-separator />
              </template>

              <q-tab-panels v-model="page" animated class="">

                <template v-for="(item) in formattedPagesInfo" :key="item.page">
                  <q-tab-panel :name="item.page">
                    <component :is="item.component"></component>
                  </q-tab-panel>
                </template>
              </q-tab-panels>
          </div>
        </div>

      </div>
    </q-dialog>
  </q-scroll-area>

</template>
<script setup id="PageModal">
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import { ref, defineExpose, reactive, computed, watch, nextTick } from "vue";
import FinanceDeposit from "components/pageModalContent/FinanceDeposit";
import FinanceWithdraw from "components/pageModalContent/FinanceWithdraw";
import NotifyComponent from "components/pageModalContent/NotifyComponent";
import CustomerService from "components/pageModalContent/CustomerService";
import RegisterComponent from "components/pageModalContent/RegisterComponent";
import MyPersonalInfo from "components/pageModalContent/MyPersonalInfo.vue";
import MyMessages from "components/pageModalContent/MyMessages.vue";
import MyTransactionRecords from "components/pageModalContent/MyTransactionRecords.vue";
import MyTransfer from "components/pageModalContent/MyTransfer.vue";
import MyPasswordChange from "components/pageModalContent/MyPasswordChange.vue";
import LangToggle from "components/LangToggle.vue";

const route = useRoute();
const router = useRouter();
const visible = ref(false);
const store = userStore();
const page = ref("");
const tabIndex = ref("log");
const showLangToggle = ref(process.env.NODE_ENV === "development");

// minimal mode hides left side links and top section tabs
const isMinimalMode = computed(() => {
  const minimalModeRoutes = ['register'];
  return minimalModeRoutes.includes(route.query.page);
});

watch(() => route.query, (_, __) => {
  if (route.query && route.query.page) {
    nextTick(() => {
      page.value = route.query.page;
      if (!visible.value) visible.value = true

      // determine the extact pageInfoItem based on route info
      const pageInfoItem = pagesInfo.find(({ page }) => page === route.query.page);
      // determine which left side tab to land on
      if(pageInfoItem?.tabIndex) {
        tabIndex.value = pageInfoItem.tabIndex;
      } else {
        // default to first tab if unable to proceed with the above
        tabIndex.value = "log";
      }

      open(route.query.page)
    })
  }
}, { immediate: true});

const tabClick  = (targetPage) => {
  page.value = targetPage
  // TODO
  // router.replace({
  //   query: { page: targetPage},
  //   silent: true
  // })

}

const headerInfo = computed(() => {
  return formattedPagesInfo.value.find(item => item.page === page.value)?.headerInfo || {};
});


const isLinkActive = (key) => {
  switch (key) {
    case "log":
      return ["finance/deposit", "finance/withdraw","notify","customer/service"].includes(route.query.page)
    case "my":
      return ["test"].includes(route.query.page)
    case "finance":
    // TODO
      return false
    default:
      return false
  }
};

const pagesInfo = reactive([
  {
    tabIndex: "log",
    page: "finance/deposit",
    info: "송금신청",
    iconUrl: require("../../assets/icon/deposit.svg"),
    iconActiveUrl: require("../../assets/icon/deposit-active.svg"),
    component: FinanceDeposit,
    headerInfo: {
      title: "송금신청",
      subTitle: "DEPOSIT",
      description: "입금시 꼭 계좌문의를 하세요!",
    }
  },
  {
    tabIndex: "log",
    page: "finance/withdraw",
    info: "출금신청",
    iconUrl: require("../../assets/icon/withdrawMoney.svg"),
    iconActiveUrl: require("../../assets/icon/withdrawMoney-active.svg"),
    component: FinanceWithdraw,
    headerInfo: {
      title: "출금신청",
      subTitle: "WITHDRAW",
      description: "입금시 꼭 계좌문의를 하세요!",
    }
  },
  {
    tabIndex: "log",
    page: "notify",
    info: "공지사항",
    iconUrl: require("../../assets/icon/notify.svg"),
    iconActiveUrl: require("../../assets/icon/notify-active.svg"),
    component: NotifyComponent,
    headerInfo: {
      title: "공지사항",
      subTitle: "NOTICE",
      description: "입금시 꼭 계좌문의를 하세요!",
    }
  },
  {
    tabIndex: "log",
    page: "customer/service",
    info: "고객센터",
    iconUrl: require("../../assets/icon/customerService.svg"),
    iconActiveUrl: require("../../assets/icon/customerService-active.svg"),
    component: CustomerService,
    headerInfo: {
      title: "고객센터",
      subTitle: "Q&A",
      description: "입금시 꼭 계좌문의를 하세요!",
    }
  },
  {
    tabIndex: "my",
    page: "personal/info",
    info: "나의정보",
    iconUrl: require("../../assets/icon/personal-info.svg"),
    iconActiveUrl: require("../../assets/icon/personal-info-active.svg"),
    component: MyPersonalInfo,
    headerInfo: {
      title: "나의정보",
      subTitle: "PERSONAL INFO",
      description: "입금시 꼭 계좌문의를 하세요!",
    }
  },
  {
    tabIndex: "my",
    page: "personal/messages",
    info: "쪽지",
    iconUrl: require("../../assets/icon/messages.svg"),
    iconActiveUrl: require("../../assets/icon/messages-active.svg"),
    component: MyMessages,
    headerInfo: {
      title: "쪽지",
      subTitle: "MESSAGES",
      description: "입금시 꼭 계좌문의를 하세요!",
    }
  },
  {
    tabIndex: "my",
    page: "transaction/records",
    info: "배팅/윈",
    iconUrl: require("../../assets/icon/transaction-record.svg"),
    iconActiveUrl: require("../../assets/icon/transaction-record-active.svg"),
    component: MyTransactionRecords,
    headerInfo: {
      title: "배팅/윈",
      subTitle: "TRANSACTIONS",
      description: "입금시 꼭 계좌문의를 하세요!",
    }
  },
  {
    tabIndex: "my",
    page: "transaction/transfer",
    info: "포인트전환",
    iconUrl: require("../../assets/icon/transfer.svg"),
    iconActiveUrl: require("../../assets/icon/transfer-active.svg"),
    component: MyTransfer,
    headerInfo: {
      title: "포인트전환",
      subTitle: "TRANSFER",
      description: "입금시 꼭 계좌문의를 하세요!",
    }
  },
  {
    tabIndex: "my",
    page: "personal/updatePwd",
    info: "비밀번호",
    iconUrl: require("../../assets/icon/password-update.svg"),
    iconActiveUrl: require("../../assets/icon/password-update-active.svg"),
    component: MyPasswordChange,
    headerInfo: {
      title: "비밀번호",
      subTitle: "PASSWORD CHANGE",
      description: "입금시 꼭 계좌문의를 하세요!",
    }
  },
])

const minimalModePagesInfo = reactive([
  {
    page: "register",
    info: "등록",
    iconUrl: require("../../assets/icon/customerService.svg"),
    iconActiveUrl: require("../../assets/icon/customerService-active.svg"),
    component: RegisterComponent,
    headerInfo: {
      title: "등록",
      subTitle: "REGISTER",
      description: "",
    }
  }
]);

const formattedPagesInfo = computed(() => {
  if(isMinimalMode.value) {
    return minimalModePagesInfo.filter(({ page }) => page === route.query.page);
  }

  return pagesInfo;
})

const leftLinks = reactive([
  {
    key: "log",
    info: "로그인",
    clickHandler: () => {
      tabIndex.value = "log";
      goToFirstTab("log");
    },
  },
  {
    key: "my",
    info: "마이페이지",
    clickHandler: () => {
      tabIndex.value = "my";
      goToFirstTab("my");
    },
  },
  {
    key: "finance",
    info: "입출금내역",
    clickHandler: () => {
      tabIndex.value = "finance";
      goToFirstTab("finance");
    },
  },
])

const goToFirstTab = (tabIndex) => {
  const item = pagesInfo.find((page) => page.tabIndex === tabIndex);
  page.value = item?.page
}

const closeDialog = () => {
  visible.value = false;
  page.value = "";
  router.push({ path: route.pathname });
};
const open = (pageName) => {
  console.log(pageName)
  // if (store.hasToken()) {
  //   if (!visible.value) {
      visible.value = true
    // }
  // } else {
  //   router.push({ path: "/login", query: { redirect: route.path } });
  // }
};

</script>
<style scoped lang="scss">
.page-dialog {
  .q-dialog__inner--minimized > div {
    max-width: unset;
  }
  width: 980px;
  height: 692px;
  //background: #23263cbc;
  display: flex;
  //outline: 1px solid red;
}
.page-dialog-links {
  min-height: 624px;
  margin-left: -130px;
}
.page-dialog-main {
  :deep(.q-panel) {
    padding: 0 20px;
    background: #030303;
  }
  &, .q-tab-panel {
    min-height: 624px;
    background: #030303;
  }
  .q-tabs__content {

  }
  width: 860px;
  .q-tab {
    color: #767676;
  }

}
.page-dialog-links {

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
.top-actions{
  display: flex;
  //justify-content: flex-end;
}
.page-dialog-tab  {
  :deep(.q-tab__content) {
    flex-direction: row-reverse;
  }
}
:deep(.q-tab__label) {
  margin-left: 8px;
}

:deep(.q-tab) {
  border-bottom: 1px solid #767676;
}

:deep(.q-tab--active) {
    border-bottom: 1px solid #767676;
  border-image: linear-gradient(to right, #767676, #1bcef1, #767676) 0.8;
  .q-tab__label {
    color: #fff;
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

.page-dialog-links-btn{
  width: 120px;
  height: 36px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 20px;
  background-image: url("../../assets/images/pages-modal/btn1-gray.svg");
  &.active {
    background-image: url("../../assets/images/pages-modal/btn1-blue.svg");
  }
  .register-text {
    font-size: 16px;
    line-height: 22.4px;
    color: #fff;
  }
}

.page-dialog-main-header {
  justify-content: space-between;
  height: 82px;
  width: 100%;
//  div p{
//    width: 100%;
//  }
  background-image: url("../../assets/images/pages-modal/modal-header.svg");
  background-size: cover;
  .header-title {
    text-align: center;
  }
  p {
    flex: 1;
    margin: auto;:
    color: #FFF;
    &:first-child {
      color: #000;
      text-align: left;
    }
    &:nth-child(2) {
      text-align: center;
      span:first-child {
        font-weight: bold;
        font-size: 1.2rem
      }
    }
    &:last-child {
      text-align: right;
    }
  }

}
.page-dialog-tabs {
  padding: 10px 20px;

  :deep(.q-tab) {
  padding-bottom: 10px;
  }
}
</style>
