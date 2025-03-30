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
    <div class="back-left">
      <router-link :to="'/home'">
        <q-btn dense rounded icon="close" class="text-white" />
      </router-link>
    </div>

    <div class="login-form-logo-img">
      <img src="../assets/images/auth/auth-form-logo-img.png" />
    </div>

    <!-- <div class="auth-tab-wrapper">
      <q-tabs v-model="regLoginTab" dense no-caps class="auth-tab-toggle" indicator-color="transparent" align="justify">
        <q-tab name="login" :label="$t('header.login')" />
        <q-tab name="register" :label="$t('header.register')" />
      </q-tabs>
    </div> -->

    <q-tabs v-model="loginNameType" dense no-caps class="login-type-toggle" narrow-indicator align="justify">
      <q-tab name="email" :label="$t('form.email')" />
      <q-tab name="phone" :label="$t('form.phone')" />
    </q-tabs>

    <div class="login-form-wrapper">
      <q-form ref="loginFormRef" @submit="onSubmit">
        <InputRowGrid v-if="!loginType">
          <template #fields>
            <InputField fancy>
              <template #input>
                <!-- <q-icon name="lock" class="input-icon" /> -->
                <q-input
                  v-if="loginNameType === 'phone'"
                  type="tel"
                  pattern="\d*"
                  maxlength="11"
                  hide-bottom-space
                  ref="loginNameRef"
                  v-model="loginForm.loginName"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
                    (val) => (val && val.length === 11) || $t('form.phone_rules_02'),
                    (val) => val.startsWith('01') || $t('form.phone_rules_03')
                  ]"
                  label-color="brand"
                  autocomplete="username"
                  outlined
                  color="green"
                  :placeholder="$t('form.phone')"
                >
                  <template v-slot:prepend>
                    <FancyIcon name="smartphone" />
                    <!-- <q-icon name="smartphone" /> -->
                    <div class="prepend-number">+880</div>
                  </template>
                </q-input>
                <q-input
                  v-else
                  type="text"
                  hide-bottom-space
                  ref="loginNameRef"
                  v-model="loginForm.loginName"
                  :rules="[(val) => (val && val.length > 0) || $t('form.email_rules_01'), isValidEmail]"
                  label-color="brand"
                  outlined
                  color="green"
                  :placeholder="$t('form.email')"
                >
                  <template v-slot:prepend>
                    <FancyIcon name="email" />
                  </template>
                </q-input>
              </template>
            </InputField>

            <InputField :label="$t('form.password')" fancy>
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
                    <FancyIcon name="lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      color="gray-3"
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                    <div class="forgot-password">
                      <router-link class="form-text" to="/forgot-password">{{ $t("form.forgotPassword") }}</router-link>
                    </div>
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
      <div class="bottom-btn">
        <q-btn no-caps unelevated class="btn-primary btn-primary__full" @click="onSubmit">
          {{ $t("btn.login") }}
        </q-btn>
        <q-btn no-caps unelevated class="btn-secondary btn-secondary__full" :to="'/register'">
          {{ $t("btn.register") }}
        </q-btn>

        <img v-if="languageVal === 'en'" src="../assets/images/index/login-directly.svg" />
        <img v-else src="../assets/images/account/logindirectly.png" />

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

    <div class="btn-lists">
      <div class="list-item" @click="openWhatsApp()">
        <img class="btn-icon" id="whatapp-icon" src="../assets/images/auth/icon-phone.png" />
        <div>WhatsApp</div>
      </div>
      <div class="list-item" v-if="!isAndroid() && !ui.hideDownload" @click="downloadApp()">
        <img class="btn-icon" id="download-icon" src="../assets/images/auth/icon-download.png" />
        <div>{{ $t("btn.downloadApp") }}</div>
      </div>
      <div class="list-item" @click="openTiktok()">
        <img class="btn-icon" id="tiktok-icon" src="../assets/images/auth/icon-tiktok.png" />
        <div>Tiktok</div>
      </div>
      <!-- <div class="list-item" @click="openCharity()">
        <img class="btn-icon" id="charity-icon" src="../assets/images/auth/icon-charity.png" />
        <div>Charitable</div>
      </div> -->
      <!--      <div class="list-item" @click="openTiktok()">-->
      <!--        <img class="btn-icon" id="tiktok-icon" src="../assets/images/auth/icon-tiktok.png" />-->
      <!--        <div>Tiktok</div>-->
      <!--      </div>-->
    </div>

    <!-- <div class="bottom-img">
      <img src="../assets/images/auth/login-img2.png" />
    </div> -->
    <!-- <div class="forgot-password">
      <router-link class="form-text" to="/forgot-password">{{ $t("form.forgotPassword") }}</router-link>
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
import { storeToRefs } from "pinia";
import { i18nStore } from "src/router/language";
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
import { isAndroid, trackNewUserFtd } from "boot/utils";
import { App } from "@capacitor/app";
import FancyIcon from "src/components/auth/FancyIcon.vue";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useI18n } from "vue-i18n";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";

