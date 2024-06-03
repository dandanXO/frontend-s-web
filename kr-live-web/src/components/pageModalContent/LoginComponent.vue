<template>
  <div class="">
    <q-form class="login-form" @keypress.enter="onSubmit">
      <div class="form-item">
        <label>{{ $t('lang.login_account') }}</label>
        <q-input dense ref="loginNameRef" outlined clearable v-model="loginForm.loginName"
          lazy-rules :rules="[
            (val) => (val && val.length > 0) || $t('lang.input_username_cannot_empty'),
            (val) => (val.length > 5 && val.length <= 12) || $t('lang.username_between_6_12'),
            (val) => val.match(/^[A-Za-z0-9]+$/) || $t('lang.only_letter_number_allowed')
          ]" />
      </div>

      <div class="form-item">
        <label>{{ $t('lang.login_password') }}</label>
        <q-input dense ref="pwdRef" outlined clearable v-model="loginForm.password"
          :type="isPwd ? 'password' : 'text'" lazy-rules :rules="[
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
          <q-input dense ref="captchaRef" outlined clearable class="captcha-code-input"
            v-model="loginForm.captchaCode" lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('lang.enter_captcha_code')]" />
          <div class="captcha-img-wrapper">
            <q-spinner-hourglass :color="'blue'" size="30px" v-if="captchaLoading" />
            <img v-else class="captcha-img" height="56px" :src="verificationImg" @click.prevent="getCode" />
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <div @click="onSubmit" class="primary-button yellow login-submit-btn">
          {{ isLoading ? $t('lang.loading') : $t('lang.login_submit') }}
        </div>
        <router-link to="/?page=register">
          <div class="primary-button blue login-register-btn">
            {{ isLoading ? $t('lang.loading') : $t('lang.login_register') }}
          </div>
        </router-link>
      </div>
    </q-form>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { userStore } from "stores/index";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "LoginPage",
  emits: ["closeModal"],
  setup(_props) {
    const store = userStore();
    const router = useRouter();
    const $q = useQuasar();

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

    onMounted(() => {
      getCode();
    });

    const getCode = () => {
      captchaLoading.value = true;

      api
        .get("/member/verificationEasyCode")
        .then((res) => {
          const response = res.data;
          if (response.code === 0) {
            verificationImg.value = "data:image/png;base64," + response.data.img;
            loginForm.codeId = response.data.id;
            loginForm.captchaCode = '';
          }

          captchaLoading.value = false;
        })
        .catch((e) => {
          captchaLoading.value = false;
          $q.notify({
            color: "negative",
            position: "top",
            message: res.data.message,
            icon: "report_problem"
          });
        }).finally(() => {
          captchaLoading.value = false;
        });
    };

    const verificationImg = ref("");


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
              $q.notify({
                color: "positive",
                position: "top",
                message: "성공적으로 로그인하세요",
                icon: "check_circle_outline"
              });

              router.push("/");

              setTimeout(() => {
                // location.reload();
              }, 1000);
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

    return {
      loginForm,
      loginNameRef,
      pwdRef,
      captchaRef,
      verificationImg,
      getCode,
      onSubmit,
      isPwd: ref(true),
      isLoading,
      captchaLoading
    };
  }
});
</script>

<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
  row-gap: 24px;

  :deep(.q-field--filled.q-field--dark .q-field__control),
  :deep(.q-field--filled.q-field--dark .q-field__control:before) {
    width: 100%;
    font-size: 14px;
    border: 1px solid #48b5b5;
    line-height: 40px;
    color: #fff;
    background: #252e43;
    border-radius: 8px;
  }

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

  .action-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin: 10px auto 20px;

    .login-submit-btn,
    .login-register-btn {
      width: 200px;
      height: 36px;
    }
  }
}
</style>
