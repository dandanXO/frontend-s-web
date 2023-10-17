<template>

  <q-header class="main-header" v-if="$q.screen.lt.sm">
    <img src="../assets/images/header.png"/>
  </q-header>

  <q-page class="main-container flex flex-center">
    <div>

      <div class="top-icons">
        <img src="../assets/images/icon1.png"/>
        <img src="../assets/images/icon2.png"/>
        <img src="../assets/images/icon3.png"/>
        <img src="../assets/images/icon4.png"/>

      </div>

      <div class="btn-section flex items-center justify-center gap-30"
      >

        <div @click="loginModal" class="btn-pointer login-btn">
          <span>{{ $t('lang.login') }}</span>
        </div>

        <div @click="registerModal" class="btn-pointer register-btn">
          <span>Register</span>
        </div>

      </div>

      <img v-if="!$q.screen.lt.sm" class="btm-img" src="../assets/images/main-logo.png "/>
    </div>


  </q-page>

  <q-page-sticky class="sticky-div"
                 :position="(!$q.screen.lt.sm) ? 'bottom-left' : 'top-left' "
  >
    <img src="../assets/images/line-sticky.png"/>
  </q-page-sticky>


  <q-dialog class="login-dialog-modal" v-model="isLoginModal">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <q-space/>
        <q-btn icon="close" color="white" flat round dense v-close-popup/>
      </q-card-section>

      <q-card-section>
        <div class="main-card">
          <img src="../assets/images/login-logo.png"/>

          <h3>Log in</h3>

          <q-form class=" login-form rounded-borders q-pa-md " style="margin: 0px auto;"
          >
            <q-input
              class="login-input text-main"
              ref="loginNameRef"
              filled
              v-model="loginForm.loginName"
              :label="$t('lang.input_username')"
              :rules="[(val) => (val && val.length > 0) || $t('lang.input_username_cannot_empty')]"
              color="white"
              autocomplete="username"
              clearable
            >
            </q-input>
            <q-input
              class="login-input text-main"
              ref="passwordRef"
              filled
              v-model="loginForm.password"
              :label="$t('lang.password')"
              :type="isPwd ? 'password' : 'text'"
              :rules="[(val) => (val && val.length > 0) || $t('lang.input_password_empty')]"
              color="white"
              autocomplete="current-password"
              clearable
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template
              >
            </q-input>

            <q-input
              ref="verificationRef"
              class="verification-input"
              filled
              type="text"
              clearable
              v-model="loginForm.captchaCode"
              :label="$t('lang.verification_code')"
              :rules="[
          (val) => (val && val.length > 3) || $t('lang.input_code_empty')
        ]"
              color="white"
              @keyup.enter="onSubmit"
            >
              <template v-slot:append>
                <img :src="verificationImg" @click="getCode()"/>
              </template>
              <template v-slot:prepend>
                <q-icon name="security"/>
              </template>
            </q-input>

            <div class="row justify-end items-center">

              <div class="forget-pwd-tip" @click="goToRegister">
                {{ $t('lang.signup_now') }}
              </div>
            </div>
          </q-form>
          <div class="txt-center">
            <q-btn
              class="common-large-btn login-btn"
              @click.prevent="onSubmit"
              :label="$t('lang.login')"
              type="submit"
              color="brand"
              rounded
              size="md"
            />
          </div>

        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog class="login-dialog-modal" v-model="isRegisterModal">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <q-space/>
        <q-btn icon="close" color="white" flat round dense v-close-popup/>
      </q-card-section>

      <q-card-section>
        <div class="main-card">
          <img src="../assets/images/login-logo.png"/>

          <h3>Register</h3>

          <q-form
            class=" rounded-borders register-form"
            @submit="onSubmit"
          >
            <div class="q-gutter-y-md">
              <q-input
                ref="loginNameRef"
                filled
                v-model="regForm.loginName"
                :label="$t('lang.input_username')"
                lazy-rules
                :rules="[
              (val) => (val && val.length > 0) || $t('lang.input_username_cannot_empty'),
              (val) =>
                (val.length > 5 && val.length <= 12) ||
                $t('lang.username_between_6_12'),
              (val) =>
                val.match(/^[A-Za-z0-9]+$/) ||
                $t('lang.only_letter_number_allowed')
            ]"
                color="white"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="person_outline"/>
                </template>
              </q-input>

              <q-input
                ref="pwdRef"
                filled
                v-model="regForm.password"
                :label="$t('lang.password')"
                lazy-rules
                :type="isRegPwd ? 'password' : 'text'"
                :rules="[
              (val) => (val && val.length > 0) || $t('lang.input_password_empty'),
              (val) =>
                (val.length > 5 && val.length <= 12) ||
                $t('lang.password_between_6_12'),
              (val) =>
                (val && (pwdStrength == 'normal' || pwdStrength == 'strong')) ||
                $t('lang.password_must_at_least_good')
            ]"
                color="white"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="lock_open"/>
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isRegPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isRegPwd = !isRegPwd"
                  />
                </template>
              </q-input>
              <div v-if="regForm.password" class="password-str-div">
            <span
              :class="{
                'weak-pwd': pwdStrength == 'weak',
                'normal-pwd': pwdStrength == 'normal',
                'strong-pwd': pwdStrength == 'strong'
              }"
            >{{ $t('lang.weak_level') }}</span
            >
                <span
                  :class="{
                'normal-pwd': pwdStrength == 'normal',
                'strong-pwd': pwdStrength == 'strong'
              }"
                >{{ $t('lang.medium_level') }}</span
                >
                <span :class="{ 'strong-pwd': pwdStrength == 'strong' }"
                >{{ $t('lang.strong_level') }}</span
                >
              </div>

              <q-input
                ref="confirmPwdRef"
                filled
                :type="isCfmPwd ? 'password' : 'text'"
                v-model="regForm.confirmPwd"
                :label="$t('lang.confirm_pass')"
                lazy-rules
                :rules="[
              (val) => (val && val.length > 0) || $t('lang.please_confirm_pass'),
              (val) => val === regForm.password || $t('lang.password_do_not_match'),
              (val) =>
                (val.length > 5 && val.length <= 12) ||
                $t('lang.password_between_6_12')
            ]"
                color="white"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="lock_open"/>
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isCfmPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isCfmPwd = !isCfmPwd"
                  />
                </template>
              </q-input>

              <q-input
                ref="verificationRef"
                filled
                class="verification-input"
                type="text"
                v-model="regForm.captchaCode"
                :label="$t('lang.captcha_code')"
                lazy-rules
                color="white"
                :rules="[(val) => (val && val.length > 3) || $t('lang.enter_captcha_code')]"
                clearable
              >
                <template v-slot:append>
                  <img :src="verificationImg" @click="getCode()"/>
                </template>
                <template v-slot:prepend>
                  <q-icon name="security"/>
                </template>
              </q-input>

              <q-input
                ref="codeAffiliate"
                filled
                v-model="regForm.codeAffiliate"
                :label="$t('lang.affiliate_code')"
                color="white"
                :disable="hasAffiliate"
                clearable
                :hint="$t('lang.clear_data_on_exit')"
              >
                <template v-slot:prepend>
                  <q-icon name="groups"/>
                </template>
              </q-input>


              <div class="row justify-center items-center gap-8" style="margin-top: 8px;">
                <!--          <q-btn @click="step == 1" color="warning" class="common-large-btn" rounded-->
                <!--                 :label="$t('lang.back')"/>-->
                <q-btn
                  @click.prevent="onRegisterSubmit"
                  :label="$t('lang.signup_now')"
                  type="submit"
                  color="brand"
                  class="common-large-btn register-btn"
                  rounded
                />
              </div>
            </div>

          </q-form>
        </div>

        <div class="text-center q-mb-md">
          <div @click="goToLogin" class="forget-pwd-tip">
            {{ $t('lang.already_a_member_signin_now') }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>


</template>

<script setup>
import {ref, reactive, watch} from 'vue'
import {useQuasar, Platform, Notify} from "quasar";
import {useRoute, useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
import {api} from "boot/axios";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

var qs = require("qs");

const {t} = useI18n();
const $q = useQuasar();
const verificationImg = ref("");
const loginForm = reactive({
  loginName: "",
  password: "",
  captchaCode: "",
  codeId: ""
});

const regForm = reactive({
  loginName: "",
  password: "",
  confirmPwd: "",
  codeAffiliate: "",
  regHost: location.hostname,
  codeId: "",
  captchaCode: "",
});

const loginNameRef = ref();
const passwordRef = ref();
const verificationRef = ref();
const router = useRouter();
const route = useRoute();
const pwdRef = ref();
const confirmPwdRef = ref();
const isPwd = ref(true);
const isCfmPwd = ref(true);
const isRegPwd = ref(true);


const isLoginModal = ref(false);
const isRegisterModal = ref(false);

const hasAffiliate = ref(false);

const getCode = () => {
  api.get("/member/verificationCode")
    .then((res) => {
      const response = res.data;
      if (response.code === 0) {
        verificationImg.value =
          "data:image/png;base64," + response.data.img;
        loginForm.codeId = response.data.id;
        regForm.codeId = response.data.id;
      }
    })
    .catch((e) => {
    });
};

const pwdStrength = ref("");

const isValidEmail = () => {
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return emailPattern.test(regForm.email) || t('lang.invalid_email');
};

watch(
  () => regForm.password,
  () => {
    pwdStrength.value = "";

    var pwd = regForm.password;
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

const loginModal = () => {
  isLoginModal.value = true;
  getCode();
}

const goToLogin = () => {
  isRegisterModal.value = false;
  isLoginModal.value = true;
  getCode();
}
const goToRegister = () => {
  isLoginModal.value = false;
  isRegisterModal.value = true;

  getCode();
}
const registerModal = () => {
  isRegisterModal.value = true;
  getCode();
}

const onSubmit = () => {
  const fpPromise = FingerprintJS.load();
  (async () => {
    const fp = await fpPromise;
    const result = await fp.get();
    const excludes = {value: ["timezone", "timeZoneOffset"]};
    const allComponents = {...result.components};
    excludes.value.forEach((element) => {
      delete allComponents[element];
    });
    const sidParam = FingerprintJS.hashComponents(allComponents);
    loginNameRef.value.validate();
    passwordRef.value.validate();
    // verificationRef.value.validate();
    $q.loading.show({
      message: t('lang.loading')
    });
    if (
      loginNameRef.value.hasError ||
      passwordRef.value.hasError
    ) {
      $q.loading.hide();
    } else {

      var regDevice = Platform.is.mobile ? "H5" : "WEB"
      if (("standalone" in window.navigator) && window.navigator.standalone) {
        regDevice = "IOS"
      } else {
        regDevice = Platform.is.mobile ? "H5" : "WEB";
        if (Platform.is.android && Platform.is.capacitor) {
          regDevice = "ANDROID"
        }
      }

      var loginInfo= {
        loginName: loginForm.loginName.trim(),
        password: loginForm.password,
        sid: sidParam,
        captchaCode: loginForm.captchaCode,
        codeId: loginForm.codeId,
        way: regDevice
      };

      var loginStr = qs.stringify(loginInfo);

      return api.post("/member/login", loginStr).then((ret) => {
        $q.loading.hide();
        if (ret.data.code === 0) {
          var loginToken = btoa(ret.data.data);
          console.log(loginToken);
          $q.notify({
            color: "positive",
            position: "top",
            message: t('error.604'),
            icon: "check_circle_outline"
          });

          var redirectLink= process.env.REDIRECT_URL;
          window.open(redirectLink + '/logintoken/' + loginToken , "_blank");
          setTimeout(()=>{
            location.reload();
          },1000)
        } else {
          loginForm.captchaCode = "";
          getCode();
          Notify.create({
            color: "negative",
            position: "top",
            message: ret.data.message,
            icon: "report_problem"
          });
        }
      }).catch((error) => {
        loginForm.captchaCode = "";
        getCode();
        $q.loading.hide();
      });

    }
  })();
};

const onRegisterSubmit = () => {
  loginNameRef.value.validate();
  pwdRef.value.validate();
  confirmPwdRef.value.validate();
  verificationRef.value.validate();
  $q.loading.show({
    message: t('lang.loading')
  });
  var qs = require("qs");
  if (
    loginNameRef.value.hasError ||
    pwdRef.value.hasError ||
    confirmPwdRef.value.hasError ||
    verificationRef.value.hasError
  ) {
    $q.loading.hide();
  } else {
    const fpPromise = FingerprintJS.load();
    (async () => {
      const fp = await fpPromise;
      const result = await fp.get();
      const excludes = {value: ["timezone", "timeZoneOffset"]};
      const allComponents = {...result.components};
      excludes.value.forEach((element) => {
        delete allComponents[element];
      });
      const sidParam = FingerprintJS.hashComponents(allComponents);
      regForm.sid = sidParam;
      regForm.regDevice = $q.platform.is.mobile ? "H5" : "WEB";
      if (("standalone" in window.navigator) && window.navigator.standalone) {
        regForm.regDevice = "IOS"
      } else {
        regForm.regDevice = Platform.is.mobile ? "H5" : "WEB";
        if (Platform.is.capacitor && Platform.is.android) {
          regForm.regDevice = "ANDROID"
        }
      }

      if (regForm.regHost.indexOf("http://localhost") > -1) {
        regForm.regHost = "app://";
      }
      api
        .post("/member/fbRegister", qs.stringify(regForm))
        .then((ret) => {
          const res = ret.data;
          if (res.code === 0) {
            console.log(res.data);
            $q.notify({
              color: "positive",
              position: "top",
              message: t('lang.register_successful'),
              icon: "check_circle_outline"
            });
            // alert("Success");
            var loginToken = res.data;
            var redirectLink= process.env.REDIRECT_URL;
            window.open(redirectLink + '/logintoken/' + btoa(loginToken) , "_this");
            setTimeout(()=>{
              location.reload();
            },1000)
          } else {
            $q.notify({
              color: "negative",
              position: "top",
              message: res.message,
              icon: "report_problem"
            });
          }
          $q.loading.hide();
        })
        .catch((error) => {
          $q.loading.hide();
        });
      getCode();
    })();
  }
}

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


<style scoped lang="scss">

.main-header {
  background: url("../assets/images/header-bg2.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;;
  text-align: center;

  img {
    width: auto;
    max-height: 60px;
    margin: 0 auto;
  }
}

.main-container {
  background: url("../assets/images/home-bg.png");
  background-size: 100% 100%;
  text-align: center;
}

.top-icons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0px;
  margin-bottom: 10px;

  img {
    width: 23vw;
    height: auto;
    margin: auto;
  }
}

.login-btn {
  background: url("../assets/images/login-bg.png");
  background-size: 100% 100%;
  width: 200px;
  aspect-ratio: 300/60;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}

.register-btn {
  background: url("../assets/images/register-bg.png");
  background-size: 100% 100%;
  width: 200px;
  aspect-ratio: 300/60;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}

.btn-section {
  margin: 10px auto;
}

.btm-img {
  max-width: 600px;
  margin-bottom: 40px;
}

.sticky-div {
  img {
    padding-bottom: 150px;
  }
}

@media (max-width: 991px) {

  .q-page-sticky {
    img {
      width: 18vw;
      max-width: 160px;
    }
  }

  .btm-img {
    width: 75vw;

  }


}

@media (max-width: 768px) {

  .btm-img {
    width: 60vw;

  }

}

@media (max-width: 600px) {
  .main-container {
    background: url("../assets/images/mobile-bg.png");
  }

  .top-icons {
    display: grid !important;
    align-items: center;
    justify-content: center;
    grid-template-columns: repeat(2, 1fr);

    img {
      width: 39vw;
      height: auto;
      margin: auto;
    }
  }

  .q-page-sticky {
    img {
      width: 18vw;
      max-width: 150px;
      padding-top: 20px;
    }
  }


}

@media (max-width: 480px) {

  .btn-section {
    flex-direction: column;
    gap: 18px;
  }

  .q-page-sticky {
    img {
      width: 20vw;
      max-width: 150px;
    }
  }

}


</style>
