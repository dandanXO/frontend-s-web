<template>
  <div class="login-container">
    <div class="back-left">
      <router-link :to="'/'">
        <RiArrowDropLeftLine />
      </router-link>
    </div>

    <div class="logo">
      <img @click="backHome" src="../assets/logo.png" />
    </div>

    <q-tabs v-model="tab" active-color="white" indicator-color="bright" align="justify">
      <q-tab name="login" label="登录" />
      <q-tab name="register" label="注册" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="login">
        <q-form ref="loginFormRef" @submit="onSubmit">
          <div v-if="!loginType" class="q-gutter-y-md">
            <q-input
              hide-bottom-space
              ref="loginNameRef"
              v-model="loginForm.loginName"
              label="用户名"
              :rules="[(val) => (val && val.length > 0) || '请输入用户名']"
              color="white"
              label-color="brand"
              autocomplete="username"
            >
              <template v-slot:prepend>
                <q-icon style="padding-left: 6px" color="bright" name="person_outline" />
              </template>
            </q-input>

            <q-input
              ref="passwordRef"
              hide-bottom-space
              v-model="loginForm.password"
              label="用户密码"
              :type="isPwd ? 'password' : 'text'"
              :rules="[(val) => (val && val.length > 0) || '请输入用户密码']"
              color="white"
              label-color="brand"
              autocomplete="current-password"
            >
              <template v-slot:prepend>
                <q-icon style="padding-left: 6px" color="bright" name="lock_open" />
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
            <q-input
              ref="verificationRef"
              hide-bottom-space
              clearable
              type="text"
              v-model="loginForm.captchaCode"
              label="验证码"
              color="white"
              label-color="brand"
              readonly
            >
              <template v-slot:append>
                <div id="captchaContainer"></div>
                <!-- <img :src="verificationImg" @click="getCode" /> -->
              </template>
              <template v-slot:prepend>
                <q-icon style="padding-left: 6px" color="bright" name="security" />
              </template>
            </q-input>
          </div>

          <div v-if="loginType" class="q-gutter-y-md">
            <q-input
              hide-bottom-space
              ref="telephoneRef"
              v-model="phoneLoginForm.phoneNumber"
              label="电话号码"
              :rules="[(val) => (val && val.length > 0) || '请输入电话号码', isValidCnPhone]"
              color="white"
              :readonly="phoneLoginForm.smsCodeId ? true : false"
              clearable
              label-color="brand"
              autocomplete="username"
            >
              <template v-slot:prepend>
                <q-icon color="bright" name="phone" />
              </template>
            </q-input>
            <q-input
              @pressEnter="alert('ah')"
              ref="phoneVerificationRef"
              hide-bottom-space
              type="text"
              v-model="phoneLoginForm.code"
              label="短信验证码"
              clearable
              :rules="[(val) => (val && val.length > 3) || '请输入短信验证码']"
              color="white"
              label-color="brand"
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
                <q-icon color="bright" name="security" />
              </template>
            </q-input>
          </div>

          <div class="row items-center justify-between q-mt-sm">
            <div class="mui-row" :class="isCheckRmb ? 'checked' : ''">
              <q-checkbox
                rounded
                v-model="isCheckRmb"
                label="记住密码"
                size="md"
                style="font-size: 14px; color: #dcdcdc"
                checked-icon="task_alt"
                unchecked-icon="highlight_off"
                color="light-blue-4"
              />
            </div>
            <div class="align-right">
              <span @click="loginType = !loginType">
                {{ loginType ? "用户名登录" : "手机号登录" }}
              </span>
            </div>
          </div>

          <q-btn
            @click.prevent="onSubmit"
            type="submit"
            class="q-mt-lg"
            label="登录"
            width="100%"
            color="brightbtn"
            style="width: 100%"
            rounded
          />
        </q-form>

        <div class="q-pa-md text-center">
          忘记密码？
          <router-link class="forget-pwd-tip" to="/forgot-password">找回密码</router-link>
        </div>

        <div class="text-center">
          如需帮助，请
          <router-link class="forget-pwd-tip q-ml-xs cs-web-id" id="cs-web-id" to="/liveChat">联系客服</router-link>
        </div>
      </q-tab-panel>

      <q-tab-panel name="register">
        <RegisterPage />
      </q-tab-panel>
    </q-tab-panels>
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
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import RegisterPage from "../pages/RegisterPage.vue";
import qs from "qs";
import { RiArrowDropLeftLine } from "vue-remix-icons";
import { App } from "@capacitor/app";

