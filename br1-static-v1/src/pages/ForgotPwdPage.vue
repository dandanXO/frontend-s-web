<template>
  <div class="forgot-password-container">
    <div class="back-left"></div>
    <q-form v-if="!isRequestSent" class="q-gutter-y-md rounded-borders">
      <div class="forgot-password-form-grid">
        <span class="forgot-password-form-field-label">{{ $t("form.phone") }}</span>
        <q-input
          type="tel"
          pattern="\d*"
          maxlength="11"
          ref="phoneRef"
          hide-bottom-space
          v-model="passwordForm.phone"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
            (val) => (val && val.length >= 8 && val.length <= 12) || $t('form.phone_rules_02'),
            (val) => (val && /^[0-9]*$/.test(val)) || $t('form.phone_rules_04'),
          ]"
          outlined
          label-color="brand"
          color="white"
          class="landing-input"
        >
          <template v-slot:prepend>
            <img class="white-svg" src="../assets/images/auth/phone.svg" />
            <span class="prepend-number">{{ $t("form.prependNumber") }}</span>
          </template>
        </q-input>
        <span class="forgot-password-form-field-label">{{ $t("form.verificationCode") }}</span>
        <q-input
          ref="ftCaptchaRef"
          hide-bottom-space
          type="text"
          v-model="passwordForm.captchaCode"
          lazy-rules
          :rules="[(val) => (val && val.length > 3) || $t('form.verificationCode_rules_01')]"
          outlined
          label-color="brand"
          color="white"
          class="landing-input"
        >
          <template v-slot:append>
            <img :src="verificationImg" @click="getCode()" />
          </template>
        </q-input>
        <div>
          <q-btn
            @click.prevent="onSubmitForgotPwd"
            type="submit"
            class="submit-btn"
            :label="$t('btn.submit')"
            rounded
            no-caps
          />
        </div>
        <div class="forgot-password-form-logo-img" style="margin-top: 50px">
          <img src="../assets/55-ace-logo.png" />
        </div>
        <span class="forgot-password-form-desc">
          {{ $t("form.forgotPassword_desc") }}
        </span>
      </div>
    </q-form>
    <q-form v-else class="q-gutter-y-md rounded-borders">
      <p>{{ $t("notify.otpSent") }}</p>
      <q-input
        ref="codeRef"
        hide-bottom-space
        v-model="verificationForm.code"
        label="OTP"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || $t('form.otp_rules_01')]"
        rounded
        outlined
        label-color="brand"
        color="white"
        class="landing-input"
        name="otp"
      ></q-input>
      <q-input
        ref="newPwdRef"
        :type="isPwd ? 'password' : 'text'"
        hide-bottom-space
        v-model="verificationForm.newPassword"
        :label="$t('form.newPassword')"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || $t('form.newPassword_rules_01'),
          (val) => (val.length > 5 && val.length <= 12) || $t('form.newPassword_rules_02')
        ]"
        rounded
        outlined
        label-color="brand"
        color="white"
        class="landing-input"
      >
        <template v-slot:append>
          <q-icon
            color="bright"
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <q-input
        ref="newConfirmPwdRef"
        :type="isConfirmPwd ? 'password' : 'text'"
        hide-bottom-space
        v-model="newConfirmPwdVModel"
        :label="$t('form.confirmNewPassword')"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || $t('form.confirmNewPassword_rules_01'),
          (val) => (val.length > 5 && val.length <= 12) || $t('form.confirmNewPassword_rules_02'),
          (val) => (val && val === verificationForm.newPassword) || $t('form.confirmNewPassword_rules_03')
        ]"
        rounded
        outlined
        label-color="brand"
        color="white"
        class="landing-input"
      >
        <template v-slot:append>
          <q-icon
            color="bright"
            :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isConfirmPwd = !isConfirmPwd"
          />
        </template>
      </q-input>
      <ConfirmButton :label="$t('btn.submit')" :confirmFunc="onVerifyForgotPassword"></ConfirmButton>
    </q-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { SessionStorage } from "quasar";
import ConfirmButton from "src/atoms/ConfirmButton.vue";
import { t } from "src/boot/lang";

const qs = require("qs");
const $q = useQuasar();
const router = useRouter();

const verificationImg = ref("");
const passwordForm = reactive({
  loginName: "",
  phone: "",
  // email: "",
  captchaCode: "",
  codeId: ""
});
const getCode = () => {
  api
    .get("/member/verificationCode")
    .then((response) => {
      if (response.code === 0) {
        verificationImg.value = "data:image/png;base64," + response.data.img;

        passwordForm.codeId = response.data.id;
        passwordForm.captchaCode = "";

        ftCaptchaRef.value.resetValidation();
      }
    })
    .catch((e) => {});
};

const loginNameRef = ref();
const phoneRef = ref();
// const emailRef = ref();
const ftCaptchaRef = ref();

