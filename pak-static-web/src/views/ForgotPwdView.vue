<template>
  <div class="login-container">
    <div class="margin-center login-form-wrapper">
      <div class="game-title">
        <span class="menu-title">FORGOT ACCOUNT &amp; PASSWORD</span>
      </div>
      <a-tabs type="card" v-model="forgotActive">
        <a-tab-pane key="phonePwd" tab="Retrieve password via phone">
          <a-form v-if="step === 1" ref="formRef" :model="passwordForm" :rules="passwordFormRules" hide-required-mark>
            <p>Please enter the account and the mobile number associated with your account for password recovery.</p>
            <a-form-item name="loginName" :label="$t('common.form.loginName.label')" label-align="left">
              <a-input v-model:value="passwordForm.loginName" :placeholder="$t('common.form.loginName.placeholder')">
                <template #prefix>
                  <RiSmartphoneFill />
                  <span style="color: #ffffff">+92</span>
                </template>
              </a-input>
            </a-form-item>
            <a-form-item ref="email" :label="$t('forgotPwdView.infoForm.email.label')" label-align="left" name="email">
              <a-input v-model:value="passwordForm.email" :placeholder="$t('forgotPwdView.infoForm.email.placeholder')">
                <template #prefix>
                  <RiMailFill />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item
              :label="$t('forgotPwdView.infoForm.captcha.label')"
              label-align="left"
              ref="captchaCode"
              name="captchaCode"
            >
              <a-input
                v-model:value="passwordForm.captchaCode"
                :maxlength="4"
                :placeholder="$t('forgotPwdView.infoForm.captcha.placeholder')"
              >
                <template #prefix>
                  <RiShieldCheckFill />
                </template>
              </a-input>
              <div class="verification" @click="getCode()">
                <img :src="verificationImg" />
              </div>
            </a-form-item>
          </a-form>
          <a-form
            v-if="step === 2"
            ref="verifyFormRef"
            :model="verificationForm"
            :rules="verificationFormRules"
            hide-required-mark
          >
            <div class="step2" v-if="step === 2">
              <div class="step2-top">
                <div class="title">{{ $t("forgotPwdView.verifyForm.title") }}</div>
                <div class="submessage">
                  {{ $t("forgotPwdView.verifyForm.description") }} {{ verificationForm.email }}
                </div>
              </div>
              <div>
                <a-form-item name="code" label-align="left">
                  <span class="otp-container">
                    <a-input
                      v-for="(value, index) in otp"
                      :key="index"
                      v-model:value="otp[index]"
                      :ref="setRef(index)"
                      class="otp-input"
                      maxLength="1"
                      @input="handleInput(index)"
                      @keydown="handleKeydown($event, index)"
                    />
                  </span>
                </a-form-item>
                <a-form-item
                  :label="$t('forgotPwdView.verifyForm.newPassword.label')"
                  label-align="left"
                  ref="password"
                  name="password"
                >
                  <a-input
                    v-model:value="verificationForm.newPassword"
                    :type="togglePwd ? 'password' : 'text'"
                    :placeholder="$t('forgotPwdView.verifyForm.newPassword.placeholder')"
                  >
                    <template #prefix>
                      <LockFilled />
                    </template>
                    <template #suffix>
                      <EyeFilled v-if="!togglePwd" @click="togglePwd = !togglePwd" />
                      <EyeInvisibleFilled v-if="togglePwd" @click="togglePwd = !togglePwd" />
                    </template>
                  </a-input>
                </a-form-item>
                <a-form-item
                  :label="$t('forgotPwdView.verifyForm.confirmPwd.label')"
                  label-align="left"
                  ref="confirmPwd"
                  name="confirmPwd"
                >
                  <a-input
                    v-model:value="verificationForm.confirmPwd"
                    :type="togglePwd ? 'password' : 'text'"
                    :placeholder="$t('forgotPwdView.verifyForm.confirmPwd.placeholder')"
                  >
                    <template #prefix>
                      <LockFilled />
                    </template>
                    <template #suffix>
                      <EyeFilled v-if="!togglePwd" @click="togglePwd = !togglePwd" />
                      <EyeInvisibleFilled v-if="togglePwd" @click="togglePwd = !togglePwd" />
                    </template>
                  </a-input>
                </a-form-item>
              </div>
            </div>
          </a-form>
          <div>
            <a-button class="common-btn" :loading="loadingLogin" @click="onSubmit">
              {{ $t("forgotPwdView.submitButton") }}
            </a-button>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="txt-center">
      {{ $t("forgotPwdView.login.description") }}
      <router-link class="forget-pwd-tip" to="/login">{{ $t("forgotPwdView.login.link") }}</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import {
  RiUserFill,
  RiLock2Fill,
  RiShieldCheckFill,
  RiMailFill,
  RiQrCodeFill,
  RiSmartphoneFill
} from "vue-remix-icons";

import { message } from "ant-design-vue";
import "@/assets/css/login.scss";
import { getVerificationCode } from "@/api/index/login";
import { useRouter } from "vue-router";
import {
  sendForgetPasswordEmail,
  sendForgetPasswordPhone,
  verifyForgetPasswordEmail,
  verifyForgetPasswordPhone
} from "@/api/index/forgotPwd";
import { useI18n } from "vue-i18n";
import { validateLoginName } from "@/utils/validator";

const { t } = useI18n();

const router = useRouter();
const isOtpSent = ref(false);
const isLoading = ref(false);
const forgotActive = ref("phonePwd");

