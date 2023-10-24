<template>
  <div class="login-container">
    <div class="back-left">
      <router-link :to="'/landing'">
        <q-btn dense rounded icon="reply" class="bg-yellow text-black q-mt-sm" />
      </router-link>
    </div>

    <div class="logo">
      <img src="../assets/logo.png" />
    </div>

    <q-form class="q-gutter-y-md rounded-borders" @submit="onSubmit">
      <q-input
        ref="loginNameRef"
        hide-bottom-space
        v-model="regForm.loginName"
        label="Username"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Please insert username',
          (val) => (val && val.length >= 6 && val.length <= 11) || 'The characters of username must be between 6 and 11'
        ]"
        placeholder="Please Enter Account"
        color="white"
        class="landing-input"
        rounded
        outlined
        label-color="brand"
      />

      <q-input
        ref="pwdRef"
        hide-bottom-space
        v-model="regForm.password"
        label="Password"
        lazy-rules
        :type="isPwd ? 'password' : 'text'"
        :rules="[
          (val) => (val && val.length > 0) || 'Please insert password',
          (val) => (val.length >= 6 && val.length <= 11) || 'The characters of password must be between 6 and 11'
        ]"
        placeholder="Please Enter Password"
        color="white"
        class="landing-input"
        rounded
        outlined
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

      <q-input
        ref="confirmPwdRef"
        hide-bottom-space
        :type="isCfmPwd ? 'password' : 'text'"
        v-model="regForm.confirmPwd"
        label="Confirm Password"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Please insert password',
          (val) => val === regForm.password || 'Password does not match',
          (val) => (val.length >= 6 && val.length <= 11) || 'The characters of password must be between 6 and 11'
        ]"
        placeholder="Please Enter Password Again"
        color="white"
        class="landing-input"
        rounded
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
      </q-input>

      <q-input
        ref="verificationRef"
        hide-bottom-space
        clearable
        type="text"
        v-model="regForm.captchaCode"
        label="Verification Code"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Please insert verification code',
          (val) => (val && val.length > 3 && val.length < 5) || 'Verification code length is 4 characters'
        ]"
        placeholder="Please enter verification Code"
        label-color="brand"
        rounded
        outlined
        color="white"
        class="landing-input"
      >
        <template v-slot:append>
          <img :src="verificationImg" @click="getCode()" />
        </template>
      </q-input>

      <q-input
        v-if="!hasAffiliate"
        ref="affiliateCodeRef"
        hide-bottom-space
        v-model="regForm.referrer"
        label="Invitation Code"
        hint="Optional"
        label-color="brand"
        rounded
        outlined
        color="white"
        class="landing-input"
      />

      <div class="row items-center justify-between q-mt-sm">
        <div class="mui-row" :class="isAgreeReg ? 'checked' : ''">
          <q-checkbox rounded v-model="isAgreeReg" size="md" class="rmb-checked-box" color="yellow">
            I have Agree To The
            <a href="#" style="text-decoration: none; color: #fae576">Use Privacy Agreement</a>
          </q-checkbox>
        </div>
      </div>

      <div class="q-mt-xs">
        <q-btn
          @click.prevent="onSubmit"
          type="submit"
          class="btn-yellow"
          label="Register"
          rounded
          no-caps
          :disable="!isAgreeReg"
        />
      </div>

      <div class="tip-container">
        <router-link class="landing-tip" to="/login">Already A Member? Sign In Now</router-link>
      </div>
    </q-form>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { userStore } from "stores/index";
import qs from "qs";

export default defineComponent({
  name: "RegisterPage",
  setup() {
    onMounted(() => {
      getCode();
      getReferralCode();
      getAffiliateCode();
    });
    const store = userStore();
    const verificationImg = ref("");

    const captchaRef = ref();
    const innerCodeId = ref("");
    const innerCaptchaRef = ref("");
    const showCaptchaDialog = ref(false);
    const phoneVerificationImg = ref("");
    const isAgreeReg = ref(false);

    const regForm = reactive({
      loginName: "",
      password: "",
      confirmPwd: "",
      telephone: "",
      // email: "",
      captchaCode: "",
      regHost: location.hostname,
      codeId: "",
      codeAffiliate: "",
      referrer: "",
      smsCodeId: "",
      smsCode: ""
    });
    const getCode = () => {
      api
        .get("/member/verificationCode")
        .then((response) => {
          if (response.code === 0) {
            verificationImg.value = "data:image/png;base64," + response.data.img;
            regForm.codeId = response.data.id;
            regForm.captchaCode = "";
            verificationRef.value.resetValidation();
          }
        })
        .catch((e) => {
          console.log(e);
        });
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
      const affCode = sessionStorage.getItem("AFFILIATE_CODE");
      if (affCode) {
        hasAffiliate.value = true;
        regForm.codeAffiliate = affCode;
      }
    };
    const getReferralCode = () => {
      const refCode = sessionStorage.getItem("REFERRAL_CODE");
      if (refCode) {
        hasAffiliate.value = true;
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

    const router = useRouter();
    const onSubmit = () => {
      loginNameRef.value.validate();
      pwdRef.value.validate();
      confirmPwdRef.value.validate();
      // telRef.value.validate();
      // phoneVerificationRef.value.validate();
      // emailRef.value.validate();
      verificationRef.value.validate();
      $q.loading.show({
        message: "注册中"
      });
      if (
        loginNameRef.value.hasError ||
        pwdRef.value.hasError ||
        confirmPwdRef.value.hasError ||
        // telRef.value.hasError ||
        // phoneVerificationRef.value.hasError ||
        // emailRef.value.hasError ||
        verificationRef.value.hasError ||
        isAgreeReg.value === false
      ) {
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
                store.autoLogin(res.data);
                sessionStorage.removeItem("REFERRAL_CODE");
                if (store.hasToken()) {
                  // const jumpUrl = route.query.redirect ? route.query.redirect : "/";
                  // router.go(jumpUrl);
                  router.go("/");
                }

                sessionStorage.removeItem("REFERRAL_CODE");
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
          message: "手机号码不能为空",
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
          let message = res.message || "发送手机验证码成功",
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

    return {
      header: "注册账号",
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
      isAgreeReg
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
.page-header {
  background-image: linear-gradient(to right, #de4545, #db7e42);
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

.q-toolbar {
  background: #33bcd4;
}

.landing-input {
  :deep(.q-field__control) {
    padding-left: 20px;
    padding-right: 20px;
  }
  :deep(.q-field__control):before {
    border-color: #ffdd27;
    border-width: 2px;
  }
}

.rmb-checked-box {
  font-size: 14px;
  color: #91829d;
  margin-bottom: 8px;

  :deep(.q-checkbox__bg) {
    border-radius: 50%;
  }
  :deep(.q-checkbox__inner--truthy .q-checkbox__bg) {
    background: linear-gradient(180deg, #fed87d 0%, #e6a60c 100%);

    svg {
      color: #000;
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
</style>
