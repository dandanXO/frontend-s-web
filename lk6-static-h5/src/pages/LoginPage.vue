<template>
  <div class="login-container">
    <div style="height: 48px; text-align: center; margin: 25px 0px">
      <img src="../assets/login/login-logo.png" height="100%" />
    </div>

    <div class="top-image-div">
      <img src="../assets/login/login-top-bg.png" />
    </div>

    <!-- <div v-if="tab === 'login'" style="padding: 15px 20px">
      <img :src="loginBannerUrl" width="100%" />
    </div> -->

    <!-- <div v-if="tab === 'login'" style="padding: 15px 20px">
      <img src="../assets/login/login-top.png" width="100%" />
    </div> -->

    <div class="login-tab-div">
      <!-- <q-tabs v-model="tab" active-color="white" indicator-color="dark" align="justify" class="bg-dyblue">
        <q-tab name="login" label="登录" />
        <q-tab name="register" label="注册" />
      </q-tabs> -->

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login" class="form-container">
          <q-form ref="loginFormRef" @submit="onSubmit">
            <div class="login-form-inner-wrapper">
              <div v-if="!loginType" class="q-gutter-y-md">
                <div class="input-field-wrapper">
                  <div class="input-field__label required">用户名</div>
                  <q-input
                    height="32px"
                    rounded
                    standout
                    bg-color="#A9C9EA"
                    hide-bottom-space
                    ref="loginNameRef"
                    v-model="loginForm.loginName"
                    placeholder="请输入用户名"
                    :rules="[
                      (val) => (val && val.length > 0) || '请输入用户名',
                      (val) => (val && val.length >= 4 && val.length <= 12) || '长度要在 4-12 之间'
                    ]"
                    label-color=""
                    autocomplete="username"
                  >
                    <template v-slot:prepend>
                      <img src="../assets/login/user-icon.svg" width="14" />
                    </template>
                    <template v-slot:append>
                      <q-btn flat round @click="clearLoginName">
                        <img src="../assets/login/input-close-icon.svg" style="margin-right: 3px" width="20" />
                      </q-btn>
                    </template>
                  </q-input>
                </div>

                <div class="input-field-wrapper">
                  <div class="input-field__label required">密码</div>

                  <q-input
                    height="32px"
                    rounded
                    standout
                    bg-color="grey-2"
                    ref="passwordRef"
                    hide-bottom-space
                    v-model="loginForm.password"
                    placeholder="请输入密码"
                    :type="isPwd ? 'password' : 'text'"
                    :rules="[(val) => (val && val.length > 0) || '请输入用户密码']"
                    label-color=""
                    autocomplete="current-password"
                  >
                    <template v-slot:prepend>
                      <img src="../assets/login/pass-icon.svg" width="14" />
                    </template>
                    <template v-slot:append>
                      <q-btn v-if="loginForm.password" flat round @click="clearPwName">
                        <img src="../assets/login/input-close-icon.svg" style="margin-right: 3px" width="20" />
                      </q-btn>

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
                </div>

                <!-- <div class="input-field-wrapper">
                  <div class="input-field__label required">验证码</div>

                  <q-input
                    class="captcha-input"
                    height="32px"
                    rounded
                    standout
                    bg-color="grey-2"
                    ref="verificationRef"
                    hide-bottom-space
                    type="text"
                    v-model="loginForm.captchaCode"
                    label-color=""
                    placeholder=""
                    readonly
                  >
                    <template v-slot:append>
                      <div id="captchaContainer"></div>
                    </template>
                    <template v-slot:prepend>
                      <img src="../assets/login/veri-icon.svg" width="14" style="margin-right: 8px" />
                    </template>
                  </q-input>
                </div> -->
              </div>

              <div v-if="loginType" class="q-gutter-y-md">
                <div class="input-field-wrapper">
                  <div class="input-field__label required">手机号</div>
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
                    placeholder="请输入手机号码"
                    :rules="[(val) => (val && val.length > 0) || '请输入电话号码']"
                    color="white"
                    autocomplete="username"
                  >
                    <template v-slot:prepend>
                      <q-icon color="dark" class="material-icons-outlined" name="phone" />
                    </template>
                  </q-input>
                </div>
                <div class="input-field-wrapper">
                  <div class="input-field__label required">验证码</div>
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
                    placeholder="请输入短信验证码"
                    :rules="[(val) => (val && val.length > 3) || '请输入短信验证码']"
                  >
                    <template v-slot:append>
                      <q-btn class="verification-btn" :disable="otpCountdownCount > 0" @click="toggleInnerCode">
                        {{ otpCountdownCount <= 0 ? `发送验证码` : `已发送（${otpCountdownCount}秒)` }}
                      </q-btn>
                    </template>
                    <template v-slot:prepend>
                      <img src="../assets/login/veri-icon.png" width="21" style="margin-left: 2px" />
                    </template>
                  </q-input>
                </div>
              </div>

              <div class="forgetpass-div">
                <div class="align-right">
                  <span class="txt-tip" style="color: #0089ed" @click="loginType = !loginType">
                    {{ loginType ? "用户名登录" : "手机号登录" }}
                  </span>
                </div>

                <router-link class="txt-tip align-right" style="margin-left: auto" to="/forgot-account">
                  <span>忘记密码？</span>
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
            </div>

            <q-btn
              @click.prevent="onSubmit"
              type="submit"
              class="login-btn q-mt-md"
              label="登录"
              width="100%"
              size="16px"
              :loading="isLoading"
            />

            <q-btn
              @click.prevent="tab = 'register'"
              type="button"
              class="register-btn q-mt-md"
              label="注册"
              width="100%"
              size="16px"
              flat
            />
          </q-form>
          <div id="captcha-box" />
        </q-tab-panel>

        <q-tab-panel name="register" class="form-container">
          <RegisterPage @changeTab="changeLoginTab" />
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <div class="login-bottom-section">
      <div class="row justify-center items-center full-width q-mb-md" v-show="tab === 'login'">
        <!-- <router-link class="txt-tip" to="/">
          <div class="row items-center gap-8">
            <img src="../assets/login/home-icon.svg" width="16px" />
            <span style="color: #458bff">先去逛逛</span>
          </div>
        </router-link> -->
      </div>
      <!--  -->
      <div class="row justify-center items-center full-width q-mb-md">
        <router-link class="txt-tip" to="/liveChat">
          <!-- <div style="width: 60px; height: 1px; background-color: #7a80a199"></div> -->
          <div class="row items-center gap-8">
            <!-- <img src="../assets/login/service-icon.svg" width="16px" /> -->
            <span style="color: #458bff">联系客服</span>
          </div>
          <!-- <div style="width: 60px; height: 1px; background-color: #7a80a199"></div> -->
        </router-link>
      </div>
    </div>

    <CommonModal
      v-model="showCaptchaDialog"
      class="captcha-dialog"
      no-backdrop-dismiss
      header="验证码"
      confirm-btn-text="提交"
      @confirm="sendOtpSms"
    >
      <template #content>
        <q-input
          class="verification-code-input"
          standout
          :rules="[(val) => (val && val.length > 3 && val.length < 5) || '请输入验证码']"
          v-model="innerCaptchaRef"
          placeholder="请输入验证码"
          ref="refinnerCaptchaRef"
        >
          <template v-slot:append>
            <img class="verification-img" :src="phoneVerificationImg" title="点击刷新验证码" @click="getCode" />
          </template>
        </q-input>
      </template>
    </CommonModal>
  </div>
