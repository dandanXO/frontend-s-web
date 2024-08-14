<template>
  <div class="login-page-container">
    <div class="center">
      <router-link to="/">
        <div class="logo">
          <img src="@/assets/app/logo.png" />
        </div>
      </router-link>
      <div class="card-bg">
        <el-tabs>
          <el-tab-pane label="账户登录">
            <AccountLogin page-type="view" />
          </el-tab-pane>
          <el-tab-pane label="手机登录">
            <el-form ref="mobileLoginRef" :rules="mobileLoginRules" :model="loginForm" label-width="70" size="large">
              <div class="light-bg form-field">
                <img class="form-field-icon" src="@/assets/home/auth/phone-icon.png" />
                <el-form-item tabindex="1" label="手机号" prop="phoneNumber">
                  <el-input v-model="loginForm.phoneNumber" placeholder="输入手机号" />
                </el-form-item>
              </div>

              <div class="light-bg form-field">
                <img class="form-field-icon" src="@/assets/home/auth/verification-icon.png" />
                <el-form-item tabindex="2" label="验证码" prop="code">
                  <el-row :gutter="10" style="justify-content: center; align-items: center">
                    <el-col :span="10">
                      <el-input
                        v-model="loginForm.code"
                        label="验证码"
                        placeholder="手机验证码"
                        @keyup.enter="phoneLogin"
                      />
                    </el-col>
                    <el-col :span="14">
                      <el-button
                        v-if="loginCountdown === 0"
                        @click="openCaptchaForm('LOGIN')"
                        size="small"
                        color="#3bafda"
                        style="width: 100%; min-height: 30px; font-size: 12px"
                        class="blue-bg"
                      >
                        获取验证码
                      </el-button>
                      <el-button v-else disabled size="small" class="blue-bg">
                        已发送（倒数{{ loginCountdown }}秒）
                      </el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
              </div>

              <div class="agreement-and-forget-pass">
                <div class="font-gray">登录即代表同意并遵守《用户协议》</div>
                <div><router-link to="/forgotPwd">忘记密码</router-link></div>
              </div>

              <el-button :loading="loadingBtn" size="large" class="blue-bg primary-btn" @click="phoneLogin">
                登录
              </el-button>
            </el-form>

            <div class="flex-div">
              <div style="visibility: hidden"><router-link to="/">先去逛逛</router-link></div>
              <div style="text-align: left" class="font-gray">
                没有账号？
                <router-link to="/register">去注册</router-link>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

        <el-dialog
          v-model="captchaDialogVisible"
          title="验证码"
          width="50%"
          align-center
          style="max-width: 500px"
          :close-on-click-modal="false"
          @keydown.enter.prevent
        >
          <el-form ref="captchaRef" :rules="captchaRules" :model="captchaForm" label-width="70" size="large">
            <div class="light-bg form-field">
              <img class="form-field-icon" src="@/assets/home/auth/verification-icon.png" />
              <el-form-item tabindex="3" label="验证码" prop="captchaCode">
                <div style="display: flex; width: 100%">
                  <el-input
                    v-model="captchaForm.captchaCode"
                    label="验证码"
                    placeholder="验证码"
                    @keyup.enter="sendOtp"
                  />
                  <img style="width: 150px" :src="verificationImg" @click="getCode" />
                </div>
              </el-form-item>
            </div>

            <el-button size="large" class="blue-bg primary-btn" @click="sendOtp">发送</el-button>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { getVerificationCode } from "@/api/index/login";
import { userStore } from "@/store/index";
import { sendSms } from "@/api/personal/personal";
import AccountLogin from "@/components/auth/login/index.vue";
import { useNotify } from "@/hooks/notify";
import { useRoute, useRouter } from "vue-router";
const notify = useNotify();

const captchaRules = {
  captchaCode: [
    {
      required: true,
      message: "请输入验证码",
      trigger: "blur"
    },
    {
      min: 4,
      max: 4,
      message: "长度为 4",
      trigger: "blur"
    }
  ]
};

const isValidPhone = (r, v) => {
  const phonePattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (!v) {
    return Promise.reject("请输入电话号码");
  } else if (phonePattern.test(v)) {
    return Promise.resolve();
  } else {
    return Promise.reject("请输入有效的电话号码");
  }
};

const mobileLoginRules = {
  phoneNumber: [
    {
      required: true,
      message: "请输入手机号码",
      trigger: "blur"
    },
    {
      validator: isValidPhone,
      trigger: "blur"
    }
  ],
  code: [
    {
      required: true,
      message: "请输入验证码",
      trigger: "blur"
    },
    {
      min: 6,
      max: 6,
      message: "长度为 6",
      trigger: "blur"
    }
  ]
};

const loginForm = reactive({
  loginName: "",
  password: ""
});

const captchaForm = reactive({
  type: "",
  captchaCode: "",
  codeId: ""
});

const passForm = reactive({
  email: ""
});

const router = useRouter();
const route = useRoute();
const loginCountdown = ref(0);
const mobileLoginRef = ref([]);
const store = userStore();
const loadingBtn = ref(false);
const captchaDialogVisible = ref(false);

const countdownTimer = (type) => {
  if (type === "LOGIN") {
    if (loginCountdown.value > 0) {
      setTimeout(() => {
        loginCountdown.value -= 1;
        countdownTimer("LOGIN");
      }, 1000);
    }
  }
};

