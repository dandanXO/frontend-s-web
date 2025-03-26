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

  <div class="login-container" :class="isRestrictedDomain ? 'w-domain' : ''">
    <div class="back-left" v-if="!isRestrictedDomain">
      <router-link :to="'/home'">
        <img src="../assets/images/index/btn-close.png" />
      </router-link>
    </div>
    <!--
    <div class="is-domain top-img">
      <img src="../assets/images/index/register-topimg.png" />
    </div>
    <div class="no-domain login-form-logo-img">
      <img src="../assets/images/auth/b9-logo.png" />
    </div> -->
    <div class="back-btn-img" v-if="isRestrictedDomain" @click="router.replace('/')">
      <img src="../assets/images/index/btn-back.png" />
    </div>
    <!-- <div class="no-domain auth-tab-wrapper">
      <q-tabs v-model="regLoginTab" dense no-caps class="auth-tab-toggle" indicator-color="transparent" align="justify">
        <q-tab name="login" :label="$t('header.login')" />
        <q-tab name="register" :label="$t('header.register')" />
      </q-tabs>
    </div> -->
    <div class="login-pg-title">{{ $t("header.login") }}</div>

    <div class="login-form-wrapper">
      <q-form ref="loginFormRef" @submit="onSubmit">
        <InputRowGrid v-if="!loginType">
          <template #fields>
            <InputField>
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
                  color="green"
                  :placeholder="$t('form.phone_placeholder')"
                >
                  <template v-slot:prepend>
                    <q-icon name="smartphone" />
                    <div class="prepend-number">+92</div>
                  </template>
                </q-input>
              </template>
            </InputField>

            <InputField>
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
                  color="green"
                  :placeholder="$t('form.password_placeholder')"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <!-- <q-icon
                      color="gray-3"
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    /> -->
                    <img style="width: 20px;" class="cursor-pointer" @click="isPwd = !isPwd" :src="require(`../assets/images/common/visibility${isPwd?'_off':''}.png`)">
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

        <!-- <div class="forgot-password">
          <router-link class="form-text" to="/forgot-password">{{ $t("form.forgotPassword") }}</router-link>
        </div> -->

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
    <router-link to="/forgot-password" class="forget-pwd">{{ $t("btn.forgetPwd") }}?</router-link>

    <div class="no-domain bottom-btn-primary">
      <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="onSubmit">
        {{ $t("btn.confirm") }}
      </q-btn>
      <div class="areyounew">
        {{ $t("btn.areyounew") }}
        <a @click="goRegister" class="green">{{ $t("btn.register") }}</a>
      </div>

      <div class="google-login-wrapper">
        <img v-if="languageVal === 'en'" style="width: 100%" src="../assets/images/index/logindirectly-en.png" />
        <img v-else style="width: 100%" src="../assets/images/index/logindirectly-ur.png" />
        <template v-if="isAndroid()">
          <q-btn no-caps unelevated class="btn-secondary btn-secondary__full" @click="onCapacitorGoogleSignin">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABd1BMVEUAAADxRznpQzXpRDXqQzXqQzXqQzXqRDbrQzTfQEDpRDbqQzXrQzX/VSvoRjbqQzXqQzXpQzfnQDjqQzTbSSTqQzXqQzXqQjTqQzTqQjTqQzXqQzXpRDT/MzPqQzTrQzb/xgD0khbrSTLqQzXrQzb8vAbqRDT7uwTwbiTtSTf6vAX7vARDhvX7vAX7vAZDhvX7vQZChPT7vARChPTzuwiCsDY3pFtEg/RChPVBhfP8uwY1p1RChfNChfRAivS5tR80qFMyqFRChfVChfRChfQzp1Q0qFM0qFMzmWYAgIA6nYFBh/BChPNAn2A0qFMzqFM0qFQ0p1MzqFMzqVM0qFNChfMA//84p1A0qFNChfRGhPY0qFM0plw9j8Iktkk0p1Q0qFM0qFM0qFIzqlUtpVozqVM0qFM0qFM0qFM0qFMzqFM0qFMzqVI1p0/qQzX7vAX5qgztVy36twdChfTfuRBXq0U0qFM/qU43oXVAieE1pV8+jsj///9xjqGrAAAAbnRSTlMAEmqx4vb022cIgPB9BiHQxhcgtAfP5JJrbOP6dQV6sAns/vtMW4Sx7w7ir2f4hn6Hh7Bw/uQORGhWWoOE/Rju+0wy9cl9+nUFAmXuVQjO5JJraYvbxgEg4eUdz+YyB4Dz+ZgPEWiv4Pb137ZzHX5o7HUAAAABYktHRHzRtiBfAAAAB3RJTUUH6AYXEzsig/8aPAAAAQJJREFUKM9jYCAAGJmYWVjZ2Jk5GFGEObnY8qCAm4cXIc7Hn4cEBARh4kIsyOJ5wiIwc0TBfDFxCUlxKSRxBh6QsLSMLIjNKycPF1dQVMrLU1bBdKhqfkFhnhoWH6jn5xdpaGKR0MrPz9eGMIvhQAfI0wVK6KFL6EMlDNAlDKFGGaFLGAN5Rvn5JqZmYAlzELAASVgCeVb5JaVl1gjH2ADFbe1AHrQvLytzcISJOzkDJVzATNcyIHBz9wCxPb28QSb5gCV8/UAyZf4BgUHBIWUVlcXFoWEQ3eERZUigqjoyCmZueDSyTEwswiVx8Qkw4cSkZJQQS0lNS8/IzMrOySWUbAAwR2hJPoYcuAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNC0wNi0yM1QxOTo1OTozMyswMDowMBiqq7wAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjQtMDYtMjNUMTk6NTk6MzMrMDA6MDBp9xMAAAAAAElFTkSuQmCC"
            />

            &nbsp;
            {{ $t("btn.signinWithGoogle") }}
          </q-btn>
        </template>
        <template v-else>
          <q-btn no-caps unelevated class="btn-secondary btn-secondary__full" @click="onClickGoogleSignin">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABd1BMVEUAAADxRznpQzXpRDXqQzXqQzXqQzXqRDbrQzTfQEDpRDbqQzXrQzX/VSvoRjbqQzXqQzXpQzfnQDjqQzTbSSTqQzXqQzXqQjTqQzTqQjTqQzXqQzXpRDT/MzPqQzTrQzb/xgD0khbrSTLqQzXrQzb8vAbqRDT7uwTwbiTtSTf6vAX7vARDhvX7vAX7vAZDhvX7vQZChPT7vARChPTzuwiCsDY3pFtEg/RChPVBhfP8uwY1p1RChfNChfRAivS5tR80qFMyqFRChfVChfRChfQzp1Q0qFM0qFMzmWYAgIA6nYFBh/BChPNAn2A0qFMzqFM0qFQ0p1MzqFMzqVM0qFNChfMA//84p1A0qFNChfRGhPY0qFM0plw9j8Iktkk0p1Q0qFM0qFM0qFIzqlUtpVozqVM0qFM0qFM0qFM0qFMzqFM0qFMzqVI1p0/qQzX7vAX5qgztVy36twdChfTfuRBXq0U0qFM/qU43oXVAieE1pV8+jsj///9xjqGrAAAAbnRSTlMAEmqx4vb022cIgPB9BiHQxhcgtAfP5JJrbOP6dQV6sAns/vtMW4Sx7w7ir2f4hn6Hh7Bw/uQORGhWWoOE/Rju+0wy9cl9+nUFAmXuVQjO5JJraYvbxgEg4eUdz+YyB4Dz+ZgPEWiv4Pb137ZzHX5o7HUAAAABYktHRHzRtiBfAAAAB3RJTUUH6AYXEzsig/8aPAAAAQJJREFUKM9jYCAAGJmYWVjZ2Jk5GFGEObnY8qCAm4cXIc7Hn4cEBARh4kIsyOJ5wiIwc0TBfDFxCUlxKSRxBh6QsLSMLIjNKycPF1dQVMrLU1bBdKhqfkFhnhoWH6jn5xdpaGKR0MrPz9eGMIvhQAfI0wVK6KFL6EMlDNAlDKFGGaFLGAN5Rvn5JqZmYAlzELAASVgCeVb5JaVl1gjH2ADFbe1AHrQvLytzcISJOzkDJVzATNcyIHBz9wCxPb28QSb5gCV8/UAyZf4BgUHBIWUVlcXFoWEQ3eERZUigqjoyCmZueDSyTEwswiVx8Qkw4cSkZJQQS0lNS8/IzMrOySWUbAAwR2hJPoYcuAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNC0wNi0yM1QxOTo1OTozMyswMDowMBiqq7wAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjQtMDYtMjNUMTk6NTk6MzMrMDA6MDBp9xMAAAAAAElFTkSuQmCC"
            />

            &nbsp;
            {{ $t("btn.signinWithGoogle") }}
          </q-btn>
        </template>
      </div>
    </div>

    <div class="is-domain bottom-btn-primary">
      <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="onSubmit">
        {{ $t("btn.login") }}
      </q-btn>
    </div>

    <div class="is-domain bottom-btn">
      <!-- <router-link to="/register"> -->
      <q-btn unelevated @click="router.replace('/register')">
        {{ $t("btn.register") }}
      </q-btn>
      <!-- </router-link> -->
    </div>

    <!-- <div class="is-domain has-acct">
      Don't have an account?
      <router-link to="/register" class="login">Register</router-link>
    </div> -->
    <div class="no-domain btn-lists">
      <ShareIcons />
    </div>

    <div class="is-domain social-container">
      <div class="share">Share</div>
      <!-- <div class="social-items">
        <a @click="openWhatsApp()" id="Whatsapp" class="social-item">
          <img src="../assets/images/auth/social_wa.png" />
        </a>

        <a v-if="!isAndroid() && !ui.hideDownload" @click="downloadApp()" id="Download" class="social-item">
          <img src="../assets/images/auth/social_dl.png" />
        </a>
        <a @click="openYoutube()" id="Youtube" class="social-item">
          <img src="../assets/images/auth/youtube-icc.png" />
        </a>
        <a @click="openTiktok()" id="TikTok" class="social-item" target="_blank">
          <img src="../assets/images/auth/tiktok.png" />
        </a>

        <a @click="openCharity()" id="Instagram" class="social-item" target="_blank">
          <img src="../assets/images/auth/social_charity.png" />
        </a>
      </div> -->
      <div class="btn-lists">
        <ShareIcons />
      </div>
    </div>

    <!-- <div class="no-domain bottom-img">
      <img src="../assets/images/auth/login-img2.png" />
    </div> -->
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
import { defineComponent, ref, reactive, onMounted, watch, computed } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { Device } from "@capacitor/device";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import qs from "qs";
import InputField from "../components/auth/InputField.vue";
import InputRowGrid from "../components/auth/InputRowGrid.vue";
import ShareIcons from "../components/ShareIcons.vue";
import { useUI } from "stores/ui";
import { cached, TIME_EXPIRED } from "boot/cache";
import { isAndroid, trackNewUserFtd } from "boot/utils";
import { App } from "@capacitor/app";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useI18n } from "vue-i18n";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { i18nStore } from "src/router/language";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "LoginPage",
  methods: { isAndroid },
  components: {
    // PrimaryButton,
    InputField,
    InputRowGrid,
    ShareIcons
    // RiArrowDropLeftLine
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

                store.autoLogin(res.data);
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

                  store.autoLogin(res.data);
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
  // background: url("../assets/images/auth/bg-login.png");
  background: url("../assets/images/auth/top-login-bg.png");
  background-size: cover;
  background-repeat: no-repeat;
  // padding-top: 250px;
  padding-top: 295px;
  padding-bottom: 20px;
  @media screen and (min-width: 500px) {
    padding-top: 300px;
  }
  .is-domain {
    display: none;
  }
  .no-domain {
    display: unset;
    &.btn-lists {
      display: flex;
      width: 95%;
      margin: 0 auto;
    }
  }
  .forget-pwd {
    color: #9f9f9f;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 0 20px 20px;
    text-decoration: none;
  }
  &.w-domain {
    background: url("../assets/images/auth/trianglebg.png");
    background-size: 100% 100%;
    padding-top: 0;
    .no-domain {
      display: none;
    }
    .is-domain {
      display: block;
      &.top-img {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        img {
          width: calc(100% - 32px);
          margin-left: -5px;
        }
      }
    }
    .has-acct {
      width: 90%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 5px;
      margin: 10px auto;
      color: #9f9f9f;
      a {
        color: #83e977;
      }
    }

    .social-container {
      margin: 10px auto;
      width: 95%;
      position: sticky;
      top: calc(100vh - 70px);
      left: 0;
      right: 0;
      .share {
        display: flex;
        align-items: center;
        padding: 10px;
        gap: 10px;
        color: #ffffff33;
        &:before,
        &:after {
          content: "";
          width: 100%;
          flex: 1;
          height: 1px;
          background-color: #ffffff33;
        }
      }
      .social-items {
        display: flex;
        justify-content: space-between;
        width: 95%;
        margin: 0 auto;
        align-items: center;
        .social-item {
          border: 1px solid #ffffff33;
          padding: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 8px;
          animation: smallbeat 2s infinite;
        }
      }
      .btn-lists {
        margin: 0;
      }
    }
  }
}

