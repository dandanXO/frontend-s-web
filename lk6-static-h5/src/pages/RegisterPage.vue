<template>
  <div class="login-container">
    <div class="form-container">
      <q-form ref="regFormRef" class="rounded-borders" @submit="onSubmit">
        <div class="login-form-inner-wrapper q-gutter-y-md">
          <div class="input-field-wrapper" style="margin-top: 0px;">
            <div class="input-field__label required">{{ $t("register.form.userName.label") }}</div>
            <q-input
              height="32px"
              standout
              bg-color="grey-2"
              hide-bottom-space
              ref="loginNameRef"
              v-model="regForm.loginName"
              :placeholder="$t('register.form.userName.placeholder', { min: 4, max: 11 })"
              lazy-rules
              :rules="[
            (val) => (val && val.length > 0) || $t('register.form.userName.error.required'),
            (val) => (val && val.length >= 4 && val.length <= 11) || $t('register.form.userName.error.length'),
            (val) => (val && /^[a-zA-Z][a-zA-Z0-9]{3,10}$/.test(val)) || $t('register.form.userName.error.format'),
            (val) => (val && (val.match(/[a-zA-Z]/g) || []).length >= 2) || $t('register.form.userName.error.format'),
            (val) => (val && /\d/.test(val)) || $t('register.form.userName.error.format')
          ]"
            >
              <template v-slot:prepend>
                <img src="../assets/login/user-icon.svg" width="14" />
              </template>
              <template v-slot:append>
                <q-btn flat round @click="clearLoginName">
                  <img src="../assets/login/input-close-icon.svg" style="margin-right: 3px" width="20" />
                </q-btn>
              </template>
            </q-input>
          </div>

          <div class="input-field-wrapper">
            <div class="input-field__label required">{{ $t("register.form.password.label") }}</div>
            <q-input
              height="32px"
              standout
              bg-color="grey-2"
              ref="pwdRef"
              hide-bottom-space
              v-model="regForm.password"
              :placeholder="$t('register.form.password.placeholder')"
              lazy-rules
              :type="isPwd ? 'password' : 'text'"
              :rules="[
            (val) => (val && val.length > 0) || $t('register.form.password.error.required'),
            (val) =>
              (val.length > 5 && val.length <= 12) || $t('register.form.password.error.length', { min: 6, max: 12 })
          ]"
            >
              <template v-slot:prepend>
                <img src="../assets/login/pass-icon.svg" width="14" />
              </template>
              <template v-slot:append>
                <q-btn v-if="regForm.password" flat round @click="clearPwName">
                  <img src="../assets/login/input-close-icon.svg" style="margin-right: 3px" width="20" />
                </q-btn>

                <img
                  v-if="!isPwd"
                  @click="isPwd = !isPwd"
                  src="../assets/login/eye-line.svg"
                  style="margin-right: 12px"
                  width="20"
                />
                <img
                  v-if="isPwd"
                  @click="isPwd = !isPwd"
                  src="../assets/login/eye-close-line.svg"
                  style="margin-right: 12px"
                  width="20"
                />

                <!--        <q-icon-->
                <!--            color="dark"-->
                <!--            :name="isPwd ? 'visibility_off' : 'visibility'"-->
                <!--            class="cursor-pointer"-->
                <!--            @click="isPwd = !isPwd"-->
                <!--        />-->
              </template>
            </q-input>
          </div>

          <!-- <div v-if="regForm.password" class="password-str-div">
            <span
              :class="{
                'weak-pwd': pwdStrength == 'weak',
                'normal-pwd': pwdStrength == 'normal',
                'strong-pwd': pwdStrength == 'strong'
              }"
            >
              弱
            </span>
            <span
              :class="{
                'normal-pwd': pwdStrength == 'normal',
                'strong-pwd': pwdStrength == 'strong'
              }"
            >
              好
            </span>
            <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">强</span>
          </div> -->
          <div class="input-field-wrapper">
            <div class="input-field__label required">{{ $t("register.form.passwordConfirm.label") }}</div>

            <q-input
              height="32px"
              standout
              bg-color="grey-2"
              ref="confirmPwdRef"
              hide-bottom-space
              :type="isCfmPwd ? 'password' : 'text'"
              v-model="regForm.confirmPwd"
              :placeholder="$t('register.form.passwordConfirm.placeholder')"
              lazy-rules
              :rules="[
            (val) => (val && val.length > 0) || $t('register.form.passwordConfirm.error.required'),
            (val) => val === regForm.password || $t('register.form.passwordConfirm.error.match'),
            (val) =>
              (val.length > 5 && val.length <= 12) ||
              $t('register.form.passwordConfirm.error.length', { min: 6, max: 12 })
          ]"
            >
              <template v-slot:prepend>
                <img src="../assets/login/pass-icon.svg" width="14" />
              </template>
              <template v-slot:append>
                <q-btn v-if="regForm.confirmPwd" flat round @click="clearPwConfirmName">
                  <img src="../assets/login/input-close-icon.svg" style="margin-right: 3px" width="20" />
                </q-btn>

                <img
                  v-if="!isCfmPwd"
                  @click="isCfmPwd = !isCfmPwd"
                  src="../assets/login/eye-line.svg"
                  style="margin-right: 12px"
                  width="20"
                />
                <img
                  v-if="isCfmPwd"
                  @click="isCfmPwd = !isCfmPwd"
                  src="../assets/login/eye-close-line.svg"
                  style="margin-right: 12px"
                  width="20"
                />
              </template>
            </q-input>
          </div>

