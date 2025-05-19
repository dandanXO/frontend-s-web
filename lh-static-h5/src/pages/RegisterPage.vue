<template>
  <div class="login-container">
    <q-form @submit="onSubmit">
      <div class="login-form-container">
        <q-input
          ref="realNameRef"
          standout
          clearable
          v-model="regForm.loginName"
          placeholder="4~11位，首字母为字母，至少2个字母+数字组合"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || '请输入用户名',
            (val) => (val && val.length >= 4 && val.length <= 11) || '用户名个数必须在4和11之间',
            (val) => (val && /^[a-zA-Z][a-zA-Z0-9]{3,10}$/.test(val)) || '用户名必须以字母开头',
            (val) => (val && (val.match(/[a-zA-Z]/g) || []).length >= 2) || '用户名必须包含至少两个字母',
            (val) => (val && /\d/.test(val)) || '用户名必须包含至少一个数字'
          ]"
          color="white"
        >
          <template v-slot:prepend>
            <div class="input-icon-label-wrapper">
              <img v-if="$q.dark.isActive" class="input-icon" src="../assets/images/login/user-icon-dark.svg" />
              <img v-else class="input-icon" src="../assets/images/login/user-icon.svg" />
              <label class="input-label">
                <em>*</em>
                用户名
              </label>
            </div>
          </template>
        </q-input>

        <q-input
          ref="pwdRef"
          standout
          clearable
          v-model="regForm.password"
          placeholder="请输入密码"
          lazy-rules
          :type="isPwd ? 'password' : 'text'"
          :rules="[
            (val) => (val && val.length > 0) || '请输入密码',
            (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12'
          ]"
          color="white"
        >
          <template v-slot:prepend>
            <div class="input-icon-label-wrapper">
              <img v-if="$q.dark.isActive" class="input-icon" src="../assets/images/login/password-icon-dark.svg" />
              <img v-else class="input-icon" src="../assets/images/login/password-icon.svg" />
              <label class="input-label">
                <em>*</em>
                密码
              </label>
            </div>
          </template>
          <template v-slot:append>
            <q-icon
              color="dark"
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <!--        <div v-if="regForm.password" class="password-str-div">-->
        <!--          <span :class="{-->
        <!--            'weak-pwd': pwdStrength == 'weak',-->
        <!--            'normal-pwd': pwdStrength == 'normal',-->
        <!--            'strong-pwd': pwdStrength == 'strong'-->
        <!--          }">-->
        <!--            弱-->
        <!--          </span>-->
        <!--          <span :class="{-->
        <!--            'normal-pwd': pwdStrength == 'normal',-->
        <!--            'strong-pwd': pwdStrength == 'strong'-->
        <!--          }">-->
        <!--            好-->
        <!--          </span>-->
        <!--          <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">强</span>-->
        <!--        </div>-->

        <q-input
          ref="confirmPwdRef"
          standout
          clearable
          :type="isCfmPwd ? 'password' : 'text'"
          v-model="regForm.confirmPwd"
          placeholder="请再次输入密码"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || '请输入确认密码',
            (val) => val === regForm.password || '密码不一样',
            (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12'
          ]"
          color="white"
        >
          <template v-slot:prepend>
            <div class="input-icon-label-wrapper">
              <img v-if="$q.dark.isActive" class="input-icon" src="../assets/images/login/password-icon-dark.svg" />
              <img v-else class="input-icon" src="../assets/images/login/password-icon.svg" />
              <label class="input-label">
                <em>*</em>
                确认密码
              </label>
            </div>
          </template>
          <template v-slot:append>
            <q-icon
              color="dark"
              :name="isCfmPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isCfmPwd = !isCfmPwd"
            />
          </template>
        </q-input>

        <q-input
          ref="loginNameRef"
          standout
          clearable
          v-model="regForm.realName"
          placeholder="姓名必须与提款银行卡账号一致"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || '请输入姓名',
            (val) => (val && val.length >= 2) || '姓名至少两个字符',
            isValidName
          ]"
          color="white"
        >
          <template v-slot:prepend>
            <div class="input-icon-label-wrapper">
              <img v-if="$q.dark.isActive" class="input-icon" src="../assets/images/login/user-icon-dark.svg" />
              <img v-else class="input-icon" src="../assets/images/login/user-icon.svg" />
              <label class="input-label">
                <em>*</em>
                姓名
              </label>
            </div>
          </template>
        </q-input>

        <q-input
          ref="verificationRef"
          standout
          clearable
          type="text"
          v-model="regForm.captchaCode"
          placeholder="验证码"
          lazy-rules
          color="white"
          :rules="[
            (val) => (val && val.length > 0) || '请输入验证码',
            (val) => (val && val.length > 3 && val.length < 5) || '验证码长度为4个'
          ]"
        >
          <template v-slot:append>
            <img class="veri-img" :src="verificationImg" @click="getCode()" />
          </template>
          <template v-slot:prepend>
            <div class="input-icon-label-wrapper">
              <img v-if="$q.dark.isActive" class="input-icon" src="../assets/images/login/veri-icon-dark.svg" />
              <img v-else class="input-icon" src="../assets/images/login/veri-icon.svg" />
              <label class="input-label">
                <em>*</em>
                验证码
              </label>
            </div>
          </template>
        </q-input>

        <template v-if="!hasReferSummon">
          <q-input
            v-if="!hasAffiliate"
            ref="affiliateCodeRef"
            standout
            clearable
            v-model="regForm.codeAffiliate"
            placeholder="如不是合营玩家不用填写"
          >
            <template v-slot:prepend>
              <div class="input-icon-label-wrapper">
                <img v-if="$q.dark.isActive" class="input-icon" src="../assets/images/login/veri-icon-dark.svg" />
                <img v-else class="input-icon" src="../assets/images/login/veri-icon.svg" />
                <label class="input-label">
                  <em>&nbsp;</em>
                  推荐码
                </label>
              </div>
            </template>
          </q-input>
          <q-input
            v-else
            ref="affiliateCodeRef"
            standout
            clearable
            v-model="regForm.codeAffiliate"
            placeholder="如不是合营玩家不用填写"
            readonly
            disable
          >
            <template v-slot:prepend>
              <div class="input-icon-label-wrapper">
                <img class="input-icon" src="../assets/images/login/veri-icon.svg" />
                <label class="input-label">
                  <em>&nbsp;</em>
                  推荐码
                </label>
              </div>
            </template>
          </q-input>
        </template>
      </div>
    </q-form>

    <div class="">
      <q-btn
        @click.prevent="onSubmit"
        type="submit"
        class="bottom-btn common-large-btn"
        label="注册"
        width="100%"
        color="brightbtn"
        style="width: 100%"
      />
      <router-link to="/login">
        <q-btn class="common-large-white-btn bottom-btn" flat label="登录" />
      </router-link>
    </div>

    <div class="text-center q-pt-lg customer-service-link">
      <div class="decor-lines" />
      <router-link class="cs-web-id" id="cs-web-id" to="/liveChat">
        <img width="18" src="../assets/images/login/cs-icon.svg" />
        联系客服
      </router-link>
      <div class="decor-lines" />
    </div>
  </div>

  <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss no-esc-dismiss>
    <q-card width="100%">
      <q-card-section class="q-pa-md bg-brightbtn text-white">
        <q-toolbar>
          <q-toolbar-title>验证码</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-card-section>
      <div class="q-px-lg q-pt-sm q-pb-lg">
        <q-card-section class="q-mb-md q-pa-md">
          <q-input v-model="innerCaptchaRef" placeholder="验证码">
            <template v-slot:append>
              <img
                :src="phoneVerificationImg"
                title="点击刷新验证码"
                style="margin-top: 6px; cursor: pointer"
                @click="getInnerCode"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-btn @click="onCaptchaSubmit" label="发送验证码" color="brightbtn" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch, onActivated } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
