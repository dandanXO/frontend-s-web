<template>

  <div class="auth-container">
    <img class="top-left-logo" src="../assets/images/auth/pk4-logo.svg" />
    <div class="back-left">
      <router-link :to="'/home'">
        <img src="../assets/images/index/close-btn.png" />
      </router-link>
    </div>

    <div class="auth-form-wrapper">
      <template v-if="currentTab === 'phone'">
        <div class="auth-pg-title-wrapper">
          <div class="auth-pg-title">{{ $t("form.recoverPwd") }}</div>
          <div class="auth-pg-desc">{{ isRequestSent ? $t("form.otp_phone_sent_title") : $t("form.forgotPasswordPhone_desc") }}</div>
        </div>

        <div class="no-domain pwd-tab-wrapper">
          <q-tabs v-model="currentTab" no-caps class="pwd-tab-toggle" indicator-color="transparent" align="justify">
            <q-tab :disable="isRequestSent" v-for="(tab, index) in childrenTabs" :key="index" :label="tab.label"
              :name="tab.name" />
          </q-tabs>
        </div>

        <q-form v-if="!isRequestSent" class="q-gutter-y-md rounded-borders">
          <div class="forgot-password-form-grid">
            <InputRowGrid>
              <template #fields>
                <InputField :label="$t('form.phone')">
                  <template #input>
                    <q-input type="tel" pattern="\d*" maxlength="11" ref="loginNameRef" hide-bottom-space
                      v-model="passwordForm.phone" :rules="[
                        (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
                        (val) => (val && val.length === 11) || $t('form.phone_rules_02')
                      ]" outlined label-color="brand" color="green" :placeholder="$t('form.phone_placeholder')">
                      <template v-slot:prepend>
                        <q-icon name="smartphone" />
                        <div class="prepend-number">+92</div>
                      </template>
                    </q-input>
                  </template>
                </InputField>

                <InputField :label="$t('form.verificationCode')">
                  <template #input>
                    <q-input ref="ftCaptchaRef" hide-bottom-space type="text" v-model="passwordForm.captchaCode"
                      :rules="[(val) => (val && val.length > 3) || $t('form.verificationCode_rules_01')]" outlined
                      label-color="brand" color="green" :placeholder="$t('form.verificationCode_placeholder')">
                      <template v-slot:prepend>
                        <q-icon name="sensor_occupied" />
                      </template>
                      <template v-slot:append>
                        <img :src="verificationImg" @click="getCode()" />
                      </template>
                    </q-input>
                  </template>
                </InputField>

              </template>
            </InputRowGrid>
          </div>

          <div class="bottom-btn-primary">
            <q-btn no-caps unelevated class="btn-primary btn-primary__full" :loading="isLoading"
              @click="onSubmitForgotPwd('phone')">
              {{ $t("btn.confirm") }}
            </q-btn>
          </div>
        </q-form>

        <q-form v-else class="q-gutter-y-md rounded-borders">
          <InputRowGrid>
            <template #fields>
              <InputField :label="$t('form.otp')">
                <template #input>
                  <q-input ref="codeRef" hide-bottom-space v-model="verificationForm.code"
                    :rules="[(val) => (val && val.length > 0) || $t('form.otp_rules_01')]" rounded outlined
                    label-color="brand" color="white" :placeholder="$t('form.otp_placeholder')"></q-input>
                </template>
              </InputField>

              <InputField :label="$t('form.newPassword')">
                <template #input>
                  <q-input ref="newPwdRef" :type="isPwd ? 'password' : 'text'" hide-bottom-space
                    v-model="verificationForm.newPassword" :rules="[
                      (val) => (val && val.length > 0) || $t('form.newPassword_rules_01'),
                      (val) => val.length > 5 || $t('form.newPassword_rules_02'),
                      (val) => val.length < 13 || $t('form.newPassword_rules_03')
                    ]" rounded outlined label-color="brand" color="white"
                    :placeholder="$t('form.newPassword_placeholder')">
                    <template v-slot:append>
                      <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                        @click="isPwd = !isPwd" />
                    </template>
                  </q-input>
                </template>
              </InputField>

              <InputField :label="$t('form.confirmNewPassword')">
                <template #input>
                  <q-input ref="newConfirmPwdRef" :type="isConfirmPwd ? 'password' : 'text'" hide-bottom-space
                    v-model="newConfirmPwdVModel" :rules="[
                      (val) => (val && val.length > 0) || $t('form.confirmNewPassword_rules_01'),
                      (val) => (val && val === verificationForm.newPassword) || $t('form.confirmNewPassword_rules_02')
                    ]" rounded outlined label-color="brand" color="white"
                    :placeholder="$t('form.confirmNewPassword_placeholder')">
                    <template v-slot:append>
                      <q-icon :name="isConfirmPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                        @click="isConfirmPwd = !isConfirmPwd" />
                    </template>
                  </q-input>

                </template>
              </InputField>

              <InputField v-if="passwordForm.smsCodeId" :label="$t('form.otp_form')">
                <template #input>
                  <q-input pattern="\d*" maxlength="6" ref="verificationRef" hide-bottom-space
                    v-model="passwordForm.smsCode" :rules="[
                      (val) => (val && val.length > 0) || $t('form.insert_otp_num'),
                      (val) => (val && val.length === 6) || $t('form.otp_must_have_6')
                    ]" color="white" class="landing-input" outlined :placeholder="$t('form.enter_otp_num')"
                    label-color="brand">
                    <template v-slot:prepend>
                      <q-icon name="key" />
                    </template>
                  </q-input>
                </template>
              </InputField>
              <div class="bottom-btn-primary">
                <q-btn no-caps unelevated class="btn-primary btn-primary__full" :loading="isLoading"
                  @click="onVerifyForgotPassword('phone')">
                  {{ $t("btn.confirm") }}
                </q-btn>
              </div>
            </template>
          </InputRowGrid>
        </q-form>
      </template>
      <template v-if="currentTab === 'email'">
        <div class="auth-pg-title-wrapper">
          <div class="auth-pg-title">{{ $t("form.recoverPwd") }}</div>
          <div class="auth-pg-desc">{{ isRequestSent ?  $t("form.otp_sent_title") : $t("form.forgotPassword_desc") }}</div>
        </div>

        <div class="no-domain pwd-tab-wrapper">
          <q-tabs v-model="currentTab" no-caps class="pwd-tab-toggle" indicator-color="transparent" align="justify">
            <q-tab :disable="isRequestSent" v-for="(tab, index) in childrenTabs" :key="index" :label="tab.label"
              :name="tab.name" />
          </q-tabs>
        </div>

        <q-form v-if="!isRequestSent" class="q-gutter-y-md rounded-borders">

          <div class="forgot-password-form-grid">
            <InputRowGrid>
              <template #fields>
                <InputField :label="$t('form.phone')">
                  <template #input>
                    <q-input type="tel" pattern="\d*" maxlength="11" ref="loginNameRef" hide-bottom-space
                      v-model="passwordForm.loginName" :rules="[
                        (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
                        (val) => (val && val.length === 11) || $t('form.phone_rules_02')
                      ]" outlined label-color="brand" color="green" :placeholder="$t('form.phone_placeholder')">
                      <template v-slot:prepend>
                        <q-icon name="smartphone" />
                        <div class="prepend-number">+92</div>
                      </template>
                    </q-input>
                  </template>
                </InputField>

                <InputField :label="$t('form.email')">
                  <template #input>
                    <q-input type="email" ref="emailRef" hide-bottom-space v-model="passwordForm.email"
                      :rules="[(val) => (val && val.length > 0) || $t('form.email_rules_01')]" outlined
                      label-color="brand" color="green" :placeholder="$t('form.email_placeholder')">
                      <template v-slot:prepend>
                        <q-icon name="email" />
                      </template>
                    </q-input>
                  </template>
                </InputField>

                <InputField :label="$t('form.verificationCode')">
                  <template #input>
                    <q-input ref="ftCaptchaRef" hide-bottom-space type="text" v-model="passwordForm.captchaCode"
                      :rules="[(val) => (val && val.length > 3) || $t('form.verificationCode_rules_01')]" outlined
                      label-color="brand" color="green" :placeholder="$t('form.verificationCode_placeholder')">
                      <template v-slot:prepend>
                        <q-icon name="sensor_occupied" />
                      </template>
                      <template v-slot:append>
                        <img :src="verificationImg" @click="getCode()" />
                      </template>
                    </q-input>
                  </template>
                </InputField>

              </template>
            </InputRowGrid>
          </div>

          <div class="bottom-btn-primary">
            <q-btn no-caps unelevated class="btn-primary btn-primary__full" :loading="isLoading"
              @click="onSubmitForgotPwd">
              {{ $t("btn.confirm") }}
            </q-btn>
          </div>
        </q-form>

        <q-form v-else class="q-gutter-y-md rounded-borders">
          <InputRowGrid>
            <template #fields>
              <InputField :label="$t('form.otp')">
                <template #input>
                  <q-input ref="codeRef" hide-bottom-space v-model="verificationForm.code"
                    :rules="[(val) => (val && val.length > 0) || $t('form.otp_rules_01')]" rounded outlined
                    label-color="brand" color="white" :placeholder="$t('form.otp_placeholder')"></q-input>
                </template>
              </InputField>

              <InputField :label="$t('form.newPassword')">
                <template #input>
                  <q-input ref="newPwdRef" :type="isPwd ? 'password' : 'text'" hide-bottom-space
                    v-model="verificationForm.newPassword" :rules="[
                      (val) => (val && val.length > 0) || $t('form.newPassword_rules_01'),
                      (val) => val.length > 5 || $t('form.newPassword_rules_02'),
                      (val) => val.length < 13 || $t('form.newPassword_rules_03')
                    ]" rounded outlined label-color="brand" color="white" :placeholder="$t('form.newPassword_placeholder')">
                    <template v-slot:append>
                      <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                        @click="isPwd = !isPwd" />
                    </template>
                  </q-input>
                </template>
              </InputField>

              <InputField :label="$t('form.confirmNewPassword')">
                <template #input>
                  <q-input ref="newConfirmPwdRef" :type="isConfirmPwd ? 'password' : 'text'" hide-bottom-space
                    v-model="newConfirmPwdVModel" :rules="[
                      (val) => (val && val.length > 0) || $t('form.confirmNewPassword_rules_01'),
                      (val) => (val && val === verificationForm.newPassword) || $t('form.confirmNewPassword_rules_02')
                    ]" rounded outlined label-color="brand" color="white"
                    :placeholder="$t('form.confirmNewPassword_placeholder')">
                    <template v-slot:append>
                      <q-icon :name="isConfirmPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                        @click="isConfirmPwd = !isConfirmPwd" />
                    </template>
                  </q-input>

                </template>
              </InputField>

              <InputField v-if="passwordForm.smsCodeId" :label="$t('form.otp_form')">
                <template #input>
                  <q-input pattern="\d*" maxlength="6" ref="verificationRef" hide-bottom-space
                    v-model="passwordForm.smsCode" :rules="[
                      (val) => (val && val.length > 0) || $t('form.insert_otp_num'),
                      (val) => (val && val.length === 6) || $t('form.otp_must_have_6')
                    ]" color="white" class="landing-input" outlined :placeholder="$t('form.enter_otp_num')" label-color="brand">
                    <template v-slot:prepend>
                      <q-icon name="key" />
                    </template>
                  </q-input>
                </template>
              </InputField>
              <div class="bottom-btn-primary">
                <q-btn no-caps unelevated class="btn-primary btn-primary__full" :loading="isLoading"
                  @click="onVerifyForgotPassword()">
                  {{ $t("btn.confirm") }}
                </q-btn>
              </div>
            </template>
          </InputRowGrid>
        </q-form>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { SessionStorage } from "quasar";
