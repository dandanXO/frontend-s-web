<template>
  <div class="not-loggedin-container">
    <form action="" class="login-form" @keypress.enter="onLoginSubmit">
      <div class="left-container">
        <div class="account">
          <q-input 
            ref="loginNameRef"
            dense
            borderless
            type="text" 
            class="account-input" 
            placeholder="계정" 
            v-model="loginForm.loginName" 
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('lang.input_username_cannot_empty'),
              (val) => (val.length > 5 && val.length <= 12) || $t('lang.username_between_6_12'),
              (val) => val.match(/^[A-Za-z0-9]+$/) || $t('lang.only_letter_number_allowed')
            ]"
          />
        </div>
        <div class="password">
          <q-input 
            ref="pwdRef"
            dense
            borderless
            type="password" 
            class="password-input" 
            placeholder="암호" 
            v-model="loginForm.password"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || $t('lang.input_password_empty')]"
           />
        </div>
        <div class="captcha-code">
          <input type="text" class="captcha-code-input" placeholder="암호" v-model="loginForm.captchaCode" />
        </div>
        <img class="captcha-img" :src="verificationImg" @click.prevent="toGetCode" />
      </div>

      <div class="right-container">
        <div class="register" @click="goToRegister">
          <div class="register-text">등록</div>
        </div>
        <div class="login" @click.prevent="onLoginSubmit">
          <div class="login-text">로그인</div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { useBreakpoints } from "@vueuse/core";

const loginNameRef = ref();
const pwdRef = ref();

const breakpoints = useBreakpoints({
  laptop: 768
});

const loginWindow = breakpoints.smaller("laptop");

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
  router.push("/?page=register");
};

const toGetCode = () => {
  getCode();
};

const onLoginSubmit = () => {
  if (loginWindow.value) {
    router.push("/?page=login");
  } else {
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
          getCode();
        });
    })();
  }
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
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  @media (min-width: 1200px) {
    flex-direction: row;
    width: 700px;
    justify-content: flex-end;
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  @media (min-width: 1200px) {
    flex-direction: row;
  }
}

.left-container {
  height: 40px;
  display: none;
  justify-content: space-between;
  @media (min-width: 769px) {
    display: flex;
  }
}

.right-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: 0px;
  
  @media (min-width: 1200px) {
    margin-left: 16px;
    margin-top: 0px;
  }
}
.account,
.password {
  background: #080a0e;
  display: flex;
  align-items: center;
  border: 1px solid #2D2D2D;
}

.password {
  margin-left: 8px;
  margin-right: 8px;
}
.captcha-code {
  // height: 40px;
  background: #080a0e;
  display: flex;
  margin-right: 4px;
  border: 1px solid #2D2D2D;
}

.captcha-img {
  // height: 40px;
  margin: 2px;
}

.account-input,
.password-input,
.captcha-code-input {
  padding: 5px 10px;
  border: none;
  color: #fff;

  &:focus {
    outline: none;
  }

  background: transparent;
}

.captcha-code-input {
  width: 80px;
}

.register {
  width: 100px;
  min-height: 35px;
  background: linear-gradient(180deg, #ffe2a0 0%, #FF7421 100%);
  border: 2px solid rgb(201 128 0);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  @media (min-width: 1200px) {
    width: 100px;
    height: 100%;
  }
  .register-text {
    font-size: 12px;
    line-height: 16px;
    color: #fff;
    @media (min-width: 1200px) {
      font-size: 16px;
    }
    line-height: 22.4px;
  }
}

.login {
  width: 80px;
  min-height: 35px;
  background: linear-gradient(180deg, #83d2f9 0%, #2659FF 100%);
  border: 2px solid #2a4486;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 16px;
  @media (min-width: 1200px) {
    width: 100px;
    height: 100%;
  }
  .login-text {
    font-size: 12px;
    line-height: 16px;
    color: #fff;
    @media (min-width: 1200px) {
      font-size: 16px;
      line-height: 22.4px;
    }
  }
}
</style>
