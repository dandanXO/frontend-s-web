<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <div class="text-blue-grey">
        Please Provide Your Username And Email Address, And We Will Send A New Password To Your Registered Email
        Address.
      </div>
      <q-form v-if="!isEmailSent" class="q-gutter-y-md rounded-borders">
        <q-input
          ref="loginNameRef"
          filled
          hide-bottom-space
          v-model="passwordForm.loginName"
          label="Username"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please Enter Username']"
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
          hide-bottom-space
          v-model="passwordForm.email"
          label="Email Address"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please Enter Email Address', isValidEmail]"
          color="white"
        >
          <template v-slot:prepend>
            <q-icon name="mail_outline" />
          </template>
        </q-input>

        <q-input
          ref="ftCaptchaRef"
          filled
          hide-bottom-space
          type="text"
          v-model="passwordForm.captchaCode"
          label="Verification Code"
          lazy-rules
          color="white"
          :rules="[(val) => (val && val.length > 3) || 'Please Enter Verification Code']"
        >
          <template v-slot:append>
            <img :src="verificationImg" @click="getCode()" />
          </template>
          <template v-slot:prepend>
            <q-icon name="security" />
          </template>
        </q-input>

        <div class="row justify-between items-center">
          <q-btn @click.prevent="onSubmitForgotPwd" label="Submit" width="100%" color="brightbtn" style="width: 100%" />
        </div>
      </q-form>

      <q-form v-if="isEmailSent" class="q-gutter-y-md rounded-borders">
        <p>OTP Has Been Sent To Your Email, Please Enter The OTP And New Password.</p>
        <q-input
          ref="codeRef"
          filled
          hide-bottom-space
          v-model="verificationForm.code"
          label="OTP"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please Enter OTP']"
          color="white"
        >
          <template v-slot:prepend>
            <q-icon name="qr_code" />
          </template>
        </q-input>
        <q-input
          ref="newPwdRef"
          :type="isPwd ? 'password' : 'text'"
          filled
          hide-bottom-space
          v-model="verificationForm.newPassword"
          label="New Password"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Please Enter New Password',
            (val) => (val.length > 5 && val.length <= 12) || 'Password Must Be 6 To 12 Character',
            (val) => (val && (pwdStrength == 'normal' || pwdStrength == 'strong')) || 'Stronger Password Is Recommended'
          ]"
          color="white"
        >
          <template v-slot:prepend>
            <q-icon name="lock_open" />
          </template>
          <template v-slot:append>
            <q-icon
              color="bright"
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <div v-if="verificationForm.newPassword" class="password-str-div">
          <span
            :class="{
              'weak-pwd': pwdStrength == 'weak',
              'normal-pwd': pwdStrength == 'normal',
              'strong-pwd': pwdStrength == 'strong'
            }"
          >
            Weak
          </span>
          <span
            :class="{
              'normal-pwd': pwdStrength == 'normal',
              'strong-pwd': pwdStrength == 'strong'
            }"
          >
            Normal
          </span>
          <span :class="{ 'strong-pwd': pwdStrength == 'strong' }">Strong</span>
        </div>
        <q-input
          ref="captchaRef"
          filled
          hide-bottom-space
          type="text"
          v-model="verificationForm.captchaCode"
          label="Verification Code"
          lazy-rules
          color="white"
          :rules="[(val) => (val && val.length > 3) || 'Please Enter Verification Code']"
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
            width="100%"
            color="brightbtn"
            style="width: 100%"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
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
      codeId: SessionStorage.getItem("emailCodeId"),
      newPassword: ""
    });
    const activeTab = ref("phone");
    const getCode = () => {
      api
        .get("/member/verificationCode")
        .then((response) => {
          if (response.code === 0) {
            verificationImg.value = "data:image/png;base64," + response.data.img;
            passwordForm.codeId = response.data.id;
            passwordForm.captchaCode = "";
            ftCaptchaRef.value.resetValidation();
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
    const pwdStrength = ref("");
    const isValidEmail = () => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(passwordForm.email) || "Please Enter A Valid Email Address";
    };
    var qs = require("qs");
    const route = useRoute();
    const router = useRouter();
    const isEmailSent = ref(false);
    const isEmailSending = ref(false);
    const onSubmitForgotPwd = () => {
      loginNameRef.value.validate();
      emailRef.value.validate();
      ftCaptchaRef.value.validate();
      $q.loading.show({
        message: "Sending verification code..."
      });
      if (loginNameRef.value.hasError || emailRef.value.hasError || ftCaptchaRef.value.hasError) {
        $q.loading.hide();
      } else {
        api
          .post("/otp/sendForgetPasswordEmail", qs.stringify(passwordForm))
          .then((response) => {
            if (response.code === 0) {
              isEmailSent.value = true;
              SessionStorage.set("emailCodeId", response.data.codeId);
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
        message: "Submitting..."
      });
      if (codeRef.value.hasError || newPwdRef.value.hasError || captchaRef.value.hasError) {
        $q.loading.hide();
      } else {
        verificationForm.codeId = SessionStorage.getItem("emailCodeId");
        verificationForm.email = passwordForm.email;
        api
          .post("/otp/verifyForgetPasswordEmail", qs.stringify(verificationForm))
          .then((response) => {
            if (response.code === 0) {
              $q.notify({
                color: "positive",
                position: "top",
                message: "Password Reset Completed",
                icon: "report_problem"
              });

              router.push("/login");
            } else {
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

    watch(
      () => verificationForm.newPassword,
      () => {
        pwdStrength.value = "";

        var pwd = verificationForm.newPassword;
        var result = 0;
        for (var i = 0, len = pwd.length; i < len; ++i) {
          result |= charType(pwd.charCodeAt(i));
        }

        var level = 0;
        for (var i = 0; i <= 4; i++) {
          if (result & 1) {
            level++;
          }
          result = result >>> 1;
        }
        if (pwd.length >= 6) {
          switch (level) {
            case 1:
              pwdStrength.value = "weak";
              break;
            case 2:
              pwdStrength.value = "normal";
              break;
            case 3:
            case 4:
              pwdStrength.value = "strong";
              break;
          }
        } else {
          pwdStrength.value = "weak";
        }
      }
    );
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
      captchaRef,
      isPwd: ref(true),
      pwdStrength
    };
  }
});

function charType(num) {
  if (num >= 48 && num <= 57) {
    return 1;
  }
  if (num >= 97 && num <= 122) {
    return 2;
  }
  if (num >= 65 && num <= 90) {
    return 4;
  }
  return 8;
}
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

.verification {
  display: flex;
  padding: 10px;
}

.space-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.password-str-div {
  display: flex;
  align-items: center;
  margin-top: 3px;
  margin-bottom: 5px;
  justify-content: space-evenly;
  gap: 5px;
  height: 50px;

  span {
    padding: 8px 3px;
    //border: 1px solid #fff;
    border-radius: 5px;
    background: #434343;
    width: 33%;
    text-align: center;
    font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  span.weak-pwd {
    background: var(--q-negative);
  }

  span.normal-pwd {
    background: var(--q-warning);
    color: var(--q-primary);
  }

  span.strong-pwd {
    //background: linear-gradient(to right, #de4545, #db7e42) !important;
    background: var(--q-positive);
    font-weight: 600;
  }
}
</style>