import InputField from "../components/auth/InputField.vue";
import InputRowGrid from "../components/auth/InputRowGrid.vue";
import { useI18n } from "vue-i18n";
import "../css/auth.scss";

const { t } = useI18n();
const qs = require("qs");
const $q = useQuasar();
const router = useRouter();
const currentTab = ref("phone");
const childrenTabs = computed(() => [
  { label: t("form.phone"), name: "phone" },
  { label: t("form.email"), name: "email" }
]);
const isLoading = ref(false);
const otpCountdown = ref();
const otpCountdownInterval = ref();
const openPhoneVeriDialog = () => {
  loginNameRef.value.validate();
  if (!loginNameRef.value.hasError) {
    showCaptchaDialog.value = true;
    getInnerCode();
  }
};

const innerCodeId = ref("");
const innerCaptchaRef = ref("");
const showCaptchaDialog = ref(false);

const showImageCode = ref(false);
const imgOnLoad = () => (showImageCode.value = true);
const imgOnError = () => (showImageCode.value = false);
const phoneVerificationImg = ref("");
const getInnerCode = () => {
  api
    .get("/member/verificationCode")
    .then((response) => {
      if (response.code === 0) {
        phoneVerificationImg.value = "data:image/png;base64," + response.data.img;
        innerCodeId.value = response.data.id;
        innerCaptchaRef.value = "";
      }
    })
    .catch((e) => {
      console.log(e);
    });
};
const onCaptchaSubmit = () => {
  if (!passwordForm.loginName) {
    $q.notify({
      color: "negative",
      position: "top",
      message: t("form.phone_cannot_empty"),
      icon: "report_problem"
    });
    getInnerCode();
    return;
  }
  api
    .post(
      `/otp/sendForgetPasswordPhone`,
      qs.stringify({
        loginName: passwordForm.loginName,
        phone: passwordForm.loginName,
        captchaCode: innerCaptchaRef.value,
        codeId: innerCodeId.value
      })
    )
    .then((res) => {
      let message = res.message || t("form.otp_sent_phone_success"),
        color = "positive";

      if (res.code === 0) {
        showCaptchaDialog.value = false;
        passwordForm.smsCode = "";
        passwordForm.smsCodeId = res.data.codeId;
        console.log(res.data.codeId);

        // start otp countdown
        otpCountdown.value = res.data.second || 60;
        otpCountdownInterval.value = setInterval(() => {
          if (otpCountdown.value > 0) {
            otpCountdown.value = otpCountdown.value - 1;
          }
        }, 1000);
      } else {
        color = "negative";
        if (res.code === 1402) {
          message = t('notify.tryagain', { seconds: res.data.second });

          // start otp countdown
          otpCountdown.value = res.data.second || 60;
          otpCountdownInterval.value = setInterval(() => {
            if (otpCountdown.value > 0) {
              otpCountdown.value = otpCountdown.value - 1;
            }
          }, 1000);
        }
        getInnerCode();
      }

      if (message) {
        $q.notify({ message, color, position: "top" });
      }

      console.log("onCaptchaSubmit", res);
    })
    .catch(() => {
      getInnerCode();
    });
};
const verificationImg = ref("");
const passwordForm = reactive({
  loginName: "",
  // phone: "",
  email: "",
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
    .catch((e) => { });
};

const loginNameRef = ref();
const phoneRef = ref();
const emailRef = ref();
const ftCaptchaRef = ref();

const codeRef = ref();
const newPwdRef = ref();
const newConfirmPwdRef = ref();
const captchaRef = ref();

// NOTE: not using for API param
const newConfirmPwdVModel = ref();

// const isValidEmail = () => {
//   const emailPattern =
//     /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
//   return emailPattern.test(passwordForm.email) || "Please Enter A Valid Email Address";
// };

const isRequestSent = ref(false);

const onSubmitForgotPwd = (type) => {
  if (type === 'phone') {
    loginNameRef.value.validate();
    ftCaptchaRef.value.validate();

    $q.loading.show({
      message: t('notify.sendingVerificationCode')
    });

    if (loginNameRef.value.hasError || ftCaptchaRef.value.hasError) {
      $q.loading.hide();
    } else {
      passwordForm.loginName = passwordForm.phone;
      api
        .post("/otp/sendForgetPasswordPhone", qs.stringify(passwordForm))
        .then((response) => {
          if (response.code === 0) {
            isRequestSent.value = true;
            SessionStorage.set("phoneCodeId", response.data.codeId);
          }
        })
        .catch((error) => { })
        .then(() => {
          $q.loading.hide();
        });

      getCode();
    }
    return;
  } else {
    loginNameRef.value.validate();
    emailRef.value.validate();
    ftCaptchaRef.value.validate();

    $q.loading.show({
      message: t('notify.sendingVerificationCode')
    });

    if (loginNameRef.value.hasError || emailRef.value.hasError || ftCaptchaRef.value.hasError) {
      $q.loading.hide();
    } else {
      api
        .post("/otp/sendForgetPasswordEmail", qs.stringify(passwordForm))
        .then((response) => {
          if (response.code === 0) {
            isRequestSent.value = true;
            SessionStorage.set("emailCodeId", response.data.codeId);
          }
        })
        .catch((error) => { })
        .then(() => {
          $q.loading.hide();
        });

      getCode();
    }
  }

};

// const onSubmitForgotPwd = () => {
//   // loginNameRef.value.validate();
//   phoneRef.value.validate();
//   ftCaptchaRef.value.validate();

//   $q.loading.show({
//     message: "Sending verification code..."
//   });

//   passwordForm.loginName = passwordForm.phone;

//   if (
//     // loginNameRef.value.hasError ||
//     phoneRef.value.hasError ||
//     ftCaptchaRef.value.hasError
//   ) {
//     $q.loading.hide();
//   } else {
//     api
//       .post("/otp/sendForgetPasswordPhone", qs.stringify(passwordForm))
//       .then((response) => {
//         if (response.code === 0) {
//           isRequestSent.value = true;
//           SessionStorage.set("emailCodeId", response.data.codeId);
//         }
//       })
//       .catch((error) => {})
//       .then(() => {
//         $q.loading.hide();
//       });

//     getCode();
//   }
// };

// const verificationForm = reactive({
//   email: "",
//   code: "",
//   codeId: SessionStorage.getItem("emailCodeId"),
//   newPassword: ""
// });

const onVerifyForgotPassword = (type) => {
  codeRef.value.validate();
  newPwdRef.value.validate();

  $q.loading.show({
    message: t('notify.submitting')
  });

  if (codeRef.value.hasError || newPwdRef.value.hasError) {
    $q.loading.hide();
  } else {
    if (type === 'phone') {
      verificationForm.codeId = SessionStorage.getItem("phoneCodeId");
      // verificationForm.email = passwordForm.email;
      verificationForm.phone = passwordForm.phone;
      // verificationForm.captchaCode = SessionStorage.getItem("phoneCaptchaCode");

      api
        .post("/otp/verifyForgetPasswordPhone", qs.stringify(verificationForm))
        .then((response) => {
          if (response.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: t('notify.passwordResetCompleted'),
              icon: "check_circle_outline"
            });
            isRequestSent.value = false;
            router.push("/login");
          }
        })
        .catch((error) => { })
        .then(() => {
          $q.loading.hide();
        });

      getCode();
    }
    else {
      verificationForm.codeId = SessionStorage.getItem("emailCodeId");
      verificationForm.email = passwordForm.email;

      api
        .post("/otp/verifyForgetPasswordEmail", qs.stringify(verificationForm))
        .then((response) => {
          if (response.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: t('notify.passwordResetCompleted'),
              icon: "check_circle_outline"
            });
            isRequestSent.value = false;
            router.push("/login");
          }
        })
        .catch((error) => { })
        .then(() => {
          $q.loading.hide();
        });

      getCode();
    }
  }

};

