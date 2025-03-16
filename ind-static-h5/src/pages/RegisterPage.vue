<template>
  <div class="register-container">
    <!-- <div class="back-left">
      <router-link :to="'/landing'">
        <q-btn dense rounded icon="arrow_back_ios_new" class="text-white q-mt-sm" />
      </router-link>
    </div> -->

    <q-form class="q-gutter-y-md rounded-borders">
      <div class="register-form-grid">
        <!--        <span class="register-form-field-label">Phone Number</span>-->
        <q-input
          type="tel"
          pattern="\d*"
          maxlength="10"
          ref="loginNameRef"
          hide-bottom-space
          v-model="regForm.loginName"
          :rules="[
            (val) => (val && val.length > 0) || 'Please insert Phone number',
            (val) => (val && val.length === 10) || 'The phone number must have 10 digits'
          ]"
          color="white"
          class="landing-input"
          outlined
          placeholder="Enter your mobile number"
          label-color="brand"
        >
          <template v-slot:prepend>
            <img class="white-svg" src="../assets/images/auth/phone.svg" />
          </template>
          <template v-if="regForm.referrer" v-slot:append>
            <q-btn :disable="otpCountdown > 0" class="get-code-btn" @click="openPhoneVeriDialog">{{ otpCountdown > 0 ? `Get Code (${otpCountdown})` : 'Get Code' }}</q-btn>
          </template>
        </q-input>

        <!--        <span class="register-form-field-label">Password</span>-->
        <q-input
          ref="pwdRef"
          hide-bottom-space
          v-model="regForm.password"
          :rules="[
            (val) => (val && val.length > 0) || 'Please insert password',
            (val) => (val && val.length >= 6) || 'The characters of password must be above 6'
          ]"
          :type="isPwd ? 'password' : 'text'"
          color="white"
          class="landing-input"
          outlined
          placeholder="Enter Confirm Password"
          label-color="brand"
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

        <q-input
          v-if="regForm.referrer"
          pattern="\d*"
          maxlength="6"
          ref="verificationRef"
          hide-bottom-space
          v-model="regForm.smsCode"
          :rules="[
            (val) => (val && val.length > 0) || 'Please insert OTP number',
            (val) => (val && val.length === 6) || 'The OTP number must have 6 digits'
          ]"
          color="white"
          class="landing-input"
          outlined
          placeholder="Enter your OTP number"
          label-color="brand"
          :disable="isOtpEnable"
        >
          <template v-slot:prepend>
            <img class="white-svg" src="../assets/images/auth/otp.svg" />
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

        <!-- <span class="register-form-field-label">Confirm Password</span>
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
          color="white"
          class="landing-input"
          outlined
          label-color="brand"
        >
          <template v-slot:append>
            <q-icon
              color="gray-3"
              :name="isCfmPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isCfmPwd = !isCfmPwd"
            />
          </template>
        </q-input> -->

        <!--      <q-input-->
        <!--        ref="verificationRef"-->
        <!--        hide-bottom-space-->
        <!--        clearable-->
        <!--        type="text"-->
        <!--        v-model="regForm.captchaCode"-->
        <!--        label="Verification Code"-->
        <!--        lazy-rules-->
        <!--        :rules="[-->
        <!--          (val) => (val && val.length > 0) || 'Please insert verification code',-->
        <!--          (val) => (val && val.length > 3 && val.length < 5) || 'Verification code length is 4 characters'-->
        <!--        ]"-->
        <!--        placeholder="Please enter verification Code"-->
        <!--        label-color="brand"-->
        <!--        rounded-->
        <!--        outlined-->
        <!--        color="white"-->
        <!--        class="landing-input"-->
        <!--      >-->
        <!--        <template v-slot:append>-->
        <!--          <img :src="verificationImg" @click="getCode()" />-->
        <!--        </template>-->
        <!--      </q-input>-->

        <!-- <span class="register-form-field-label">Invitation Code (Optional)</span>
        <q-input
          v-if="!hasAffiliate"
          ref="affiliateCodeRef"
          hide-bottom-space
          v-model="regForm.referrer"
          label-color="brand"
          outlined
          color="white"
          class="landing-input"
        /> -->
      </div>

      <div class="" style="margin-top: 5px" :class="isAgreeReg ? 'checked' : ''">
        <q-checkbox rounded v-model="isAgreeReg" size="md" class="rmb-checked-box">
          I have Agree To The
          <a href="#" style="text-decoration: none; color: #c1dffc">Use Privacy Agreement</a>
        </q-checkbox>
      </div>

      <div style="margin-top: 0px">
        <q-btn @click="onSubmit" class="register-btn" label="Register" rounded no-caps :disable="!isAgreeReg">
          <template v-slot:loading>
            <q-spinner-hourglass size="24px" color="white" />
          </template>
        </q-btn>
      </div>

      <!--
        <div class="tip-container">
        <router-link class="landing-tip" to="/login">Already A Member? Sign In Now</router-link>
      </div>
    --></q-form>

    <div class="register-form-logo-img">
      <img src="../assets/55-ace-logo.png" />
    </div>

    <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss>
      <q-card class="captcha-form-wrapper" width="100%">
        <q-card-section class="q-pa-md bg-brightbtn text-white">
          <q-toolbar>
            <q-toolbar-title>Verification Code</q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar>
        </q-card-section>
        <div class="q-px-lg q-pt-sm q-pb-lg">
          <q-card-section class="q-mb-md q-pa-md">
            <q-input v-model="innerCaptchaRef" placeholder="Captcha Code">
              <template v-slot:append>
                <img
                  v-show="showImageCode"
                  :src="phoneVerificationImg"
                  @load="imgOnLoad"
                  @error="imgOnError"
                  title="Refresh Verification Code"
                  style="margin-top: 6px; cursor: pointer"
                  @click="getInnerCode"
                />
              </template>
            </q-input>
          </q-card-section>
          <q-btn class="get-code-btn" @click="onCaptchaSubmit" label="Send OTP" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onUnmounted, watch, onActivated } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { userStore } from "stores/index";
