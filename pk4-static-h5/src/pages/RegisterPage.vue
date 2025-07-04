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
        <div class="auth-pg-title">{{ $t("header.register") }}</div>
        <div class="auth-pg-desc">{{ $t("header.welcomeMsg") }}</div>
      </div>

      <q-form class="rounded-borders">
        <InputRowGrid>
          <template #fields>
            <InputField>
              <template #input>
                <q-input type="tel" pattern="\d*" maxlength="11" ref="loginNameRef" hide-bottom-space clearable
                  v-model="regForm.loginName" :rules="[
                    (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
                    (val) => (val && val.length === 11) || $t('form.phone_rules_01'),
                    (val) => val.startsWith('03') || $t('form.phone_rules_03')
                  ]" color="blue" outlined label-color="brand" :placeholder="$t('form.phone_placeholder')">
                  <template v-slot:prepend>
                    <q-icon name="smartphone" />
                    <div class="prepend-number">+92</div>
                  </template>
                  <template v-if="regForm.referrer && spinRefCode" v-slot:append>
                    <q-btn :disable="otpCountdown > 0" class="get-code-btn" @click="openPhoneVeriDialog">
                      {{ otpCountdown > 0 ? `RESEND (${otpCountdown})` : $t("form.get_code") }}
                    </q-btn>
                  </template>
                </q-input>
              </template>
            </InputField>

            <InputField>
              <template #input>
                <q-input ref="pwdRef" hide-bottom-space v-model="regForm.password" :type="isPwd ? 'password' : 'text'"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('form.password_rules_01'),
                    (val) => val.length > 6 || $t('form.password_rules_02')
                  ]" color="blue" outlined clearable label-color="brand"
                  :placeholder="$t('form.password_placeholder')">
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
                    <img style="width: 20px" class="cursor-pointer" @click="isPwd = !isPwd"
                      :src="require(`../assets/images/common/visibility${isPwd ? '_off' : ''}.png`)" />
                  </template>
                </q-input>
              </template>
            </InputField>

            <!--            -->
            <InputField v-if="regForm.referrer && regForm.smsCodeId" :label="$t('form.otp_form')">
              <template #input>
                <q-input pattern="\d*" maxlength="6" ref="verificationRef" hide-bottom-space v-model="regForm.smsCode"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('form.insert_otp_num'),
                    (val) => (val && val.length === 6) || $t('form.otp_must_have_6')
                  ]" color="white" class="landing-input" outlined :placeholder="$t('form.enter_otp_num')"
                  label-color="brand" :disable="isOtpEnable">
                  <template v-slot:prepend>
                    <q-icon name="key" />
                  </template>
                </q-input>
              </template>
            </InputField>


            <div style="visibility: hidden; position: absolute">
              <InputField :label="'Invitation Code (Optional)'">
                <template #input>
                  <q-input v-if="!hasAffiliate" ref="affiliateCodeRef" hide-bottom-space v-model="regForm.referrer"
                    label-color="brand" outlined color="blue" placeholder="Enter Invitation Code (Optional)" />
                </template>
              </InputField>
            </div>
          </template>
        </InputRowGrid>

      </q-form>
      <div class="no-domain" :class="isAgreeReg ? 'checked' : ''">
        <q-checkbox rounded v-model="isAgreeReg" size="md" class="rmb-checked-box">
          {{ $t("form.register_agree_01") }}
          <a href="#" style="text-decoration: none; color: #82B4EA">{{ $t("form.register_agree_02") }}</a>
        </q-checkbox>
      </div>

      <router-link to="/forgot-password" class="is-domain forget-pwd">{{ $t("btn.forgetPwd") }}</router-link>

      <div class="no-domain bottom-btn-primary">
        <q-btn class="btn-primary btn-primary__full" no-caps unelevated :disabled="!isAgreeReg" :loading="isLoading"
          @click="onSubmit">
          {{ $t("btn.confirm") }}
        </q-btn>

        <!-- <div v-if="!isSpinReferrer" class="google-login-wrapper">
          <img v-if="languageVal === 'en'" style="width: 100%" src="../assets/images/index/logindirectly-en.svg" />
          <img v-else style="width: 100%" src="../assets/images/index/logindirectly-ur.svg" />
          <template v-if="isAndroid()">
            <q-btn no-caps unelevated class="google-btn btn-secondary btn-secondary__full" @click="onCapacitorGoogleSignin">
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
          {{ $t("btn.alreadyhaveacct") }}
          <a @click="regLoginTab = 'login'" class="blue">{{ $t("btn.login") }}</a>
        </div>

        

      <div class="is-domain bottom-btn-primary">
        <q-btn class="btn-primary btn-primary__full" no-caps unelevated :disabled="!isAgreeReg" :loading="isLoading"
          @click="onSubmit">
          {{ $t("btn.register") }}
        </q-btn>
      </div>

      <div class="is-domain bottom-btn">
        <!-- <router-link to="/login"> -->
        <q-btn unelevated @click="router.replace('/login')">
          {{ $t("btn.login") }}
        </q-btn>
        <!-- </router-link> -->
      </div>

      <!-- <div class="regulated-and-licensed">
        <img class="regulated-logo" src="../assets/images/auth/regulated-and-licensed.png" />
        <div class="text">
          <div class="text-1">Regulated & Licensed</div>
          <div class="text-2">by the Govemment of Couracao</div>
        </div>
      </div> -->

    </div>

    <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss>
      <q-card class="captcha-form-wrapper" width="100%">
        <q-card-section class="q-pa-md text-white">
          <q-toolbar>
            <q-toolbar-title>{{ $t("form.verificationCode") }}</q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar>
        </q-card-section>
        <div class="q-px-lg q-pt-sm q-pb-lg">
          <q-card-section class="q-mb-md q-pa-md">
            <q-input v-model="innerCaptchaRef" :placeholder="$t(`form.captchaCode`)">
              <template v-slot:append>
                <img v-show="showImageCode" :src="phoneVerificationImg" @load="imgOnLoad" @error="imgOnError"
                  :title="$t(`form.refresh_veri_code`)" style="margin-top: 6px; cursor: pointer"
                  @click="getInnerCode" />
              </template>
            </q-input>
          </q-card-section>
          <q-btn class="get-code-btn" @click="onCaptchaSubmit" :label="$t(`form.send_otp`)" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, computed, watch, onActivated, onUnmounted } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import qs from "qs";
