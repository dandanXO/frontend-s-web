<template>
  <div class="auth-container" :class="isRestrictedDomain ? 'w-domain' : ''">
    <img class="top-left-logo" src="../assets/images/auth/pk4-logo.svg" />
    <div class="back-left" v-if="!isRestrictedDomain">
      <router-link :to="'/home'">
        <img src="../assets/images/index/close-btn.png" />
      </router-link>
    </div>
    <div class="back-btn-img" v-if="isRestrictedDomain" @click="router.replace('/')">
      <img src="../assets/images/index/btn-back.png" />
    </div>

    <div class="auth-form-wrapper">
      <div class="auth-pg-title-wrapper">
        <div class="auth-pg-title">{{ $t("header.login") }}</div>
        <div class="auth-pg-desc">{{ $t("header.welcomeMsg") }}</div>
      </div>

      <q-form ref="loginFormRef" @submit="onSubmit">
        <InputRowGrid v-if="!loginType">
          <template #fields>
            <InputField>
              <template #input>
                <q-input type="tel" pattern="\d*" maxlength="11" hide-bottom-space ref="loginNameRef"
                  v-model="loginForm.loginName" :rules="[
                    (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
                    (val) => (val && val.length === 11) || $t('form.phone_rules_02')
                  ]" label-color="brand" autocomplete="username" outlined color="blue"
                  :placeholder="$t('form.phone_placeholder')">
                  <template v-slot:prepend>
                    <q-icon name="smartphone" />
                    <div class="prepend-number">+92</div>
                  </template>
                </q-input>
              </template>
            </InputField>

            <InputField>
              <template #input>
                <q-input ref="passwordRef" hide-bottom-space v-model="loginForm.password"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[(val) => (val && val.length > 0) || $t('form.password_rules_01')]" label-color="brand"
                  autocomplete="current-password" outlined color="blue" :placeholder="$t('form.password_placeholder')">
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <img style="width: 20px" class="cursor-pointer" @click="isPwd = !isPwd"
                      :src="require(`../assets/images/common/visibility${isPwd ? '_off' : ''}.png`)" />
                  </template>
                </q-input>
              </template>
            </InputField>
          </template>
        </InputRowGrid>

      </q-form>

      <router-link to="/forgot-password" class="forget-pwd">{{ $t("btn.forgetPwd") }}?</router-link>

      <div class="no-domain bottom-btn-primary">
        <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="onSubmit">
          {{ $t("btn.confirm") }}
        </q-btn>

        <!-- <div class="google-login-wrapper">
          <img v-if="languageVal === 'en'" style="width: 100%" src="../assets/images/index/logindirectly-en.svg" />
          <img v-else style="width: 100%" src="../assets/images/index/logindirectly-ur.svg" />
          <template v-if="isAndroid()">
            <q-btn no-caps unelevated class="google-btn btn-secondary btn-secondary__full"
              @click="onCapacitorGoogleSignin">
              <img width="24px" src="../assets/images/index/google-icon.svg" />

              &nbsp;
              {{ $t("btn.signinWithGoogle") }}
            </q-btn>
          </template>
          <template v-else>
            <q-btn no-caps unelevated class="google-btn btn-secondary btn-secondary__full" @click="onClickGoogleSignin">
              <img width="24px" src="../assets/images/index/google-icon.svg" />

              &nbsp;
              {{ $t("btn.signinWithGoogle") }}
            </q-btn>
          </template>
        </div> -->
      </div>

      <hr style="background: #F1F3F5;height: 2px;border: none;width: 100%;margin: 20px 0;" />

      <div class="areyounew">
        {{ $t("btn.areyounew") }}
        <a @click="goRegister" class="blue">{{ $t("btn.register") }}</a>
      </div>

      <div class="is-domain bottom-btn-primary">
        <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="onSubmit">
          {{ $t("btn.login") }}
        </q-btn>
      </div>

      <div class="is-domain bottom-btn">
        <q-btn unelevated @click="router.replace('/register')">
          {{ $t("btn.register") }}
        </q-btn>
      </div>

      <div class="regulated-and-licensed">
        <img class="regulated-logo" src="../assets/images/auth/regulated-and-licensed.png" />
        <div class="text">
          <div class="text-1">Regulated & Licensed</div>
          <div class="text-2">by the Govemment of Couracao</div>
        </div>
      </div>
    </div>
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
              <img :src="phoneVerificationImg" title="Tap to refresh captcha" style="margin-top: 6px; cursor: pointer"
                @click="getInnerCode" />
            </template>
          </q-input>
        </q-card-section>
        <q-btn @click="sendOtpSms" label="Send OTP" color="brightbtn" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch, computed } from "vue";
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
import { isAndroid, isInPwa, trackNewUserFtd } from "boot/utils";
import { App } from "@capacitor/app";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useI18n } from "vue-i18n";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { i18nStore } from "src/router/language";
import { storeToRefs } from "pinia";
import "../css/auth.scss";