const sendOtp = async () => {
  if (captchaForm.type === "LOGIN") {
    const smsDetail = {
      telephone: loginForm.phoneNumber,
      captchaCode: captchaForm.captchaCode,
      codeId: captchaForm.codeId
    };
    sendSms(smsDetail).then((response) => {
      if (response.code == 0) {
        loginForm.smsCodeId = response.data.codeId;
        notify({
          type: "success",
          message: "发送手机验证码成功"
        });
        captchaDialogVisible.value = false;
        getCode();
        loginCountdown.value = 60;
        countdownTimer("LOGIN");
      } else {
        notify.error(response.message);
        getCode();
      }
    });
  }
};

const openCaptchaForm = (type) => {
  mobileLoginRef.value
    .validateField("phoneNumber")
    .then(() => {
      captchaForm.captchaCode = "";
      captchaForm.type = type;
      captchaDialogVisible.value = true;
      getCode();
    })
    .catch((err) => {});
};

const phoneLogin = () => {
  loadingBtn.value = true;
  const sidParam = store.visitorId;

  (async () => {
    mobileLoginRef.value.validate().then(() => {
      if (!loginForm.smsCodeId) {
        notify.error("请先获取验证码");
        return;
      }
      store
        .telephoneLogin({
          phoneNumber: loginForm.phoneNumber,
          sid: sidParam,
          code: loginForm.code,
          smsCodeId: loginForm.smsCodeId,
          summoner: loginForm.summoner
        })
        .then(() => {
          const jumpUrl = route.query.redirect ? route.query.redirect.toString() : "/home";
          if (store.token) {
            router.push(jumpUrl);

            sessionStorage.removeItem("REFERRAL_CODE");
            sessionStorage.removeItem("SUMMON_CODE");
          } else {
            loginForm.phoneNumber = null;
            loginForm.code = null;
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    });
  })();
  loadingBtn.value = false;
};

const getCode = () => {
  getVerificationCode().then((res) => {
    if (res.code === 0) {
      verificationImg.value = "data:image/png;base64," + res.data.img;
      loginForm.codeId = res.data.id;
      captchaForm.codeId = res.data.id;
      passForm.codeId = res.data.id;
    } else {
      notify.error(res.message);
    }
  });
};

const getSummonCode = () => {
  const summonCode = sessionStorage.getItem("SUMMON_CODE");
  // && route.query && route.query.refer
  if (summonCode) {
    loginForm.summoner = summonCode;
  }
};
const verificationImg = ref("");

onMounted(() => {
  getCode();
  getSummonCode();
});
</script>

<style scoped lang="scss">
.login-page-container {
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: url("@/assets/home/auth/login-page-bg.jpg") no-repeat top center;
  background-size: cover;
  display: flex;
}

.center {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 30px;
  margin: 40px auto;
  width: 100%;
  max-width: 500px;
}

.logo img {
  width: 200px;
}

.card-bg {
  background-color: #f7f9fc;
  box-shadow: 0px 0px 10px 0px #0000001a;
  padding: 50px;
  border-radius: 10px;
}

.light-bg {
  font-size: 14px;
  background-color: #f7f8fb;
  border-radius: 15px;
  box-shadow: 0px 0px 8px 0px #a9c9ea inset;
  margin-bottom: 30px;
}

.form-field {
  display: grid;
  grid-template-columns: 40px 1fr;
  padding: 8px 15px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: relative;
  width: 100%;

  .form-field-icon {
    margin: auto;
  }
}

.blue-bg {
  background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
  box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
  color: #fff;
  font-size: 14px;
  border-radius: 30px;
}

.primary-btn {
  margin-top: 20px;
  width: 100%;
}

.agreement-and-forget-pass {
  margin-top: 55px;
  display: flex;
  justify-content: space-between;

  .highlight {
    color: #5e8aee;
  }
}
.flex-div {
  margin-top: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dark {
  .login-page-container {
    background: url("@/assets/home/auth/login-page-bg-dark.png") no-repeat top center;
    background-size: cover;

    :deep(.el-tabs__nav) {
      box-shadow: none;
      border: 1px solid $background-content-block-lighter-dark;
    }
  }

  .card-bg {
    @include content-block-dark;
    background: linear-gradient(178.46deg, #2D4065 2.36%, rgba(45, 64, 101, 0) 98.7%);
  }

  .light-bg {
    background-color: $background-content-block-lighter-dark;
    box-shadow: none;
  }

  .font-gray {
    color: $font-3-dark;
  }
}
</style>
<style lang="scss">
.login-page-container {
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

  .el-tabs__active-bar,
  .el-tabs__nav-wrap::after {
    display: none;
  }

  .el-tabs__nav {
    border-radius: 30px;
    box-shadow: 0px -1.7px 6.09px 0px #a2bff4 inset;
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 5px;
    width: 100%;
  }

  .el-tabs--top .el-tabs__item.is-top {
    font-size: 14px;
    border-radius: 30px;
    color: #468cff;
    // box-shadow: 0px -1.7px 6.09px 0px #a2bff4 inset;
    display: flex;
    width: 150px;
    padding: 0;
    width: 100%;
    min-width: 200px;

    &.is-active {
      background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
      box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
      color: #fff;
      font-size: 14px;
      border-radius: 30px;
    }
  }

  .el-dialog__header {
    background: linear-gradient(180deg, #73b2ff 0%, #3981ff 100%);
    box-shadow: 0px -2px 4.58px 0px #b1d7ff inset, 0px -1px 3.664px 0px #5894ff inset;
    color: #fff;
  }
}
</style>
