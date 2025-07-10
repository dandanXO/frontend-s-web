<template>
  <div class="login-container">
    <div class="login-panel">
      <h2 class="title">{{ $t("header.register") }}</h2>
      <div class="subtitle">
        {{ $t("form.alreadyHaveAnAcc") }}
        <div class="link" @click="uiStore.loginView = 'login'">{{ $t("form.login") }}</div>
      </div>

      <q-input
        ref="firstNameRef"
        outlined
        v-model="firstName"
        :placeholder="$t('form.firstName_placeholder')"
        class="input"
        :class="{ 'white-txt': !!firstName }"
        lazy-rules
        :rules="[
          (val) => (val && val.trim().length > 0) || $t('form.firstName_rules_01'),
          (val) => val.trim().length >= 2 || $t('form.firstName_rules_02'),
          (val) => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(val) || $t('form.firstName_rules_03')
        ]"
      >
        <template v-slot:prepend>
          <img v-if="!firstName" src="../../../assets/images/auth/profile-icon.png" width="22px" />
          <img v-else src="../../../assets/images/auth/profile-icon-active.png" width="22px" />
        </template>
      </q-input>

      <q-input
        ref="lastNameRef"
        outlined
        v-model="lastName"
        :placeholder="$t('form.lastName_placeholder')"
        class="input"
        :class="{ 'white-txt': !!lastName }"
        lazy-rules
        :rules="[
          (val) => (val && val.trim().length > 0) || $t('form.lastName_rules_01'),
          (val) => val.trim().length >= 2 || $t('form.lastName_rules_02'),
          (val) => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(val) || $t('form.lastName_rules_03')
        ]"
      >
        <template v-slot:prepend>
          <img v-if="!lastName" src="../../../assets/images/auth/profile-icon.png" width="22px" />
          <img v-else src="../../../assets/images/auth/profile-icon-active.png" width="22px" />
        </template>
      </q-input>

      <!-- <q-input
        ref="emailRef"
        outlined
        v-model="email"
        :placeholder="$t('form.email_placeholder')"
        class="input"
        :class="{ 'white-txt': !!email }"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || $t('form.email_rules_01'),
          (val) => val.length >= 6 || $t('form.email_rules_02'),
          (val) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val) || $t('form.email_rules_03')
        ]"
      >
        <template v-slot:prepend>
          <img v-if="!email" src="../../../assets/images/auth/email-icon.png" width="22px" />
          <img v-else src="../../../assets/images/auth/email-icon-active.png" width="22px" />
        </template>
      </q-input> -->

      <q-input
        ref="phoneRef"
        v-model="phone"
        class="input"
        :class="{ 'white-txt': !!phone }"
        :placeholder="$t('form.phone_placeholder')"
        outlined
        type="tel"
        inputmode="numeric"
        pattern="[0-9]*"
        oninput="this.value = this.value.replace(/[^0-9]/g, '')"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || $t('form.phone_rules_01'),
          (val) => (val.length >= 8 && val.length <= 11) || $t('form.phone_rules_02'),
          (val) => /^[0-9]*$/.test(val) || $t('form.phone_rules_04')
        ]"
      >
        <template v-slot:prepend>
          <!-- <img v-if="!phone" src="../../../assets/images/auth/acc-icon.png" width="22px" /> -->
          <!-- <img v-else src="../../../assets/images/auth/acc-icon-active.png" width="22px" /> -->
          <img src="../../../assets/images/auth/phone-br.svg" width="17px" />
          &nbsp;+55
        </template>
      </q-input>

      <q-input
        ref="passwordRef"
        outlined
        v-model="password"
        :placeholder="$t('form.password_placeholder')"
        :type="!isShowPassword ? 'password' : 'text'"
        class="input"
        :class="{ 'white-txt': !!password }"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || $t('form.password_rules_01'),
          (val) => val.length >= 6 || $t('form.newPassword_rules_02')
        ]"
      >
        <template v-slot:prepend>
          <img v-if="!password" src="../../../assets/images/auth/lock-icon.png" width="22px" />
          <img v-else src="../../../assets/images/auth/lock-icon-active.png" width="22px" />
        </template>
        <template v-slot:append>
          <img
            v-if="!isShowPassword"
            class="password-icon"
            src="../../../assets/images/auth/show-pw-icon.png"
            width="20px"
            @click="isShowPassword = !isShowPassword"
          />
          <img
            v-else
            class="password-icon"
            src="../../../assets/images/auth/hide-pw-icon.png"
            width="20px"
            @click="isShowPassword = !isShowPassword"
          />
        </template>
      </q-input>

      <q-input
        ref="taxIdRef"
        outlined
        v-model="taxId"
        :placeholder="$t('form.taxId_placeholder')"
        class="input"
        :class="{ 'white-txt': !!taxId }"
        lazy-rules
        :rules="[
          (val) => (!!val && val.length > 0) || 'Por favor, insira o número do CPF',
          (val) => val.length >= 6 || 'O número do CPF deve ter 11 dígitos',
          (val) => validateCPF(val) || 'Formato do número do CPF está incorreto.'
        ]"
      >
        <template v-slot:prepend>
          <img v-if="!taxId" src="../../../assets/images/auth/tax-icon.png" width="22px" />
          <img v-else src="../../../assets/images/auth/tax-icon-active.png" width="22px" />
        </template>
      </q-input>

      <div class="" style="margin-top: 5px" :class="isAgreeReg ? 'checked' : ''">
        <q-checkbox v-model="isAgreeReg" class="reg-checked-box" rounded size="md">
          {{ $t("form.register_agree_01") }}
          <a href="#" style="text-decoration: none; color: #00fd7c">{{ $t("form.register_agree_02") }}</a>
        </q-checkbox>
      </div>

      <q-btn
        unelevated
        class="bg-greenbtn reg-bonus-flag-btn"
        :label="$t('header.register')"
        no-caps
        padding="12px"
        @click="register"
      />
    </div>
  </div>
