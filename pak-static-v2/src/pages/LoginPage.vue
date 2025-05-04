<template>
  <!--  <q-page-sticky position="bottom-right" :offset="csDragPos" class="floating-btn">-->
  <!--    <div v-touch-pan.prevent.mouse="moveCsIcon" @click="openCSInNewTab(ui.CSAUrl)">-->
  <!--      <div class="cs-icon-wrapper"></div>-->
  <!--    </div>-->
  <!--  </q-page-sticky>-->
  <!--  <q-page-sticky position="bottom-right" :offset="whatDragPos" class="floating-btn">-->
  <!--    <div v-touch-pan.prevent.mouse="moveWhatsIcon" @click="openWhatsApp()">-->
  <!--      <div class="whatsapp-icon-wrapper"></div>-->
  <!--    </div>-->
  <!--  </q-page-sticky>-->

  <div class="login-container">
    <!-- <div class="back-left">
      <router-link :to="'/landing'">
        <q-btn dense rounded icon="arrow_back_ios_new" class="q-mt-sm" />
      </router-link>
    </div> -->

    <div class="login-form-logo-img">
      <img src="../assets/images/auth/b9-logo.png" />
    </div>

    <div class="auth-tab-wrapper">
      <q-tabs v-model="regLoginTab" dense no-caps class="auth-tab-toggle" indicator-color="transparent" align="justify">
        <q-tab name="login" :label="$t('header.login')" />
        <q-tab name="register" :label="$t('header.register')" />
      </q-tabs>
    </div>

    <div class="login-form-wrapper">
      <q-form ref="loginFormRef" @submit="onSubmit">
        <InputRowGrid v-if="!loginType">
          <template #fields>
            <InputField :label="$t('form.phone')">
              <template #input>
                <!-- <q-icon name="lock" class="input-icon" /> -->
                <q-input
                  type="tel"
                  pattern="\d*"
                  maxlength="11"
                  hide-bottom-space
                  ref="loginNameRef"
                  v-model="loginForm.loginName"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
                    (val) => (val && val.length === 11) || $t('form.phone_rules_02')
                  ]"
                  label-color="brand"
                  autocomplete="username"
                  outlined
                  :placeholder="$t('form.phone_placeholder')"
                >
                  <template v-slot:prepend>
                    <q-icon name="smartphone" />
                    <div class="prepend-number">+92</div>
                  </template>
                </q-input>
              </template>
            </InputField>

            <InputField :label="$t('form.password')">
              <template #input>
                <q-input
                  ref="passwordRef"
                  hide-bottom-space
                  v-model="loginForm.password"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[(val) => (val && val.length > 0) || $t('form.password_rules_01')]"
                  label-color="brand"
                  autocomplete="current-password"
                  outlined
                  :placeholder="$t('form.password_placeholder')"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      color="gray-3"
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </template>
            </InputField>

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
          </template>
        </InputRowGrid>

        <div class="forgot-password">
          <router-link class="form-text" to="/forgot-password">{{ $t("form.forgotPassword") }}</router-link>
        </div>

        <!-- <div style="padding-top: 30px"> -->
        <!-- <PrimaryButton :onClick="onSubmit" :label="'Login'" /> -->
        <!-- <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="onSubmit">Confirm</q-btn> -->
        <!-- </div> -->

        <!-- <div class="q-mt-sm">
          <q-btn @click="goRegister()" rounded flat no-caps class="btn-purple" label="Register" />
        </div> -->
      </q-form>

      <!-- <hr class="end-of-form-separator" /> -->

      <!-- <div class="create-account">
        <span class="form-text">Not a member?</span>
        &nbsp;
        <router-link class="form-text" to="/register" style="color: #00ae00">Create account</router-link>
      </div> -->
    </div>

    <div class="bottom-btn">
      <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="onSubmit">
        {{ $t("btn.confirm") }}
      </q-btn>
    </div>

    <div class="btn-lists">
      <div class="list-item" @click="openWhatsApp()">
        <img class="btn-icon" id="whatapp-icon" src="../assets/images/auth/whatsapp-icon.png" />
        <div>WhatsApp</div>
      </div>
      <div class="list-item" v-if="!isAndroid() && !ui.hideDownload" @click="downloadApp()">
        <img class="btn-icon" id="download-icon" src="../assets/images/auth/app-icon.png" />
        <div>{{ $t("btn.downloadApp") }}</div>
      </div>
      <div class="list-item" @click="openYoutube()">
        <img class="btn-icon" id="tiktok-icon" src="../assets/images/auth/youtube-icon.png" />
        <div>Youtube</div>
      </div>
      <!--      <div class="list-item" @click="openTiktok()">-->
      <!--        <img class="btn-icon" id="tiktok-icon" src="../assets/images/auth/icon-tiktok.png" />-->
      <!--        <div>Tiktok</div>-->
      <!--      </div>-->
    </div>

    <div class="bottom-img">
      <img src="../assets/images/auth/login-img3.png" />
    </div>
  </div>

  <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss>
    <q-card width="100%">
      <q-card-section class="q-pa-md bg-brightbtn">
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
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { Device } from "@capacitor/device";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import qs from "qs";
import InputField from "../components/auth/InputField.vue";
import InputRowGrid from "../components/auth/InputRowGrid.vue";
import { useUI } from "stores/ui";
import { cached, TIME_EXPIRED } from "boot/cache";
import { isAndroid } from "boot/utils";
import { App } from "@capacitor/app";

