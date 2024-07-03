<template>
  <div class="login-container">
    <div class="home-header">
      <div class="back-left">
        <router-link :to="'/'">
          <img class="left-back" src="../assets/images/common/left-back-icon.svg" />
        </router-link>
      </div>

      <div class="header-left" @click="router.push('/')">
        <img alt="logo" src="../assets/logo-web.svg" />
      </div>

      <div class="header-lang">
        <LangOptions />
      </div>
    </div>

    <div class="login-img">
      <!-- <img src="../assets/images/login/login-img.png" />
      <div class="login-text">
        <div class="text-title">{{ $t("lang.login_title") }}</div>
        <div class="text-desc">{{ $t("lang.login_desc") }}</div>
      </div> -->
      <img :src="require(`../assets/images/login/login-img.png`)" />
    </div>

    <!--    <q-tabs v-model="tab" active-color="white" indicator-color="bright" align="justify">-->
    <!--      <q-tab name="login" label="登录" />-->
    <!--      <q-tab name="register" label="注册" />-->
    <!--    </q-tabs>-->

    <q-form ref="loginFormRef" @submit="onSubmit">
      <div class="login-form-container">
        <div v-if="!loginType" class="">
          <!-- <q-label>
            {{ $t("lang.username") }}
            <em>*</em>
          </q-label> -->
          <q-input
            rounded
            standout
            dense
            clearable
            ref="loginNameRef"
            v-model="loginForm.loginName"
            :placeholder="$t('lang.username')"
            :rules="[
              (val) => (val && val.length > 0) || $t('lang.please_enter_username'),
              (val) => (val && val.length >= 6 && val.length <= 12) || $t('lang.length_between_6_12')
            ]"
            color="white"
            label-color="secondary"
            autocomplete="username"
          >
            <template v-slot:prepend>
              <img src="../assets/images/login/user-icon.png" width="24" />
            </template>
          </q-input>

          <!-- <q-label>
            {{ $t("lang.password") }}
            <em>*</em>
          </q-label> -->
          <q-input
            ref="passwordRef"
            rounded
            standout
            dense
            clearable
            v-model="loginForm.password"
            :placeholder="$t('lang.password')"
            :type="isPwd ? 'password' : 'text'"
            :rules="[(val) => (val && val.length > 0) || $t('lang.please_type_the_password')]"
            color="white"
            label-color="brand"
            autocomplete="current-password"
          >
            <template v-slot:prepend>
              <img src="../assets/images/login/password-icon.png" width="24" />
            </template>
            <template v-slot:append>
              <q-icon
                color="dark"
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <!-- <q-label>
            {{ $t("lang.verification_code") }}
            <em>*</em>
          </q-label> -->
          <q-input
            ref="verificationRef"
            rounded
            standout
            dense
            clearable
            type="text"
            maxlength="4"
            v-model="loginForm.captchaCode"
            :placeholder="$t('lang.verification_code')"
            :rules="[
              (val) => (val && val.length > 0) || $t('lang.please_enter_verification_code'),
              (val) => (val && val.length > 3 && val.length < 5) || $t('lang.length_is_4')
            ]"
            color="white"
            label-color="brand"
          >
            <template v-slot:append>
              <img class="veri-img" :src="verificationImg" @click="getCode" />
            </template>
            <template v-slot:prepend>
              <img src="../assets/images/login/veri-icon.png" width="24" />
            </template>
          </q-input>
        </div>

        <div v-if="loginType">
          <!-- <q-label>
            {{ $t("lang.phone_number") }}
            <em>*</em>
          </q-label> -->
          <q-input
            ref="telephoneRef"
            v-model="phoneLoginForm.phoneNumber"
            :placeholder="$t('lang.phone_number')"
            :rules="[(val) => (val && val.length > 0) || $t('lang.please_enter_phone_number')]"
            color="white"
            :readonly="phoneLoginForm.smsCodeId ? true : false"
            clearable
            autocomplete="username"
            rounded
            type="number"
            standout
            dense
          >
            <template v-slot:prepend>
              <q-icon color="bright" name="phone" />
            </template>
          </q-input>
          <q-label>
            {{ $t("lang.verification_code") }}
            <em>*</em>
          </q-label>
          <q-input
            @pressEnter="alert('ah')"
            ref="phoneVerificationRef"
            type="text"
            v-model="phoneLoginForm.code"
            :placeholder="$t('lang.verification_code')"
            clearable
            :rules="[(val) => (val && val.length > 3) || $t('lang.verification_code_empty')]"
            color="white"
            rounded
            standout
            dense
          >
            <template v-slot:append>
              <q-btn
                size="md"
                color="brightbtn"
                :label="$t('lang.verification_code_send')"
                @click="toggleInnerCode"
                style="white-space: nowrap"
              />
            </template>
            <template v-slot:prepend>
              <q-icon color="bright" name="security" />
            </template>
          </q-input>
        </div>

        <div class="row items-center justify-between q-mt-xs">
          <div :class="isCheckRmb ? 'checked' : ''">
            <q-checkbox
              rounded
              v-model="isCheckRmb"
              :label="$t('lang.remember_me')"
              size="xs"
              checked-icon="task_alt"
              unchecked-icon="highlight_off"
              color="#FD574C"
            />
          </div>

          <!-- <div class="login-via-phone-div">
            <span @click="loginType = !loginType">
              {{ loginType ? $t("lang.username_login") : $t("lang.phone_login") }}
            </span>
          </div> -->

          <div class="text-center">
            <router-link class="forget-pwd-tip" to="/forgot-password">{{ $t("lang.forgot_password") }}</router-link>
          </div>
        </div>
      </div>
      <div class="bottom-btn-list">
        <q-btn
          @click.prevent="onSubmit"
          type="submit"
          class="common-large-btn bottom-btn"
          :label="$t('lang.login_btn')"
          color="brightbtn"
          no-caps
          rounded
        />
        <div>
          <q-btn
            @click="goToRegister"
            class="common-large-white-btn bottom-btn"
            :label="$t('lang.register_btn')"
            no-caps
            rounded
          />
        </div>
      </div>
      <div class="text-center q-pb-lg">
        <router-link class="cs-web-id" id="cs-web-id" to="/liveChat">
          {{ $t("lang.contact_customer_service") }}
        </router-link>
      </div>
    </q-form>

    <!-- <div class="login-bottom-div">
      <img src="../assets/images/login/login-banner.png" />
    </div> -->
  </div>

  <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss>
    <q-card width="100%">
      <q-card-section class="q-pa-md bg-brightbtn text-white">
        <q-toolbar>
          <q-toolbar-title>{{ $t("lang.captcha_code") }}</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-card-section>
      <div class="q-px-lg q-pt-sm q-pb-lg">
        <q-card-section class="q-mb-md q-pa-md">
          <q-input v-model="innerCaptchaRef" :placeholder="$t('lang.enter_captcha_code')">
            <template v-slot:append>
              <img
                :src="phoneVerificationImg"
                :title="$t('lang.captcha_refresh')"
                style="margin-top: 6px; cursor: pointer"
                @click="getInnerCode"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-btn @click="sendOtpSms" no-caps :label="$t('lang.verification_code_send')" color="brightbtn" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, onActivated } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import LangOptions from "components/LangOptions";
