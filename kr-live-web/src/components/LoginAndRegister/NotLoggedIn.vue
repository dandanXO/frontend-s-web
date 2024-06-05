<template>
  <div class="not-loggedin-container">
    <form action="" class="login-form" @keypress.enter="onLoginSubmit">
      <div class="right-container">
        <q-btn class="primary-button blue" @click="goToRegister">
          {{ $t('lang.login_register') }}
        </q-btn>
        <q-btn class="primary-button yellow" @click="goToLogin">
          {{ $t('lang.login') }}
        </q-btn>
      </div>
      <div class="actions-topbar" v-if="!props.isH5Banner">
        <q-btn class="primary-button blue-square" @click="goToRegister">
          {{ $t('lang.login_register') }}
        </q-btn>
        <q-btn class="primary-button yellow-square" @click="goToLogin">
          {{ $t('lang.login') }}
        </q-btn>
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
const captchaRef = ref();

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

const props = defineProps(['isH5Banner']);

const goToRegister = () => {
  router.push("/?page=register");
};

const goToLogin = () => {
  router.push("/?page=login");
};

const onLoginSubmit = () => {
  if (loginWindow.value) {
    router.push("/?page=login");
  } else {
    (async () => {
      loginNameRef.value.validate();
      pwdRef.value.validate();
      captchaRef.value.validate();

      if (loginNameRef.value.hasError || pwdRef.value.hasError || captchaRef.value.hasError) {
        // has error
      } else {
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
      }
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
        loginForm.captchaCode = "";
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
    // width: 700px;
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
  gap: 10px;

  @media (min-width: 1200px) {
    margin-left: 16px;
    margin-top: 0px;
  }

  @media (max-width: 768px) {
    display: none;
  }
}
.account,
.password {
  background: #080a0e;
  display: flex;
  align-items: center;
  border: 1px solid #2d2d2d;
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
  border: 1px solid #2d2d2d;
}

.captcha-img {
  // height: 40px;
  margin: 2px;
}

.account-input,
.password-input,
.captcha-code-input {
  padding: 0px 10px;
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
  width: 124px;
  min-height: 36px;
  background-image: url("../../assets/home/btn-blue.svg");
  background-size: 124px 36px;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    filter: brightness(1.1);
  }
  &:active {
    transform: translateY(2px);
  }
  .register-text {
    font-size: 12px;
    line-height: 1;
    color: #fff;
    @media (min-width: 1200px) {
      font-size: 16px;
    }
  }
}

.actions-topbar {
  display: none;

  @media (max-width: 768px) {
    display: flex;

    .register {
      background-image: url("../../assets/home/btn-blue-square.svg");
      background-size: 100% 100%;
    }

    .login {
      background-image: url("../../assets/home/btn-yellow-square.svg");
      background-size: 100% 100%; 
    }
  }
}
</style>
