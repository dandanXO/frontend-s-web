<template>
  <el-dialog v-model="visible" width="100%" class="full-modal" :title="title" destroyOnClose :afterClose="destroyGame" :before-close="handleClose">
    <TFLoading v-if="logoShow"></TFLoading>
    <template v-if="transferInfo.platform === 'PG'">
      <iframe
        allow="fullscreen"
        @load="loadGame()"
        v-show="!logoShow"
        v-bind:srcdoc="src"
        id="game-iframe"
        scrolling="auto"
        frameborder="0"
        class="game-iframe"
      ></iframe>
    </template>
    <template v-else>
      <iframe
        allow="fullscreen"
        @load="loadGame()"
        v-show="!logoShow"
        :src="src"
        id="game-iframe"
        scrolling="auto"
        frameborder="0"
        class="game-iframe"
      ></iframe>
    </template>

    <div @click="showDrawer()" class="drawer-btn" :class="{ active: isMobileDrawerActive }">Quick Actions</div>

    <div :class="{ active: isMobileDrawerActive }" class="additional-buttons desktopview" v-if="!drawerVisible">
      <!-- <div class="numbers">
        <div class="amt-numbers">โอนด่วน</div>
        <div
          v-for="(val, valIndex) in values"
          :key="valIndex"
          class="num"
          @click="submitTransfer(val)"
          :class="{ animate: isClicked === val }"
        >
          {{ val }}
        </div>
      </div> -->
      <div>
        <span class="top-button" @click="showDrawer">存款</span>
      </div>
      <div>
        <span class="more-button" @click="copyGameLink">复制网址</span>
      </div>
    </div>
    <el-drawer
      :append-to-body="true"
      :width="'100%'"
      style="max-width: 500px"
      :placement="'right'"
      v-model="drawerVisible"
      :get-container="false"
      :style="{ position: 'absolute', overflow: 'hidden' }"
      @close="onClose"
      :closable="true"
    >
      <!-- <template #extra>
        <el-button style="margin-right: 8px" @click="onClose">Cancel</el-button>
        <el-button type="primary" @click="onClose">Submit</el-button>
      </template> -->
      <div class="mobileshow">
        <!-- <div class="button-group">
          <div
            @click="quickTransferTab = true"
            class="common-btn"
            :class="{ active: quickTransferTab }"
          >
            โอนด่วน
          </div>
          <div
            @click="quickTransferTab = false"
            class="common-btn"
            :class="{ active: !quickTransferTab }"
          >
            Bank Transfer
          </div>
        </div> -->
        <template v-if="quickTransferTab">
          <div class="numbers">
            <div class="instruction">Transfer amount to platform</div>

            <div
              v-for="(val, valIndex) in values"
              :key="valIndex"
              class="num"
              @click="submitTransfer(val)"
              :class="{ animate: isClicked === val }"
            >
              {{ val }}
            </div>
          </div>
        </template>
      </div>

      <span v-if="!quickTransferTab">
        <!-- <div class="">
          <span class="title">快速存款</span>
        </div> -->
        <DepositComponent />
      </span>
    </el-drawer>
  </el-dialog>
  <el-dialog
    v-model="visibleComingSoon"
    :footer="null"
    width="100%"
    :maskClosable="false"
    wrap-class-name="full-modal"
    :title="title"
    destroyOnClose
  >
    <ComingSoon></ComingSoon>
  </el-dialog>
  <el-dialog v-model="closeGameConfirmDialog" width="500px" align-center persistent title="温馨提示">
    <div class="dialog-header">您当前操作将会离开游戏，是否继续</div>
    <div class="dialog-footer">
      <el-button color="grey" @click="closeGameConfirmDialog = false">取消</el-button>
      <el-button type="primary" @click="handleConfirmClose">确定</el-button>
    </div>
  </el-dialog>
</template>
<script setup id="GameModal">
import { userStore } from "@/store";
import { launchSessionGame } from "@/api/platform/platform";
import { isMobile } from "@/utils/utils";
import { ref, defineExpose } from "vue";
import ComingSoon from "@/components/loading/ComingSoon";
import TFLoading from "@/components/loading/TFLoading";
import { transfer } from "@/api/personal/transfer";
// import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import DepositComponent from "@/components/depositComponent.vue";
import { ElMessageBox } from "element-plus";
// import { Modal } from "ant-design-vue";
import { writeClipboard } from "@/utils/clipboard";

const store = userStore();
const { token } = storeToRefs(store);
const isMobileDrawerActive = ref(false);
const values = ref(["100", "200", "300", "500", "1000"]);

const quickTransferTab = ref(true);

const drawerVisible = ref(false);
const closeGameConfirmDialog = ref(false);

const showDrawer = () => {
  quickTransferTab.value = false;
  drawerVisible.value = true;
};

const copyGameLink = () => {
  if (src.value) {
    writeClipboard(src.value)
  }
}

const onClose = () => {
  drawerVisible.value = false;
};
const destroyGame = () => {
  // Modal.destroyAll();
  // // let iframe = document.getElementedById("game-iframe")
  // // iframe.parentNode.removeChild(iframe)
  // logoShow.value = true;
  // src.value = "";
};
// const router = useRouter();
// const route = useRoute();
const visible = ref(false);
const visibleComingSoon = ref(false);
const src = ref("");
const logoShow = ref(true);
const title = ref("");
const confirmDialogCloseFn = ref(null);

