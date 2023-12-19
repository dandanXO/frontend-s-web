<template>
  <q-scroll-area>
    <q-dialog v-model="visible" class="gameDialog" full-height full-width>
      <!-- <q-toolbar>
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
      </q-avatar>

      <q-toolbar-title
        ><span class="text-weight-bold">Quasar</span> Framework</q-toolbar-title
      >

      <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar> -->
      <q-toolbar>
        <div class="topActions">
          <q-toolbar-title></q-toolbar-title>
          <q-btn v-if="!drawerVisible" flat @click="closeDialog()" round dense icon="close" />
          <q-btn v-if="!drawerVisible" flat @click="drawerVisible = !drawerVisible" round dense icon="menu_open" />
          <q-btn v-if="drawerVisible" flat @click="drawerVisible = !drawerVisible" round dense icon="read_more" />
        </div>

        <template v-if="transferInfo.platform === 'PG'">
          <iframe
            @load="loadGame()"
            v-show="!logoShow"
            v-bind:srcdoc="src"
            id="game-iframe"
            scrolling="auto"
            frameborder="0"
            class="game-iframe"
            :class="showHeader ? 'game-header-iframe' : ''"
          ></iframe>
        </template>

        <template v-else>
          <iframe
            @load="loadGame()"
            v-show="!logoShow"
            :src="src"
            id="game-iframe"
            scrolling="no"
            frameborder="0"
            class="game-iframe"
          ></iframe>
        </template>

        <q-drawer v-model="drawerVisible" :breakpoint="500" overlay bordered class="bg-primary" side="right">
          <div class="q-pa-sm q-pt-sm">
            <div>
              <!-- Uncomment for quick Transfer -->
              <!-- <q-btn-group push>
                <q-btn
                  size="sm"
                  :color="quickTransferTab ? 'white' : 'primary'"
                  glossy
                  :text-color="quickTransferTab ? 'black' : 'white'"
                  push
                  label="Quick Transfer"
                  icon="multiple_stop"
                  @click="quickTransferTab = true"
                />

                <q-btn
                  size="sm"
                  :color="!quickTransferTab ? 'white' : 'primary'"
                  glossy
                  :text-color="!quickTransferTab ? 'black' : 'white'"
                  push
                  label="Bank Transfer"
                  icon="account_balance"
                  @click="quickTransferTab = false"
                />
              </q-btn-group> -->

              <!-- <template v-if="quickTransferTab">
                <div class="numbers">
                  <div class="instruction">Transfer amount to platform</div>

                  <q-btn
                    class="full-width"
                    push
                    glossy
                    color="brand"
                    v-for="(val, valIndex) in values"
                    :key="valIndex"
                    @click="submitTransfer(val)"
                  >
                    {{ val }}
                  </q-btn>
                </div>
              </template> -->
              <template v-if="!quickTransferTab">
                <div>
                  <span class="menu-title">{{ $t("lang.urgent_deposit") }}</span>
                </div>
                <DepositComponent />
              </template>
            </div>
          </div>
        </q-drawer>
      </q-toolbar>
    </q-dialog>
    <q-dialog v-model="visibleComingSoon" class="gameDialog" style="width: 100%; margin: 0 auto">
      <img src="../../assets/logo-coming.png" style="width: 80%" />
    </q-dialog>
  </q-scroll-area>
</template>
<script setup id="GameModal">
import { userStore } from "stores/index";
// import { launchSessionGame } from "api/platform/platform";
// import { isMobile } from "utils/utils";
import { useRoute, useRouter } from "vue-router";
import { ref, defineExpose, reactive, shallowRef } from "vue";
import DepositComponent from "components/depositComponent.vue";

// import { transfer } from "api/personal/transfer";
// import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { api } from "boot/axios";
import { useQuasar, Platform, AppFullscreen } from "quasar";
// import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { useI18n } from "vue-i18n";

const $q = useQuasar();

const { t } = useI18n();

const store = userStore();
const { token } = storeToRefs(store);

const formRef = ref();
const payTypeClass = ref();
var payMethods = reactive([]);
const paymentNode = ref([]);
const activeMethod = ref({});
const bankCardList = ref([]);
const privilegeList = ref([]);
const selectedPayType = shallowRef("");
const isPaymentLoading = ref(true);

const isMobileDrawerActive = ref(false);
const values = ref(["100", "200", "300", "500", "1000"]);
const hasPrivilege = ref(false);
const quickTransferTab = ref(false);

const checkAmount = reactive({
  flag: true,
  errorMessage: ""
});

