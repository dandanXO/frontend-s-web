<template>
  <div class="page-header">
    <div class="page">{{ header }}</div>
  </div>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <div class="white q-px-md">
        Get by email account
      </div>
      <q-card>
            <q-form v-if="!isEmailSent" class="q-gutter-y-md rounded-borders q-pa-md bg-primary q-ma-md">
              <q-input
                ref="loginNameRef"
                filled
                v-model="passwordForm.loginName"
                label="Login Name"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Enter login name'
                ]"
                color="white"
              >
                <template v-slot:prepend>
                  <q-icon name="person_outline" />
                </template>
              </q-input>
              <q-input
                ref="emailRef"
                type="email"
                filled
                v-model="passwordForm.email"
                label="Email"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Enter email address',
                  isValidEmail
                ]"
                color="white"
              >
                <template v-slot:prepend>
                  <q-icon name="mail_outline" />
                </template>
              </q-input>
              <q-input
                ref="ftCaptchaRef"
                filled
                type="text"
                v-model="passwordForm.captchaCode"
                label="Captcha Code"
                lazy-rules
                color="white"
                :rules="[
                  (val) =>
                    (val && val.length > 3) ||
                    'Enter captcha code'
                ]"
              >
                <template v-slot:append>
                  <img :src="verificationImg" @click="getCode()" />
                </template>
                <template v-slot:prepend>
                  <q-icon name="security" />
                </template>
              </q-input>

              <div class="row justify-between items-center">
                <q-btn
                  @click.prevent="onSubmitForgotPwd"
                  label="Submit"
                  type="submit"
                  color="brand"
                />
              </div>
            </q-form>
            
            <q-form v-if="isEmailSent" class="q-gutter-y-md rounded-borders q-pa-md bg-primary q-ma-md">
              <p>OTP has been sent to your email, please enter OTP and new password.</p>
              <q-input
                ref="codeRef"
                filled
                v-model="verificationForm.code" label="OTP code"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Enter OTP'
                ]"
                color="white"
              >
                <template v-slot:prepend>
                  <q-icon name="qr_code" />
                </template>
              </q-input>
              <q-input
                ref="newPwdRef"
                type="password"
                filled
                v-model="verificationForm.newPassword"
                label="New password"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Enter new password'
                ]"
                color="white"
              >
                <template v-slot:prepend>
                  <q-icon name="lock_open" />
                </template>
              </q-input>
              <q-input
                ref="captchaRef"
                filled
                type="text"
                v-model="verificationForm.captchaCode"
                label="Captcha Code"
                lazy-rules
                color="white"
                :rules="[
                  (val) =>
                    (val && val.length > 3) ||
                    'Enter captcha code'
                ]"
              >
                <template v-slot:append>
                  <img :src="verificationImg" @click="getCode()" />
                </template>
                <template v-slot:prepend>
                  <q-icon name="security" />
                </template>
              </q-input>

              <div class="row justify-between items-center">
                <q-btn
                  @click.prevent="onVerifyForgotPassword"
                  label="Submit"
                  type="submit"
                  color="brand"
                />
              </div>
            </q-form>
      </q-card>
    </div>
  </div>

  <div class="text-center q-mb-md">
    <router-link class="forget-pwd-tip" to="/login">
      Have an account? Login Now
    </router-link>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { SessionStorage } from "quasar";
export default defineComponent({
  name: "LoginPage",
  setup() {
    onMounted(() => {
      getCode();
    });
    const verificationImg = ref("");
    const passwordForm = reactive({
      loginName: "",
      email: "",
      captchaCode: ""
    });
    const verificationForm = reactive({
      email: "",
      code: "", 
      codeId: SessionStorage.getItem('emailCodeId'), 
      newPassword: "",
    });
    const activeTab = ref("phone");
    const getCode = () => {
      api
        .get("/member/verificationCode")
        .then((res) => {
          const response = res.data;
          if (response.code === 0) {
            verificationImg.value =
              "data:image/png;base64," + response.data.img;
            passwordForm.codeId = response.data.id;
          }
        })
        .catch((e) => {
          // $q.notify({
          //   color: "negative",
          //   position: "top",
          //   message: e.message,
          //   icon: "report_problem"
          // });
        });
    };
    const loginNameRef = ref();
    const emailRef = ref();
    const ftCaptchaRef = ref();
    const codeRef = ref();
    const newPwdRef = ref();
    const captchaRef = ref();
    const $q = useQuasar();
    const isValidEmail = () => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(passwordForm.email) || "Invalid email";
    };
    var qs = require("qs");
    const route = useRoute();
    const router = useRouter();
    const isEmailSent = ref(false)
    const isEmailSending = ref(false)
    const onSubmitForgotPwd = () => {
      loginNameRef.value.validate();
      emailRef.value.validate();
      ftCaptchaRef.value.validate();
      $q.loading.show({
        message: "Registering"
      });
      if (
        loginNameRef.value.hasError ||
        emailRef.value.hasError ||
        ftCaptchaRef.value.hasError
      ) {
        $q.loading.hide();
      } else {
          api
            .post("/otp/sendForgetPasswordEmail", qs.stringify(passwordForm))
            .then((ret) => {
              const res = ret.data;
              if (res.code === 0) {
                isEmailSent.value = true
                SessionStorage.set("emailCodeId", res.data.codeId);
              } else {
                // $q.notify({
                //   color: "negative",
                //   position: "top",
                //   message: res.message,
                //   icon: "report_problem"
                // });
              }
              $q.loading.hide();
            })
            .catch((error) => {
              $q.loading.hide();
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: error.message,
              //   icon: "report_problem"
              // });
            });
        getCode();
      }
    };
    const onVerifyForgotPassword = () => {
      codeRef.value.validate();
      newPwdRef.value.validate();
      captchaRef.value.validate();
      $q.loading.show({
        message: "Verifying"
      });
      if (
        codeRef.value.hasError ||
        newPwdRef.value.hasError ||
        captchaRef.value.hasError
      ) {
        $q.loading.hide();
      } else {
          verificationForm.codeId = SessionStorage.getItem('emailCodeId')
          verificationForm.email = passwordForm.email
          api
            .post("/otp/verifyForgetPasswordEmail", qs.stringify(verificationForm))
            .then((ret) => {
              const res = ret.data;
              if (res.code === 0) {
                
                // $q.notify({
                //   color: "positive",
                //   position: "top",
                //   message: "Success",
                //   icon: "check_circle_outline"
                // });
                router.push("/login")
              } else {
                // $q.notify({
                //   color: "negative",
                //   position: "top",
                //   message: res.message,
                //   icon: "report_problem"
                // });
              }
              $q.loading.hide();
            })
            .catch((error) => {
              $q.loading.hide();
              // $q.notify({
              //   color: "negative",
              //   position: "top",
              //   message: error.message,
              //   icon: "report_problem"
              // });
            });
        getCode();
      }
    };
    return {
      header: "Forgot Account & Password",
      passwordForm,
      verificationForm,
      verificationImg,
      activeTab,
      getCode,
      isValidEmail,
      isEmailSent,
      onSubmitForgotPwd,
      onVerifyForgotPassword,
      loginNameRef,
      emailRef,
      ftCaptchaRef,
      codeRef,
      newPwdRef,
      captchaRef
    };
  }
});
</script>