// import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { userStore } from "stores/index";
import qs from "qs";
import { useNotify } from "src/hooks/notify";

export default defineComponent({
  name: "RegisterPage",
  setup() {
    onMounted(() => {
      getReferralCode();
      getAffiliateCode();
      checkReferSummonCode();
    });
    onActivated(() => {
      getCode();
    });
    const notify = useNotify();
    const store = userStore();
    const verificationImg = ref("");
    const isValidName = () => {
      const namePattern = /^[\u4e00-\u9fa5·]+$/;
      // const namePattern = /^[\u4e00-\u9fa5]{2,4}$/;
      return namePattern.test(regForm.realName) || "请输入中文字符";
    };

    const captchaRef = ref();
    const innerCodeId = ref("");
    const innerCaptchaRef = ref("");
    const showCaptchaDialog = ref(false);
    const phoneVerificationImg = ref("");

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
        regForm.referrer = refCode;
      }
    };

    const hasReferSummon = ref(false);

    // Check session storage for summonCode or referCode
    const checkReferSummonCode = () => {
      const summonCode = sessionStorage.getItem("SUMMON_CODE");
      const referCode = sessionStorage.getItem("REFERRAL_CODE");
      if (summonCode || referCode) {
        hasReferSummon.value = true;
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
                notify({
                  type: "success",
                  message: "注册成功"
                });
                store.autoLogin(res.data);
                sessionStorage.removeItem("REFERRAL_CODE");
                if (store.hasToken()) {
                  router.go("/");
                }

                sessionStorage.removeItem("REFERRAL_CODE");

                sessionStorage.setItem("regSuccessGuideVisible", true);
              } else {
                notify({
                  type: "error",
                  message: res.message
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

    // watch(
    //   () => regForm.password,
    //   () => {
    //     pwdStrength.value = "";
    //
    //     var pwd = regForm.password;
    //     var result = 0;
    //     for (var i = 0, len = pwd.length; i < len; ++i) {
    //       result |= charType(pwd.charCodeAt(i));
    //     }
    //
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

    const validLoginName = () => {
      const namePattern = /^[a-zA-Z0-9]+$/;
      return namePattern.test(regForm.loginName) || "用户名不允许使用特殊字符";
    };

    const onCaptchaSubmit = () => {
      if (!regForm.telephone) {
        notify({
          type: "error",
          message: "手机号码不能为空"
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
            type = "success";

          if (res.code === 0) {
            showCaptchaDialog.value = false;
            regForm.smsCode = "";
            regForm.smsCodeId = res.data.codeId;
            // console.log(res.data.codeId);
          } else {
            type = "error";
            getInnerCode();
          }

          if (message) {
            notify({ message, type });
          }

          // console.log("onCaptchaSubmit", res);
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
      isValidName,
      showCaptchaDialog,
      onCaptchaSubmit,
      innerCaptchaRef,
      phoneVerificationImg,
      openPhoneVeriDialog,
      phoneVerificationRef,
      isValidCnPhone,
      hasAffiliate,
      validLoginName,
      hasReferSummon,
      checkReferSummonCode
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
.login-container {
  .q-field--standout .q-field__control {
    border-radius: 8px;
    background: #f7f8fb;
    box-shadow: 0px 0px 4px 0px #a9c9ea inset;
    height: 44px;
  }

  .q-field__marginal {
    height: 44px;
  }

  .q-input {
    height: 68px;
  }

  .q-field__bottom {
    padding: 0px 12px 8px;
  }
}
</style>

<style lang="scss" scoped>
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
    color: $white;
  }

  span.normal-pwd {
    background: var(--q-warning);
    color: $white;
  }

  span.strong-pwd {
    background: var(--q-positive);
    font-weight: 600;
    color: $white;
  }
}

.q-toolbar {
  background: #33bcd4;
}

.login-container {
  position: relative;
  background: url(../assets/images/login/login-bg.jpg) no-repeat top center;
  background-size: cover;
  height: 100%;
  min-height: calc(100vh - 61px);
  padding: 20px;

  .login-form-container {
    margin: 0px auto;

    .veri-img {
      height: 65%;
      width: 100%;
      min-width: 40px;
      max-width: 120px;
      border-radius: 10px;
    }
  }
}

.bottom-btn {
  width: 100%;
  margin: 10px auto 10px;
}

.body--dark {
  .login-container {
    background: url(../assets/images/login/login-bg-dark.jpg) no-repeat top center;
    background-size: 100% auto;

    .login-form-container {
      padding: 20px;
      background: linear-gradient(180deg, #2e4166 0%, #1a263f 100%);
      border: 1px solid #be9457;
      border-radius: 8px;

      .input-label {
        font-weight: 400;
        font-size: 14px;
      }
    }
  }
  .common-large-btn {
    background: url("../assets/images/login/login-btn-bg-dark.svg") no-repeat center center;
    background-size: cover;
    box-shadow: none;
    border-radius: 4px;
    border: 1px solid #3a93ce;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .common-large-white-btn {
    background: url("../assets/images/login/register-btn-bg-dark.svg") no-repeat center center;
    background-size: cover;
    box-shadow: none;
    border-radius: 4px;
    border: 1px solid #be9457;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #5e300e;
  }
}

.input-icon-label-wrapper {
  width: 106px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  padding-left: 10px;
  padding-right: 20px;

  .input-icon {
    width: 16px;
  }

  .input-label {
    font-weight: bold;
    color: #424f72;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 5px;

    em {
      line-height: 22px;
      color: #f53434;
      display: inline-block;
      padding-top: 2px;
    }
  }
}

.common-large-btn {
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  font-size: 1.2rem;
  font-weight: bold;
  color: $white;
  border-radius: 10px;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    filter: brightness(0.85);
    transform: translate(0px, 1px);
  }
}

.common-large-white-btn {
  background: linear-gradient(180deg, rgba(115, 178, 255, 0.1) 0%, rgba(57, 129, 255, 0.1) 100%);
  font-size: 1.2rem;
  font-weight: bold;
  color: #424f72;
  border-radius: 10px;
  box-shadow: none;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    filter: brightness(0.85);
    transform: translate(0px, 1px);
  }
}

.bottom-btn {
  width: 100%;
  margin: 10px auto 10px;
}

.customer-service-link {
  display: flex;
  align-items: center;
  justify-content: center;

  .decor-lines {
    width: 80px;
    height: 1px;
    background-color: #7a80a1;
    margin: 0 20px;
  }

  .cs-web-id {
    color: $primary;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #7a80a1;
    font-weight: bold;
  }
}
</style>
