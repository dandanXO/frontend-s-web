<template>
  <div class="forget-password-containier">
    <a-form ref="formRef" :model="passwordForm" :rules="passwordFormRules" hide-required-mark>
      <div v-if="step === 1">
        <a-form-item name="loginName" :label="$t('common.form.loginName.label')" label-align="left">
          <a-input v-model:value="passwordForm.loginName" :placeholder="$t('common.form.loginName.placeholder')">
            <template #prefix>
              <RiSmartphoneFill />
              <span style="color: #ffffff">+92</span>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          ref="email"
          :label="$t('layout.header.accountModal.forgetPwd.infoForm.email.label')"
          label-align="left"
          name="email"
        >
          <a-input
            v-model:value="passwordForm.email"
            :placeholder="$t('layout.header.accountModal.forgetPwd.infoForm.email.placeholder')"
          >
            <template #prefix>
              <RiMailFill />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          :label="$t('layout.header.accountModal.forgetPwd.infoForm.captcha.label')"
          label-align="left"
          ref="captchaCode"
          name="captchaCode"
        >
          <a-input
            v-model:value="passwordForm.captchaCode"
            :maxlength="4"
            :placeholder="$t('layout.header.accountModal.forgetPwd.infoForm.captcha.placeholder')"
          >
            <template #prefix>
              <RiShieldCheckFill />
            </template>
          </a-input>
          <div class="verification" @click="getCode()">
            <img :src="verificationImg" />
          </div>
        </a-form-item>
      </div>
    </a-form>
    <a-form ref="verifyFormRef" :model="verificationForm" :rules="verificationFormRules" hide-required-mark>
      <div class="step2" v-if="step === 2">
        <div class="step2-top">
          <div class="title">{{ $t("layout.header.accountModal.forgetPwd.verifyForm.title") }}</div>
          <div class="submessage">
            {{ $t("layout.header.accountModal.forgetPwd.verifyForm.description") }} {{ verificationForm.email }}
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
            :label="$t('layout.header.accountModal.forgetPwd.verifyForm.newPassword.label')"
            label-align="left"
            ref="password"
            name="password"
          >
            <a-input
              v-model:value="verificationForm.newPassword"
              :type="togglePwd ? 'password' : 'text'"
              :placeholder="$t('layout.header.accountModal.forgetPwd.verifyForm.newPassword.placeholder')"
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
          <!-- <div v-if="verificationForm.password" class="password-str-div">
            <span
              :class="{
                'weak-pwd': pwdStrength == 'weak',
                'normal-pwd': pwdStrength == 'normal',
                'strong-pwd': pwdStrength == 'strong'
              }"
            >
              Weak
            </span>
            <span
              :class="{
                'normal-pwd': pwdStrength == 'normal',
                'strong-pwd': pwdStrength == 'strong'
              }"
            >
              Good
            </span>
            <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">Strong</span>
          </div> -->
          <a-form-item
            :label="$t('layout.header.accountModal.forgetPwd.verifyForm.confirmPwd.label')"
            label-align="left"
            ref="confirmPwd"
            name="confirmPwd"
          >
            <a-input
              v-model:value="verificationForm.confirmPwd"
              :type="togglePwd ? 'password' : 'text'"
              :placeholder="$t('layout.header.accountModal.forgetPwd.verifyForm.confirmPwd.placeholder')"
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
        <!-- <div class="haventreceive">
      Haven’t receive?
    <a
      :style="isButtonDisabled === false?'color: #61FF00;':'color: #aaaaaa'"
      @click="isButtonDisabled === false ? handleSendClick() : null"
    >
    {{ resendTxt }} <span v-if="isButtonDisabled">Retry in {{ countdownTime }}s</span>
    </a>
    </div> -->
      </div>
      <div>
        <a-button class="common-btn" :loading="loadingLogin" @click="onSubmit">
          {{ $t("layout.header.accountModal.forgetPwd.submitButton") }}
        </a-button>
      </div>
    </a-form>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { userStore } from "@/store/index";
import { RiMailFill, RiSmartphoneFill } from "vue-remix-icons";
import { getVerificationCode } from "@/api/index/login";
import { sendForgetPasswordEmail, verifyForgetPasswordEmail } from "@/api/index/forgotPwd";
import { useRoute, useRouter } from "vue-router";
import { Input, message } from "ant-design-vue";
import { LockFilled, EyeFilled, EyeInvisibleFilled } from "@ant-design/icons-vue";
import { validateLoginName } from "@/utils/validator";
const emit = defineEmits(["back-to-login"]);

