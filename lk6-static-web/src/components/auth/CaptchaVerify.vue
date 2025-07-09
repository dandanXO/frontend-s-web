<template>
  <div class="light-bg form-field" v-if="props.type === 'phone'">
    <img class="form-field-icon" src="@/assets/home/auth/phone-icon.svg" />
    <el-form-item tabindex="2" label="手机号" prop="phone">
      <el-row :gutter="10" style="justify-content: center; align-items: center">
        <el-col :span="14">
          <el-input v-model="props.form.phone" label="手机号" placeholder="请输入手机号" />
        </el-col>
        <el-col :span="10">
          <el-button
            :disabled="!props.form.phone || loginCountdown !== 0"
            @click="openCaptchaForm"
            size="small"
            color="#3bafda"
            style="width: 100%; min-height: 30px; font-size: 12px"
            :class="`blue-bg ${!props.form.phone || loginCountdown !== 0 ? 'disabled' : ''}`"
          >
            {{ loginCountdown === 0 ? "获取验证码" : `已发送(${loginCountdown}秒)` }}
          </el-button>
        </el-col>
      </el-row>
    </el-form-item>
  </div>
  <div class="light-bg form-field" v-else>
    <img class="form-field-icon" src="@/assets/home/auth/email-icon.png" />
    <el-form-item tabindex="2" label="邮箱" prop="email">
      <el-row :gutter="10" style="justify-content: center; align-items: center">
        <el-col :span="14">
          <el-input v-model="props.form.email" label="邮箱" placeholder="请输入邮箱" />
        </el-col>
        <el-col :span="10">
          <el-button
            :disabled="!props.form.email || loginCountdown !== 0"
            @click="openCaptchaForm"
            size="small"
            color="#3bafda"
            style="width: 100%; min-height: 30px; font-size: 12px"
            :class="`blue-bg ${!props.form.email || loginCountdown !== 0 ? 'disabled' : ''}`"
          >
            {{ loginCountdown === 0 ? "获取验证码" : `已发送(${loginCountdown}秒)` }}
          </el-button>
        </el-col>
      </el-row>
    </el-form-item>
  </div>

  <el-dialog
    v-model="captchaDialogVisible"
    title="验证码"
    width="50%"
    align-center
    style="max-width: 500px;padding:20px;"
    :close-on-click-modal="false"
    @keydown.enter.prevent
  >
    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/verification-icon.png" width="35px" />
      <el-form-item tabindex="3" label="验证码" prop="captchaCode">
        <div style="display: flex; width: 100%">
          <el-input
            v-model="props.form.captchaCode"
            label="验证码"
            placeholder="验证码"
            @keyup.enter="props.onClickConfirm"
          />
          <img style="width: 150px" :src="verificationImg" @click="getCode" />
        </div>
      </el-form-item>
    </div>

    <el-button size="large" class="blue-bg primary-btn" @click="props.onClickConfirm">发送</el-button>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose } from "vue";
import { getVerificationCode } from "@/api/index/login";
import { useNotify } from "@/hooks/notify";

const props = defineProps(["type", "form", "onClickConfirm"]);

const notify = useNotify();

const loginCountdown = ref(0);
const captchaDialogVisible = ref(false);
const verificationImg = ref("");

const closeDialog = () => {
  captchaDialogVisible.value = false;
};

const getCode = () => {
  props.form.captchaCode = "";

  getVerificationCode().then((res) => {
    if (res.code === 0) {
      verificationImg.value = "data:image/png;base64," + res.data.img;
      props.form.codeId = res.data.id;
    } else {
      notify({
        type: "error",
        message: res.message
      });
    }
  });
};

const initCountdownTimer = () => {
  loginCountdown.value = 60;
  countdownTimer();
};

const countdownTimer = () => {
  if (loginCountdown.value > 0) {
    setTimeout(() => {
      loginCountdown.value -= 1;
      countdownTimer();
    }, 1000);
  }
};

const openCaptchaForm = () => {
  props.form.captchaCode = "";
  captchaDialogVisible.value = true;
  getCode();
};

defineExpose({
  closeDialog,
  initCountdownTimer,
  getCode
});
</script>

<style scoped lang="scss" src="@/scss/pages/accountDialog.scss"/>

<style lang="scss">
.form-field {
  margin: 15px 0px;

  .el-form-item {
    margin-bottom: 0px;
  }

  .el-form-item__label {
    justify-content: flex-start;
  }

  .el-input__wrapper {
    box-shadow: none;
    background: none;
  }

  .el-form-item.is-error {
    margin-bottom: 15px;
  }
}
</style>

<style scoped lang="scss">
.dark {
  .blue-bg {
    background-image: none !important;
    background: url("../../assets/images/home/standard-button-bg.svg") no-repeat center center !important;
    background-size: cover !important;
    box-shadow: none;
    border-radius: 6px;
    border: 1px solid #3A93CE;
  }
}
</style>