<!--          <div class="input-field-wrapper">-->
<!--            <div class="input-field__label">{{ $t("register.form.realName.label") }}</div>-->
<!--            <q-input-->
<!--              height="32px"-->
<!--              standout-->
<!--              bg-color="grey-2"-->
<!--              ref="realNameRef"-->
<!--              hide-bottom-space-->
<!--              v-model="regForm.realName"-->
<!--              :placeholder="$t('register.form.realName.placeholder')"-->
<!--              lazy-rules-->
<!--              :rules="[-->
<!--            (val) => (val && val.length > 0) || t('register.form.realName.error.required'),-->
<!--            (val) =>-->
<!--              (val && val.length >= 2 && val.length <= 12) ||-->
<!--              t('register.form.realName.error.required', { min: 2, max: 12 })-->
<!--          ]"-->
<!--            >-->
<!--              <template v-slot:prepend>-->
<!--                <img src="../assets/login/user-icon.svg" width="14" />-->
<!--              </template>-->
<!--              <template v-slot:append>-->
<!--                <q-btn flat round @click="clearRealName">-->
<!--                  <img src="../assets/login/input-close-icon.svg" style="margin-right: 3px" width="20" />-->
<!--                </q-btn>-->
<!--              </template>-->
<!--            </q-input>-->
<!--          </div>-->

          <div class="input-field-wrapper">
            <div class="input-field__label">{{ $t("register.form.verificationCode.label") }}</div>

            <q-input
              height="32px"
              standout
              bg-color="grey-2"
              clearable
              ref="verificationRef"
              hide-bottom-space
              type="text"
              v-model="regForm.captchaCode"
              :placeholder="$t('register.form.verificationCode.placeholder')"
              lazy-rules
              :rules="[
            (val) => (val && val.length > 3 && val.length < 5) || $t('register.form.verificationCode.error.format')
          ]"
            >
              <template v-slot:append>
                <img :src="verificationImg" @click="getCode()" />
              </template>
              <template v-slot:prepend>
                <img src="../assets/login/veri-icon.svg" width="14" style="margin-right: 8px" />
              </template>
            </q-input>
          </div>

          <div class="input-field-wrapper">
            <div class="input-field__label">{{ $t("register.form.affiliateCode.label") }}</div>
            <q-input
              height="32px"
              standout
              bg-color="grey-2"
              clearable
              ref="affiliateCodeRef"
              hide-bottom-space
              v-model="regForm.codeAffiliate"
              :placeholder="$t('register.form.affiliateCode.placeholder')"
              :readonly="hasAffiliate === true ? true : false"
            >
              <template v-slot:prepend>
                <img src="../assets/login/veri-icon.svg" width="14" />
              </template>
            </q-input>
          </div>
        </div>

        <div class="row justify-between items-center register-btn-lists">
          <q-btn
            @click.prevent="onSubmit"
            type="submit"
            class="login-btn q-mt-md"
            :label="$t('btn.registernow')"
            width="100%"
            size="16px"
          />

          <span class="login-click" @click="changeTab">{{ $t('login.alreadyGotAcc') }}<span class="text-blue-a1">{{ $t('login.loginnow') }}</span></span>
