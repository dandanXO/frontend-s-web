<template>
  <div class="main-section">
    <q-form class="q-gutter-y-md rounded-borders q-pa-md q-ma-md register-form" @submit="onSubmit">
      <h5>{{ $t("lang.register") }}</h5>

      <div class="q-gutter-y-md">
        <q-input
          ref="loginNameRef"
          filled
          v-model="regForm.loginName"
          :label="$t('lang.input_username')"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || $t('lang.input_username_cannot_empty'),
            (val) => (val.length > 5 && val.length <= 12) || $t('lang.username_between_6_12'),
            (val) => val.match(/^[A-Za-z0-9]+$/) || $t('lang.only_letter_number_allowed')
          ]"
          color="white"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="person_outline" />
          </template>
        </q-input>

        <q-input
          ref="pwdRef"
          filled
          v-model="regForm.password"
          :type="isPwd ? 'password' : 'text'"
          :label="$t('lang.password')"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || $t('lang.input_password_empty'),
            (val) => (val.length > 5 && val.length <= 12) || $t('lang.password_between_6_12'),
            (val) =>
              (val && (pwdStrength == 'normal' || pwdStrength == 'strong')) || $t('lang.password_must_at_least_good')
          ]"
          color="white"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="lock_open" />
          </template>
          <template v-slot:append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
          </template>
        </q-input>
        <div v-if="regForm.password" class="password-str-div">
          <span
            :class="{
              'weak-pwd': pwdStrength == 'weak',
              'normal-pwd': pwdStrength == 'normal',
              'strong-pwd': pwdStrength == 'strong'
            }"
          >
            {{ $t("lang.weak_level") }}
          </span>
          <span
            :class="{
              'normal-pwd': pwdStrength == 'normal',
              'strong-pwd': pwdStrength == 'strong'
            }"
          >
            {{ $t("lang.medium_level") }}
          </span>
          <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">{{ $t("lang.strong_level") }}</span>
        </div>

        <q-input
          ref="confirmPwdRef"
          filled
          :type="isCfmPwd ? 'password' : 'text'"
          v-model="regForm.confirmPwd"
          :label="$t('lang.confirm_pass')"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || $t('lang.please_confirm_pass'),
            (val) => val === regForm.password || $t('lang.password_do_not_match'),
            (val) => (val.length > 5 && val.length <= 12) || $t('lang.password_between_6_12')
          ]"
          color="white"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="lock_open" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isCfmPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isCfmPwd = !isCfmPwd"
            />
          </template>
        </q-input>

        <q-input ref="telRef" filled v-model="regForm.telephone" :label="$t('lang.phone_number')" lazy-rules :rules="[
          (val) => (val && val.length > 0) || $t('lang.please_confirm_phone_number'),
          (val) =>
            (val && val.length > 7) ||
            $t('lang.please_enter_valid_phone'),
          isValidPhone
        ]" color="white" clearable>
          <template v-slot:prepend>
            <q-icon name="smartphone" />
          </template>
        </q-input>

        <div class="telephone-otp-row">
          <q-input ref="telOtpCodeRef" v-model="regForm.otpCode" :placeholder="$t('lang.one_time_otp')"
            :label="$t('lang.one_time_otp')" stack-label clearable autocomplete="off" filled  lazy-rules 
            :rules="[(val) => (val && val.length > 0) || $t('lang.otp_cannot_be_empty')]">
            <template v-slot:prepend>
              <q-icon name="security" />
            </template>
          </q-input>

          <q-btn class="common-large-btn third-btn" :label="$t('lang.request_otp_code')"
            @click="openTelephoneVerificationModal" />
        </div>

        <!--        <q-input-->
        <!--            ref="birthdayRef"-->
        <!--            filled-->
        <!--            v-model="regForm.birthday"-->
        <!--            :placeholder="$t('lang.dob')"-->
        <!--            color="white"-->
        <!--        >-->
        <!--          <template v-slot:prepend>-->
        <!--            <q-icon name="cake"/>-->
        <!--          </template>-->
        <!--          <template v-slot:append>-->
        <!--            <q-icon name="event" class="cursor-pointer">-->
        <!--              <q-popup-proxy-->
        <!--                  cover-->
        <!--                  transition-show="scale"-->
        <!--                  transition-hide="scale"-->
        <!--              >-->
        <!--                <q-date-->
        <!--                    v-model="regForm.birthday"-->
        <!--                    mask="YYYY-MM-DD"-->
        <!--                >-->
        <!--                  <div class="row items-center justify-end">-->
        <!--                    <q-btn-->
        <!--                        v-close-popup-->
        <!--                        :label="$t('lang.close_btn')"-->
        <!--                        color="primary"-->
        <!--                        flat-->
        <!--                    />-->
        <!--                  </div>-->
        <!--                </q-date>-->
        <!--              </q-popup-proxy>-->
        <!--            </q-icon>-->
        <!--          </template>-->
        <!--        </q-input>-->

        <!-- <q-input
          ref="emailRef"
          type="email"
          filled
          v-model="regForm.email"
          label="อีเมลล์"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'กรุณาใส่ที่อยู่อีเมลล์',
            isValidEmail
          ]"
          color="white"
        >
          <template v-slot:prepend>
            <q-icon name="mail_outline" />
          </template>
        </q-input> -->

        <q-input
          ref="verificationRef"
          filled
          class="verification-input"
          type="text"
          v-model="regForm.captchaCode"
          :label="$t('lang.captcha_code')"
          lazy-rules
          color="white"
          :rules="[(val) => (val && val.length > 3) || $t('lang.enter_captcha_code')]"
        >
          <template v-slot:append>
            <img :src="verificationImg" @click="getCode()" />
          </template>
          <template v-slot:prepend>
            <q-icon name="security" />
          </template>
        </q-input>

        <q-input
          ref="codeAffiliate"
          filled
          v-model="regForm.codeAffiliate"
          :label="$t('lang.affiliate_code')"
          color="white"
          :disable="hasAffiliate"
          clearable
          :hint="$t('lang.affiliate_code_hint')"
        >
          <template v-slot:prepend>
            <q-icon name="groups" />
          </template>
        </q-input>

        <div class="row justify-center items-center gap-8" style="margin-top: 35px">
          <!--          <q-btn @click="step == 1" color="warning" class="common-large-btn" rounded-->
          <!--                 :label="$t('lang.back')"/>-->
          <q-btn
            @click.prevent="onSubmit"
            :label="$t('lang.signup_now')"
            type="submit"
            color="brand"
            class="common-large-btn"
            rounded
          />
        </div>
      </div>
      <!--        </q-step>-->
      <!--      </q-stepper>-->
    </q-form>

    <q-dialog v-model="isTelephoneVerificationModalVisible" transition-show="slide-up" transition-hide="slide-down">
      <q-card class="q-pa-md">
        <div class="modal-head-title q-pb-md">
          {{ $t("lang.check_your_captcha_code") }}
        </div>
        <q-form class="q-gutter-sm">
          <q-input class="verification-input" ref="telephoneVerifyCaptchaCodeRef" filled type="text" maxlength="4"
            v-model="verifyTelephoneForm.telephoneVerifyCaptchaCode" :label="$t('lang.captcha_code')"
            :rules="[(val) => (val && val.length > 3) || $t('lang.enter_captcha_code')]" color="white">
            <template v-slot:append>
              <img :src="telephoneVerificationCaptchaImg" @click="getTelephoneVerificationImgCode()" />
            </template>
            <template v-slot:prepend>
              <q-icon name="security" />
            </template>
          </q-input>
          <q-btn :disabled="isOtpSending" :style="isOtpSending ? 'opacity: .6' : ''" class="common-btn verification-btn third-btn"
            @click.prevent="getOtpCode">
            {{ isOtpSending ? $t("lang.verifying") : $t("lang.confirm_button") }}
          </q-btn>
        </q-form>
      </q-card>
    </q-dialog>

    <div class="text-center q-mb-md">
      <router-link class="forget-pwd-tip" to="/login">
        {{ $t("lang.already_a_member_signin_now") }}
      </router-link>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { userStore } from "stores/index";
