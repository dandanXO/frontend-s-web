<template>
  <q-form class="q-gutter-y-md rounded-borders" @submit="onSubmit">
    <q-input
      ref="realNameRef"
      hide-bottom-space
      v-model="regForm.realName"
      label="姓名"
      :rules="[
        (val) => (val && val.length > 0) || '请输入姓名',
        (val) => (val && val.length >= 2 && val.length <= 12) || '用户名个数必须在2和12之间',
        validRealName
      ]"
      clearable
      rounded
      outlined
      color="white"
      bg-color="inputstyle"
    >
      <template v-slot:prepend>
        <q-icon color="bright" name="person_outline" size="24px" />
      </template>
    </q-input>

    <q-input
      ref="loginNameRef"
      hide-bottom-space
      v-model="regForm.loginName"
      label="用户名"
      placeholder="4~11位包含字母和数字"
      :rules="[
        (val) => (val && val.length > 0) || '请输入用户名',
        (val) => (val && val.length >= 4 && val.length <= 11) || '用户名个数必须在4和11之间',
        (val) => (val && /^[a-zA-Z][a-zA-Z0-9]{3,10}$/.test(val)) || '须以字母开头，并包含至少2个字母和1个数字',
        (val) => (val && (val.match(/[a-zA-Z]/g) || []).length >= 2) || '须以字母开头，并包含至少2个字母和1个数字',
        (val) => (val && /\d/.test(val)) || '须以字母开头，并包含至少2个字母和1个数字'
      ]"
      clearable
      rounded
      outlined
      color="white"
      bg-color="inputstyle"
    >
      <template v-slot:prepend>
        <q-icon color="bright" name="person_outline" size="24px" />
      </template>
    </q-input>

    <q-input
      ref="pwdRef"
      hide-bottom-space
      v-model="regForm.password"
      label="密码"
      :type="isPwd ? 'password' : 'text'"
      :rules="[(val) => (val && val.length > 0) || '请输入密码', (val) => (val.length > 5 && val.length <= 12) || '']"
      rounded
      outlined
      color="white"
      bg-color="inputstyle"
    >
      <template v-slot:prepend>
        <q-icon color="bright" name="lock_open" size="24px" />
      </template>
      <template v-slot:append>
        <q-icon
          color="grey"
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>

    <div v-if="regForm.password">
      <div class="password-str-div">
        <span
          :class="{
            'weak-pwd': pwdStrength == 'weak',
            'normal-pwd': pwdStrength == 'normal',
            'strong-pwd': pwdStrength == 'strong'
          }"
        ></span>
        <span
          :class="{
            'normal-pwd': pwdStrength == 'normal',
            'strong-pwd': pwdStrength == 'strong'
          }"
        ></span>
        <span :class="{ 'strong-pwd': pwdStrength == 'strong' }"></span>

        <div class="text-pwd">
          <div v-if="pwdStrength == 'weak'" class="weak-pwd">弱</div>
          <div v-if="pwdStrength == 'normal'" class="normal-pwd">中</div>
          <div v-if="pwdStrength == 'strong'" class="strong-pwd">强</div>
        </div>
      </div>

      <!-- Password Requirements -->
      <div class="pwd-requirements">
        <div>密码必须符合以下要求：</div>
        <div class="row wrap q-gutter-x-sm">
          <div
            class="text-req"
            :class="{
              correct: regForm.password.length > 5
            }"
          >
            至少6个字符长度
          </div>
          <div
            class="text-req"
            :class="{
              correct: /[a-zA-Z]/.test(regForm.password)
            }"
          >
            至少包含一个字母
          </div>
          <div
            class="text-req"
            :class="{
              correct: /\d/.test(regForm.password)
            }"
          >
            至少包含一个数字
          </div>
        </div>
      </div>
    </div>

    <q-input
      ref="confirmPwdRef"
      hide-bottom-space
      :type="isCfmPwd ? 'password' : 'text'"
      v-model="regForm.confirmPwd"
      label="确认密码"
      :rules="[
        (val) => (val && val.length > 0) || '请输入确认密码',
        (val) => val === regForm.password || '密码不一样',
        (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12'
      ]"
      rounded
      outlined
      color="white"
      bg-color="inputstyle"
    >
      <template v-slot:prepend>
        <q-icon color="bright" name="lock_open" size="24px" />
      </template>
      <template v-slot:append>
        <q-icon
          color="grey"
          :name="isCfmPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isCfmPwd = !isCfmPwd"
        />
      </template>
    </q-input>

    <q-input
      v-show="regForm.smsCodeId"
      ref="phoneVerificationRef"
      hide-bottom-space
      type="text"
      v-model="regForm.smsCode"
      label="手机验证码"
      maxlength="6"
      :rules="[(val) => (val && val.length > 3) || '请输入手机验证码']"
      rounded
      outlined
      color="white"
      bg-color="inputstyle"
    >
      <template v-slot:prepend>
        <q-icon color="bright" name="shield" size="24px" />
      </template>
    </q-input>

    <q-input
      ref="verificationRef"
      hide-bottom-space
      clearable
      type="text"
      v-model="regForm.captchaCode"
      label="验证码"
      :rules="[
        (val) => (val && val.length > 0) || '请输入验证码',
        (val) => (val && val.length > 3 && val.length < 5) || '验证码长度为4个'
      ]"
      rounded
      outlined
      color="white"
      bg-color="inputstyle"
    >
      <template v-slot:append>
        <img :src="verificationImg" @click="getCode()" />
      </template>
      <template v-slot:prepend>
        <q-icon color="bright" name="security" size="24px" />
      </template>
    </q-input>

    <q-input
      v-if="!hasAffiliate"
      ref="affiliateCodeRef"
      hide-bottom-space
      v-model="regForm.referrer"
      label="推荐码"
      hint="若不是合营下会员无需填写"
      rounded
      outlined
      color="white"
      bg-color="inputstyle"
    >
      <template v-slot:prepend>
        <!-- <img src="../assets/images/login/login_name.png" width="20" /> -->
        <q-icon color="bright" name="sports_kabaddi" size="24px" />
      </template>
    </q-input>

    <div class="items-center justify-between row">
      <q-btn
        @click.prevent="onSubmit"
        type="submit"
        class="q-mt-lg q-btn-blue"
        label="注册"
        width="100%"
        color="brightbtn"
        style="width: 100%"
        size="md"
        rounded
      />
    </div>
  </q-form>

  <q-dialog v-model="showCaptchaDialog" width="100%" no-backdrop-dismiss no-esc-dismiss>
    <q-card width="100%">
      <q-card-section class="text-white q-pa-md bg-brightbtn">
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
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
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
    const validRealName = () => {
      const namePattern = /^([\u4e00-\u9fa5\.\。]*)$/;
      // const namePattern = /^[\u4e00-\u9fa5]{2,4}$/;
      return namePattern.test(regForm.realName) || "请输入中文字符";
    };

    const captchaRef = ref();
    const innerCodeId = ref("");
    const innerCaptchaRef = ref("");
    const showCaptchaDialog = ref(false);
    const phoneVerificationImg = ref("");

    const validLoginName = () => {
      const namePattern = /^[a-zA-Z0-9]+$/;
      return namePattern.test(regForm.loginName) || "用户名不允许使用特殊字符";
    };

    const regForm = reactive({
      realName: "",
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
      smsCode: "",
      way: "H5"
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
    const realNameRef = ref();
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
      realNameRef.value.validate();
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
        realNameRef.value.hasError ||
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
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: "注册成功",
                  icon: "check_circle_outline"
                });
                store.autoLogin(res.data);
                sessionStorage.removeItem("REFERRAL_CODE");
                if (store.hasToken()) {
                  const jumpUrl = route.query.redirect ? route.query.redirect : "/";
                  router.go(jumpUrl);
                }

                sessionStorage.removeItem("REFERRAL_CODE");
                sessionStorage.setItem("regSuccessGuideVisible", true);
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

        let pwd = regForm.password;
        let result = 0;

        if (pwd) {
          let level = 0;

          // Combining character types
          for (let i = 0, len = pwd.length; i < len; ++i) {
            result |= charType(pwd.charCodeAt(i));
          }

          // Count ticks
          let ticks = 0;
          for (let i = 0; i <= 4; i++) {
            if (result & 1) {
              ticks++;
            }
            result = result >>> 1;
          }

          // Determine password strength
          if (pwd.length >= 6) {
            if (ticks >= 3) {
              pwdStrength.value = "strong";
            } else if (ticks === 2) {
              pwdStrength.value = "normal";
            } else {
              pwdStrength.value = "weak";
            }
          } else {
            pwdStrength.value = "weak";
          }
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
      realNameRef,
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
      // isValidName,
      showCaptchaDialog,
      onCaptchaSubmit,
      innerCaptchaRef,
      phoneVerificationImg,
      openPhoneVeriDialog,
      phoneVerificationRef,
      isValidCnPhone,
      hasAffiliate,
      validLoginName,
      validRealName
    };
  }
});

