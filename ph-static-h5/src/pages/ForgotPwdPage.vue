<template>
  <div class="page-header">
    <!-- <div class="page">{{ header }}</div> -->
  </div>
  <div class="q-pa-md forgot-pw-page-form">
    <div class="q-gutter-y-md">
      <div class="white q-px-md"><span class="info-text">Get by mobile number</span></div>
      <div>
        <q-form
          v-if="!isPhoneSent"
          class="rounded-borders q-ma-md flex column q-gutter-y-md"
          ref="passwordPhoneFormRef"
        >
          <label class="field-label">Login Name</label>
          <q-input
            rounded
            outlined
            v-model="passwordForm.loginName"
            label="Login Name"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Enter login name']"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="person_outline" />
            </template>
          </q-input>

          <label class="field-label">Mobile Number</label>
          <q-input
            type="text"
            rounded
            outlined
            v-model="passwordForm.phone"
            label="mobile number"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Enter mobile number', isValidPhone]"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="smartphone" />
            </template>
          </q-input>

          <label class="field-label">Captcha Code</label>
          <q-input
            rounded
            outlined
            type="text"
            v-model="passwordForm.captchaCode"
            label="Captcha Code"
            lazy-rules
            color="white"
            :rules="[(val) => (val && val.length > 3) || 'Enter captcha code']"
          >
            <template v-slot:append>
              <img :src="verificationImg" @click="getCode()" class="cursor-pointer" />
            </template>
            <template v-slot:prepend>
              <q-icon name="security" />
            </template>
          </q-input>

          <q-btn class="submit-btn" @click.prevent="onSubmitForgotPwd" label="Submit" type="submit" />
        </q-form>

        <q-form
          v-if="isPhoneSent"
          class="rounded-borders q-ma-md flex column q-gutter-y-md"
          ref="passwordPhoneVerifyFormRef"
        >
          <p class="info-text highlighted-text">
            OTP has been sent to your mobile number, please enter OTP and new password.
          </p>
          <q-input
            rounded
            outlined
            v-model="verificationForm.code"
            label="OTP code"
            lazy-rules
            color="white"
            autocomplete="off"
            :rules="[(val) => (val && val.length > 0) || 'Enter OTP']"
          >
            <template v-slot:prepend>
              <q-icon name="qr_code" />
            </template>
          </q-input>
          <q-input
            type="password"
            rounded
            outlined
            v-model="verificationForm.newPassword"
            label="New password"
            lazy-rules
            color="white"
            autocomplete="new-password"
            :rules="[(val) => (val && val.length > 0) || 'Enter new password']"
          >
            <template v-slot:prepend>
              <q-icon name="lock_open" />
            </template>
          </q-input>

          <q-btn class="submit-btn" @click.prevent="onVerifyForgotPassword" label="Submit" type="submit" />
        </q-form>
        <!-- <q-form
          v-if="!isEmailSent"
          class="rounded-borders q-ma-md flex column q-gutter-y-md"
        >
          <label class="field-label">Login Name</label>
          <q-input
            ref="loginNameRef"
            rounded outlined
            v-model="passwordForm.loginName"
            label="Login Name"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Enter login name']"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="person_outline" />
            </template>
          </q-input>

          <label class="field-label">Email</label>
          <q-input
            ref="emailRef"
            type="email"
            rounded outlined
            v-model="passwordForm.email"
            label="Email"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Enter email address',
              isValidEmail,
            ]"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="mail_outline" />
            </template>
          </q-input>

          <label class="field-label">Captcha Code</label>
          <q-input
            ref="ftCaptchaRef"
            rounded outlined
            type="text"
            v-model="passwordForm.captchaCode"
            label="Captcha Code"
            lazy-rules
            color="white"
            :rules="[(val) => (val && val.length > 3) || 'Enter captcha code']"
          >
            <template v-slot:append>
              <img
                :src="verificationImg"
                @click="getCode()"
                class="cursor-pointer"
              />
            </template>
            <template v-slot:prepend>
              <q-icon name="security" />
            </template>
          </q-input>

          <q-btn
            class="submit-btn"
            @click.prevent="onSubmitForgotPwd"
            label="Submit"
            type="submit"
          />
        </q-form>

        <q-form
          v-if="isEmailSent"
          class="rounded-borders q-ma-md flex column q-gutter-y-md"
        >
          <p class="info-text highlighted-text">
            OTP has been sent to your email, please enter OTP and new password.
          </p>
          <q-input
            ref="codeRef"
            rounded outlined
            v-model="verificationForm.code"
            label="OTP code"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Enter OTP']"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="qr_code" />
            </template>
          </q-input>
          <q-input
            ref="newPwdRef"
            type="password"
            rounded outlined
            v-model="verificationForm.newPassword"
            label="New password"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Enter new password']"
            color="white"
          >
            <template v-slot:prepend>
              <q-icon name="lock_open" />
            </template>
          </q-input>

          <q-btn
            class="submit-btn"
            @click.prevent="onVerifyForgotPassword"
            label="Submit"
            type="submit"
          />
        </q-form> -->
      </div>
    </div>

    <div class="text-center q-mb-md">
      <router-link to="/login">
        <span class="info-text">Have an account?</span>
        &nbsp;
        <span class="highlighted-text">Login Now</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";

import { getCodeDetail } from "src/utils/helper";

