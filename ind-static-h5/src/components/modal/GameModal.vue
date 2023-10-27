<template>
  <q-scroll-area>
    <q-dialog v-model="visible" class="gameDialog" full-height full-width>
      <q-toolbar>
        <div class="topActions">
          <q-btn v-if="!drawerVisible" dense rounded icon="reply" class="bg-yellow text-black" @click="onExitClick" />
          <q-toolbar-title></q-toolbar-title>
          <q-btn
            v-if="!drawerVisible"
            dense
            rounded
            icon="add"
            class="bg-yellow text-black"
            @click="drawerVisible = !drawerVisible"
          />
        </div>

        <div class="loader-container">
          <div><q-spinner color="yellow" size="10em" :thickness="10" /></div>
          <div>Loading... Please wait...</div>
        </div>

        <iframe
          @load="loadGame()"
          v-show="!logoShow"
          :src="src"
          id="game-iframe"
          scrolling="no"
          frameborder="0"
          class="game-iframe"
        ></iframe>

        <!-- <q-drawer v-model="drawerVisible" :breakpoint="500" overlay bordered class="bg-primary" side="right">
          <div class="q-pa-sm q-pt-sm">
            <div></div>
          </div>
        </q-drawer> -->

        <q-dialog width="100%" v-model="drawerVisible" presistent>
          <div class="popout-dialog">
            <q-btn dense rounded icon="close" class="bg-yellow text-black popout-close" v-close-popup />
            <div class="popout-dialog-container">
              <div class="popout-main-title">
                <div class="txt-title">Deposit</div>
              </div>
              <div class="deposit-item-container">
                <template v-for="(item, index) in depositItems" :key="index">
                  <div @click="handleDepositItemClick(index)" :class="['deposit-item', item.isActive && 'active']">
                    <div class="deposit-icon">
                      <img
                        :src="require(`../../assets/images/index/popout/deposit-coin-${item.amount}.png`)"
                        :alt="item.amount + ' Coin'"
                      />
                      <div class="deposit-hot-label" v-if="isUpi2Active">+₹{{ item.hotLabel }}</div>
                    </div>
                    <div class="deposit-amt">{{ item.amount }}</div>
                  </div>
                </template>
              </div>
              <div class="deposit-enter-amt">
                <div>Amount</div>
                <q-input class="deposit-input" filled v-model="depositAmountInput" dense clearable></q-input>
              </div>
              <div class="deposit-options">
                <q-btn
                  flat
                  class="deposit-option-btn"
                  :class="{ active: isUpi1Active }"
                  label="UPI1"
                  @click="handleDepositUpiClick(1)"
                />
                <q-btn
                  flat
                  class="deposit-option-btn label-on-discount"
                  :class="{ active: isUpi2Active }"
                  label="UPI2"
                  @click="handleDepositUpiClick(2)"
                />

                <!-- <q-btn flat class="deposit-option-btn active" label="UPI1" />
          <q-btn flat class="deposit-option-btn label-on-discount" label="UPI2" /> -->
              </div>
              <div class="btn-go">Go</div>
            </div>
          </div>
        </q-dialog>
      </q-toolbar>
    </q-dialog>
    <q-dialog v-model="visibleComingSoon" class="gameDialog" style="width: 100%; margin: 0 auto">
      <!-- <img src="../../assets/logo-coming.png" style="width: 80%" /> -->
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
import { useQuasar, Platform, AppFullscreen, Notify } from "quasar";
// import { ScreenOrientation } from '@ionic-native/screen-orientation';
const $q = useQuasar();

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
// const quickTransferTab = ref(false);

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
const exitClickCount = ref(0);

