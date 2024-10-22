<template>
  <q-page class="">
    <template v-if="!isEmailSent">
      <div class="fgtpwd-tabs-div">
        <div class="fgtpwd-item" @click="goToTab('tabSms')" :class="fgtpwdTab === 'tabSms' ? 'is-active' : ''">
          <span>{{ $t("lang.recover_password_by_phone_number") }}</span>
        </div>

        <div class="fgtpwd-item" @click="goToTab('tabEmail')" :class="fgtpwdTab === 'tabEmail' ? 'is-active' : ''">
          <span>{{ $t("lang.recover_password_by_email") }}</span>
        </div>

        <div class="fgtpwd-item" @click="goToTab('tabAcc')" :class="fgtpwdTab === 'tabAcc' ? 'is-active' : ''">
          <span>{{ $t("lang.recover_account_by_email") }}</span>
        </div>
      </div>

      <!-- <div class="text-orange q-px-md" v-if="fgtpwdTab === 'tabSms'">
        请提供您的用户名以及手机号码，我们会立即将新的密码发送到您的邮箱。
      </div>

      <div class="text-orange q-px-md" v-if="fgtpwdTab === 'tabEmail'">
        请提供您的用户名以及邮箱地址，我们会立即将新密码发送至您的注册邮箱。
      </div> -->
    </template>

    <div class="forgetpass-board q-gutter-y-md">
      <q-form v-if="!isEmailSent" class="q-mt-xs">
        <template v-if="fgtpwdTab === 'tabSms'">
          <q-label>
            {{ $t("lang.username") }}
            <em>*</em>
          </q-label>
          <q-input rounded standout clearable v-model="passwordFormPhone.loginName" :placeholder="$t('lang.username')"
            :rules="[(val) => (val && val.length > 0) || $t('lang.please_enter_username')]" color="white"
            label-color="secondary" autocomplete="username">
            <template v-slot:prepend>
              <div class="user-icon" />
            </template>
          </q-input>

          <q-label>
            {{ $t("lang.phone_number") }}
            <em>*</em>
          </q-label>
          <q-input rounded standout clearable v-model="passwordFormPhone.phone" :placeholder="$t('lang.phone_number')"
            :rules="[(val) => (val && val.length > 0) || $t('lang.please_enter_phone_number'),
            (val) => isValidVnmPhone(val)
            ]" color="white" label-color="secondary" autocomplete="username" type="number">
            <template v-slot:prepend>
              <div style="width: 26px; display: flex; align-items: center">
                <div class="phone-icon" />
              </div>
            </template>
          </q-input>

          <q-label>
            {{ $t("lang.verification_code") }}
            <em>*</em>
          </q-label>
          <q-input ref="ftCaptchaRef" rounded standout clearable type="text" maxlength="4"
            v-model="passwordFormPhone.captchaCode" :placeholder="$t('lang.verification_code')" :rules="[
              (val) => (val && val.length > 0) || $t('lang.please_enter_verification_code'),
              (val) => (val && val.length > 3 && val.length < 5) || $t('lang.length_is_4')
            ]" color="white" label-color="brand">
            <template v-slot:append>
              <img class="veri-img" :src="verificationImg" @click="getCode" />
            </template>
            <template v-slot:prepend>
              <div class="veri-icon" />
            </template>
          </q-input>

          <div class="row justify-between items-center">
            <q-btn @click.prevent="onSubmitForgotPwd('phone')" class="common-large-btn"
              :label="$t('lang.change_password_btn')" width="100%" color="brightbtn" no-caps style="width: 100%" />
          </div>
        </template>

        <template v-if="fgtpwdTab === 'tabEmail'">
          <q-label>
            {{ $t("lang.username") }}
            <em>*</em>
          </q-label>
          <q-input rounded standout clearable v-model="passwordFormEmail.loginName" :placeholder="$t('lang.username')"
            :rules="[(val) => (val && val.length > 0) || $t('lang.please_enter_username')]" color="white"
            label-color="secondary" autocomplete="username">
            <template v-slot:prepend>
              <div class="user-icon" />
            </template>
          </q-input>

          <q-label>
            {{ $t("lang.email") }}
            <em>*</em>
          </q-label>
          <q-input rounded standout clearable v-model="passwordFormEmail.email" :placeholder="$t('lang.email')"
            :rules="[(val) => (val && val.length > 0) || $t('lang.please_enter_email'), isValidEmail]" color="white"
            label-color="secondary" autocomplete="username">
            <template v-slot:prepend>
              <div style="width: 26px; display: flex; align-items: center">
                <div class="mail-icon" />
              </div>
            </template>
          </q-input>

          <q-label>
            {{ $t("lang.verification_code") }}
            <em>*</em>
          </q-label>
          <q-input ref="ftCaptchaRef" rounded standout clearable type="text" maxlength="4"
            v-model="passwordFormEmail.captchaCode" :placeholder="$t('lang.verification_code')" :rules="[
              (val) => (val && val.length > 0) || $t('lang.please_enter_verification_code'),
              (val) => (val && val.length > 3 && val.length < 5) || $t('lang.length_is_4')
            ]" color="white" label-color="brand">
            <template v-slot:append>
              <img class="veri-img" :src="verificationImg" @click="getCode" />
            </template>
            <template v-slot:prepend>
              <div class="veri-icon" />
            </template>
          </q-input>

          <div class="row justify-between items-center">
            <q-btn @click.prevent="onSubmitForgotPwd('email')" class="common-large-btn"
              :label="$t('lang.change_password_btn')" no-caps width="100%" color="brightbtn" style="width: 100%" />
          </div>
        </template>

        <template v-if="fgtpwdTab === 'tabAcc'">
          <q-label>
            {{ $t("lang.email") }}
            <em>*</em>
          </q-label>
          <q-input rounded standout clearable v-model="passwordFormEmail.email" :placeholder="$t('lang.email')"
            :rules="[(val) => (val && val.length > 0) || $t('lang.please_enter_email'), isValidEmail]" color="white"
            label-color="secondary">
            <template v-slot:prepend>
              <div style="width: 26px; display: flex; align-items: center">
                <div class="mail-icon" />
              </div>
            </template>
          </q-input>

          <q-label>
            {{ $t("lang.verification_code") }}
            <em>*</em>
          </q-label>
          <q-input ref="ftCaptchaRef" rounded standout clearable type="text" maxlength="4"
            v-model="passwordFormEmail.captchaCode" :placeholder="$t('lang.verification_code')" :rules="[
              (val) => (val && val.length > 0) || $t('lang.please_enter_verification_code'),
              (val) => (val && val.length > 3 && val.length < 5) || $t('lang.length_is_4')
            ]" color="white" label-color="brand">
            <template v-slot:append>
              <img class="veri-img" :src="verificationImg" @click="getCode" />
            </template>
            <template v-slot:prepend>
              <div class="veri-icon" />
            </template>
          </q-input>

          <div class="row justify-between items-center">
            <q-btn @click.prevent="onSubmitForgotPwd('acc')" class="common-large-btn"
              :label="$t('lang.change_password_btn')" no-caps width="100%" color="brightbtn" style="width: 100%" />
          </div>
        </template>
      </q-form>

      <div v-if="isEmailSent" class="text-blue q-px-md">{{ $t("lang.email_sent_txt") }}</div>
      <q-form v-if="isEmailSent" class="q-gutter-y-md rounded-borders">
        <q-input ref="codeRef" filled hide-bottom-space v-model="verificationForm.code" :label="$t('lang.otp_code')"
          lazy-rules clearable :rules="[(val) => (val && val.length > 0) || $t('lang.please_enter_otp')]">
          <template v-slot:prepend>
            <q-icon name="qr_code" />
          </template>
        </q-input>

        <q-input ref="newPwdRef" :type="isPwd ? 'password' : 'text'" filled hide-bottom-space
          v-model="verificationForm.newPassword" :label="$t('lang.new_password')" clearable lazy-rules :rules="[
            (val) => (val && val.length > 0) || $t('lang.please_enter_new_password'),
            (val) => (val.length > 5 && val.length <= 12) || $t('lang.password_length_is_6_to_12'),
            (val) =>
              (val && (pwdStrength == 'normal' || pwdStrength == 'strong')) ||
              $t('lang.password_security_level_must_be_at_least_good')
          ]">
          <template v-slot:prepend>
            <q-icon name="lock_open" />
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
            {{ $t("lang.password_weak") }}
          </span>
          <span :class="{
            'normal-pwd': pwdStrength == 'normal',
            'strong-pwd': pwdStrength == 'strong'
          }">
            {{ $t("lang.password_good") }}
          </span>
          <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">{{ $t("lang.password_strong") }}</span>
        </div>

        <q-input ref="captchaRef" filled hide-bottom-space type="text" v-model="verificationForm.captchaCode"
          :label="$t('lang.verification_code')" lazy-rules
          :rules="[(val) => (val && val.length > 3) || $t('lang.please_enter_verification_code')]">
          <template v-slot:append>
            <img :src="verificationImg" @click="getCode()" />
          </template>
          <template v-slot:prepend>
            <q-icon name="security" />
          </template>
        </q-input>

        <div class="row justify-between items-center">
          <q-btn @click.prevent="onVerifyForgotPassword" :label="$t('lang.change_password_btn')" no-caps width="100%"
            class="common-large-btn" color="brightbtn" style="width: 100%" />
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
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "LoginPage",
  setup() {
    onActivated(() => {
      getCode();

      isEmailSent.value = false;
    });
    const { t } = useI18n();
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
        .get("/member/verificationEasyCode")
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
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: e.message,
          //   icon: "report_problem"
          // });
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
      return emailPattern.test(passwordFormEmail.email) || t("lang.email_valid");
    };
    const isValidVnmPhone = (val) => {
      const phonePattern =
        /^0\d{9}$/;
      return phonePattern.test(val) || t("lang.phone_not_valid");
    }

    var qs = require("qs");
    const route = useRoute();
    const router = useRouter();
    const isEmailSent = ref(false);
    const isEmailSending = ref(false);
    const onSubmitForgotPwd = (method) => {
      if (method === "email") {
        $q.loading.show({
          message: t("lang.verification_code_sending")
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
              message: "OTP đã được gửi thành công ",
              icon: "check_circle_outline"
            });
          })
          .catch((error) => {
            $q.loading.hide();
          });
        getCode();
      } else if (method === "phone") {
        $q.loading.show({
          message: t("lang.verification_code_sending")
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
              message: "OTP đã được gửi thành công",
              icon: "check_circle_outline"
            });
          })
          .catch((error) => {
            $q.loading.hide();
          });
        getCode();
      } else if (method === "acc") {
        $q.loading.show({
          message: t("lang.verification_code_sending")
        });
        api
          .post("/otp/findAccount", qs.stringify(passwordFormEmail))
          .then((response) => {
            if (response.code === 0) {
              // isEmailSent.value = true;
              // SessionStorage.set("emailCodeId", response.data.codeId);
              passwordFormEmail.email = "";

              $q.notify({
                color: "positive",
                position: "top",
                message: t("lang.account_sent_to_email"),
                icon: "check_circle_outline"
              });
            }
            $q.loading.hide();
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
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: t("lang.password_reset_complete"),
                  icon: "check_circle_outline"
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
      isValidVnmPhone,
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
.page-header {
  background-image: linear-gradient(to right, #de4545, #db7e42);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 26px;
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
  margin: 10px auto 30px;
  background: $white;
  border-radius: 10px;
  box-shadow: $shadow-bg;
  padding: 16px 12px 25px;

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

.login-form-container {
  width: $box-width;
  margin: 0 auto;
  background: $white;
  border-radius: 10px;
  box-shadow: 0px -8px 8px 0px #c3d4e6 inset;
  padding: 15px 12px 20px;

  q-label {
    padding-top: 3px;
    padding-left: 8px;
    padding-bottom: 3px;
    color: $font-2;
    font-size: 1rem;

    em {
      color: $negative;
    }
  }

  .q-input {
    margin-bottom: 4px;
  }

  .veri-img {
    height: 80%;
    padding-right: 6px;
    // width: 125px;
  }

  .login-via-phone-div {
    color: $primary;
    font-size: 1rem;
  }
}

.fgtpwd-tabs-div {
  cursor: pointer;
  gap: 14px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: $box-width;
  padding: 1rem 0.9rem 1rem;
  margin: 10px auto;
  background: $white;
  box-shadow: $shadow-bg;
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
</style>
