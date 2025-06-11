<template>
  <el-form ref="loginRef" :rules="loginRules" :model="loginForm" label-width="70" size="large" class="login-form">
    <div class="light-bg form-field">
      <img style="width: 25px" class="form-field-icon" src="@/assets/home/auth/username-icon-dark.png" />
      <el-form-item label="用户名" prop="loginName">
        <el-input v-model="loginForm.loginName" placeholder="请输入6-12位非汉字字符" clearable />
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img style="width: 25px" class="form-field-icon" src="@/assets/home/auth/password-icon-dark.png" />
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          placeholder="请输入6-12位字母/数字组合"
          type="password"
          show-password
          clearable
        />
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img style="width: 25px" class="form-field-icon" src="@/assets/home/auth/verification-icon-dark.png" />
      <el-form-item label="验证码" prop="captchaCode">
        <div style="display: flex; width: 100%">
          <!-- <el-input
              v-model="loginForm.captchaCode"
              label="验证码"
              placeholder="请输入验证码"
              @keyup.enter="submitLogin"
              clearable
            ></el-input>
            <img style="width: 100px" :src="verificationImg" @click="getCode" /> -->
          <div id="captchaContainer"></div>
        </div>
      </el-form-item>
    </div>

    <div class="agreement-and-forget-pass">
      <div>
        登录即代表同意并遵守
        <u>《用户协议》</u>
      </div>
      <div><a @click="openForgotpwdDialog">忘记密码</a></div>
    </div>

    <el-button :loading="loadingBtn" size="large" class="login-button" style="width: 100%" @click="submitLogin">
      登录
    </el-button>

    <div class="register-or-sightsee">
      <div style="display: none"><a @click="closeLoginDialog">先去逛逛</a></div>

      <div style="text-align: left">
        没有账号？
        <a @click="openRegDialog">去注册</a>
      </div>
    </div>
  </el-form>
</template>

<script setup>
import { ref, onMounted, reactive, defineEmits } from "vue";
import { getVerificationCode } from "@/api/index/login";
import { userStore } from "@/store/index";
import { useRoute, useRouter } from "vue-router";
import { useNotify } from "@/hooks/notify";

const props = defineProps(["pageType"]);

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

const notify = useNotify();

const loginRules = {
  loginName: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur"
    },
    {
      min: 6,
      max: 12,
      message: "长度要在 6-12 之间",
      trigger: "blur"
    }
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur"
    },
    {
      min: 6,
      max: 12,
      message: "长度要在 6-12 之间",
      trigger: "blur"
    }
  ]
  // captchaCode: [
  //   {
  //     required: true,
  //     message: "请输入验证码",
  //     trigger: "blur"
  //   },
  //   {
  //     min: 4,
  //     max: 4,
  //     message: "长度为 4",
  //     trigger: "blur"
  //   }
  // ]
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
    loginRef.value
      .validate()
      .then(() => {
        if (window.captchaObj) {
          const validate = window.captchaObj.getValidate();
          if (!validate) {
            alert("Please complete the captcha!");
            return;
          }

          store
            .memberLogin({
              loginName: loginForm.loginName,
              password: loginForm.password,
              sid: sidParam,
              // captchaCode: loginForm.captchaCode,
              // codeId: loginForm.codeId,
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
                loginForm.loginName = null;
                loginForm.password = null;
                loginForm.captchaCode = null;
                closeLoginDialog();
              } else {
                getCode();
              }
            })
            .catch((error) => {
              console.log(error.message);
              getCode();
            });
        }
      })
      .catch(() => {});
    loadingBtn.value = false;
  })();
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
      // console.log("boxShow");
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
    });
}

const getCode = () => {
  loginForm.captchaCode = "";

  getVerificationCode().then((res) => {
    if (res.code === 0) {
      verificationImg.value = "data:image/png;base64," + res.data.img;
      loginForm.codeId = res.data.id;
    } else {
      notify({
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
  // console.log(route.path)
  if (route.path === "/login") {
    router.push("/register");
  } else {
    emits("open-reg-dialog");
  }
};

const openForgotpwdDialog = () => {
  emits("open-forgotpwd-dialog");
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
        captchaId: "49cbcb1424a170f03f8c38648a1b2b31"
      },
      handler: captchaHandler
    };

    // Step 3: Initialize Geetest with the config
    await initGeetest(geetestConfig);
  } catch (error) {
    message.value = "Error loading Geetest!";
    console.error("Geetest loading error:", error);
  }

  getCode();
  getSummonCode();
});
</script>

<style scoped lang="scss" src="@/scss/pages/accountDialog.scss" />

<style lang="scss">
.dark {
  .el-overlay:has(.acc-dialog) {
    background: url("@/assets/home/auth/login-page-bg-dark.png");
    background-size: 100% auto;
  }
  .form-field {
    margin: 0px;
    padding: 4px 8px;
    border-radius: 6px;
    gap: 0px;

    .el-form-item {
      margin-bottom: 0px;
    }

    .el-form-item__label {
      justify-content: flex-start;
      color: #fff;
    }

    .el-input__wrapper {
      box-shadow: none;
      background: none;
    }

    .el-form-item.is-error {
      margin-bottom: 15px;
    }
  }

  .el-tabs__item {
    font-family: "PingFang SC";
    color: #a98f7c;
  }

  .el-tabs__item.is-active {
    color: #fff;
    font-weight: bold;
  }

  .el-tabs__active-bar {
    background: #fff;
  }

  .el-tabs__nav-wrap:after {
    background: transparent;
  }

  .login-button {
    background: url("../../../assets/home/auth/login-btn-bg.svg") no-repeat center center;
    background-size: cover;
    box-shadow: none;
    border-radius: 6px;
    border: 1px solid #3a93ce;
    margin-top: 20px;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .agreement-and-forget-pass {
    font-family: "PingFang SC";
    color: #a98f7c;

    a {
      color: #a98f7c;
    }
  }

  .register-or-sightsee {
    font-family: "PingFang SC";
    display: flex;
    justify-content: center;
    color: #a98f7c;

    a {
      color: #4a99e9;
    }
  }
}
</style>