.back-left {
  position: fixed;
  top: 10px;
  right: 10px;
  width: 30px;
  img {
    width: 100%;
  }
}

.login-form-logo-img {
  margin-top: -10px;
  padding: 0 16px;
  display: flex;
  justify-content: center;
  text-align: center;

  img {
    display: inline-block;
    width: 100%;
    max-width: 140px;
    margin-bottom: 10px;
  }
}

.back-btn-img {
  position: absolute;
  top: 14px;
  right: 14px;
  img {
    width: 2.25rem;
  }
}
.login-pg-title {
  font-family: "Microsoft YaHei UI", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0px;
  vertical-align: middle;
  color: #ffffff;
  padding: 0 20px;
}

.login-form-wrapper {
  padding: 0 20px 20px 20px;

  :deep(.q-field__control) {
    height: 45px;

    .q-field__marginal {
      height: 45px;
    }
  }
}

// .forgot-password {
//   margin: 8px 0px 0px;
//   text-align: right;

//   .form-text {
//     color: #c1dffc;
//   }
// }

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
  color: #ffffff;
  margin-left: 8px;
}

.q-icon {
  color: rgba(255, 255, 255, 0.3);
}

:deep(.q-tab__label) {
  color: #ffffff;
}

.bottom-btn {
  border: 2px solid transparent;
  border-radius: 4px;
  background-image: linear-gradient(#131313, #131313), linear-gradient(180deg, #33b085 0%, #68bd5c 100%);
  background-origin: border-box;
  background-clip: content-box, border-box;
  margin: 3px 20px 8px;
  padding: 0;

  .q-btn {
    height: 44px;
    width: 100%;
    :deep(.q-btn__content) {
      background: linear-gradient(90deg, #29ed89 0%, #97e872 100%);
      -webkit-background-clip: text;
      color: transparent;
      font-weight: bolder;
      font-size: 16px;
    }
  }
}
.bottom-btn-primary {
  border: none;
  padding: 3px 20px 8px;
  .btn-primary {
    background: linear-gradient(90deg, #29ed89 0%, #97e872 100%);
    color: #000a01;
  }
  :deep(.q-btn__content) {
    font-weight: bolder;
    font-size: 16px;
  }
}

.bottom-img {
  text-align: center;
  margin-top: 28px;
}

.cs-icon-wrapper {
  display: flex;
  width: 70px;
  height: 76px;
  background: url("../assets/images/index/icon-cs.gif") no-repeat center center;
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
  animation: smallbeat 2s infinite;

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
    -webkit-transform: scale(1.2);
    transform: scale(1.3);
  }

  28% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  42% {
    -webkit-transform: scale(1.2);
    transform: scale(1.3);
  }
  70% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
.areyounew {
  margin: 15px 0;
  .green {
    color: #21ef89;
    font-weight: 700;
    cursor: pointer;
  }
}

.google-login-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 25px;
}
</style>
