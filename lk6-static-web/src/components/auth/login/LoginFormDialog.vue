<template>
  <el-form
    class="login-form-dialog-form"
    ref="loginRef"
    :rules="loginRules"
    :model="loginForm"
    label-width="70"
    size="large"
  >
    <div class="login-form-field">
      <img
        class="login-form-field-icon"
        :src="require('@/assets/home/auth/username-icon.svg')"
      />

      <el-form-item :label="$t('form.username')" prop="loginName">
        <el-input v-model="loginForm.loginName" :placeholder="$t('form.loginNameRule01', {min: 4, max: 12})" clearable :disabled="isLoading" />
      </el-form-item>
    </div>

    <div class="login-form-field">
      <img
        class="login-form-field-icon"
        :src="require('@/assets/home/auth/password-icon.svg')"
      />

      <el-form-item :label="$t('form.password')" prop="password">
        <el-input
          v-model="loginForm.password"
          :placeholder="$t('form.passwordRule01', {min: 6, max: 12})"
          type="password"
          show-password
          clearable
          :disabled="isLoading"
        />
      </el-form-item>
    </div>

    <div class="login-form-field geetest-captcha-form-field">
      <img
        class="login-form-field-icon"
        :src="require('@/assets/home/auth/verification-icon.svg')"
      />

      <div class="geetest-captcha-wrapper">
        <div class="geetest-captcha-label">
          <span class="asterisk">*</span>
          <span class="label-text">{{ $t('form.verificationCode') }}</span>
        </div>
        <div id="captchaContainer"></div>
      </div>
    </div>

    <div class="agreement-and-forget-pwd">
      <div class="agreement-text">
        {{ $t('form.acceptTermsAndConditions') }}
        <span class="underline">《{{$t('form.userAgreement')}}》</span>
      </div>
      <div><a class="forget-pwd-text" @click="openForgotpwdDialog">{{ $t('form.forgotPwd') }}</a></div>
    </div>

    <el-button :loading="isLoading" size="large" class="login-form-submit-btn" @click="submitLogin">{{ $t('btn.login') }}</el-button>

    <div class="register-hint">
      <span class="no-acc">{{$t('form.dontHaveAcc')}}？</span>
      <a class="go-reg" @click="openRegDialog">{{ $t('form.goCreateAcc') }}</a>
    </div>
  </el-form>
</template>

<script setup>
import { reactive, ref, onMounted, defineEmits } from "vue";
import { userStore } from "@/store/index";
import { useRoute, useRouter } from "vue-router";
import { useNotify } from "@/hooks/notify";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps(["pageType"]);

const loginRef = ref();
const store = userStore();
const isLoading = ref(false);
const router = useRouter();
const route = useRoute();
const notify = useNotify();
const loginForm = reactive({
  loginName: "",
  password: "",
  captchaCode: ""
});

const message = ref("Loading Geetest...");

// Dynamically load the Geetest script
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Initialize Geetest with configuration
const initGeetest = (config) => {
  console.log(config);
  window.initGeetest4(config.config, config.handler);
};

function captchaHandler(captchaObj) {
  window.captchaObj = captchaObj;
  captchaObj
    .appendTo("#captchaContainer")
    .onReady(function () {
      // console.log("ready");
    })
    .onNextReady(function () {
      // console.log("nextReady");
    })
    .onBoxShow(function () {
      isLoading.value = true;
    })
    .onError(function (e) {
      console.log(e);
    })
    .onSuccess(function () {
      let result = window.captchaObj.getValidate();
      for (let key in result) {
        loginForm[key] = result[key];
      }
      console.log(loginForm);
      isLoading.value = false;
    })
    .onClose(() => {
      isLoading.value = false;
    });
}

const emits = defineEmits(["close-dialog, open-reg-dialog, open-forgotpwd-dialog"]);

const closeLoginDialog = () => {
  emits("close-dialog");
};

const openForgotpwdDialog = () => {
  emits("open-forgotpwd-dialog");
};

const openRegDialog = () => {
  // console.log(route.path)
  if (route.path === "/login") {
    router.push("/register");
  } else {
    emits("open-reg-dialog");
  }
};

const submitLogin = () => {
  isLoading.value = true;
  (async () => {
    const sidParam = store.visitorId;
    loginRef.value
      .validate()
      .then(() => {
        if (window.captchaObj) {
          const validate = window.captchaObj.getValidate();
          if (!validate) {
            notify({
              type: "error",
              message: "请完成验证码"
            });
            return;
          }

          store
            .memberLogin({
              loginName: loginForm.loginName,
              password: loginForm.password,
              sid: sidParam,
              summoner: loginForm.summoner,
              lotNumber: loginForm.lot_number,
              captchaOutput: loginForm.captcha_output,
              passToken: loginForm.pass_token,
              genTime: loginForm.gen_time
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
                sessionStorage.removeItem("SUMMON_CODE");
                sessionStorage.setItem("POPUP", "true");
                loginForm.loginName = null;
                loginForm.password = null;
                loginForm.captchaCode = null;

                closeLoginDialog();
              }
            })
            .catch((error) => {
              console.log(error.message);
            });
        }
      })
      .catch(() => {});
    isLoading.value = false;
  })();
};

const getSummonCode = () => {
  const summonCode = sessionStorage.getItem("SUMMON_CODE");
  // && route.query && route.query.refer
  if (summonCode) {
    loginForm.summoner = summonCode;
  }
};