</template>
<script setup>
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { api } from "boot/axios";
import { generateEventID, isAndroid } from "boot/utils";
import { Platform, SessionStorage, useQuasar } from "quasar";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const store = userStore();
const $q = useQuasar();
const uiStore = useUI();
const router = useRouter();

const phoneRef = ref();
const passwordRef = ref();
const emailRef = ref();
const taxIdRef = ref();
const firstNameRef = ref();
const lastNameRef = ref();
const realNameRef = ref();

const phone = ref("");
const password = ref("");
const isShowPassword = ref(false);
const isAgreeReg = ref(true);

const taxId = ref("");
const realName = ref("");
const firstName = ref("");
const lastName = ref("");
const email = ref("");

const codeAffiliate = ref("");
const referrer = ref("");

const captchaCode = ref("0000");
const codeId = ref("");

const fbc = ref("");
const fbp = ref("");

let sid = "";
let isfinger = "";
let regDevice = "";
let regHost = location.hostname;

const getFbValue = () => {
  const fbclid2 = window.localStorage.getItem("fbclid");

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp(name + "=([^;]+)"));
    return match ? decodeURIComponent(match[1]) : "";
  };

  const getFbclid = () => {
    return sessionStorage.getItem("fbc3") || "";
  };

  const fbc3 = getFbclid();

  const getFbClientId = () => {
    let result = /_fbp=(fb\.1\.\d+\.\d+)/.exec(window.document.cookie);
    if (!(result && result[1])) {
      return null;
    }
    return result[1];
  };

  const fbc1 = () => {
    const rawFbp = getCookie("_fbc");
    return rawFbp ? rawFbp : null;
  };

  const fbp1 = (() => {
    const rawFbp = getCookie("_fbp");
    return rawFbp ? rawFbp : null;
  })();

  const fbp2 = (() => {
    const rawFbp = getFbClientId();
    return rawFbp ? rawFbp : null;
  })();

  const randUuid = generateEventID();

  fbp.value = fbp1 || fbp2 || "";
  fbc.value = fbclid2 || fbc1 || fbc3 || randUuid;
};

