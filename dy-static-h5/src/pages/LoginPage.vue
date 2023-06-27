<template>
  <div class="login-container">
    <div class="logo">
      <img src="../assets/images/login/logo.png" />
    </div>
    <q-tabs
      v-model="tab"
      active-color="white"
      indicator-color="bright"
      align="justify"
      class="bg-dyblue"
    >
      <q-tab name="login" label="登录" />
      <q-tab name="register" label="注册" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="login" class="form-container">
        <q-form ref="loginFormRef" @submit="onSubmit">
          <div v-if="!loginType" class="q-gutter-y-md">
            <q-input
              standout
              bg-color="white"
              hide-bottom-space
              ref="loginNameRef"
              v-model="loginForm.loginName"
              label="用户名"
              :rules="[(val) => (val && val.length > 0) || '请输入用户名']"
              label-color=""
              autocomplete="username"
            >
              <template v-slot:prepend>
                <img src="../assets/images/login/login_name.png" width="20" />
              </template>
            </q-input>

            <q-input
              standout
              bg-color="white"
              ref="passwordRef"
              hide-bottom-space
              v-model="loginForm.password"
              label="用户密码"
              :type="isPwd ? 'password' : 'text'"
              :rules="[(val) => (val && val.length > 0) || '情输入用户密码']"
              label-color=""
              autocomplete="current-password"
            >
              <template v-slot:prepend>
                <img src="../assets/images/login/login_key.png" width="20" />
              </template>
              <template v-slot:append>
                <q-icon
                  color="dark"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <q-input
              standout
              bg-color="white"
              ref="verificationRef"
              hide-bottom-space
              type="text"
              v-model="loginForm.captchaCode"
              label="验证码"
              :rules="[(val) => (val && val.length > 3) || '验证码为四个']"
              label-color=""
            >
              <template v-slot:append>
                <img :src="verificationImg" @click="getCode" />
              </template>
              <template v-slot:prepend>
                <!-- <q-icon color="dark" name="security" /> -->
                <img src="../assets/images/login/login_key.png" width="20" />
              </template>
            </q-input>
          </div>

          <div v-if="loginType" class="q-gutter-y-md">
            <q-input
              hide-bottom-space
              ref="telephoneRef"
              v-model="loginForm.telephone"
              label="电话号码"
              :rules="[(val) => (val && val.length > 0) || '请输入电话号码']"
              color="white"
              label-color=""
              autocomplete="username"
            >
              <template v-slot:prepend>
                <q-icon color="dark" name="person_outline" />
              </template>
            </q-input>
            <q-input
              @pressEnter="alert('ah')"
              ref="verificationRef"
              hide-bottom-space
              type="text"
              v-model="loginForm.captchaCode"
              label="验证码"
              :rules="[(val) => (val && val.length > 3) || '请输入验证码']"
              color="white"
              label-color="brand"
            >
              <template v-slot:append>
                <img :src="verificationImg" />
              </template>
              <template v-slot:prepend>
                <q-icon color="bright" name="security" />
              </template>
            </q-input>
          </div>

          <div class="forgetpass-div">
            <div class="mui-row">
              <q-checkbox
                v-model="isCheckRmb"
                label="记住密码"
                checked-icon="task_alt"
                unchecked-icon="task_alt"
                size="lg"
                color="light-blue-9"
              />
            </div>
            <div class="mui-row">
<<<<<<< HEAD
              <router-link to="/forget-account">忘记账号？</router-link>
=======
              <router-link to="/forgot-account"> 忘记账号？</router-link>
>>>>>>> b4dd809ce5b5726cec5acf1a8be6ccfbc30bbd24
            </div>
          </div>

          <q-btn
            @click.prevent="onSubmit"
            type="submit"
            class="q-mt-md"
            label="登录"
            width="100%"
            color="dyblue"
            style="width: 100%"
            rounded
          />
        </q-form>

        <div class="q-pa-md text-center">
          <router-link class="txt-tip" to="/">先去逛逛</router-link>
        </div>
      </q-tab-panel>

      <q-tab-panel name="register" class="form-container">
        <RegisterPage @changeTab="changeLoginTab" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { useQuasar, Platform } from "quasar";