export default defineComponent({
  name: "LoginPage",
  setup() {
    onMounted(() => {
      getCode();
    });
    const verificationImg = ref("");
    const passwordForm = reactive({
      loginName: "",
      // email: "",
      codeId: "",
      captchaCode: "",
      phone: ""
    });
    const verificationForm = reactive({
      email: "",
      phone: "",
      code: "",
      codeId: sessionStorage.getItem("codeId"),
      newPassword: ""
    });
    const activeTab = ref("phone");

    const getCode = async () => {
      const json = await getCodeDetail();

      if (json.isOk) {
        passwordForm.codeId = json.codeId;
        verificationImg.value = json.verificationImg;
      } else {
        $q.notify({
          color: "negative",
          position: "top",
          message: json.message,
          icon: "report_problem"
        });
      }
    };

    const loginNameRef = ref();
    const emailRef = ref();
    const ftCaptchaRef = ref();
    const codeRef = ref();
    const newPwdRef = ref();
    const captchaRef = ref();
    const passwordPhoneFormRef = ref();
    const passwordPhoneVerifyFormRef = ref();
    const $q = useQuasar();

    const isValidEmail = () => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(passwordForm.email) || "Invalid email";
    };
    const isValidPhone = (val) => {
      const phonePattern = /^\d+$/;
      return phonePattern.test(val) || "Invalid mobile number";
    };
    var qs = require("qs");
    const route = useRoute();
    const router = useRouter();
    const isEmailSent = ref(false);
    const isEmailSending = ref(false);
    const isPhoneSent = ref(false);
    const onSubmitForgotPwd = () => {
      passwordPhoneFormRef.value.validate().then((isValid) => {
        if (!isValid) return;

        $q.loading.show({ message: "Sending OTP..." });
        api
          .post("/otp/sendForgetPasswordPhone", qs.stringify(passwordForm))
          .then((res) => {
            if (res.code === 0) {
              isPhoneSent.value = true;
              sessionStorage.setItem("codeId", res.data.codeId);
            }
            $q.notify({
              color: "positive",
              position: "top",
              message: "Please input new password",
              icon: "check_circle_outline"
            });
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            $q.loading.hide();
            getCode();
          });
      });

      // loginNameRef.value.validate();
      // emailRef.value.validate();
      // ftCaptchaRef.value.validate();
      // $q.loading.show({
      //   message: "Registering"
      // });
      // if (loginNameRef.value.hasError || emailRef.value.hasError || ftCaptchaRef.value.hasError) {
      //   $q.loading.hide();
      // } else {
      //   api
      //     .post("/otp/sendForgetPasswordEmail", qs.stringify(passwordForm))
      //     .then((res) => {
      //       if (res.code === 0) {
      //         isEmailSent.value = true;
      //         sessionStorage.setItem("codeId", res.data.codeId);
      //       } else {
      //         // $q.notify({
      //         //   color: "negative",
      //         //   position: "top",
      //         //   message: res.message,
      //         //   icon: "report_problem"
      //         // });
      //       }
      //       $q.loading.hide();
      //     })
      //     .catch((error) => {
      //       $q.loading.hide();
      //       // $q.notify({
      //       //   color: "negative",
      //       //   position: "top",
      //       //   message: error.message,
      //       //   icon: "report_problem"
      //       // });
      //     });
      //   getCode();
      // }
    };
    const onVerifyForgotPassword = () => {
      passwordPhoneVerifyFormRef.value.validate().then((isValid) => {
        if (!isValid) return;

        $q.loading.show({ message: "Submitting..." });
        verificationForm.phone = passwordForm.phone;
        verificationForm.codeId = sessionStorage.getItem("codeId");
        const params = {
          phone: verificationForm.phone,
          code: verificationForm.code,
          codeId: verificationForm.codeId,
          newPassword: verificationForm.newPassword
        };

        api
          .post("/otp/verifyForgetPasswordPhone", qs.stringify(params))
          .then((res) => {
            if (res.code === 0) {
              $q.notify({
                color: "positive",
                position: "top",
                message: "Modify password success",
                icon: "check_circle_outline"
              });
              router.push("/login");
            }
          })
          .catch((error) => {
            console.log(error);
            getCode();
          })
          .finally(() => {
            $q.loading.hide();
          });
      });

      // codeRef.value.validate();
      // newPwdRef.value.validate();
      // captchaRef.value.validate();
      // $q.loading.show({
      //   message: "Verifying"
      // });
      // if (codeRef.value.hasError || newPwdRef.value.hasError || captchaRef.value.hasError) {
      //   $q.loading.hide();
      // } else {
      //   verificationForm.codeId = sessionStorage.getItem("codeId");
      //   verificationForm.email = passwordForm.email;
      //   api
      //     .post("/otp/verifyForgetPasswordEmail", qs.stringify(verificationForm))
      //     .then((res) => {
      //       if (res.code === 0) {
      //         // $q.notify({
      //         //   color: "positive",
      //         //   position: "top",
      //         //   message: "Success",
      //         //   icon: "check_circle_outline"
      //         // });
      //         router.push("/login");
      //       } else {
      //         // $q.notify({
      //         //   color: "negative",
      //         //   position: "top",
      //         //   message: res.message,
      //         //   icon: "report_problem"
      //         // });
      //       }
      //       $q.loading.hide();
      //     })
      //     .catch((error) => {
      //       $q.loading.hide();
      //       // $q.notify({
      //       //   color: "negative",
      //       //   position: "top",
      //       //   message: error.message,
      //       //   icon: "report_problem"
      //       // });
      //     });
      //   getCode();
      // }
    };
    return {
      header: "Forgot Account & Password",
      passwordForm,
      verificationForm,
      verificationImg,
      activeTab,
      getCode,
      isValidEmail,
      isValidPhone,
      isEmailSent,
      onSubmitForgotPwd,
      onVerifyForgotPassword,
      loginNameRef,
      emailRef,
      ftCaptchaRef,
      codeRef,
      newPwdRef,
      captchaRef,
      passwordPhoneFormRef,
      passwordPhoneVerifyFormRef,
      isPhoneSent
    };
  }
});
</script>
