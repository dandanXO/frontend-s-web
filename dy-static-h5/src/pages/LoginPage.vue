<template>
  <div class="login-container">
    <div style="height: 48px; text-align: center;">
      <img src="../assets/login/login-logo.png" height="100%" />
    </div>

    <div class="top-image-div">
      <img src="../assets/login/login-top-bg.png" />
    </div>

    <div style="padding: 15px 20px;">
      <img src="../assets/login/login-top.png" width="100%" />
    </div>

    <div class="login-tab-div">
      <!-- <q-tabs v-model="tab" active-color="white" indicator-color="dark" align="justify" class="bg-dyblue">
        <q-tab name="login" label="登录" />
        <q-tab name="register" label="注册" />
      </q-tabs> -->

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login" class="form-container">
          <q-form ref="loginFormRef" @submit="onSubmit">
            <div v-if="!loginType" class="q-gutter-y-md">
              <q-input
                height="32px"
                rounded
                standout
                bg-color="#A9C9EA"
                hide-bottom-space
                ref="loginNameRef"
                v-model="loginForm.loginName"
                placeholder="合营登录"
                :rules="[(val) => (val && val.length > 0) || '请输入用户名']"
                label-color=""
                autocomplete="username"
              >
                <template v-slot:prepend>
                  <img src="../assets/login/user-icon.svg" width="14" />
                  <span style="color: #424F72; font-size: 14px; margin-left: 8px;">账号</span>
                </template>
                <template v-slot:append>
                  <img
                    @click="clearLoginName"
                    src="../assets/login/input-close-icon.png"
                    style="margin-right: 3px"
                    width="20"
                  />
                </template>
              </q-input>

              <q-input
                height="32px"
                rounded
                standout
                bg-color="grey-2"
                ref="passwordRef"
                hide-bottom-space
                v-model="loginForm.password"
                placeholder="登录"
                :type="isPwd ? 'password' : 'text'"
                :rules="[(val) => (val && val.length > 0) || '请输入用户密码']"
                label-color=""
                autocomplete="current-password"
              >
                <template v-slot:prepend>
                  <img src="../assets/login/pass-icon.svg" width="14" />
                  <span style="color: #424F72; font-size: 14px; margin-left: 8px;">密码</span>
                </template>
                <template v-slot:append>
                  <img
                    v-if="loginForm.password"
                    @click="clearPwName"
                    src="../assets/login/input-close-icon.png"
                    style="margin-right: 3px"
                    width="20"
                  />

                  <img
                    v-if="!isPwd"
                    @click="isPwd = !isPwd"
                    src="../assets/login/eye-line.png"
                    style="margin-right: 3px"
                    width="20"
                  />
                  <img
                    v-if="isPwd"
                    @click="isPwd = !isPwd"
                    src="../assets/login/eye-close-line.png"
                    style="margin-right: 3px"
                    width="20"
                  />
                </template>
              </q-input>
              <q-input
                height="32px"
                rounded
                standout
                bg-color="grey-2"
                ref="verificationRef"
                hide-bottom-space
                type="text"
                v-model="loginForm.captchaCode"
                placeholder="请输入验证码"
                :rules="[(val) => (val && val.length > 3 && val.length < 5) || '验证码应为四个字符串']"
                label-color=""
              >
                <template v-slot:append>
                  <img :src="verificationImg" @click="getCode" />
                </template>
                <template v-slot:prepend>
                  <img src="../assets/login/pass-icon.svg" width="14" />
                  <span style="color: #424F72; font-size: 14px; margin-left: 8px;">验证码</span>
                </template>
              </q-input>
            </div>

            <div v-if="loginType" class="q-gutter-y-md">
              <q-input
                height="32px"
                rounded
                standout
                bg-color="grey-2"
                hide-bottom-space
                clearable
                ref="telephoneRef"
                v-model="phoneLoginForm.phoneNumber"
                :readonly="phoneLoginForm.smsCodeId ? true : false"
                placeholder="电话号码"
                :rules="[(val) => (val && val.length > 0) || '请输入电话号码']"
                color="white"
                autocomplete="username"
              >
                <template v-slot:prepend>
                  <q-icon color="dark" class="material-icons-outlined" name="phone" />
                </template>
              </q-input>
              <q-input
                @pressEnter="alert('ah')"
                ref="phoneVerificationRef"
                height="32px"
                rounded
                standout
                bg-color="grey-2"
                hide-bottom-space
                type="text"
                v-model="phoneLoginForm.code"
                placeholder="短信验证码"
                :rules="[(val) => (val && val.length > 3) || '请输入短信验证码']"
              >
                <template v-slot:append>
                  <q-btn
                    size="20px"
                    color="brightbtn"
                    label="发送验证码"
                    @click="toggleInnerCode"
                    style="white-space: nowrap"
                  />
                </template>
                <template v-slot:prepend>
                  <img src="../assets/login/veri-icon.png" width="18" />
                </template>
              </q-input>
            </div>

            <div class="forgetpass-div">
              <router-link class="txt-tip align-right" to="/forgot-account">
                <span>
                  忘记密码?
                </span>
              </router-link>

              <div class="mui-row" :class="isCheckRmb ? 'checked' : ''">
                <q-checkbox
                  v-model="isCheckRmb"
                  label="记住密码"
                  size="20px"
                  style="font-size: 14px"
                  color="light-blue-9"
                />
              </div>
            </div>

            <q-btn
              @click.prevent="onSubmit"
              type="submit"
              class="q-mt-md"
              label="登录"
              width="100%"
              style="width: 100%; letter-spacing: 2px; margin-top: 40px; background: linear-gradient(180deg, #73B2FF 0%, #3981FF 100%); color: white;"
              size="16px"
            />

            <q-btn
              @click.prevent="tab = 'register'"
              type="button"
              class="q-mt-md"
              label="注册"
              width="100%"
              color="white"
              text-color="#4A4A4A"
              style="width: 100%; letter-spacing: 2px; box-shadow: 0px -2px 4px 0px #5A9DFF80 inset;"
              size="16px"
            />
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="register" class="form-container">
          <RegisterPage @changeTab="changeLoginTab" />
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <div class="login-bottom-section">
      <div class="row justify-center items-center full-width q-mb-md" v-show="tab === 'login'">
        <router-link class="txt-tip" to="/">
          <div class="row items-center gap-8">
            <img src="../assets/login/home-icon.svg" width="16px" />
            <span style="color: #458BFF;">先去逛逛</span>
          </div>
        </router-link>
      </div>

      <div class="row justify-center items-center full-width q-mb-md">
        <router-link class="txt-tip" to="/liveChat">
          <div style="width: 60px; height: 1px; background-color: #7A80A199"></div>
          <div class="row items-center gap-8">
            <img src="../assets/login/service-icon.svg" width="16px" />
            <span>联系客服</span>
          </div>
          <div style="width: 60px; height: 1px; background-color: #7A80A199"></div>
        </router-link>
      </div>
    </div>

    <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss>
      <q-card width="100%">
        <q-card-section style="padding: 10px 5px" class="q-pa-md bg-dyblue text-white">
          <q-toolbar>
            <q-toolbar-title>验证码</q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar>
        </q-card-section>
        <div style="padding: 20px">
          <q-card-section class="q-mb-md q-pa-md">
            <q-input
              ref="refinnerCaptchaRef"
              :rules="[(val) => (val && val.length > 3 && val.length < 5) || '请输入验证码']"
              v-model="innerCaptchaRef"
              label="验证码"
            >
              <template v-slot:append>
                <img
                  :src="phoneVerificationImg"
                  title="点击刷新验证码"
                  style="margin-top: 6px; cursor: pointer"
                  @click="getInnerCode"
                />
              </template>
            </q-input>
          </q-card-section>
          <q-btn @click="sendOtpSms" label="发送验证码" color="brightbtn" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { defineComponent, ref, reactive, onMounted } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import RegisterPage from "../pages/RegisterPage.vue";
