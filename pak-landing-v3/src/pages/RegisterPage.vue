<template>
  <div class="register-container">
    <div class="auth-tab-wrapper">
      <q-tabs v-model="regLoginTab" dense no-caps class="auth-tab-toggle" indicator-color="transparent" align="justify">
        <q-tab name="register" label="Register" />
      </q-tabs>
    </div>

    <div class="register-form-wrapper">
      <q-form class="rounded-borders">
        <InputRowGrid>
          <template #fields>
            <InputField label="Phone">
              <template #input>
                <q-input
                  type="tel"
                  pattern="\d*"
                  maxlength="11"
                  ref="loginNameRef"
                  hide-bottom-space
                  v-model="regForm.loginName"
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please insert Phone number',
                    (val) => (val && val.length === 11) || 'Please insert Phone number',
                    (val) => val.startsWith('03') || 'The phone number must start with 03'
                  ]"
                  color="green"
                  outlined
                  label-color="brand"
                  placeholder="Please enter your mobile number"
                >
                  <template v-slot:prepend>
                    <q-icon name="smartphone" />
                    <div class="prepend-number">+92</div>
                  </template>
                </q-input>
              </template>
            </InputField>

            <InputField label="Password">
              <template #input>
                <q-input
                  ref="pwdRef"
                  hide-bottom-space
                  v-model="regForm.password"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please insert password',
                    (val) => val.length > 6 || 'The characters of password must be above 6'
                  ]"
                  color="green"
                  outlined
                  label-color="brand"
                  placeholder="Please enter password"
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
              </template>
            </InputField>

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
                    color="green"
                    placeholder="Enter Invitation Code (Optional)"
                  />
                </template>
              </InputField>
            </div>
          </template>
        </InputRowGrid>
      </q-form>
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
  </div>
</template>

<script>
import { api } from "boot/axios";
import { isAndroid } from "boot/utils";
import { Platform, useQuasar } from "quasar";
import { userStore } from "stores/index";
import { defineComponent, onActivated, reactive, ref } from "vue";
import InputField from "../components/auth/InputField.vue";
import InputRowGrid from "../components/auth/InputRowGrid.vue";

export default defineComponent({
  name: "RegisterPage",
  methods: { isAndroid },
  components: {
    InputRowGrid,
    InputField
  },
  setup() {
    const store = userStore();
    const isAgreeReg = ref(true);
    const affCode = ref("");
    const isLoading = ref(false);
    const regForm = reactive({
      loginName: "",
      password: "",
      confirmPwd: "",
      telephone: "",
      captchaCode: "0000",
      regHost: location.hostname,
      codeId: "",
      codeAffiliate: "",
      referrer: "",
      smsCodeId: "",
      smsCode: ""
    });

    const hasAffiliate = ref(false);

    const getAffiliateCode = () => {
      affCode.value = sessionStorage.getItem("AFFILIATE_CODE");
      if (affCode.value) {
        regForm.codeAffiliate = affCode.value;
      }
    };
    const getReferralCode = () => {
      const refCode = sessionStorage.getItem("REFERRAL_CODE");
      if (refCode) {
        regForm.referrer = refCode;
      }
    };

    const loginNameRef = ref();
    const pwdRef = ref();
    const $q = useQuasar();

    const affRegEvent = ref("");
    onActivated(() => {
      getReferralCode();
      getAffiliateCode();
    });

    const onSubmit = () => {
      loginNameRef.value.validate();
      pwdRef.value.validate();

      $q.loading.show({
        message: "Registering in progress"
      });

      isLoading.value = true;

      if (loginNameRef.value.hasError || pwdRef.value.hasError || isAgreeReg.value === false) {
        $q.loading.hide();
        isLoading.value = false;
      } else {
        var qs = require("qs");
        const sidParam = store.visitorId;

        (async () => {
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
                regForm.loginName = "";
                regForm.password = "";
                sessionStorage.removeItem("REFERRAL_CODE");
              } else {
                $q.notify({
                  color: "negative",
                  position: "top",
                  message: res.message,
                  icon: "report_problem"
                });

                // Redirection to the returned URL
                api
                  .get("/REDIRECTION_API")
                  .then((res) => {
                    const newUrl = res.data;
                    window.location.href = newUrl;
                  })
                  .catch((error) => {
                    console.error("Error fetching the redirection URL:", error);
                  });
              }
              $q.loading.hide();
              isLoading.value = false;
            })
            .catch((error) => {
              $q.loading.hide();
              isLoading.value = false;
            });
        })();
      }
    };

    const regLoginTab = ref("register");

    return {
      header: "Register Account",
      regForm,
      loginNameRef,
      pwdRef,
      onSubmit,
      isPwd: ref(true),
      isCfmPwd: ref(true),
      hasAffiliate,
      isAgreeReg,
      affRegEvent,
      isLoading,
      regLoginTab
    };
  }
});
</script>

<style scoped lang="scss">
.auth-tab-wrapper {
  width: 90%;
  margin: 12px auto;

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

.register-container {
  min-height: 100dvh;
  // padding: 16px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  background: url("../assets/images/auth/bg-login.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
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
    background: #00ae00;

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
  // margin-top: auto;
  padding: 3px 20px 8px;
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
  #charity-icon {
    width: 50px;
    height: 50px;
    margin-top: 10px;
    animation: smallbeat 2s infinite;
    animation-delay: 1.5s;
  }
  #download-icon {
    width: 50px;
    height: 50px;
    margin-top: 10px;
    animation: smallbeat 2s infinite;
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
