<template>
  <div class="main-section">
    <q-form class="login-window-form" @submit="onSubmit">
      <div>
        <label>계정</label>
        <q-input
          ref="loginNameRef"
          filled
          color="white"
          clearable
          v-model="loginForm.loginName"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || $t('lang.input_username_cannot_empty'),
            (val) => (val.length > 5 && val.length <= 12) || $t('lang.username_between_6_12'),
            (val) => val.match(/^[A-Za-z0-9]+$/) || $t('lang.only_letter_number_allowed')
          ]"
        ></q-input>
      </div>
      <div>
        <label>암호</label>
        <q-input
          ref="pwdRef"
          filled
          color="white"
          clearable
          v-model="loginForm.password"
          type="password"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || $t('lang.input_password_empty'),
            (val) => (val.length > 5 && val.length <= 12) || $t('lang.password_between_6_12')
          ]"
        ></q-input>
      </div>
      <div>
        <label>암호</label>
        <div class="captcha-code">
          <q-input
            ref="captchaRef"
            filled
            color="white"
            clearable
            class="captcha-code-input"
            v-model="loginForm.captchaCode"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('lang.enter_captcha_code')]"
          ></q-input>
          <img class="captcha-img" :src="verificationImg" @click.prevent="getCode" />
        </div>
      </div>
      <div class="btn" style="margin-top: 35px">
        <q-btn :label="'등록'" type="button" class="common-large-btn form-button blue" rounded />
        <q-btn
          @click.prevent="onSubmit"
          :label="'로그인'"
          type="button"
          class="common-large-btn form-button yellow"
          rounded
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { api } from "boot/axios";
import { useQuasar, Platform, SessionStorage } from "quasar";
import { userStore } from "stores/index";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUI } from "stores/ui";
import vueI18n from "src/i18n";

export default defineComponent({
  name: "LoginPage",
  emits: ["closeModal"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const store = userStore();
    const router = useRouter();
    const siteId = process.env.SITEID;
    const qs = require("qs");

    const loginNameRef = ref();
    const pwdRef = ref();
    const captchaRef = ref();

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

    const verificationImg = ref("");

    const $q = useQuasar();
    const ui = useUI();
    const onSubmit = () => {
      (async () => {
        loginNameRef.value.validate();
        pwdRef.value.validate();
        captchaRef.value.validate();

        if (loginNameRef.value.hasError || pwdRef.value.hasError || captchaRef.value.hasError) {
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
              $q.notify({
                color: "positive",
                position: "top",
                message: "성공적으로 로그인하세요",
                icon: "check_circle_outline"
              });

              setTimeout(() => {
                router.push("/");
                location.reload();
              }, 1000);
            })
            .catch((error) => {
              console.log(error);
              getCode();
            });
        }
      })();
    };

    return {
      loginForm,
      verificationImg,
      getCode,
      onSubmit,
      loginNameRef,
      pwdRef,
      captchaRef
    };
  }
});

// function charType(num) {
//   if (num >= 48 && num <= 57) {
//     return 1;
//   }
//   if (num >= 97 && num <= 122) {
//     return 2;
//   }
//   if (num >= 65 && num <= 90) {
//     return 4;
//   }
//   return 8;
// }
</script>
<style lang="scss">
.login-window-form,
.register-form-captcha-dialog {
  .q-field--filled.q-field--dark .q-field__control,
  .q-field--filled.q-field--dark .q-field__control:before {
    width: 100%;
    font-size: 14px;
    border-radius: 3px;
    border: 1px solid #5c5c5c;
    line-height: 40px;
    color: #fff;
  }
}

.login-window-form {
  display: flex;
  flex-direction: column;
  row-gap: 24px;
}
</style>
<style lang="scss" scoped>
.form-button {
  //display: inline-block;
  height: 70px;
  width: 200px;
  background-size: contain;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 18px;
  padding-bottom: 5px;
  margin: auto 10px;

  &.blue {
    background: url("../../assets/images/pages-modal/btn2-blue.svg") no-repeat center center;
  }

  &.yellow {
    background: url("../../assets/images/pages-modal/btn2-yellow.svg") no-repeat center center;
  }
}

.captcha-img {
  height: 56px;
}

h5 {
  font-size: 20px;
  margin-bottom: 12px;
  text-align: center;
}

.captcha-code {
  width: 100%;
  display: flex;
}

.captcha-code-input {
  margin-right: 16px;
}
</style>
