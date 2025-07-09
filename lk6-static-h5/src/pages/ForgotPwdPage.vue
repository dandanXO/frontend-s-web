<template>
  <div class="forget-pass-section">
    <q-tabs v-model="tab" dense size="lg" class="forget-pass-tabs" align="justify" @change="goToTab">
      <q-tab name="phone" label="短信修改密码" />
      <q-tab name="email" label="邮箱修改密码" />
      <!-- <q-tab name="mail" label="邮箱找回账号" /> -->
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="phone">
        <div class="forgetpass-board">
          <q-form v-if="!isPhoneSent" class="rounded-borders" ref="phoneFormRef">
            <div class="forgot-pwd-form-inner-wrapper q-gutter-y-md">
              <div class="notification-red" v-if="!isPhoneSent">
                请提供您的用户名以及手机号码，我们会立即将新的密码发送到您的邮箱。
              </div>

              <div class="input-field-wrapper">
                <div class="input-field__label required">请输入用户名</div>
                <q-input
                  ref="userRef"
                  hide-bottom-space
                  type="text"
                  standout
                  clearable
                  placeholder="请输入用户名"
                  v-model="passwordFormPhone.loginName"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || '请输入用户名',
                    (val) => (val && val.length >= 4 && val.length <= 12) || '长度要在 4-12 之间'
                  ]"
                  color="white"
                ></q-input>
              </div>

              <div class="input-field-wrapper">
                <div class="input-field__label required">请输入手机号码</div>
                <q-input
                  ref="phoneRef"
                  hide-bottom-space
                  type="text"
                  standout
                  clearable
                  v-model="passwordFormPhone.phone"
                  placeholder="请输入手机号码"
                  :rules="[(val) => (val && val.length > 0) || '请输入手机号码', (val) => isValidPhone(val)]"
                  color="white"
                  label-color="secondary"
                ></q-input>
              </div>

              <div class="input-field-wrapper">
                <div class="input-field__label required">验证码</div>

                <q-input
                  standout
                  class="captcha-textfield"
                  ref="verificationRef"
                  hide-bottom-space
                  type="text"
                  placeholder="请输入验证码"
                  v-model="passwordFormPhone.captchaCode"
                  :rules="[(val) => (val && val.length > 3 && val.length < 5) || '验证码应为四个字符串']"
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
                label="提交"
                width="100%"
                class="submit-btn"
                style="width: 100%"
              />
            </div>
          </q-form>

          <q-form v-if="isPhoneSent" class="rounded-borders form-after-submit">
            <div class="forgot-pwd-form-inner-wrapper q-gutter-y-md">
              <div class="notification-blue">OTP短信已发送到您的注册手机, 请输入OTP和新密码。</div>

              <div class="input-field-wrapper">
                <div class="input-field__label required">OTP码</div>
                <q-input
                  ref="codeRef"
                  hide-bottom-space
                  v-model="verificationPhoneForm.code"
                  standout
                  clearable
                  :rules="[
                    (val) => (val && val.length > 0) || '请输入OTP码',
                    (val) => (val && val.length >= 4 && val.length <= 6) || 'OTP长度不符'
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="qr_code" />
                  </template>
                </q-input>
              </div>
              <div class="input-field-wrapper">
                <div class="input-field__label required">请输入新密码</div>
                <q-input
                  ref="newPwdRef"
                  :type="isPwd ? 'password' : 'text'"
                  hide-bottom-space
                  v-model="verificationPhoneForm.newPassword"
                  standout
                  clearable
                  :rules="[
                    (val) => (val && val.length > 0) || '请输入密码',
                    (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12'
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
                <div class="input-field__label required">请再次输入新密码</div>
                <q-input
                  ref="confirmPwdRef"
                  :type="isPwd ? 'password' : 'text'"
                  hide-bottom-space
                  v-model="verificationPhoneForm.confirmPwd"
                  standout
                  clearable
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || '请输入确认密码',
                    (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12',
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
                label="提交"
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
              <div class="notification-red" v-if="!isEmailSent">方式：请输入您需找回登陆密码的用户名和验证邮箱</div>

              <div class="input-field-wrapper">
                <div class="input-field__label required">请输入用户名</div>
                <q-input
                  ref="userRef2"
                  hide-bottom-space
                  type="text"
                  standout
                  clearable
                  v-model="passwordFormEmail.loginName"
                  placeholder="请输入用户名"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || '请输入用户名',
                    (val) => (val && val.length >= 4 && val.length <= 12) || '长度要在 4-12 之间'
                  ]"
                  color="white"
                ></q-input>
              </div>

              <div class="input-field-wrapper">
                <div class="input-field__label required">请输入注册邮箱</div>
                <q-input
                  ref="emailRef"
                  hide-bottom-space
                  type="email"
                  standout
                  clearable
                  v-model="passwordFormEmail.email"
                  placeholder="请输入验证邮箱"
                  :rules="[(val) => (val && val.length > 0) || '请输入验证邮箱', (val) => isValidEmail(val)]"
                  color="white"
                  label-color="secondary"
                ></q-input>
              </div>

              <div class="input-field-wrapper">
                <div class="input-field__label required">验证码</div>

                <q-input
                  standout
                  class="captcha-textfield"
                  ref="verificationRef"
                  hide-bottom-space
                  type="text"
                  placeholder="请输入验证码"
                  v-model="passwordFormEmail.captchaCode"
                  :rules="[(val) => (val && val.length > 3 && val.length < 5) || '验证码应为四个字符串']"
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
                label="提交"
                width="100%"
                class="submit-btn"
                style="width: 100%"
              />
            </div>
          </q-form>

          <q-form v-if="isEmailSent" class="q-gutter-y-md rounded-borders form-after-submit">
            <div class="forgot-pwd-form-inner-wrapper q-gutter-y-md">
              <div v-if="isEmailSent" class="notification-blue">
                验证码已发送到您的注册邮箱，请输入验证码和新密码完成密码修改。
              </div>

              <q-input
                ref="codeRef2"
                hide-bottom-space
                v-model="verificationForm.code"
                placeholder="请输入验证码"
                lazy-rules
                standout
                clearable
                :rules="[
                  (val) => (val && val.length > 0) || '请输入验证码',
                  (val) => (val && val.length >= 4 && val.length <= 6) || 'OTP长度不符'
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="qr_code" />
                </template>
              </q-input>
              <div class="input-field-wrapper">
                <div class="input-field__label required">请输入新密码</div>
                <q-input
                  ref="newPwdRef2"
                  :type="isPwd ? 'password' : 'text'"
                  hide-bottom-space
                  v-model="verificationForm.newPassword"
                  placeholder="请输入新密码"
                  standout
                  clearable
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || '请输入新密码',
                    (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12'
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
                <div class="input-field__label required">请再次输入密码</div>
              </div>
              <q-input
                ref="confirmPwdRef2"
                :type="isPwd ? 'password' : 'text'"
                hide-bottom-space
                v-model="verificationForm.confirmPwd"
                placeholder="请再次输入密码"
                standout
                clearable
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || '请再次输入密码',
                  (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12',
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
                label="提交"
                width="100%"
                class="common-large-btn"
                color="brightbtn"
                style="width: 100%"
              />
            </div>
          </q-form>
        </div>
      </q-tab-panel>
      <q-tab-panel name="mail">
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
      </q-tab-panel>
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

export default defineComponent({
  name: "ForgotPwdPage",
  setup() {
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
            message: "发送验证码中..."
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
                message: "请输入新密码",
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
            message: "发送验证码中..."
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
                message: "请输入新密码",
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
          message: "提交中.."
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
                  message: "密码修改成功",
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
          message: "提交中.."
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
                  message: "密码修改成功",
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
      return phonePattern.test(val) || "请输入有效的电话号码";
    };

    const isValidEmail = (val) => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "请输入有效电子邮件";
    };

    const validatePassNew = () => {
      if (verificationPhoneForm.confirmPwd !== verificationPhoneForm.newPassword) {
        return "密码不同";
      }
    };

    const validatePassNew2 = () => {
      if (verificationForm.confirmPwd !== verificationForm.newPassword) {
        return "密码不同";
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
