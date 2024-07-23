<template>
  <el-form ref="loginRef" :rules="loginRules" :model="loginForm" label-width="70" size="large">
    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/username-icon.png" />
      <el-form-item label="用户名" prop="loginName">
        <el-input v-model="loginForm.loginName" placeholder="请输入6-12位非汉字字符" clearable />
      </el-form-item>
    </div>

    <div class="light-bg form-field">
      <img class="form-field-icon" src="@/assets/home/auth/password-icon.png" />
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
      <img class="form-field-icon" src="@/assets/home/auth/verification-icon.png" />
      <el-form-item label="验证码" prop="captchaCode">
        <div style="display: flex; width: 100%">
          <el-input
            v-model="loginForm.captchaCode"
            label="验证码"
            placeholder="请输入验证码"
            @keyup.enter="submitLogin"
            clearable
          ></el-input>
          <img style="width: 100px" :src="verificationImg" @click="getCode" />
        </div>
      </el-form-item>
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
    }
  ],
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
        store
          .memberLogin({
            loginName: loginForm.loginName,
            password: loginForm.password,
            sid: sidParam,
            captchaCode: loginForm.captchaCode,
            codeId: loginForm.codeId,
            summoner: loginForm.summoner
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
  if(route.path === '/login'){
    router.push("/register");
  }else{
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
onMounted(() => {
  getCode();
  getSummonCode();
});
</script>

<style scoped lang="scss" src="@/scss/pages/accountDialog.scss"/>

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