function selectPayType(value) {
  if (value) {
    if (value.payType === "BANK") {
      selectedPayType.value = Bank;
      if (!value.extra) {
        bankCardList.value = [];
        form.bankId = null;
      } else if (value.extra.banks) {
        bankCardList.value = value.extra.banks;
      }
    } else if (value.payType === "TruePay") {
      selectedPayType.value = TruePay;
      if (!value.extra) {
        bankCardList.value = [];
        form.bankId = null;
      } else if (value.extra.banks) {
        bankCardList.value = value.extra.banks;
      }
    } else if (value.payType === "OFFLINE") {
      selectedPayType.value = Offline;
      form.bankId = null;
    }
  }
}

const drawerVisible = ref(false);

const router = useRouter();
const route = useRoute();
const visible = ref(false);
const visibleComingSoon = ref(false);
const src = ref("");
const logoShow = ref(true);
const title = ref("");

const transferInfo = ref({
  amount: null,
  platform: null
});
const isClicked = ref("");
const submitTransfer = (amount) => {
  transferInfo.value.amount = amount;
  api
    .post("/session/balance/transfer/deposit", transferInfo.value)
    .then((response) => {
      if (response.code === 0) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "สำเร็จ",
          icon: "check_circle_outline"
        });
        isClicked.value = amount;
        if (token) {
          store.getBalance();
        }
        setTimeout(function () {
          isClicked.value = null;
        }, 1000);
      }
    })
    .catch((error) => {
      // $q.notify({
      //   color: "negative",
      //   position: "top",
      //   message: error.message,
      //   icon: "report_problem"
      // });
    });
};
const closeDialog = () => {
  visible.value = !visible.value;
  src.value = "";
  store.getBalance();
  // AppFullscreen.exit()
};
const open = (gameName, platformCode, gameCode, gameType) => {
  // debugger;
  // AppFullscreen.request()

  localStorage.removeItem("isOpenFromAccount");
  localStorage.removeItem("isBacked");
  // window.addEventListener(
  //   "message",
  //   (event) => {
  //     console.log("Action");
  //     console.log(event.data);
  //     if (event.data?.msg) {
  //       if (event.data.msg === "closemodal") {
  //         drawerVisible.value= false;
  //       }
  //     }
  //   });

  //     var gameIfrm = document.getElementById('game-iframe');
  //     gameIfrm.requestFullscreen();
  // // const iframeRef = ref(null);
  // var myScreenOrientation = window.screen.orientation;
  // console.log(myScreenOrientation)
  // myScreenOrientation.unlock()
  // myScreenOrientation.lock("portrait");
  // console.log(myScreenOrientation)
  // iframe.find('HTML-Element').touchwipe({
  // wipeLeft: function() { alert("left"); },
  // wipeRight: function() { alert("right"); },
  // wipeUp: function() { alert("up"); },
  // wipeDown: function() { alert("down"); },
  // min_move_x: 20,
  // min_move_y: 20,
  // preventDefaultEvents: true });
  // transferInfo.value = {
  //   platform: platformCode
  // };

  // Get the iframe
  const iFrame = document.getElementById("game-iframe");

  // Let's say that you want to access a button with the ID `'myButton'`,
  // you can access via the followi ng code:
  // const buttonInIFrame = iFrame.contentWindow.document.getElementById('iphone-tips-close-button');
  // buttonInIFrame.style.visible = visible;
  //   console.log(iframe)
  title.value = gameName;
  const store = userStore();
  if (store.memberType !== "TEST" && gameType === "TEST") {
    visibleComingSoon.value = true;
  } else {
    if (store.hasToken()) {
      visible.value = true;
      var way = null;
      if (Platform.is.android) {
        way = "ANDROID";
      } else if (Platform.is.ios) {
        way = "IOS";
      }

      const apiParams = {
        platform: platformCode,
        gameCode: gameCode,
        isMobile: Platform.is.mobile ? true : false,
        way: way
      };

      if (platformCode === "CG") {
        apiParams.language = t("lang.langVal");
      }

      api
        .get(`/session/launch?_time=${new Date().getTime()}`, {
          params: apiParams
        })
        .then((ret) => {
          const res = ret.data;
          src.value = res.data;
        });
    } else {
      router.push({ path: "/login", query: { redirect: route.path } });
    }
  }
};

const loadGame = () => {
  if (src.value !== "") {
    logoShow.value = false;
  }
};

const close = () => {
  visible.value = false;
  src.value = "";
  logoShow.value = true;
  payMethods = [];
};