import qs from "qs";
import { useUI } from "stores/ui";
import { isAndroid, isInPwa } from "boot/utils";
// import { Adjust, AdjustEvent } from "@awesome-cordova-plugins/adjust";

export default defineComponent({
  name: "RegisterPage",
  setup() {
    const store = userStore();
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

    const regForm = reactive({
      loginName: "",
      password: "",
      confirmPwd: "",
      telephone: "",
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

    const router = useRouter();
    const ui = useUI();

    const affRegEvent = ref("");
    onActivated(() => {
      getCode();
      getReferralCode();
      getAffiliateCode();

      if (isInPwa()) {
        api.get(`/app/pwa/log?step=OPENREGISTER&siteCode=${process.env.SITE}`).then((res2) => {
          console.log("OPENREGISTER");
        });
      }
    });

    const trackRegisterSuccessEvent = () => {
      if (ui.adjust_register_event && isAndroid()) {
        var adjustEvent = new AdjustEvent(ui.adjust_register_event);
        Adjust.trackEvent(adjustEvent);
      } else if (ui.adjust_register_event) {
        console.log(ui.adjust_register_event);
        const AdjustWeb = require("@adjustcom/adjust-web-sdk");
        AdjustWeb.trackEvent({
          eventToken: ui.adjust_register_event
        });
      }
    };

    const onSubmit = () => {
      loginNameRef.value.validate();
      pwdRef.value.validate();
      // confirmPwdRef.value.validate();
      // telRef.value.validate();
      // phoneVerificationRef.value.validate();
      // emailRef.value.validate();
      verificationRef.value?.validate();

      $q.loading.show({
        message: "Registering in progress"
      });

      if (
        loginNameRef.value.hasError ||
        pwdRef.value.hasError ||
        // confirmPwdRef.value.hasError ||
        // telRef.value.hasError ||
        // phoneVerificationRef.value.hasError ||
        // emailRef.value.hasError ||
        verificationRef.value?.hasError ||
        isAgreeReg.value === false
      ) {
        $q.loading.hide();
      } else if (regForm.referrer && isOtpEnable.value){
        $q.notify({
          color: "negative",
          position: "top",
          message: "Please fill OTP number",
          icon: "report_problem"
        });
        $q.loading.hide();
      } else {
        var qs = require("qs");
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
          // regForm.sid = store.googleadid ? store.googleadid : store.aaid;
          if (store.googleadid) {
            regForm.sid = store.googleadid;
          } else if (store.aaid) {
            regForm.sid = store.aaid;
          } else {
            regForm.sid = "fp-" + sidParam;
            regForm.isfinger = "1";
          }

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

          if (!regForm.sid && (regForm.regDevice !== "ANDROID" || !affCode.value)) {
            regForm.sid = sidParam;
          }

          if (regForm.regHost.indexOf("http://localhost") > -1) {
            regForm.regHost = "app://";
          }

          if (isInPwa()) {
            api.get(`/app/pwa/log?step=SUBMITREGISTER&siteCode=${process.env.SITE}`).then((res2) => {
              console.log("SUBMITREGISTER");
            });
          }

          api
            .post("/member/indRegister", qs.stringify(regForm))
            .then((ret) => {
              const res = ret;
              // console.log("RET");
              // console.log(ret);
              if (res.code === 0) {
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: "Registered successfully",
                  icon: "check_circle_outline"
                });

                //FB Tracking.
                if (isInPwa()) {
                  if (store.isFbPixel) {
                    fbq("track", "CompleteRegistration", {
                      event_id: regForm.sid
                    });
                  }
                }

                //ADJUST TRACKEVENT.
                trackRegisterSuccessEvent();

                store.autoLogin(res.data);
                sessionStorage.removeItem("REFERRAL_CODE");
                if (store.hasToken()) {
                  router.push("/");
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
          getCode();
        })();
      }
    };

    watch(
      () => regForm.password,
      () => {
        pwdStrength.value = "";

        var pwd = regForm.password;
        var result = 0;
        for (var i = 0, len = pwd.length; i < len; ++i) {
          result |= charType(pwd.charCodeAt(i));
        }

        var level = 0;
        for (var i = 0; i <= 4; i++) {
          if (result & 1) {
            level++;
          }
          result = result >>> 1;
        }
        if (pwd.length >= 6) {
          switch (level) {
            case 1:
              pwdStrength.value = "weak";
              break;
            case 2:
              pwdStrength.value = "normal";
              break;
            case 3:
            case 4:
              pwdStrength.value = "strong";
              break;
          }
        } else {
          pwdStrength.value = "weak";
        }
      }
    );

    const isOtpEnable = ref(true);
    const openPhoneVeriDialog = () => {
      isOtpEnable.value = false;
      loginNameRef.value.validate();
      if (!loginNameRef.value.hasError) {
        showCaptchaDialog.value = true;
        getInnerCode();
      }
    };

    const onCaptchaSubmit = () => {
      if (!regForm.loginName) {
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
            telephone: regForm.loginName,
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

            // start otp countdown
            otpCountdown.value = res.data.second || 60;
            otpCountdownInterval.value = setInterval(() => {
              if(otpCountdown.value > 0) {
                otpCountdown.value = otpCountdown.value - 1;
              }
            },1000);
          } else {
            color = "negative";
            if(res.code === 1402) {
              message = `Please try again after ${res.data.second} seconds`;

               // start otp countdown
              otpCountdown.value = res.data.second || 60;
              otpCountdownInterval.value = setInterval(() => {
                if(otpCountdown.value > 0) {
                  otpCountdown.value = otpCountdown.value - 1;
                }
              },1000);
            }
            getInnerCode();
          }

          if (message) {
            $q.notify({ message, color, position: 'top' });
          }

          console.log("onCaptchaSubmit", res);
        })
        .catch((a) => {
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

      return isValid ? true : "Phone Number must be 10 digits or more";
    };

    const imgOnLoad = () => (showImageCode.value = true);
    const imgOnError = () => (showImageCode.value = false);

    watch(() => otpCountdown.value, () => {
      if(otpCountdown.value === 0) {
        clearInterval(otpCountdownInterval.value);
      }
    })

    onUnmounted(() => {
      clearInterval(otpCountdownInterval.value);
    })

    return {
      header: "Register Account",
      regForm,
      verificationImg,
      loginNameRef,
      pwdRef,
      confirmPwdRef,
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
      showImageCode,
      imgOnLoad,
      imgOnError,
      otpCountdown,
      otpCountdownInterval,
      isOtpEnable
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
.register-container {
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

.register-form-logo-img {
  img {
    display: block;
    width: 95%;
    margin: 20px auto;
    max-width: 200px;
  }
}
.register-form-grid {
  display: grid;
  grid-auto-flow: row;
  gap: 7px;

  .register-form-field-label {
    margin-top: 15px;
  }
}
.register-btn {
  background-color: #8b00ff;
  width: 100%;
  height: 56px;
  border-radius: 4px;
  margin-top: 10px;
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
    color: var(--q-primary);
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

  :deep(.q-checkbox__bg) {
    border-radius: 50%;
  }
  :deep(.q-checkbox__inner--truthy .q-checkbox__bg) {
    background: #8b00ff;

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

.get-code-btn {
  background-color: #3b156e;
  color: #fff;
}

.captcha-form-wrapper {
  background: #000;

  .q-toolbar {
    background: linear-gradient(180deg, #3e1474 0%, #101114 96.35%);
  }
}
</style>