import InputField from "../components/auth/InputField.vue";
import InputRowGrid from "../components/auth/InputRowGrid.vue";
import { useUI } from "stores/ui";
import { cached, TIME_EXPIRED } from "boot/cache";
import { isAndroid, isInPwa, generateEventID } from "boot/utils";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useI18n } from "vue-i18n";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { i18nStore } from "src/router/language";
import { storeToRefs } from "pinia";
import "../css/auth.scss";

export default defineComponent({
  name: "RegisterPage",
  methods: { isAndroid },
  components: {
    InputRowGrid,
    InputField
  },
  setup() {
    const { t } = useI18n();
    const ui = useUI();
    const store = userStore();
    const i18nStoreLanguage = i18nStore();
    const { languageVal } = storeToRefs(i18nStoreLanguage);
    const verificationImg = ref("");

    const captchaRef = ref();
    const innerCodeId = ref("");
    const innerCaptchaRef = ref("");
    const showCaptchaDialog = ref(false);
    const phoneVerificationImg = ref("");
    const isAgreeReg = ref(true);

    const showImageCode = ref(false);

    const otpCountdown = ref();
    const otpCountdownInterval = ref();

    const affCode = ref("");
    const isLoading = ref(false);

    const isOtpEnable = ref(true);

    const spinRefCode = ref("");

    const regForm = reactive({
      loginName: "",
      password: "",
      confirmPwd: "",
      telephone: "",
      // nric: "",
      // email: "",
      captchaCode: "0000",
      regHost: location.hostname,
      codeId: "",
      codeAffiliate: "",
      referrer: "",
      smsCodeId: "",
      smsCode: "",
      traceId: ""
    });
    const getCode = () => {
    };

    const imgOnLoad = () => (showImageCode.value = true);
    const imgOnError = () => (showImageCode.value = false);

    const openPhoneVeriDialog = () => {
      isOtpEnable.value = false;
      loginNameRef.value.validate();
      if (!loginNameRef.value.hasError) {
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
            innerCodeId.value = response.data.id;
            innerCaptchaRef.value = "";
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const hasAffiliate = ref(false);
    const isSpinReferrer = ref(false);
    const getAffiliateCode = () => {
      affCode.value = sessionStorage.getItem("AFFILIATE_CODE");
      // if (affCode.value) {
        // hasAffiliate.value = true;
        // }
        regForm.codeAffiliate = affCode.value;
        
        const affMemberType = sessionStorage.getItem("AFFILIATE_MEMBERTYPE");
      if(affMemberType && ['AFFILIATE', 'NORMAL'].includes(affMemberType)) {
        regForm.memberType = affMemberType;
      }
    };
    const getReferralCode = () => {
      const refCode = sessionStorage.getItem("REFERRAL_CODE");
      if (refCode) {
        // hasAffiliate.value = true;
        regForm.referrer = refCode;
        thirdPartyLoginInfo.referrer = refCode;
      }
      const pwaRefCode = localStorage.getItem("PWA_REFERRAL_CODE");
      if (pwaRefCode) {
        // hasAffiliate.value = true;
        regForm.referrer = pwaRefCode;
      }
      spinRefCode.value = sessionStorage.getItem("REFERRAL_SPIN_CODE");
      if (spinRefCode.value) {
        isSpinReferrer.value = true;
        regForm.referrer = spinRefCode.value;
        thirdPartyLoginInfo.referrer = refCode;
      }
    };

    const loginNameRef = ref();
    const pwdRef = ref();
    const confirmPwdRef = ref();
    // const nricRef = ref();
    // const telRef = ref();
    const emailRef = ref();
    const verificationRef = ref();
    const phoneVerificationRef = ref();
    const $q = useQuasar();
    const route = useRoute();

    const pwdStrength = ref("");
    const isValidEmail = () => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(regForm.email) || "请输入有效电子邮件";
    };

    const isValidCnPhone = () => {
      const phonePattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      return phonePattern.test(regForm.telephone) || "请输入有效的电话号码";
    };

    const isValidName = (value, translation) => {
      const namePattern = /^[A-Za-z0-9]+$/;
      return namePattern.test(value) || `${translation} must be alphanumeric`;
    };

    const isAlphanumeric = (value, translation) => {
      const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
      // const passwordPattern = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]+$/i;
      return passwordPattern.test(value) || `${translation} must at least contain letters and numbers.`;
    };

    // const phoneNumberRules = [
    //   (val) => (val && val.length > 0) || "Please insert Phone number",
    //   (val) => (val && val.length === 11) || "The phone number must have 11 digits",
    //   (val) => (val && val.startsWith("03")) || 'The phone number must start with "03"'
    // ];

    const router = useRouter();

    const affRegEvent = ref("");

    const thirdPartyLoginInfo = reactive({
      sid: "",
      way: "ANDROID"
    });

    onActivated(() => {
      getCode();
      getReferralCode();
      getAffiliateCode();

      if (isAndroid()) {
        GoogleAuth.initialize();
      }
    });

    const onCapacitorGoogleSignin = async () => {
      try {
        const user = await GoogleAuth.signIn();

        (() => {
          thirdPartyLoginInfo.siteId = process.env.SITEID;
          thirdPartyLoginInfo.thirdParty = "GOOGLE";
          thirdPartyLoginInfo.sid = store.googleadid ? store.googleadid : store.aaid;
          thirdPartyLoginInfo.traceId = store.googleadid ? store.googleadid : store.aaid;
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
                  message: t("form.google_login_success"),
                  icon: "check_circle_outline"
                });

                if (res.data?.isFirstTime) {
                  trackRegisterSuccessEvent();
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
            thirdPartyLoginInfo.traceId = store.googleadid ? store.googleadid : store.aaid;
            thirdPartyLoginInfo.accessToken = credential.accessToken;
            thirdPartyLoginInfo.idToken = credential.idToken;

            api
              .post("/member/thirdPartyLogin", qs.stringify(thirdPartyLoginInfo))
              .then((ret) => {
                const res = ret;
                console.log("res:", res);

                if (res.code === 0) {
                  $q.notify({
                    color: "positive",
                    position: "top",
                    message: t("form.google_login_success"),
                    icon: "check_circle_outline"
                  });

                  if (res.data?.isFirstTime) {
                    trackRegisterSuccessEvent();
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

    const isRegisterAdjustSent = ref(false);
    const trackRegisterSuccessEvent = () => {
      if (isRegisterAdjustSent.value || !ui.adjust_register_event || store.isFromGooglePackage) return;
      isRegisterAdjustSent.value = true;

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

    const onSubmit = () => {
      loginNameRef.value.validate();
      pwdRef.value.validate();

      verificationRef.value?.validate();

      $q.loading.show({
        message: t("form.register_in_progress")
      });

      isLoading.value = true;

      if (
        loginNameRef.value.hasError ||
        pwdRef.value.hasError ||
        verificationRef.value?.hasError ||
        isAgreeReg.value === false
      ) {
        $q.loading.hide();
        isLoading.value = false;
      } else if (regForm.referrer && isSpinReferrer.value === true && regForm.smsCodeId && isOtpEnable.value) {
        $q.notify({
          color: "negative",
          position: "top",
          message: t("form.fill_in_otp"),
          icon: "report_problem"
        });
        $q.loading.hide();
        isLoading.value = false;
      } else {
        var qs = require("qs");
        const sidParam = store.googleadid || store.aaid || store.visitorId;

        (async () => {
          if (store.aaid) {
            regForm.traceId = store.aaid;
          }
          regForm.sid = sidParam;

          regForm.regDevice = $q.platform.is.mobile ? "H5" : "WEB";
          if ("standalone" in window.navigator && window.navigator.standalone) {
            regForm.regDevice = "IOS";
          } else {
            regForm.regDevice = Platform.is.mobile ? "H5" : "WEB";
            if (Platform.is.capacitor) {
              if (Platform.is.android) {
                regForm.regDevice = "ANDROID";
              }
            }
            if (store.isFromGooglePackage) {
              regForm.regDevice = "ANDROID";
            }
          }

          if (regForm.regHost.indexOf("http://localhost") > -1) {
            regForm.regHost = "app://";
          }

          api
            .post("/member/indRegister", qs.stringify(regForm))
            .then((ret) => {
              const res = ret;
              if (res.code === 0) {
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: t("form.register_success"),
                  icon: "check_circle_outline"
                });
                localStorage.setItem("newPlayerGuide", 1);
                //FB Tracking.
                if (store.isFbPixel || store.isTkPixel) {
                  if (store.isFbPixel) {
                    fbq("track", "CompleteRegistration");
                  }
                  if (store.isTkPixel) {
                    ttq.track("CompleteRegistration", { content_type: "product" }, { event_id: Date.now() });
                  }

                  localStorage.setItem("newUserFtd", regForm.loginName);
                  localStorage.setItem("REG_REFERRAL_CODE", regForm.referrer);
                }

                trackRegisterSuccessEvent();

                sessionStorage.removeItem("REFERRAL_CODE");
                sessionStorage.removeItem("AFFILIATE_MEMBERTYPE");
                localStorage.removeItem("PWA_REFERRAL_CODE");

                store.autoLogin(res.data);
                if (store.hasToken()) {
                  const jumpUrl = route.query.redirect ? route.query.redirect : "/";
                  router.push({ path: jumpUrl, query: { register: "true" } });
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
              isLoading.value = false;
            })
            .catch((error) => {
              $q.loading.hide();
              isLoading.value = false;
            });

          // register to check phone exist and sms OTP -- start
          // api
          //   .get(`/member/checkPhoneRegisterStatus?siteId=11&phone=${regForm.loginName}`)
          //   .then((ret) => {
          //     const res = ret;

          //     if (res.code === 0 && !res.data) {
          //       $q.notify({
          //         color: "positive",
          //         position: "top",
          //         message: "Please proceed to OTP",
          //         icon: "check_circle_outline"
          //       });
          //       console.log(res, "-ressss");
          //       sessionStorage.setItem("REG_FORM", qs.stringify(regForm));
          //       sessionStorage.removeItem("REFERRAL_CODE");

          //       api
          //         .post(
          //           `/otp/sendSms`,
          //           qs.stringify({
          //             telephone: regForm.loginName,
          //             captchaCode: '0000',
          //             codeId: '0000'
          //           })
          //         )
          //         .then((res) => {
          //           getCode();
          //           let message = res.message || "Phone verification code sent successfully",
          //             color = "positive";

          //           if (res.code === 0) {
          //             console.log(res.data.codeId);
          //           }
          //           if (message) {
          //             $q.notify({ message, color });
          //           }

          //           console.log("onCaptchaSubmit", res);
          //         })
          //         .catch(() => {
          //           console.log("Err");
          //           getInnerCode();
          //         });

          //       router.push("/verification");
          //     } else {
          //       $q.notify({
          //         color: "negative",
          //         position: "top",
          //         message: res.message,
          //         icon: "report_problem"
          //       });
          //     }
          //     $q.loading.hide();
          //     isLoading.value = false;
          //   })
          //   .catch((error) => {
          //     $q.loading.hide();
          //     isLoading.value = false;
          //   });
          // register to check phone exist and sms OTP -- end

          getCode();
        })();
      }
    };


    const verificationCodeDialog = ref(false);
    const openVerificationCodeDialog = () => {
      verificationCodeDialog.value = !verificationCodeDialog.value;
      captchaRef.value = "";
      getCode();
    };

    const onCaptchaSubmit = () => {
      if (!regForm.loginName) {
        $q.notify({
          color: "negative",
          position: "top",
          message: t("form.phone_cannot_empty"),
          icon: "report_problem"
        });
        getInnerCode();
        return;
      }
      api
        .post(
          `/otp/sendSms`,
          qs.stringify({
            telephone: regForm.loginName,
            captchaCode: innerCaptchaRef.value,
            codeId: innerCodeId.value
          })
        )
        .then((res) => {
          let message = res.message || t("form.otp_sent_phone_success"),
            color = "positive";

          if (res.code === 0) {
            showCaptchaDialog.value = false;
            regForm.smsCode = "";
            regForm.smsCodeId = res.data.codeId;
            console.log(res.data.codeId);

            // start otp countdown
            otpCountdown.value = res.data.second || 60;
            otpCountdownInterval.value = setInterval(() => {
              if (otpCountdown.value > 0) {
                otpCountdown.value = otpCountdown.value - 1;
              }
            }, 1000);
          } else {
            color = "negative";
            if (res.code === 1402) {
              message = t("notify.tryagain", { seconds: res.data.second });

              // start otp countdown
              otpCountdown.value = res.data.second || 60;
              otpCountdownInterval.value = setInterval(() => {
                if (otpCountdown.value > 0) {
                  otpCountdown.value = otpCountdown.value - 1;
                }
              }, 1000);
            }
            getInnerCode();
          }

          if (message) {
            $q.notify({ message, color, position: "top" });
          }

          console.log("onCaptchaSubmit", res);
        })
        .catch(() => {
          getInnerCode();
        });
    };

    const isValidPhone = () => {
      const { phone } = formDetail;

      if (!phone) {
        return "Please Enter Phone Number";
      }

      const phoneRegex = /^\d{11,20}$/;
      const isValid = phoneRegex.test(phone);

      return isValid ? true : "Phone Number must be 11 digits or more";
    };

    const regLoginTab = ref("register");

    // sticky cs
    const csDragPos = ref([10, 30]);
    const whatDragPos = ref([15, 110]);

    const isDraggingCsIcon = ref(false);
    const openCSInNewTab = (url) => {
      const absoluteUrl = url;
      window.open(absoluteUrl, "_blank");
    };
    const moveWhatsIcon = (ev) => {
      isDraggingCsIcon.value = ev.isFirst !== true && ev.isFinal !== true;
      whatDragPos.value = [whatDragPos.value[0] - ev.delta.x, whatDragPos.value[1] - ev.delta.y];
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

    const moveCsIcon = (ev) => {
      isDraggingCsIcon.value = ev.isFirst !== true && ev.isFinal !== true;

      csDragPos.value = [csDragPos.value[0] - ev.delta.x, csDragPos.value[1] - ev.delta.y];
    };

    const downloadApp = () => {
      if (ui.downloadAppUrl) {
        window.open(ui.downloadAppUrl, "_blank");
      } else {
        ui.getTopDownloadUrl().then(() => window.open(ui.downloadAppUrl, "_blank"));
      }
    };

    const loadCustomerAddress = () => {
      cached
        .get("customerAddress", () =>
          api.get("/config/customerAddress/v2").then((res) => {
            return res;
          })
        )
        .then((data) => {
          console.log(data);
          var url = data.liveUrl1;
          ui.CSAUrl = url;
        });
    };

    watch(
      () => regLoginTab.value,
      () => {
        if (regLoginTab.value === "login") {
          router.push("/login");
          regLoginTab.value = "register";
        }
      }
    );

    //Put this when u need to test on localhost.
    // "localhost",
    const restrictedDomains = [];
    const isRestrictedDomain = computed(() => {
      const currentDomain = window.location.hostname;
      return restrictedDomains.includes(currentDomain);
    });

    watch(
      () => otpCountdown.value,
      () => {
        if (otpCountdown.value === 0) {
          clearInterval(otpCountdownInterval.value);
        }
      }
    );

    onUnmounted(() => {
      clearInterval(otpCountdownInterval.value);
    });

    return {
      header: "Register Account",
      regForm,
      verificationImg,
      loginNameRef,
      pwdRef,
      confirmPwdRef,
      // nricRef,
      // telRef,
      emailRef,
      verificationRef,
      onSubmit,
      isValidEmail,
      isPwd: ref(true),
      isCfmPwd: ref(true),
      getCode,
      getInnerCode,
      pwdStrength,
      showCaptchaDialog,
      onCaptchaSubmit,
      innerCaptchaRef,
      phoneVerificationImg,
      // openPhoneVeriDialog,
      phoneVerificationRef,
      isValidCnPhone,
      hasAffiliate,
      isAgreeReg,
      isAlphanumeric,
      isValidName,
      isValidPhone,
      affRegEvent,
      isLoading,
      regLoginTab,
      csDragPos,
      isDraggingCsIcon,
      openCSInNewTab,
      moveCsIcon,
      openInsta,
      loadCustomerAddress,
      ui,
      moveWhatsIcon,
      whatDragPos,
      openWhatsApp,
      openTiktok,
      openYoutube,
      openCharity,
      downloadApp,
      isRestrictedDomain,
      router,
      onClickGoogleSignin,
      onCapacitorGoogleSignin,
      languageVal,
      isSpinReferrer,
      otpCountdown,
      otpCountdownInterval,
      isOtpEnable,
      openPhoneVeriDialog,
      imgOnLoad,
      imgOnError,
      showImageCode,
      spinRefCode,
      store
    };
  }
});

function charType(num) {
  if (num >= 48 && num <= 57) {
    return 1;
  }
  if (num >= 97 && num <= 122) {
    return 2;
  }
  if (num >= 65 && num <= 90) {
    return 4;
  }
  return 8;
}
</script>

<style scoped lang="scss">
.get-code-btn {
  background: linear-gradient(90deg, #0287F2 0%, #0664D2 100%);
  color: #fff;
  box-shadow: 0px 0.5px 2px 0px #0667D599;
  min-width: 100px;
  max-width: 120px;
  font-weight: bold;
}


.back-left {
  position: fixed;
  top: 15px;
  right: 15px;
  width: 30px;

  img {
    width: 100%;
  }
}

.back-btn-img {
  cursor: pointer;
  position: absolute;
  top: 14px;
  right: 14px;

  img {
    width: 2.25rem;
  }
}

.verification {
  display: flex;
  padding: 10px;
}

.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.q-toolbar {
  background: #33bcd4;
}

.rmb-checked-box {
  color: #B2BDBF;
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  margin-top: 10px;

  :deep(.q-checkbox__bg) {
    border-radius: 4px;
    background: #e8f0fe;
  }

  :deep(.q-checkbox__inner--truthy .q-checkbox__bg) {
    background: #047ce7;
    color: #047ce7;

    svg {
      color: #fff;
      padding: 2px;
    }
  }
}

.tip-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-bottom: 24px;
}

.landing-tip {
  color: #fae576;
  text-decoration: none;
  font-weight: 700;
}

.verify-btn {
  color: #21ef89;
  font-family: Poppins;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: -0.08%;
  text-align: right;
  text-transform: capitalize;
}


.bottom-btn {
  // margin-top: auto;
  padding: 3px 20px 8px;
}

.captcha-form-wrapper {
  background: #0b0e0d;

  :deep(.q-toolbar) {
    background: #232325;
  }
}
</style>
