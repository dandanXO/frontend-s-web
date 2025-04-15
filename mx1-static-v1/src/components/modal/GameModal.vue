<template>
  <q-scroll-area>
    <q-dialog v-model="visible" class="gameDialog" full-height full-width persistent no-esc-dismiss no-backdrop-dismiss>
      <q-toolbar>
        <div class="topActions">
          <q-icon name="chevron_left" size="30px" @click="onExitClick" />
          <div class="game-logo-img">
            <img src="@/assets/logo.png" />
          </div>

          <div v-if="!drawerVisible" class="wallet-container" @click="goToDeposit()">
            {{ $t("btn.addCash") }} &nbsp;
            <q-btn dense rounded class="wallet-btn">
              <img src="@/assets/images/index/icon-wallet.png" />
            </q-btn>
          </div>
        </div>

        <div class="loader-container">
          <div><q-spinner color="yellow" size="10em" :thickness="10" /></div>
          <div>{{ $t("btn.loading_plsWait") }}</div>
        </div>

        <template v-if="isInnerHtmlSrc === false">
          <iframe
            @load="loadGame()"
            v-show="!logoShow"
            :src="src"
            id="game-iframe"
            scrolling="auto"
            frameborder="0"
            allow="autoplay; clipboard-write"
            class="game-iframe"
            :style="`height: calc(100% - 65px - ${ui.bottomInsetHeight}px);`"
          ></iframe>
        </template>
        <template v-else>
          <iframe
            @load="loadGame()"
            v-show="!logoShow"
            v-bind:srcdoc="src"
            id="game-iframe"
            scrolling="auto"
            frameborder="0"
            class="game-iframe"
            :style="`height: calc(100% - 65px - ${ui.bottomInsetHeight}px);`"
          ></iframe>
        </template>

        <q-dialog width="100%" v-model="drawerVisible" presistent>
          <div class="popout-dialog">
            <q-btn dense rounded icon="close" class="bg-yellow text-black popout-close" v-close-popup />
            <div class="popout-dialog-container-gold">
              <div class="popout-main-title">
                <div class="txt-title">Deposit</div>
              </div>
              <DepositComponent />
            </div>
          </div>
        </q-dialog>
      </q-toolbar>
    </q-dialog>
    <q-dialog v-model="visibleComingSoon" class="gameDialog" style="width: 100%; margin: 0 auto">
      <!-- <img src="@/assets/logo-coming.png" style="width: 80%" /> -->
    </q-dialog>

    <q-dialog width="100%" v-model="isExitDialogOpen" presistent>
      <div class="popout-dialog">
        <q-btn dense rounded icon="close" class="popout-close" v-close-popup />
        <div class="popout-dialog-container">
          <div class="txt-content q-mt-md text-center">{{ $t("notify.quitGameMessage") }}</div>
          <div class="q-mt-lg q-pl-lg q-pr-lg y-n-container" style="gap:0px;">
            <q-btn :label="$t('btn.cancel')" no-caps class="btn-cancel" v-close-popup style="margin-right: 24px;" />
            <q-btn :label="$t('btn.confirm')" no-caps class="btn-confirm" @click="closeDialog()" v-close-popup />
          </div>
        </div>
      </div>
    </q-dialog>

    <q-dialog
      v-model="fullDepositDialog"
      persistent
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      class="full-deposit-dialog"
    >
      <q-card class="full-deposit-card" id="fulldeposit">
        <div class="back-bar" @click="closeFullDepositDialog">
          <q-icon name="chevron_left" size="28px" />
          {{ $t("btn.back") }}
        </div>

        <q-card-section>
          <DepositView @closeModal="closeDialog"></DepositView>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-scroll-area>
</template>
<script setup id="GameModal">
import { Platform, useQuasar } from "quasar";
import { defineExpose, ref, shallowRef, onUnmounted, watch  } from "vue";
import { useRoute, useRouter } from "vue-router";

import { api } from "@/boot/axios";
import { isAndroid } from "@/boot/utils";
import DepositComponent from "@/components/depositComponent.vue";
import DepositView from "@/pages/account/DepositView.vue";
import { userStore } from "@/stores/index";
import { useUI } from "@/stores/ui";
import { App } from "@capacitor/app";
import { storeToRefs } from "pinia";

const props = defineProps(["closeFullGameDialog"]);

const fullDepositDialog = ref(false);

const $q = useQuasar();
const ui = useUI();

const store = userStore();
const { token } = storeToRefs(store);
const bankCardList = ref([]);
const selectedPayType = shallowRef("");
const closeFullDepositDialog = () => {
  fullDepositDialog.value = false;
  store.getBalance();
};

const drawerVisible = ref(false);
const isExitDialogOpen = ref(false);
const onExitClick = () => {
  isExitDialogOpen.value = true;
};

const handleDrawerVisible = () => {
  if (!store.realName) {
    closeDialog();
    props.closeFullGameDialog();
  } else {
    drawerVisible.value = !drawerVisible.value;
  }
};

