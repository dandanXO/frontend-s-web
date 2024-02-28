<template>
  <div class="forget-pass-section bg-white">
    <q-tabs
      v-model="tab"
      dense
      size="lg"
      class="text-grey"
      active-color="light-blue-9"
      indicator-color="light-blue-9"
      align="justify"
      @change="goToTab"
    >
      <q-tab name="phone" label="短信修改密码" />
      <q-tab name="email" label="邮箱修改密码" />
      <q-tab name="mail" label="邮箱找回账号" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="phone">
        <div class="text-blue-grey" v-if="!isEmailSent">方式：请输入您需找回登陆密码的用户名和验证手机号码</div>

        <div class="forgetpass-board q-gutter-y-md">
          <q-form v-if="!isEmailSent" class="rounded-borders" ref="phoneFormRef">
            <q-row class="row items-baseline justify-start">
              <q-item-label>
                <span class="text-red">*&nbsp;</span>
                用户名:
              </q-item-label>
              <q-input
                ref="emailRef"
                hide-bottom-space
                type="email"
                borderless
                clearable
                placeholder="请输入用户名"
                v-model="passwordFormPhone.loginName"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || '请输入用户名']"
                color="white"
              ></q-input>
            </q-row>

            <q-row class="row items-baseline justify-start">
              <q-item-label>
                <span class="text-red">*&nbsp;</span>
                手机号码:
              </q-item-label>
              <q-input
                ref="emailRef"
                hide-bottom-space
                type="email"
                borderless
                clearable
                v-model="passwordFormPhone.phone"
                placeholder="请输入手机号码"
                :rules="[(val) => (val && val.length > 0) || '请输入手机号码']"
                color="white"
                label-color="secondary"
              ></q-input>
            </q-row>

            <q-row class="row items-baseline justify-start">
              <q-item-label>
                <span class="text-red">*&nbsp;</span>
                验证码
              </q-item-label>

              <q-input
                standout
                class="captcha-textfield"
                bg-color="white"
                ref="verificationRef"
                hide-bottom-space
                type="text"
                v-model="passwordFormPhone.captchaCode"
                :rules="[(val) => (val && val.length > 3 && val.length < 5) || '验证码应为四个字符串']"
                label-color=""
              >
                <template v-slot:append>
                  <img :src="verificationImg" @click="getCode" />
                </template>
              </q-input>
            </q-row>

            <div class="row justify-between items-center q-mt-md">
              <q-btn
                @click.prevent="submitSendOtp('phone')"
                label="提交"
                width="100%"
                color="dyblue"
                style="width: 100%"
              />
            </div>
          </q-form>

          <div v-if="isEmailSent" class="text-blue q-px-md">OTP短信已发送到您的注册手机, 请输入OTP和新密码。</div>
          <q-form v-if="isEmailSent" class="q-gutter-y-md rounded-borders form-after-submit">
            <q-input
              ref="codeRef"
              filled
              hide-bottom-space
              v-model="verificationForm.code"
              label="OTP码"
              lazy-rules
              clearable
              :rules="[(val) => (val && val.length > 0) || '请输入OTP码']"
            >
              <template v-slot:prepend>
                <q-icon name="qr_code" />
              </template>
            </q-input>
            <q-input
              ref="newPwdRef"
              :type="isPwd ? 'password' : 'text'"
              filled
              hide-bottom-space
              v-model="verificationForm.newPassword"
              label="新密码"
              clearable
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || '请输入密码',
                (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12',
                (val) => (val && (pwdStrength == 'normal' || pwdStrength == 'strong')) || '密码安全级别必须至少为好'
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
            <div v-if="verificationForm.newPassword" class="password-str-div">
              <span
                :class="{
                  'weak-pwd': pwdStrength == 'weak',
                  'normal-pwd': pwdStrength == 'normal',
                  'strong-pwd': pwdStrength == 'strong'
                }"
              >
                弱
              </span>
              <span
                :class="{
                  'normal-pwd': pwdStrength == 'normal',
                  'strong-pwd': pwdStrength == 'strong'
                }"
              >
                好
              </span>
              <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">强</span>
            </div>
            <q-input
              ref="confirmPwdRef"
              :type="isPwd ? 'password' : 'text'"
              filled
              hide-bottom-space
              v-model="verificationForm.newPassword"
              label="确认新密码"
              clearable
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || '请输入确认密码',
                (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12'
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
        <div class="text-blue-grey">方式：请输入您需找回登陆密码的用户名和验证邮箱</div>
      </q-tab-panel>
      <q-tab-panel name="mail">
        <div class="text-blue-grey">方式：请输入您的注册邮箱</div>
        <q-form v-if="!isEmailSent" class="rounded-borders" ref="passRef">
          <q-row class="row items-center justify-start">
            <q-item-label>
              <span class="text-red">*&nbsp;</span>
              注册邮箱:
            </q-item-label>

            <q-input
              ref="emailRef"
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
          </q-row>

          <q-row class="row items-center justify-start">
            <q-item-label>
              <span class="text-red">*&nbsp;</span>
              验证码
            </q-item-label>

            <q-input
              standout
              hide-bottom-space
              class="captcha-textfield"
              bg-color="white"
              ref="verificationRef"
              placeholder="请输入4位验证码"
              type="text"
              v-model="passwordForm.captchaCode"
              :rules="[(val) => (val && val.length > 3 && val.length < 5) || '验证码应为四个字符串']"
            >
              <template v-slot:append>
                <img :src="verificationImg" @click="getCode" />
              </template>
            </q-input>
          </q-row>

          <div class="row justify-between items-center q-mt-md">
            <q-btn @click.prevent="submitForgetPass" label="提交" width="100%" color="dyblue" style="width: 100%" />
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
    const ftCaptchaRef = ref();
    const codeRef = ref();
    const newPwdRef = ref();
    const captchaRef = ref();
    const $q = useQuasar();
    const pwdStrength = ref("");
    const isValidEmail = () => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(passwordForm.email) || "请输入有效电子邮件";
    };
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

    const submitSendOtp = (method) => {
      if (method === "phone") {
        $q.loading.show({
          message: "发送验证码中..."
        });
        api
          .post("/otp/sendForgetPasswordPhone", qs.stringify(passwordFormPhone))
          .then((response) => {
            if (response.code === 0) {
              isEmailSent.value = true;
              SessionStorage.set("phoneCodeId", response.data.codeId);
            }
            $q.loading.hide();

            $q.notify({
              color: "positive",
              position: "top",
              message: "请输入新密码",
              icon: "check_circle_outline"
            });
          })
          .catch((error) => {
            $q.loading.hide();
          });
        getCode();
      } else if (method === "email") {
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
          })
          .catch((error) => {
            $q.loading.hide();
          });
        getCode();
      }
    };

    const submitForgetPass = () => {
      emailRef.value.validate();
      verificationRef.value.validate();

      if (emailRef.value.hasError || verificationRef.value.hasError) {
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
            }
          })
          .catch((res) => {
            getCode();
          });
      }
    };
    const onSubmitForgotPwd = () => {
      emailRef.value.validate();
      ftCaptchaRef.value.validate();
      $q.loading.show({
        message: "注册中..."
      });
      if (emailRef.value.hasError || ftCaptchaRef.value.hasError) {
        $q.loading.hide();
      } else {
        api
          .post("/otp/sendForgetPasswordEmail", qs.stringify(passwordForm))
          .then((response) => {
            if (response.code === 0) {
              isEmailSent.value = true;
              SessionStorage.set("emailCodeId", response.data.codeId);
            } else {
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: res.message,
              //   icon: "report_problem"
              // });
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
    };
    const onVerifyForgotPassword = (method) => {
      if (method == "phone") {
        codeRef.value.validate();
        newPwdRef.value.validate();
        captchaRef.value.validate();
        $q.loading.show({
          message: "提交中.."
        });
        if (codeRef.value.hasError || newPwdRef.value.hasError || captchaRef.value.hasError) {
          $q.loading.hide();
        } else {
          verificationForm.codeId = SessionStorage.getItem("emailCodeId");
          verificationForm.email = passwordForm.email;
          api
            .post("/otp/verifyForgetPasswordPhone", qs.stringify(verificationForm))
            .then((response) => {
              if (response.code === 0) {
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
        codeRef.value.validate();
        newPwdRef.value.validate();
        captchaRef.value.validate();
        $q.loading.show({
          message: "提交中.."
        });
        if (codeRef.value.hasError || newPwdRef.value.hasError || captchaRef.value.hasError) {
          $q.loading.hide();
        } else {
          verificationForm.codeId = SessionStorage.getItem("emailCodeId");
          verificationForm.email = passwordForm.email;
          api
            .post("/otp/verifyForgetPasswordEmail", qs.stringify(verificationForm))
            .then((response) => {
              if (response.code === 0) {
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

      fgtpwdTab.value = tabVal;
    };

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
        for (var i = 0; i <= 4; i++) {
          if (result & 1) {
            level++;
          }
          result = result >>> 1;
        }
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
    return {
      header: "Forgot Account & Password",
      passwordForm,
      verificationForm,
      verificationImg,
      activeTab,
      getCode,
      isValidEmail,
      isEmailSent,
      isPhoneSent,
      onSubmitForgotPwd,
      submitForgetPass,
      onVerifyForgotPassword,
      submitSendOtp,
      passwordFormPhone,
      passwordFormEmail,
      loginNameRef,
      emailRef,
      ftCaptchaRef,
      verificationRef,
      codeRef,
      newPwdRef,
      captchaRef,
      pwdStrength,
      tab,
      isPwd,
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
