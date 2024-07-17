<template>
  <q-ajax-bar ref="ajaxBarRef" position="top" size="5px" skip-hijack
    style="background:linear-gradient(320.55deg, #0286FF 0.35%, #00FF85 99.65%)" />
  <q-scroll-area>
    <q-dialog v-model="visible" class="gameDialog" full-height full-width>
      <q-toolbar>
        <div class="topActions">
          <q-toolbar-title>{{ title }}</q-toolbar-title>
          <q-btn v-if="!drawerVisible" flat @click="closeDialog()" round dense icon="close" />
        </div>

        <template v-if="isInnerHtmlSrc === false">
          <iframe @load="loadGame()" v-show="!logoShow" :src="src" id="game-iframe" scrolling="auto" frameborder="0"
            class="game-iframe"></iframe>
        </template>
        <template v-else>
          <iframe @load="loadGame()" v-show="!logoShow" v-bind:srcdoc="src" id="game-iframe" scrolling="auto"
            frameborder="0" class="game-iframe"></iframe>
        </template>
      </q-toolbar>
    </q-dialog>
    <q-dialog v-model="visibleComingSoon" class="gameDialog" style="width: 100%; margin: 0 auto">
      Coming Soon
    </q-dialog>
  </q-scroll-area>
</template>
<script setup id="GameModal">
import { userStore } from "stores/index";
import { useRoute, useRouter } from "vue-router";
import { ref, defineExpose, reactive, shallowRef } from "vue";
import { storeToRefs } from "pinia";
import { api } from "boot/axios";
import { useQuasar, Platform, AppFullscreen } from "quasar";

import { useI18n } from "vue-i18n";

const $q = useQuasar();

const { t } = useI18n();

const store = userStore();
const { token } = storeToRefs(store);
const ajaxBarRef = ref(null);

var payMethods = reactive([]);
const bankCardList = ref([]);
const selectedPayType = shallowRef("");

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
const isInnerHtmlSrc = ref(false);
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
  ajaxBarRef.value.start();
  localStorage.removeItem("isOpenFromAccount");
  localStorage.removeItem("isBacked");

  isInnerHtmlSrc.value = false;

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
          let srcDoc = ret.data.data;
          var firstFourChars = srcDoc.substring(0, 4).toLowerCase();
          if (firstFourChars === "http") {
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
        }).finally(() => {
          ajaxBarRef.value.stop();
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

:deep(.ant-form-vertical .ant-form-item-label > label,
  .ant-col-24.ant-form-item-label > label,
  .ant-col-xl-24.ant-form-item-label > label) {
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
</style>