const codeRef = ref();
const newPwdRef = ref();
const newConfirmPwdRef = ref();
const captchaRef = ref();

// NOTE: not using for API param
const newConfirmPwdVModel = ref();
const isRequestSent = ref(false);
const onSubmitForgotPwd = () => {
  // loginNameRef.value.validate();
  phoneRef.value.validate();
  ftCaptchaRef.value.validate();

  $q.loading.show({
    message: "Sending verification code..."
  });

  passwordForm.loginName = passwordForm.phone;

  if (
    // loginNameRef.value.hasError ||
    phoneRef.value.hasError ||
    ftCaptchaRef.value.hasError
  ) {
    $q.loading.hide();
  } else {
    api
      .post("/otp/sendForgetPasswordPhone", qs.stringify(passwordForm))
      .then((response) => {
        if (response.code === 0) {
          isRequestSent.value = true;
          SessionStorage.set("emailCodeId", response.data.codeId);
        }
      })
      .catch((error) => {})
      .then(() => {
        $q.loading.hide();
      });

    getCode();
  }
};

const verificationForm = reactive({
  phone: "",
  code: "",
  captchaCode: "",
  codeId: SessionStorage.getItem("emailCodeId"),
  newPassword: ""
});
const onVerifyForgotPassword = () => {
  codeRef.value.validate();
  newPwdRef.value.validate();
  newConfirmPwdRef.value.validate();

  $q.loading.show({
    message: "Submitting..."
  });

  if (codeRef.value.hasError || newPwdRef.value.hasError || newConfirmPwdRef.value.hasError) {
    $q.loading.hide();
  } else {
    verificationForm.codeId = SessionStorage.getItem("emailCodeId");
    verificationForm.phone = passwordForm.phone;

    api
      .post("/otp/verifyForgetPasswordPhone", qs.stringify(verificationForm))
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: t("notify.passwordResetcompleted"),
            icon: "check_circle_outline"
          });

          router.push("/login");
        }
      })
      .catch((error) => {})
      .then(() => {
        $q.loading.hide();
      });

    getCode();
  }
};

const charType = (num) => {
  if (num >= 48 && num <= 57) return 1;
  if (num >= 97 && num <= 122) return 2;
  if (num >= 65 && num <= 90) return 4;
  return 8;
};

const isPwd = ref(true);
const isConfirmPwd = ref(true);
const pwdStrength = ref("");
watch(
  () => verificationForm.newPassword,
  () => {
    const pwd = verificationForm.newPassword;

    let result = 0;
    for (let i = 0, len = pwd.length; i < len; ++i) {
      result |= charType(pwd.charCodeAt(i));
    }

    let level = 0;
    for (var i = 0; i <= 4; i++) {
      if (result & 1) level++;
      result = result >>> 1;
    }

    pwdStrength.value = "";
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
  }
);

onMounted(() => {
  getCode();
});
</script>

<style scoped lang="scss">
.forgot-password-container {
  // min-height: 100vh;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: url("../assets/images/index/auth-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.back-left {
  position: fixed;
  top: 16px;
  left: 16px;
}

.forgot-password-form-logo-img {
  img {
    display: block;
    width: 95%;
    margin: 20px auto;
    max-width: 200px;
  }
}
.forgot-password-form-grid {
  display: grid;
  grid-auto-flow: row;
  gap: 7px;

  .forgot-password-form-title {
    font-size: 22px;
    font-weight: 600;
    line-height: 30px;
  }

  .forgot-password-form-desc {
    font-size: 16px;
    font-weight: 400;
    line-height: 25px;
    color: #ffffff67;
    width: 80%;
  }

  .forgot-password-form-field-label {
    margin-top: 15px;
  }
}

.submit-btn {
  background-color: #8b00ff;
  width: 100%;
  height: 56px;
  border-radius: 4px;
  margin-top: 35px;
}

.landing-input {
  :deep(.q-field__control) {
    padding-left: 20px;
    padding-right: 20px;
  }
  :deep(.q-field__control):before {
    border-color: #1e1f24;
    background-color: #1e1f24;
    border-width: 2px;
  }
  img {
    z-index: 3;
  }
}
.password-str-div {
  display: flex;
  align-items: center;
  margin-top: 3px;
  margin-bottom: 5px;
  justify-content: space-evenly;
  gap: 5px;
  height: 50px;

  span {
    padding: 8px 3px;
    border-radius: 5px;
    background: #434343;
    width: 33%;
    text-align: center;
  }

  span.weak-pwd {
    background: var(--q-negative);
  }

  span.normal-pwd {
    background: var(--q-warning);
    color: var(--q-primary);
  }

  span.strong-pwd {
    background: var(--q-positive);
    font-weight: 600;
  }
}

.prepend-number {
  font-size: 14px;
  color: #ffffff;
  margin-left: 8px;
  z-index: 1;
}
</style>