export default defineComponent({
  name: "LoginPage",
  methods: { isAndroid },
  components: {
    // PrimaryButton,
    InputField,
    InputRowGrid
    // RiArrowDropLeftLine
  },
  setup() {
    const ui = useUI();
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

    const openWhatsApp = () => {
      window.open(ui.whatsappUrl, "_blank");
    };

    const openInsta = () => {
      window.open(ui.instagramUrl, "_blank");
    };

    const openTiktok = () => {
      window.open(ui.tiktokUrl, "_blank");
    };

    const openYoutube = () => {
      window.open(ui.youtubeUrl, "_blank");
    };

    const onSubmit = () => {
      $q.loading.show({
        message: "Logging in"
      });
      const sidParam = store.visitorId;

      (async () => {
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

                sessionStorage.removeItem("SPIN_LUCKY_WHEEL_POPUP");
                if (localStorage.getItem("SPIN_LUCKY_WHEEL_POPUP")) {
                  const currTime = Date.now();
                  const prevTime = Number(localStorage.getItem("SPIN_LUCKY_WHEEL_POPUP"));

                  if (currTime - prevTime > 60 * 1000 * 60 * 24 * 30) {
                    localStorage.setItem("SPIN_LUCKY_WHEEL_POPUP", true);
                  }
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
                  const jumpUrl = route.query.redirect ? route.query.redirect : "/home";
                  ui.showLoggedIn();
                  // router.push(jumpUrl);
                  router.push({ path: jumpUrl, query: { login: "true" } });
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
              // if (Platform.is.android && Platform.is.capacitor) {
              //   affQuickRegEvent.value = sessionStorage.getItem("AFFILIATE_QUICK_REGISTER_EVENT");
              //   var adjustEvent = new AdjustEvent(affQuickRegEvent.value);
              //   // alert(affQuickRegEvent.value);
              //   Adjust.trackEvent(adjustEvent);
              // } else {
              // const AdjustWeb = require("@adjustcom/adjust-web-sdk");
              // AdjustWeb.trackEvent({
              //   eventToken: "vm6pjs"
              // });
              // }

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

    const regLoginTab = ref("login");

    watch(
      () => regLoginTab.value,
      () => {
        if (regLoginTab.value === "register") {
          router.push("/register");
          regLoginTab.value = "login";
        }
      }
    );

    // watch(
    //   () => route.path,
    //   () => {
    //     if (route.path === "/promo") {
    //       vipPromoTab.value = "promo";
    //     }
    //   }
    // );

    // sticky cs
    const csDragPos = ref([10, 30]);
    const whatDragPos = ref([15, 110]);

    const isDraggingCsIcon = ref(false);
    const openCSInNewTab = (url) => {
      const absoluteUrl = url;
      window.open(absoluteUrl, "_blank");
    };
    const downloadApp = () => {
      if (ui.downloadAppUrl) {
        window.open(ui.downloadAppUrl, "_blank");
      } else {
        ui.getTopDownloadUrl().then(() => window.open(ui.downloadAppUrl, "_blank"));
      }
    };
    const moveCsIcon = (ev) => {
      isDraggingCsIcon.value = ev.isFirst !== true && ev.isFinal !== true;

      csDragPos.value = [csDragPos.value[0] - ev.delta.x, csDragPos.value[1] - ev.delta.y];
    };
    const moveWhatsIcon = (ev) => {
      isDraggingCsIcon.value = ev.isFirst !== true && ev.isFinal !== true;
      whatDragPos.value = [whatDragPos.value[0] - ev.delta.x, whatDragPos.value[1] - ev.delta.y];
    };
    const loadCustomerAddress = () => {
      cached
        .get("customerAddress", () =>
          api.get("/config/customerAddress/v2").then((res) => {
            return res;
          })
        )
        .then((data) => {
          // console.log(data);
          var url = data.liveUrl1;
          ui.CSAUrl = url;
        });
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
      loadCustomerAddress();
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
      affQuickRegEvent,
      regLoginTab,
      csDragPos,
      isDraggingCsIcon,
      openCSInNewTab,
      downloadApp,
      moveCsIcon,
      moveWhatsIcon,
      whatDragPos,
      loadCustomerAddress,
      ui,
      openWhatsApp,
      openInsta,
      openTiktok,
      openYoutube
    };
  }
});
</script>
<style scoped lang="scss">
.auth-tab-wrapper {
  width: 90%;
  margin: 0 auto;

  .q-tab {
    min-height: 45px;
    border-radius: 8px;
    color: #5f6061;
    font-weight: 400;
    width: 50%;
  }

  .auth-tab-toggle {
    // background: url(../assets/images/auth/auth-tab-active.png) no-repeat center center;
    // background-size: 100% 100%;
    border-radius: 8px;
    margin-bottom: 4px;
    margin-top: 0px;
    padding: 1px;

    :deep(.q-tab__label) {
      font-weight: 400;
    }

    :deep(.q-tab--active) {
      color: white;
      background: url(../assets/images/auth/auth-tab-active.png) no-repeat center center;
      background-size: 100% 100%;
    }

    :deep(.q-tab--inactive) {
      background: url(../assets/images/auth/auth-tab.png) no-repeat center center;
      background-size: 100% 100%;
      .q-tab__label {
        color: #424f72;
      }
    }

    :deep(.q-tab--active .q-tab__label) {
      font-weight: 700 !important;
    }
  }
}

.login-container {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  padding-top: 20px;
  background-color: #e9f2fd;
}

.back-left {
  position: fixed;
  top: 16px;
  left: 16px;
}

.login-form-logo-img {
  margin-top: -10px;
  padding: 0 16px;
  display: flex;
  justify-content: center;
  img {
    display: block;
    width: 100%;
    max-width: 140px;
    margin-bottom: 10px;
    height: 41px;
  }
}

.btn-lists {
  display: flex;
  justify-content: space-evenly;
  gap: 0px;
  width: 100%;
  margin: 10px auto;

  .list-item {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    // gap: 8px;
    color: #9f9f9f;
    font-size: 12px;
    
    :not(:last-child) {
      margin-bottom: 8px;
    }
  }

  .btn-icon {
    width: 70px;
    height: 70px;

    &:active {
      filter: brightness(0.85);
      transform: translate(0px, 1px);
    }
  }
  #cs-icon {
    width: 70px;
    height: 70px;
  }
  #tiktok-icon {
    width: 50px;
    height: 50px;
    margin-top: 10px;
    animation: smallbeat 1.5s infinite;
    animation-delay: 1s;
  }
  #whatapp-icon {
    width: 50px;
    height: 50px;
    margin-top: 10px;
    animation: smallbeat 1.5s infinite;
    animation-delay: 0.5s;
  }
  #download-icon {
    width: 50px;
    height: 50px;
    margin-top: 10px;
    animation: smallbeat 1.5s infinite;
    //filter: brightness(0) invert(50%) sepia(11%) saturate(3258%) hue-rotate(77deg) brightness(122%) contrast(75%);;
  }
}

