<template>
  <div class="login-container">
    <!-- <div class="back-left">
      <router-link :to="'/landing'">
        <q-btn dense rounded icon="arrow_back_ios_new" class="text-white q-mt-sm" />
      </router-link>
    </div> -->

    <!-- <div class="login-form-logo-img">
      <img src="../assets/55-ace-logo.png" />
    </div> -->

    <q-form ref="loginFormRef" @submit="onSubmit">
      <div v-if="!loginType" class="login-form-grid">
        <!--        <span class="login-form-field-label">Phone Number</span>-->
        <q-input
          type="tel"
          pattern="\d*"
          maxlength="11"
          hide-bottom-space
          ref="loginNameRef"
          v-model="loginForm.loginName"
          :rules="[
            (val) => (val && val.length > 0) || 'Please insert Phone number',
          ]"
          label-color="brand"
          autocomplete="username"
          outlined
          placeholder="Phone Number"
          color="white"
          class="landing-input login-form-field"
        >
          <template v-slot:prepend>
            <img class="white-svg" src="../assets/images/auth/phone.svg" />
            <span class="prepend-number">+63</span>
          </template>
        </q-input>

        <!--        <span class="login-form-field-label">Password</span>-->
        <q-input
          ref="passwordRef"
          hide-bottom-space
          v-model="loginForm.password"
          :type="isPwd ? 'password' : 'text'"
          :rules="[(val) => (val && val.length > 0) || 'Please insert password']"
          label-color="brand"
          autocomplete="current-password"
          outlined
          color="white"
          placeholder="Enter Password"
          class="landing-input login-form-field"
        >
          <template v-slot:append>
            <q-icon
              color="gray-3"
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>

          <template v-slot:prepend>
            <img class="white-svg" src="../assets/images/auth/pass.svg" />
          </template>
        </q-input>
        <!--        <q-input-->
        <!--          ref="verificationRef"-->
        <!--          hide-bottom-space-->
        <!--          clearable-->
        <!--          type="text"-->
        <!--          v-model="loginForm.captchaCode"-->
        <!--          label="Verification Code"-->
        <!--          :rules="[-->
        <!--            (val) => (val && val.length > 0) || 'Please insert verification code',-->
        <!--            (val) => (val && val.length > 3 && val.length < 5) || 'Verification code length is 4 characters'-->
        <!--          ]"-->
        <!--          label-color="brand"-->
        <!--          rounded-->
        <!--          outlined-->
        <!--          color="white"-->
        <!--          class="landing-input"-->
        <!--        >-->
        <!--          <template v-slot:append>-->
        <!--            <img :src="verificationImg" @click="getCode" />-->
        <!--          </template>-->
        <!--        </q-input>-->
      </div>

      <div class="forgot-password">
        <router-link class="form-text" to="/forgot-password">Forgot Password</router-link>
      </div>

      <!--
      <div class="row items-center justify-between q-mt-sm">
        <div class="mui-row" :class="isCheckRmb ? 'checked' : ''">
          <q-checkbox
            rounded
            v-model="isCheckRmb"
            label="Remember Me"
            size="md"
            class="rmb-checked-box"
            color="yellow"
          />
        </div>
      </div>
       -->

      <div>
        <q-btn @click.prevent="onSubmit" type="submit" class="login-btn" label="Login" rounded no-caps />
      </div>

      <!-- <div class="q-mt-sm">
        <q-btn @click="goRegister()" rounded flat no-caps class="btn-purple" label="Register" />
      </div> -->
    </q-form>

    <hr class="end-of-form-separator" />

    <div class="create-account">
      <span class="form-text">Not a member?</span>
      &nbsp;
      <router-link class="form-text" to="/register" style="color: #ae6def">Create account</router-link>
    </div>

    <div class="register-form-logo-img">
      <img src="../assets/55-ace-logo.png" />
    </div>

    <!--
      <div class="tip-container">
      <router-link class="landing-tip" to="/forgot-password">Forgot Password ?</router-link>

      <router-link class="landing-tip" to="/register">Sign Up Now</router-link>
    </div>
    -->
  </div>

  <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss>
    <q-card width="100%">
      <q-card-section class="q-pa-md bg-brightbtn text-white">
        <q-toolbar>
          <q-toolbar-title>Verification Code</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-card-section>
      <div class="q-px-lg q-pt-sm q-pb-lg">
        <q-card-section class="q-mb-md q-pa-md">
          <q-input v-model="innerCaptchaRef" placeholder="Verification Code">
            <template v-slot:append>
              <img
                :src="phoneVerificationImg"
                title="Tap to refresh captcha"
                style="margin-top: 6px; cursor: pointer"
                @click="getInnerCode"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-btn @click="sendOtpSms" label="Send OTP" color="brightbtn" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { Device } from "@capacitor/device";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import qs from "qs";
