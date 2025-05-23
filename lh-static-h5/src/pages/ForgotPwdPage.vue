<template>
  <q-page class="forgot-pass-container">
    <template v-if="!isEmailSent">
      <div class="fgtpwd-tabs-div">
        <div class="fgtpwd-item" @click="goToTab('tabSms')" :class="fgtpwdTab === 'tabSms' ? 'is-active' : ''">
          <span>短信找回</span>
        </div>

        <div class="fgtpwd-item" @click="goToTab('tabEmail')" :class="fgtpwdTab === 'tabEmail' ? 'is-active' : ''">
          <span>邮箱找回</span>
        </div>
      </div>

      <div class="text-orange q-px-md" v-if="fgtpwdTab === 'tabSms'">
        请提供您的用户名以及手机号码，我们会立即将新的密码发送到您的邮箱。
      </div>

      <div class="text-orange q-px-md" v-if="fgtpwdTab === 'tabEmail'">
        请提供您的用户名以及邮箱地址，我们会立即将新密码发送至您的注册邮箱。
      </div>
    </template>

    <div class="forgetpass-board q-gutter-y-md">
      <q-form v-if="!isEmailSent" class="q-mt-xs">
        <template v-if="fgtpwdTab === 'tabSms'">
          <q-input standout clearable v-model="passwordFormPhone.loginName" placeholder="请输入用户名"
            :rules="[
              (val) => (val && val.length > 0) || '请输入用户名',
              (val) => (val && val.length >= 4 && val.length <= 12) || '长度要在 4-12 之间'
            ]" color="white" label-color="secondary"
            autocomplete="username">
            <template v-slot:prepend>
              <div class="input-icon-label-wrapper">
                <img class="input-icon" src="../assets/images/login/user-icon.svg" />
                <label class="input-label">用户名</label>
              </div>
            </template>
          </q-input>

          <q-input standout clearable v-model="passwordFormPhone.phone" placeholder="请输入手机号码"
            :rules="[(val) => (val && val.length > 0) || '请输入手机号码']" color="white" label-color="secondary"
            autocomplete="username">
            <template v-slot:prepend>
              <div class="input-icon-label-wrapper">
                <img class="input-icon" src="../assets/images/login/phone-icon.svg" />
                <label class="input-label">手机号码</label>
              </div>
            </template>
          </q-input>

          <q-input ref="ftCaptchaRef" standout clearable type="text" maxlength="4"
            v-model="passwordFormPhone.captchaCode" placeholder="请输入验证码" :rules="[
              (val) => (val && val.length > 0) || '请输入验证码',
              (val) => (val && val.length > 3 && val.length < 5) || '验证码长度为4个'
            ]" color="white" label-color="brand">
            <template v-slot:append>
              <img class="veri-img" :src="verificationImg" @click="getCode" />
            </template>
            <template v-slot:prepend>
              <div class="input-icon-label-wrapper">
                <img class="input-icon" src="../assets/images/login/veri-icon.svg" />
                <label class="input-label">验证码</label>
              </div>
            </template>
          </q-input>

          <div class="row justify-between items-center q-py-md">
            <q-btn @click.prevent="onSubmitForgotPwd('phone')" class="common-large-btn" label="提交" width="100%"
              color="brightbtn" style="width: 100%" />
          </div>
        </template>

        <template v-if="fgtpwdTab === 'tabEmail'">
          <q-input standout clearable v-model="passwordFormEmail.loginName" placeholder="请输入用户名"
            :rules="[
              (val) => (val && val.length > 0) || '请输入用户名',
              (val) => (val && val.length >= 4 && val.length <= 12) || '长度要在 4-12 之间'
            ]" color="white" label-color="secondary"
            autocomplete="username">
            <template v-slot:prepend>
              <div class="input-icon-label-wrapper">
                <img class="input-icon" src="../assets/images/login/user-icon.svg" />
                <label class="input-label">用户名</label>
              </div>
            </template>
          </q-input>

          <q-input standout clearable v-model="passwordFormEmail.email" placeholder="请输入邮箱"
            :rules="[(val) => (val && val.length > 0) || '请输入邮箱', isValidEmail]" color="white" label-color="secondary"
            autocomplete="username">
            <template v-slot:prepend>
              <div class="input-icon-label-wrapper">
                <img class="input-icon" src="../assets/images/login/email-icon.png" />
                <label class="input-label">邮箱</label>
              </div>
            </template>
          </q-input>

          <q-input ref="ftCaptchaRef" standout clearable type="text" maxlength="4"
            v-model="passwordFormEmail.captchaCode" placeholder="请输入验证码" :rules="[
              (val) => (val && val.length > 0) || '请输入验证码',
              (val) => (val && val.length > 3 && val.length < 5) || '验证码长度为4个'
            ]" color="white" label-color="brand">
            <template v-slot:append>
              <img class="veri-img" :src="verificationImg" @click="getCode" />
            </template>
            <template v-slot:prepend>
              <div class="input-icon-label-wrapper">
                <img class="input-icon" src="../assets/images/login/veri-icon.svg" />
                <label class="input-label">验证码</label>
              </div>
            </template>
          </q-input>

          <div class="row justify-between items-center q-py-md">
            <q-btn @click.prevent="onSubmitForgotPwd('email')" class="common-large-btn" label="提交" width="100%"
              color="brightbtn" style="width: 100%" />
          </div>
        </template>
      </q-form>

      <div v-if="isEmailSent" class="text-blue q-px-md">验证码已发送到您的{{ (fgtpwdTab === 'tabSms') ? '手机短信' : '电子邮件' }}中,
        请输入验证码和新密码。</div>
      <q-form v-if="isEmailSent" class="q-gutter-y-md">
        <q-input ref="codeRef" standout hide-bottom-space v-model="verificationForm.code" placeholder="请输入验证码"
          lazy-rules clearable :rules="[(val) => (val && val.length > 0) || '请输入验证码']">
          <template v-slot:prepend>
            <div class="input-icon-label-wrapper">
              <img class="input-icon" src="../assets/images/login/veri-icon.svg" />
              <label class="input-label">验证码</label>
            </div>
          </template>
        </q-input>
        <q-input ref="newPwdRef" :type="isPwd ? 'password' : 'text'" standout hide-bottom-space
          v-model="verificationForm.newPassword" placeholder="请输入密码" clearable lazy-rules :rules="[
            (val) => (val && val.length > 0) || '请输入密码',
            (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12',
            (val) => (val && (pwdStrength == 'normal' || pwdStrength == 'strong')) || '密码安全级别必须至少为好'
          ]">
          <template v-slot:prepend>
            <div class="input-icon-label-wrapper">
              <img class="input-icon" src="../assets/images/login/password-icon.svg" />
              <label class="input-label">新密码</label>
            </div>
          </template>
          <template v-slot:append>
            <q-icon color="bright" :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="isPwd = !isPwd" />
          </template>
        </q-input>
        <div v-if="verificationForm.newPassword" class="password-str-div">
          <span :class="{
            'weak-pwd': pwdStrength == 'weak',
            'normal-pwd': pwdStrength == 'normal',
            'strong-pwd': pwdStrength == 'strong'
          }">
            弱
          </span>
          <span :class="{
            'normal-pwd': pwdStrength == 'normal',
            'strong-pwd': pwdStrength == 'strong'
          }">
            好
          </span>
          <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">强</span>
        </div>
        <q-input ref="captchaRef" standout hide-bottom-space type="text" v-model="verificationForm.captchaCode"
          placeholder="请输入验证码" lazy-rules :rules="[(val) => (val && val.length > 3) || '请输入验证码']">
          <template v-slot:append>
            <img class="veri-img" :src="verificationImg" @click="getCode()" />
          </template>
          <template v-slot:prepend>
            <div class="input-icon-label-wrapper">
              <img class="input-icon" src="../assets/images/login/veri-icon.svg" />
              <label class="input-label">验证码</label>
            </div>
          </template>
        </q-input>

        <div class="row justify-between items-center q-py-md">
          <q-btn @click.prevent="onVerifyForgotPassword" label="提交" width="100%" class="common-large-btn"
            color="brightbtn" style="width: 100%" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, reactive, onActivated, watch } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { SessionStorage } from "quasar";
