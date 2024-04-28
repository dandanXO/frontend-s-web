<template>
  <q-scroll-area>
    <q-dialog @hide="closeDialog" v-model="visible" class="page-dialog">


      <div class="page-dialog-links">
          <div class="left-group">
            <div v-for="(item) in leftLinks" :key="item.key" class="page-dialog-links-btn"
                 :class="isLinkActive(item.key) ? 'active' : ''">
              <div @click="item.clickHandler()"  class="register-text">{{ item.info }}</div>
            </div>
          </div>
      </div>

      <div class="page-dialog-main" >


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
              <q-tabs
                v-model="page"
                align="justify"
              >
                <template v-for="(item) in pagesInfo" :key="item.page">
<!--                  <p :data-icon="item.imgUrl">123</p>-->
                  <q-tab @click="tabClick(item.page)" :name="item.page" :label="item.info"
                         class="page-dialog-tab">
                    <img :src="page === item.page ? item.iconActiveUrl : item.iconUrl" alt="item.info" />
                  </q-tab>
                </template>
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="page" animated class="bg-orange-1 text-dark text-center">

                <template v-for="(item) in pagesInfo" :key="item.page">
                  <q-tab-panel :name="item.page">
                    <div class="text-h6">{{ item.info }}</div>
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

const route = useRoute();
const router = useRouter();
const visible = ref(false);
const store = userStore();
const page = ref("");

watch(() => route.query, (_, __) => {
  if (route.query && route.query.page) {
    nextTick(() => {
      page.value = route.query.page;
      if (!visible.value) visible.value = true
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
  return pagesInfo.find(item => item.page === page.value)?.headerInfo || {};
});


const isLinkActive = (key) => {
  switch (key) {
    case "log":
      return ["finance/deposit", "finance/withdraw","notify","customer/service"].includes(route.query.page)
    case "my":
    // TODO
      return false
    case "finance":
    // TODO
      return false
    default:
      return false
  }
};


const pagesInfo = reactive([
  {
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
  }
])

const leftLinks = reactive([
  {
    key: "log",
    info: "로그인",
    clickHandler: () => {
    //   TODO
    },
  },
  {
    key: "my",
    info: "마이페이지",
    clickHandler: () => {
      //   TODO
    },
  },
  {
    key: "finance",
    info: "입출금내역",
    clickHandler: () => {
      //   TODO
    },
  },
])

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
    height: 624px;
}
.page-dialog-main {
  &, .q-tab-panel {
    height: 624px;
    background: #030303;
  }
  .q-tabs__content {

    border-bottom: 1px solid #D9D9D9;
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
:deep(.q-tab--active) {
    border-bottom: 1px solid #1bcef1;
  .q-tab__label {
    color: #fff;
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

}
</style>
