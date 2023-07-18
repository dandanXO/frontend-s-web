<template>
  <div class="login-container">
    <div class="top-image-div">
      <img src="../assets/login/login-top.png"/>
    </div>

    <div class="login-tab-div">
      <q-tabs
          v-model="tab"
          active-color="white"
          indicator-color="dark"
          align="justify"
          class="bg-dyblue"
      >
        <q-tab name="login" label="登录"/>
        <q-tab name="register" label="注册"/>
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login" class="form-container">
          <q-form ref="loginFormRef" @submit="onSubmit">
            <div v-if="!loginType" class="q-gutter-y-md">
              <q-input
                  height="32px"
                  rounded
                  standout
                  bg-color="grey-2"
                  hide-bottom-space
                  ref="loginNameRef"
                  v-model="loginForm.loginName"
                  placeholder="用户名"
                  :rules="[(val) => (val && val.length > 0) || '请输入用户名']"
                  label-color=""
                  autocomplete="username"
              >
                <template v-slot:prepend>
                  <img src="../assets/login/user-icon.png" width="18"/>
                </template>
                <template v-slot:append>
                  <img @click="clearLoginName" src="../assets/login/input-close-icon.png" style="margin-right:3px;" width="20"/>
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
                  placeholder="请输入用户密码"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[(val) => (val && val.length > 0) || '请输入用户密码']"
                  label-color=""
                  clearable
                  autocomplete="current-password"
              >
                <template v-slot:prepend>
                  <img src="../assets/login/pass-icon.png" width="18"/>
                </template>
                <template v-slot:append>
                  <img v-if="!isPwd" @click="isPwd = !isPwd" src="../assets/login/eye-line.png" style="margin-right:3px;" width="20"/>
                  <img v-if="isPwd" @click="isPwd = !isPwd" src="../assets/login/eye-close-line.png" style="margin-right:3px;" width="20"/>

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
                  <img :src="verificationImg" @click="getCode"/>
                </template>
                <template v-slot:prepend>
                  <img src="../assets/login/veri-icon.png" width="18"/>
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
                  :readonly="(phoneLoginForm.smsCodeId) ? true : false"
                  placeholder="电话号码"
                  :rules="[(val) => (val && val.length > 0) || '请输入电话号码']"
                  color="white"
                  autocomplete="username"
              >
                <template v-slot:prepend>
                  <q-icon color="dark" class="material-icons-outlined" name="phone"/>
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
                      size="md"
                      color="brightbtn"
                      label="发送验证码"
                      @click="toggleInnerCode"
                      style="white-space: nowrap"
                  />
                </template>
                <template v-slot:prepend>
                  <img src="../assets/login/veri-icon.png" width="18"/>
                </template>
              </q-input>
            </div>

            <div class="forgetpass-div">
              <div class="align-right">
                  <span @click="loginType = !loginType">
                  {{ loginType ? '用户名登录' : '手机号登录' }}
                  </span>
              </div>

              <div class="mui-row" :class="isCheckRmb ? 'checked' : ''">
                <q-checkbox
                    rounded
                    v-model="isCheckRmb"
                    label="记住密码"
                    size="md"
                    style="font-size: 14px;"
                    checked-icon="task_alt"
                    unchecked-icon="highlight_off"
                    color="light-blue-9"
                />
              </div>
            </div>

            <q-btn
                @click.prevent="onSubmit"
                type="submit"
                class="q-mt-lg"
                label="登录"
                width="100%"
                color="primary"
                style="width: 100%;letter-spacing: 2px;"
                size="16px"
                rounded
            />
          </q-form>

        </q-tab-panel>

        <q-tab-panel name="register" class="form-container">
          <RegisterPage @changeTab="changeLoginTab"/>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <div class="login-bottom-section">
      <div class="row justify-center items-center full-width q-mb-lg">
        <router-link class="txt-tip" to="/">
          <div class="row items-center gap-8">
            <img src="../assets/login/home-icon.png"/>
            <span>先去逛逛</span>
          </div>
        </router-link>

        <div class="mid-gap">&nbsp;</div>

        <router-link class="txt-tip" to="/forgot-account">
          <div class="row items-center gap-8">
            <img src="../assets/login/lock-icon.png"/>
            <span>忘记密码</span>
          </div>
        </router-link>
      </div>

      <div class="text-center">
        如需帮助，请
        <router-link class="txt-link q-ml-xs" to="/liveChat">联系客服</router-link>
      </div>


    </div>

    <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss>
      <q-card width="100%">
        <q-card-section
            style="padding: 10px 5px"
            class="q-pa-md bg-dyblue text-white"
        >
          <q-toolbar>
            <q-toolbar-title>验证码</q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close"/>
          </q-toolbar>

        </q-card-section>
        <div style="padding: 20px">
          <q-card-section class="q-mb-md q-pa-md">
            <q-input
                ref="refinnerCaptchaRef"
                :rules="[(val) => (val && val.length > 3 && val.length < 5) || '请输入验证码']"
                v-model="innerCaptchaRef" label="验证码">
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
          <q-btn @click="sendOtpSms" label="发送验证码" color="brightbtn"/>
        </div>
      </q-card>
    </q-dialog>


  </div>


