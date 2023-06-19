<template>
  <div class="page-header q-mb-md">
    <div class="page">{{ header }}</div>
  </div>
  <q-form class="q-gutter-y-md rounded-borders q-pa-md bg-primary q-ma-md">
    <q-input
      ref="loginNameRef"
      filled
      v-model="loginForm.loginName"
      label="Login name"
      :rules="[(val) => (val && val.length > 0) || '请输入用户名']"
      color="white"
      autocomplete="username"
      ><template v-slot:prepend>
        <q-icon name="person_outline" />
      </template>
    </q-input>

    <q-input
      ref="passwordRef"
      filled
      v-model="loginForm.password"
      label="Password"
      :type="isPwd ? 'password' : 'text'"
      :rules="[(val) => (val && val.length > 0) || '请输入密码']"
      color="white"
      autocomplete="current-password"
    >
      <template v-slot:prepend>
        <q-icon name="lock_open" />
      </template>
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        /> </template
    ></q-input>
    <q-input
      ref="verificationRef"
      filled
      type="text"
      v-model="loginForm.captchaCode"
      label="Verification Code"
      :rules="[
        (val) => (val && val.length > 3) || '请输入验证码'
      ]"
      color="white"
    >
      <template v-slot:append>
        <img :src="verificationImg" />
      </template>
      <template v-slot:prepend>
        <q-icon name="security" />
      </template>
    </q-input>

    <div class="row justify-between items-center">
      <router-link class="forget-pwd-tip" to="/forgot-password">
        Forgot password ?
      </router-link>

      <q-btn
        @click.prevent="onSubmit"
        label="Login Now"
        type="submit"
        color="brand"
      />
    </div>
  </q-form>
  <div class="txt-center">
    <router-link class="forget-pwd-tip" to="/register">
      Not on Jolly88 yet? Register Now
    </router-link>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import { userStore } from "stores/index";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default defineComponent({
  name: "LoginPage",
  setup() {
    const store = userStore();
    onMounted(() => {
      getCode();
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
          $q.notify({
            color: "negative",
            position: "top",
            message: res.data.message,
            icon: "report_problem"
          });
        });
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
      verificationRef.value.validate();
      $q.loading.show({
        message: "Validating Login"
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
            loginForm.captchaCode ="";
            getCode();
            $q.loading.hide();
          });
      }
      })();
    };
    return {
      header: "Login",
      loginNameRef,
      passwordRef,
      verificationRef,
      verificationImg,
      loginForm,
      onSubmit,
      store,
      isPwd: ref(true)
    };
  }
});
</script>
<style lang="scss">
.page-header {
  background-image: linear-gradient(to right, #de4545, #db7e42);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 28px;
  text-align: center;
  font-family: Wave;
  padding: 10px;
  display: flex;
  gap: 20px;
  align-content: center;
  justify-content: center;
}
// .q-form {
//   margin: 20px;
//   background: #2b2b4b;
//   padding: 20px;
//   border-radius: 20px;

//   .q-field {
//     margin-left: 0;
//     border-radius: 20px;
//     margin-bottom: 15px;
//   }
// }
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
</style>
