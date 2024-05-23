<template>
  <div class="main-section">
    <q-form class="login-form" @keypress.enter="onSubmit">
      <div>
        <q-input ref="loginNameRef" :label="$t('lang.login_account')" filled clearable v-model="loginForm.loginName"
          lazy-rules :rules="[
            (val) => (val && val.length > 0) || $t('lang.input_username_cannot_empty'),
            (val) => (val.length > 5 && val.length <= 12) || $t('lang.username_between_6_12'),
            (val) => val.match(/^[A-Za-z0-9]+$/) || $t('lang.only_letter_number_allowed')
          ]" />
      </div>
      <div>
        <q-input ref="pwdRef" :label="$t('lang.login_password')" filled clearable v-model="loginForm.password"
        :type="isPwd ? 'password' : 'text'"
        lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || $t('lang.input_password_empty'),
            (val) => (val.length > 5 && val.length <= 12) || $t('lang.password_between_6_12')
          ]">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
          </template>
          </q-input>
      </div>
      <div>
        <div class="captcha-code">
          <q-input ref="captchaRef" :label="$t('lang.login_captcha')" filled clearable class="captcha-code-input"
            v-model="loginForm.captchaCode" lazy-rules
            :rules="[(val) => (val && val.length > 0) || $t('lang.enter_captcha_code')]" />
          <img class="captcha-img" height="56px" :src="verificationImg" @click.prevent="getCode" />
        </div>
      </div>
      <div class="action-buttons">
        <q-btn @click.prevent="onSubmit" :label="'로그인'" type="button" class="common-large-btn form-button yellow"
          rounded flat />
        <router-link to="/?page=register">
          <q-btn :label="'등록'" type="button" class="common-large-btn form-button blue" rounded
            flat />
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
  setup(props, { emit }) {
    const store = userStore();
    const router = useRouter();
    const $q = useQuasar();
    
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
      loginNameRef,
      pwdRef,
      captchaRef,
      verificationImg,
      getCode,
      onSubmit,
      isPwd: ref(true),
    };
  }
});
</script>

<style lang="scss">
.login-form {
  .q-field--filled.q-field--dark .q-field__control,
  .q-field--filled.q-field--dark .q-field__control:before {
    width: 100%;
    font-size: 14px;
    border: 1px solid #48b5b5;
    line-height: 40px;
    color: #fff;
    background: #252e43;
    border-radius: 8px;
  }
}
</style>

<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  margin-top: 24px;

  .form-button {
    height: 70px;
    width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 18px;
    padding-bottom: 5px;
    margin: auto 10px;

    &.blue {
      background: url("../../assets/home/btn-blue.svg") no-repeat center center;
      background-size: 100% 100%;
    }

    &.yellow {
      background: url("../../assets/home/btn-orange.svg") no-repeat center center;
      background-size: 100% 100%;
    }
  }

  .captcha-code {
    width: 100%;
    display: flex;
  }

  .captcha-code-input {
    margin-right: 16px;
    width: 100%;
  }

  .action-buttons {
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
  }
}
</style>
