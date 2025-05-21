<template>
  <q-form ref="regFormRef" class="q-gutter-y-md rounded-borders" @submit="onSubmit">
    <q-input
      height="32px"
      rounded
      standout
      bg-color="grey-2"
      hide-bottom-space
      ref="loginNameRef"
      v-model="regForm.loginName"
      placeholder="4-11个字符，最少2个字母+数字组合，首位为字母"
      lazy-rules
      :rules="[
        (val) => /^[a-zA-Z][a-zA-Z0-9]{3,10}$/.test(val) || '用户名个数必须在4和11之间，且首字符必须为字母',
        (val) => (val.match(/[a-zA-Z]/g) || []).length >= 2 || '用户名必须包含至少2个英文字母',
        (val) => /\d/.test(val) || '用户名必须包含至少1个数字'
      ]"
    >
      <template v-slot:prepend>
        <img src="../assets/login/user-icon.svg" width="14" />
        <span style="color: #424F72; font-size: 14px; margin-left: 8px;">用户名</span>
      </template>
      <template v-slot:append>
        <img @click="clearLoginName" src="../assets/login/input-close-icon.png" style="margin-right: 3px" width="20" />
      </template>
    </q-input>

    <q-input
      height="32px"
      rounded
      standout
      bg-color="grey-2"
      clearable
      ref="pwdRef"
      hide-bottom-space
      v-model="regForm.password"
      placeholder="请输入密码"
      lazy-rules
      :type="isPwd ? 'password' : 'text'"
      :rules="[
        (val) => (val && val.length > 0) || '请输入密码',
        (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12'
      ]"
    >
      <template v-slot:prepend>
        <img src="../assets/login/pass-icon.svg" width="14" />
        <span style="color: #424F72; font-size: 14px; margin-left: 8px;">密码</span>
      </template>
      <template v-slot:append>
        <img
          v-if="!isPwd"
          @click="isPwd = !isPwd"
          src="../assets/login/eye-line.png"
          style="margin-right: 3px"
          width="20"
        />
        <img
          v-if="isPwd"
          @click="isPwd = !isPwd"
          src="../assets/login/eye-close-line.png"
          style="margin-right: 3px"
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
    <div v-if="regForm.password" class="password-str-div">
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
    </div>

    <q-input
      height="32px"
      rounded
      standout
      bg-color="grey-2"
      clearable
      ref="confirmPwdRef"
      hide-bottom-space
      :type="isCfmPwd ? 'password' : 'text'"
      v-model="regForm.confirmPwd"
      placeholder="请再次输入密码"
      lazy-rules
      :rules="[
        (val) => (val && val.length > 0) || '请输入确认密码',
        (val) => val === regForm.password || '密码不一样',
        (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12'
      ]"
    >
      <template v-slot:prepend>
        <img src="../assets/login/pass-icon.svg" width="14" />
        <span style="color: #424F72; font-size: 14px; margin-left: 8px;">确认密码</span>
      </template>
      <template v-slot:append>
        <img
          v-if="!isCfmPwd"
          @click="isCfmPwd = !isCfmPwd"
          src="../assets/login/eye-line.png"
          style="margin-right: 3px"
          width="20"
        />
        <img
          v-if="isCfmPwd"
          @click="isCfmPwd = !isCfmPwd"
          src="../assets/login/eye-close-line.png"
          style="margin-right: 3px"
          width="20"
        />
      </template>
    </q-input>

    <q-input
      height="32px"
      rounded
      standout
      bg-color="grey-2"
      ref="realNameRef"
      hide-bottom-space
      v-model="regForm.realName"
      placeholder="姓名必须与提款银行卡账号一致"
      lazy-rules
      :rules="[
        (val) => (val && val.length > 0) || '请输入姓名',
        (val) => (val && val.length >= 2 && val.length <= 12) || '用户名个数必须在2和12之间',
        isValidName
      ]"
    >
      <template v-slot:prepend>
        <img src="../assets/login/user-icon.svg" width="14" />
        <span style="color: #424F72; font-size: 14px; margin-left: 8px;">姓名</span>
      </template>
      <template v-slot:append>
        <img @click="clearRealName" src="../assets/login/input-close-icon.png" style="margin-right: 3px" width="20" />
      </template>
    </q-input>

    <q-input
      height="32px"
      rounded
      standout
      bg-color="grey-2"
      clearable
      ref="verificationRef"
      hide-bottom-space
      type="text"
      v-model="regForm.captchaCode"
      placeholder="验证码"
      lazy-rules
      :rules="[(val) => (val && val.length > 3 && val.length < 5) || '验证码应为四个字符串']"
    >
      <template v-slot:append>
        <img :src="verificationImg" @click="getCode()" />
      </template>
      <template v-slot:prepend>
        <img src="../assets/login/veri-icon.svg" width="14" />
        <span style="color: #424F72; font-size: 14px; margin-left: 8px;">验证码</span>
      </template>
    </q-input>

    <q-input
      height="32px"
      rounded
      standout
      bg-color="grey-2"
      clearable
      ref="affiliateCodeRef"
      hide-bottom-space
      v-model="regForm.codeAffiliate"
      placeholder="若不是合营下会员无需填写"
      :readonly="hasAffiliate === true ? true : false"
    >
      <template v-slot:prepend>
        <img src="../assets/login/veri-icon.svg" width="14" />
        <span style="color: #424F72; font-size: 14px; margin-left: 8px;">推荐码</span>
      </template>
    </q-input>

    <div class="row justify-between items-center">
      <q-btn
        @click.prevent="onSubmit"
        type="submit"
        class="q-mt-md"
        label="注册"
        width="100%"
        color="primary"
        style="width: 100%; letter-spacing: 2px"
        size="16px"
      />

      <q-btn
        @click.prevent="changeTab"
        type="button"
        class="q-mt-md"
        label="登录"
        width="100%"
        color="white"
        text-color="#4A4A4A"
        style="width: 100%; letter-spacing: 2px; box-shadow: 0px -2px 4px 0px #5A9DFF80 inset;"
        size="16px"
      />
    </div>
  </q-form>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "stores/index";

export default defineComponent({
  name: "RegisterPage",
  emits: ["changeTab"],
  setup(props, context) {
    onMounted(() => {
      getCode();
      getReferralCode();
      getAffiliateCode();
    });
    const verificationImg = ref("");
    const isValidName = () => {
      const namePattern = /^([\u4e00-\u9fa5\.\。]*)$/;
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
      realNameRef.value.validate();
      verificationRef.value.validate();
      $q.loading.show({
        message: "注册中"
      });
      if (
        loginNameRef.value.hasError ||
        pwdRef.value.hasError ||
        confirmPwdRef.value.hasError ||
        // telRef.value.hasError ||
        // emailRef.value.hasError ||
        realNameRef.value.hasError ||
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
                  message: "注册成功",
                  icon: "check_circle_outline"
                });
                store.autoLogin(res.data);
                sessionStorage.removeItem("REFERRAL_CODE");
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
      context.emit('changeTab')
    }

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
      validLoginName
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
</style>
