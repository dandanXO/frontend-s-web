<template>
  <div class="login-container">
    <div class="top-image-div">
      <img src="../assets/login/login-top.png"/>
    </div>

    <div class="login-tab-div">
      <q-tabs
          v-model="tab"
          active-color="white"
          indicator-color="dark"
          align="justify"
          class="bg-dyblue"
      >
        <q-tab name="login" label="登录"/>
        <q-tab name="register" label="注册"/>
      </q-tabs>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login" class="form-container">
          <q-form ref="loginFormRef" @submit="onSubmit">
            <div v-if="!loginType" class="q-gutter-y-md">
              <q-input
                  height="32px"
                  rounded
                  standout
                  bg-color="grey-2"
                  hide-bottom-space
                  ref="loginNameRef"
                  v-model="loginForm.loginName"
                  placeholder="用户名"
                  :rules="[(val) => (val && val.length > 0) || '请输入用户名']"
                  label-color=""
                  clearable
                  autocomplete="username"
              >
                <template v-slot:prepend>
                  <img src="../assets/login/user-icon.png" width="16"/>
                </template>
              </q-input>

              <q-input
                  height="32px"
                  rounded
                  standout
                  bg-color="grey-2"
                  ref="passwordRef"
                  hide-bottom-space
                  v-model="loginForm.password"
                  placeholder="用户密码"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[(val) => (val && val.length > 0) || '情输入用户密码']"
                  label-color=""
                  clearable
                  autocomplete="current-password"
              >
                <template v-slot:prepend>
                  <img src="../assets/login/pass-icon.png" width="16"/>
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
                  height="32px"
                  rounded
                  standout
                  bg-color="grey-2"
                  ref="verificationRef"
                  hide-bottom-space
                  type="text"
                  v-model="loginForm.captchaCode"
                  placeholder="请输入验证码"
                  :rules="[(val) => (val && val.length > 3) || '验证码为四个']"
                  label-color=""
              >
                <template v-slot:append>
                  <img :src="verificationImg" @click="getCode"/>
                </template>
                <template v-slot:prepend>
                  <img src="../assets/login/veri-icon.png" width="16"/>
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
                  <q-icon color="dark" name="person_outline"/>
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
                  <img :src="verificationImg"/>
                </template>
                <template v-slot:prepend>
                  <q-icon color="bright" name="security"/>
                </template>
              </q-input>
            </div>

            <div class="forgetpass-div">
              <div class="mui-row" :class="isCheckRmb ? 'checked' : ''">
                <q-checkbox
                    rounded
                    v-model="isCheckRmb"
                    label="记住密码"
                    size="sm"
                    checked-icon="task_alt"
                    unchecked-icon="highlight_off"
                    color="light-blue-9"
                />
              </div>
            </div>

            <q-btn
                @click.prevent="onSubmit"
                type="submit"
                class="q-mt-lg"
                label="登录"
                width="100%"
                color="dyblue"
                style="width: 100%"
                size="16px"
                rounded
            />
          </q-form>

        </q-tab-panel>

        <q-tab-panel name="register" class="form-container">
          <RegisterPage @changeTab="changeLoginTab"/>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <div class="login-bottom-section">
      <div class="row justify-center items-center full-width q-mb-lg">
        <router-link class="txt-tip" to="/">
          <div class="row items-center gap-8">
            <img src="../assets/login/home-icon.png"/>
            <span>先去逛逛</span>
          </div>
        </router-link>

        <div class="mid-gap">&nbsp;</div>

        <router-link class="txt-tip" to="/forgot-account">
          <div class="row items-center gap-8">
            <img src="../assets/login/lock-icon.png"/>
            <span>忘记密码</span>
          </div>
        </router-link>
      </div>

      <div class="text-center">
        如需帮助，请
        <router-link class="txt-link q-ml-xs" to="/liveChat">联系客服</router-link>
      </div>


    </div>


  </div>
</template>

<script>
import {defineComponent, ref, reactive, onMounted} from "vue";
import {userStore} from "stores/index";
import {api} from "boot/axios";
import {useQuasar, Platform} from "quasar";
import {useRoute, useRouter} from "vue-router";
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
        const excludes = {value: ["timezone", "timeZoneOffset"]};
        const allComponents = {...result.components};
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

                if (isCheckRmb.value) {
                  localStorage.setItem(
                      "userpass",
                      JSON.stringify({
                        loginName: loginForm.loginName,
                        password: loginForm.password
                      })
                  );
                } else {
                  localStorage.removeItem("userpass");
                }

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

    const checkRememberPwd = () => {
      const d = localStorage.getItem("userpass");
      let rememberJson = JSON.parse(d);
      if (rememberJson) {
        isCheckRmb.value = true;
        loginForm.loginName = rememberJson.loginName;
        loginForm.password = rememberJson.password;
      }
    };

    onMounted(() => {
      getCode();
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("register")) {
        tab.value = "register";
      }
      checkRememberPwd();
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
  height: 100vh;

  .top-image-div {
    width: 100%;

    img {
      width: 100%;
    }
  }

  .login-tab-div {
    background: #fff;
    padding: 30px 12px 40px;
    border-radius: 20px;
    position: relative;
    top: -35px;
    box-shadow: 0px 4px 32px 0px rgba(0, 0, 0, 0.5);
  }

  .q-tab {
    min-height: 46px;
    background: #EEE;
    color: #333;
  }

  .q-field__native.q-placeholder {
    color: #000000;
  }

  .q-tabs {
    background: rgba(113, 125, 146, 0.2);
    border-radius: 30px;
    width: 90%;
    margin: 0 auto;
    box-shadow: 5px 5px 5px 0 rgba(66, 91, 186, 0.2);
  }

  .form-container {
    width: 100%;
    margin: auto;
    padding: 16px 8px;

    > .q-tab-panel {

    }

    .q-field__control {
      height: 45px;

      .q-field__marginal {
        height: 45px;
      }
    }
  }

  .login-bottom-section {
    padding-bottom: 60px;

    > div {
      gap: 40px;
    }

    .mid-gap {
      width: 2px;
      background: rgba(0, 0, 0, 0.5);
      filter: brightness(0.7);
      height: 16px;
    }

    span {
      color: #434343;
    }
  }

  .q-tab__content {
    width: 100%;
  }

  .q-tab--active .q-tab__indicator {
    height: 100%;
    background: #0089ED;
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
    color: #434343;
    text-decoration: none;
  }


  .forgetpass-div {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: calc(100% - 4px);
    margin: 14px auto 0px;
    gap: 10px;

    .mui-row {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 13px;
      color: #666;

      &.checked{
        color: #0089ED;
      }

      &:active {
        filter: brightness(0.8);
      }
    }

    a,
    a:visited,
    a:active,
    a:hover {
      text-decoration: none;
      color: #0089ED;
    }
  }
}
</style>