import qs from "qs";

export default defineComponent({
  name: "LoginPage",
  components: {
    RegisterPage
  },
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

    const refinnerCaptchaRef = ref();
    const phoneVerificationRef = ref();
    const telephoneRef = ref();
    const phoneVerificationImg = ref("");

    const innerCaptchaRef = ref("");
    const innerCaptchaCodeId = ref("");
    const showCaptchaDialog = ref(false);

    const router = useRouter();
    const route = useRoute();
    const getCode = () => {
      api
        .get("/member/verificationCode")
        .then((response) => {
          if (response.code === 0) {
            verificationImg.value = "data:image/png;base64," + response.data.img;
            loginForm.codeId = response.data.id;
            loginForm.captchaCode = "";
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

    const clearLoginName = () => {
      loginForm.loginName = "";
      loginFormRef.value.reset();
    };

    const clearPwName = () => {
      loginForm.password = "";
      loginFormRef.value.reset();
    };

    const onSubmit = () => {
      (async () => {
        const sidParam = store.visitorId;
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
                codeId: loginForm.codeId
              })
              .then(() => {
                $q.loading.hide();
                sessionStorage.removeItem("REFERRAL_CODE");

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
                  if (Platform.is.capacitor && Platform.is.ios) {
                    location.reload();
                  }
                } else {
                  getCode();
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
          $q.loading.show({
            message: "登录中"
          });
          if (telephoneRef.value.hasError || phoneVerificationRef.value.hasError) {
            $q.loading.hide();
          } else {
            store
              .memberLoginviaPhone({
                phoneNumber: phoneLoginForm.phoneNumber,
                sid: sidParam,
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
                  if (Platform.is.capacitor && Platform.is.ios) {
                    location.reload();
                  }
                }
              })
              .catch((error) => {
                $q.loading.hide();
              });
          }
        }
      })();
    };

    const changeLoginTab = () => {
      tab.value = "login";
    };

    const toggleInnerCode = () => {
      telephoneRef.value.validate();
      if (!telephoneRef.value.hasError) {
        showCaptchaDialog.value = true;
        getInnerCode();
      }
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
      if (refinnerCaptchaRef.value.hasError) {
        $q.notify({
          color: "negative",
          position: "top",
          message: "验证码错误",
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
            console.log(res.data.codeId);
          } else {
            color = "negative";
            getInnerCode();
          }

          if (message) {
            $q.notify({ message, color });
          }

          console.log("onCaptchaSubmit", res);
        })
        .catch(() => {
          console.log("Err");
          getInnerCode();
        });
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

    onMounted(() => {
      getCode();
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("register")) {
        tab.value = "register";
      }
      checkRememberPwd();
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
      store,
      isPwd: ref(true),
      tab,
      loginType,
      getCode,
      isCheckRmb,
      changeLoginTab,
      phoneLoginForm,
      sendOtpSms,
      toggleInnerCode,
      phoneVerificationRef,
      telephoneRef,
      innerCaptchaRef,
      innerCaptchaCodeId,
      showCaptchaDialog,
      phoneVerificationImg,
      getInnerCode,
      refinnerCaptchaRef,
      clearLoginName,
      clearPwName
    };
  }
});
</script>
<style lang="scss">
.login-container {
  padding-top: 12px;
  height: fit-content;
  //min-height: 100vh;

  .top-image-div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    img {
      width: 100%;
    }
  }

  .login-tab-div {
    padding: 0px 20px;
    margin-bottom: 32px;
  }

  .q-tab {
    min-height: 36px;
    background: #eee;
    color: #333;
  }

  .q-field__native.q-placeholder {
    color: #000000;
  }

  .q-tabs {
    background: rgba(113, 125, 146, 0.2);
    border-radius: 30px;
    width: 90%;
    margin: 0 auto;
    box-shadow: 3px 3px 3px 0 rgba(66, 91, 186, 0.2);
  }

  .form-container {
    width: 100%;
    margin: auto;
    padding: 16px 0px;

    > .q-tab-panel {
    }

    .q-field__control {
      height: 45px;

      .q-field__marginal {
        height: 45px;
      }
    }
  }
  .q-field__prepend {
    padding-right: 20px;
  }

  .login-bottom-section {

    > div {
      gap: 40px;
    }

    .mid-gap {
      width: 2px;
      background: rgba(0, 0, 0, 0.5);
      filter: brightness(0.7);
      height: 16px;
    }

    span {
      color: #434343;
    }
  }

  .q-tab__content {
    width: 100%;
  }

  .q-tab--active .q-tab__indicator {
    height: 100%;
    background: #0089ed;
    //background: linear-gradient(180deg, #fd3b2a 0%, #ac260b 100%);
    border-radius: 30px;
  }

  .q-tab__label {
    z-index: 1;
  }

  .q-tab-panels {
    background: none;
  }

  .align-right {
    text-align: right;
    // color: #acacac;
    color: #333;
    margin-left: 4px;
  }

  .txt-tip {
    color: #434343;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .forgetpass-div {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 8px);
    margin: 10px auto 0px;
    gap: 10px;

    .mui-row {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 13px;
      color: #666;

      &.checked {
        color: #0089ed;
      }

      &:active {
        filter: brightness(0.8);
      }
    }

    a,
    a:visited,
    a:active,
    a:hover {
      text-decoration: none;
      color: #0089ed;
    }
  }

  .q-field--standout.q-field--rounded .q-field__control {
    border-radius: 8px;
    box-shadow: 0px 0px 2.91px 0px #A9C9EA inset;
  }

  .q-field--standout .q-field__control {
    background: #F7F8FB;
  }

  .q-checkbox__bg {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  .q-checkbox__label {
    margin-left: 8px;
  }
}

.q-toolbar {
  background: transparent;
}
</style>