const transferInfo = ref({
  amount: null,
  platform: null
});
const isClicked = ref("");
const submitTransfer = (amount) => {
  transferInfo.value.amount = amount;
  transfer(0, transferInfo.value)
    .then((response) => {
      if (response.code === 0) {
        // message.success("สำเร็จ");
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
      console.log(error.message);
      // message.error(error.message, 4);
    });
};
const open = (gameName, platformCode, gameCode, gameType) => {
  transferInfo.value.platform = platformCode;
  logoShow.value = true;
  src.value = "";
  title.value = gameName;
  const store = userStore();
  if (store.memberType !== "TEST" && gameType === "TEST") {
    visibleComingSoon.value = true;
  } else {
    if (store.token) {
      if (platformCode === "onlyPlatform") {
        launchSessionGame(gameCode, {
          isMobile: isMobile()
        }).then((res) => {
          src.value = res.data;
          visible.value = true;
        });
      } else if (
        platformCode === "TCG" ||
        platformCode === "VR" ||
        platformCode === "LBkeno" ||
        platformCode === "JOKER"
      ) {
        launchSessionGame(platformCode, {
          gameCode: gameCode,
          isMobile: isMobile()
        }).then((res) => {
          window.open(
            res.data,
            "popUpWindow",
            "fullscreen=yes,resizable=no,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=no"
          );
        });
      } else {
        launchSessionGame(platformCode, {
          gameCode: gameCode,
          isMobile: isMobile()
        }).then((res) => {
          let srcData = res.data;

          if (platformCode === "PG") {
            const scriptEndTag = "</" + "script>";
            srcData = res.data
              .replace(/<\/script>/g, scriptEndTag)
              .replaceAll(/\\\"/g, '"')
              .replaceAll(/\n/g, "");
          }

          src.value = srcData;
          visible.value = true;
        });
      }
    } else {
      // router.push("/login");
      ElMessageBox.alert("请登录后再操作", "系统提示", {
        // if you want to disable its autofocus
        // autofocus: false,
        center: true,
        confirmButtonText: "确认",
        showClose: false,
        buttonSize: "large"
      });
    }
  }
};

const loadGame = () => {
  if (src.value !== "") {
    logoShow.value = false;
  }
};

const handleClose = (done) => {
  closeGameConfirmDialog.value = true;
  confirmDialogCloseFn.value = done;
};

const handleConfirmClose = () => {
  closeGameConfirmDialog.value = false;
  confirmDialogCloseFn.value();
};
defineExpose({
  open
});
</script>
<style lang="scss">
.sm .ant-modal {
  width: 100%;
  max-width: 400px;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;

  .ant-modal-content {
    width: 90%;
  }
  .confirm-btn {
    padding: 5px;
    min-width: unset;
    font-weight: normal;
  }
}

.node-modal .node .node .account-title-container {
  margin: 0;
}
</style>

<style scoped lang="scss">
.numbers {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  background: #201f2a;
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
      background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%, 10% 10%, 18% 18%;
    }
    &:after {
      bottom: -95%;
      background-image: radial-gradient(circle, #db7e42 20%, transparent 20%),
        radial-gradient(circle, #db7e42 20%, transparent 20%),
        radial-gradient(circle, transparent 10%, #db7e42 15%, transparent 20%),
        radial-gradient(circle, #db7e42 20%, transparent 20%), radial-gradient(circle, #db7e42 20%, transparent 20%),
        radial-gradient(circle, #db7e42 20%, transparent 20%), radial-gradient(circle, #db7e42 20%, transparent 20%);
      background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%;
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
        background-position: 5% 90%, 10% 90%, 10% 90%, 15% 90%, 25% 90%, 25% 90%, 40% 90%, 55% 90%, 70% 90%;
      }
      50% {
        background-position: 0% 80%, 0% 20%, 10% 40%, 20% 0%, 30% 30%, 22% 50%, 50% 50%, 65% 20%, 90% 30%;
      }
      100% {
        background-position: 0% 70%, 0% 10%, 10% 30%, 20% -10%, 30% 20%, 22% 40%, 50% 40%, 65% 10%, 90% 20%;
        background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
      }
    }
    @keyframes bottomBubbles {
      0% {
        background-position: 10% -10%, 30% 10%, 55% -10%, 70% -10%, 85% -10%, 70% -10%, 70% 0%;
      }
      50% {
        background-position: 0% 80%, 20% 80%, 45% 60%, 60% 100%, 75% 70%, 95% 60%, 105% 0%;
      }
      100% {
        background-position: 0% 90%, 20% 90%, 45% 70%, 60% 110%, 75% 80%, 95% 70%, 110% 10%;
        background-size: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
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
  top: 0;
  background: #201f2a;
  .more-button,
  .top-button {
    display: block;
    font-size: 13px;
    text-align: center;
    cursor: pointer;
    box-shadow: 0 0 10px 0 #464646;
    color: #fff;
    padding: 5px;
    width: 32px;
    margin-top: 45px;
    margin-left: 10px;
    border-radius: 10px;
    word-break: break-all;
    white-space: normal;
    width: 25px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .more-button {
    margin-top: 24px;
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
  background: #201f2a;
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
.game-iframe {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  display: block;
}

.desktopview {
  // display: flex;
  .title {
    font-weight: bold;
    font-size: 20px;
  }
}
.fullheight {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mobileshow {
  display: none;
}
@media (max-width: 768px) {
  :deep(.ant-drawer-right.ant-drawer-open) {
    margin-right: 0;
    max-width: 100%;
    width: 100%;
  }
  .desktopview {
    display: none;
  }
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
      background: #201f2a;
      color: #ffffff;
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
    background: #ffffff;
    color: #000000;
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

  .game-iframe {
    height: calc(100% - 40px);
    top: 40px;
    position: fixed;
  }
}
@media (orientation: landscape) {
  .game-iframe {
    top: 0;
    height: 100%;
    // padding: env(safe-area-inset-top, 40px) env(safe-area-inset-right, 40px)  env(safe-area-inset-bottom, 40px)  env(safe-area-inset-left, 40px) ;
  }
}

.dialog-header {
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}
</style>
