<template>
  <div class="login-container" :class="{ slot: ui.edition === EDITION.SLOT }">
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
    </div>

    <q-form ref="loginFormRef" @submit="onSubmit">
      <div class="login-form-container">
        <div v-if="!loginType" class="">
          <q-input rounded standout dense clearable ref="loginNameRef" v-model="loginForm.loginName"
            :placeholder="$t('lang.username')" :rules="[
              (val) => (val && val.length > 0) || $t('lang.please_enter_username'),
              (val) => (val && val.length >= 6 && val.length <= 12) || $t('lang.length_between_6_12')
            ]" color="white" label-color="secondary" autocomplete="username">
            <template v-slot:prepend>
              <div class="user-icon" />
            </template>
          </q-input>

          <q-input ref="passwordRef" rounded standout dense clearable v-model="loginForm.password"
            :placeholder="$t('lang.password')" :type="isPwd ? 'password' : 'text'"
            :rules="[(val) => (val && val.length > 0) || $t('lang.please_type_the_password')]" color="white"
            label-color="brand" autocomplete="current-password">
            <template v-slot:prepend>
              <div class="password-icon" />
            </template>
            <template v-slot:append>
              <q-icon color="dark" :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="isPwd = !isPwd" />
            </template>
          </q-input>

          <q-input ref="verificationRef" rounded standout dense clearable type="text" maxlength="4"
            v-model="loginForm.captchaCode" :placeholder="$t('lang.verification_code')" :rules="[
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
        </div>

        <div class="row items-center justify-between q-mt-xs">
          <div :class="isCheckRmb ? 'checked' : ''">
            <q-checkbox rounded v-model="isCheckRmb" :label="$t('lang.remember_me')" size="xs" checked-icon="task_alt"
              unchecked-icon="highlight_off" color="light-blue-4" />
          </div>

          <div class="text-center">
            <router-link class="forget-pwd-tip" to="/forgot-password">{{ $t("lang.forgot_password") }}</router-link>
          </div>
        </div>
      </div>
      <div class="bottom-btn-list">
        <q-btn @click.prevent="onSubmit" type="submit" class="common-large-btn bottom-btn" :label="$t('lang.login_btn')"
          color="brightbtn" no-caps rounded />
        <div>
          <q-btn @click="goToRegister" class="common-large-white-btn bottom-btn" :label="$t('lang.register_btn')"
            no-caps rounded />
        </div>
      </div>
      <div class="text-center q-pb-lg">
        <router-link class="cs-web-id" id="cs-web-id" to="/liveChat">
          {{ $t("lang.contact_customer_service") }}
        </router-link>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onActivated } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import LangOptions from "components/LangOptions";
import { useI18n } from "vue-i18n";
import { App } from "@capacitor/app";
import { isAndroid } from "src/boot/utils";
import { useUI } from "stores/ui";
import { EDITION } from "src/constant/edition";

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
const isPwd = ref(true);
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

const appVersionNo = ref("");
const getVersionNo = async () => {
  if (Platform.is.android && Platform.is.capacitor) {
    const info = await App.getInfo();
    appVersionNo.value = info.version;
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
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  background: url(../assets/images/login/login-bg-new.jpg) no-repeat center 0%;
  background-size: 100% auto;

  &.slot {
    background-image: url(../assets/images/login/login-bg-slot.jpg);
  }

  .back-left {
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

  .login-img {
    height: 25vh;
    min-height: 160px;

    img {
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
      color: #333333;
      font-weight: 800;
    }

    .text-desc {
      font-size: 14px;
      color: #424f72;
    }
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
    border-radius: 10px;
    box-shadow: 0px -8px 8px 0px #c3d4e6 inset;
    padding: 15px 12px 15px;

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
  color: #0089ed;
}

.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: $box-width;
  margin: 0 auto 16px;
  padding: 4px;

  .header-left {

    img {
      width: 100%;
      max-width: 135px;
      opacity: 0;
    }
  }
}
</style>