</template>

<script>
/* eslint-disable */
import {defineComponent, ref, reactive, onMounted} from "vue";
import {userStore} from "stores/index";
import {api} from "boot/axios";
import {useQuasar, Platform} from "quasar";
import {useRoute, useRouter} from "vue-router";
import RegisterPage from "../pages/RegisterPage.vue";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
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
              verificationImg.value =
                  "data:image/png;base64," + response.data.img;
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

    const clearLoginName= () => {
      loginForm.loginName='';
      loginFormRef.value.reset();
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
        if (loginType.value === false) {
          loginNameRef.value.validate();
          passwordRef.value.validate();
          verificationRef.value.validate();
          $q.loading.show({
            message: "登录中"
          });
          if (
              loginNameRef.value.hasError ||
              passwordRef.value.hasError ||
              verificationRef.value.hasError
          ) {
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
                    const jumpUrl = route.query.redirect
                        ? route.query.redirect
                        : "/";
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
          if (
              telephoneRef.value.hasError ||
              phoneVerificationRef.value.hasError
          ) {
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

                  phoneLoginForm.value.reset();

                  if (store.hasToken()) {
                    const jumpUrl = route.query.redirect ? route.query.redirect : "/";
                    router.go(jumpUrl);
                    if (Platform.is.capacitor && Platform.is.ios) {
                      location.reload()
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

    }

    const getInnerCode = () => {
      api
          .get("/member/verificationCode")
          .then((response) => {
            if (response.code === 0) {
              phoneVerificationImg.value =
                  "data:image/png;base64," + response.data.img;
              innerCaptchaCodeId.value = response.data.id;
              innerCaptchaRef.value = "";
            }
          })
          .catch((e) => {
            console.log(e)
          });
    }

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

      api.post(`/otp/sendSms`, qs.stringify({
        telephone: phoneLoginForm.phoneNumber,
        captchaCode: innerCaptchaRef.value,
        codeId: innerCaptchaCodeId.value
      }))
          .then(res => {
            getCode();
            let message = res.message || '发送手机验证码成功',
                color = 'positive'

            if (res.code === 0) {
              showCaptchaDialog.value = false
              phoneLoginForm.smsCodeId = res.data.codeId;
              phoneLoginForm.code = "";
              console.log(res.data.codeId)
            } else {
              color = 'negative';
              getInnerCode();
            }


            if (message) {
              $q.notify({message, color});
            }

            console.log('onCaptchaSubmit', res)
          }).catch(() => {
        console.log("Err");
        getInnerCode();
      })
    }

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
      clearLoginName
    };
  }
});
</script>
<style lang="scss">
.login-container {
  min-height: 100vh;

  .top-image-div {
    width: 100%;

    img {
      width: 100%;
    }
  }

  .login-tab-div {
    background: #fff;
    padding: 30px 20px 40px;
    border-radius: 20px;
    position: relative;
    top: -35px;
    box-shadow: 0px 4px 32px 0px rgba(0, 0, 0, 0.5);
  }

  .q-tab {
    min-height: 46px;
    background: #EEE;
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
    box-shadow: 5px 5px 5px 0 rgba(66, 91, 186, 0.2);
  }

  .form-container {
    width: 100%;
    margin: auto;
    padding: 16px 8px;

    > .q-tab-panel {

    }

    .q-field__control {
      height: 45px;

      .q-field__marginal {
        height: 45px;
      }
    }
  }

  .login-bottom-section {
    padding-bottom: 60px;

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
    background: #0089ED;
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
    // color: #acacac;
    color: #333;
    margin-left: 4px;
  }

  .txt-tip {
    color: #434343;
    text-decoration: none;
  }


  .forgetpass-div {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 4px);
    margin: 14px auto 0px;
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
        color: #0089ED;
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
      color: #0089ED;
    }
  }


}

.q-toolbar {
  background: transparent;
}
</style>
