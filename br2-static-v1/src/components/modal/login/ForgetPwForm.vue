<template>
  <div class="login-container">
    <div class="login-panel">
      <div class="title-container">
        <img src="../../../assets/images/auth/back-icon.png" width="22px" @click="uiStore.loginView = 'login'" />
        <h2 class="title">{{ $t("header.forgotPassword") }}</h2>
      </div>

      <p class="subtitle">
        {{ $t("form.forgotPassword_desc") }}
      </p>
      <div class="send-otp-container">
        <div v-if="!isOtpSent">
          <q-input
            type="tel"
            inputmode="numeric"
            pattern="[0-9]*"
            oninput="this.value = this.value.replace(/[^0-9]/g, '')"
            maxlength="11"
            ref="phoneRef"
            v-model="phone"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
              (val) => (val && val.length >= 8 && val.length <= 11) || $t('form.phone_rules_02'),
              (val) => (val && /^[0-9]*$/.test(val)) || $t('form.phone_rules_04')
            ]"
            outlined
            class="input"
            :class="{ 'white-txt': !!phone }"
            :placeholder="$t('form.phone_placeholder')"
          >
            <template v-slot:prepend>
              <span class="prepend-phone">{{ $t("form.prependNumber") }}</span>
            </template>
          </q-input>

          <q-input
            ref="captchaCodeRef"
            hide-bottom-space
            type="text"
            v-model="captchaCode"
            lazy-rules
            :rules="[(val) => (val && val.length > 3) || $t('form.verificationCode_rules_01')]"
            outlined
            :placeholder="$t('form.verificationCode_placeholder')"
            label-color="brand"
            class="input"
            :class="{ 'white-txt': !!captchaCode }"
          >
            <template v-slot:append>
              <img class="verification-img" :src="verificationImg" @click="getCode()" />
            </template>
          </q-input>
        </div>

        <div v-else>
          <q-input
            ref="otpRef"
            outlined
            v-model="otp"
            :placeholder="$t('form.otp_placeholder')"
            class="input"
            :class="{ 'white-txt': !!otp }"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('form.otp_rules_01')]"
          ></q-input>
          <q-input
            ref="passwordRef"
            outlined
            v-model="password"
            :placeholder="$t('form.password_placeholder')"
            :type="!isShowPassword ? 'password' : 'text'"
            class="input"
            :class="{ 'white-txt': !!password }"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('form.password_rules_01'),
              (val) => val.length >= 6 || $t('form.newPassword_rules_02')
            ]"
          >
            <template v-slot:prepend>
              <img v-if="!password" src="../../../assets/images/auth/lock-icon.png" width="22px" />
              <img v-else src="../../../assets/images/auth/lock-icon-active.png" width="22px" />
            </template>
            <template v-slot:append>
              <img
                v-if="!isShowPassword"
                class="password-icon"
                src="../../../assets/images/auth/show-pw-icon.png"
                width="20px"
                @click="isShowPassword = !isShowPassword"
              />
              <img
                v-else
                class="password-icon"
                src="../../../assets/images/auth/hide-pw-icon.png"
                width="20px"
                @click="isShowPassword = !isShowPassword"
              />
            </template>
          </q-input>

          <q-input
            ref="confirmPasswordRef"
            outlined
            v-model="confirmPassword"
            :placeholder="$t('form.newPassword_placeholder')"
            :type="!isShowConfirmPassword ? 'password' : 'text'"
            class="input"
            :class="{ 'white-txt': !!confirmPassword }"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('form.confirmNewPassword_rules_01'),
              (val) => val === password || $t('form.confirmNewPassword_rules_03')
            ]"
          >
            <template v-slot:prepend>
              <img v-if="!confirmPassword" src="../../../assets/images/auth/lock-icon.png" width="22px" />
              <img v-else src="../../../assets/images/auth/lock-icon-active.png" width="22px" />
            </template>
            <template v-slot:append>
              <img
                v-if="!isShowConfirmPassword"
                class="password-icon"
                src="../../../assets/images/auth/show-pw-icon.png"
                width="20px"
                @click="isShowConfirmPassword = !isShowConfirmPassword"
              />
              <img
                v-else
                class="password-icon"
                src="../../../assets/images/auth/hide-pw-icon.png"
                width="20px"
                @click="isShowConfirmPassword = !isShowConfirmPassword"
              />
            </template>
          </q-input>
        </div>

        <q-btn
          unelevated
          class="bg-greenbtn"
          :label="$t('btn.submit')"
          no-caps
          padding="12px"
          @click="!isOtpSent ? getOtp() : onSubmitForgetPassword()"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useUI } from "stores/ui";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { SessionStorage } from "quasar";
