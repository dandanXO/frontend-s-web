REGISTERPAGEv02
<template>
  <q-form class="q-gutter-y-md rounded-borders" @submit="onSubmit">
    <q-input
      standout
      bg-color="white"
      ref="loginNameRef"
      hide-bottom-space
      v-model="regForm.loginName"
      label="用户名"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || '请输入用户名']"
    >
      <template v-slot:prepend>
        <img src="../assets/images/login/login_name.png" width="20" />
      </template>
    </q-input>

    <q-input
      standout
      bg-color="white"
      ref="pwdRef"
      hide-bottom-space
      v-model="regForm.password"
      label="密码"
      lazy-rules
      :type="isPwd ? 'password' : 'text'"
      :rules="[
        (val) => (val && val.length > 0) || '请输入密码',
        (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12',
        (val) =>
          (val && (pwdStrength == 'normal' || pwdStrength == 'strong')) ||
          '密码安全级别必须至少为好'
      ]"
    >
      <template v-slot:prepend>
        <img src="../assets/images/login/login_key.png" width="20" />
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
      standout
      bg-color="white"
      ref="confirmPwdRef"
      hide-bottom-space
      :type="isCfmPwd ? 'password' : 'text'"
      v-model="regForm.confirmPwd"
      label="确认密码"
      lazy-rules
      :rules="[
        (val) => (val && val.length > 0) || '请输入确认密码',
        (val) => val === regForm.password || '密码不一样',
        (val) => (val.length > 5 && val.length <= 12) || '密码长度为 6 到 12'
      ]"
    >
      <template v-slot:prepend>
        <img src="../assets/images/login/login_key.png" width="20" />
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

    <!-- <q-input
      standout
      bg-color="white"
      ref="telRef"
      hide-bottom-space
      v-model="regForm.telephone"
      label="电话号码"
      lazy-rules
      :rules="[(val) => (val && val.length > 7) || '请输入有效的电话号码']"
    >
      <template v-slot:prepend>
        <img src="../assets/images/login/telephone.png" width="20" />
      </template>
    </q-input> -->

    <!-- <q-input
      standout
      bg-color="white"
      ref="emailRef"
      type="email"
      hide-bottom-space
      v-model="regForm.email"
      label="电子邮件"
      lazy-rules
      :rules="[
        (val) => (val && val.length > 0) || '请输入电子邮件',
        isValidEmail
      ]"
    >
      <template v-slot:prepend>
        <img src="../assets/images/login/email.png" width="20" />
      </template>
    </q-input> -->
    <q-input
      standout
      bg-color="white"
      ref="verificationRef"
      hide-bottom-space
      type="text"
      v-model="regForm.captchaCode"
      label="验证码"
      lazy-rules
      :rules="[(val) => (val && val.length > 3) || '请输入验证码']"
    >
      <template v-slot:append>
        <img :src="verificationImg" @click="getCode()" />
      </template>
      <template v-slot:prepend>
        <img src="../assets/images/login/agent_code.png" width="20" />
      </template>
    </q-input>

    <q-input
      standout
      bg-color="white"
      ref="affiliateCodeRef"
      hide-bottom-space
      v-model="regForm.affiliateCode"
      label="推荐码"
      hint="若不是合营下会员无需填写"
    >
      <template v-slot:prepend>
        <img src="../assets/images/login/login_name.png" width="20" />
      </template>
    </q-input>

    <div class="row justify-between items-center">
      <q-btn
        @click.prevent="onSubmit"
        type="submit"
        class="q-mt-lg"
        label="注册"
        width="100%"
        color="dyblue"
        style="width: 100%"
        rounded
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
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default defineComponent({
  name: "RegisterPage",
  emits: ["changeTab"],
  setup(props, context) {
    onMounted(() => {
      getCode();
      getReferralCode();
    });
    const verificationImg = ref("");
    const regForm = reactive({
      loginName: "",
      password: "",
      confirmPwd: "",
      // telephone: "",
      // email: "",
      captchaCode: "",
      regHost: location.hostname,
      codeId: "",
      affiliateCode: ""
    });
    const getCode = () => {
      api
        .get("/member/verificationCode")
        .then((response) => {
          if (response.code === 0) {
            verificationImg.value =
              "data:image/png;base64," + response.data.img;
            regForm.codeId = response.data.id;
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
    const store = userStore();
    const loginNameRef = ref();
    const pwdRef = ref();
    const confirmPwdRef = ref();
    // const telRef = ref();
    // const emailRef = ref();
    const verificationRef = ref();
    const affiliateCodeRef = ref();
    const $q = useQuasar();

    const pwdStrength = ref("");
    const isValidEmail = () => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(regForm.email) || "请输入有效电子邮件";
    };
    const router = useRouter();
    const onSubmit = () => {
      loginNameRef.value.validate();
      pwdRef.value.validate();
      confirmPwdRef.value.validate();
      // telRef.value.validate();
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
        // emailRef.value.hasError ||
        verificationRef.value.hasError
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
          api
            .post("/member/fbRegister", qs.stringify(regForm))
            // .post("/member/register", qs.stringify(regForm))
            .then((ret) => {
              const res = ret;
              // console.log("RET");
              // console.log(ret);
              if (res.code === 0) {
                store.autoLogin(res.data);
                // context.emit("changeTab");
                router.push({ path: "/" });
                $q.notify({
                  color: "positive",
                  position: "top",
                  message: "注册成功",
                  icon: "check_circle_outline"
                });
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
    return {
      header: "Register Account",
      regForm,
      verificationImg,
      loginNameRef,
      pwdRef,
      confirmPwdRef,
      // telRef,
      // emailRef,
      verificationRef,
      onSubmit,
      isValidEmail,
      isPwd: ref(true),
      isCfmPwd: ref(true),
      getCode,
      pwdStrength
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
    font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial,
      sans-serif;
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