const { t } = useI18n();
const store = userStore();
const router = useRouter();
const route = useRoute();

const formRef = ref();
const verifyFormRef = ref();
const loadingLogin = ref(false);
const passwordForm = reactive({
  loginName: "",
  password: ""
});
const verificationForm = reactive({
  // phone: "",
  code: "",
  captchaCode: "",
  codeId: sessionStorage.getItem("emailCodeId"),
  newPassword: "",
  confirmPwd: ""
});
const isLoading = ref(false);
const step = ref(1);
const verificationImg = ref("");

const passwordFormRules = computed(() => ({
  loginName: [{ validator: validateLoginName, trigger: "blur" }],
  email: [
    {
      required: true,
      message: t("layout.header.accountModal.forgetPwd.infoForm.email.error.required"),
      trigger: "blur"
    }
  ],
  captchaCode: [
    {
      required: true,
      message: t("layout.header.accountModal.forgetPwd.infoForm.captcha.error.required"),
      trigger: "blur"
    },
    {
      min: 4,
      max: 4,
      message: t("layout.header.accountModal.forgetPwd.infoForm.captcha.error.len"),
      trigger: "change"
    }
  ]
}));

const verificationFormRules = computed(() => ({
  code: [
    {
      required: true,
      message: t("layout.header.accountModal.forgetPwd.verifyForm.code.error.required"),
      trigger: "blur"
    },
    { len: 6, message: t("layout.header.accountModal.forgetPwd.verifyForm.code.error.len"), trigger: "blur" }
  ],
  newPassword: [
    {
      required: true,
      message: t("layout.header.accountModal.forgetPwd.verifyForm.newPassword.error.required"),
      trigger: "blur"
    },
    { min: 6, message: t("layout.header.accountModal.forgetPwd.verifyForm.newPassword.error.min"), trigger: "blur" }
  ],
  confirmPwd: [
    { min: 6, message: t("layout.header.accountModal.forgetPwd.verifyForm.confirmPwd.error.min"), trigger: "blur" },
    {
      validator: validateConfirmPwd,
      trigger: "blur"
    }
  ]
}));

const validateConfirmPwd = async (_, val) => {
  if (!val) {
    return Promise.reject(t("layout.header.accountModal.forgetPwd.verifyForm.confirmPwd.error.required"));
  } else if (val !== verificationForm.newPassword) {
    return Promise.reject(t("layout.header.accountModal.forgetPwd.verifyForm.confirmPwd.error.validator"));
  } else {
    return Promise.resolve();
  }
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
const backToLogin = () => {
  emit("back-to-login");
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

// Register the component
const { "a-input": AInput } = { "a-input": Input };

const otp = ref(Array(6).fill(""));
const inputRefs = ref([]);

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
const resendTxt = ref("Resend");
const isButtonDisabled = ref(false);
const countdownTime = ref(30);
const handleSendClick = () => {
  isButtonDisabled.value = true;
  startCountdown();
  sendEmail();
};

const startCountdown = () => {
  resendTxt.value = "Sent. ";
  const interval = setInterval(() => {
    countdownTime.value -= 1;
    if (countdownTime.value <= 0) {
      clearInterval(interval);
      resetButton();
    }
  }, 1000);
};

const resetButton = () => {
  isButtonDisabled.value = false;
  resendTxt.value = "Resend";
  countdownTime.value = 30;
};
const pwdStrength = ref();
const togglePwd = ref(true);
watch(
  () => verificationForm.newPassword,
  () => {
    pwdStrength.value = "";

    var pwd = verificationForm.newPassword;
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

    // console.log(level);

    if (pwd.length >= 6) {
      switch (level) {
        case 1:
          pwdStrength.value = "weak";
          break;
        case 2:
          pwdStrength.value = "normal";
          break;
        case 3:
        case 4:
          pwdStrength.value = "strong";
          break;
      }
    } else {
      pwdStrength.value = "weak";
    }

    // console.log(pwdStrength.value);
  }
);

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
</script>
<style scoped lang="scss">
@import "./style/accountModalTab.scss";
.forget-password-containier {
  width: 100%;
  .step2 {
    padding: 20px;
    .step2-top {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
      gap: 10px;
      .title {
        color: #ffffff;
        font-size: 20px;
        line-height: 24px;
      }
      .submessage {
        color: #8c968f;
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
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
    .haventreceive {
      color: #8c968f;
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
    }
  }
}
.forget-password {
  text-align: right;

  a {
    color: #9f9f9f;
    text-decoration: underline;
    &:hover {
      color: #1baa99;
    }
  }
}
</style>