const formRef = ref();
const verifyFormRef = ref();
const loadingLogin = ref(false);
const step = ref(1);
const passwordForm = reactive({
  loginName: "",
  password: ""
});
const verificationForm = reactive({
  // phone: "",
  code: "",
  captchaCode: "",
  codeId: sessionStorage.getItem("emailCodeId"),
  newPassword: ""
});
const verificationImg = ref("");

const otp = ref(Array(6).fill(""));
const inputRefs = ref([]);

const passwordFormRules = computed(() => ({
  loginName: [{ validator: validateLoginName, trigger: "blur" }],
  email: [
    {
      required: true,
      message: t("forgotPwdView.infoForm.email.error.required"),
      trigger: "blur"
    }
  ],
  captchaCode: [
    {
      required: true,
      message: t("forgotPwdView.infoForm.captcha.error.required"),
      trigger: "blur"
    },
    {
      min: 4,
      max: 4,
      message: t("forgotPwdView.infoForm.captcha.error.len"),
      trigger: "change"
    }
  ]
}));
const verificationFormRules = computed(() => ({
  code: [
    {
      required: true,
      message: t("forgotPwdView.verifyForm.code.error.required"),
      trigger: "blur"
    },
    { len: 6, message: t("forgotPwdView.verifyForm.code.error.len"), trigger: "blur" }
  ],
  newPassword: [
    {
      required: true,
      message: t("forgotPwdView.verifyForm.newPassword.error.required"),
      trigger: "blur"
    },
    { min: 6, message: t("forgotPwdView.verifyForm.newPassword.error.min"), trigger: "blur" }
  ],
  confirmPwd: [
    { min: 6, message: t("forgotPwdView.verifyForm.confirmPwd.error.min"), trigger: "blur" },
    {
      validator: validateConfirmPwd,
      trigger: "blur"
    }
  ]
}));

const validateConfirmPwd = async (_, val) => {
  if (!val) {
    return Promise.reject(t("forgotPwdView.verifyForm.confirmPwd.error.required"));
  } else if (val !== verificationForm.newPassword) {
    return Promise.reject(t("forgotPwdView.verifyForm.confirmPwd.error.validator"));
  } else {
    return Promise.resolve();
  }
};

const setRef = (index) => (el) => {
  inputRefs.value[index] = el;
};

const handleInput = (index) => {
  if (otp.value[index] && index < 5) {
    inputRefs.value[index + 1].focus();
  }
};

const handleKeydown = (event, index) => {
  if (event.key === "Backspace" && !otp.value[index] && index > 0) {
    inputRefs.value[index - 1].focus();
  }
};

const getCode = () => {
  passwordForm.captchaCode = "";
  getVerificationCode()
    .then((res) => {
      if (res.code === 0) {
        verificationImg.value = "data:image/png;base64," + res.data.img;
        passwordForm.codeId = res.data.id;
      }
    })
    .catch((e) => {
      console.log(e.message);
    });
};

const sendEmail = () => {
  sendForgetPasswordEmail(passwordForm)
    .then((res) => {
      if (res.code === 0) {
        step.value = 2;
        sessionStorage.setItem("codeId", res.data.codeId);
      }
    })
    .catch((error) => console.log(error));
};

const onSubmit = () => {
  if (step.value === 1) {
    formRef.value
      .validate()
      .then(() => {
        isLoading.value = true;
        sendEmail();
      })
      .catch((error) => {
        console.log("error", error);
        getCode();
      });
    return;
  } else if (step.value === 2) {
    // verificationForm.code = otp.value.join("");
    verifyFormRef.value
      .validate()
      .then(() => {
        verificationForm.codeId = sessionStorage.getItem("codeId");
        verificationForm.email = passwordForm.email;
        const params = {
          email: verificationForm.email,
          code: verificationForm.code,
          codeId: verificationForm.codeId,
          newPassword: verificationForm.newPassword
        };
        verifyForgetPasswordEmail(params)
          .then((res) => {
            if (res.code === 0) {
              message.success("Success");
              backToLogin();
            }
          })
          .catch((error) => {
            console.log(error.message);
            getCode();
          });
      })
      .catch((error) => {
        console.log("error", error);
        getCode();
      });
  }
};

watch(
  otp,
  (val) => {
    verificationForm.code = val.join("");
  },
  { deep: true }
);

onMounted(() => {
  getCode();
});
</script>
<style scoped lang="scss">
.forget-pwd-tip {
  background: linear-gradient(270deg, #1baa99 0%, #8ac542 100%);
  background-size: 100%;
  background-repeat: repeat;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
  padding: 5px 0 20px;
  display: inline-block;
}
.verification {
  position: absolute;
  right: 20px;
  bottom: 8px;
}

.login-container {
  .login-form-wrapper {
    max-width: 800px;
    .game-title {
      max-width: 500px;
      margin: 0 auto;
    }
    :deep(.ant-tabs-bar) {
      display: none;
    }
    :deep(.ant-tabs-tabpane) {
      max-width: 500px;
      margin: 0 auto;
    }
    :deep(.ant-tabs-tab) {
      margin-right: 16px;
    }
  }
}

.otp-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin: auto;
  margin: 20px auto;
  gap: 15px;
}

.otp-input {
  width: 50px;
  height: 50px;
  font-size: 24px;
  text-align: center;
  background: #0b0e0d;
  border: 1px solid #072a19;
}

.dark-theme {
  .login-container {
    .login-form-wrapper {
      :deep(.ant-tabs-tab) {
        background: rgba(255, 255, 255, 0.0588235294);
        border: none;
      }
    }
  }
}

@media (max-width: 767px) {
  .login-container .login-form-wrapper .login-title-container .login-title::after {
    display: none;
  }
}
</style>
