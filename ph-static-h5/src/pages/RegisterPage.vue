<template>
  <div class="page-header">
    <img class="logo" width="120" src="../assets/logo.png" />
  </div>
  <q-form class="rounded-borders q-mx-md flex column q-gutter-y-sm register-page-form" @submit="onSubmit">
    <label class="field-label">Login name</label>
    <q-input
      autocomplete="off"
      ref="loginNameRef"
      v-model="regForm.loginName"
      label="Login name"
      lazy-rules
      :rules="[
        (val) => (val && val.length > 0) || 'Please enter a login name',
        (val) => val.match(/^[A-Za-z0-9]+$/) || 'Only alphabets and numbers are allowed'
      ]"
      rounded
      outlined
      clearable
    >
      <template v-slot:prepend>
        <q-icon name="person_outline" />
      </template>
    </q-input>

    <label class="field-label">Password</label>
    <q-input
      autocomplete="off"
      ref="pwdRef"
      v-model="regForm.password"
      label="Password"
      lazy-rules
      :type="isPwd ? 'password' : 'text'"
      :rules="[
        (val) => (val && val.length > 0) || 'Password is required',
        (val) => (val.length > 5 && val.length <= 12) || 'The password length should be between 6-12',
        (val) =>
          (val && (pwdStrength == 'normal' || pwdStrength == 'strong')) ||
          'The level of password security must be at least good.'
      ]"
      rounded
      outlined
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
    </div>

    <label class="field-label">Confirm Password</label>
    <q-input
      autocomplete="off"
      ref="confirmPwdRef"
      :type="isCfmPwd ? 'password' : 'text'"
      v-model="regForm.confirmPwd"
      label="Confirm Password"
      lazy-rules
      :rules="[
        (val) => (val && val.length > 0) || 'Please confirm your password.',
        (val) => val === regForm.password || 'Passwords are not the same',
        (val) => (val.length > 5 && val.length <= 12) || 'The password length should be between 6-12'
      ]"
      rounded
      outlined
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

    <label class="field-label">Complete Name (Including Surname)</label>
    <q-input
      autocomplete="off"
      ref="realNameRef"
      v-model="regForm.realName"
      label="Complete Name (Including Surname)"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please enter a complete name']"
      rounded
      outlined
    >
      <template v-slot:prepend>
        <q-icon name="person_outline" />
      </template>
    </q-input>

    <label class="field-label">Mobile Number</label>
    <q-input
      autocomplete="off"
      ref="telRef"
      v-model="regForm.telephone"
      label="Mobile Number"
      lazy-rules
      :rules="[
        (val) => (val && val.length > 0) || 'Please enter a phone number',
        (val) => (val && val.length > 7) || 'Please enter a valid phone number',
        isValidPhone
      ]"
      rounded
      outlined
    >
      <template v-slot:append>
        <q-btn
          :label="isOtpSending ? 'Sending' : 'Send OTP'"
          :disabled="isOtpSending || regForm.telephone === '' || disable30Sec"
          :style="isOtpSending || regForm.telephone === '' || disable30Sec ? 'opacity: .6; cursor: not-allowed' : ''"
          class="common-btn verification-btn"
          @click="openTelephoneVerificationModal"
        />
      </template>
      <template v-slot:prepend>
        <q-icon name="smartphone" />
        <span style="font-size: 16px">&nbsp;+63</span>
      </template>
    </q-input>
    <q-dialog v-model="isTelephoneVerificationModalVisible" transition-show="slide-up" transition-hide="slide-down">
      <q-card class="q-gutter-y-md rounded-borders q-pa-md">
        <q-input
          autocomplete="off"
          ref="telephoneVerifyCaptchaCodeRef"
          type="text"
          v-model="regForm.telephoneVerifyCaptchaCode"
          label="Verification Code"
          lazy-rules
          :rules="[(val) => (val && val.length > 3) || 'Please enter the verification code']"
          rounded
          outlined
        >
          <template v-slot:append>
            <img
              :src="telephoneVerificationCaptchaImg"
              @click="getTelephoneVerificationImgCode"
              class="cursor-pointer"
            />
          </template>
          <template v-slot:prepend>
            <q-icon name="security" />
          </template>
        </q-input>

        <div class="row justify-between items-center">
          <q-btn @click="getOtpCode" label="Confirm" type="button" color="brand" />
        </div>
      </q-card>
    </q-dialog>

    <label class="field-label">OTP Code</label>
    <q-input
      autocomplete="off"
      ref="otpCodeRef"
      v-model="regForm.smsCode"
      label="OTP Code"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please enter the OTP Code']"
      rounded
      outlined
    >
      <template v-slot:prepend>
        <q-icon name="security" />
      </template>
    </q-input>

    <!-- <label class="field-label">Email</label>
    <q-input
      autocomplete="off"
      ref="emailRef"
      type="email"
      v-model="regForm.email"
      label="Email"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please enter a valid email', isValidEmail]"
      rounded
      outlined
    >
      <template v-slot:prepend>
        <q-icon name="mail_outline" />
      </template>
    </q-input> -->

    <!-- <label class="field-label">Verification Code</label>
    <q-input
      autocomplete="off"
      ref="verificationRef"
      type="text"
      v-model="regForm.captchaCode"
      label="Verification Code"
      lazy-rules
      :rules="[(val) => (val && val.length > 3) || 'Please enter the verification code']"
      rounded
      outlined
    >
      <template v-slot:append>
        <img :src="verificationImg" @click="getCode" class="cursor-pointer" />
      </template>
      <template v-slot:prepend>
        <q-icon name="security" />
      </template>
    </q-input> -->

    <label class="field-label">Affiliate Code</label>
    <q-input
      autocomplete="off"
      ref="affiliateRef"
      type="text"
      v-model="regForm.codeAffiliate"
      label="Affiliate Code"
      lazy-rules
      rounded
      outlined
      :readonly="hasAffiliate === true ? true : false"
    >
      <template v-slot:prepend>
        <q-icon name="settings_accessibility" />
      </template>
    </q-input>

    <q-btn @click.prevent="onSubmit" label="Register" type="submit" class="submit-btn" />

    <div class="text-center q-mb-md">
      <router-link to="/login">
        <span class="info-text">Already a member ?</span>
        &nbsp;
        <span class="highlighted-text">Login Now</span>
      </router-link>
    </div>
  </q-form>

  <!-- <q-tabs v-model="tabActive" class="form-wrapped">
    <q-tab name="username" label="Username" />
    <q-tab name="mobile" label="Mobile" />
  </q-tabs>
  <q-separator />
  <q-tab-panels v-model="tabActive" animated>
    <q-tab-panel name="username">

    </q-tab-panel>
    <q-tab-panel name="mobile">
      <div>
        <q-form
          class="q-gutter-y-md rounded-borders q-pa-md q-ma-md"
          @submit="onSubmit"
        >
          <q-input
            autocomplete="off"
            ref="telRef"
            v-model="regForm.telephone"
            label="Mobile Number"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Please enter a phone number',
              (val) =>
                (val && val.length > 7) ||
                'Please enter a valid phone number',
              isValidPhone,
            ]"
            bg-color="white"
            outlined
          >
            <template v-slot:append>
              <q-btn
                :label="isOtpSending ? 'Sending' : 'Send OTP'"
                :disabled="
                  isOtpSending || regForm.telephone === '' || disable30Sec
                "
                :style="
                  isOtpSending || regForm.telephone === '' || disable30Sec
                    ? 'opacity: .6; cursor: not-allowed'
                    : ''
                "
                class="common-btn verification-btn"
                @click="getOtpCode"
              />
            </template>
            <template v-slot:prepend>
              <q-icon name="smartphone" />
              <span style="font-size: 16px">&nbsp;+63</span>
            </template>
          </q-input>
          <q-input
            autocomplete="off"
            ref="otpCodeRef"
            v-model="regForm.otpCode"
            label="OTP Code"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter the OTP Code',
            ]"
            bg-color="white"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="security" />
            </template>
          </q-input>
          <q-input
            autocomplete="off"
            ref="pwdRef"
            v-model="regForm.password"
            label="Password"
            lazy-rules
            :type="isPwd ? 'password' : 'text'"
            :rules="[
              (val) => (val && val.length > 0) || 'Password is required',
              (val) =>
                (val.length > 5 && val.length <= 12) ||
                'The password length should be between 6-12',
              (val) =>
                (val &&
                  (pwdStrength == 'normal' || pwdStrength == 'strong')) ||
                'The level of password security must be at least good.',
            ]"
            bg-color="white"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="lock_open" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <div v-if="regForm.password" class="password-str-div">
            <span
              :class="{
                'weak-pwd': pwdStrength == 'weak',
                'normal-pwd': pwdStrength == 'normal',
                'strong-pwd': pwdStrength == 'strong',
              }"
              >Weak</span
            >
            <span
              :class="{
                'normal-pwd': pwdStrength == 'normal',
                'strong-pwd': pwdStrength == 'strong',
              }"
              >Good</span
            >
            <span :class="{ 'strong-pwd': pwdStrength == 'strong' }"
              >Strong</span
            >
          </div>

          <q-input
            autocomplete="off"
            ref="confirmPwdRef"
            :type="isCfmPwd ? 'password' : 'text'"
            v-model="regForm.confirmPwd"
            label="Confirm Password"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Please confirm your password.',
              (val) =>
                val === regForm.password || 'Passwords are not the same',
              (val) =>
                (val.length > 5 && val.length <= 12) ||
                'The password length should be between 6-12',
            ]"
            bg-color="white"
            outlined
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
          <q-input
            autocomplete="off"
            ref="realNameRef"
            v-model="regForm.realName"
            label="Real name"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter a real name',
            ]"
            bg-color="white"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="person_outline" />
            </template>
          </q-input>
          <q-input
          autocomplete="off" ref="birthdayRef" filled v-model="regForm.birthday" placeholder="Birthday"
                      :rules="[
                        (val) => (val && val.length > 0) || 'Please enter your birthday'
                      ]">
                    <template v-slot:prepend>
                      <q-icon name="cake" />
                    </template>
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="regForm.birthday" mask="YYYY-MM-DD">
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>

          <q-input
            autocomplete="off"
            ref="emailRef"
            type="email"
            v-model="regForm.email"
            label="Email"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Please enter a valid email',
              isValidEmail,
            ]"
            bg-color="white"
            outlined
          >
            <template v-slot:prepend>
              <q-icon name="mail_outline" />
            </template>
          </q-input>
          <q-input
            autocomplete="off"
            ref="verificationRef"
            type="text"
            v-model="regForm.captchaCode"
            label="Verification Code"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 3) ||
                'Please enter the verification code',
            ]"
            bg-color="white"
            outlined
          >
            <template v-slot:append>
              <img :src="verificationImg" />
            </template>
            <template v-slot:prepend>
              <q-icon name="security" />
            </template>
          </q-input>

          <div class="row justify-between items-center">
            <q-btn
              @click.prevent="onSubmit"
              label="Register"
              type="submit"
              color="brand"
            />
          </div>
        </q-form>
      </div>
    </q-tab-panel>
  </q-tab-panels>-->
  <FooterArea />
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRouter, useRoute } from "vue-router";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import FooterArea from "components/FooterArea.vue";

