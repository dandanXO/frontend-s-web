<template>
  <a-modal v-model:visible="visible" :width="835" :body-style="{ padding: 0, overflow: 'hidden' }" centered>
    <div class="account-modal-wrapper">
      <img class="account-modal-kv" src="@/assets/images/layout/header/account-modal-kv.png" />
      <el-tabs v-if="!verifyPage && !isForgetPwd" v-model="activateTab" class="account-modal-tabs">
        <el-tab-pane name="login" :label="$t('layout.header.accountModal.login.tab')">
          <login-tab @close-modal="handleCloseModal" @forget-pwd="handleForgetPwd" />
        </el-tab-pane>
        <el-tab-pane name="register" :label="$t('layout.header.accountModal.register.tab')">
          <register-tab @close-modal="handleCloseModal" />
        </el-tab-pane>
      </el-tabs>
      <div v-if="verifyPage" class="verify-wrapper">
        <div>
          <button class="verify-back-btn" @click="() => (verifyPage = false)">
            <img src="@/assets/images/layout/header/back-icon.png" />
          </button>
          <h3 class="verify-title">{{ $t("layout.header.accountModal.verify.title") }}</h3>
          <span class="verify-description">{{ $t("layout.header.accountModal.verify.description") }}</span>
          <div class="verify-input-wrapper">
            <input
              v-for="(_, index) in verifyCodeInputs"
              :key="index"
              v-model="verifyCodeInputs[index]"
              ref="verifyInputsRef"
              @input="(e) => handleVerifyInput(e, index)"
            />
          </div>
          <span class="verify-resent">
            {{ $t("layout.header.accountModal.verify.resent.label") }}
            <button class="verify-resent-btn">{{ $t("layout.header.accountModal.verify.resent.button") }}</button>
          </span>
        </div>
        <a-button class="common-btn" :disabled="finalVerifyCode.length !== 6" @click="onSubmit">
          {{ $t("layout.header.accountModal.verify.submitButton") }}
        </a-button>
      </div>
      <div v-if="isForgetPwd" class="forgetpwd-wrapper">
        <div class="forgetpwd-top">
          <button class="forgetpwd-back-btn" @click="() => (isForgetPwd = false)">
            <img src="@/assets/images/layout/header/back-icon.png" />
          </button>
          <h3 class="forgetpwd-title">{{ $t("layout.header.accountModal.forgetPwd.title") }}</h3>
        </div>
        <forget-password-tab @close-modal="handleCloseModal" @back-to-login="handleBackToLogin" />
      </div>
    </div>
  </a-modal>
</template>
<script setup>
import { computed, ref, defineProps, toRefs } from "vue";

import LoginTab from "./LoginTab.vue";
import RegisterTab from "./RegisterTab.vue";
import ForgetPasswordTab from "./ForgetPasswordTab.vue";
import { onMounted } from "vue";
import { watch } from "vue";
const props = defineProps({
  isReg: {
    type: Boolean,
    default: false,
  },
});
const { isReg } = toRefs(props);
const visible = defineModel();
const isForgetPwd = ref(false);
const handleForgetPwd = () => {
  isForgetPwd.value = true
}
const handleBackToLogin = () => {
  isForgetPwd.value = false
}
const verifyInputsRef = ref([]);
const activateTab = ref("login");
const verifyPage = ref(false);
const verifyCodeInputs = ref(Array(6).fill(""));

const finalVerifyCode = computed(() => verifyCodeInputs.value.join(""));

const handleCloseModal = () => {
  visible.value = false;
}

const handleVerifyInput = (e, index) => {
  if (verifyCodeInputs.value[index].length === 1) {
    if (index < verifyCodeInputs.value.length - 1) {
      verifyInputsRef.value[index + 1].focus();
    }
  } else if (verifyCodeInputs.value[index].length === 0) {
    if (index > 0) {
      verifyInputsRef.value[index - 1].focus();
    }
  } else {
    if (index < verifyCodeInputs.value.length - 1) {
      verifyCodeInputs.value[index + 1] = verifyCodeInputs.value[index][1];
      verifyInputsRef.value[index + 1].focus();
    }
    verifyCodeInputs.value[index] = verifyCodeInputs.value[index][0];
  }
};
const onSubmit = () => {};

watch(visible, (newVal) => {
  if (newVal) {
    // Reset the state when the modal becomes visible
    isForgetPwd.value = false;
    activateTab.value = isReg.value ? "register" : "login";
  }
});
</script>
<style scoped lang="scss">
.account-modal-wrapper {
  font-family: "Inter", Arial,sans-serif;
  display: flex;
  padding: 40px;
  align-items: center;
  background-color: var(--body-background-color);
  background-image: url(@/assets/images/layout/header/account-modal-bg.png);
  background-size: cover;

  .account-modal-kv {
    width: 327px;
  }

  .account-modal-tabs {
    width: 100%;

    :deep(.el-tabs__header) {
      border-bottom: none;

      .el-tabs__nav-wrap {
        &::after {
          display: none;
        }

        .el-tabs__nav {
          width: 100%;

          .el-tabs__item {
            color: #8c968f;
            flex: 1;
            text-align: center;
            padding: 0;
            font-size: 14px;
            font-weight: 700;
            line-height: 14px;

            &.is-active {
              color: #ffffff;
              background: linear-gradient(180deg, #1baa99 0%, #172408 100%);
              border-radius: 10px;
              transform: perspective(100px) rotateX(10deg);
            }
          }

          .el-tabs__active-bar {
            background: #1ba795;
            box-shadow: 0px 0px 2px 0px #61ff00;
          }
        }
      }
    }
  }

  .verify-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 109px;
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    color: #8c968f;

    .verify-back-btn {
      border: none;
      background: transparent;
      position: relative;
      top: -20px;
    }

    .verify-title {
      margin-bottom: 8px;
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
      color: #ffffff;
    }

    .verify-input-wrapper {
      display: flex;
      gap: 16px;
      align-items: center;
      margin: 22px 0;

      input {
        border: 1px solid #61ff00;
        background-color: #0b0e0d;
        border-radius: 10px;
        width: 56px;
        height: 56px;
        font-size: 20px;
        font-weight: 700;
        line-height: 24px;
        text-align: center;
        color: #ffffff;
      }
    }

    .verify-resent {
      .verify-resent-btn {
        border: none;
        background-color: transparent;
        color: #61ff00;
      }
    }
  }
  
  .forgetpwd-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    color: #8c968f;
    width: 100%;
    margin-top: -20px;
    .forgetpwd-top {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }

    .forgetpwd-back-btn {
      border: none;
      background: transparent;
      position: relative;
    }

    .forgetpwd-title {
      margin-top: 8px;
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
      color: #ffffff;
    }

    .forgetpwd-input-wrapper {
      display: flex;
      gap: 16px;
      align-items: center;
      margin: 22px 0;

      input {
        border: 1px solid #61ff00;
        background-color: #0b0e0d;
        border-radius: 10px;
        width: 56px;
        height: 56px;
        font-size: 20px;
        font-weight: 700;
        line-height: 24px;
        text-align: center;
        color: #ffffff;
      }
    }

    .forgetpwd-resent {
      .forgetpwd-resent-btn {
        border: none;
        background-color: transparent;
        color: #61ff00;
      }
    }
  }
}
</style>
