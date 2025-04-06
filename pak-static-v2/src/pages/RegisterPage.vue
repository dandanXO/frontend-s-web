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

  <div class="register-container">
    <!-- <div class="back-left">
      <router-link :to="'/landing'">
        <q-btn dense rounded icon="arrow_back_ios_new" class="q-mt-sm" />
      </router-link>
    </div> -->

    <div class="register-form-logo-img">
      <img src="../assets/images/auth/b9-logo.png" />
    </div>

    <div class="auth-tab-wrapper">
      <q-tabs v-model="regLoginTab" dense no-caps class="auth-tab-toggle" indicator-color="transparent" align="justify">
        <q-tab name="login" :label="$t('header.login')" />
        <q-tab name="register" :label="$t('header.register')" />
      </q-tabs>
    </div>

    <div class="register-form-wrapper">
      <q-form class="rounded-borders">
        <InputRowGrid>
          <template #fields>
            <InputField :label="$t('form.phone')">
              <template #input>
                <q-input
                  type="tel"
                  pattern="\d*"
                  maxlength="11"
                  ref="loginNameRef"
                  hide-bottom-space
                  v-model="regForm.loginName"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
                    (val) => (val && val.length === 11) || $t('form.phone_rules_01'),
                    (val) => val.startsWith('03') || $t('form.phone_rules_03')
                  ]"
                  outlined
                  label-color="brand"
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
                  ref="pwdRef"
                  hide-bottom-space
                  v-model="regForm.password"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[
                    (val) => (val && val.length > 0) || $t('form.password_rules_01'),
                    (val) => val.length > 6 || $t('form.password_rules_02')
                  ]"
                  outlined
                  label-color="brand"
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
                <!-- <div v-if="regForm.password" class="password-str-div">
                  <span
                    :class="{
                      'weak-pwd': pwdStrength == 'weak',
                      'normal-pwd': pwdStrength == 'normal',
                      'strong-pwd': pwdStrength == 'strong'
                    }"
                  >
                    Weak
                  </span>
                  <span
                    :class="{
                      'normal-pwd': pwdStrength == 'normal',
                      'strong-pwd': pwdStrength == 'strong'
                    }"
                  >
                    Good
                  </span>
                  <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">Strong</span>
                </div> -->
              </template>
            </InputField>

            <!-- <InputField :label="'Confirm Password'">
              <template #input>
                <q-input
                  ref="confirmPwdRef"
                  hide-bottom-space
                  :type="isCfmPwd ? 'password' : 'text'"
                  v-model="regForm.confirmPwd"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please insert password',
                    (val) => val === regForm.password || 'Password does not match'
                  ]"
                  color="green"
                  outlined
                  label-color="brand"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      color="gray-3"
                      :name="isCfmPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isCfmPwd = !isCfmPwd"
                    />
                  </template>
                </q-input>
              </template>
            </InputField> -->

            <!-- <InputField :label="'NRIC'">
              <template #input>
                <q-input
                  type="tel"
                  pattern="\d*"
                  maxlength="13"
                  ref="nricRef"
                  hide-bottom-space
                  v-model="regForm.nric"
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please insert NRIC',
                    (val) => (val && val.length === 13) || 'The NRIC must have 13 digits'
                  ]"
                  color="green"
                  outlined
                  label-color="brand"
                  placeholder="Please enter your NRIC"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
              </template>
            </InputField> -->
            <div style="visibility: hidden; position: absolute">
              <InputField :label="'Invitation Code (Optional)'">
                <template #input>
                  <q-input
                    v-if="!hasAffiliate"
                    ref="affiliateCodeRef"
                    hide-bottom-space
                    v-model="regForm.referrer"
                    label-color="brand"
                    outlined
                    placeholder="Enter Invitation Code (Optional)"
                  />
                </template>
              </InputField>
            </div>
          </template>
        </InputRowGrid>

        <!-- <div style="margin-top: 30px">
          <PrimaryButton :onClick="onSubmit" :label="'Register'" :disabled="!isAgreeReg" :loading="isLoading" />
        </div> -->

        <!--
          <div class="tip-container">
          <router-link class="landing-tip" to="/login">Already A Member? Sign In Now</router-link>
        </div>
      --></q-form>
    </div>

    <div class="bottom-btn">
      <q-btn
        no-caps
        unelevated
        class="btn-primary btn-primary__full"
        :disabled="!isAgreeReg"
        :loading="isLoading"
        @click="onSubmit"
      >
        {{ $t("btn.confirm") }}
      </q-btn>
    </div>

    <div class="mui-row q-mt-sm q-mx-sm" :class="isAgreeReg ? 'checked' : ''">
      <q-checkbox rounded v-model="isAgreeReg" size="md" class="rmb-checked-box">
        {{ $t("form.register_agree_01") }}
        <a href="#" style="text-decoration: none; color: #458bff">{{ $t("form.register_agree_02") }}</a>
      </q-checkbox>
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
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch, onActivated } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import qs from "qs";
// import PrimaryButton from "../components/auth/PrimaryButton.vue";
import InputField from "../components/auth/InputField.vue";
import InputRowGrid from "../components/auth/InputRowGrid.vue";
import { useUI } from "stores/ui";
import { cached, TIME_EXPIRED } from "boot/cache";
import { isAndroid, isInPwa, trackNewUserFtd } from "boot/utils";