const verificationForm = reactive({
  // phone: "",
  code: "",
  // captchaCode: "",
  codeId: currentTab.value === 'email' ? SessionStorage.getItem("emailCodeId") : SessionStorage.getItem("phoneCodeId"),
  newPassword: ""
});
// const onVerifyForgotPassword = () => {
//   codeRef.value.validate();
//   newPwdRef.value.validate();
//   newConfirmPwdRef.value.validate();
//   captchaRef.value.validate();

//   $q.loading.show({
//     message: "Submitting..."
//   });

//   if (
//     codeRef.value.hasError ||
//     newPwdRef.value.hasError ||
//     newConfirmPwdRef.value.hasError ||
//     captchaRef.value.hasError
//   ) {
//     $q.loading.hide();
//   } else {
//     verificationForm.codeId = SessionStorage.getItem("emailCodeId");
//     // verificationForm.phone = passwordForm.phone;

//     api
//       .post("/otp/verifyForgetPasswordPhone", qs.stringify(verificationForm))
//       .then((response) => {
//         if (response.code === 0) {
//           $q.notify({
//             color: "positive",
//             position: "top",
//             message: "Password Reset Completed",
//             icon: "report_problem"
//           });

//           router.push("/login");
//         }
//       })
//       .catch((error) => {})
//       .then(() => {
//         $q.loading.hide();
//       });