import { getCodeDetail, charType } from "src/utils/helper";
import { useUI } from "stores/ui";
import { userStore } from "src/stores";

const isPwd = ref(true);
const isCfmPwd = ref(true);
const store = userStore();

const isOtpSending = ref(false);
const disable30Sec = ref(false);
const verificationImg = ref("");
const telephoneVerificationCaptchaImg = ref("");
const tabActive = ref("username");
const regForm = reactive({
  loginName: "",
  password: "",
  confirmPwd: "",
  realName: "",
  telephone: "",
  telephoneVerifyCaptchaCode: "",
  telephoneVerificationCaptchaCodeId: "",
  email: "",
  // captchaCode: "",
  regHost: location.hostname,
  // codeId: "",
  smsCodeId: "",
  smsCode: "",
  codeAffiliate: ""
});

const isTelephoneVerificationModalVisible = ref(false);
const openTelephoneVerificationModal = () => {
  getTelephoneVerificationImgCode();
  isTelephoneVerificationModalVisible.value = true;
};
const getTelephoneVerificationImgCode = async () => {
  regForm.telephoneVerifyCaptchaCode = "";
  const json = await getCodeDetail();

  if (json.isOk) {
    telephoneVerificationCaptchaImg.value = json.verificationImg;
    regForm.telephoneVerificationCaptchaCodeId = json.codeId;
  } else {
    $q.notify({
      color: "negative",
      position: "top",
      message: json.message,
      icon: "report_problem"
    });
  }
};
const getCode = async () => {
  const json = await getCodeDetail();

  if (json.isOk) {
    verificationImg.value = json.verificationImg;
    regForm.codeId = json.codeId;
  } else {
    $q.notify({
      color: "negative",
      position: "top",
      message: json.message,
      icon: "report_problem"
    });
  }
};

