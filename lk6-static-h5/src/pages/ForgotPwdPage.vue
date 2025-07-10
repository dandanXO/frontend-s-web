<template>
  <div class="forget-pass-section">
    <q-tabs v-model="tab" dense size="lg" class="forget-pass-tabs" align="justify" @change="goToTab">
      <q-tab name="phone" :label="$t('forgotPassword.tab.changePasswordByPhone')" />
      <q-tab name="email" :label="$t('forgotPassword.tab.changePasswordByEmail')" />
      <!-- <q-tab name="mail" label="邮箱找回账号" /> -->
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="phone">
        <div class="forgetpass-board">
          <q-form v-if="!isPhoneSent" class="rounded-borders" ref="phoneFormRef">
            <div class="forgot-pwd-form-inner-wrapper q-gutter-y-md">
              <div class="notification-red" v-if="!isPhoneSent">
                {{ $t("forgotPassword.form.preparePhoneOtp") }}
              </div>

              <div class="input-field-wrapper">
                <div class="input-field__label required">{{ $t("forgotPassword.form.userName.label") }}</div>
                <q-input
                  ref="userRef"
                  hide-bottom-space
                  type="text"
                  standout
                  clearable
                  :placeholder="$t('forgotPassword.form.userName.placeholder')"
                  v-model="passwordFormPhone.loginName"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || $t('forgotPassword.form.userName.error.required'),
                    (val) =>
                      (val && val.length >= 4 && val.length <= 12) ||
                      $t('forgotPassword.form.userName.error.length', { min: 4, max: 12 })
                  ]"
                  color="white"
                ></q-input>
              </div>

              <div class="input-field-wrapper">
                <div class="input-field__label required">{{ $t("forgotPassword.form.phone.label") }}</div>
                <q-input
                  ref="phoneRef"
                  hide-bottom-space
                  type="text"
                  standout
                  clearable
                  v-model="passwordFormPhone.phone"
                  :placeholder="$t('forgotPassword.form.phone.placeholder')"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('forgotPassword.form.phone.error.required'),
                    (val) => isValidPhone(val)
                  ]"
                  color="white"
                  label-color="secondary"
                ></q-input>
              </div>

              <div class="input-field-wrapper">
                <div class="input-field__label required">{{ $t("forgotPassword.form.verificationCode.label") }}</div>

                <q-input
                  standout
                  class="captcha-textfield"
                  ref="verificationRef"
                  hide-bottom-space
                  type="text"
                  :placeholder="$t('forgotPassword.form.verificationCode.placeholder')"
                  v-model="passwordFormPhone.captchaCode"
                  :rules="[
                    (val) =>
                      (val && val.length > 3 && val.length < 5) ||
                      $t('forgotPassword.form.verificationCode.error.format')
                  ]"
                  label-color=""
                >
                  <template v-slot:append>
                    <img :src="verificationImg" @click="getCode" />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row justify-between items-center q-mt-md">
              <q-btn
                @click.prevent="submitSendOtp('phone')"
                :label="$t('btn.submit')"
                width="100%"
                class="submit-btn"
                style="width: 100%"
              />
            </div>
          </q-form>

          <q-form v-if="isPhoneSent" class="rounded-borders form-after-submit">
            <div class="forgot-pwd-form-inner-wrapper q-gutter-y-md">
              <div class="notification-blue">{{ $t("forgotPassword.form.notification") }}</div>

              <div class="input-field-wrapper">
                <div class="input-field__label required">{{ $t("forgotPassword.form.otp.label") }}</div>
                <q-input
                  ref="codeRef"
                  hide-bottom-space
                  v-model="verificationPhoneForm.code"
                  standout
                  clearable
                  :rules="[
                    (val) => (val && val.length > 0) || $t('forgotPassword.form.otp.error.required'),
                    (val) => (val && val.length >= 4 && val.length <= 6) || $t('forgotPassword.form.otp.error.length')
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="qr_code" />
                  </template>
                </q-input>
              </div>
              <div class="input-field-wrapper">
                <div class="input-field__label required">{{ $t("forgotPassword.form.password.label") }}</div>
                <q-input
                  ref="newPwdRef"
                  :type="isPwd ? 'password' : 'text'"
                  hide-bottom-space
                  v-model="verificationPhoneForm.newPassword"
                  standout
                  clearable
                  :rules="[
                    (val) => (val && val.length > 0) || $t('forgotPassword.form.password.error.required'),
                    (val) =>
                      (val.length > 5 && val.length <= 12) ||
                      $t('forgotPassword.form.password.error.length', { min: 6, max: 12 })
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock_open" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>

              <div class="input-field-wrapper">
                <div class="input-field__label required">
                  {{ $t("forgotPassword.form.passwordConfirm.label") }}
                </div>
                <q-input
                  ref="confirmPwdRef"
                  :type="isPwd ? 'password' : 'text'"
                  hide-bottom-space
                  v-model="verificationPhoneForm.confirmPwd"
                  standout
                  clearable
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || $t('forgotPassword.form.passwordConfirm.error.required'),
                    (val) =>
                      (val.length > 5 && val.length <= 12) ||
                      $t('forgotPassword.form.passwordConfirm.error.length', { min: 6, max: 12 }),
                    validatePassNew
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock_open" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row justify-between items-center">
              <q-btn
                @click.prevent="onVerifyForgotPassword('phone')"
                :label="$t('btn.submit')"
                width="100%"
                class="common-large-btn"
                color="brightbtn"
                style="width: 100%"
              />
            </div>
          </q-form>
        </div>
      </q-tab-panel>
      <q-tab-panel name="email">
        <div class="forgetpass-board q-gutter-y-md">
          <q-form v-if="!isEmailSent" class="rounded-borders" ref="phoneFormRef">
            <div class="forgot-pwd-form-inner-wrapper q-gutter-y-md">
              <div class="notification-red" v-if="!isEmailSent">{{ $t("forgotPassword.form.prepareEmailOtp") }}</div>

              <div class="input-field-wrapper">
                <div class="input-field__label required">{{ $t("forgotPassword.form.userName.label") }}</div>
                <q-input
                  ref="userRef2"
                  hide-bottom-space
                  type="text"
                  standout
                  clearable
                  v-model="passwordFormEmail.loginName"
                  :placeholder="$t('forgotPassword.form.userName.placeholder')"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || $t('forgotPassword.form.userName.required'),
                    (val) =>
                      (val && val.length >= 4 && val.length <= 12) ||
                      $t('forgotPassword.form.userName.length', { min: 4, max: 12 })
                  ]"
                  color="white"
                ></q-input>
              </div>

              <div class="input-field-wrapper">
                <div class="input-field__label required">{{ $t("forgotPassword.form.email.label") }}</div>
                <q-input
                  ref="emailRef"
                  hide-bottom-space
                  type="email"
                  standout
                  clearable
                  v-model="passwordFormEmail.email"
                  :placeholder="$t('forgotPassword.form.email.placeholder')"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('forgotPassword.form.email.error.required'),
                    (val) => isValidEmail(val)
                  ]"
                  color="white"
                  label-color="secondary"
                ></q-input>
              </div>

              <div class="input-field-wrapper">
                <div class="input-field__label required">{{ $t("forgotPassword.form.verificationCode.label") }}</div>

                <q-input
                  standout
                  class="captcha-textfield"
                  ref="verificationRef"
                  hide-bottom-space
                  type="text"
                  :placeholder="$t('forgotPassword.form.verificationCode.placeholder')"
                  v-model="passwordFormEmail.captchaCode"
                  :rules="[
                    (val) =>
                      (val && val.length > 3 && val.length < 5) ||
                      $t('forgotPassword.form.verificationCode.error.format')
                  ]"
                  label-color=""
                >
                  <template v-slot:append>
                    <img :src="verificationImg" @click="getCode" />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row justify-between items-center q-mt-md">
              <q-btn
                @click.prevent="submitSendOtp('email')"
                :label="$t('btn.submit')"
                width="100%"
                class="submit-btn"
                style="width: 100%"
              />
            </div>
          </q-form>

          <q-form v-if="isEmailSent" class="q-gutter-y-md rounded-borders form-after-submit">
            <div class="forgot-pwd-form-inner-wrapper q-gutter-y-md">
              <div v-if="isEmailSent" class="notification-blue">
                {{ $t("forgotPassword.form.notification") }}
              </div>

              <q-input
                ref="codeRef2"
                hide-bottom-space
                v-model="verificationForm.code"
                :placeholder="$t('forgotPassword.form.otp.placeholder')"
                lazy-rules
                standout
                clearable
                :rules="[
                  (val) => (val && val.length > 0) || $t('forgotPassword.form.otp.error.required'),
                  (val) => (val && val.length >= 4 && val.length <= 6) || $t('forgotPassword.form.otp.error.length')
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="qr_code" />
                </template>
              </q-input>
              <div class="input-field-wrapper">
                <div class="input-field__label required">{{ $t("forgotPassword.form.password.label") }}</div>
                <q-input
                  ref="newPwdRef2"
                  :type="isPwd ? 'password' : 'text'"
                  hide-bottom-space
                  v-model="verificationForm.newPassword"
                  :placeholder="$t('forgotPassword.form.password.placeholder')"
                  standout
                  clearable
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || $t('forgotPassword.form.password.error.required'),
                    (val) =>
                      (val.length > 5 && val.length <= 12) ||
                      $t('forgotPassword.form.password.error.length', { min: 6, max: 12 })
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock_open" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>

              <div class="input-field-wrapper">
                <div class="input-field__label required">{{ $t("forgotPassword.form.passwordConfirm.label") }}</div>
              </div>
              <q-input
                ref="confirmPwdRef2"
                :type="isPwd ? 'password' : 'text'"
                hide-bottom-space
                v-model="verificationForm.confirmPwd"
                :placeholder="$t('forgotPassword.form.passwordConfirm.placeholder')"
                standout
                clearable
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || $t('forgotPassword.form.passwordConfirm.error.required'),
                  (val) =>
                    (val.length > 5 && val.length <= 12) ||
                    $t('forgotPassword.form.passwordConfirm.error.length', { min: 6, max: 12 }),
                  validatePassNew2
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="lock_open" />
                </template>
                <template v-slot:append>
                  <q-icon
                    color="bright"
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
            <div class="row justify-between items-center">
              <q-btn
                @click.prevent="onVerifyForgotPassword('email')"
                :label="$t('btn.submit')"
                width="100%"
                class="common-large-btn"
                color="brightbtn"
                style="width: 100%"
              />
            </div>
          </q-form>
        </div>
      </q-tab-panel>
      <!-- <q-tab-panel name="mail">
        <div class="text-blue-grey">方式：请输入您的注册邮箱</div>
        <q-form v-if="!isEmailSent" class="rounded-borders" ref="passRef">
          <div class="input-field-wrapper">
            <div class="input-field__label required">注册邮箱:</div>

            <q-input
              ref="emailRef2"
              hide-bottom-space
              type="email"
              borderless
              clearable
              placeholder="请输入注册邮箱"
              v-model="passwordForm.email"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || '请输入电子邮件', isValidEmail]"
              color="white"
            ></q-input>
          </div>

          <div class="input-field-wrapper">
            <div class="input-field__label required">验证码</div>

            <q-input
              standout
              hide-bottom-space
              class="captcha-textfield"
              ref="verificationRef"
              placeholder="请输入验证码"
              type="text"
              v-model="passwordForm.captchaCode"
              :rules="[(val) => (val && val.length > 3 && val.length < 5) || '验证码应为四个字符串']"
            >
              <template v-slot:append>
                <img :src="verificationImg" @click="getCode" />
              </template>
            </q-input>
          </div>

          <div class="row justify-between items-center q-mt-md">
            <q-btn @click.prevent="submitForgetPass" label="提交" width="100%" class="submit-btn" style="width: 100%" />
          </div>
        </q-form>
      </q-tab-panel> -->
    </q-tab-panels>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { SessionStorage } from "quasar";