import { useNotify } from "src/hooks/notify";

export default defineComponent({
  name: "LoginPage",
  setup() {
    onActivated(() => {
      getCode();

      isEmailSent.value = false;
    });

    const notify = useNotify();

    const verificationImg = ref("");
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
      newPassword: ""
    });

    const getCode = () => {
      api
        .get("/member/verificationCode")
        .then((response) => {
          if (response.code === 0) {
            verificationImg.value = "data:image/png;base64," + response.data.img;
            passwordFormEmail.codeId = response.data.id;
            passwordFormEmail.captchaCode = "";

            passwordFormPhone.codeId = response.data.id;
            passwordFormPhone.captchaCode = "";
            ftCaptchaRef.value.resetValidation();
          }
        })
        .catch((e) => {
          // notify({
          //   type: "error",
          //          //   message: e.message,
          //          // });
        });
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
      return emailPattern.test(passwordFormEmail.email) || "请输入有效电子邮件";
    };
    var qs = require("qs");
    const route = useRoute();
    const router = useRouter();
    const isEmailSent = ref(false);
    const isEmailSending = ref(false);
    const onSubmitForgotPwd = (method) => {
      if (method === "email") {
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

            notify({
              type: "success",
              message: "请输入新密码",
            });
          })
          .catch((error) => {
            $q.loading.hide();
          });
        getCode();
      } else if (method === "phone") {
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

            notify({
              type: "success",
              message: "请输入新密码",
            });
          })
          .catch((error) => {
            $q.loading.hide();
          });
        getCode();
      }
    };
    const onVerifyForgotPassword = () => {
      codeRef.value.validate();
      newPwdRef.value.validate();
      captchaRef.value.validate();
      $q.loading.show({
        message: "提交中..."
      });
      if (codeRef.value.hasError || newPwdRef.value.hasError || captchaRef.value.hasError) {
        $q.loading.hide();
      } else {
        if (fgtpwdTab.value == "tabEmail") {
          verificationForm.codeId = SessionStorage.getItem("emailCodeId");
          verificationForm.email = passwordFormEmail.email;

          api
            .post("/otp/verifyForgetPasswordEmail", qs.stringify(verificationForm))
            .then((response) => {
              if (response.code === 0) {
                notify({
                  type: "success",
                  message: "密码修改成功",
                });

                router.push("/login");
              } else {
              }
              $q.loading.hide();
            })
            .catch((error) => {
              $q.loading.hide();
            });
          getCode();
        }

        if (fgtpwdTab.value == "tabSms") {
          verificationForm.codeId = SessionStorage.getItem("phoneCodeId");
          verificationForm.phone = passwordFormPhone.phone;

          api
            .post("/otp/verifyForgetPasswordPhone", qs.stringify(verificationForm))
            .then((response) => {
              if (response.code === 0) {
                notify({
                  type: "success",
                  message: "密码修改成功",
                });

                router.push("/login");
              } else {
              }
              $q.loading.hide();
            })
            .catch((error) => {
              $q.loading.hide();
            });
          getCode();
        }
      }
    };

    const fgtpwdTab = ref("tabSms");

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
      passwordFormPhone,
      passwordFormEmail,
      verificationForm,
      verificationImg,
      getCode,
      isValidEmail,
      isEmailSent,
      onSubmitForgotPwd,
      onVerifyForgotPassword,
      loginNameRef,
      emailRef,
      ftCaptchaRef,
      codeRef,
      newPwdRef,
      captchaRef,
      isPwd: ref(true),
      pwdStrength,
      fgtpwdTab,
      goToTab
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

