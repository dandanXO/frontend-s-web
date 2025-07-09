<template>
  <el-form ref="forgotPwdFormRef" :rules="forgotPwdFormRules" :model="forgotPwdForm" label-width="90" size="large">
    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/username-icon.png" width="35px" />
      <el-form-item label="用户名" prop="loginName">
        <el-input v-model="forgotPwdForm.loginName" placeholder="请输入4-12位非汉字字符" clearable />
      </el-form-item>
    </div>

    <CaptchaVerify :form="forgotPwdForm" :onClickConfirm="submitForm" ref="captchaVerifyRef" :type="props.type" />

    <el-button
      :loading="loadingBtn"
      size="large"
      class="blue-bg primary-btn"
      @click="submitForm"
      v-if="!forgotPwdPostVerifyForm.codeId"
      :disabled="!forgotPwdPostVerifyForm.codeId"
    >
      提交
    </el-button>
  </el-form>

  <el-form
    ref="forgotPwdPostVerifyFormRef"
    :rules="forgotPwdPostVerifyFormRules"
    :model="forgotPwdPostVerifyForm"
    label-width="90"
    size="large"
    v-if="forgotPwdPostVerifyForm.codeId"
  >
    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/verification-icon.png" width="35px" />
      <el-form-item label="验证码" prop="code">
        <div style="display: flex; width: 100%">
          <el-input v-model="forgotPwdPostVerifyForm.code" label="验证码" placeholder="验证码"></el-input>
        </div>
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/password-icon.png" width="35px" />
      <el-form-item label="密码" prop="password">
        <el-input
          class="wTip"
          v-model="forgotPwdPostVerifyForm.password"
          placeholder="请输入6-11位字母/数字组合"
          type="password"
          show-password
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/password-icon.png" width="35px" />
      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input
          class="half wTip"
          v-model="forgotPwdPostVerifyForm.confirmPwd"
          placeholder="请确认密码"
          type="password"
          show-password
          clearable
        >
          <template #append></template>
        </el-input>
      </el-form-item>
    </div>

    <el-button :loading="loadingBtn" size="large" class="blue-bg primary-btn" @click="submitPostVerifyForm">
      提交
    </el-button>
  </el-form>

  <div style="text-align: center; margin-top: 20px">
    <a @click="openLoginDialog">返回登入页面</a>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, defineEmits } from "vue";
import {
  sendForgetPasswordPhone,
  verifyForgetPasswordPhone,
  sendForgetPasswordEmail,
  verifyForgetPasswordEmail
} from "@/api/index/forgotPwd";
import CaptchaVerify from "./CaptchaVerify.vue";
import { useRouter } from "vue-router";
import { useNotify } from "@/hooks/notify";

const emits = defineEmits(["open-login-dialog, close-dialog"]);

const notify = useNotify();

const openLoginDialog = () => {
  emits("open-login-dialog");
};

const props = defineProps(["type"]);

const forgotPwdFormRules = {
  loginName: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur"
    },
    {
      min: 4,
      max: 12,
      message: "长度要在 4-12 之间",
      trigger: "blur"
    }
  ],
  phone: [
    {
      required: true,
      message: "请输入手机号码",
      trigger: "blur"
    }
  ],
  email: [
    {
      required: true,
      message: "请输入您的邮箱",
      trigger: "blur"
    },
    {
      type: "email",
      message: "电子邮件地址无效",
      trigger: "blur"
    },
    {
      max: 50,
      message: "长度应小于 50",
      trigger: "blur"
    }
  ],
  captchaCode: [
    {
      required: true,
      message: "请输入验证码",
      trigger: "blur"
    },
    {
      min: 4,
      max: 4,
      message: "长度为 4",
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
    return Promise.reject("请重新输入密码");
  } else if (v !== forgotPwdPostVerifyForm.password) {
    return Promise.reject("密码不同");
  } else {
    return Promise.resolve();
  }
};

let validatePass = async (r, v) => {
  if (v === "") {
    return Promise.reject("请输入密码");
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
              notify({
                type: 'success',
                message: '验证码已经发送到手机'
              })
              forgotPwdPostVerifyForm.codeId = res.data.codeId;
              captchaVerifyRef.value.closeDialog();
              captchaVerifyRef.value.initCountdownTimer();
              // emits("close-dialog");
            } else {
              notify({
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
              notify({
                type: 'success',
                message: '验证码已经发送到邮箱'
              })
              forgotPwdPostVerifyForm.codeId = res.data.codeId;
              captchaVerifyRef.value.closeDialog();
              captchaVerifyRef.value.initCountdownTimer();
              // emits("close-dialog");
            } else {
              notify({
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
              notify({
                type: 'success',
                message: '成功'
              })
              openLoginDialog();
            } else {
              notify({
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
              notify({
                type: 'success',
                message: '成功'
              })
              openLoginDialog();
            } else {
              notify({
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

<style scoped lang="scss" src="@/scss/pages/accountDialog.scss" />

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