import { App } from "@capacitor/app";

export default defineComponent({
  name: "LoginPage",
  components: {
    // RiArrowDropLeftLine
  },
  setup() {
    const tab = ref("login");
    const loginType = ref(false);
    const store = userStore();
    const verificationImg = ref("");
    const loginForm = reactive({
      loginName: "",
      password: "",
      captchaCode: "0000",
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
      // api
      //   .get("/member/verificationCode")
      //   .then((response) => {
      //     if (response.code === 0) {
      //       verificationImg.value = "data:image/png;base64," + response.data.img;
      //       loginForm.codeId = response.data.id;
      //     }
      //   })
      //   .catch((e) => {
      //     $q.notify({
      //       color: "negative",
      //       position: "top",
      //       message: e.message,
      //       icon: "report_problem"
      //     });
      //   });
    };

    const isCheckRmb = ref(true);

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
          let message = res.message || "Phone verification code sent successfully",
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

    const goRegister = () => {
      router.push("/register");
    };

    const appVersionNo = ref("");
    const getVersionNo = async () => {
      if (Platform.is.android && Platform.is.capacitor) {
        const info = await App.getInfo();
        appVersionNo.value = info.version;
      }
    };

    const onSubmit = () => {
      $q.loading.show({
        message: "Logging in"
      });
      const fpPromise = FingerprintJS.load();
      (async () => {
        const fp = await fpPromise;
        const result = await fp.get();
        const excludes = { value: ["timezone", "timeZoneOffset"] };
        const allComponents = { ...result.components };
        excludes.value.forEach((element) => {
          delete allComponents[element];
        });
        const sidParam = FingerprintJS.hashComponents(allComponents);

        if (loginType.value === false) {
          loginNameRef.value.validate();
          passwordRef.value.validate();
          // verificationRef.value.validate();
          $q.loading.show({
            message: "Logging in"
          });
          // || verificationRef.value.hasError
          if (loginNameRef.value.hasError || passwordRef.value.hasError) {
            $q.loading.hide();
          } else {
            store
              .memberLogin({
                loginName: loginForm.loginName,
                password: loginForm.password,
                sid: store.googleadid ? store.googleadid : store.aaid ? store.aaid : sidParam,
                captchaCode: loginForm.captchaCode,
                codeId: loginForm.codeId,
                ...(Platform.is.android && Platform.is.capacitor ? { appVersion: appVersionNo.value } : {})
              })
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
                  const jumpUrl = route.query.redirect ? route.query.redirect : "/home";
                  router.go(jumpUrl);
                }
              })
              .catch((error) => {
                loginForm.captchaCode = "0000";
                getCode();
                $q.loading.hide();
              });
          }
        } else {
          telephoneRef.value.validate();
          phoneVerificationRef.value.validate();
          $q.loading.show({
            message: "Logging in"
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

    const backHome = () => {
      router.push("/");
    };

    const guestLoginInfo = reactive({
      sid: "",
      way: "ANDROID"
    });

    const affQuickRegEvent = ref("");

    const guestLogin = () => {
      $q.loading.show({
        message: "Playing as guest"
      });

      (async () => {
        // guestLoginInfo.sid = guestDeviceInfo.value;
        guestLoginInfo.sid = store.googleadid ? store.googleadid : store.aaid;

        api
          .post("/member/quickRegister", qs.stringify(guestLoginInfo))
          .then((ret) => {
            const res = ret;
            console.log("res:", res);

            if (res.code === 0) {
              $q.notify({
                color: "positive",
                position: "top",
                message: "Quick registered successfully",
                icon: "check_circle_outline"
              });

              //ADJUST TRACKEVENT.
              if (Platform.is.android && Platform.is.capacitor) {
                affQuickRegEvent.value = sessionStorage.getItem("AFFILIATE_QUICK_REGISTER_EVENT");
                var adjustEvent = new AdjustEvent(affQuickRegEvent.value);
                // alert(affQuickRegEvent.value);
                Adjust.trackEvent(adjustEvent);
              } else {
                // const AdjustWeb = require("@adjustcom/adjust-web-sdk");
                // AdjustWeb.trackEvent({
                //   eventToken: "vm6pjs"
                // });
              }

              store.autoLogin(res.data);
              sessionStorage.removeItem("REFERRAL_CODE");
              if (store.hasToken()) {
                router.push("/home");
              }
            } else if (res.code === 1010) {
              $q.notify({
                color: "warning",
                position: "top",
                message: "Please login with password to continue",
                icon: "report_problem"
              });
              router.push("/login");
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
        // getCode();
      })();
    };

    const guestDeviceInfo = ref("");

    const getAppInfo = async () => {
      const info = await Device.getId();
      guestDeviceInfo.value = info.identifier;
      // guestDeviceInfo.value = store.aaid;
    };

    onMounted(() => {
      getAppInfo();
      getVersionNo();
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
      guestLoginInfo,
      guestLogin,
      guestDeviceInfo,
      getAppInfo,
      getVersionNo,
      Platform,
      affQuickRegEvent
    };
  }
});
</script>
<style scoped lang="scss">
.login-container {
  // min-height: 100vh;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: flex-start;
  background: url("../assets/images/index/auth-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.back-left {
  position: fixed;
  top: 16px;
  left: 16px;
}

.login-form-logo-img {
  img {
    display: block;
    width: 95%;
    margin: 20px auto;
    max-width: 200px;
  }
}
.login-form-grid {
  display: grid;
  grid-auto-flow: row;
  gap: 7px;

  .login-form-field-label {
    margin-top: 15px;
  }
}
.login-btn {
  background-color: #8b00ff;
  width: 100%;
  height: 56px;
  border-radius: 4px;
  margin-top: 10px;
}
.forgot-password {
  margin: 8px 0px 0px;
  text-align: right;
}

.end-of-form-separator {
  margin: 15px 0px 0px;
  border-color: #ffffff26;
}

.create-account {
  margin: 20px 0px;
  text-align: center;
}
.form-text {
  color: #b3b0b8;
  text-decoration: none;
}

.tip-container {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  padding-bottom: 24px;
}

.landing-tip {
  color: #fae576;
  text-decoration: none;
  font-weight: 700;
}

.landing-input {
  :deep(.q-field__control) {
    padding-left: 20px;
    padding-right: 20px;
  }
  :deep(.q-field__control):before {
    border-color: #1e1f24;
    background-color: #1e1f24;
    border-width: 2px;
  }

  .white-svg {
    filter: brightness(0) invert(1);
  }
}

.rmb-checked-box {
  font-size: 14px;
  color: #91829d;
  margin-bottom: 8px;

  :deep(.q-checkbox__bg) {
    border-radius: 50%;
  }
  :deep(.q-checkbox__inner--truthy .q-checkbox__bg) {
    background: linear-gradient(180deg, #fed87d 0%, #e6a60c 100%);

    svg {
      color: #000;
      padding: 2px;
    }
  }
}

.register-form-logo-img {
  img {
    display: block;
    width: 95%;
    margin: 20px auto;
    max-width: 200px;
  }
}

.prepend-number {
  font-size: 14px;
  color: #ffffff;
  margin-left: 8px;
  z-index: 2;
}
</style>
