<template>
  <div class="main-section">
    <q-form
      class="login-form q-gutter-y-md rounded-borders q-pa-md"
      style="margin: 0px auto"
    >
      <q-input
        class="login-input text-main"
        ref="loginNameRef"
        filled
        v-model="loginForm.loginName"
        :label="$t('lang.input_username')"
        :rules="[
          (val) =>
            (val && val.length > 0) || $t('lang.input_username_cannot_empty'),
        ]"
        color="white"
        autocomplete="username"
        clearable
      >
      </q-input>
      <q-input
        class="login-input text-main"
        ref="passwordRef"
        filled
        v-model="loginForm.password"
        :label="$t('lang.password')"
        :type="isPwd ? 'password' : 'text'"
        :rules="[
          (val) => (val && val.length > 0) || $t('lang.input_password_empty'),
        ]"
        color="white"
        autocomplete="current-password"
        clearable
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>

      <q-input
        ref="verificationRef"
        class="verification-input"
        filled
        type="text"
        v-model="loginForm.captchaCode"
        :label="$t('lang.verification_code')"
        :rules="[
          (val) => (val && val.length > 3) || $t('lang.input_code_empty'),
        ]"
        color="white"
        @keyup.enter="onSubmit"
      >
        <template v-slot:append>
          <img :src="verificationImg" @click="getCode()" />
        </template>
        <template v-slot:prepend>
          <q-icon name="security" />
        </template>
      </q-input>

      <!-- label="Remember password" -->
      <div class="mui-row" :class="isCheckRmb ? 'checked' : ''">
        <q-checkbox
          rounded
          v-model="isCheckRmb"
          :label="$t('lang.remember_me')"
          size="md"
          style="font-size: 14px"
          checked-icon="task_alt"
          unchecked-icon="highlight_off"
          color="amber-9"
        />
      </div>

      <div class="row justify-between items-center">
        <router-link class="forget-pwd-tip" to="/forgot-password">
          {{ $t("lang.forgot_password") }}?
        </router-link>

        <router-link class="forget-pwd-tip" to="/register">
          {{ $t("lang.signup_now") }}
        </router-link>
      </div>
    </q-form>
    <div class="login-btn-list">
      <q-btn
        class="common-large-btn"
        @click.prevent="onSubmit"
        :label="$t('lang.log_in')"
        type="submit"
        color="brand"
        rounded
        size="md"
      />

      <q-btn
        v-if="!isH5()"
        class="common-large-btn line-login-btn"
        @click="loginViaLine"
        type="submit"
        color="brand"
        rounded
        size="md"
      >
        <img src="../assets/images/common/line-official.svg" />
        <span>LINE Login</span>
      </q-btn>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import {
  Loading,
  LocalStorage,
  Platform,
  SessionStorage,
  useQuasar,
} from "quasar";
import { useRoute, useRouter } from "vue-router";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useI18n } from "vue-i18n";
import liff from "@line/liff";
import qs from "qs";
import { isMobile, isH5 } from "boot/utils";
import { uuid } from "vue-uuid";
import axios from "axios";