export default defineComponent({
  name: "RegisterPage",
  methods: { isAndroid },
  components: {
    InputRowGrid,
    InputField
    // PrimaryButton
  },
  setup() {
    const ui = useUI();
    const store = userStore();
    const verificationImg = ref("");

    const captchaRef = ref();
    const innerCodeId = ref("");
    const innerCaptchaRef = ref("");
    const showCaptchaDialog = ref(false);
    const phoneVerificationImg = ref("");
    const isAgreeReg = ref(true);

    const affCode = ref("");
    const isLoading = ref(false);

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
      smsCode: ""
    });
    const getCode = () => {
      // api
      //   .get("/member/verificationCode")
      //   .then((response) => {
      //     if (response.code === 0) {
      //       verificationImg.value = "data:image/png;base64," + response.data.img;
      //       regForm.codeId = response.data.id;
      //       regForm.captchaCode = "0000";
      //       // verificationRef.value.resetValidation();
      //     }
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
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

    const getAffiliateCode = () => {
      affCode.value = sessionStorage.getItem("AFFILIATE_CODE");
      if (affCode.value) {
        // hasAffiliate.value = true;
        regForm.codeAffiliate = affCode.value;
      }
    };
    const getReferralCode = () => {
      const refCode = sessionStorage.getItem("REFERRAL_CODE");
      if (refCode) {
        // hasAffiliate.value = true;
        regForm.referrer = refCode;
      }
    };

    // const getReferralCode = () => {
    //   const refCode = sessionStorage.getItem("REFERRAL_CODE");
    //   if (refCode) {
    //     regForm.referrer = refCode;
    //   }
    // }
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
    onActivated(() => {
      getCode();
      getReferralCode();
      getAffiliateCode();
    });

    const trackRegisterSuccessEvent = () => {
      if (!ui.adjust_register_event) return;
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
      // nricRef.value.validate();

      $q.loading.show({
        message: "Registering in progress"
      });

      isLoading.value = true;

      if (
        loginNameRef.value.hasError ||
        pwdRef.value.hasError ||
        // nricRef.value.hasError ||
        isAgreeReg.value === false
      ) {
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
                  message: "Registered successfully",
                  icon: "check_circle_outline"
                });

                // FB Tracking.
                if (store.isFbPixel || store.isTkPixel) {
                  if (store.isFbPixel) {
                    fbq("track", "CompleteRegistration");
                  }
                  if (store.isTkPixel) {
                    ttq.track("CompleteRegistration", { content_type: "product" }, { event_id: Date.now() });
                  }

                  document.addEventListener("ftdSuccess", trackNewUserFtd);
                  if (isInPwa()) {
                    localStorage.setItem("newUserFtd", regForm.loginName);
                  } else {
                    sessionStorage.setItem("newUserFtd", regForm.loginName);
                  }
                  localStorage.setItem("REG_REFERRAL_CODE", regForm.referrer);
                }

                trackRegisterSuccessEvent();

                sessionStorage.removeItem("REFERRAL_CODE");

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

    // watch(
    //   () => regForm.password,
    //   () => {
    //     pwdStrength.value = "";

    //     var pwd = regForm.password;
    //     var result = 0;
    //     for (var i = 0, len = pwd.length; i < len; ++i) {
    //       result |= charType(pwd.charCodeAt(i));
    //     }

    //     var level = 0;
    //     for (var i = 0; i <= 4; i++) {
    //       if (result & 1) {
    //         level++;
    //       }
    //       result = result >>> 1;
    //     }
    //     if (pwd.length >= 6) {
    //       switch (level) {
    //         case 1:
    //           pwdStrength.value = "weak";
    //           break;
    //         case 2:
    //           pwdStrength.value = "normal";
    //           break;
    //         case 3:
    //         case 4:
    //           pwdStrength.value = "strong";
    //           break;
    //       }
    //     } else {
    //       pwdStrength.value = "weak";
    //     }
    //   }
    // );

    const openPhoneVeriDialog = () => {
      telRef.value.validate();
      if (!telRef.value.hasError) {
        showCaptchaDialog.value = true;
        getInnerCode();
      }
    };

    const onCaptchaSubmit = () => {
      if (!regForm.telephone) {
        $q.notify({
          color: "negative",
          position: "top",
          message: "Phone number cannot be empty",
          icon: "report_problem"
        });
        getInnerCode();
        return;
      }
      api
        .post(
          `/otp/sendSms`,
          qs.stringify({
            telephone: regForm.telephone,
            captchaCode: innerCaptchaRef.value,
            codeId: innerCodeId.value
          })
        )
        .then((res) => {
          let message = res.message || "OTP sent to phone successfully",
            color = "positive";

          if (res.code === 0) {
            showCaptchaDialog.value = false;
            regForm.smsCode = "";
            regForm.smsCodeId = res.data.codeId;
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
          getInnerCode();
        });
    };

    const isValidPhone = () => {
      const { phone } = formDetail;

      if (!phone) {
        return "Please Enter Phone Number";
      }

      const phoneRegex = /^\d{10,20}$/;
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
      openPhoneVeriDialog,
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
      downloadApp
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

.register-container {
  min-height: 100dvh;
  // padding: 16px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  background-color: #e9f2fd;
}

.back-left {
  position: fixed;
  top: 16px;
  left: 16px;
}

.register-form-logo-img {
  margin-top: -10px;
  padding: 0 16px;
  display: flex;
  justify-content: center;
  img {
    display: block;
    width: 100%;
    max-width: 140px;
    margin-bottom: 10px;
  }
}

.register-form-wrapper {
  padding: 0 20px 20px;

  :deep(.q-field__control) {
    height: 45px;

    .q-field__marginal {
      height: 45px;
    }
  }
}

.page-header {
  background-image: linear-gradient(to right, #de4545, #db7e42);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 28px;
  text-align: center;
  font-family: "Manrope", sans-serif;
  padding: 10px;
  display: flex;
  gap: 20px;
  align-content: center;
  justify-content: center;
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

.password-str-div {
  display: flex;
  align-items: center;
  margin-top: 3px;
  margin-bottom: 5px;
  justify-content: space-evenly;
  gap: 5px;
  height: 50px;

  span {
    padding: 8px 3px;
    //border: 1px solid #fff;
    border-radius: 5px;
    background: #434343;
    width: 33%;
    text-align: center;
  }

  span.weak-pwd {
    background: var(--q-negative);
  }

  span.normal-pwd {
    background: var(--q-warning);
    color: #000000;
  }

  span.strong-pwd {
    //background: linear-gradient(to right, #de4545, #db7e42) !important;
    background: var(--q-positive);
    font-weight: 600;
  }
}

.q-toolbar {
  background: #33bcd4;
}

.rmb-checked-box {
  font-size: 14px;
  color: #91829d;

  :deep(.q-checkbox__bg) {
    border-radius: 50%;
  }
  :deep(.q-checkbox__inner--truthy .q-checkbox__bg) {
    background: #458bff;
    color: #458bff;

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
  // margin-top: auto;
  padding: 3px 20px 8px;
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
    gap: 8px;
    color: #9f9f9f;
    font-size: 12px;
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
</style>
