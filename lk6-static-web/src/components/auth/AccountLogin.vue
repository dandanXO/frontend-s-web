<template>
  <el-form ref="loginRef" :rules="loginRules" :model="loginForm" label-width="70" size="large">
    <div class="light-bg form-field">
      <img class="form-field-icon" src="../../assets/home/auth/username-icon.svg" />
      <el-form-item label="用户名" prop="loginName">
        <el-input v-model="loginForm.loginName" placeholder="请输入6-12位非汉字字符" clearable />
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="../../assets/home/auth/password-icon.svg" />
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

    <div class="light-bg form-field geetest-captcha-form-field">
      <img class="form-field-icon" src="@/assets/home/auth/verification-icon.svg" />
      <div class="geetest-captcha-wrapper">
        <div class="geetest-captcha-label">
          <span style="color: red; margin-right: 4px">*</span>
          <span>验证码</span>
        </div>
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
    </div>

    <div class="agreement-and-forget-pass">
      <div class="font-gray">登录即代表同意并遵守《用户协议》</div>
      <div><a @click="openForgotpwdDialog">忘记密码</a></div>
    </div>

    <el-button :loading="loadingBtn" size="large" class="blue-bg primary-btn" @click="submitLogin">登录</el-button>
  </el-form>

  <div class="flex-div">
    <div style="visibility: hidden"><a @click="closeLoginDialog">先去逛逛</a></div>

    <div style="text-align: left" class="font-gray">
      没有账号？
      <a @click="openRegDialog">去注册</a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, defineEmits } from "vue";
import { getVerificationCode } from "@/api/index/login";
import { userStore } from "@/store/index";
import { useRoute, useRouter } from "vue-router";
import { useNotify } from "@/hooks/notify";

const props = defineProps(["pageType"]);

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
            notify({
              type: "error",
              message: "请完成验证码"
            });
            return;
          }
          // You can now send the validate data to your backend
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
        nextWidth: "280px",
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
  getCode();
  getSummonCode();
});
</script>

<style scoped lang="scss" src="@/scss/pages/accountDialog.scss" />

<style lang="scss">
.geetest-captcha-form-field {
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

    .geetest_captcha.geetest_dark.geetest_lock_success .geetest_holder .geetest_content {
      // background-image: linear-gradient(180deg, #4e4e4e, 0%, #4e4e4e 100%) !important;
    }

    .geetest_captcha.geetest_dark.geetest_lock_success
      .geetest_content
      .geetest_tip_container
      .geetest_tips_wrap
      .geetest_tip {
      color: #39c522 !important;
    }
  }

  .form-field-icon,
  .geetest-captcha-label {
    padding: 8px 15px;
  }

  .geetest-captcha-wrapper {
    display: flex;
    width: 100%;
    align-items: center;
    color: black;

    .geetest-captcha-label {
      width: 112px;
    }
  }
}

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