const getOtpCode = () => {
  const isTelephoneVerifyCaptchaCodeValid = telephoneVerifyCaptchaCodeRef.value.validate();

  if (!isTelephoneVerifyCaptchaCodeValid) {
    return;
  }

  isOtpSending.value = true;

  const telephoneDetails = {
    telephone: regForm.telephone,
    countryCode: "63",
    codeId: regForm.telephoneVerificationCaptchaCodeId,
    captchaCode: regForm.telephoneVerifyCaptchaCode
  };

  api
    .post("/otp/sendSms", qs.stringify(telephoneDetails))
    .then((res) => {
      if (res.code === 0) {
        regForm.smsCodeId = res.data.codeId;

        disableOtpBtn();

        isOtpSending.value = false;

        $q.notify({
          color: "positive",
          position: "top",
          message: "OTP Sent",
          icon: "check_circle_outline"
        });

        isTelephoneVerificationModalVisible.value = false;
      }
    })
    .catch((e) => {
      message.error(e.message);
      isOtpSending.value = false;
    });
};
const telephoneVerifyCaptchaCodeRef = ref();
const loginNameRef = ref();
const realNameRef = ref();
const pwdRef = ref();
const confirmPwdRef = ref();
const telRef = ref();
const otpCodeRef = ref();
// const birthdayRef = ref();
// const emailRef = ref();
const verificationRef = ref();
const $q = useQuasar();
const route = useRoute();
var qs = require("qs");
const ui = useUI();

