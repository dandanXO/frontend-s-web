<template>
  <q-scroll-area>
    <q-dialog v-model="visible" v-if="visible" class="gameDialog" full-height full-width>
      <!--      <q-page-sticky id="sticky-item" position="bottom-right" style="z-index:999999;" :offset="fabPos"-->
      <!--                     v-touch-pan.prevent.mouse="moveFab"-->
      <!--      >-->
      <!--        <q-btn-->
      <!--            @click="closeDialog()"-->
      <!--            icon="close"-->
      <!--            direction="up"-->
      <!--            color="decent"-->
      <!--            class="bg-brightbtn close-btn"-->
      <!--            rounded-->
      <!--        >-->
      <!--        </q-btn>-->
      <!--      </q-page-sticky>-->
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
        <!--        <div class="topActions">-->
        <!--          <q-toolbar-title></q-toolbar-title>-->
        <!--          <q-btn-->
        <!--              v-if="!drawerVisible"-->
        <!--              flat-->
        <!--              @click="closeDialog()"-->
        <!--              round-->
        <!--              dense-->
        <!--              icon="close"-->
        <!--          />-->
        <!--          <q-btn-->
        <!--              v-if="!drawerVisible"-->
        <!--              flat-->
        <!--              @click="drawerVisible = !drawerVisible"-->
        <!--              round-->
        <!--              dense-->
        <!--              icon="menu_open"-->
        <!--          />-->
        <!--          <q-btn-->
        <!--              v-if="drawerVisible"-->
        <!--              flat-->
        <!--              @click="drawerVisible = !drawerVisible"-->
        <!--              round-->
        <!--              dense-->
        <!--              icon="read_more"-->
        <!--          />-->
        <!--        </div>-->

        <template v-if="transferInfo.platform === 'PG'">
          <iframe
            @load="loadGame()"
            v-show="!logoShow"
            v-bind:srcdoc="src"
            id="game-iframe"
            scrolling="no"
            frameborder="0"
            class="game-iframe"
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
        <!--        <q-drawer-->
        <!--            v-model="drawerVisible"-->
        <!--            :breakpoint="500"-->
        <!--            overlay-->
        <!--            bordered-->
        <!--            class="bg-primary"-->
        <!--            side="right"-->
        <!--        >-->
        <!--          <div class="q-pa-sm q-pt-sm">-->
        <!--            <div>-->
        <!--              &lt;!&ndash; Uncomment for quick Transfer &ndash;&gt;-->
        <!--              &lt;!&ndash; <q-btn-group push>-->
        <!--                <q-btn-->
        <!--                  size="sm"-->
        <!--                  :color="quickTransferTab ? 'white' : 'primary'"-->
        <!--                  glossy-->
        <!--                  :text-color="quickTransferTab ? 'black' : 'white'"-->
        <!--                  push-->
        <!--                  label="Quick Transfer"-->
        <!--                  icon="multiple_stop"-->
        <!--                  @click="quickTransferTab = true"-->
        <!--                />-->

        <!--                <q-btn-->
        <!--                  size="sm"-->
        <!--                  :color="!quickTransferTab ? 'white' : 'primary'"-->
        <!--                  glossy-->
        <!--                  :text-color="!quickTransferTab ? 'black' : 'white'"-->
        <!--                  push-->
        <!--                  label="Bank Transfer"-->
        <!--                  icon="account_balance"-->
        <!--                  @click="quickTransferTab = false"-->
        <!--                />-->
        <!--              </q-btn-group> &ndash;&gt;-->

        <!--              &lt;!&ndash; <template v-if="quickTransferTab">-->
        <!--                <div class="numbers">-->
        <!--                  <div class="instruction">Transfer amount to platform</div>-->

        <!--                  <q-btn-->
        <!--                    class="full-width"-->
        <!--                    push-->
        <!--                    glossy-->
        <!--                    color="brand"-->
        <!--                    v-for="(val, valIndex) in values"-->
        <!--                    :key="valIndex"-->
        <!--                    @click="submitTransfer(val)"-->
        <!--                  >-->
        <!--                    {{ val }}-->
        <!--                  </q-btn>-->
        <!--                </div>-->
        <!--              </template> &ndash;&gt;-->
        <!--              <template v-if="!quickTransferTab">-->
        <!--                <DepositComponent/>-->
        <!--              </template>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </q-drawer>-->
      </q-toolbar>
    </q-dialog>
    <q-dialog v-model="visibleComingSoon" class="gameDialog" style="width: 100%; margin: 0 auto">
      <!--      <img src="../../assets/logo-coming.png" style="width: 80%;"/>-->
    </q-dialog>
  </q-scroll-area>