onMounted(async () => {
  try {
    // Step 1: Load Geetest script
    await loadScript("https://static.geetest.com/v4/gt4.js");

    // Step 2: Call your backend to get Geetest configuration (fake config for demo)
    const geetestConfig = {
      config: {
        captchaId: "49cbcb1424a170f03f8c38648a1b2b31",
        language: "zh",
        nativeButton: {
          width: "100%",
          height: "48px"
        },
        nextWidth: "200px",
        product: "float"
      },
      handler: captchaHandler
    };

    // Step 3: Initialize Geetest with the config
    await initGeetest(geetestConfig);
  } catch (error) {
    message.value = "Error loading Geetest!";
    console.error("Geetest loading error:", error);
  }

  getSummonCode();
});

const loginRules = {
  loginName: [
    {
      required: true,
      message: t('form.pleaseEnterField', {field: t('form.username')}),
      trigger: "blur"
    },
    {
      min: 4,
      max: 12,
      message: t('form.lengthMustBeBetween', {min:4, max:12}),
      trigger: "blur"
    }
  ],
  password: [
    {
      required: true,
      message: t('form.pleaseEnterField', {field: t('form.password')}),
      trigger: "blur"
    },
    {
      min: 6,
      max: 12,
      message: t('form.lengthMustBeBetween', {min:6, max:12}),
      trigger: "blur"
    }
  ]
};
</script>

<style lang="scss" scoped>
.login-form-dialog-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  font-family: "PingFang SC";

  .login-form-field {
    display: grid;
    grid-template-columns: 40px 1fr;
    padding: 8px 15px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    position: relative;
    width: 100%;
    border-radius: 30px;
    font-size: 14px;
    background: linear-gradient(180deg, #FFFFFF 0%, #E3EFFF 100%);
    box-shadow: 0px 2px 2px 0px #FFFFFFCC inset, 0px 2px 0px 0px #C6D9FF;


    .login-form-field-icon {
      margin: auto;
      width: 35px;
    }

    :deep(.el-form-item) {
      margin-bottom: 0px;
    }

    :deep(.el-form-item__label) {
      justify-content: flex-start;
      color: #000;
    }

    :deep(.el-input__wrapper) {
      box-shadow: none;
      background: none;
    }

    :deep(.el-form-item.is-error) {
      margin-bottom: 15px;
    }

    &.geetest-captcha-form-field {
      padding: 0 !important;

      #captchaContainer {
        width: 100%;

        .geetest_captcha.geetest_dark .geetest_holder .geetest_content,
        .geetest_captcha.geetest_dark.geetest_freeze_wait .geetest_holder .geetest_content {
          background-image: linear-gradient(180deg, #ecf3fd, 0%, #ecf3fd 100%) !important;
          border-color: #424f72;
        }

        .geetest_captcha.geetest_dark .geetest_holder .geetest_content .geetest_tip_container .geetest_tip {
          color: #424f72;
          font-family: "PingFang SC" !important;
        }

        .geetest_captcha.geetest_dark.geetest_lock_success
          .geetest_content
          .geetest_tip_container
          .geetest_tips_wrap
          .geetest_tip {
          color: #39c522 !important;
        }
      }

      .login-form-field-icon {
        padding: 0;
        margin-left: 17px;
      }

      .geetest-captcha-wrapper {
        display: flex;
        width: 100%;
        align-items: center;

        .geetest-captcha-label {
          width: 130px;

          .asterisk {
            color: #e2676a;
            margin-right: 4px;
          }

          .label-text {
            font-size: 12px;
          }
        }
      }
    }
  }

  .login-form-submit-btn {
    color: #fff;
    background: radial-gradient(103.75% 103.75% at 50% -3.75%, #94C3FF 0%, #4B91F5 100%);
    border: 1px solid #FFFFFF;
    box-shadow: 0px 2px 0px 0px #9AB0FF70;
    font-size: 14px;
    border-radius: 30px;
    font-family: "Poppins", "PingFang SC", sans-serif;

    &:hover {
      filter: brightness(1.1);
    }
  }

  .agreement-and-forget-pwd {
    display: flex;
    justify-content: space-between;

    .agreement-text {
      color: #555;
    }

    .forget-pwd-text {
      color: #1890ff;

      &:hover {
        filter: brightness(1.1);
      }
    }

    .underline {
      text-decoration: underline;
    }
  }

  .register-hint {
    display: flex;
    justify-content: flex-end;
  }
}

.dark {
  .login-form-dialog-form {
    .login-form-field {
      background-color: #273354;
      box-shadow: none;

      .login-form-field-icon {
        width: 25px;
      }

      :deep(.el-form-item__label) {
        color: #fff;
      }

      &.geetest-captcha-form-field {
        .geetest-captcha-wrapper {
          .geetest-captcha-label {
            width: 130px;

            .asterisk {
              color: #e2676a;
              margin-right: 4px;
            }

            .label-text {
              font-size: 12px;
              color: #fff;
            }
          }
        }
      }
    }

    .agreement-and-forget-pwd {
      .agreement-text {
        color: #a98f7c;
      }

      .forget-pwd-text {
        color: #a98f7c;
      }
    }
  }

  .login-form-submit-btn {
    background: url("../../../assets/home/auth/login-btn-bg.svg") no-repeat center center;
    background-size: cover;
    box-shadow: none;
    border-radius: 6px;
    border: 1px solid #3a93ce;
    margin-top: 20px;
  }

  .register-hint {
    justify-content: center;

    .no-acc {
      color: #a98f7c;
    }

    .go-reg {
      color: #3a93ce;
    }
  }
}
</style>


<style lang="scss">
  .el-overlay:has(.acc-dialog) {
    background: url("@/assets/home/auth/login-page-bg.jpg");
    background-size: 100% auto;

    .acc-dialog-homelogo {
      display:flex;
      gap:5px;
      justify-content:center;
      align-items:center;
      margin: 0 auto;
    }

    .el-tabs__nav-wrap:after {
      display: none;
    }

    .el-form-item__label {
      font-size: 12px;
    }
  }
</style>