export default defineComponent({
  name: "LoginPage",
  methods: { isAndroid },
  components: {
    // PrimaryButton,
    InputField,
    InputRowGrid,
    FancyIcon
    // RiArrowDropLeftLine
  },
  setup() {
    const { t } = useI18n();
    const { languageVal } = storeToRefs(i18nStore());
    const ui = useUI();
    const tab = ref("login");
    const loginType = ref(false);
    const store = userStore();
    const verificationImg = ref("");
    const loginNameType = ref("email");
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

    const isValidEmail = () => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(loginForm.loginName) || t("form.email_rules_02");
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

    const openCharity = () => {
      window.open(ui.charityUrl, "_blank");
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
                loginType: loginNameType.value,
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
                  store.isFirstLandOnHomePage = true;
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
      downloadApp,
      moveCsIcon,
      moveWhatsIcon,
      whatDragPos,
      loadCustomerAddress,
      ui,
      openWhatsApp,
      openInsta,
      openTiktok,
      openYoutube,
      openCharity,
      onClickGoogleSignin,
      onCapacitorGoogleSignin,
      loginNameType,
      isValidEmail,
      thirdPartyLoginInfo,
      languageVal
    };
  }
});
</script>
<style scoped lang="scss">
.btn-primary {
  color: #000a01;
  height: 34px;
  background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
  background: url("../assets/images/common/auth-page-btn-primary.png") no-repeat center center;
  background-size: 100% 100%;
  font-weight: 600;
  border-radius: 6px;
  text-transform: uppercase;

  &__full {
    width: 100%;
    height: 40px;
    font-size: 16px;
  }

  &:before {
    content: "";
    position: absolute;
    background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
    z-index: -1;
    top: -1px;
    bottom: -1px;
    left: -1px;
    right: -1px;
  }
}

// secondary btn
.btn-secondary {
  color: #ffffff;
  height: 34px;
  font-weight: 600;
  background: #232325;
  border-radius: 6px;
  position: relative;
  text-transform: uppercase;
  background: url("../assets/images/common/auth-page-btn-secondary.png") no-repeat center center;
  background-size: 100% 100%;
  &__full {
    width: 100%;
    height: 40px;
    font-size: 16px;
  }

  &:before {
    content: "";
    position: absolute;
    background: linear-gradient(180deg, #61ff00 0%, rgba(255, 255, 255, 0) 100%);
    z-index: -1;
    top: -1px;
    bottom: -1px;
    left: -1px;
    right: -1px;
  }
}

.login-type-toggle {
  max-width: 70%;
  display: flex;
  margin: 0 auto;

  :deep(.q-tab--active) {
    color: #24ee89;

    .q-tab__label {
      color: #24ee89;
    }
  }
}

.auth-tab-wrapper {
  width: 90%;
  margin: 0 auto;
  display: none;

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
  justify-content: flex-start;
  background: url("../assets/images/auth/bg-login.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.back-left {
  position: fixed;
  top: 16px;
  right: 16px;
}

.login-form-logo-img {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    display: block;
    width: 100%;
    max-width: 100%;
  }
}

.btn-lists {
  display: flex;
  justify-content: space-evenly;
  gap: 0px;
  width: 100%;
  margin: 10px auto;
  align-items: flex-start;
  text-align: center;
  .list-item {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 8px;
    color: #9f9f9f;
    font-size: 12px;
    flex: 1;
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
    animation: smallbeat 2s infinite;
    animation-delay: 1s;
  }
  #whatapp-icon {
    width: 50px;
    height: 50px;
    margin-top: 10px;
    animation: smallbeat 2s infinite;
    animation-delay: 0.5s;
  }
  #download-icon {
    width: 50px;
    height: 50px;
    margin-top: 10px;
    animation: smallbeat 2s infinite;
    //filter: brightness(0) invert(50%) sepia(11%) saturate(3258%) hue-rotate(77deg) brightness(122%) contrast(75%);;
  }
  #charity-icon {
    width: 50px;
    height: 50px;
    margin-top: 10px;
    animation: smallbeat 2s infinite;
    animation-delay: 1.5s;
    //filter: brightness(0) invert(50%) sepia(11%) saturate(3258%) hue-rotate(77deg) brightness(122%) contrast(75%);;
  }
}

.login-form-wrapper {
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;

  // :deep(.q-field__control) {
  //   height: 45px;

  //   .q-field__marginal {
  //     height: 45px;
  //   }
  // }
}

.forgot-password {
  text-align: right;
  position: absolute;
  top: -32px;
  right: 0px;

  .form-text {
    color: #9f9f9f;
    text-decoration: underline;
    font-size: 10px;
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
  display: flex;
  flex-direction: column;
  gap: 15px;
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

.form-fields {
  gap: 2px;
}
</style>