import { findAccount } from "src/api/index/login";
import qs from "qs";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "ForgotPwdPage",
  setup() {
    const { t } = useI18n();
    const verificationRef = ref();
    const tab = ref("phone");
    const isPwd = ref(true);
    onMounted(() => {
      getCode();
    });
    const verificationImg = ref("");
    const passwordForm = reactive({
      email: "",
      captchaCode: ""
    });
    const activeTab = ref("phone");
    const getCode = () => {
      api
        .get("/member/verificationCode")
        .then((response) => {
          if (response.code === 0) {
            verificationImg.value = "data:image/png;base64," + response.data.img;
            passwordForm.codeId = response.data.id;

            passwordFormPhone.codeId = response.data.id;
            passwordFormEmail.codeId = response.data.id;

            passwordFormPhone.captchaCode = "";
            passwordFormEmail.captchaCode = "";
            passwordForm.captchaCode = "";
          }
        })
        .catch((e) => {});
    };
    const loginNameRef = ref();
    const emailRef = ref();
    const emailRef2 = ref();

    const phoneRef = ref();
    const userRef2 = ref();
    const userRef = ref();
    const ftCaptchaRef = ref();
    const codeRef = ref();
    const newPwdRef = ref();
    const captchaRef = ref();
    const confirmPwdRef = ref();

    const newPwdRef2 = ref();
    const codeRef2 = ref();
    const confirmPwdRef2 = ref();

    const $q = useQuasar();
    const pwdStrength = ref("");

    var qs = require("qs");
    const route = useRoute();
    const router = useRouter();
    const isEmailSent = ref(false);
    const isPhoneSent = ref(false);
    const isEmailSending = ref(false);
    const passRef = ref([]);

    const passwordFormPhone = reactive({
      codeId: "",
      loginName: "",
      phone: "",
      captchaCode: ""
    });
    const passwordFormEmail = reactive({
      codeId: "",
      loginName: "",
      email: "",
      captchaCode: ""
    });
    const verificationForm = reactive({
      email: null,
      phone: null,
      code: "",
      codeId: SessionStorage.getItem("emailCodeId"),
      newPassword: "",
      confirmPwd: ""
    });

    const verificationPhoneForm = reactive({
      email: null,
      phone: null,
      code: "",
      codeId: SessionStorage.getItem("phoneCodeId"),
      newPassword: "",
      confirmPwd: ""
    });

    const submitSendOtp = (method) => {
      if (method === "phone") {
        phoneRef.value.validate();
        userRef.value.validate();

        if (phoneRef.value.hasError || userRef.value.hasError) {
        } else {
          $q.loading.show({
            message: t("forgotPassword.notification.sendingOtp.message")
          });
          api
            .post("/otp/sendForgetPasswordPhone", qs.stringify(passwordFormPhone))
            .then((response) => {
              if (response.code === 0) {
                isPhoneSent.value = true;
                SessionStorage.set("phoneCodeId", response.data.codeId);
              }
              $q.loading.hide();

              $q.notify({
                color: "positive",
                position: "top",
                message: t("forgotPassword.notification.otpVerified.message"),
                icon: "check_circle_outline"
              });
              getCode();
            })
            .catch((error) => {
              getCode();
              $q.loading.hide();
            });
        }
      } else if (method === "email") {
        emailRef.value.validate();
        userRef2.value.validate();

        if (emailRef.value.hasError || userRef2.value.hasError) {
        } else {
          $q.loading.show({
            message: t("forgotPassword.notification.sendingOtp.message")
          });
          api
            .post("/otp/sendForgetPasswordEmail", qs.stringify(passwordFormEmail))
            .then((response) => {
              if (response.code === 0) {
                isEmailSent.value = true;
                SessionStorage.set("emailCodeId", response.data.codeId);
              }
              $q.loading.hide();

              $q.notify({
                color: "positive",
                position: "top",
                message: t("forgotPassword.notification.otpVerified.message"),
                icon: "check_circle_outline"
              });
              getCode();
            })
            .catch((error) => {
              getCode();
              $q.loading.hide();
            });
        }
      }
    };

    const submitForgetPass = () => {
      emailRef2.value.validate();
      verificationRef.value.validate();

      if (emailRef2.value.hasError || verificationRef.value.hasError) {
      } else {
        findAccount(passwordForm)
          .then((res) => {
            if (res.code === 0) {
              getCode();
              $q.notify({
                message: "您的帐号已经发送到注册邮箱",
                color: "positive",
                position: "top"
              });

              passwordForm.email = "";
            }
          })
          .catch((res) => {
            getCode();
          });
      }
    };

    const onVerifyForgotPassword = (method) => {
      if (method == "phone") {
        codeRef.value.validate();
        newPwdRef.value.validate();
        confirmPwdRef.value.validate();
        $q.loading.show({
          message: t("forgotPassword.notification.submitting.message")
        });
        if (codeRef.value.hasError || newPwdRef.value.hasError || confirmPwdRef.value.hasError) {
          $q.loading.hide();
        } else {
          verificationPhoneForm.codeId = SessionStorage.getItem("phoneCodeId");
          verificationPhoneForm.phone = passwordFormPhone.phone;

          api
            .post("/otp/verifyForgetPasswordPhone", qs.stringify(verificationPhoneForm))
            .then((response) => {
              if (response.code === 0) {
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: t("forgotPassword.notification.passwordChanged.message"),
                  icon: "check_circle_outline"
                });
                router.push("/login");
              } else {
              }
              $q.loading.hide();
            })
            .catch((error) => {
              $q.loading.hide();
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: error.message,
              //   icon: "report_problem"
              // });
            });
          getCode();
        }
      } else if (method == "email") {
        codeRef2.value.validate();
        newPwdRef2.value.validate();
        confirmPwdRef2.value.validate();
        $q.loading.show({
          message: t("forgotPassword.notification.submitting.message")
        });
        if (codeRef2.value.hasError || newPwdRef2.value.hasError || confirmPwdRef2.value.hasError) {
          $q.loading.hide();
        } else {
          verificationForm.codeId = SessionStorage.getItem("emailCodeId");
          verificationForm.email = passwordFormEmail.email;
          api
            .post("/otp/verifyForgetPasswordEmail", qs.stringify(verificationForm))
            .then((response) => {
              if (response.code === 0) {
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: t("forgotPassword.notification.passwordChanged.message"),
                  icon: "check_circle_outline"
                });
                router.push("/login");
              } else {
              }
              $q.loading.hide();
            })
            .catch((error) => {
              $q.loading.hide();
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: error.message,
              //   icon: "report_problem"
              // });
            });
          getCode();
        }
      }
    };

    const goToTab = (tabVal) => {
      getCode();

      passwordFormPhone.codeId = "";
      passwordFormPhone.loginName = "";
      passwordFormPhone.phone = "";
      passwordFormPhone.captchaCode = "";

      passwordFormEmail.codeId = "";
      passwordFormEmail.loginName = "";
      passwordFormEmail.email = "";
      passwordFormEmail.captchaCode = "";
    };

    const isValidPhone = (val) => {
      const phonePattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      return phonePattern.test(val) || t("forgotPassword.form.phone.error.format");
    };

    const isValidEmail = (val) => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || t("forgotPassword.form.email.error.required");
    };

    const validatePassNew = () => {
      if (verificationPhoneForm.confirmPwd !== verificationPhoneForm.newPassword) {
        return t("forgotPassword.form.passwordConfirm.error.match");
      }
    };

    const validatePassNew2 = () => {
      if (verificationForm.confirmPwd !== verificationForm.newPassword) {
        return t("forgotPassword.form.passwordConfirm.error.match");
      }
    };

    return {
      header: "Forgot Account & Password",
      passwordForm,
      verificationForm,
      validatePassNew,
      validatePassNew2,
      verificationPhoneForm,
      verificationImg,
      activeTab,
      getCode,
      isValidEmail,
      isEmailSent,
      isPhoneSent,
      submitForgetPass,
      onVerifyForgotPassword,
      submitSendOtp,
      passwordFormPhone,
      passwordFormEmail,
      loginNameRef,
      emailRef,
      emailRef2,
      phoneRef,
      userRef,
      userRef2,
      ftCaptchaRef,
      confirmPwdRef,
      verificationRef,
      codeRef,
      newPwdRef,
      captchaRef,
      newPwdRef2,
      codeRef2,
      confirmPwdRef2,
      pwdStrength,
      tab,
      isPwd,
      isValidPhone,
      goToTab,
      passRef
    };
  }
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

<style lang="scss" src="src/css/pages/forget-password.scss"></style>
