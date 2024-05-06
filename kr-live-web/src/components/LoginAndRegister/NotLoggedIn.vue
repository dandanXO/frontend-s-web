<template>
  <div class="not-loggedin-container">
    <form action="" style="display: flex;" @keypress.enter="onLoginSubmit">
      <div class="left-container">
        <div class="account">
          <input type="text" class="account-input" placeholder="계정" v-model="loginForm.loginName" />
        </div>
        <div class="password">
          <input type="password" class="password-input" placeholder="암호" v-model="loginForm.password" />
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

const store = userStore();
const router = useRouter();
const verificationImg = ref("");

const loginForm = reactive({
  loginName: "",
  password: "",
  captchaCode: "",
  codeId: ""
});

const enter = () => {
  console.log("123456");
};

const goToRegister = () => {
  router.push("/?page=register");
};

const toGetCode = () => {
  getCode();
};

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
        getCode();
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

.left-container {
  display: none;
  justify-content: space-between;
  @media (min-width: 1200px) {
    display: flex;
  }
}

.right-container {
  display: flex;
  justify-content: space-between;
  margin-left: 0px;
  @media (min-width: 1200px) {
    margin-left: 16px;
    margin-top: 0px;
  }
}
.account,
.password {
  width: 140px;
  height: 40px;
  background: #080a0e;
  display: flex;
  align-items: center;
}

.password {
  margin-left: 8px;
  margin-right: 8px;
}
.captcha-code {
  height: 40px;
  background: #080a0e;
  display: flex;
  margin-right: 4px;
}

.captcha-img {
  height: 40px;
}

.account-input,
.password-input,
.captcha-code-input {
  width: 100px;
  border: none;
  padding-left: 12px;
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
  width: 80px;
  height: 28px;
  background-image: url("../../assets/images/login/register-btn.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  @media (min-width: 1200px) {
    width: 100px;
    height: 36px;
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
  height: 28px;
  background-image: url("../../assets/images/login/login-btn.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 16px;
  @media (min-width: 1200px) {
    width: 100px;
    height: 36px;
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
