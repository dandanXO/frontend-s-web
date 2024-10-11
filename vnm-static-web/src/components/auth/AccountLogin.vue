<template>
  <el-form ref="loginRef" :rules="loginRules" :model="loginForm" label-width="200" size="large">
    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/username-icon.png" />
      <el-form-item :label="$t('login.username')" prop="loginName">
        <el-input v-model="loginForm.loginName" :placeholder="$t('login.username')" clearable />
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/password-icon.png" />
      <el-form-item :label="$t('login.password')" prop="password">
        <el-input v-model="loginForm.password" :placeholder="$t('login.password')" type="password" show-password
          clearable />
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/verification-icon.png" />
      <el-form-item :label="$t('login.captcha')" prop="captchaCode">
        <div style="display: flex; width: 100%">
          <el-input v-model="loginForm.captchaCode" :label="$t('login.captcha')" :placeholder="$t('login.captcha')"
            @keyup.enter="submitLogin" clearable></el-input>
          <img style="width: 100px" :src="verificationImg" @click="getCode" />
        </div>
      </el-form-item>
    </div>

    <div class="agreement-and-forget-pass">
      <div class="rememberMe">
        <el-switch v-model="rememberMe" size="small" :active-text="$t('login.rememberMe')" inactive-text="" />
      </div>
      <div>
        <a @click="openForgotpwdDialog">{{ $t("login.forgotPwd") }}</a>
      </div>
    </div>

    <button type="button" :loading="loadingBtn" size="large" class="primary-btn login-btn" @click="submitLogin">
      {{ $t("login.login") }}
    </button>
  </el-form>
  <button type="button" :loading="loadingBtn" size="large" class="primary-btn reg-btn" @click="openRegDialog">
    {{ $t("login.register") }}
  </button>
  <!-- <div class="flex-div">
    <div style="visibility:hidden"><a @click="closeLoginDialog">先去逛逛</a></div>
    
    <div style="text-align: left" class="font-gray">
      没有账号？
      <a @click="openRegDialog">去注册</a>
    </div>

  </div> -->
</template>

<script setup>
import { ref, onMounted, reactive, defineEmits } from "vue";
import { getVerificationCode } from "@/api/index/login";
import { userStore } from "@/store/index";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps(["pageType"]);
const rememberMe = ref(false);

const loginRules = {
  loginName: [
    {
      required: true,
      message: t("placeholder.usernamereq"),
      trigger: "blur"
    },
    {
      min: 6,
      max: 11,
      message: t("placeholder.username"),
      trigger: "blur"
    }
  ],
  password: [
    {
      required: true,
      message: t("placeholder.passwordreq"),
      trigger: "blur"
    }
  ],
  captchaCode: [
    {
      required: true,
      message: t("placeholder.captchareq"),
      trigger: "blur"
    },
    {
      min: 4,
      max: 4,
      message: t("placeholder.captcha"),
      trigger: "blur"
    }
  ]
};

const loginForm = reactive({
  loginName: "",
  password: "",
  captchaCode: ""
});

const loginRef = ref([]);
const store = userStore();
const loadingBtn = ref(false);
const router = useRouter();
const route = useRoute();

const submitLogin = () => {
  loadingBtn.value = true;
  (async () => {
    const sidParam = store.visitorId;

    if (rememberMe.value) {
      const obj = {
        loginName: loginForm.loginName,
        password: loginForm.password
      };
      sessionStorage.setItem("loginPassword", JSON.stringify(obj));
    } else {
      sessionStorage.removeItem("loginPassword");
    }
    loginRef.value
      .validate()
      .then(() => {
        store
          .memberLogin({
            loginName: loginForm.loginName,
            password: loginForm.password,
            sid: sidParam,
            captchaCode: loginForm.captchaCode,
            codeId: loginForm.codeId
          })
          .then(() => {
            const jumpUrl = route.query.redirect
              ? route.query.redirect.toString()
              : props.pageType === "view"
                ? "/"
                : route.path;
            if (store.token) {
              router.push(jumpUrl);

              sessionStorage.removeItem("REFERRAL_CODE");
              loginForm.loginName = null;
              loginForm.password = null;
              loginForm.captchaCode = null;
              closeLoginDialog();

              // FB tracking :: login-success
              if (store.isAffiliateA) {
                fbq("track", "login-success");
              }
            } else {
              getCode();
            }
          })
          .catch((error) => {
            console.log(error.message);
            getCode();
          });
      })
      .catch(() => { });
    loadingBtn.value = false;
  })();
};

const getCode = () => {
  loginForm.captchaCode = "";

  getVerificationCode().then((res) => {
    if (res.code === 0) {
      verificationImg.value = "data:image/png;base64," + res.data.img;
      loginForm.codeId = res.data.id;
    } else {
      ElMessage.error({
        type: "error",
        message: res.message
      });
    }
  });
};
const verificationImg = ref("");

const emits = defineEmits(["close-dialog, open-reg-dialog, open-forgotpwd-dialog"]);

const closeLoginDialog = () => {
  emits("close-dialog");
};

const openRegDialog = () => {
  emits("open-reg-dialog");
};

const openForgotpwdDialog = () => {
  emits("open-forgotpwd-dialog");
};

onMounted(() => {
  getCode();

  const hasPassword = sessionStorage.getItem("loginPassword");
  if (hasPassword) {
    const obj = JSON.parse(hasPassword);
    loginForm.loginName = obj.loginName;
    loginForm.password = obj.password;
    rememberMe.value = true;
  }
});
</script>

<style scoped lang="scss">
.light-bg {
  font-size: 14px;
  background-color: #f7f8fb;
  border-radius: 15px;
  box-shadow: 0px 0px 8px 0px #a9c9ea inset;
  // margin-bottom: 30px;
}

.form-field {
  display: grid;
  grid-template-columns: 40px 1fr;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: relative;
  width: 100%;
  margin-top: 50px !important;
  padding: 5px;

  .form-field-icon {
    margin: auto;
    height: 30px;
  }
}

:deep(.el-form-item--large .el-form-item__label) {
  position: absolute;
  top: -40px;
  left: 0;
}

.agreement-and-forget-pass {
  display: flex;
  justify-content: space-between;

  .rememberMe {
    display: flex;
    gap: 5px;
  }

  .highlight {
    color: #5e8aee;
  }
}

.blue-bg {
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
  color: #fff;
  font-size: 14px;
  border-radius: 8px;
}

.primary-btn {
  margin-top: 20px;
  width: 100%;
}

.login-btn {
  color: #fff;
  font-size: 14px;
  border-radius: 8px;
  background: url(../../assets/images/common/loginbtn.png) no-repeat center center;
  background-size: cover;
  padding: 10px 0;
}

.reg-btn {
  background: #fcfdfe;

  padding: 10px 0;
  border-radius: 8px;
  color: #000000;
  box-shadow: 0px -3.5004611015319824px 3.5004611015319824px 0px #c3d4e6 inset;
}

.flex-div {
  margin-top: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

<style lang="scss">
.form-field {
  margin: 15px 0px;

  .el-form-item {
    margin-bottom: 0px;
  }

  .el-form-item__label {
    justify-content: flex-start;
  }

  .el-input__wrapper {
    box-shadow: none;
    background: none;
  }

  .el-form-item.is-error {
    margin-bottom: 15px;
  }
}
</style>