import { useRoute, useRouter } from "vue-router";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useI18n } from "vue-i18n";
import { useUI } from "stores/ui";
import vueI18n from "src/i18n";

export default defineComponent({
  name: "RegisterPage",
  setup() {
    const { t } = useI18n();
    const store = userStore();
    const siteId = process.env.SITEID;
    const qs = require("qs");

    onMounted(() => {
      getCode();
      getAffiliateCode();
      getReferralCode();
      // api
      //     .get(`/member/withdraw/banks?siteId=${siteId}`)
      //     .then((ret) => {
      //       const res = ret.data;
      //       if (res.code === 0) {
      //         bankCardModalState.banks.push(...res.data);
      //         selectBankType();
      //       }
      //     })
      //     .catch((e) => {
      //       console.log("error", e);
      //     });
    });
    // const step = ref(2);
    const done1 = ref(false);
    const done2 = ref(false);
    const imgURL = process.env.IMAGE_CDN + "/payment/";
    const verificationImg = ref("");
    const regForm = reactive({
      loginName: "",
      password: "",
      confirmPwd: "",
      telephone: "",
      otpCode: "",
      otpCodeId: "",
      // email: "",
      codeAffiliate: "",
      // cardAccountName: "",
      // cardAccountSurname: "",
      regHost: location.hostname,
      codeId: "",
      captchaCode: ""
      // birthday: ""
    });

    const verifyTelephoneForm = reactive({
      telephone: "",
      telephoneVerifyCaptchaCode: "",
      telephoneVerificationCaptchaCodeId: "",
    });

    const getCode = () => {
      api
        .get("/member/verificationCode")
        .then((res) => {
          const response = res.data;
          if (response.code === 0) {
            verificationImg.value = "data:image/png;base64," + response.data.img;
            regForm.captchaCode = "";
            regForm.codeId = response.data.id;
            verificationRef.value.resetValidation();
          }
        })
        .catch((e) => {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: e.message,
          //   icon: "report_problem"
          // });
        });
    };
    const telephoneVerificationCaptchaImg = ref("");
    const isOtpSending = ref(false);

    const isTelephoneVerificationModalVisible = ref(false);
    const openTelephoneVerificationModal = () => {
      telRef.value.validate();
      
      if(telRef.value.hasError) {
        return;
      }

      getTelephoneVerificationImgCode();
      isTelephoneVerificationModalVisible.value = true
    }


    const getTelephoneVerificationImgCode = () => {
      api
        .get("/member/verificationCode")
        .then((res) => {
          const response = res.data;
          if (response.code === 0) {
            telephoneVerificationCaptchaImg.value = "data:image/png;base64," + response.data.img;
            verifyTelephoneForm.telephoneVerificationCaptchaCodeId = response.data.id;
            verificationRef.value.resetValidation();
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

    const getOtpCode = () => {
      const isTelephoneVerifyCaptchaCodeValid = telephoneVerifyCaptchaCodeRef.value.validate();
      
      if(!isTelephoneVerifyCaptchaCodeValid) {
        return;
      }

      isOtpSending.value = true;
      regForm.otpCode = '';
      regForm.otpCodeId = '';
      const telephoneDetails = {
        telephone: regForm.telephone,
        codeId: verifyTelephoneForm.telephoneVerificationCaptchaCodeId,
        captchaCode: verifyTelephoneForm.telephoneVerifyCaptchaCode
      }
      api.post("/otp/sendSms", qs.stringify(telephoneDetails)).then((res) => {
        const ret = res.data
        if (ret.code === 0) {
          regForm.otpCodeId = ret.data.codeId;
          $q.notify({
            color: "positive",
            position: "top",
            message: t('lang.otp_code_has_been_sent_to_your_mobile_phone'),
            icon: "check_circle_outline"
          });
          isTelephoneVerificationModalVisible.value = false;
        }

        isOtpSending.value = false
      }).catch((e) => {
        isOtpSending.value = false
      });
    }

    const loginNameRef = ref();
    const pwdRef = ref();
    const confirmPwdRef = ref();
    const telRef = ref();
    const telOtpCodeRef = ref();
    const telephoneVerifyCaptchaCodeRef = ref();
    const emailRef = ref();
    const verificationRef = ref();
    const cardAccountNameRef = ref();
    const cardAccountSurnameRef = ref();
    // const birthdayRef = ref();
    const cardNumberRef = ref();
    const bankCardRef = ref();
    const $q = useQuasar();
    const ui = useUI();
    const pwdStrength = ref("");

    const isValidEmail = () => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(regForm.email) || t("lang.invalid_email");
    };

    const isValidPhone = () => {
      const phonePattern = /^\d+$/;
      return phonePattern.test(regForm.telephone) || t("lang.invalid_phone_num");
    };
    const router = useRouter();
    const onSubmit = () => {
      loginNameRef.value.validate();
      pwdRef.value.validate();
      confirmPwdRef.value.validate();
      telRef.value.validate();
      telOtpCodeRef.value.validate();
      // emailRef.value.validate();
      verificationRef.value.validate();
      $q.loading.show({
        message: t("lang.loading")
      });
      var qs = require("qs");
      if (
        loginNameRef.value.hasError ||
        pwdRef.value.hasError ||
        confirmPwdRef.value.hasError ||
        telRef.value.hasError ||
        telOtpCodeRef.value.hasError ||
        // emailRef.value.hasError ||
        verificationRef.value.hasError
      ) {
        $q.loading.hide();
      } else {
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
            .post("/member/fbRegister", qs.stringify(regForm))
            .then((ret) => {
              const res = ret.data;
              if (res.code === 0) {
                //Submit FB register Event.
                if (ui.isAffiliateA || ui.isAffiliateB) {
                  // console.log("Submit Event");
                  fbq("track", "CompleteRegistration", {
                    currency: vueI18n.global.locale.value,
                    value: 0.0
                  });
                }

                router.push("/login");
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: t("lang.register_successful"),
                  icon: "check_circle_outline"
                });
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
        if (pwd) {
          for (var i = 0, len = pwd.length; i < len; ++i) {
            result |= charType(pwd.charCodeAt(i));
          }
        }

        var level = 0;
        for (var i = 0; i <= 4; i++) {
          if (result & 1) {
            level++;
          }
          result = result >>> 1;
        }
        if (pwd && pwd.length >= 6) {
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

    const bankCardModalState = reactive({
      visible: false,
      banks: []
    });

    const banksList = ref([]);
    const selectedBankType = ref("Bank");
    const selectBankType = () => {
      regForm.bankId = "";
      banksList.value = [];
      bankCardModalState.banks.forEach((element) => {
        if (selectedBankType.value === "Bank" && element.bankType === "BANK") {
          banksList.value.push(element);
        }
        if (selectedBankType.value === "Crypto" && element.bankType === "CRYPTO") {
          const isCrypto = ref(true);
          banksList.value.push(element);
        }
        if (selectedBankType.value === "e-Wallet" && element.bankType === "EWALLET") {
          const isEWallet = ref(true);
          banksList.value.push(element);
        }
      });
    };

    let validateBankLength = (val) => {
      if (selectedBankType.value === "Bank") {
        return (val.length > 5 && val.length < 13) || t("lang.length_between_6_12");
      } else if (selectedBankType.value === "Crypto") {
        return (val.length > 33 && val.length < 38) || t("lang.length_between_34_37");
      }
    };
    const hasAffiliate = ref(false);
    const getAffiliateCode = () => {
      const affCode = sessionStorage.getItem("AFFILIATE_CODE");
      if (affCode) {
        hasAffiliate.value = true;
        regForm.codeAffiliate = affCode;
      }
    };
    const getReferralCode = () => {
      const refCode = sessionStorage.getItem("REFERRAL_CODE");
      if (refCode) {
        regForm.referrer = refCode;
      }
    };

    return {
      regForm,
      verificationImg,
      loginNameRef,
      pwdRef,
      confirmPwdRef,
      telRef,
      telOtpCodeRef,
      telephoneVerifyCaptchaCodeRef,
      emailRef,
      verificationRef,
      cardNumberRef,
      cardAccountNameRef,
      cardAccountSurnameRef,
      bankCardRef,
      onSubmit,
      isValidEmail,
      isValidPhone,
      isPwd: ref(true),
      isCfmPwd: ref(true),
      getCode,
      pwdStrength,
      selectBankType,
      selectedBankType,
      validateBankLength,
      banksList,
      imgURL,
      // step,
      done1,
      done2,
      hasAffiliate,
      getAffiliateCode,
      getReferralCode,
      telephoneVerificationCaptchaImg,
      isTelephoneVerificationModalVisible,
      openTelephoneVerificationModal,
      getTelephoneVerificationImgCode,
      isOtpSending,
      getOtpCode,
      verifyTelephoneForm
      // birthdayRef
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
<style lang="scss">
.verification {
  display: flex;
  padding: 10px;
}

.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.txt-center {
  text-align: center;
  padding: 0 10px;
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
    font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;
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

.forget-pwd-tip {
  color: $lightblue-color;
}

.register-form {
  .q-field--error .q-field__bottom {
    font-size: 15px;
  }

  max-width: 768px;
  margin: auto;

  .q-field--filled .q-field__control {
    border-radius: 8px;
  }

  .telephone-otp-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    .q-input {
      width: 100%;
    }
  }
}

.q-stepper {
  background: transparent;
  border: 0px;

  .q-stepper__step-inner {
    padding: 10px 0px 24px;
  }

  .q-stepper__header .q-stepper__tab {
    padding: 6px 12px;
    min-height: 40px;
    background: $primary;

    &.q-stepper__tab--active {
      background: $linear-bg-2;
    }
  }
}

h5 {
  font-size: 20px;
  margin-bottom: 12px;
  text-align: center;
}

.q-stepper--dark.q-stepper--horizontal .q-stepper__line:before,
.q-stepper--dark.q-stepper--horizontal .q-stepper__line:after {
  background: transparent;
}
</style>