.login-form-wrapper {
  padding: 0 20px 20px;

  :deep(.q-field__control) {
    height: 45px;

    .q-field__marginal {
      height: 45px;
    }
  }
}

.forgot-password {
  margin: 8px 0px 0px;
  text-align: right;

  .form-text {
    color: #458bff;
    text-decoration: underline;
  }
}

.end-of-form-separator {
  margin: 35px 0px 0px;
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

.prepend-number {
  font-size: 14px;
  color: #424f72;
  margin-left: 8px;
}

.q-icon {
  color: #424f72;
}

:deep(.q-tab__label) {
  color: #ffffff;
}

.bottom-btn {
  // margin-top: 20px;
  padding: 3px 20px 8px;
}

.bottom-img {
  text-align: center;
  margin-top: 28px;
}

.cs-icon-wrapper {
  display: flex;
  width: 70px;
  height: 76px;
  background: url("../assets/images/index/icon-cs.png") no-repeat center center;
  background-size: contain;

  &:active {
    filter: brightness(0.85);
    transform: translate(0px, 1px);
  }
}

.whatsapp-icon-wrapper {
  display: flex;
  width: 60px;
  height: 60px;
  background: url("../assets/images/auth/whatsapp-icon.png") no-repeat center center;
  background-size: contain;
  animation: smallbeat 1.5s infinite;

  &:active {
    filter: brightness(0.85);
    transform: translate(0px, 1px);
  }
}

@keyframes smallbeat {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  14% {
    -webkit-transform: scale(1.15);
    transform: scale(1.15);
  }

  28% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  42% {
    -webkit-transform: scale(1.15);
    transform: scale(1.15);
  }
  70% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