const onExitClick = () => {
  if (exitClickCount.value === 1) {
    closeDialog();
    exitClickCount.value = 0;
  } else {
    exitClickCount.value++;
    Notify.create({
      timeout: 1000,
      position: "top",
      message: "Tap one more time to exit"
    });

    setTimeout(() => {
      exitClickCount.value = 0;
    }, 2000);
  }
};

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
      api
        .get(`/session/launch?_time=${new Date().getTime()}`, {
          params: {
            platform: platformCode,
            gameCode: gameCode,
            isMobile: Platform.is.mobile ? true : false,
            way: way
          }
        })
        .then((ret) => {
          const res = ret;
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

const depositItems = reactive([
  { amount: 100, hotLabel: 5, isActive: false },
  { amount: 300, hotLabel: 15, isActive: false },
  { amount: 500, hotLabel: 25, isActive: false },
  { amount: 1000, hotLabel: 50, isActive: false },
  { amount: 3000, hotLabel: 150, isActive: false },
  { amount: 5000, hotLabel: 250, isActive: false },
  { amount: 10000, hotLabel: 500, isActive: false },
  { amount: 30000, hotLabel: 1500, isActive: false },
  { amount: 50000, hotLabel: 2500, isActive: false }
]);

const handleDepositItemClick = (index) => {
  depositItems.forEach((item, i) => {
    item.isActive = i === index;
    if (i === index) {
      depositAmountInput.value = item.amount;
    }
  });
};

const isUpi1Active = ref(true);
const isUpi2Active = ref(false);

const handleDepositUpiClick = (option) => {
  if (option === 1) {
    isUpi1Active.value = true;
    isUpi2Active.value = false;
  } else if (option === 2) {
    isUpi1Active.value = false;
    isUpi2Active.value = true;
  }
};

const depositAmountInput = ref("");

defineExpose({
  open
});
</script>

<style lang="scss">
.gameDialog {
  background-color: #4b027c;
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
  background: transparent;
  background-image: url(../../assets/images/index/modal-bg.png);
  background-size: cover;
  background-position: top center;

  .topActions {
    display: flex;

    justify-content: flex-end;
    width: 100%;
    padding: 16px;
  }
}

.game-iframe {
  width: 100%;
  height: calc(100% - 65px);
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
    background-color: #db0011;
    background-image: #db0011;
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
  top: 65px;
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

.popout-dialog {
  width: 90%;

  max-width: 500px;
  position: relative;
  padding-top: 90px;
  padding-right: 10px;

  .popout-close {
    position: absolute;
    right: 0px;
    top: 80px;
  }

  .popout-dialog-container {
    background-image: url(../../assets/images/index/popout/deposit-bg.png);
    background-position: bottom center;
    background-size: cover;
    background-repeat: no-repeat;
    padding: 30px 20px 20px;
    border-radius: 30px !important;
  }

  .popout-main-title {
    background-image: url(../../assets/images/index/popout/popout-title.png);
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center center;
    width: 100%;
    max-width: 290px;
    height: 120px;
    margin: -110px auto 0;
    // position: absolute;
    // top: 0px;
    position: relative;

    .txt-title {
      background-color: #f3ec78;
      background-image: linear-gradient(180deg, #fff0a0 17.41%, #fff8d4 17.41%, #ffdc26 67.56%);
      background-size: 100%;
      -webkit-background-clip: text;
      -moz-background-clip: text;
      -webkit-text-fill-color: transparent;
      -moz-text-fill-color: transparent;
      line-height: 1;
      font-size: 22px;
      font-weight: 800;
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: #a94700;

      position: absolute;
      bottom: 28px;
      left: 52%;
      transform: translate(-50%, 0%);
    }
  }

  .deposit-item-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    row-gap: 12px;
    column-gap: 8x;

    .deposit-item {
      .deposit-icon {
        background-image: url(../../assets/images/index/popout/deposit-item-frame.png);
        background-position: top center;
        background-size: contain;
        background-repeat: no-repeat;
        display: flex;
        height: 80px;
        position: relative;
        align-items: center;
        justify-content: center;
        margin-left: 3px;
        margin-right: 3px;
        transition: all 0.3s;
        img {
          display: block;
          width: 70%;
        }
      }

      &.active > .deposit-icon {
        background-image: url(../../assets/images/index/popout/deposit-item-frame-active.png);
      }

      .deposit-hot-label {
        position: absolute;
        top: 0;
        right: 0;
        background-image: url(../../assets/images/index/popout/hot-label.png);
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center center;
        width: 50px;
        height: 28px;
        font-size: 0.725rem;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        padding-bottom: 3px;
      }

      .deposit-amt {
        background-image: url(../../assets/images/index/popout/deposit-item-frame-amount.png);
        background-position: center center;
        background-size: contain;
        background-repeat: no-repeat;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        padding: 3px;
        width: 100%;
        max-width: 100px;
        margin: auto;
      }
    }
  }

  .deposit-enter-amt {
    display: flex;
    gap: 16px;
    align-items: center;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;

    .deposit-input {
      background-color: rgba(21, 0, 37, 0.5);
      border-radius: 5px;
      width: 100%;
    }
  }

  .deposit-options {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 16px;
    .deposit-option-btn {
      color: #cccccc;
      background-color: rgba(21, 0, 37, 0.5) !important;
      min-width: 100px;
      max-width: 160px;
      width: 100%;
      border-radius: 6px;
      border: 3px solid transparent;

      &.active {
        color: #ffe66b;
        border: 3px solid #ffe66b;
      }

      &.label-on-discount {
        position: relative;
        &:after {
          content: "";
          background-image: url(../../assets/images/index/popout/label-discount.png);
          background-repeat: no-repeat;
          display: block;
          position: absolute;
          top: -4px;
          right: -5px;
          width: 30px;
          height: 30px;
          background-size: 100%;
        }
      }
    }
  }
}
.loader-container {
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
}
</style>
