<template>
  <div class="login-container">
    <div class="back-left">
      <router-link :to="'/'">
        <img class="back-left-img" :src="$q.dark.isActive
          ? require('../assets/images/common/left-back-icon-dark.svg')
          : require('../assets/images/common/left-back-icon.svg')
          " />
      </router-link>
    </div>

    <div class="login-content">
      <div class="logo">
        <img class="logo-img" @click="backHome" src="../assets/images/login/logo-login.png" />
      </div>

      <img class="login-banner-img" src="../assets/images/login/login-banner.jpg" />

      <q-form ref="loginFormRef" @submit="onSubmit">
        <div v-if="!loginType">
          <q-input standout clearable ref="loginNameRef" v-model="loginForm.loginName" placeholder="请输入用户名" :rules="[
            (val) => (val && val.length > 0) || '请输入用户名',
            (val) => (val && val.length >= 6 && val.length <= 12) || '长度要在 6-12 之间'
          ]" autocomplete="username">
            <template v-slot:prepend>
              <div class="input-icon-label-wrapper">
                <img class="input-icon" src="../assets/images/login/user-icon.svg" />
                <label class="input-label"><em>*</em>用户名</label>
              </div>
            </template>
          </q-input>

          <q-input ref="passwordRef" standout clearable v-model="loginForm.password" placeholder="请输入密码"
            :type="isPwd ? 'password' : 'text'" :rules="[(val) => (val && val.length > 0) || '请输入用户密码']" color="white"
            label-color="brand" autocomplete="current-password">
            <template v-slot:prepend>
              <div class="input-icon-label-wrapper">
                <img class="input-icon" src="../assets/images/login/password-icon.svg" />
                <label class="input-label"><em>*</em>密码</label>
              </div>
            </template>
            <template v-slot:append>
              <q-icon color="dark" :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="isPwd = !isPwd" />
            </template>
          </q-input>

          <q-input ref="verificationRef" standout clearable type="text" maxlength="4" v-model="loginForm.captchaCode"
            placeholder="请输入验证码" :rules="[
              (val) => (val && val.length > 0) || '请输入验证码',
              (val) => (val && val.length > 3 && val.length < 5) || '验证码长度为4个'
            ]" color="white" label-color="brand">
            <template v-slot:append>
              <img class="veri-img" :src="verificationImg" @click="getCode" />
            </template>
            <template v-slot:prepend>
              <div class="input-icon-label-wrapper">
                <img class="input-icon" src="../assets/images/login/veri-icon.svg" />
                <label class="input-label"><em>*</em>验证码</label>
              </div>
            </template>
          </q-input>
        </div>

        <div v-if="loginType">
          <q-input ref="telephoneRef" v-model="phoneLoginForm.phoneNumber" placeholder="请输入电话号码"
            :rules="[(val) => (val && val.length > 0) || '请输入电话号码', isValidCnPhone]" color="white"
            :readonly="phoneLoginForm.smsCodeId ? true : false" clearable autocomplete="username" standout>
            <template v-slot:prepend>
              <div class="input-icon-label-wrapper">
                <img class="input-icon" src="../assets/images/login/phone-icon.svg" />
                <label class="input-label">电话号码</label>
              </div>
            </template>
          </q-input>

          <q-input @pressEnter="alert('ah')" ref="phoneVerificationRef" type="text" v-model="phoneLoginForm.code"
            placeholder="短信验证码" clearable :rules="[(val) => (val && val.length > 3) || '请输入短信验证码']" color="white"
            standout>
            <template v-slot:append>
              <q-btn size="md" color="brightbtn" label="发送验证码" @click="toggleInnerCode" style="white-space: nowrap" />
            </template>
            <template v-slot:prepend>
              <div class="input-icon-label-wrapper">
                <img class="input-icon" src="../assets/images/login/veri-icon.svg" />
                <label class="input-label">验证码</label>
              </div>
            </template>
          </q-input>
        </div>

        <div class="row items-center justify-between">
          <div class="login-via-phone-div">
            <span @click="loginType = !loginType">
              {{ loginType ? "用户名登录" : "手机号登录" }}
            </span>
          </div>

          <div class="text-center">
            <router-link class="forget-pwd-tip" to="/forgot-password">忘记密码</router-link>
          </div>
        </div>

        <div class="q-py-md">
          <q-btn @click.prevent="onSubmit" type="submit" class="common-large-btn bottom-btn" label="登录"
            color="brightbtn" flat />
          <router-link to="/register">
            <q-btn class="common-large-white-btn bottom-btn" flat label="注册" />
          </router-link>
        </div>
      </q-form>
    </div>

    <div class="text-center q-pt-lg customer-service-link">
      <div class="decor-lines" />
      <router-link class="cs-web-id" id="cs-web-id" to="/liveChat">
        <img width="18" src="../assets/images/login/cs-icon.svg" />联系客服
      </router-link>
      <div class="decor-lines" />
    </div>
  </div>

  <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss>
    <q-card width="100%">
      <q-card-section class="q-pa-md bg-brightbtn text-white">
        <q-toolbar>
          <q-toolbar-title>验证码</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-card-section>
      <div class="q-px-lg q-pt-sm q-pb-lg">
        <q-card-section class="q-mb-md q-pa-md">
          <q-input v-model="innerCaptchaRef" placeholder="验证码">
            <template v-slot:append>
              <img :src="phoneVerificationImg" title="点击刷新验证码" style="margin-top: 6px; cursor: pointer"
                @click="getInnerCode" />
            </template>
          </q-input>
        </q-card-section>
        <q-btn @click="sendOtpSms" label="发送验证码" color="brightbtn" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, onActivated } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import qs from "qs";