import { useRoute, useRouter } from "vue-router";
import RegisterPage from "../pages/RegisterPage.vue";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default defineComponent({
  name: "LoginPage",
  components: {
    RegisterPage
  },
  setup() {
    const tab = ref("login");
    const loginType = ref(false);
    const store = userStore();
    const verificationImg = ref("");
    const loginForm = reactive({
      loginName: "",
      password: "",
      captchaCode: "",
      codeId: ""
    });
    const $q = useQuasar();
    const loginFormRef = ref();
    const loginNameRef = ref();
    const passwordRef = ref();
    const verificationRef = ref();
    const router = useRouter();
    const route = useRoute();
    const getCode = () => {
      api
        .get("/member/verificationCode")
        .then((response) => {
          if (response.code === 0) {
            verificationImg.value =
              "data:image/png;base64," + response.data.img;
            loginForm.codeId = response.data.id;
          }
        })
        .catch((e) => {
          $q.notify({
            color: "negative",
            position: "top",
            message: e.message,
            icon: "report_problem"
          });
        });
    };

    const isCheckRmb = ref(false);

    const onSubmit = () => {
      const fpPromise = FingerprintJS.load();
      (async () => {
        const fp = await fpPromise;
        const result = await fp.get();
        const excludes = { value: ["timezone", "timeZoneOffset"] };
        const allComponents = { ...result.components };
        excludes.value.forEach((element) => {
          delete allComponents[element];
        });
        const sidParam = FingerprintJS.hashComponents(allComponents);
        loginNameRef.value.validate();
        passwordRef.value.validate();
        verificationRef.value.validate();
        $q.loading.show({
          message: "登录中"
        });
        if (
          loginNameRef.value.hasError ||
          passwordRef.value.hasError ||
          verificationRef.value.hasError
        ) {
          $q.loading.hide();
        } else {
          store
            .memberLogin({
              loginName: loginForm.loginName,
              password: loginForm.password,
              sid: sidParam,
              captchaCode: loginForm.captchaCode,
              codeId: loginForm.codeId
            })
            .then(() => {
              $q.loading.hide();
              sessionStorage.removeItem("REFERRAL_CODE");

              loginFormRef.value.reset();

              if (store.hasToken()) {
                const jumpUrl = route.query.redirect
                  ? route.query.redirect
                  : "/";
                router.go(jumpUrl);
                if (Platform.is.capacitor && Platform.is.ios) {
                  location.reload();
                }
              } else {
                getCode();
              }
            })
            .catch((error) => {
              loginForm.captchaCode = "";
              getCode();
              $q.loading.hide();
            });
        }
      })();
    };

    const changeLoginTab = () => {
      tab.value = "login";
    };

    onMounted(() => {
      getCode();
    });
    return {
      header: "Login",
      loginNameRef,
      passwordRef,
      verificationRef,
      verificationImg,
      loginForm,
      loginFormRef,
      onSubmit,
      store,
      isPwd: ref(true),
      tab,
      loginType,
      getCode,
      isCheckRmb,
      changeLoginTab
    };
  }
});
</script>
<style lang="scss">
.login-container {
  background: url(../assets/images/login/bg.jpg) no-repeat center center;
  background-size: cover;
  height: 100vh;

  .logo {
    margin: 0 auto;
    display: block;
    padding: 20% 0 10%;
    width: 40%;

    img {
      width: 100%;
    }
  }

  .q-field__native.q-placeholder {
    color: #000000;
  }

  .q-tabs {
    background: rgba(113, 125, 146, 0.2);
    border-radius: 30px;
    width: 80%;
    margin: 0 auto;
    box-shadow: 5px 5px 5px 0 rgba(66, 91, 186, 0.2);
  }

  .q-tab {
    min-height: 40px;
    background: white;
    color: #666;
  }

  .q-tab__content {
    width: 100%;
  }

  .q-tab--active .q-tab__indicator {
    height: 100%;
    background: #5b80e8;
    border-radius: 30px;
  }

  .q-tab__label {
    z-index: 1;
  }

  .q-tab-panels {
    background: none;
    padding: 10px;
  }

  .align-right {
    text-align: right;
    // color: #acacac;
    color: #333;
    margin-top: 20px;
  }

  .txt-tip {
    color: #007aff;
    text-decoration: none;
  }

  .form-container {
    width: 85%;
    margin: auto;
  }

  .forgetpass-div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 4px);
    margin: 14px auto 0px;
    gap:20px;

    .mui-row {
      height: 48px;
      width: calc(100% - 40px);
      max-width: 180px;
      border-radius: 20px;
      border: 3px solid #5b80e7;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 600;
      color: #5b80e7;

      &:active {
        filter: brightness(0.8);
      }
    }

    a,
    a:visited,
    a:active,
    a:hover {
      text-decoration: none;
      color: #5b80e7;
    }
  }
}
</style>