export default defineComponent({
  name: "LoginPage",
  components: {
    RegisterPage,
    RiArrowDropLeftLine
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
      // ...(Platform.is.android && Platform.is.capacitor ? {} : { appVersion: "" })
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

    const onSubmit = () => {
      const sidParam = store.visitorId;
      const appVer = appVersionNo.value;
      (async () => {
        if (loginType.value === false) {
          loginNameRef.value.validate();
          passwordRef.value.validate();
          $q.loading.show({
            message: "登录中"
          });
          if (loginNameRef.value.hasError || passwordRef.value.hasError) {
            $q.loading.hide();
          } else {
            const validate = window?.captchaObj.getValidate();
            if (!validate) {
              $q.notify({
                color: "negative",
                position: "top",
                message: "请完成验证码",
                icon: "report_problem"
              });
              $q.loading.hide();
              return;
            }
            const loginDetails = {
              loginName: loginForm.loginName,
              password: loginForm.password,
              sid: sidParam,
              // captchaCode: loginForm.captchaCode,
              // codeId: loginForm.codeId,
              lotNumber: loginForm.lot_number,
              captchaOutput: loginForm.captcha_output,
              passToken: loginForm.pass_token,
              genTime: loginForm.gen_time,
              ...(appVersionNo.value !== null ? { appVersion: appVer } : {})
            };

            store
              .memberLogin(loginDetails)
              .then(() => {
                $q.loading.hide();
                getCode();
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
                }
              })
              .catch((error) => {
                window.captchaObj.reset();
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
            captchaId: "c0e407fcee1b1c3a51d269495cf9524c",
            language: "zh",
            nativeButton: {
              width: "calc(100vw - 160px)",
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

    const backHome = () => {
      router.push("/");
    };

    const appVersionNo = ref(null);
    const getVersionNo = async () => {
      if (store.getDeviceType() == "ANDROID") {
        const info = await App.getInfo();
        var current_version = info.version;
        appVersionNo.value = current_version;
      } else if (store.getDeviceType() == "IOS") {
        appVersionNo.value = "1.0.0";
      } else {
        appVersionNo.value = null;
      }
    };

    watch(tab, (newVal) => {
      if (newVal === "login") {
        initGeetestCaptcha();
      }
    });

    onMounted(() => {
      getCode();
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("register")) {
        tab.value = "register";
      }
      checkRememberPwd();
      initGeetestCaptcha();
      getVersionNo();
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
      appVersionNo,
      getVersionNo
    };
  }
});
</script>
<style lang="scss">
.login-container {
  position: relative;
  background: url(../assets/images/index/login-bg.png) no-repeat center center;
  background-size: cover;
  height: 100vh;

  .back-left {
    position: absolute;
    left: 6px;
    top: 6px;
    height: 40px;
    width: 40px;

    svg {
      width: 40px;
    }
  }

  .logo {
    margin: 0 auto;
    padding: 75px 0 50px;
    display: flex;
    width: 90px;

    img {
      width: 100%;
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
    color: #33bcd4;
    text-decoration: none;
  }
}

@media (min-width: 500px) {
  #captchaContainer .geetest_holder {
    width: 350px !important;
  }
}

#captchaContainer {
  width: 100%;

  .geetest_captcha {
    color: #fff;
  }

  .geetest_captcha.geetest_dark .geetest_holder .geetest_content,
  .geetest_captcha.geetest_dark.geetest_freeze_wait .geetest_holder .geetest_content {
    background-image: linear-gradient(180deg, #fff, #f4f4f4) !important;
    border-color: #333c4b;
  }

  .geetest_captcha.geetest_dark .geetest_holder .geetest_content .geetest_tip_container .geetest_tip {
    color: #424f72;
    font-family: "PingFang SC" !important;
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
    background: #2a313e;
  }
  .geetest_captcha.geetest_dark .geetest_box_wrap .geetest_box .geetest_header .geetest_title,
  .geetest_popup_wrap.geetest_dark .geetest_box_wrap .geetest_box .geetest_header .geetest_title {
    color: #a0bcd6;
  }

  .geetest_captcha.geetest_dark .geetest_box_wrap .geetest_box,
  .geetest_popup_wrap.geetest_dark .geetest_box_wrap .geetest_box {
    background: #2a313e;
  }

  .geetest_captcha.geetest_dark.geetest_freeze_wait .geetest_holder .geetest_content .geetest_gradient_bar,
  .geetest_popup_wrap.geetest_dark.geetest_freeze_wait .geetest_holder .geetest_content .geetest_gradient_bar {
    background-color: #a0bcd6;
  }

  .geetest_captcha.geetest_dark .geetest_holder .geetest_content .geetest_tip_container .geetest_tip {
    color: #409eff;
  }
  .geetest_captcha.geetest_dark .geetest_holder .geetest_mask,
  .geetest_popup_wrap.geetest_dark .geetest_holder .geetest_mask {
    background-color: #2a313e;
  }

  .geetest_captcha .geetest_holder .geetest_content .geetest_space_center {
    background-color: #2a313e;
  }
}

.q-field--standard.q-field--readonly .q-field__control:before {
  border: none;
}
</style>