</template>

<script>
/* eslint-disable */
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import RegisterPage from "../pages/RegisterPage.vue";
import qs from "qs";
import { useLocalStorage } from "@vueuse/core";
import { getDevice } from "src/boot/utils";
import CommonModal from "src/components/CommonModal.vue";

export default defineComponent({
  name: "LoginPage",
  components: {
    RegisterPage,
    CommonModal
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
      codeId: "",
      summoner: null
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

    const imgURL = useLocalStorage("IMAGE_CDN", process.env.IMAGE_CDN).value + "/promo/";
    const loginBannerUrl = ref("");
    const isLoading = ref(false);

    const router = useRouter();
    const route = useRoute();

    watch(tab, (newVal) => {
      if (newVal === "login") {
        initGeetestCaptcha();
      }
    });

    // watch(
    //   () => route.path,
    //   (newPath) => {
    //     if (newPath === "/login") {
    //       window.captchaObj.reset();
    //     }
    //   }
    // );

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

    const clearLoginName = () => {
      loginForm.loginName = "";
      loginFormRef.value.reset();
    };

    const clearPwName = () => {
      loginForm.password = "";
      loginFormRef.value.reset();
    };

    const sidParam = store.visitorId;

    const onSubmit = () => {
      (async () => {
        if (loginType.value === false) {
          loginNameRef.value.validate();
          passwordRef.value.validate();
          // verificationRef.value.validate();
          const regDevice = getDevice() === "MOBILE" ? "H5" : "WEB";
          config.loginData = {
            loginName: loginForm.loginName,
            password: loginForm.password,
            sid: sidParam,
            summoner: loginForm.summoner,
            way: regDevice,
            type: "SLIDER"
          };

          window
            .initTAC("./tac", config, style)
            .then((tac) => {
              tac.init();
            })
            .catch((error) => {
              console.log("initTAC fail:", error);
            });

          // $q.loading.show({
          //   message: "登录中"
          // });
          // if (loginNameRef.value.hasError || passwordRef.value.hasError) {
          //   $q.loading.hide();
          // } else {
          //   const validate = window?.captchaObj.getValidate();
          //   if (!validate) {
          //     $q.notify({
          //       color: "negative",
          //       position: "top",
          //       message: "请完成验证码",
          //       icon: "report_problem"
          //     });
          //     $q.loading.hide();
          //     return;
          //   }
          //   store
          //     .memberLogin({
          //       loginName: loginForm.loginName,
          //       password: loginForm.password,
          //       sid: sidParam,
          //       // captchaCode: loginForm.captchaCode,
          //       // codeId: loginForm.codeId,
          //       lotNumber: loginForm.lot_number,
          //       captchaOutput: loginForm.captcha_output,
          //       passToken: loginForm.pass_token,
          //       genTime: loginForm.gen_time
          //     })
          //     .then(() => {
          //       $q.loading.hide();
          //       sessionStorage.removeItem("REFERRAL_CODE");

          //       if (isCheckRmb.value) {
          //         localStorage.setItem(
          //           "userpass",
          //           JSON.stringify({
          //             loginName: loginForm.loginName,
          //             password: loginForm.password
          //           })
          //         );
          //       } else {
          //         localStorage.removeItem("userpass");
          //       }

          //       loginFormRef.value.reset();

          //       if (store.hasToken()) {
          //         const jumpUrl = route.query.redirect ? route.query.redirect : "/";
          //         router.go(jumpUrl);
          //         if (Platform.is.capacitor && Platform.is.ios) {
          //           location.reload();
          //         }
          //       } else {
          //         getCode();
          //       }
          //     })
          //     .catch((error) => {
          //       window.captchaObj.reset();
          //       getCode();
          //       $q.loading.hide();
          //     });
          // }
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

    const otpCountdownCount = ref(0);

    const countdownOtp = () => {
      otpCountdownCount.value = 60;
      otpCountdownSchedule = setInterval(() => {
        if (otpCountdownCount.value <= 0) {
          showVerifyBtn.value = true;
          clearInterval(otpCountdownSchedule);
          return;
        }
        otpCountdownCount.value--;
      }, 1000);
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
            countdownOtp();
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

    // Dynamically load the Geetest script
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initGeetestCaptcha = async () => {
      try {
        // Step 1: Load Geetest script
        await loadScript("https://static.geetest.com/v4/gt4.js");

        // Step 2: Call your backend to get Geetest configuration (fake config for demo)
        const geetestConfig = {
          config: {
            captchaId: "dd6e127216b2108a70fbed280fbc4180",
            language: "zh",
            nativeButton: {
              width: "calc(100% - 1px)",
              height: "43px"
            },
            nextWidth: "220px",
            product: "float"
          },
          handler: captchaHandler
        };

        // Step 3: Initialize Geetest with the config
        await window.initGeetest4(geetestConfig.config, geetestConfig.handler);
      } catch (error) {
        // message.value = "Error loading Geetest!";
        console.error("Geetest loading error:", error);
      }
    };

    const captchaHandler = (captchaObj) => {
      window.captchaObj = captchaObj;
      captchaObj
        .appendTo("#captchaContainer")
        .onReady(function () {
          console.log("ready");
        })
        .onNextReady(function () {
          console.log("nextReady");
        })
        .onBoxShow(function () {
          console.log("boxShow");
          isLoading.value = true;
        })
        .onError(function (e) {
          console.log(e);
        })
        .onSuccess(function () {
          console.log("success");
          let result = window.captchaObj.getValidate();
          for (let key in result) {
            loginForm[key] = result[key];
          }
          isLoading.value = false;
        })
        .onClose(function () {
          isLoading.value = false;
        });
    };

    const config = {
      // 生成接口 (必选项,必须配置, 要符合tianai-captcha默认验证码生成接口规范)
      requestCaptchaDataUrl: `${api.defaults.baseURL}/member/getCaptcha`,
      // 验证接口 (必选项,必须配置, 要符合tianai-captcha默认验证码校验接口规范)
      validCaptchaUrl: `${api.defaults.baseURL}/member/login`,
      // 验证码绑定的div块 (必选项,必须配置)
      bindEl: "#captcha-box",
      // 验证码类型, 登陆信息
      loginData: {
        loginName: loginForm.loginName,
        password: loginForm.password,
        sid: sidParam,
        summoner: loginForm.summoner,
        type: "SLIDER"
      },
      requestHeaders: {
        Authorization: process.env.SITE
      },
      // 验证成功回调函数(必选项,必须配置)
      validSuccess: (res, c, tac) => {
        // 销毁验证码服务
        tac.destroyWindow();
        console.log("验证成功，后端返回的数据为", res);
        store.token = res.data;
        store.setToken(res.data);
        store.getMemberInfo();
        store.getBalance();
        // store.getUnreadMail();
        // 调用具体的login方法
        const jumpUrl = route.query.redirect ? route.query.redirect : "/";

        if (store.token) {
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
          router.push(jumpUrl);
        }
      },
      // 验证失败的回调函数(可忽略，如果不自定义 validFail 方法时，会使用默认的)
      validFail: (res, c, tac) => {
        console.log("验证码验证失败回调...");

        if (res.code === 800) {
          // 验证失败后重新拉取验证码
          tac.reloadCaptcha();
        } else {
          // 其他错误则关闭验证
          tac.destroyWindow();
        }
      },
      // 刷新按钮回调事件
      btnRefreshFun: (el, tac) => {
        console.log("刷新按钮触发事件...");
        tac.reloadCaptcha();
      },
      // 关闭按钮回调事件
      btnCloseFun: (el, tac) => {
        console.log("关闭按钮触发事件...");
        tac.destroyWindow();
      }
    };

    const style = {
      logoUrl: null
    };

    onMounted(() => {
      getCode();
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("register")) {
        tab.value = "register";
      }
      checkRememberPwd();
      // initGeetestCaptcha();

      api.get("/opt-session/promo/banner?category=LOGIN").then((res) => {
        loginBannerUrl.value = imgURL + res.data[0].mobileImageUrl;
      });
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
      clearPwName,
      loginBannerUrl,
      isLoading,
      otpCountdownCount
    };
  }
});
</script>
<style lang="scss">
.login-container {
  padding-top: 12px;
  height: 100dvh;
  background: url(../assets/login/login-bg.png) no-repeat center center;
  background-size: 100% 100%;
  //min-height: 100vh;
  overflow: auto;

  .top-image-div {
    margin: 0 16px 16px;
    img {
      max-width: 100%;
    }
  }

  .login-tab-div {
    padding: 0px 16px;
    margin-bottom: 32px;
  }

  .q-tab {
    min-height: 36px;
    background: #eee;
    color: #333;
  }

  .q-field__native.q-placeholder,
  .q-field__append {
    color: #424f72 !important;
    &::placeholder {
      color: #a4aabb;
      opacity: 1;
    }
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

    .captcha-input {
      .q-field__control {
        padding-right: 0;
      }
      .q-field__control-container {
        display: none;
        .col,
        .col-xs {
          flex: unset;
        }
      }
      .q-field__append.q-field__marginal {
        width: 100%;
        padding-left: 0;
      }
      .q-field__prepend.q-field__marginal > span {
        width: 56px !important;
      }
      .q-field__prepend {
        padding-right: 0;
      }
    }

    #captchaContainer {
      width: 100%;
    }

    .geetest_captcha.geetest_customTheme .geetest_holder .geetest_content,
    .geetest_popup_wrap.geetest_customTheme .geetest_holder .geetest_content,
    .q-field--standout.q-field--readonly .q-field__control:before {
      border: none;
    }

    .login-form-inner-wrapper {
      background: #ffffff80;
      border: 1px solid transparent;
      border-radius: 10px;
      padding: 24px 12px;
      backdrop-filter: blur(2px);
      border-image: linear-gradient(105.76deg, #ffffff 20.95%, #c6d9ff 100.21%) 1;
      mask: linear-gradient(black, black);
    }
    .login-btn {
      width: 100%;
      letter-spacing: 2px;
      background: radial-gradient(103.75% 103.75% at 50% -3.75%, #94c3ff 0%, #4b91f5 100%);
      border: 1px solid #ffffff;
      border-radius: 30px;
      font-weight: 600;
      color: white;
    }

    .register-btn {
      width: 100%;
      letter-spacing: 2px;
      background: linear-gradient(180deg, #f4f7fb 0%, #c5dcf8 100%);
      border-radius: 30px;
      font-weight: 600;
      color: #424f72;
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
    margin: 15px auto 0px;
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
    box-shadow: 0px 0px 5px 0px #86b8ff inset, 0px 2px 0px 0px #9ab0ff70;
  }

  .q-field--standout .q-field__control {
    background: #fff;
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

  .input-field-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    .input-field__label {
      font-size: 12px;
      color: #424f72;
      &.required {
        &::after {
          content: "*";
          color: #ff0d0d;
        }
      }
    }
  }

  .verification-btn {
    background-image: url("../assets/images/index/primary-btn.png");
    background-size: 100% 100%;
    color: #fff;
    width: 87px;
    text-align: center;
    white-space: nowrap;
    font-size: 12px;
    aspect-ratio: 87/32;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 30px;
    box-shadow: 0px -0.87px 3.47px 0px #ffffff;
    border-radius: 45.9px;
    margin-right: 5px;
  }
}

.q-toolbar {
  background: transparent;
}

#captchaContainer {
  width: 100%;

  .geetest_captcha.geetest_dark .geetest_holder .geetest_content,
  .geetest_captcha.geetest_dark.geetest_freeze_wait .geetest_holder .geetest_content {
    background-image: linear-gradient(180deg, #fff, #f4f4f4) !important;
    border-color: #dcdfe6;
  }

  .geetest_captcha.geetest_dark .geetest_holder .geetest_content .geetest_tip_container .geetest_tip {
    color: #424f72;
    font-family: "PingFang SC" !important;
  }

  .geetest_captcha.geetest_dark.geetest_lock_success .geetest_holder .geetest_content {
    // background-image: linear-gradient(180deg, #4e4e4e, 0%, #4e4e4e 100%) !important;
  }

  .geetest_captcha.geetest_dark.geetest_lock_success
    .geetest_content
    .geetest_tip_container
    .geetest_tips_wrap
    .geetest_tip {
    color: #39c522 !important;
  }

  .geetest_captcha.geetest_dark .geetest_box_wrap .geetest_box_layer .geetest_box_btn,
  .geetest_popup_wrap.geetest_dark .geetest_box_wrap .geetest_box_layer .geetest_box_btn {
    border: 1px solid #dfdfdf;
    background: #fff;
  }
  .geetest_captcha.geetest_dark .geetest_box_wrap .geetest_box .geetest_header .geetest_title,
  .geetest_popup_wrap.geetest_dark .geetest_box_wrap .geetest_box .geetest_header .geetest_title {
    color: #424f72;
  }

  .geetest_captcha.geetest_dark .geetest_box_wrap .geetest_box,
  .geetest_popup_wrap.geetest_dark .geetest_box_wrap .geetest_box {
    background: #fff;
  }

  .geetest_captcha.geetest_dark.geetest_freeze_wait .geetest_holder .geetest_content .geetest_gradient_bar,
  .geetest_popup_wrap.geetest_dark.geetest_freeze_wait .geetest_holder .geetest_content .geetest_gradient_bar {
    background-color: #ccc;
  }
}

#captcha-box {
  position: fixed;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.captcha-dialog {
  .verification-code-input {
    border-radius: 7px;
    .q-field__control {
      box-shadow: 0px 0px 2.78px 0px #a9c9ea inset;
      background-color: #f7f8fb;
    }
    .q-placeholder {
      color: #424f72;
      &::placeholder {
        color: #a4aabb;
        opacity: 1;
      }
    }
  }

  .verification-img {
    border-radius: 7px;
    cursor: pointer;
  }
}
</style>