import qs from "qs";
import { useI18n } from "vue-i18n";
import { App } from "@capacitor/app";
import { i18nStore } from "src/router/language";
import { storeToRefs } from "pinia";
import { isAndroid } from "src/boot/utils";
import { useUI } from "stores/ui";

export default defineComponent({
  name: "LoginPage",
  components: {
    LangOptions
  },
  setup() {
    const i18nStoreLanguage = i18nStore();
    const { languageVal } = storeToRefs(i18nStoreLanguage);
    const { t } = useI18n();
    const tab = ref("login");
    const loginType = ref(false);
    const store = userStore();
    const verificationImg = ref("");
    const loginForm = reactive({
      loginName: "",
      password: "",
      captchaCode: "",
      codeId: ""
    });
    const phoneLoginForm = reactive({
      phoneNumber: "",
      code: "",
      smsCodeId: ""
    });
    const $q = useQuasar();
    const loginFormRef = ref();
    const loginNameRef = ref();
    const passwordRef = ref();
    const verificationRef = ref();
    const router = useRouter();
    const route = useRoute();
    const getCode = () => {
      api
        .get("/member/verificationEasyCode")
        .then((response) => {
          if (response.code === 0) {
            verificationImg.value = "data:image/png;base64," + response.data.img;
            loginForm.codeId = response.data.id;
          }
        })
        .catch((e) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: e.message,
            icon: "report_problem"
          });
        });
    };

    const isCheckRmb = ref(false);

    const phoneVerificationRef = ref();
    const telephoneRef = ref();
    const phoneVerificationImg = ref("");

    const innerCaptchaRef = ref("");
    const innerCaptchaCodeId = ref("");
    const showCaptchaDialog = ref(false);
    const toggleInnerCode = () => {
      telephoneRef.value.validate();
      if (!telephoneRef.value.hasError) {
        showCaptchaDialog.value = true;
        getInnerCode();
      }
    };

    const isValidCnPhone = () => {
      const phonePattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      return phonePattern.test(phoneLoginForm.phoneNumber) || "请输入有效的电话号码";
    };

    const getInnerCode = () => {
      api
        .get("/member/verificationEasyCode")
        .then((response) => {
          if (response.code === 0) {
            phoneVerificationImg.value = "data:image/png;base64," + response.data.img;
            innerCaptchaCodeId.value = response.data.id;
            innerCaptchaRef.value = "";
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const sendOtpSms = () => {
      if (!phoneLoginForm.phoneNumber) {
        $q.notify({
          color: "negative",
          position: "top",
          message: "手机号码不能为空",
          icon: "report_problem"
        });
        return;
      }
      api
        .post(
          `/otp/sendSms`,
          qs.stringify({
            telephone: phoneLoginForm.phoneNumber,
            captchaCode: innerCaptchaRef.value,
            codeId: innerCaptchaCodeId.value
          })
        )
        .then((res) => {
          getCode();
          let message = res.message || "发送手机验证码成功",
            color = "positive";

          if (res.code === 0) {
            showCaptchaDialog.value = false;
            phoneLoginForm.smsCodeId = res.data.codeId;
            phoneLoginForm.code = "";
            // console.log(res.data.codeId);
          } else {
            color = "negative";
            getInnerCode();
          }

          if (message) {
            $q.notify({ message, color });
          }

          // console.log("onCaptchaSubmit", res);
        })
        .catch(() => {
          console.log("Err");
          getInnerCode();
        });
    };

    const goRegister = () => {
      router.push("/register");
    };

    const onSubmit = () => {
      const sidParam = store.visitorId;

      (async () => {

        const appVer = appVersionNo.value;

        if (loginType.value === false) {
          loginNameRef.value.validate();
          passwordRef.value.validate();
          verificationRef.value.validate();
          $q.loading.show({
            message: t("lang.logging_in")
          });
          if (loginNameRef.value.hasError || passwordRef.value.hasError || verificationRef.value.hasError) {
            $q.loading.hide();
          } else {
            store
              .memberLogin({
                loginName: loginForm.loginName,
                password: loginForm.password,
                sid: store.googleadid ? store.googleadid : store.aaid ? store.aaid : sidParam,
                captchaCode: loginForm.captchaCode,
                codeId: loginForm.codeId,
                ...(Platform.is.android && Platform.is.capacitor ? { appVersion: appVer } : {})
              })
              .then(() => {
                $q.loading.hide();
                sessionStorage.removeItem("REFERRAL_CODE");

                // FB tracking :: login-success
                if (store.isAffiliateA) {
                  fbq("track", "login-success");
                }

                if (isCheckRmb.value) {
                  localStorage.setItem(
                    "userpass",
                    JSON.stringify({
                      loginName: loginForm.loginName,
                      password: loginForm.password
                    })
                  );
                } else {
                  localStorage.removeItem("userpass");
                }

                loginFormRef.value.reset();

                if (store.hasToken()) {
                  const jumpUrl = route.query.redirect ? route.query.redirect : "/";
                  router.go(jumpUrl);
                }
              })
              .catch((error) => {
                loginForm.captchaCode = "";
                getCode();
                $q.loading.hide();
              });
          }
        } else {
          telephoneRef.value.validate();
          phoneVerificationRef.value.validate();
          if (telephoneRef.value.hasError || phoneVerificationRef.value.hasError) {
            $q.loading.hide();
          } else {
            if (!phoneLoginForm.smsCodeId) {
              $q.notify({
                color: "negative",
                position: "top",
                message: t("lang.personal_mobilenumber_verify"),
                icon: "report_problem"
              });
              return;
            }
            $q.loading.show({
              message: t("lang.logging_in")
            });
            store
              .memberLoginviaPhone({
                phoneNumber: phoneLoginForm.phoneNumber,
                sid: store.googleadid ? store.googleadid : store.aaid ? store.aaid : sidParam,
                code: phoneLoginForm.code,
                smsCodeId: phoneLoginForm.smsCodeId
              })
              .then(() => {
                $q.loading.hide();
                sessionStorage.removeItem("REFERRAL_CODE");
                loginFormRef.value.reset();
                if (store.hasToken()) {
                  const jumpUrl = route.query.redirect ? route.query.redirect : "/";
                  router.go(jumpUrl);
                }
              })
              .catch((error) => {
                $q.loading.hide();
              });
          }
        }
      })();
    };

    const checkRememberPwd = () => {
      const d = localStorage.getItem("userpass");
      let rememberJson = JSON.parse(d);
      if (rememberJson) {
        isCheckRmb.value = true;
        loginForm.loginName = rememberJson.loginName;
        loginForm.password = rememberJson.password;
      }
    };

    const backHome = () => {
      router.push("/");
    };

    const appVersionNo = ref("");
    const getVersionNo = async () => {
      if (Platform.is.android && Platform.is.capacitor) {
        const info = await App.getInfo();
        appVersionNo.value = info.version + "." + info.build;
      }
    };

    const ui = useUI();

    const trackRegisterClickEvent = () => {
      if (ui.adjust_click_register_event && isAndroid()) {
        console.log("Track Click Reg");
        var adjustEvent = new AdjustEvent(ui.adjust_click_register_event);
        Adjust.trackEvent(adjustEvent);
      }
    };

    const goToRegister = () => {
      trackRegisterClickEvent();
      router.push("/register");
    };

    onMounted(() => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("register")) {
        tab.value = "register";
      }
      checkRememberPwd();
      getVersionNo();
    });
    onActivated(() => {
      getCode();
    });

    return {
      header: "Login",
      loginNameRef,
      passwordRef,
      verificationRef,
      verificationImg,
      loginForm,
      loginFormRef,
      onSubmit,
      goRegister,
      store,
      isPwd: ref(true),
      tab,
      loginType,
      backHome,
      isCheckRmb,
      getCode,
      phoneLoginForm,
      sendOtpSms,
      innerCaptchaRef,
      innerCaptchaCodeId,
      showCaptchaDialog,
      toggleInnerCode,
      phoneVerificationRef,
      phoneVerificationImg,
      getInnerCode,
      isValidCnPhone,
      telephoneRef,
      LangOptions,
      appVersionNo,
      getVersionNo,
      languageVal,
      trackRegisterClickEvent,
      ui,
      goToRegister
    };
  }
});
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  background: url(../assets/images/login/login-bg.png) no-repeat center 20%;
  // height: 100%;
  // min-height: 100vh;
    background-size: contain;
    background-position: center -30px;

  .back-left {
    // position: absolute;
    // left: 6px;
    // top: 20px;
    height: 30px;
    width: 30px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: brightness(100);
    img {
      width: 10px;

      @media (max-width: 400px) {
        width: 8px;
      }
    }
  }

  .logo {
    // margin: 0 auto;
    margin-left: 50px;
    padding-top: 12px;
    display: flex;
    width: 115px;

    @media (max-width: 400px) {
      width: 80px;
    }

    img {
      width: 100%;
    }
  }

  .login-h2 {
    width: 200px;
    text-align: center;
    margin: 0 auto 10px;

    img {
      width: 100%;
    }
  }

  .login-img {
    // padding: 0 0px 16px 0px;
    // display: flex;
    // justify-content: center;
    // position: relative;
    height: 20vh;
    min-height: 140px;
    img {
      // display: block;
      // width: 110%;
      // margin-right: -15%;
      display: none;
    }

    .login-text {
      position: absolute;
      bottom: 20px;
      left: 0;
      text-align: center;
      width: 100%;
      background: linear-gradient(180deg, rgba(228, 242, 253, 0.1) 0%, #f3f7fd 100%);
      padding: 16px;
    }
    .text-title {
      font-size: 24px;
      color: #ffffff;
      font-weight: 800;
    }
    .text-desc {
      font-size: 14px;
      color: #ffffff;
    }
  }

  .q-tabs {
    background: rgba(113, 125, 146, 0.2);
    border-radius: 30px;
    width: 80%;
    margin: 0 auto;
  }

  .q-tab {
    min-height: 40px;
  }

  .q-tab__content {
    width: 100%;
  }

  .q-tab--active .q-tab__indicator {
    height: 100%;

    border-radius: 30px;
  }

  .q-tab__label {
    z-index: 1;
  }

  .q-tab-panels {
    background: none;
    padding: 10px;
  }

  .align-right {
    text-align: right;
    color: #acacac;
    margin-top: 0px;
  }

  .forget-pwd-tip {
    color: $font-1;
    font-size: 1rem;
    text-decoration: none;
  }

  .login-form-container {
    width: $box-width;
    margin: 0 auto;
    background: $white;
    color: #333333;
    border-radius: 10px;
    box-shadow: 0px -8px 8px 0px #E6C3C3 inset;
    padding: 15px 12px 15px;
    
.q-field__prepend {

img {
  filter: hue-rotate(140deg);
}
}
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

  .bottom-btn-list {
    margin: 10px auto;
    width: $box-width;
    // padding: 0 16px;
    box-sizing: border-box;
  }

  .bottom-btn {
    width: 100%;
    margin: 10px auto 10px;
  }

  .cs-web-id {
    color: $primary;
    font-size: 1rem;
  }

  .login-bottom-div {
    width: 100%;
    margin-top: 10px;

    img {
      width: 100%;
    }
  }
}

.checked {
  color: #FD574C;
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: $box-width;
  margin: 0 auto 16px;
  padding: 4px;

  .header-left {
    // height: 50px;
    // margin-right: auto;
    // margin-left: 12px;

    // @media (max-width: 400px) {
    // height: 40px;
    // }

    img {
      // height: 100%;
      // width: auto;
      width: 100%;
      max-width: 135px;
      opacity: 0;
    }
  }

  .header-middle {
    margin-left: auto;
    margin-right: 12px;
    margin-top: 3px;
    display: flex;
    gap: 12px;

    :deep(.q-btn) {
      min-height: 12px;
      font-weight: bold;
      @media (max-width: 400px) {
        font-size: 80%;
      }
    }
  }

  .header-lang {
    // .lang-container {
    //   img {
    //     display: block;
    //     width: 30px;
    //     height: 30px;
    //   }

    //   :deep(.q-field__marginal) {
    //     min-height: 40px;
    //     height: 40px;
    //     display: none;
    //   }

    //   :deep(.q-field__native) {
    //     min-height: 30px;
    //     height: 30px;
    //     padding: 0;
    //   }
    // }
  }

  .header-right {
    height: 25px;
    position: relative;

    img {
      height: 100%;
      width: auto;
    }

    .red-dot {
      height: 10px;
      width: 10px;
      background: #db0011;
      border-radius: 50%;
      position: absolute;
      top: -3px;
      right: -3px;
    }
  }
}
</style>

<style lang="scss">
.q-select__dialog {
  label {
    img {
      width: 30px;
      height: 30px;
    }
    display: none;
  }
}
</style>
