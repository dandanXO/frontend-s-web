<template>
  <div class="login-container">
    <div class="login-panel">
      <h2 class="title">{{ $t("header.register") }}</h2>
      <div class="subtitle">
        {{ $t("form.alreadyHaveAnAcc") }}
        <div class="link" @click="uiStore.loginView = 'login'">{{ $t("form.login") }}</div>
      </div>

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
          (val) => (val && val.length >= 8 && val.length <= 11) || $t('form.phone_rules_02'),
          (val) => (val && /^[0-9]*$/.test(val)) || $t('form.phone_rules_04')
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

      <div class="" style="margin-top: 5px" :class="isAgreeReg ? 'checked' : ''">
        <q-checkbox v-model="isAgreeReg" class="reg-checked-box" rounded size="md">
          {{ $t("form.register_agree_01") }}
          <a href="#" style="text-decoration: none; color: #00fd7c">{{ $t("form.register_agree_02") }}</a>
        </q-checkbox>
      </div>

      <q-btn unelevated class="bg-greenbtn" :label="$t('header.register')" no-caps padding="12px" @click="register" />
    </div>
  </div>
</template>
<script setup>
import { ref, onActivated, onMounted } from "vue";
import { userStore } from "stores/index";
import { useUI } from "stores/ui";
import { useQuasar, Platform } from "quasar";
import { useRouter } from "vue-router";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { api } from "boot/axios";
import { isAndroid } from "boot/utils";
import { useGtag } from "vue-gtag-next";

const store = userStore();
const $q = useQuasar();
const uiStore = useUI();
const router = useRouter();
const gtag = useGtag();

const phoneRef = ref();
const passwordRef = ref();

const phone = ref("");
const password = ref("");
const isShowPassword = ref(false);
const isAgreeReg = ref(true);

const codeAffiliate = ref("");
const referrer = ref("");

const captchaCode = ref("0000");
const codeId = ref("");

let sid = "";
let isfinger = "";
let regDevice = "";
let regHost = location.hostname;

const register = () => {
  phoneRef.value.validate();
  passwordRef.value.validate();

  if (phoneRef.value.hasError || passwordRef.value.hasError || isAgreeReg.value === false) {
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

      api
        .post(
          "/member/indRegister",
          qs.stringify({
            loginName: phone.value,
            telephone: phone.value,
            password: password.value,
            captchaCode: captchaCode.value,
            codeId: codeId.value,
            codeAffiliate: codeAffiliate.value,
            referrer: referrer.value,
            sid,
            isfinger,
            regDevice,
            regHost
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

            // gtag.event("register", {
            //   custom_user_id: store.nickName,
            //   event_callback: () => {
            //     uiStore.loginView = "regSuccess";
            //   }
            // });

            // setTimeout(() => {
            //   uiStore.loginView = "regSuccess";
            // }, 1000);

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