function charType(code) {
  if (code >= 48 && code <= 57) return 1;
  if (code >= 65 && code <= 90) return 2;
  if (code >= 97 && code <= 122) return 4;
  if (
    (code >= 33 && code <= 47) ||
    (code >= 58 && code <= 64) ||
    (code >= 91 && code <= 96) ||
    (code >= 123 && code <= 126)
  )
    return 8;
  return 0;
}
</script>
<style lang="scss">
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
  gap: 8px;
  font-size: 12px;
  line-height: 1;

  span {
    width: 24px;
    height: 8px;
    background: #edeeef;
    text-align: center;

    &.weak-pwd {
      background: var(--q-negative);
    }

    &.normal-pwd {
      background: var(--q-warning);
      color: var(--q-primary);
    }

    &.strong-pwd {
      //background: linear-gradient(to right, #de4545, #db7e42) !important;
      background: var(--q-positive);
      font-weight: 600;
    }
  }

  .text-pwd {
    font-size: 16px;

    .weak-pwd {
      color: var(--q-negative);
    }
    .normal-pwd {
      color: var(--q-warning);
    }
    .strong-pwd {
      color: var(--q-positive);
    }
  }
}

.pwd-requirements {
  font-size: 12px;
  line-height: 2;

  .text-req {
    padding-left: 20px;
    position: relative;

    &:before {
      content: "";
      background-image: url("../assets/images/login/icon-cross.png");
      background-size: 100% 100%;
      width: 16px;
      height: 16px;
      position: absolute;
      left: 0;
      top: 4px;
    }

    &.correct {
      &:before {
        content: "";
        background-image: url("../assets/images/login/icon-tick.png");
        background-size: 100% 100%;
        width: 16px;
        height: 16px;
        position: absolute;
        left: 0;
        top: 4px;
      }
    }
  }
}

.q-toolbar {
  background: #33bcd4;
}
</style>