<style lang="scss">
.forgot-pass-container {
  .q-field--standout .q-field__control {
    border-radius: 12px;
    background: #f7f8fb;
    box-shadow: 0px 0px 4px 0px #A9C9EA inset;
  }
}
</style>

<style lang="scss" scoped>
.veri-img {
  height: 65%;
  width: 100%;
  min-width: 40px;
  max-width: 120px;
  border-radius: 10px;
}

.forgot-pass-container {
  position: relative;
  background: url(../assets/images/login/login-bg.jpg) no-repeat top center;
  background-size: 100% auto;
  background-color: #fff;
}

.input-icon-label-wrapper {
  width: 100px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding-left: 10px;
  padding-right: 20px;

  .input-icon {
    width: 16px;
  }

  .input-label {
    font-weight: bold;
    color: #424F72;
    font-size: 16px;
  }
}

.page-header {
  background-image: linear-gradient(to right, #de4545, #db7e42);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 28px;
  text-align: center;

  padding: 10px;
  display: flex;
  gap: 20px;
  align-content: center;
  justify-content: center;
}

.verification {
  display: flex;
  padding: 10px;
}

.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgetpass-board {
  width: $box-width;
  margin: 0px auto 30px;
  border-radius: 10px;
  padding: 16px 0px 25px;

  .q-field--standout.q-field--rounded .q-field__control {
    border-radius: 12px;
  }

  q-label {
    padding-top: 3px;
    padding-left: 8px;
    padding-bottom: 3px;
    color: #424f72;
    font-size: 1rem;
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
    //border: 1px solid #fff;
    border-radius: 5px;
    background: #434343;
    color: #fff;
    width: 33%;
    text-align: center;
  }

  span.weak-pwd {
    background: var(--q-negative);
  }

  span.normal-pwd {
    background: var(--q-warning);
    color: #000;
  }

  span.strong-pwd {
    //background: linear-gradient(to right, #de4545, #db7e42) !important;
    background: var(--q-positive);
    font-weight: 600;
  }
}

.fgtpwd-tabs-div {
  cursor: pointer;
  gap: 14px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: $box-width;
  padding: 1rem 0.9rem 1rem;
  margin: 0px auto;
  border-radius: 10px;

  .fgtpwd-item {
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("../assets/images/download/inactive-tab-bg.png");
    background-size: 100% 100%;
    background-color: $secondary;
    padding: 10px;
    text-align: center;
    border-radius: 10px;

    span {
      color: $font-1;
      font-size: 1rem;
    }

    &:active {
      filter: brightness(0.9);
      transform: translate(0px, 1px);
    }

    &.is-active {
      background-image: url("../assets/images/download/active-tab-bg.png");
      background-size: 100% 100%;
      background-color: $primary;

      span {
        color: #ffffff;
        font-weight: bold;
      }
    }
  }
}

.common-large-btn {
  background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%);
  font-size: 1.2rem;
  font-weight: bold;
  color: $white;
  border-radius: 10px;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    filter: brightness(0.85);
    transform: translate(0px, 1px);
  }
}

.common-large-white-btn {
  background: linear-gradient(180deg, rgba(115, 178, 255, 0.1) 0%, rgba(57, 129, 255, 0.1) 100%);
  font-size: 1.2rem;
  font-weight: bold;
  color: #424F72;
  border-radius: 10px;
  box-shadow: none;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    filter: brightness(0.85);
    transform: translate(0px, 1px);
  }
}

.body--dark {
  .forgot-pass-container {
    background-image: url(../assets/images/login/login-bg-dark.jpg);
  }
  .fgtpwd-tabs-div {
    .fgtpwd-item {
      background-image: url("../assets/images/download/inactive-tab-bg-dark.png");
      span {
        color: $white;
      }
      &.is-active {
        background-image: url("../assets/images/download/active-tab-bg-dark.png");
      }
    }
  }

  .common-large-btn {
    background: url("../assets/images/account/primary-btn.svg") no-repeat center center;
    background-size: cover;
    box-shadow: none;
    border-radius: 4px;
    border: 1px solid #3a93ce;
    color: $white;
  }
}
</style>