const register = () => {
  phoneRef.value.validate();
  passwordRef.value.validate();
  firstNameRef.value.validate();
  lastNameRef.value.validate();
  // emailRef.value.validate();
  taxIdRef.value.validate();

  if (
    taxIdRef.value.hasError ||
    firstNameRef.value.hasError ||
    lastNameRef.value.hasError ||
    taxIdRef.value.hasError ||
    phoneRef.value.hasError ||
    passwordRef.value.hasError ||
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
      // sid = store.googleadid ? store.googleadid : store.aaid;
      if (store.googleadid) {
        sid = store.googleadid;
      } else if (store.aaid) {
        sid = store.aaid;
      } else {
        sid = "fp-" + sidParam;
        isfinger = "1";
      }

      regDevice = $q.platform.is.mobile ? "H5" : "WEB";
      if ("standalone" in window.navigator && window.navigator.standalone) {
        regDevice = "IOS";
      } else {
        regDevice = Platform.is.mobile ? "H5" : "WEB";
        if (Platform.is.capacitor) {
          if (Platform.is.android) {
            regDevice = "ANDROID";
          }
        }
      }

      if (!sid && (regDevice !== "ANDROID" || !affCode.value)) {
        sid = sidParam;
      }

      if (regHost.indexOf("http://localhost") > -1) {
        regHost = "app://";
      }

      getFbValue();

      api
        .post(
          "/member/indRegister",
          qs.stringify({
            loginName: phone.value,
            telephone: phone.value,
            password: password.value,
            taxId: taxId.value,
            realName: `${firstName.value},${lastName.value}`,
            // email: email.value,
            captchaCode: captchaCode.value,
            codeId: codeId.value,
            codeAffiliate: codeAffiliate.value,
            referrer: referrer.value,
            sid,
            isfinger,
            regDevice,
            regHost,
            fbc: fbc.value,
            fbp: fbp.value
          })
        )
        .then((ret) => {
          const res = ret;
          if (res.code === 0) {
            $q.notify({
              color: "positive",
              position: "top",
              message: "Registrado com sucesso",
              icon: "check_circle_outline"
            });

            //ADJUST TRACKEVENT.
            trackRegisterSuccessEvent();

            store.autoLogin(res.data);
            sessionStorage.removeItem("REFERRAL_CODE");
            if (store.hasToken()) {
              router.push("/");
            }
            // uiStore.loginView = "";
            isAgreeReg.value = false;
            // location.href = "/";

            SessionStorage.set("user-info", {
              account: phone.value,
              type: "register"
            });

            uiStore.loginView = "regSuccess";
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

const trackRegisterSuccessEvent = () => {
  if (uiStore.adjust_register_event && isAndroid()) {
    var adjustEvent = new AdjustEvent(uiStore.adjust_register_event);
    Adjust.trackEvent(adjustEvent);
  } else if (uiStore.adjust_register_event) {
    console.log(uiStore.adjust_register_event);
    const AdjustWeb = require("@adjustcom/adjust-web-sdk");
    AdjustWeb.trackEvent({
      eventToken: uiStore.adjust_register_event
    });
  }
};

const validateCPF = (input_cpf) => {
  if (!input_cpf) return false;

  const input = input_cpf.toString().replace(/\D/g, ""); // 去除非数字
  if (input.length !== 11 || /^(\d)\1{10}$/.test(input)) return false; // 排除重复数字

  const pesosA = [10, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesosB = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(input[i]) * pesosA[i];
  }

  let x1 = sum % 11;
  x1 = x1 < 2 ? 0 : 11 - x1;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(input[i]) * pesosB[i];
  }

  let x2 = sum % 11;
  x2 = x2 < 2 ? 0 : 11 - x2;

  return x1 === parseInt(input[9]) && x2 === parseInt(input[10]);
};

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

const getAffiliateCode = () => {
  const affCode = sessionStorage.getItem("AFFILIATE_CODE");
  if (affCode) {
    codeAffiliate.value = affCode;
  }
};
const getReferralCode = () => {
  const refCode = sessionStorage.getItem("REFERRAL_CODE");
  if (refCode) {
    referrer.value = refCode;
  }
};

onMounted(() => {
  getCode();
  getReferralCode();
  getAffiliateCode();
});
</script>
<style lang="scss" scoped>
.bg-greenbtn {
  margin-top: 50px;
}
.reg-checked-box {
  margin-top: 0;
}

.reg-bonus-flag-btn {
  &::after {
    width: 150px;
    right: 10px;
  }
}

:deep(.reg-checked-box) {
  .q-checkbox__truthy {
    stroke: #1f241f;
  }
  .q-checkbox__inner--truthy {
    color: #00fd7c;
  }

  .q-checkbox__bg {
    color: #00fd7c;
  }
}
</style>
