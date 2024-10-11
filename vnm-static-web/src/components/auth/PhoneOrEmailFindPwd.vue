<template>
  <el-form ref="forgotPwdFormRef" :rules="forgotPwdFormRules" :model="forgotPwdForm" label-width="200" size="large">
    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/username-icon.png" />
      <el-form-item :label="$t('login.username')" prop="loginName">
        <el-input v-model="forgotPwdForm.loginName" :placeholder="$t('login.username')" clearable />
      </el-form-item>
    </div>

    <CaptchaVerify :form="forgotPwdForm" :onClickConfirm="submitForm" ref="captchaVerifyRef" :type="props.type" />

    <el-button
      :loading="loadingBtn"
      size="large"
      class="blue-bg primary-btn"
      @click="submitForm"
      v-if="!forgotPwdPostVerifyForm.codeId"
    >
      {{$t('common.submit')}}
    </el-button>
  </el-form>

  <el-form
    ref="forgotPwdPostVerifyFormRef"
    :rules="forgotPwdPostVerifyFormRules"
    :model="forgotPwdPostVerifyForm"
    label-width="200"
    size="large"
    v-if="forgotPwdPostVerifyForm.codeId"
  >
    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/verification-icon.png" />
      <el-form-item :label="$t('login.captcha')" prop="code">
        <div style="display: flex; width: 100%">
          <el-input v-model="forgotPwdPostVerifyForm.code" :label="$t('login.captcha')" :placeholder="$t('login.captcha')"></el-input>
        </div>
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/password-icon.png" />
      <el-form-item :label="$t('login.password')" prop="password">
        <el-input
          class="wTip"
          v-model="forgotPwdPostVerifyForm.password"
          :placeholder="$t('placeholder.password')"
          type="password"
          show-password
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/password-icon.png" />
      <el-form-item :label="$t('personal.confirmPwd')" prop="confirmPwd">
        <el-input
          class="half wTip"
          v-model="forgotPwdPostVerifyForm.confirmPwd"
          :placeholder="$t('placeholder.confirmPwd')"
          type="password"
          show-password
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <el-button :loading="loadingBtn" size="large" class="blue-bg primary-btn" @click="submitPostVerifyForm">
      {{ $t('common.submit') }}
    </el-button>
  </el-form>

  <div style="text-align: center; margin-top: 20px">
    <a @click="openLoginDialog">{{ $t('login.backtoLogin') }}</a>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits } from "vue";
import {
  sendForgetPasswordPhone,
  verifyForgetPasswordPhone,
  sendForgetPasswordEmail,
  verifyForgetPasswordEmail
} from "@/api/index/forgotPwd";
import CaptchaVerify from "./CaptchaVerify.vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n()
const emits = defineEmits(["open-login-dialog, close-dialog"]);

const openLoginDialog = () => {
  emits("open-login-dialog");
};

const props = defineProps(["type"]);

const forgotPwdFormRules = {
  loginName: [
    {
      required: true,
      message: t('placeholder.username'),
      trigger: "blur"
    },
    {
      min: 6,
      max: 12,
      message: t('placeholder.between612'),
      trigger: "blur"
    }
  ],
  phone: [
    {
      required: true,
      message: t('placeholder.mobileNo'),
      trigger: "blur"
    }
  ],
  email: [
    {
      required: true,
      message: t('placeholder.email'),
      trigger: "blur"
    },
    {
      type: "email",
      message: t('placeholder.emailFormat'),
      trigger: "blur"
    },
    {
      max: 50,
      message: t('placeholder.lessthan50'),
      trigger: "blur"
    }
  ],
  captchaCode: [
    {
      required: true,
      message: t('placeholder.captchareq'),
      trigger: "blur"
    },
    {
      min: 4,
      max: 4,
      message: t('placeholder.min4'),
      trigger: "blur"
    }
  ]
};

function charType(num) {
  if (num >= 48 && num <= 57) {
    return 1;
  }
  if (num >= 97 && num <= 122) {
    return 2;
  }
  if (num >= 65 && num <= 90) {
    return 4;
  }
  return 8;
}

let validatePassStrength = (r, v) => {
  var strength = "";
  var pwd = v;
  var result = 0;
  for (var i = 0, len = pwd.length; i < len; ++i) {
    result |= charType(pwd.charCodeAt(i));
  }

  var level = 0;
  for (i = 0; i <= 4; i++) {
    if (result & 1) {
      level++;
    }
    result = result >>> 1;
  }

  if (pwd.length >= 6) {
  } else {
    return Promise.resolve();
  }
};

let validatePass2 = async (r, v) => {
  if (v === "") {
    return Promise.reject(t('placeholder.passwordAgain'));
  } else if (v !== forgotPwdPostVerifyForm.password) {
    return Promise.reject(t('placeholder.passwordDifferent'));
  } else {
    return Promise.resolve();
  }
};

