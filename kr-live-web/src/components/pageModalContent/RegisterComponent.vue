<template>
  <div class="main-section">
    <q-form class="register-form" @keypress.enter="onSubmit">
      <div class="form-item">
        <label>{{ $t('lang.reg_referrer') }}</label>
        <q-input dense placeholder="추천인입력" ref="codeAffiliate" outlined v-model="regForm.codeAffiliate"
          :disable="hasAffiliate" clearable></q-input>
      </div>
      <div class="form-item">
        <label>{{ $t('lang.reg_userid') }}</label>
        <q-input dense ref="loginNameRef" outlined v-model="regForm.loginName" lazy-rules :rules="[
          (val) => (val && val.length > 0) || $t('lang.input_username_cannot_empty'),
          (val) => (val.length > 5 && val.length <= 12) || $t('lang.username_between_6_12'),
          (val) => val.match(/^[A-Za-z0-9]+$/) || $t('lang.only_letter_number_allowed')
        ]" clearable />
      </div>
      <div class="form-item">
        <label>{{ $t('lang.reg_pass') }}</label>
        <div>
          <q-input dense placeholder="비밀번호입력" ref="pwdRef" outlined v-model="regForm.password"
            :type="isPwd ? 'password' : 'text'" lazy-rules :rules="[
              (val) => (val && val.length > 0) || $t('lang.input_password_empty'),
              (val) => (val.length > 5 && val.length <= 12) || $t('lang.password_between_6_12')
              // (val) =>
              //   (val && (pwdStrength == 'normal' || pwdStrength == 'strong')) || $t('lang.password_must_at_least_good')
            ]" clearable>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
          <div v-if="regForm.password" class="password-str-div" style="display:none;">
            <span :class="{
              'weak-pwd': pwdStrength == 'weak',
              'normal-pwd': pwdStrength == 'normal',
              'strong-pwd': pwdStrength == 'strong'
            }">
              {{ $t("lang.weak_level") }}
            </span>
            <span :class="{
              'normal-pwd': pwdStrength == 'normal',
              'strong-pwd': pwdStrength == 'strong'
            }">
              {{ $t("lang.medium_level") }}
            </span>
            <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">{{ $t("lang.strong_level") }}</span>
          </div>
        </div>
      </div>
      <div class="form-item">
        <label>{{ $t('lang.reg_confirm_pass') }}</label>
        <q-input dense placeholder="비밀번호확인입력" ref="confirmPwdRef" outlined :type="isCfmPwd ? 'password' : 'text'"
          v-model="regForm.confirmPwd" lazy-rules :rules="[
            (val) => (val && val.length > 0) || $t('lang.please_confirm_pass'),
            (val) => val === regForm.password || $t('lang.password_do_not_match'),
            (val) => (val.length > 5 && val.length <= 12) || $t('lang.password_between_6_12')
          ]" clearable>
          <template v-slot:append>
            <q-icon :name="isCfmPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
              @click="isCfmPwd = !isCfmPwd" />
          </template>
        </q-input>
      </div>
      <div class="form-item">
        <label>{{ $t('lang.reg_email') }}</label>
        <q-input dense placeholder="이메일" ref="emailRef" type="email" outlined v-model="regForm.email" lazy-rules
          :rules="[(val) => (val && val.length > 0) || $t('lang.email_cannot_be_empty'), isValidEmail]" clearable />
      </div>
      <div class="form-item">
        <label>{{ $t('lang.reg_phone_num') }}</label>
        <q-input dense placeholder="없이 숫자 만 입력" ref="telRef" outlined v-model="regForm.telephone" lazy-rules :rules="[
          (val) => (val && val.length > 0) || $t('lang.please_confirm_phone_number'),
          (val) => (val && val.length > 7) || $t('lang.please_enter_valid_phone')
          // isValidPhone
        ]" clearable>
          <!-- <template v-slot:append>
            <div class="primary-button blue-square" :class="!regForm.telephone ? 'disabled' : ''"
              @click="openTelephoneVerificationModal">
              {{ $t('lang.reg_phone_verification') }}
            </div>
          </template> -->
        </q-input>
      </div>
      <!-- <div class="form-item">
        <label>{{ $t('lang.reg_phone_otp') }}</label>
        <div class="telephone-otp-row">
          <q-input dense ref="telOtpCodeRef" v-model="regForm.smsCode" :placeholder="'6자리 숫자'" stack-label clearable
            autocomplete="off" outlined lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('lang.otp_cannot_be_empty')]" />
        </div>
      </div> -->
      <div class="form-item">
        <label>{{ $t('lang.reg_bank') }}</label>
        <q-select dense outlined label="은행선택" ref="bankCardRef" v-model="regForm.bankId" :options="banksList"
          option-value="id" option-label="name" emit-value map-options lazy-rules
          :rules="[(val) => !!val || $t('lang.please_select_a_bank_account')]" />
      </div>
      <div class="form-item">
        <label>{{ $t('lang.reg_bank_acc_num') }}</label>
        <q-input dense type="number" placeholder="'-'없이숫자만입력." ref="cardNumRef" outlined v-model="regForm.cardNumber"
          lazy-rules clearable
          :rules="[(val) => (val && val.length > 0) || $t('lang.please_enter_card_num')]"></q-input>
      </div>
      <div class="form-item">
        <label>{{ $t('lang.reg_bank_acc_holder') }}</label>
        <q-input dense placeholder="2자이상한글,영문만가능(예금주는수정불가/고객센터문의)" ref="cardAccRef" outlined
          v-model="regForm.cardAccount" lazy-rules clearable
          :rules="[(val) => (val && val.length > 0) || $t('lang.card_account_cannot_empty')]"></q-input>
      </div>

    </q-form>

    <div class="action-buttons">
      <div @click="onSubmit" class="primary-button blue register-submit-btn" style="width:200px;">
        {{ $t('lang.reg_submit') }}
      </div>
    </div>

    <q-dialog v-model="isTelephoneVerificationModalVisible" transition-show="slide-up" transition-hide="slide-down"
      class="register-form-captcha-dialog">
      <q-card class="q-pa-md">
        <div class="modal-head-title q-pb-md">
          {{ $t("lang.reg_check_captcha") }}
        </div>
        <q-form class="q-gutter-sm">

          <div class="captcha-code">
            <q-input dense class="captcha-code-input" ref="telephoneVerifyCaptchaCodeRef" outlined type="text"
              maxlength="4" v-model="verifyTelephoneForm.telephoneVerifyCaptchaCode" :label="$t('lang.captcha_code')"
              :rules="[(val) => (val && val.length > 3) || $t('lang.reg_enter_captcha')]">
              <template v-slot:prepend>
                <q-icon name="security" />
              </template>
            </q-input>
            <div class="captcha-img-wrapper">
              <q-spinner-hourglass :color="'blue'" size="30px" v-if="captchaLoading" />
              <img v-else class="captcha-img" height="56px" :src="telephoneVerificationCaptchaImg"
                @click.prevent="getTelephoneVerificationImgCode" />
            </div>
          </div>
          <div class="row justify-center items-center gap-8" style="margin-top: 25px">
            <div :style="isOtpSending ? 'opacity: .6' : ''" class="primary-button blue"
              :class="isOtpSending ? 'disabled' : ''" @click.prevent="getOtpCode">
              {{ isOtpSending ? $t("lang.reg_captcha_verifying") : $t("lang.reg_captcha_confirm") }}
            </div>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform, SessionStorage } from "quasar";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUI } from "stores/ui";