export default defineComponent({
  name: "LoginPage",
  components: {},
  setup() {
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
        .get("/member/verificationCode")
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
        .get("/member/verificationCode")
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
        if (loginType.value === false) {
          loginNameRef.value.validate();
          passwordRef.value.validate();
          verificationRef.value.validate();
          $q.loading.show({
            message: "登录中"
          });
          if (loginNameRef.value.hasError || passwordRef.value.hasError || verificationRef.value.hasError) {
            $q.loading.hide();
          } else {
            store
              .memberLogin({
                loginName: loginForm.loginName,
                password: loginForm.password,
                sid: sidParam,
                captchaCode: loginForm.captchaCode,
                codeId: loginForm.codeId,
                summoner: loginForm.summoner
              })
              .then(() => {
                $q.loading.hide();
                sessionStorage.removeItem("REFERRAL_CODE");
                sessionStorage.removeItem("SUMMON_CODE");

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
                message: "请验证手机码",
                icon: "report_problem"
              });
              return;
            }
            $q.loading.show({
              message: "登录中"
            });
            store
              .memberLoginviaPhone({
                phoneNumber: phoneLoginForm.phoneNumber,
                sid: sidParam,
                code: phoneLoginForm.code,
                smsCodeId: phoneLoginForm.smsCodeId,
                summoner: loginForm.summoner
              })
              .then(() => {
                $q.loading.hide();
                sessionStorage.removeItem("REFERRAL_CODE");
                sessionStorage.removeItem("SUMMON_CODE");
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

    const getSummonCode = () => {
      const summonCode = sessionStorage.getItem("SUMMON_CODE");
      // && route.query && route.query.refer
      if (summonCode) {
        loginForm.summoner = summonCode;
      }
    };
    onMounted(() => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("register")) {
        tab.value = "register";
      }
      checkRememberPwd();
    });
    onActivated(() => {
      getCode();
      getSummonCode();
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
      telephoneRef
    };
  }
});
</script>

<style lang="scss">
.login-container {
  .q-field--standout .q-field__control {
    border-radius: 8px;
    background: #f7f8fb;
    box-shadow: 0px 0px 4px 0px #A9C9EA inset;
    height: 44px;
  }

  .q-field__marginal{
    height: 44px;
  }

  .q-input{
    height: 68px;
  }

  .q-field__bottom{
    padding: 0px 12px 8px;
  }
}
</style>

<style scoped lang="scss">
.login-container {
  position: relative;
  background: url(../assets/images/login/login-bg.jpg) no-repeat top center;
  background-size: 100% auto;
  background-color: #fff;
  height: 100%;
  min-height: 100dvh;
  flex-direction: column;
  display: flex;
  padding: 20px;
  gap: 10px;
  justify-content: space-between;

  .back-left {
    position: absolute;
    left: 6px;
    top: 20px;
    height: 40px;
    width: 40px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;

    .back-left-img {
      width: 14px;
    }
  }

  .login-content {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .logo {
      margin: 0 auto;
      display: flex;
      width: 125px;

      .logo-img {
        width: 100%;
      }
    }

    .login-banner-img {
      width: 100%;
      border-radius: 10px;
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
        display:flex;
        align-items: center;
        gap: 5px;

        em{
          line-height: 22px;
          color: #f53434;
          display: inline-block;
          padding-top: 2px;
        }
      }
    }

    .veri-img {
      height: 65%;
      width: 100%;
      min-width: 40px;
      max-width: 120px;
      border-radius: 10px;
    }

    .login-via-phone-div {
      color: $primary;
      font-size: 1rem;
      font-weight: bold;
    }

    .forget-pwd-tip {
      color: $font-1;
      font-size: 1rem;
      text-decoration: none;
    }

    .bottom-btn {
      width: 100%;
      margin: 10px auto 10px;
    }
  }

  .customer-service-link {
    display: flex;
    align-items: center;
    justify-content: center;

    .decor-lines {
      width: 80px;
      height: 1px;
      background-color: #7a80a1;
      margin: 0 20px;
    }

    .cs-web-id {
      color: $primary;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #7A80A1;
      font-weight: bold;
    }
  }
}

.body--dark {
  .login-container {
    background: url(../assets/images/login/login-bg-dark.jpg) no-repeat top center;
    background-size: 100% auto;
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
</style>