let validatePass = async (r, v) => {
  if (v === "") {
    return Promise.reject(t('placeholder.passwordreq'));
  } else {
    return validatePassStrength(r, v);
  }
};

const forgotPwdPostVerifyFormRules = {
  password: [
    {
      validator: validatePass,
      trigger: "change"
    }
  ],
  confirmPwd: [
    {
      validator: validatePass2,
      trigger: "change"
    }
  ]
};

const forgotPwdForm = reactive({
  loginName: "",
  phone: "",
  email: "",
  captchaCode: ""
});

const forgotPwdPostVerifyForm = reactive({
  codeId: "",
  code: "",
  password: "",
  confirmPwd: ""
});

const captchaVerifyRef = ref();
const router = useRouter();

const forgotPwdFormRef = ref();
const forgotPwdPostVerifyFormRef = ref();
const loadingBtn = ref(false);

const submitForm = () => {
  loadingBtn.value = true;

  forgotPwdFormRef.value
    .validate()
    .then(() => {
      if (props.type === "phone") {
        const params = {
          phone: forgotPwdForm.phone,
          loginName: forgotPwdForm.loginName,
          captchaCode: forgotPwdForm.captchaCode,
          codeId: forgotPwdForm.codeId
        };

        sendForgetPasswordPhone(params)
          .then((res) => {
            if (res.code === 0) {
              ElMessage.success(t('status.otp_success_send_phone'));
              forgotPwdPostVerifyForm.codeId = res.data.codeId;
              captchaVerifyRef.value.closeDialog();
              captchaVerifyRef.value.initCountdownTimer();
              // emits("close-dialog");
            } else {
              ElMessage.error({
                type: "error",
                message: res.message
              });
            }
          })
          .catch((error) => {
            console.log(error);
            captchaVerifyRef.value.getCode();
          });
      } else {
        const params = {
          email: forgotPwdForm.email,
          loginName: forgotPwdForm.loginName,
          captchaCode: forgotPwdForm.captchaCode,
          codeId: forgotPwdForm.codeId
        };

        sendForgetPasswordEmail(params)
          .then((res) => {
            if (res.code === 0) {
              ElMessage.success(t('status.otp_success_send_email'));
              forgotPwdPostVerifyForm.codeId = res.data.codeId;
              captchaVerifyRef.value.closeDialog();
              captchaVerifyRef.value.initCountdownTimer();
              // emits("close-dialog");
            } else {
              ElMessage.error({
                type: "error",
                message: res.message
              });
            }
          })
          .catch((error) => {
            console.log(error);
            captchaVerifyRef.value.getCode();
          });
      }
    })
    .catch((err) => {
      console.log(err);
      captchaVerifyRef.value.getCode();
    })
    .finally(() => {
      loadingBtn.value = false;
    });
};

const submitPostVerifyForm = () => {
  loadingBtn.value = true;

  forgotPwdPostVerifyFormRef.value
    .validate()
    .then(() => {
      if (props.type === "phone") {
        const params = {
          phone: forgotPwdForm.phone,
          code: forgotPwdPostVerifyForm.code,
          codeId: forgotPwdPostVerifyForm.codeId,
          newPassword: forgotPwdPostVerifyForm.confirmPwd
        };

        verifyForgetPasswordPhone(params)
          .then((res) => {
            if (res.code === 0) {
              ElMessage.success(t('status.success'));
              openLoginDialog();
            } else {
              ElMessage.error({
                type: "error",
                message: res.message
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        const params = {
          email: forgotPwdForm.email,
          code: forgotPwdPostVerifyForm.code,
          codeId: forgotPwdPostVerifyForm.codeId,
          newPassword: forgotPwdPostVerifyForm.confirmPwd
        };

        verifyForgetPasswordEmail(params)
          .then((res) => {
            if (res.code === 0) {
              ElMessage.success(t('status.success'));
              openLoginDialog();
            } else {
              ElMessage.error({
                type: "error",
                message: res.message
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loadingBtn.value = false;
    });
};
</script>

<style scoped lang="scss">
.light-bg {
  font-size: 14px;
  background-color: #f7f8fb;
  border-radius: 15px;
  box-shadow: 0px 0px 8px 0px #a9c9ea inset;
  //margin-bottom: 30px;
}

.form-field {
  display: grid;
  grid-template-columns: 40px 1fr;
  padding: 8px 15px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: relative;
  width: 100%;
  margin-top: 40px;

  .form-field-icon {
    margin: auto;
    height: 30px;
  }
}

.blue-bg {
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
  color: #fff;
  font-size: 14px;
  border-radius: 30px;
}

.primary-btn {
  margin-top: 20px;
  width: 100%;
}
</style>

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
