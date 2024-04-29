<template>
  <div class="not-loggedin-container">
    <div class="account">
      <input type="text" class="account-input" placeholder="계정" v-model="loginForm.loginName" />
    </div>
    <div class="password">
      <input type="password" class="password-input" placeholder="암호" v-model="loginForm.password" />
    </div>
    <div class="captcha-code">
      <input type="text" class="captcha-code-input" placeholder="암호" v-model="loginForm.captchaCode" />
      <img :src="verificationImg" />
    </div>
    <div class="register" @click="goToRegister">
      <div class="register-text">등록</div>
    </div>
    <div class="login" @click.prevent="onLoginSubmit">
      <div class="login-text">로그인</div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { useRouter } from "vue-router";

const store = userStore();
const router = useRouter();
const verificationImg = ref("");

const loginForm = reactive({
  loginName: "",
  password: "",
  captchaCode: "",
  codeId: ""
});

const goToRegister = () => {
  router.push('/?page=register');
}

const onLoginSubmit = () => {
  (async () => {
    store
      .memberLogin({
        loginName: loginForm.loginName.trim(),
        password: loginForm.password,
        sid: store.visitorId,
        captchaCode: loginForm.captchaCode,
        codeId: loginForm.codeId
      })
      .then(() => {
        location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  })();
};

const getCode = () => {
  api
    .get("/member/verificationEasyCode")
    .then((res) => {
      const response = res.data;
      if (response.code === 0) {
        verificationImg.value = "data:image/png;base64," + response.data.img;
        loginForm.codeId = response.data.id;
      }
    })
    .catch((e) => {
      // $q.notify({
      //   color: "negative",
      //   position: "top",
      //   message: res.data.message,
      //   icon: "report_problem"
      //     });
    });
};

onMounted(() => {
  getCode();
});
</script>

<style scoped lang="scss">
.not-loggedin-container {
  width: 600px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.account,
.password,
.captcha-code {
  width: 140px;
  height: 40px;
  background: #080a0e;
  display: flex;
  align-items: center;
}
.captcha-code {
  width: 300px;
  display: flex;
  flex-direction: column;
}

.account-input,
.password-input,
.captcha-code-input {
  border: none;
  padding-left: 12px;
  color: #fff;

  &:focus {
    outline: none;
  }

  background: transparent;
}

.register {
  width: 100px;
  height: 36px;
  background-image: url("../../assets/images/login/register-btn.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .register-text {
    font-size: 16px;
    line-height: 22.4px;
    color: #fff;
  }
}

.login {
  width: 100px;
  height: 36px;
  background-image: url("../../assets/images/login/login-btn.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .login-text {
    font-size: 16px;
    line-height: 22.4px;
    color: #fff;
  }
}
</style>
