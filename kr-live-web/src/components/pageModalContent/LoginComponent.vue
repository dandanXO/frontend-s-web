<template>
  <div class="page-container">
    <div class="form-wrapper page-content">
      <q-form class="login-form form-template" @keypress.enter="onSubmit">
        <div class="form-item">
          <label>{{ $t('lang.login_account') }}</label>
          <q-input :disable="isLoading" :loading="isLoading" dense ref="loginNameRef" outlined clearable
            v-model="loginForm.loginName" lazy-rules :rules="[
              (val) => (val && val.length > 0) || $t('lang.input_username_cannot_empty'),
              (val) => (val.length > 5 && val.length <= 12) || $t('lang.username_between_6_12'),
              (val) => val.match(/^[A-Za-z0-9]+$/) || $t('lang.only_letter_number_allowed')
            ]" />
        </div>

        <div class="form-item">
          <label>{{ $t('lang.login_password') }}</label>
          <q-input :disable="isLoading" :loading="isLoading" dense ref="pwdRef" outlined clearable
            v-model="loginForm.password" :type="isPwd ? 'password' : 'text'" lazy-rules :rules="[
              (val) => (val && val.length > 0) || $t('lang.input_password_empty'),
              (val) => (val.length > 5 && val.length <= 12) || $t('lang.password_between_6_12')
            ]">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </div>

        <div class="form-item">
          <label>{{ $t('lang.login_captcha') }}</label>
          <div class="captcha-code">
            <q-input :disable="isLoading" :loading="isLoading" dense ref="captchaRef" outlined clearable
              class="captcha-code-input" v-model="loginForm.captchaCode" lazy-rules
              :rules="[(val) => (val && val.length > 0) || $t('lang.enter_captcha_code')]" />
            <div class="captcha-img-wrapper">
              <q-spinner-orbit size="30px" v-if="captchaLoading" />
              <img v-else class="captcha-img" height="56px" :src="verificationImg" @click.prevent="getCode" />
            </div>
          </div>
        </div>
      </q-form>

      <q-inner-loading :showing="isLoading" style="background:#1414144d;">
        <q-spinner-orbit style="width:50px;height:50px;" />
      </q-inner-loading>
    </div>

    <div class="action-buttons vertical">
      <q-btn :disable="isLoading" @click="onSubmit" class="primary-button yellow login-submit-btn">
        {{ $t('lang.login_submit') }}
      </q-btn>
      <q-btn :disable="isLoading" class="primary-button blue login-register-btn" to="/?page=register">
        {{ $t('lang.login_register') }}
      </q-btn>
    </div>
  </div>
</template>

<script setup id="LoginPage">
import { ref, reactive, onMounted } from "vue";
import { api } from "boot/axios";
import { userStore } from "stores/index";
import { errorNotify, successNotify } from "src/boot/utils";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const store = userStore();
const router = useRouter();
const { t: $t } = useI18n();

const loginNameRef = ref();
const pwdRef = ref();
const captchaRef = ref();
const isLoading = ref(false);
const captchaLoading = ref(false);

const loginForm = reactive({
  loginName: "",
  password: "",
  captchaCode: "",
  codeId: ""
});
const verificationImg = ref("");
const isPwd = ref(true);

onMounted(() => {
  // prevent visiting Login form when logged in
  if (store.hasToken()) {
    router.push("/");
  } else {
    getCode();
  }
});

const getCode = () => {
  captchaLoading.value = true;

  api
    .get("/member/verificationEasyCode")
    .then((res) => {
      const response = res.data;
      if (response.code === 0) {
        verificationImg.value = `data:image/png;base64,${response.data.img}`;
        loginForm.codeId = response.data.id;
        loginForm.captchaCode = '';
      }

      captchaLoading.value = false;
    })
    .catch((e) => {
      captchaLoading.value = false;
      errorNotify(res.data.message);
    }).finally(() => {
      captchaLoading.value = false;
    });
};



const onSubmit = () => {
  (async () => {
    loginNameRef.value.validate();
    pwdRef.value.validate();
    captchaRef.value.validate();

    if (loginNameRef.value.hasError || pwdRef.value.hasError || captchaRef.value.hasError) {
    } else {
      isLoading.value = true;

      store
        .memberLogin({
          loginName: loginForm.loginName.trim(),
          password: loginForm.password,
          sid: store.visitorId,
          captchaCode: loginForm.captchaCode,
          codeId: loginForm.codeId
        })
        .then(() => {
          successNotify($t('lang.login_success_msg'));
          router.push("/");
        })
        .catch((error) => {
          console.log(error);
          getCode();
          isLoading.value = false;
        }).finally(() => {
          isLoading.value = false;
        });
    }
  })();
};

</script>

<style lang="scss" scoped>
.form-wrapper {
  min-height: 260px;
}

.login-form {
  display: flex;
  flex-direction: column;

  .captcha-code {
    width: 100%;
    display: flex;
  }

  .captcha-code-input {
    margin-right: 16px;
    width: 100%;
  }

  .captcha-img-wrapper {
    min-width: 120px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    .captcha-img {
      border-radius: 8px;
      width: 100%;
      height: 100%;
    }
  }

  @media (max-width: 600px) {
    label {
      font-size: small;
    }
  }

  @media (max-width: 400px) {
    label {
      font-size: x-small;
    }
  }
}

.action-buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 10px auto 20px;
}
</style>