//     getCode();
//   }
// };

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
.get-code-btn {
  background: linear-gradient(90deg, #2ced88 0%, #9ee871 100%);
  color: #000000;
  box-shadow: 0px 2px 0px 0px #1cca6a;
  min-width: 100px;
  max-width: 120px;
  font-weight: bold;
}

.forgot-password-container {
  min-height: 100dvh;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.forgot-password-form-logo-img {
  padding: 0 16px;
  display: flex;
  justify-content: center;

  img {
    display: block;
    width: 100%;
    max-width: 120px;
    margin: 25px auto;
  }
}


.forgot-password-form-grid {
  display: grid;
  grid-auto-flow: row;
  gap: 7px;
  margin-top: 20px;

  .forgot-password-form-title {
    font-size: 22px;
    font-weight: 600;
    line-height: 30px;
  }

  .forgot-password-form-desc {
    width: 80%;
    font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0;
    text-align: center;
    color: #b2bdbf;
    margin: 0 auto;
  }
}

.bottom-btn {
  // margin-top: 20px;
  padding: 12px 0px 20px;
}

.bottom-img {
  text-align: center;
  margin-top: 10px;
}

:deep(.q-tab-panels) {
  border-radius: 8px;
}

.pwd-tab-wrapper {
  width: 100%;
  margin: 0 auto 18px;

  .q-tab {
    min-height: 45px;
    border-radius: 8px;
    color: #333333;
    background: #F2F2F2;
    width: 50%;

    &:first {
      margin-right: 10px;
    }

    &:nth-child(2) {
      margin-left: 10px;
    }
  }

  .pwd-tab-toggle {
    // background: url(../../assets/images/account/deposit-withdraw-tab-bg.png) no-repeat center center;
    background: transparent;
    background-size: 100% 100%;
    border-radius: 8px;
    margin-bottom: 4px;
    margin-top: 5px;
    padding: 1px;

    .right {
      color: white;
      // background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-right.png) no-repeat center center;
      background-size: 0;
    }

    .left {
      color: white;
      // background: url(../../assets/images/account/deposit-withdraw-tab-active-bg-left.png) no-repeat center center;
      background-size: 0;
    }

    :deep(.q-tab__label) {
      font-weight: 700;
      // color: #FFFFFF80;
    }

    :deep(.q-tab--active) {
      color: white;
      // background-size: 100% 100%;
      // background: linear-gradient(
      //   180deg,
      //   rgba(97, 255, 0, 0) 0%,
      //   rgba(97, 255, 0, 0.25) 50.5%,
      //   rgba(97, 255, 0, 0) 100%
      // );
      // box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);

      // &:before {
      //   content: "";
      //   background-color: #21EF89;
      //   height: 3px;
      //   border-radius: 4px;
      //   width: 30%;
      //   position: absolute;
      //   bottom: 0;
      //   left: 50%;
      //   transform: translateX(-50%);
      // }
      background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);

      background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
      box-shadow: 0px 0.5px 2px 0px #0667D599;
    }

    :deep(.q-tab--active .q-tab__label) {
      font-weight: 700 !important;
    }
  }
}
</style>