const hasAffiliate = ref(false);

const pwdStrength = ref("");
const isValidEmail = () => {
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return emailPattern.test(regForm.email) || "Invalid email";
};

const isValidPhone = () => {
  const phonePattern = /^\d+$/;
  return phonePattern.test(regForm.telephone) || "Only numbers are allowed";
};

const disableOtpBtn = () => {
  disable30Sec.value = true;

  setTimeout(() => (disable30Sec.value = false), 30000);
};

const resetForm = () => {
  if (regForm.loginName) {
    regForm.loginName = "";
  }
  if (regForm.realName) {
    regForm.realName = "";
  }
  if (regForm.password) {
    regForm.password = "";
  }
  if (regForm.confirmPwd) {
    regForm.confirmPwd = "";
  }
  if (regForm.telephone) {
    regForm.telephone = "";
  }
  if (regForm.smsCode) {
    regForm.smsCode = "";
  }
  if (regForm.email) {
    regForm.email = "";
  }
  // if (regForm.captchaCode) {
  //   regForm.captchaCode = "";
  // }
  if (regForm.telephoneVerificationCaptchaCodeId) {
    regForm.telephoneVerificationCaptchaCodeId = "";
  }
  if (regForm.telephoneVerifyCaptchaCode) {
    regForm.telephoneVerifyCaptchaCode = "";
  }
  disable30Sec.value = false;
  isOtpSending.value = false;
};

const router = useRouter();
const onSubmit = () => {
  if (tabActive.value === "mobile") {
    regForm.loginName = regForm.telephone;
  }
  if (tabActive.value === "username") {
    loginNameRef.value.validate();
  }
  pwdRef.value.validate();
  confirmPwdRef.value.validate();
  telRef.value.validate();
  otpCodeRef.value.validate();
  // birthdayRef.value.validate();
  // emailRef.value.validate();
  // verificationRef.value.validate();
  $q.loading.show({
    message: "Registering"
  });
  if (
    (tabActive.value === "username" && loginNameRef.value.hasError) ||
    realNameRef.value.hasError ||
    pwdRef.value.hasError ||
    confirmPwdRef.value.hasError ||
    telRef.value.hasError ||
    otpCodeRef.value.hasError
    // birthdayRef.value.hasError ||
    // emailRef.value.hasError
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
        .then((res) => {
          if (res.code === 0) {
            if (ui.isAffiliateA) {
              fbq("track", "signup-success");
              fbq("track", "CompleteRegistration");
            } else if (ui.isAffiliate5D9325) {
              fbq("track", "signup-success");
              fbq("track", "CompleteRegistration");
            }
            $q.notify({
              color: "positive",
              position: "top",
              message: "Registration Success",
              icon: "check_circle_outline"
            });

            store.autoLogin(res.data);
            sessionStorage.removeItem("REFERRAL_CODE");
            // if (store.hasToken()) {
            nextTick(() => {
              const jumpUrl = route.query.redirect ? route.query.redirect : "/";
              router.push({ path: jumpUrl, query: { isFromRegister: true } });
            });
            // }
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
  }
};

onMounted(() => {
  // getCode();
  getAffiliateCode();
  getReferralCode();
});

const getAffiliateCode = () => {
  const affCode = sessionStorage.getItem("AFFILIATE_CODE");
  if (affCode) {
    hasAffiliate.value = true;
    regForm.codeAffiliate = affCode;
  }
};

const getReferralCode = () => {
  const referralCode = sessionStorage.getItem("REFERRAL_CODE");
  if (referralCode) {
    regForm.referrer = referralCode;
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

watch(() => tabActive.value, resetForm);
</script>
<style lang="scss" scoped>
.page-header {
  background-image: $primary-linear;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 28px;
  text-align: center;
  font-family: Wave;
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
    color: white;
  }

  span.weak-pwd {
    background: var(--q-negative);
  }

  span.normal-pwd {
    background: var(--q-warning);
  }

  span.strong-pwd {
    //background: linear-gradient(to right, #de4545, #db7e42) !important;
    background: var(--q-positive);
    font-weight: 600;
  }
}

.form-bg {
  // background: linear-gradient(180deg, rgb(255, 255, 255) 0%, #c0deff 164.44%);

  .q-tab-panels {
    background: transparent;
  }
}
</style>