import { t } from "src/boot/lang";

const uiStore = useUI();
const $q = useQuasar();
const qs = require("qs");

const phone = ref("");
const captchaCode = ref("");
const otp = ref("");
const password = ref("");
const confirmPassword = ref("");

const isShowPassword = ref(false);
const isShowConfirmPassword = ref(false);

const phoneRef = ref();
const captchaCodeRef = ref();
const otpRef = ref();
const passwordRef = ref();
const confirmPasswordRef = ref();

const codeId = ref("");
const verificationImg = ref("");

const getCode = () => {
  api
    .get("/member/verificationCode")
    .then((response) => {
      if (response.code === 0) {
        verificationImg.value = "data:image/png;base64," + response.data.img;

        codeId.value = response.data.id;
        captchaCode.value = "";

        captchaCodeRef.value.resetValidation();
      }
    })
    .catch((e) => {});
};

const isOtpSent = ref(false);

const getOtp = () => {
  phoneRef.value.validate();
  captchaCodeRef.value.validate();

  $q.loading.show({
    message: "Sending verification code..."
  });

  if (phoneRef.value.hasError || captchaCodeRef.value.hasError) {
    $q.loading.hide();
  } else {
    api
      .post(
        "/otp/sendForgetPasswordPhone",
        qs.stringify({
          loginName: phone.value,
          phone: phone.value,
          captchaCode: captchaCode.value,
          codeId: codeId.value
        })
      )
      .then((response) => {
        if (response.code === 0) {
          isOtpSent.value = true;
          SessionStorage.set("emailCodeId", response.data.codeId);
        }
      })
      .catch((error) => {})
      .finally(() => {
        $q.loading.hide();
      });

    getCode();
  }
};

const onSubmitForgetPassword = () => {
  otpRef.value.validate();
  passwordRef.value.validate();
  confirmPasswordRef.value.validate();

  $q.loading.show({
    message: "Submitting..."
  });

  if (otpRef.value.hasError || passwordRef.value.hasError || confirmPasswordRef.value.hasError) {
    $q.loading.hide();
  } else {
    codeId.value = SessionStorage.getItem("emailCodeId");

    api
      .post(
        "/otp/verifyForgetPasswordPhone",
        qs.stringify({
          phone: phone.value,
          code: otp.value,
          codeId: codeId.value,
          newPassword: password.value
        })
      )
      .then((response) => {
        if (response.code === 0) {
          $q.notify({
            color: "positive",
            position: "top",
            message: t("notify.passwordResetcompleted"),
            icon: "check_circle_outline"
          });

          uiStore.loginView = "login";
        }
      })
      .catch((error) => {})
      .finally(() => {
        $q.loading.hide();
      });

    getCode();
  }
};

onMounted(() => {
  getCode();
});
</script>
<style lang="scss" scoped>
.title-container {
  display: flex;
  align-items: center;
  margin-bottom: 50px;
  img {
    height: 18px;
    width: auto;
    margin-right: 24px;
  }
  h2 {
    margin-bottom: 0 !important;
  }
}

.subtitle {
  text-align: center;
}

.bg-greenbtn {
  margin-top: 50px;
  width: 100%;
}

.prepend-phone {
  color: #fff;
}

.verification-img {
  margin: 0 4px;
}
</style>