export default defineComponent({
  name: "LoginPage",
  methods: { isMobile, isH5 },
  setup() {
    const { t } = useI18n();
    const store = userStore();
    onMounted(() => {
      // getCode();
    });
    const verificationImg = ref("");
    const loginForm = reactive({
      loginName: "",
      password: "",
      captchaCode: "",
      codeId: "",
    });
    const $q = useQuasar();
    const loginNameRef = ref();
    const passwordRef = ref();
    const verificationRef = ref();
    const router = useRouter();
    const route = useRoute();

    //LINE.
    const clientId = 2001411735;
    const clientSecret = "4e90ef3551da974394de3486261f0b7f";
    const redirectUrl = encodeURI(`https://jolly88.com/login`);
    // const redirectUrl = encodeURI(`http://192.168.79.63:9090/login`);
    const nonce = `jolly88`;
    const stateId = uuid.v1();
    const checkIp = ref("");

    const getCode = () => {
      api
        .get("/member/verificationCode")
        .then((res) => {
          const response = res.data;
          if (response.code === 0) {
            verificationImg.value =
              "data:image/png;base64," + response.data.img;
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

    const isCheckRmb = ref(false);

    const checkRememberPwd = () => {
      const d = localStorage.getItem("userpass");
      let rememberJson = JSON.parse(d);
      if (rememberJson) {
        isCheckRmb.value = true;
        loginForm.loginName = rememberJson.loginName;
        loginForm.password = rememberJson.password;
      }
    };

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
        // verificationRef.value.validate();
        $q.loading.show({
          message: t("lang.loading"),
        });
        if (loginNameRef.value.hasError || passwordRef.value.hasError) {
          $q.loading.hide();
        } else {
          store
            .memberLogin({
              loginName: loginForm.loginName.trim(),
              password: loginForm.password,
              sid: sidParam,
              captchaCode: loginForm.captchaCode,
              codeId: loginForm.codeId,
            })
            .then(() => {
              $q.loading.hide();

              if (isCheckRmb.value) {
                localStorage.setItem(
                  "userpass",
                  JSON.stringify({
                    loginName: loginForm.loginName.trim(),
                    password: loginForm.password,
                  })
                );
              } else {
                localStorage.removeItem("userpass");
              }

              getCode();
              if (store.hasToken()) {
                const jumpUrl = route.query.redirect
                  ? route.query.redirect
                  : "/";
                router.go(jumpUrl);
                if (Platform.is.capacitor && Platform.is.ios) {
                  location.reload();
                }
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

    const getLineCode = () => {
      const codeId = route.query.code;
      const state = route.query.state;

      const localState = LocalStorage.getItem("STATE_ID");
      // alert(state);
      // alert(localState);

      if (codeId && state && state === localState) {
        axios
          .post(
            "https://api.line.me/oauth2/v2.1/token",
            qs.stringify({
              code: codeId,
              grant_type: "authorization_code",
              client_id: clientId,
              client_secret: clientSecret,
              redirect_uri: redirectUrl,
            })
          )
          .then((res) => {
            // debugger;
            if (res.data && res.data.access_token) {
              const siteId = process.env.SITEID;
              const accessToken = res.data.access_token;
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
                var regDevice = Platform.is.mobile ? "H5" : "WEB";
                if (
                  "standalone" in window.navigator &&
                  window.navigator.standalone
                ) {
                  regDevice = "IOS";
                } else {
                  regDevice = Platform.is.mobile ? "H5" : "WEB";
                  if (Platform.is.capacitor) {
                    if (Platform.is.android) {
                      regDevice = "ANDROID";
                    }
                  }
                }
                const loginInfo = {
                  siteId: siteId,
                  way: regDevice,
                  sid: sidParam,
                  accessToken: accessToken,
                };
                var string = qs.stringify(loginInfo);

                LocalStorage.remove("STATE_ID");

                Loading.show({
                  message: "Logging in",
                });
                api.post("/member/lineLogin", string).then((res) => {
                  // alert(res);
                  if (res.data.code === 0) {
                    sessionStorage.setItem("TOKEN", res.data.data);
                    location.reload();
                  }
                });
              })();
            }
          });
      }
    };

    const loginViaLine = () => {
      const stateUr = stateId;
      // alert(stateUr);
      LocalStorage.set("STATE_ID", stateUr);

      const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&state=${stateUr}&scope=profile%20openid&nonce=${nonce}`;
      window.open(url, "_blank");
    };

    onMounted(() => {
      getCode();
      checkRememberPwd();

      getLineCode();
    });

    return {
      loginNameRef,
      passwordRef,
      verificationRef,
      verificationImg,
      loginForm,
      onSubmit,
      store,
      isPwd: ref(true),
      getCode,
      loginViaLine,
      isCheckRmb,
    };
  },
});
</script>
<style scoped lang="scss">
.login-btn-list {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;

  .line-login-btn {
    background: $line-app;

    img {
      width: 28px;
      margin-right: 8px;
    }
  }
}

.verification {
  display: flex;
  padding: 10px;
}

.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.txt-center {
  text-align: center;
  padding: 0 10px;
}

.forget-pwd-tip {
  color: $info;
}

.login-form {
  width: calc(100% - 12px);
  max-width: 600px;
  margin: 0 auto;
}

.mui-row {
  // text-align: center;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // gap: 10px;
  font-size: 13px;
  color: #aaaaaa;

  &.checked {
    color: #ff8f00;
  }

  &:active {
    filter: brightness(0.8);
  }
}

.q-field--dark:not(.q-field--highlighted) .q-field__label {
  color: #979797;
}
</style>