const router = useRouter();
const isOpenCalled= ref(false);
const route = useRoute();
const visible = ref(false);
const isInnerHtmlSrc = ref(false);
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
  visible.value = false;
  src.value = "";
  store.getBalance();
  isOpenCalled.value = false;
  router.replace({
    query: {
      ...route.query,
      gameModal: undefined
    }
  });
  // AppFullscreen.exit()
  if (isAndroid()) {
    screen.orientation.lock("portrait");
    App.removeAllListeners();
  }
};

const goToDeposit = () => {
  fullDepositDialog.value = true;
  // closeDialog();
  // props.closeFullGameDialog();
  // setTimeout(() => {
  // router.push("/deposit");
  // router.push("/deposit?from=" + route.path);
  // }, 500);
};

const platformCodeImg = ref();
const open = (gameName, platformCode, gameCode, gameType) => {
  // debugger;
  // AppFullscreen.request()
  isInnerHtmlSrc.value = false;
  platformCodeImg.value = platformCode;
  isOpenCalled.value = true;

  //TESt
  localStorage.removeItem("isOpenFromAccount");
  localStorage.removeItem("isBacked");
  if (isAndroid()) {
    screen.orientation.unlock();

    App.addListener("backButton", (backEvent) => {
      onExitClick();
    });
  } else {
    window.addEventListener("popstate", handleBackButtonClick);
    router.push({ query: { ...route.query, gameModal: "true" } });
  }
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
  title.value = gameName;
  const store = userStore();

  if (store.memberType !== "TEST" && gameType === "TEST") {
    visibleComingSoon.value = true;
  } else {
    if (store.hasToken()) {
      if (platformCode !== "LuckySport") {
        visible.value = true;
      }

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

      api
        .get(`/session/launch?_time=${new Date().getTime()}`, {
          params: {
            platform: platformCode,
            gameCode: gameCode,
            isMobile: Platform.is.mobile ? true : false,
            way: way
          }
        })
        .then((res) => {
          let srcDoc = res.data;
          var firstFourChars = srcDoc.substring(0, 4).toLowerCase();
          if (platformCode === "LuckySport") {
            window.open(srcDoc, "_blank");
          } else if (firstFourChars === "http") {
            src.value = srcDoc;
          } else {
            isInnerHtmlSrc.value = true;

            const scriptEndTag = "</" + "script>";
            srcDoc = srcDoc
              .replace(/<\/script>/g, scriptEndTag)
              .replace(/\\\"/g, '"')
              .replace(/\n/g, "");

            src.value = srcDoc;
          }
        });
    } else {
      props.closeFullGameDialog();
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

const handleBackButtonClick = async () => {
  if (!visible.value) return;
  onExitClick();
};

const cancelCloseDialog = () => {
  isExitDialogOpen.value = false;
  router.push({ query: { ...route.query, gameModal: "true" } });
};

onUnmounted(() => {
  window.removeEventListener("popstate", handleBackButtonClick);
});

watch(
  () => route.query,
  (query) => {
    if (query.gameModal && !isOpenCalled.value) {
      const _query = { ...query };
      delete _query.gameModal;
      router.push({ query: _query });
    }
  }
);

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
  background: #1d1d27;

  .topActions {
    background: linear-gradient(180deg, #3e1474 0%, #101114 96.35%);
    box-shadow: 0px 3 7px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 16px;
    align-items: center;

    .game-logo-img {
      height: 50px;
      position: absolute;
      top: 10px;
      left: 45px;
      .game-logo {
        width: 30vw;
        background-position: center;
        height: 100%;
        background-repeat: no-repeat;
        background-size: contain;
      }

      img {
        display: block;
        height: 100%;
        width: auto;
      }
    }
  }
}

.game-iframe {
  width: 100%;
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

  .popout-dialog-container-gold {
    background-position: bottom center;
    background-size: cover;
    background-repeat: no-repeat;
    padding: 30px 20px 20px;
    border-radius: 30px !important;
  }

  .popout-main-title {
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

      .deposit-hot-label {
        position: absolute;
        top: 0;
        right: 0;
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

  .btn-cancel {
    background: rgba(21, 0, 37, 0.5);
    font-weight: 700;
    color: #ffffff;
    border-radius: 8px;
  }

  .btn-confirm {
    background: linear-gradient(180deg, #ffcd5c 0%, #fea800 100%);
    font-weight: 700;
    color: #150025;
    border-radius: 8px;
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

.full-deposit-card {
  background: #11131f;
  margin: 0px;
  padding: 0 16px;
}

.back-bar {
  background: linear-gradient(180deg, #3e1474 0%, #101114 96.35%);
  min-height: 60px;
  width: calc(100% + 32px);
  font-size: 18px;
  display: flex;
  align-items: center;
  padding: 16px;
  margin: 0 -16px;
}
</style>