export default defineComponent({
  name: "LoginPage",
  methods: { isAndroid },
  components: {
    InputField,
    InputRowGrid,
  },
  setup() {
    const { t } = useI18n();
    const ui = useUI();
    const i18nStoreLanguage = i18nStore();
    const { languageVal } = storeToRefs(i18nStoreLanguage);
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

    const thirdPartyLoginInfo = reactive({
      sid: "",
      way: "ANDROID"
    });

    const getReferralCode = () => {
      const refCode = sessionStorage.getItem("REFERRAL_CODE");
      if (refCode) {
        thirdPartyLoginInfo.referrer = refCode;
      }
    };

    const onCapacitorGoogleSignin = async () => {
      try {
        const user = await GoogleAuth.signIn();

        (() => {
          thirdPartyLoginInfo.siteId = process.env.SITEID;
          thirdPartyLoginInfo.thirdParty = "GOOGLE";
          thirdPartyLoginInfo.sid = store.googleadid ? store.googleadid : store.aaid;
          thirdPartyLoginInfo.accessToken = user.authentication.accessToken;
          thirdPartyLoginInfo.idToken = user.authentication.idToken;

          api
            .post("/member/thirdPartyLogin", qs.stringify(thirdPartyLoginInfo))
            .then((ret) => {
              const res = ret;
              console.log("res:", res);

              if (res.code === 0) {
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: "Google login successfully",
                  icon: "check_circle_outline"
                });

                if (res.data?.isFirstTime) {
                  trackRegisterSuccessEventFromLogin();
                }

                store.autoLogin(res.data?.token || res.data);
                sessionStorage.removeItem("REFERRAL_CODE");
                if (store.hasToken()) {
                  router.push("/home");
                }
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
      } catch (error) {
        console.error("Google Sign-In error:", error);
        alert(error);
      }
    };

    const onClickGoogleSignin = async () => {
      const provider = await new GoogleAuthProvider();
      return signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access Google APIs.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...

          (async () => {
            thirdPartyLoginInfo.siteId = process.env.SITEID;
            thirdPartyLoginInfo.thirdParty = "GOOGLE";
            thirdPartyLoginInfo.sid = store.googleadid ? store.googleadid : store.aaid;
            thirdPartyLoginInfo.accessToken = credential.accessToken;
            thirdPartyLoginInfo.idToken = credential.idToken;

            api
              .post("/member/thirdPartyLogin", qs.stringify(thirdPartyLoginInfo))
              .then((ret) => {
                const res = ret;

                if (res.code === 0) {
                  store.isGoogleLogin = true;
                  store.isFirstLandOnHomePage = true;

                  $q.notify({
                    color: "positive",
                    position: "top",
                    message: "Google login successfully",
                    icon: "check_circle_outline"
                  });

                  if (res.data?.isFirstTime) {
                    trackRegisterSuccessEventFromLogin();
                  }

                  store.autoLogin(res.data?.token || res.data);
                  sessionStorage.removeItem("REFERRAL_CODE");
                  if (store.hasToken()) {
                    router.push("/home");
                  }
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
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    };

    const onSubmit = () => {
      $q.loading.show({
        message: t("notify.loggingIn")
      });
      const sidParam = store.visitorId;

      (async () => {
        if (loginType.value === false) {
          loginNameRef.value.validate();
          passwordRef.value.validate();
          // verificationRef.value.validate();
          $q.loading.show({
            message: t("notify.loggingIn")
          });
          // || verificationRef.value.hasError
          if (loginNameRef.value.hasError || passwordRef.value.hasError) {
            $q.loading.hide();
          } else {
            store
              .memberLogin({
                loginName: loginForm.loginName,
                password: loginForm.password,
                // sid: store.googleadid ? store.googleadid : store.aaid ? store.aaid : sidParam,
                sid: sidParam,
                captchaCode: loginForm.captchaCode,
                codeId: loginForm.codeId,
                ...(Platform.is.android && Platform.is.capacitor ? { appVersion: appVersionNo.value } : {})
              })
              .then(() => {
                $q.loading.hide();
                getCode();
                sessionStorage.removeItem("REFERRAL_CODE");
                localStorage.removeItem("PWA_REFERRAL_CODE");
                sessionStorage.removeItem("SPIN_LUCKY_WHEEL_POPUP");

                //TODO:: ???
                // if (!localStorage.getItem("SPIN_LUCKY_WHEEL_POPUP")) {
                //   localStorage.setItem("SPIN_LUCKY_WHEEL_POPUP", true);
                // } else
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
            message: t("notify.loggingIn")
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
                localStorage.removeItem("PWA_REFERRAL_CODE");

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

    const isRegisterAdjustSentFromLogin = ref(false);
    const trackRegisterSuccessEventFromLogin = () => {
      if (isRegisterAdjustSentFromLogin.value || !ui.adjust_register_event || store.isFromGooglePackage) return;
      isRegisterAdjustSentFromLogin.value = true;

      if (isInPwa()) {
        console.log(ui.adjust_register_event);
        const AdjustWeb = require("@adjustcom/adjust-web-sdk");
        AdjustWeb.trackEvent({
          eventToken: ui.adjust_register_event
        });
      } else if (Platform.is.android && Platform.is.capacitor) {
        var adjustEvent = new AdjustEvent(ui.adjust_register_event);
        // alert(affRegEvent.value);
        Adjust.trackEvent(adjustEvent);
      } else {
        const AdjustWeb = require("@adjustcom/adjust-web-sdk");
        AdjustWeb.trackEvent({
          eventToken: ui.adjust_register_event
        });
      }
    };

    watch(
      () => regLoginTab.value,
      () => {
        if (regLoginTab.value === "register") {
          router.push("/register");
          regLoginTab.value = "login";
        }
      }
    );

    // sticky cs
    const csDragPos = ref([10, 30]);
    const whatDragPos = ref([15, 110]);

    const isDraggingCsIcon = ref(false);
    const openCSInNewTab = (url) => {
      const absoluteUrl = url;
      window.open(absoluteUrl, "_blank");
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

    //Put this when u need to test on localhost.
    // "localhost",
    const restrictedDomains = [];
    const isRestrictedDomain = computed(() => {
      const currentDomain = window.location.hostname;
      return restrictedDomains.includes(currentDomain);
    });

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

      getReferralCode();
      if (isAndroid()) {
        GoogleAuth.initialize();
      }
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
      moveCsIcon,
      moveWhatsIcon,
      whatDragPos,
      loadCustomerAddress,
      ui,
      isRestrictedDomain,
      router,
      onCapacitorGoogleSignin,
      onClickGoogleSignin,
      languageVal
    };
  }
});
</script>
<style scoped lang="scss">
</style>