<!--          <q-btn-->
<!--            @click.prevent="changeTab"-->
<!--            type="button"-->
<!--            class="register-btn q-mt-md"-->
<!--            :label="$t('btn.login')"-->
<!--            width="100%"-->
<!--            size="16px"-->
<!--          />-->
        </div>
      </q-form>
    </div>

  </div>

</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "RegisterPage",
  emits: ["changeTab"],
  setup(props, context) {
    const { t } = useI18n();
    onMounted(() => {
      getCode();
      getReferralCode();
      getAffiliateCode();
    });
    const verificationImg = ref("");
    const isValidName = () => {
      const namePattern = /^([\u4e00-\u9fa5\.\。·]*)$/;
      return namePattern.test(regForm.realName) || "请输入中文字符";
    };
    const hasAffiliate = ref(false);
    const regForm = reactive({
      loginName: "",
      password: "",
      confirmPwd: "",
      realName: "",
      // telephone: "",
      // email: "",
      captchaCode: "",
      regHost: location.hostname,
      codeId: "",
      codeAffiliate: ""
    });

    const getAffiliateCode = () => {
      const affCode = sessionStorage.getItem("AFFILIATE_CODE");
      if (affCode) {
        hasAffiliate.value = true;
        regForm.codeAffiliate = affCode;
      }
    };

    const getCode = () => {
      api
        .get("/member/verificationCode")
        .then((response) => {
          if (response.code === 0) {
            verificationImg.value = "data:image/png;base64," + response.data.img;
            regForm.codeId = response.data.id;
            regForm.captchaCode = "";
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };
    const getReferralCode = () => {
      const refCode = sessionStorage.getItem("REFERRAL_CODE");
      if (refCode) {
        regForm.referrer = refCode;
      }
    };

    const regFormRef = ref();
    const clearLoginName = () => {
      regForm.loginName = "";
      regFormRef.value.reset();
    };

    const clearRealName = () => {
      regForm.realName = "";
      regFormRef.value.reset();
    };

    const clearPwName = () => {
      regForm.password = "";
      regFormRef.value.reset();
    };

    const clearPwConfirmName = () => {
      regForm.password = "";
      regFormRef.value.reset();
    };

    const store = userStore();
    const loginNameRef = ref();
    const pwdRef = ref();
    const confirmPwdRef = ref();
    // const telRef = ref();
    // const emailRef = ref();
    const verificationRef = ref();
    const realNameRef = ref();
    const affiliateCodeRef = ref();
    const $q = useQuasar();
    const isConfirmTerm = ref(false);

    const pwdStrength = ref("");
    const isValidEmail = () => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(regForm.email) || "请输入有效电子邮件";
    };
    const router = useRouter();
    const route = useRoute();

    const validLoginName = () => {
      const namePattern = /^[a-zA-Z0-9]+$/;
      return namePattern.test(regForm.loginName) || "用户名不允许使用特殊字符";
    };

    const onSubmit = () => {
      loginNameRef.value.validate();
      pwdRef.value.validate();
      confirmPwdRef.value.validate();
      // telRef.value.validate();
      // emailRef.value.validate();
      // realNameRef.value.validate();
      verificationRef.value.validate();
      $q.loading.show({
        message: t("register.registering")
      });
      if (
        loginNameRef.value.hasError ||
        pwdRef.value.hasError ||
        confirmPwdRef.value.hasError ||
        // telRef.value.hasError ||
        // emailRef.value.hasError ||
        // realNameRef.value.hasError ||
        verificationRef.value.hasError
      ) {
        $q.loading.hide();
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
          api
            .post("/member/fbRegister", qs.stringify(regForm))
            // .post("/member/register", qs.stringify(regForm))
            .then((ret) => {
              const res = ret;
              // console.log("RET");
              // console.log(ret);
              if (res.code === 0) {
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: t("register.notification.registerSuccess.message"),
                  icon: "check_circle_outline"
                });
                store.autoLogin(res.data);
                sessionStorage.removeItem("REFERRAL_CODE");
                // debugger;
                if (store.hasToken()) {
                  const jumpUrl = route.query.redirect ? route.query.redirect : "/";
                  router.go(jumpUrl);
                  if (Platform.is.capacitor && Platform.is.ios) {
                    location.reload();
                  }
                }
                // context.emit("changeTab");
                // router.push({ path: "/" });

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

    const changeTab = () => {
      // context.emit("changeTab");
      router.push("/login")
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
    return {
      header: "Register Account",
      regForm,
      verificationImg,
      isValidName,
      loginNameRef,
      pwdRef,
      confirmPwdRef,
      // telRef,
      // emailRef,
      verificationRef,
      realNameRef,
      onSubmit,
      isValidEmail,
      isPwd: ref(true),
      isCfmPwd: ref(true),
      getCode,
      pwdStrength,
      isConfirmTerm,
      clearLoginName,
      clearRealName,
      regFormRef,
      hasAffiliate,
      getAffiliateCode,
      changeTab,
      validLoginName,
      clearPwName,
      clearPwConfirmName
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
.login-container {
  padding-top: 12px;
  height: 100dvh;
  background: url(../assets/login/register-bg.png) no-repeat center center;
  background-size: 100% 100%;
  //min-height: 100vh;
  overflow: auto;

  .back-to-home {
    position: absolute;
    top: 16px;
    left: 16px;
    img {
      width: 24px;
    }
  }

  .top-image-div {
    margin: 0 16px 16px;
    img {
      max-width: 100%;
    }
  }

  .login-tab-div {
    padding: 0px 16px;
    margin-bottom: 32px;
  }

  .q-tab {
    min-height: 36px;
    background: #eee;
    color: #333;
  }

  .q-field__native.q-placeholder,
  .q-field__append {
    color: #424f72 !important;
    &::placeholder {
      color: #a4aabb;
      opacity: 1;
    }
  }

  .q-tabs {
    background: rgba(113, 125, 146, 0.2);
    border-radius: 30px;
    width: 90%;
    margin: 0 auto;
    box-shadow: 3px 3px 3px 0 rgba(66, 91, 186, 0.2);
  }

  .form-container {
    width: 100%;
    margin: auto;
    padding: 0px 0px 16px;

    > .q-tab-panel {
    }

    .q-field__control {
      height: 45px;
      border-radius:8px;

      .q-field__marginal {
        height: 45px;
      }
    }

    .captcha-input {
      .q-field__control {
        padding-right: 0;
      }
      .q-field__control-container {
        display: none;
        .col,
        .col-xs {
          flex: unset;
        }
      }
      .q-field__append.q-field__marginal {
        width: 100%;
        padding-left: 0;
      }
      .q-field__prepend.q-field__marginal > span {
        width: 56px !important;
      }
      .q-field__prepend {
        padding-right: 0;
      }
    }

    #captchaContainer {
      width: 100%;
    }

    .geetest_captcha.geetest_customTheme .geetest_holder .geetest_content,
    .geetest_popup_wrap.geetest_customTheme .geetest_holder .geetest_content,
    .q-field--standout.q-field--readonly .q-field__control:before {
      border: none;
    }

    .login-form-inner-wrapper {
      background: #ffffff80;
      border: 1px solid transparent;
      border-radius: 10px;
      padding: 24px 12px;
      backdrop-filter: blur(2px);
      border-image: linear-gradient(105.76deg, #ffffff 20.95%, #c6d9ff 100.21%) 1;
      mask: linear-gradient(black, black);
      width: calc(100% - 32px);
      margin: 0 auto;
    }
    .login-btn {
      width: 100%;
      letter-spacing: 2px;
      background: radial-gradient(103.75% 103.75% at 50% -3.75%, #94c3ff 0%, #4b91f5 100%);
      border: 1px solid #ffffff;
      border-radius: 30px;
      height: 48px;
      font-weight: 600;
      color: white;
    }

    .register-btn {
      width: 100%;
      letter-spacing: 2px;
      background: linear-gradient(180deg, #f4f7fb 0%, #c5dcf8 100%);
      border-radius: 30px;
      font-weight: 600;
      color: #424f72;
    }
  }
  .q-field__prepend {
    padding-right: 20px;
  }

  .login-bottom-section {
    > div {
      gap: 40px;
    }

    .mid-gap {
      width: 2px;
      background: rgba(0, 0, 0, 0.5);
      filter: brightness(0.7);
      height: 16px;
    }

    span {
      color: #434343;
    }
  }

  .q-tab__content {
    width: 100%;
  }

  .q-tab--active .q-tab__indicator {
    height: 100%;
    background: #0089ed;
    //background: linear-gradient(180deg, #fd3b2a 0%, #ac260b 100%);
    border-radius: 30px;
  }

  .q-tab__label {
    z-index: 1;
  }

  .q-tab-panels {
    background: none;
  }

  .align-right {
    text-align: right;
    // color: #acacac;
    color: #333;
    margin-left: 4px;
  }

  .txt-tip {
    color: #434343;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .forgetpass-div {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 8px);
    margin: 15px auto 0px;
    gap: 10px;

    .mui-row {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 13px;
      color: #666;

      &.checked {
        color: #0089ed;
      }

      &:active {
        filter: brightness(0.8);
      }
    }

    a,
    a:visited,
    a:active,
    a:hover {
      text-decoration: none;
      color: #0089ed;
    }
  }

  .q-field--standout.q-field--rounded .q-field__control {
    border-radius: 8px;
    box-shadow: 0px 0px 5px 0px #86b8ff inset, 0px 2px 0px 0px #9ab0ff70;
  }

  .q-field--standout .q-field__control {
    background: #fff;
  }

  .q-checkbox__bg {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  .q-checkbox__label {
    margin-left: 8px;
  }

  .input-field-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    .input-field__label {
      font-size: 12px;
      color: #424f72;
      &.required {
        &::after {
          content: "*";
          color: #ff0d0d;
        }
      }
    }
  }

  .verification-btn {
    background-image: url("../assets/images/index/primary-btn.png");
    background-size: 100% 100%;
    color: #fff;
    width: 87px;
    text-align: center;
    white-space: nowrap;
    font-size: 12px;
    aspect-ratio: 87/32;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 30px;
    box-shadow: 0px -0.87px 3.47px 0px #ffffff;
    border-radius: 45.9px;
    margin-right: 5px;
  }

  .register-btn-lists{
    width: calc(100% - 32px);
    margin: auto;
  }
}


.page-header {
  background-image: linear-gradient(to right, #de4545, #db7e42);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 28px;
  text-align: center;
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
  display: none;
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

.login-click{
  width:50%;
  text-align: center;
  margin: 20px auto;
}

.text-blue-a1{
  color: #1E86FF;
}

:deep(.q-field--standout .q-field__control){
  border: 1px solid #ECEDF0;
  border-radius: 8px;
  box-shadow: 0px 0px 5px 0px #86B8FF inset;
  background: #fff;
  box-shadow: 0px 2px 0px 0px #9AB0FF70;

}

:deep(.q-field--standout.q-field--highlighted .q-field__native){
  color: #000;
}

</style>

