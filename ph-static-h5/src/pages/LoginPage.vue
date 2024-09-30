<template>
  <div class="page-header">
    <img class="logo" src="../assets/logo.png" />
  </div>

  <!-- <h4>Login</h4> -->
  <q-form
    ref="loginFormRef"
    @submit="onSubmit"
    class="rounded-borders q-mx-md flex column q-gutter-y-sm login-page-form"
  >
    <label class="field-label">Login name</label>
    <q-input
      ref="loginNameRef"
      rounded
      outlined
      v-model="loginForm.loginName"
      label="Login name"
      :rules="[(val) => (val && val.length > 0) || 'Please fill in login name']"
      color="white"
      autocomplete="username"
      clearable
    >
      <template v-slot:prepend>
        <q-icon name="person_outline" />
      </template>
    </q-input>

    <label class="field-label">Password</label>
    <q-input
      ref="passwordRef"
      rounded
      outlined
      v-model="loginForm.password"
      label="Password"
      :type="isPwd ? 'password' : 'text'"
      :rules="[(val) => (val && val.length > 0) || 'Please fill in password']"
      color="white"
      autocomplete="current-password"
      clearable
    >
      <template v-slot:prepend>
        <q-icon name="lock_open" />
      </template>
      <template v-slot:append>
        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
      </template>
    </q-input>

    <!--    <label class="field-label">Verification Code</label>-->
    <!--
    <q-input
      ref="verificationRef"
      rounded
      outlined
      type="text"
      v-model="loginForm.captchaCode"
      label="Verification Code"
      :rules="[(val) => (val && val.length > 3) || 'Please fill in verification number']"
      color="white"
    >
      <template v-slot:append>
        <img :src="verificationImg" @click="getCode" class="cursor-pointer" />
      </template>
      <template v-slot:prepend>
        <q-icon name="security" />
      </template>
    </q-input>
    -->

    <div class="row justify-end">
      <q-checkbox
        rounded
        v-model="isCheckRmb"
        label="Remember Me"
        size="md"
        checked-icon="task_alt"
        unchecked-icon="highlight_off"
        color="light-blue-4"
        :dense="true"
      />
    </div>

    <!-- <hr class="q-my-lg hr-white-lightest" /> -->

    <q-btn class="submit-btn" @click.prevent="onSubmit" label="Login Now" type="submit" />

    <div class="row justify-center items-center">
      <router-link class="forget-pwd" to="/forgot-password">Forgot password ?</router-link>
    </div>

    <div class="txt-center">
      <router-link to="/register">
        <span class="info-text">Not on Play4Win yet?</span>
        &nbsp;
        <span class="highlighted-text">Register Now</span>
      </router-link>
    </div>
  </q-form>

  <FooterArea />
</template>

<script setup>
import { ref, reactive, onMounted, onActivated } from "vue";
import { userStore } from "stores/index";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import FooterArea from "components/FooterArea.vue";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

import { getCodeDetail } from "src/utils/helper";

const store = userStore();

const verificationImg = ref("");
const loginFormRef = ref();
const loginForm = reactive({
  loginName: "",
  password: ""
  // captchaCode: "",
  // codeId: ""
});
const $q = useQuasar();
const loginNameRef = ref();
const passwordRef = ref();
const verificationRef = ref();
const router = useRouter();
const route = useRoute();

const isPwd = ref(true);
const isCheckRmb = ref(false);

const onSubmit = async () => {
  const fpPromise = FingerprintJS.load();

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

  const errorFree = !loginNameRef.value.hasError && !passwordRef.value.hasError;

  errorFree && $q.loading.show({ message: "Logging in" });
  !errorFree && $q.loading.hide();

  if (errorFree) {
    // Sign in user
    try {
      await store.memberLogin({ ...loginForm, sid: sidParam });
    } catch (e) {
      // getCode();
    } finally {
      // getCode();
    }

    // Remove Loggin in snackbar
    $q.loading.hide();

    // Handle Keep Login Credentials
    if (isCheckRmb.value) {
      localStorage.setItem(
        "userpass",
        JSON.stringify({
          loginName: loginForm.loginName,
          password: loginForm.password
        })
      );
    } else localStorage.removeItem("userpass");

    // Reset Form
    loginFormRef.value.reset();

    // Handle post-submit
    store.hasToken() && router.push(route.query.redirect ?? "/");

    // show spin wheel upon login
    sessionStorage.setItem("showSpinWheel", "true");

    // show ads popup list
    sessionStorage.setItem("showAdsPopupList", "true");
  }
};

const getCode = async () => {
  const json = await getCodeDetail();

  if (json.isOk) {
    verificationImg.value = json.verificationImg;
    loginForm.codeId = json.codeId;
    loginForm.captchaCode = "";
  } else {
    $q.notify({
      color: "negative",
      position: "top",
      message: json.message,
      icon: "report_problem"
    });
  }
};

onMounted(() => {
  const d = localStorage.getItem("userpass");

  try {
    const rememberJson = JSON.parse(d);

    if (rememberJson) {
      isCheckRmb.value = true;
      loginForm.loginName = rememberJson.loginName;
      loginForm.password = rememberJson.password;
    }
  } catch (_) {
    // Silent Death
  }
});

onActivated(() => {
  // getCode();
  // verificationRef.value.resetValidation();
});
</script>

<style lang="scss">
input:-webkit-autofill,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px #fff inset !important;
  border-bottom: 1px solid #fff;
  transition: all 0.45s;
  color: #000;
}

input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 30px #fff inset !important;
  border-bottom: 1px solid #fff;
  color: #000;
}

input:-webkit-autofill {
  -webkit-text-fill-color: #000 !important;
}

.page-header {
  background-image: $primary-linear;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 28px;
  text-align: center;
  font-family: Wave;
  display: flex;
  gap: 20px;
  align-content: center;
  justify-content: center;
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

h4 {
  margin-bottom: 0px;
  margin-top: 6px;
  margin-left: 26px;
  margin-right: 26px;
  font-size: 24px;
}

.q-field--filled .q-field__control:before {
  background: none;
}
</style>
<style scoped lang="scss">
.logo {
  width: 120px;
}

.verification {
  display: flex;
  padding: 10px;
}

.forget-pwd {
  font-size: 18px;
  color: #ff8d4e;
}
</style>