export default defineComponent({
  name: "RegisterPage",
  emits: ["closeModal"],
  setup(_props, { emit }) {
    const { t } = useI18n();
    const store = userStore();
    const siteId = process.env.SITEID;
    const qs = require("qs");
    const captchaLoading = ref(false);

    onMounted(() => {
      //getCode();
      getAffiliateCode();
      getReferralCode();
      api
        .get(`/member/withdraw/banks?siteId=${siteId}`)
        .then((ret) => {
          const res = ret.data;
          if (res.code === 0) {
            bankCardModalState.banks.push(...res.data);
            selectBankType();
          }
        })
        .catch((e) => {
          console.log("error", e);
        });
    });
    const imgURL = process.env.IMAGE_CDN + "/payment/";
    const verificationImg = ref("");
    const regForm = reactive({
      loginName: "",
      password: "",
      confirmPwd: "",
      telephone: "",
      smsCode: "",
      smsCodeId: "",
      realName: "",
      email: "",
      cardNumber: "",
      cardAccount: "",
      codeAffiliate: "",
      regHost: location.hostname
    });

    const verifyTelephoneForm = reactive({
      telephone: "",
      telephoneVerifyCaptchaCode: "",
      telephoneVerificationCaptchaCodeId: ""
    });

    const openLogin = () => {
      router.push("/?page=login");
    };

    const telephoneVerificationCaptchaImg = ref("");
    const isOtpSending = ref(false);

    const isTelephoneVerificationModalVisible = ref(false);
    const openTelephoneVerificationModal = () => {
      if (!regForm.telephone) {
        return;
      }

      telRef.value.validate();

      if (telRef.value.hasError) {
        return;
      }

      getTelephoneVerificationImgCode();
      isTelephoneVerificationModalVisible.value = true;
    };

    const getTelephoneVerificationImgCode = () => {
      captchaLoading.value = true;

      api
        .get("/member/verificationEasyCode")
        .then((res) => {
          const response = res.data;
          if (response.code === 0) {
            telephoneVerificationCaptchaImg.value = "data:image/png;base64," + response.data.img;
            verifyTelephoneForm.telephoneVerificationCaptchaCodeId = response.data.id;
          }

          captchaLoading.value = false;
        })
        .catch((e) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: e.message,
            icon: "report_problem"
          });

          captchaLoading.value = false;
        }).finally(() => {
          captchaLoading.value = false;
        });;
    };

    const getOtpCode = () => {
      if (isOtpSending.value) {
        return;
      }

      const isTelephoneVerifyCaptchaCodeValid = telephoneVerifyCaptchaCodeRef.value.validate();

      if (!isTelephoneVerifyCaptchaCodeValid) {
        return;
      }

      isOtpSending.value = true;
      regForm.smsCode = "";
      regForm.smsCodeId = "";
      const telephoneDetails = {
        telephone: regForm.telephone,
        codeId: verifyTelephoneForm.telephoneVerificationCaptchaCodeId,
        captchaCode: verifyTelephoneForm.telephoneVerifyCaptchaCode
      };
      api
        .post("/otp/sendSms", qs.stringify(telephoneDetails))
        .then((res) => {
          const ret = res.data;
          if (ret.code === 0) {
            regForm.smsCodeId = ret.data.codeId;
            $q.notify({
              color: "positive",
              position: "top",
              message: t("lang.otp_code_has_been_sent_to_your_mobile_phone"),
              icon: "check_circle_outline"
            });
            isTelephoneVerificationModalVisible.value = false;
          }

          isOtpSending.value = false;
        })
        .catch((e) => {
          isOtpSending.value = false;
        });
    };

    const loginNameRef = ref();
    const pwdRef = ref();
    const confirmPwdRef = ref();
    const telRef = ref();
    const cardNumRef = ref();
    const cardAccRef = ref();
    const telOtpCodeRef = ref();
    const telephoneVerifyCaptchaCodeRef = ref();
    const emailRef = ref();
    const cardAccountNameRef = ref();
    const cardAccountSurnameRef = ref();
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
      const phonePattern = /^0[1-9][0-9]*$/;
      return phonePattern.test(regForm.telephone) || t("lang.invalid_phone_num");
    };
    const router = useRouter();
    const onSubmit = () => {
      loginNameRef.value.validate();
      pwdRef.value.validate();
      confirmPwdRef.value.validate();
      telRef.value.validate();
      // telOtpCodeRef.value.validate();
      emailRef.value.validate();
      cardNumRef.value.validate();
      cardAccRef.value.validate();
      bankCardRef.value.validate();
      $q.loading.show({
        message: t("lang.loading")
      });
      var qs = require("qs");
      if (
        loginNameRef.value.hasError ||
        pwdRef.value.hasError ||
        confirmPwdRef.value.hasError ||
        telRef.value.hasError ||
        // telOtpCodeRef.value.hasError ||
        emailRef.value.hasError ||
        cardNumRef.value.hasError ||
        cardAccRef.value.hasError ||
        bankCardRef.value.hasError
      ) {
        $q.loading.hide();
      } else {
        const sidParam = store.visitorId;
        (async () => {
          regForm.sid = sidParam;
          regForm.regDevice = $q.platform.is.mobile ? "H5" : "WEB";
          // regForm.realName= regForm.cardAccount

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
            .post("/member/register-with-bank-card", qs.stringify(regForm))
            .then((ret) => {
              const res = ret.data;
              if (res.code === 0) {
                SessionStorage.set("TOKEN", res.data);

                emit("closeModal");

                $q.notify({
                  color: "positive",
                  position: "top",
                  message: t("lang.register_successful"),
                  icon: "check_circle_outline"
                });

                setTimeout(() => {
                  router.push("/");
                  location.reload();
                }, 1000);
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
      cardNumRef,
      cardAccRef,
      // telOtpCodeRef,
      telephoneVerifyCaptchaCodeRef,
      emailRef,
      cardNumberRef,
      cardAccountNameRef,
      cardAccountSurnameRef,
      bankCardRef,
      onSubmit,
      isValidEmail,
      isValidPhone,
      isPwd: ref(true),
      isCfmPwd: ref(true),
      pwdStrength,
      selectBankType,
      selectedBankType,
      validateBankLength,
      banksList,
      imgURL,
      hasAffiliate,
      getAffiliateCode,
      getReferralCode,
      telephoneVerificationCaptchaImg,
      isTelephoneVerificationModalVisible,
      openTelephoneVerificationModal,
      getTelephoneVerificationImgCode,
      isOtpSending,
      getOtpCode,
      verifyTelephoneForm,
      openLogin,
      captchaLoading
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

<style lang="scss" scoped>
.register-form {
  // display: grid;
  // grid-auto-flow: column;
  // grid-gap: 20px;
  // grid-template-columns: repeat(2, 1fr);
  // grid-template-rows: repeat(5, auto);
  display: flex;
  flex-direction: column;
  gap: 20px;

  :deep(.q-field--filled.q-field--dark .q-field__control),
  :deep(.q-field--filled.q-field--dark .q-field__control:before) {
    width: 100%;
    font-size: 14px;
    border: 1px solid #48b5b5;
    line-height: 40px;
    color: #fff;
    background: #252e43;
    border-radius: 8px;
  }

  // @media (max-width: 768px) {
  //   grid-auto-flow: row;
  //   grid-template-columns: none;
  //   grid-template-rows: none;
  // }
}

.form-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  gap: 20px;

  label {
    text-align: right;
  }
}

.verification {
  display: flex;
  padding: 10px;
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

  .q-field--outlined .q-field__control {
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

.action-buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px;

  .register-submit-btn {
    width: 145px;
    height: 36px;
  }
}

.captcha-code {
  width: 100%;
  display: flex;
}

.captcha-code-input {
  margin-right: 16px;
  width: 100%;
}

.captcha-img-wrapper {
  min-width: 120px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  .captcha-img {
    border-radius: 8px;
    width: 100%;
    height: 100%;
  }
}
</style>