defineExpose({
  open
});
</script>
<style lang="scss">
.gameDialog {
  background: #23263cbc;
}

#iphone-tips-close-button {
  visibility: visible !important;
}
</style>

<style scoped lang="scss">
.drawer-btn {
  display: none;
}

:deep(.ant-drawer-content) {
  background: #1c1d32;

  .account-tip-text {
    svg {
      width: 15px;
      fill: #ffffff;
      display: inline-block;
      vertical-align: middle;
    }
  }
}

:deep(.ant-drawer-header) {
  background: #2b2b4b;
}

:deep(.ant-drawer-title) {
  color: #ffffff;
}

.account-tip {
  color: #ffffff;
}

:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  position: relative;
  background-color: #23263c;
  border: 0;
  color: #ffffff;
}

:deep(
    .ant-form-vertical .ant-form-item-label > label,
    .ant-col-24.ant-form-item-label > label,
    .ant-col-xl-24.ant-form-item-label > label
  ) {
  color: #ffffff;
}

:deep(.ant-drawer-right.ant-drawer-open) {
  width: calc(100% + 60px);
  margin-right: -60px;
}

.q-toolbar {
  height: 100vh;
  max-height: unset !important;
  max-width: unset !important;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding: 0;

  .topActions {
    display: flex;

    justify-content: flex-end;
    width: 100%;
  }
}

.game-iframe {
  width: 100%;
  height: calc(100% - 35px);
}

// .game-iframe {
//     width: 100%;
//     height: 100%;
//     width: 100%;
//     // position: absolute;
//     // top: 40px;
//     left: 0;
//     right: 0;
//     margin: auto;
//     z-index: 999;
// }

.mobileshow {
  display: none;
}

@media (max-width: 768px) {
  :deep(.ant-drawer-right.ant-drawer-open) {
    margin-right: 0;
    max-width: 100%;
    width: 100%;
  }
  // .desktopview {
  //   display: none;
  // }
  .mobileshow {
    display: block;

    .numbers {
      // display: grid;
      // grid-template-areas: 1fr 1fr, 1fr 1fr, 2fr;
      // background: unset;
      gap: 20px;
      flex-direction: row;
      gap: 20px;
      flex-wrap: wrap;
      padding: 20px;
      border-radius: 20px;
      justify-content: center;

      .instruction {
        font-size: 14px;
      }

      .num {
        width: 100%;
      }
    }
  }
  :deep(.ant-drawer-body) {
    padding: 10px;
  }
  .button-group {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    overflow: hidden;
    margin: 50px auto 30px;
    border: 1px solid #ffffff;

    .common-btn {
      flex: 1;
      border: 0;
      background: #2b2b4b;
      border-radius: 0;
      font-size: 12px;
      text-align: center;

      &:hover {
        box-shadow: none;
      }

      &.active {
        background: #ffffff;
        color: #000000;
      }
    }
  }
  .drawer-btn {
    cursor: pointer;
    right: 40px;
    top: 10px;
    margin: auto;
    position: absolute;
    border-radius: 10px;
    text-align: center;
    background-color: $linear-bg-red;
    background-image: $linear-bg-red;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 15px;

    svg {
      width: 20px;
      fill: white;
    }

    &.active {
      // right: 0;
      // left: unset;
      // top: 0;
      // height: 50px;
      // width: 60px;
      // border-radius: 0;
      // margin: 0;
      // right: 0px;
      // z-index: 1;
      display: none;
    }
  }
  .additional-buttons {
    display: none;
    right: 0;
  }
  .additional-buttons.active {
    display: flex;
    right: 0px;
  }
}

.game-iframe {
  position: fixed;
  width: 100vw;
  z-index: 1;
  top: 35px;
}

.q-toolbar .topActions {
  position: fixed;
  width: 100vw;
  right: 0px;
  left: 0px;
  z-index: 999;
}

// @media (orientation: portrait) {
//   .game-iframe {
//     top: 0;
//       height: calc(100vh - 45px - env(safe-area-inset-top, 40px) - env(safe-area-inset-bottom, 59px) );
//       // padding-bottom: env(safe-area-inset-bottom, 40px);
//       padding-bottom: 45px;

//   }
// }
// @media (orientation: landscape) {
//   .game-iframe {
//     top: 0;
//       height: calc(100vh - env(safe-area-inset-left, 0) - env(safe-area-inset-right, 0) );
//       // padding: env(safe-area-inset-top, 40px) env(safe-area-inset-right, 40px)  env(safe-area-inset-bottom, 40px)  env(safe-area-inset-left, 40px) ;
//   }
// }
</style>
