<template>
  <div class="main-section">
    <q-form class=" login-form q-gutter-y-md rounded-borders q-pa-md " style="margin: 0px auto;"
    >
      <q-input
          class="login-input text-main"
          ref="loginNameRef"
          filled
          v-model="loginForm.loginName"
          :label="$t('lang.input_username')"
          :rules="[(val) => (val && val.length > 0) || $t('lang.input_username_cannot_empty')]"
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
          :rules="[(val) => (val && val.length > 0) || $t('lang.input_password_empty')]"
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
        </template
        >
      </q-input>

      <q-input
          ref="verificationRef"
          class="verification-input"
          filled
          type="text"
          v-model="loginForm.captchaCode"
          :label="$t('lang.verification_code')"
          :rules="[
          (val) => (val && val.length > 3) || $t('lang.input_code_empty')
        ]"
          color="white"
          @keyup.enter="onSubmit"
      >
        <template v-slot:append>
          <img :src="verificationImg" @click="getCode()"/>
        </template>
        <template v-slot:prepend>
          <q-icon name="security"/>
        </template>
      </q-input>

      <!-- label="Remember password" -->
      <div class="mui-row" :class="isCheckRmb ? 'checked' : ''">
        <q-checkbox
            rounded
            v-model="isCheckRmb"
            :label="$t('lang.remember_me')"
            size="md"
            style="font-size: 14px;"
            checked-icon="task_alt"
            unchecked-icon="highlight_off"
            color="amber-9"
        />
      </div>

      <div class="row justify-between items-center">
        <router-link class="forget-pwd-tip" to="/forgot-password">
          {{ $t('lang.forgot_password') }}?
        </router-link>

        <router-link class="forget-pwd-tip" to="/register">
          {{ $t('lang.signup_now') }}
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

<!--      <q-btn-->
<!--        v-if="isMobile()"-->
<!--        class="common-large-btn line-login-btn"-->
<!--        @click="loginViaLine"-->
<!--        type="submit"-->
<!--        color="brand"-->
<!--        rounded-->
<!--        size="md"-->
<!--      >-->
<!--        <img src="../assets/images/common/line-official.svg" />-->
<!--        <span>LINE Login</span>-->
<!--      </q-btn>-->
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, reactive, onMounted} from "vue";
import {userStore} from "stores/index";
import {api} from "boot/axios";
import {Loading, Platform, useQuasar} from "quasar";
import {useRoute, useRouter} from "vue-router";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {useI18n} from "vue-i18n";
import liff from "@line/liff";
import qs from "qs";
import { isMobile} from "boot/utils";

export default defineComponent({
  name: "LoginPage",
  methods: {isMobile},
  setup() {
    const {t} = useI18n();
    const store = userStore();
    onMounted(() => {
      // getCode();
    });
    const verificationImg = ref("");
    const loginForm = reactive({
      loginName: "",
      password: "",
      captchaCode: "",
      codeId: ""
    });
    const $q = useQuasar();
    const loginNameRef = ref();
    const passwordRef = ref();
    const verificationRef = ref();
    const router = useRouter();
    const route = useRoute();
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
        const excludes = {value: ["timezone", "timeZoneOffset"]};
        const allComponents = {...result.components};
        excludes.value.forEach((element) => {
          delete allComponents[element];
        });
        const sidParam = FingerprintJS.hashComponents(allComponents);
        loginNameRef.value.validate();
        passwordRef.value.validate();
        // verificationRef.value.validate();
        $q.loading.show({
          message: t('lang.loading')
        });
        if (
            loginNameRef.value.hasError ||
            passwordRef.value.hasError
        ) {
          $q.loading.hide();
        } else {
          store
              .memberLogin({
                loginName: loginForm.loginName.trim(),
                password: loginForm.password,
                sid: sidParam,
                captchaCode: loginForm.captchaCode,
                codeId: loginForm.codeId
              })
              .then(() => {
                $q.loading.hide();

                if (isCheckRmb.value) {
                  localStorage.setItem(
                      "userpass",
                      JSON.stringify({
                        loginName: loginForm.loginName.trim(),
                        password: loginForm.password
                      })
                  );
                } else {
                  localStorage.removeItem("userpass");
                }

                getCode();
                if (store.hasToken()) {
                  const jumpUrl = route.query.redirect ? route.query.redirect : "/";
                  router.go(jumpUrl);
                  if (Platform.is.capacitor && Platform.is.ios) {
                    location.reload()
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

    const loginViaLine = () => {
      const siteId= process.env.SITEID;

      const url =`https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=2001411735&redirect_uri=https://jolly88.com/login&state=12345abcde&scope=profile%20openid&nonce=09876xyz`
      window.open(url, "_blank");

      // liff.init({
      //   liffId: '2001411735-Ow892Zrl', // Use own liffId
      // }).then(() => {
      //   // alert("HERE");
      //   // if (liff.isInClient()) {
      //     // alert("Line" + liff.getLineVersion())
      //     // if (liff.isLoggedIn()) {
      //       // alert("Line Logged In.")
      //       const fpPromise = FingerprintJS.load();
      //       (async () => {
      //         const fp = await fpPromise;
      //         const result = await fp.get();
      //         const excludes = { value: ["timezone", "timeZoneOffset"] };
      //         const allComponents = { ...result.components };
      //         excludes.value.forEach((element) => {
      //           delete allComponents[element];
      //         });
      //         const sidParam = FingerprintJS.hashComponents(allComponents);
      //         const accessToken = liff.getAccessToken();
      //         var regDevice = Platform.is.mobile ? "H5" : "WEB";
      //         if (("standalone" in window.navigator) && window.navigator.standalone) {
      //           regDevice = "IOS"
      //         } else {
      //           regDevice = Platform.is.mobile ? "H5" : "WEB";
      //           if (Platform.is.capacitor) {
      //             if (Platform.is.android) {
      //               regDevice = "ANDROID"
      //             }
      //           }
      //         }
      //         const loginInfo = {
      //           siteId: siteId,
      //           way: regDevice,
      //           sid: sidParam,
      //           accessToken: accessToken
      //         }
      //         var string = qs.stringify(loginInfo);
      //         Loading.show({
      //           message: 'Logging in'
      //         })
      //         api.post('/member/lineLogin', string).then((res) => {
      //           // alert(res);
      //           if (res.data.code === 0) {
      //             sessionStorage.setItem("TOKEN", res.data.data);
      //             location.reload();
      //           }
      //         })
      //       })();
      //     // }
      //   // }
      // })
    }

    onMounted(() => {
      getCode();
      checkRememberPwd();
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
  }
});
</script>
<style scoped lang="scss">
.login-btn-list{
  display:flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;

  .line-login-btn{
    background: #00b900;

    img{
      width: 28px;
      margin-right:8px;
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
