<template>
  <div class="login-container">
    <div class="margin-center login-form-wrapper">
      <div class="logo"><img src="../assets/logo.png" /></div>
      <a-form ref="formRef" :model="loginForm" :rules="rules">
        <a-form-item ref="loginName" name="loginName">
          <a-input v-model:value="loginForm.loginName" :placeholder="$t('common.form.loginName.placeholder')">
            <template #prefix>
              <RiUserFill />
              <span style="color: #ffffff">+92</span>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item ref="password" name="password">
          <a-input
            v-model:value="loginForm.password"
            type="password"
            :placeholder="$t('common.form.password.placeholder')"
            @keypress.enter="onSubmit"
          >
            <template #prefix>
              <RiLock2Fill />
            </template>
          </a-input>
        </a-form-item>
        <!-- <a-form-item ref="captchaCode" required name="captchaCode">
          <a-input
            v-model:value="loginForm.captchaCode"
            :maxlength="4"
            placeholder="Verification Code"
            @keypress.enter="onSubmit"
          >
            <template #prefix>
              <RiShieldCheckFill />
            </template>
          </a-input>
          <div class="verification" @click="getCode()">
            <img :src="verificationImg" />
          </div>
        </a-form-item> -->
        <div class="bottomrow">
          <div class="txt-right" style="width: 100%; margin-bottom: 5px">
            <router-link class="pwd-tip" to="/forgot-password">{{ $t("loginView.forgetPasswordLink") }}</router-link>
          </div>
          <a-button class="common-btn" :loading="loadingLogin" @click="onSubmit">
            {{ $t("loginView.loginButton") }}
          </a-button>

          <!-- <button class="common-btn">

          </button> -->
        </div>
      </a-form>
      <div class="txt-center">
        {{ $t("loginView.register.description") }}
        <router-link class="forget-pwd-tip" to="/register">{{ $t("loginView.register.link") }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "@/store/index";
import { getVerificationCode } from "@/api/index/login";
// import { message } from "ant-design-vue";
import { RiUserFill, RiLock2Fill, RiShieldCheckFill } from "vue-remix-icons";

import "@/assets/css/login.scss";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useI18n } from "vue-i18n";
import { validateLoginName, validatePassword } from "@/utils/validator";

const { t } = useI18n();

const isSpinWheel = ref(true);
const store = userStore();
const router = useRouter();
const route = useRoute();
const formRef = ref();
const loginForm = reactive({
  loginName: "",
  password: ""
  // captchaCode: "",
  // codeId: ""
});
const verificationImg = ref("");
onMounted(() => {
  // getCode();
});
const getCode = () => {
  loginForm.captchaCode = "";
  getVerificationCode()
    .then((res) => {
      if (res.code === 0) {
        verificationImg.value = "data:image/png;base64," + res.data.img;
        loginForm.codeId = res.data.id;
      }
    })
    .catch((e) => {
      console.log(e.message);
    });
};
const rules = computed(() => ({
  loginName: [{ validator: validateLoginName, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }]
}));
const loadingLogin = ref(false);
const onSubmit = () => {
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

    formRef.value.validate().then(() => {
      loadingLogin.value = true;
      store
        .memberLogin({
          loginName: loginForm.loginName,
          password: loginForm.password,
          sid: sidParam
          // captchaCode: loginForm.captchaCode,
          // codeId: loginForm.codeId
        })
        .then(() => {
          const jumpUrl = route.query.redirect ? route.query.redirect.toString() : "/home";
          router.push(jumpUrl);
          loadingLogin.value = false;
        })
        .catch((error) => {
          console.log(error.message);
          loadingLogin.value = false;
          // getCode();
        });
    });
  })();
};
const resetForm = () => {
  formRef.value.resetFields();
};
</script>
<style scoped lang="scss">
.login-container {
  .login-form-wrapper {
    .logo {
      width: 400px;
      margin: 0 auto;
      img {
        width: 100%;
      }
    }
  }
}
.login-btn {
  background-image: linear-gradient(to right, #de4545, #db7e42);
  border: 0;
  margin: 0;
}
.verification {
  position: absolute;
  right: 20px;
  bottom: 8px;
}
.bottomrow {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  .ant-btn.common-btn {
    background: linear-gradient(180deg, #1baa99 0%, #8ac542 100%);
    width: 100%;
    color: #ffffff;
  }
}
.pwd-tip {
  color: #ff8d4e;
}
</style>
<style>
.dark-theme .ant-input {
  color: #ffffff;
}
</style>