</template>
<script setup id="GameModal">
import { userStore } from "stores/index";
// import { launchSessionGame } from "api/platform/platform";
// import { isMobile } from "utils/utils";
import { useRoute, useRouter } from "vue-router";
import { ref, defineExpose, reactive, shallowRef } from "vue";
import { isAndroid, isHuaweiPhone } from "boot/utils";

import { storeToRefs } from "pinia";
import { api } from "boot/axios";
import { useQuasar, Platform, AppFullscreen, openURL } from "quasar";
import liff from "@line/liff";
import { useI18n } from "vue-i18n";
// import { ScreenOrientation } from '@ionic-native/screen-orientation';
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

const fabPos = ref([18, 18]);
const draggingFab = ref(false);

const moveFab = (ev) => {
  draggingFab.value = ev.isFirst !== true && ev.isFinal !== true;

  fabPos.value = [fabPos.value[0] - ev.delta.x, fabPos.value[1] - ev.delta.y];
};

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
          message: "转账成功",
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
  visible.value = false;
  src.value = "";
  if (isAndroid() && !isHuaweiPhone()) {
    AppFullscreen.exit();
    window.screen.orientation.lock("portrait");
  }
};
const open = (gameName, platformCode, gameCode, gameType) => {
  transferInfo.value.platform = platformCode;

  localStorage.removeItem("isOpenFromAccount");
  localStorage.removeItem("isBacked");

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
      if (isAndroid() && !isHuaweiPhone()) {
        AppFullscreen.request();
        window.screen.orientation.unlock();
      }
      // visible.value = true;
      var way = null;
      if ("standalone" in window.navigator && window.navigator.standalone) {
        way = "IOS";
      } else {
        way = Platform.is.mobile ? "H5" : "WEB";
        if (Platform.is.capacitor) {
          if (Platform.is.android) {
            way = "ANDROID";
          }
        }
      }

      $q.loading.show({ message: t("lang.loading") });

      if (way !== "H5") {
        //Change to open at same page.
        if (platformCode === "platformType") {
          api
            .get(`/session/launch?_time=${new Date().getTime()}`, {
              params: {
                platform: gameCode,
                isMobile: Platform.is.mobile ? true : false,
                way: way
              }
            })
            .then((response) => {
              $q.loading.hide();

              if (way == "ANDROID") {
                var ref = cordova.InAppBrowser.open(response.data, "_blank", "location=no,zoom=no");
              } else {
                window.location.href = response.data;
              }
              // src.value = response.data;
              // visible.value = true;
            })
            .catch((err) => {
              $q.loading.hide();
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: err.message,
              //   icon: "report_problem"
              // });
            });
          return;
        }
        api
          .get(`/session/launch?_time=${new Date().getTime()}`, {
            params: {
              platform: platformCode,
              gameCode: gameCode,
              isMobile: Platform.is.mobile ? true : false,
              way: way
            }
          })
          .then((response) => {
            $q.loading.hide();
            let srcData = response.data;

            if (platformCode === "PG") {
              srcData = srcData.replaceAll(/\\\"/g, '"').replaceAll(/\n/g, "");
              src.value = srcData;
              visible.value = true;
            } else if (way === "ANDROID") {
              var ref = cordova.InAppBrowser.open(srcData, "_blank", "location=no,zoom=no");
            } else {
              window.location.href = srcData;
            }

            // src.value = response.data;
            // visible.value = true;
          })
          .catch((err) => {
            $q.loading.hide();
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: err.message,
            //   icon: "report_problem"
            // });
          });
      } else {
        if (platformCode === "platformType") {
          api
            .get(`/session/launch?_time=${new Date().getTime()}`, {
              params: {
                platform: gameCode,
                isMobile: Platform.is.mobile ? true : false,
                way: way
              }
            })
            .then((response) => {
              $q.loading.hide();
              // newWin.location.href = response.data;
              window.location.href = response.data;
            });
          return;
        }
        // ,headers: platformCode === 'PG' ? { 'Cache-Control': 'no-cache, no-store, must-revalidate' } : {}
        api
          .get(`/session/launch?_time=${new Date().getTime()}`, {
            params: {
              platform: platformCode,
              gameCode: gameCode,
              isMobile: Platform.is.mobile ? true : false,
              way: way
            }
          })
          .then((response) => {
            $q.loading.hide();

            let srcData = response.data;

            if (platformCode === "PT") {
              if (Platform.is.ios && Platform.is.mobile && Platform.is.safari) {
                visible.value = true;
                src.value = srcData;
              } else {
                window.open(response.data, "_blank");
              }
            } else if (platformCode === "PG") {
              srcData = srcData.replaceAll(/\\\"/g, '"').replaceAll(/\n/g, "");
              src.value = srcData;
              visible.value = true;
            } else if (platformCode === "SABA") {
              // newWin.location.href = response.data;
              var currentUrl = window.location.hostname;
              window.location.href = response.data + `&homeUrl=${currentUrl}`;
            } else if (way == "ANDROID") {
              var ref = cordova.InAppBrowser.open(srcData, "_blank", "location=no,zoom=no");
            } else {
              window.location.href = srcData;
            }

            // newWin.location.href = response.data;
            // window.location.href = response.data;
          })
          .catch((err) => {
            $q.loading.hide();
            // $q.notify({
            //   color: "negative",
            //   position: "top",
            //   message: err.message,
            //   icon: "report_problem"
            // });
          });
      }
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

.close-btn {
  height: 56px;
}

#iphone-tips-close-button {
  visibility: visible !important;
}
</style>

<style scoped lang="scss">
.numbers {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  overflow: auto;
  align-items: stretch;
  justify-content: flex-start;
  margin-top: 50px;
  padding: 10px;
  font-size: 10px;
  text-align: center;

  .amt-numbers {
    margin: 5px -10px;
  }

  .num {
    font-size: 12px;
    // background-image: linear-gradient(to right, #de4545, #db7e42);
    // padding: 10px 0;
    // text-align: center;
    // border-radius: 0 10px 10px 0;
    // cursor: pointer;

    // background-image: linear-gradient(to right, #b845de, #4299db);
    text-align: center;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0px 0px 10px 0 #000;
    padding: 10px 5px;
    position: relative;

    &:before,
    &:after {
      position: absolute;
      content: "";
      display: block;
      width: 140%;
      height: 100%;
      left: -20%;
      z-index: -1000;
      transition: all ease-in-out 0.5s;
      background-repeat: no-repeat;
    }

    &:before {
      display: none;
      top: -95%;
      background-image: radial-gradient(circle, #db7e42 20%, transparent 20%),
        radial-gradient(circle, transparent 20%, #db7e42 20%, transparent 30%),
        radial-gradient(circle, #db7e42 20%, transparent 20%), radial-gradient(circle, #db7e42 20%, transparent 20%),
        radial-gradient(circle, transparent 10%, #db7e42 15%, transparent 20%),
        radial-gradient(circle, #db7e42 20%, transparent 20%), radial-gradient(circle, #db7e42 20%, transparent 20%),
        radial-gradient(circle, #db7e42 20%, transparent 20%), radial-gradient(circle, #db7e42 20%, transparent 20%);
      background-size:
        10% 10%,
        20% 20%,
        15% 15%,
        20% 20%,
        18% 18%,
        10% 10%,
        15% 15%,
        10% 10%,
        18% 18%;
    }

    &:after {
      bottom: -95%;
      background-image: radial-gradient(circle, #db7e42 20%, transparent 20%),
        radial-gradient(circle, #db7e42 20%, transparent 20%),
        radial-gradient(circle, transparent 10%, #db7e42 15%, transparent 20%),
        radial-gradient(circle, #db7e42 20%, transparent 20%), radial-gradient(circle, #db7e42 20%, transparent 20%),
        radial-gradient(circle, #db7e42 20%, transparent 20%), radial-gradient(circle, #db7e42 20%, transparent 20%);
      background-size:
        15% 15%,
        20% 20%,
        18% 18%,
        20% 20%,
        15% 15%,
        10% 10%,
        20% 20%;
    }

    &.animate {
      transform: translateZ(45deg);
    }

    &.animate:before {
      content: "";
      display: block;
      animation: topBubbles ease-in-out 0.75s forwards;
      z-index: 0;
    }

    &.animate:after {
      content: "";
      display: block;
      animation: bottomBubbles ease-in-out 0.75s forwards;
      z-index: 100;
    }

    @keyframes topBubbles {
      0% {
        background-position:
          5% 90%,
          10% 90%,
          10% 90%,
          15% 90%,
          25% 90%,
          25% 90%,
          40% 90%,
          55% 90%,
          70% 90%;
      }
      50% {
        background-position:
          0% 80%,
          0% 20%,
          10% 40%,
          20% 0%,
          30% 30%,
          22% 50%,
          50% 50%,
          65% 20%,
          90% 30%;
      }
      100% {
        background-position:
          0% 70%,
          0% 10%,
          10% 30%,
          20% -10%,
          30% 20%,
          22% 40%,
          50% 40%,
          65% 10%,
          90% 20%;
        background-size:
          0% 0%,
          0% 0%,
          0% 0%,
          0% 0%,
          0% 0%,
          0% 0%;
      }
    }
    @keyframes bottomBubbles {
      0% {
        background-position:
          10% -10%,
          30% 10%,
          55% -10%,
          70% -10%,
          85% -10%,
          70% -10%,
          70% 0%;
      }
      50% {
        background-position:
          0% 80%,
          20% 80%,
          45% 60%,
          60% 100%,
          75% 70%,
          95% 60%,
          105% 0%;
      }
      100% {
        background-position:
          0% 90%,
          20% 90%,
          45% 70%,
          60% 110%,
          75% 80%,
          95% 70%,
          110% 10%;
        background-size:
          0% 0%,
          0% 0%,
          0% 0%,
          0% 0%,
          0% 0%,
          0% 0%;
      }
    }
  }
}

.drawer-btn {
  display: none;
}

.additional-buttons {
  position: absolute;
  right: -60px;
  width: 60px;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  background: #2b2b4b;

  .bottom-button {
    display: block;
    transform-origin: left top;
    padding: 10px;
    font-size: 13px;
    text-align: center;
    border-radius: 0 10px 10px 0;
    transform: rotate3d(0, 0, 1, 90deg);
    cursor: pointer;
    box-shadow: 0px 0px 10px 0 #000;
    padding: 10px 5px;
    width: 120px;
    transform-origin: top left;
    margin-top: -140px;
    margin-left: 50px;
    border-radius: 10px;
  }
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
  background-color: #212534;
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
  height: 100%;
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
  height: 100%;
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
    background-color: linear-gradient(to right, #de4545, #db7e42);
    background-image: linear-gradient(to right, #de4545, #db7e42);
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
  top: 0px;
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
